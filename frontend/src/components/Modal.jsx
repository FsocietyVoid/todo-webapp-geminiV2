import React from 'react';
import { X, Save } from 'lucide-react';

/**
 * Global Modal Component for adding or editing tasks.
 */
export const Modal = ({
    showModal,
    setShowModal,
    modalType,
    editingTask,
    newTaskTitle,
    setNewTaskTitle,
    newTaskDate,
    setNewTaskDate,
    handleSaveTask,
    tempMessage,
}) => {
    if (!showModal) return null;

    const isEditing = modalType === 'edit';
    const titleText = isEditing ? 'Edit Task' : 'Add New Task';
    const buttonText = isEditing ? 'Save Changes' : 'Add Task';
    const today = new Date().toISOString().split('T')[0];

    const handleSubmit = (e) => {
        e.preventDefault();
        if (newTaskTitle.trim()) {
            handleSaveTask();
        }
    };

    return (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center p-4 z-50 transition-opacity">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg transform scale-100 transition-transform duration-300">
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-gray-100">
                    <h2 className="text-xl font-bold text-gray-800">{titleText}</h2>
                    <button
                        onClick={() => setShowModal(false)}
                        className="text-gray-400 hover:text-gray-600 p-2 rounded-full transition duration-150 hover:bg-gray-100"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Body/Form */}
                <form onSubmit={handleSubmit} className="p-6">
                    <div className="mb-6">
                        <label htmlFor="task-title" className="block text-sm font-medium text-gray-700 mb-2">
                            Task Description
                        </label>
                        <input
                            id="task-title"
                            type="text"
                            value={newTaskTitle}
                            onChange={(e) => setNewTaskTitle(e.target.value)}
                            placeholder="e.g., Finish Q4 report"
                            required
                            className="w-full p-3 border border-gray-300 rounded-xl focus:ring-blue-500 focus:border-blue-500 transition duration-150 shadow-sm"
                            autoFocus
                        />
                    </div>

                    <div className="mb-8">
                        <label htmlFor="task-date" className="block text-sm font-medium text-gray-700 mb-2">
                            Due Date
                        </label>
                        <input
                            id="task-date"
                            type="date"
                            value={newTaskDate}
                            onChange={(e) => setNewTaskDate(e.target.value)}
                            min={today}
                            className="w-full p-3 border border-gray-300 rounded-xl focus:ring-blue-500 focus:border-blue-500 transition duration-150 shadow-sm"
                        />
                    </div>

                    {tempMessage && (
                        <p className="text-sm text-red-500 mb-4">{tempMessage}</p>
                    )}

                    {/* Footer/Actions */}
                    <div className="flex justify-end space-x-3">
                        <button
                            type="button"
                            onClick={() => setShowModal(false)}
                            className="px-5 py-3 text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition duration-150 font-medium"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex items-center px-5 py-3 text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition duration-150 font-medium shadow-md shadow-blue-500/50"
                        >
                            <Save size={18} className="mr-2" />
                            {buttonText}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};