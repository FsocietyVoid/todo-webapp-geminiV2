import React from 'react';
import { TaskItem } from './TaskItem';
import { List, Plus } from 'lucide-react'; // Added Plus icon

/**
 * Renders the full list of tasks based on the current view mode.
 */
export const TaskList = ({ tasks, viewMode, onToggle, onEdit, onDelete, onOpenAddModal }) => {
    // Determine which tasks to display based on viewMode
    // NOTE: Filtering is currently set to 'all' in App.jsx's renderMainContent, 
    // but the structure supports future filter buttons in this component if needed.
    const filteredTasks = tasks.filter(task => {
        if (viewMode === 'all') return true;
        if (viewMode === 'active') return !task.completed;
        if (viewMode === 'completed') return task.completed;
        return true;
    });

    const activeTasksCount = tasks.filter(t => !t.completed).length;
    const completedTasksCount = tasks.filter(t => t.completed).length;

    return (
        <div className="p-8 space-y-6">
            <header className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 border-b pb-4">
                <div className='mb-4 sm:mb-0'>
                    <h1 className="text-3xl font-extrabold text-gray-900">Your Taskboard</h1>
                    <div className="text-sm text-gray-500 mt-1 space-x-4">
                        <span className="font-medium text-indigo-600">{activeTasksCount} Active</span>
                        <span className="text-gray-400">|</span>
                        <span>{completedTasksCount} Completed</span>
                    </div>
                </div>
                
                <button
                    onClick={onOpenAddModal}
                    className="px-6 py-3 text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 transition duration-150 font-medium shadow-lg shadow-indigo-500/50 flex items-center justify-center flex-shrink-0"
                >
                    <Plus size={20} className="mr-2" /> New Task
                </button>
            </header>

            {filteredTasks.length === 0 ? (
                <div className="text-center py-16 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                    <List size={32} className="text-gray-400 mx-auto mb-3" />
                    <p className="text-lg font-medium text-gray-600">
                        Your to-do list is empty!
                    </p>
                    <p className="text-sm text-gray-500 mt-1">Click '+ New Task' to start organizing your work.</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {filteredTasks.map(task => (
                        <TaskItem
                            key={task.id}
                            task={task}
                            onToggle={onToggle}
                            onEdit={onEdit}
                            onDelete={onDelete}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};