import React, { useState, useEffect, useCallback } from 'react';
import { doc, updateDoc, deleteDoc, onSnapshot, collection, addDoc, serverTimestamp } from 'firebase/firestore'; 

// Import Firebase services from your firebase.js config
import { db, auth, initAuthAndGetUserId } from './firebase/firebase';

// --- Component Imports ---
import { TaskList } from './components/TaskList';
import { TaskItem } from './components/TaskItem';
import { MusicIntegration } from './components/MusicIntegration'; 
import { TaskGenerator } from './components/TaskGenerator';
import { TaskSchedule } from './components/TaskSchedule'; 
import { PomodoroTimer } from './components/PomodoroTimer';


// --- Icon Imports ---
import { Clock, CheckCircle, Circle, Calendar, List, Play, Pause, Zap, Music, BarChart, X, Save, Plus, Aperture, Loader2, Import } from 'lucide-react';
import { Modal } from './components/Modal';

// =================================================================
// 1. GLOBAL VARIABLES & CONFIGURATION
// =================================================================

// Get global environment variables (for Canvas compatibility)
const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
const initialAuthToken = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null;

// Backend URL configuration
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

const COLLECTION_NAME = 'tasks';

/** Utility to get Firestore Collection Reference */
const getTaskCollectionRef = (appId, userId) => {
    return collection(db, 'artifacts', appId, 'users', userId, COLLECTION_NAME);
};

/** Real-time data listener with sorting */
const getTasksSnapshot = (appId, userId, callback) => {
    if (!appId || !userId) return () => {};
    const q = getTaskCollectionRef(appId, userId);
    const unsubscribe = onSnapshot(q, (snapshot) => {
        const tasksData = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        }));
        
        const sortedTasks = tasksData.sort((a, b) => {
            if (a.completed !== b.completed) return a.completed ? 1 : -1;
            
            const dateA = a.dueDate ? new Date(a.dueDate) : null;
            const dateB = b.dueDate ? new Date(b.dueDate) : null;

            const timeA = dateA && !isNaN(dateA) ? dateA.getTime() : null;
            const timeB = dateB && !isNaN(dateB) ? dateB.getTime() : null;

            if (timeA && timeB) return timeA - timeB;
            if (timeA) return -1;
            if (timeB) return 1;
            
            const createdAtA = a.createdAt?.toDate() || new Date(0);
            const createdAtB = b.createdAt?.toDate() || new Date(0);
            return createdAtB.getTime() - createdAtA.getTime();
        });
        callback(sortedTasks);
    }, (error) => {
        console.error("Error fetching tasks snapshot:", error);
    });
    return unsubscribe;
};

/** CRUD: Adds a new task */
const addTask = async (appId, userId, title, date) => {
    if (!appId || !userId || !title) return;
    const dueDate = date && date.trim() !== "" ? date : null;
    try {
        await addDoc(getTaskCollectionRef(appId, userId), {
            title,
            dueDate: dueDate,
            completed: false,
            createdAt: serverTimestamp(),
            pomodoros: 0,
        });
    } catch (e) { console.error("Error adding document: ", e); }
};

/** CRUD: Toggles task completion status */
const toggleTask = async (appId, userId, taskId, currentStatus) => {
    if (!appId || !userId || !taskId) return;
    try {
        const taskRef = doc(getTaskCollectionRef(appId, userId), taskId);
        await updateDoc(taskRef, { completed: !currentStatus });
    } catch (e) { console.error("Error toggling task: ", e); }
};

/** CRUD: Updates task details */
const updateTaskTitle = async (appId, userId, taskId, newTitle, newDate) => {
    if (!appId || !userId || !taskId || !newTitle) return;
    const dueDate = newDate && newDate.trim() !== "" ? newDate : null;
    try {
        const taskRef = doc(getTaskCollectionRef(appId, userId), taskId);
        await updateDoc(taskRef, { title: newTitle, dueDate: dueDate });
    } catch (e) { console.error("Error updating task: ", e); }
};

/** CRUD: Deletes a task */
const deleteTask = async (appId, userId, taskId) => {
    if (!appId || !userId || !taskId) return;
    try {
        const taskRef = doc(getTaskCollectionRef(appId, userId), taskId);
        await deleteDoc(taskRef);
    } catch (e) { console.error("Error deleting task: ", e); }
};

/** Pomodoro: Updates the task's pomodoro count */
const updatePomodoroCount = async (appId, userId, taskId, newCount) => {
    if (!appId || !userId || !taskId) return;
    try {
        const taskRef = doc(getTaskCollectionRef(appId, userId), taskId);
        await updateDoc(taskRef, { pomodoros: newCount });
    } catch (e) { console.error("Error updating pomodoro count: ", e); }
};

// =================================================================
// 2. BACKEND API UTILITIES
// =================================================================

/** 
 * Call the backend API to generate tasks using Gemini
 * The backend handles the API key securely
 */
const generateTasksFromBackend = async (prompt) => {
    try {
        const response = await fetch(`${BACKEND_URL}/api/generate-tasks`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ prompt })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        
        // Backend returns { success: true, tasks: [...] }
        if (data.success && data.tasks) {
            return data.tasks;
        } else {
            throw new Error('Invalid response format from backend');
        }
    } catch (error) {
        console.error('Error calling backend API:', error);
        throw error;
    }
};




// =================================================================
// 4. MAIN APP COMPONENT
// =================================================================

const VIEW_MODES = [
    { id: 'tasks', name: 'Task List', icon: List },
    { id: 'schedule', name: 'Schedule', icon: Calendar },
    { id: 'pomodoro', name: 'Timer', icon: Clock },
    { id: 'ambience', name: 'Ambience', icon: Music },
    { id: 'generate', name: 'AI Generator', icon: Aperture },
    { id: 'stats', name: 'Stats', icon: BarChart },
];

const App = () => {
    const [userId, setUserId] = useState(null);
    const [tasks, setTasks] = useState([]);
    const [isAuthReady, setIsAuthReady] = useState(false);

    const [viewMode, setViewMode] = useState('tasks');
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState('add');
    const [editingTask, setEditingTask] = useState(null);

    const [newTaskTitle, setNewTaskTitle] = useState('');
    const [newTaskDate, setNewTaskDate] = useState('');



    useEffect(() => {
        const setupAuth = async () => {
            const id = await initAuthAndGetUserId(initialAuthToken);
            setUserId(id);
            setIsAuthReady(true);
        };
        setupAuth();
    }, []);

    useEffect(() => {
        if (!isAuthReady || !userId) return;
        const unsubscribe = getTasksSnapshot(appId, userId, setTasks);
        return () => unsubscribe();
    }, [isAuthReady, userId]);

    const handleSaveTask = useCallback(async () => {
        if (newTaskTitle.trim() === '') return;

        if (modalType === 'add') {
            await addTask(appId, userId, newTaskTitle.trim(), newTaskDate);
        } else if (modalType === 'edit' && editingTask) {
            await updateTaskTitle(appId, userId, editingTask.id, newTaskTitle.trim(), newTaskDate);
        }

        setNewTaskTitle('');
        setNewTaskDate('');
        setEditingTask(null);
        setShowModal(false);
    }, [modalType, newTaskTitle, newTaskDate, editingTask, userId]);

    const handleToggleTask = useCallback(async (task) => {
        await toggleTask(appId, userId, task.id, task.completed);
    }, [userId]);

    const handleEditTask = useCallback((task) => {
        setEditingTask(task);
        setNewTaskTitle(task.title);
        setNewTaskDate(task.dueDate || ''); 
        setModalType('edit');
        setShowModal(true);
    }, []);

    const handleDeleteTask = useCallback(async (taskId) => {
        await deleteTask(appId, userId, taskId);
    }, [userId]);

    const handleOpenAddModal = useCallback(() => {
        setEditingTask(null);
        setNewTaskTitle('');
        setNewTaskDate('');
        setModalType('add');
        setShowModal(true);
    }, []);




    const handleUpdatePomodoroCount = useCallback((taskId, newCount) => {
        updatePomodoroCount(appId, userId, taskId, newCount);
    }, [userId]);

    const renderMainContent = () => {
        if (!isAuthReady) {
            return (<div className="flex items-center justify-center p-10"><Loader2 className="w-10 h-10 border-4 border-indigo-500 border-dotted rounded-full animate-spin" /></div>);
        }
        
        const taskListProps = { 
            tasks, 
            onToggle: handleToggleTask, 
            onEdit: handleEditTask, 
            onDelete: handleDeleteTask,
            viewMode: 'all', 
            onOpenAddModal: handleOpenAddModal
        };

        switch (viewMode) {
            case 'tasks':
                return <TaskList {...taskListProps} />;
            case 'schedule':
                return <TaskSchedule tasks={tasks} onToggle={handleToggleTask} onEdit={handleEditTask} onDelete={handleDeleteTask} />;
            case 'pomodoro':
                return <PomodoroTimer tasks={tasks} updatePomodoroCount={handleUpdatePomodoroCount} />;
            case 'ambience':
                return <MusicIntegration />;

            case 'generate':
                return <TaskGenerator userId={userId} appId={appId} addTask={addTask} />; 
            case 'stats':
                const completedCount = tasks.filter(t => t.completed).length;
                const totalPomodoros = tasks.reduce((sum, t) => sum + (t.pomodoros || 0), 0);
                return (
                    <div className="p-8 space-y-6">
                        <h1 className="text-3xl font-extrabold text-gray-900 flex items-center"><BarChart size={28} className="mr-3 text-green-600" />Statistics</h1>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <StatCard title="Total Tasks" value={tasks.length} icon={List} color="text-indigo-500" />
                            <StatCard title="Completed" value={completedCount} icon={CheckCircle} color="text-green-500" />
                            <StatCard title="Pomodoros" value={totalPomodoros} icon={Zap} color="text-yellow-500" />
                            <StatCard title="Rate" value={`${tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0}%`} icon={Circle} color="text-red-500" />
                        </div>
                    </div>
                );
            default: return null;
        }
    };
    
    const StatCard = ({ title, value, icon: Icon, color }) => (
        <div className="p-4 bg-white rounded-xl flex items-center space-x-3 border shadow-sm">
            <Icon size={24} className={color} />
            <div>
                <p className="text-xs text-gray-500 font-medium">{title}</p>
                <p className="text-2xl font-bold text-gray-900">{value}</p>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen flex bg-gray-50 font-sans">
            <aside className="w-64 bg-white p-6 flex flex-col border-r shadow-xl shadow-gray-100/50">
                <header className="mb-8">
                    <h1 className="text-2xl font-black text-indigo-700">FocusFlow</h1>
                    <p className="text-sm text-gray-500">Task Management & Focus</p>
                </header>

                <nav className="space-y-2 flex-grow">
                    {VIEW_MODES.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setViewMode(item.id)}
                            className={`w-full flex items-center p-3 rounded-xl transition-all font-medium ${
                                viewMode === item.id ? 'bg-indigo-50 shadow-md text-indigo-700 ring-2 ring-indigo-100' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'
                            }`}
                        >
                            <item.icon size={20} className="mr-3" />
                            {item.name}
                        </button>
                    ))}
                </nav>

                <div className="mt-6 pt-6 border-t border-gray-200">
                   <p className="text-xs text-gray-400">User ID:</p>
                   <p className="text-sm font-mono text-gray-600 truncate">{userId || 'Loading...'}</p>
                </div>
            </aside>
            
            <main className="flex-1 overflow-y-auto">
                {renderMainContent()}
            </main>

            

            <Modal
                showModal={showModal}
                setShowModal={setShowModal}
                modalType={modalType}
                editingTask={editingTask}
                newTaskTitle={newTaskTitle}
                setNewTaskTitle={setNewTaskTitle}
                newTaskDate={newTaskDate}
                setNewTaskDate={setNewTaskDate}
                handleSaveTask={handleSaveTask}
                tempMessage={null}
            />
        </div>
    );
};

export default App;