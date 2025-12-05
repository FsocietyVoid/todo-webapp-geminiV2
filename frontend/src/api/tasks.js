import { doc, setDoc, updateDoc, deleteDoc, onSnapshot, collection, query, where, addDoc, serverTimestamp, getDocs, orderBy } from 'firebase/firestore';
import { db } from '../firebase/firebase';

const COLLECTION_NAME = 'tasks';

/**
 * Get the path to the tasks collection for the current user.
 * @param {string} appId - The application ID.
 * @param {string} userId - The authenticated user ID.
 * @returns {import('firebase/firestore').CollectionReference}
 */
const getTaskCollectionRef = (appId, userId) => {
    return collection(db, 'artifacts', appId, 'users', userId, COLLECTION_NAME);
};

/**
 * Attaches a real-time listener (onSnapshot) to the user's tasks.
 * Data is fetched and sorted client-side to avoid Firestore index issues.
 * @param {string} appId - The application ID.
 * @param {string} userId - The authenticated user ID.
 * @param {function} callback - Function to handle the received tasks.
 * @returns {function} The unsubscribe function.
 */
export const getTasksSnapshot = (appId, userId, callback) => {
    if (!appId || !userId) return () => {};

    const q = getTaskCollectionRef(appId, userId);

    const unsubscribe = onSnapshot(q, (snapshot) => {
        const tasksData = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        }));

        // Client-side sorting: Incomplete tasks first, then by date (most recent first)
        const sortedTasks = tasksData.sort((a, b) => {
            if (a.completed !== b.completed) {
                return a.completed ? 1 : -1; // Incomplete (false) comes before completed (true)
            }
            return (b.createdAt?.toDate() || 0) - (a.createdAt?.toDate() || 0);
        });

        callback(sortedTasks);
    }, (error) => {
        console.error("Error fetching tasks snapshot:", error);
    });

    return unsubscribe;
};

/**
 * Adds a new task to Firestore.
 * @param {string} appId - The application ID.
 * @param {string} userId - The authenticated user ID.
 * @param {string} title - The task title.
 * @param {string} date - The task due date (YYYY-MM-DD).
 */
export const addTask = async (appId, userId, title, date) => {
    if (!appId || !userId || !title) return;

    try {
        await addDoc(getTaskCollectionRef(appId, userId), {
            title,
            dueDate: date,
            completed: false,
            createdAt: serverTimestamp(),
            pomodoros: 0,
        });
    } catch (e) {
        console.error("Error adding document: ", e);
    }
};

/**
 * Toggles the 'completed' status of a task.
 * @param {string} appId - The application ID.
 * @param {string} userId - The authenticated user ID.
 * @param {string} taskId - The ID of the task to update.
 * @param {boolean} currentStatus - The task's current completion status.
 */
export const toggleTask = async (appId, userId, taskId, currentStatus) => {
    if (!appId || !userId || !taskId) return;

    try {
        const taskRef = doc(getTaskCollectionRef(appId, userId), taskId);
        await updateDoc(taskRef, {
            completed: !currentStatus,
        });
    } catch (e) {
        console.error("Error toggling task: ", e);
    }
};

/**
 * Updates the title and due date of an existing task.
 * @param {string} appId - The application ID.
 * @param {string} userId - The authenticated user ID.
 * @param {string} taskId - The ID of the task to update.
 * @param {string} newTitle - The new task title.
 * @param {string} newDate - The new task due date (YYYY-MM-DD).
 */
export const updateTaskTitle = async (appId, userId, taskId, newTitle, newDate) => {
    if (!appId || !userId || !taskId || !newTitle) return;

    try {
        const taskRef = doc(getTaskCollectionRef(appId, userId), taskId);
        await updateDoc(taskRef, {
            title: newTitle,
            dueDate: newDate,
        });
    } catch (e) {
        console.error("Error updating task: ", e);
    }
};

/**
 * Deletes a task from Firestore.
 * @param {string} appId - The application ID.
 * @param {string} userId - The authenticated user ID.
 * @param {string} taskId - The ID of the task to delete.
 */
export const deleteTask = async (appId, userId, taskId) => {
    if (!appId || !userId || !taskId) return;

    try {
        const taskRef = doc(getTaskCollectionRef(appId, userId), taskId);
        await deleteDoc(taskRef);
    } catch (e) {
        console.error("Error deleting task: ", e);
    }
};

/**
 * Updates the pomodoro count for a task.
 * @param {string} appId - The application ID.
 * @param {string} userId - The authenticated user ID.
 * @param {string} taskId - The ID of the task to update.
 * @param {number} newCount - The new pomodoro count.
 */
export const updatePomodoroCount = async (appId, userId, taskId, newCount) => {
    if (!appId || !userId || !taskId) return;

    try {
        const taskRef = doc(getTaskCollectionRef(appId, userId), taskId);
        await updateDoc(taskRef, {
            pomodoros: newCount,
        });
    } catch (e) {
        console.error("Error updating pomodoro count: ", e);
    }
};