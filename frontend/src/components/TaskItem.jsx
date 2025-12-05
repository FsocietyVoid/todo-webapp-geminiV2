import React, { useState } from 'react';
import { Trash2, Edit, CheckCircle, Circle, Calendar, Clock, Aperture } from 'lucide-react';

/**
 * Utility function to format the YYYY-MM-DD date string and determine urgency.
 * @param {string} dateString - Date in YYYY-MM-DD format (or null/undefined).
 * @returns {object|null} Object containing display info and styling, or null.
 */
const formatDate = (dateString) => {
    if (!dateString) return null;
    
    // Set today to midnight for clean comparison
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Set due date to midnight for clean comparison
    const dueDate = new Date(dateString);
    dueDate.setHours(0, 0, 0, 0);

    const timeDiff = dueDate.getTime() - today.getTime();
    // Calculate days difference (handles daylight savings time issues better than math)
    const dayDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

    // Default display format (e.g., "Dec 5")
    let displayDate = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(dueDate);
    let urgencyClass = 'text-gray-500 bg-gray-100';
    let urgencyText = displayDate;

    if (dayDiff < 0) {
        // Overdue tasks
        urgencyClass = 'text-red-700 bg-red-100 font-bold';
        urgencyText = 'Overdue';
    } else if (dayDiff === 0) {
        // Due Today
        urgencyClass = 'text-orange-600 bg-orange-100 font-bold';
        urgencyText = 'Today';
    } else if (dayDiff === 1) {
        // Due Tomorrow
        urgencyClass = 'text-yellow-600 bg-yellow-100 font-medium';
        urgencyText = 'Tomorrow';
    } else if (dayDiff <= 7) {
        // Due soon (within a week)
        urgencyClass = 'text-blue-600 bg-blue-100 font-medium';
        urgencyText = `${displayDate} (${dayDiff} days left)`;
    } else {
        // Normal future date
        urgencyText = displayDate;
    }
    
    return {
        display: displayDate,
        urgencyClass,
        urgencyText,
    };
};

export const TaskItem = ({ task, onToggle, onEdit, onDelete, onStartPomodoro }) => {
    const [isHovered, setIsHovered] = useState(false);
    const dateInfo = formatDate(task.dueDate);

    return (
        <div
            className={`flex items-center p-4 rounded-xl shadow-md transition duration-200 ${
                task.completed 
                    ? 'bg-green-50 border-l-4 border-green-500 opacity-70' 
                    : 'bg-white border-l-4 border-indigo-500 hover:shadow-lg'
            }`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* 1. Completion Toggle */}
            <button
                onClick={() => onToggle(task)}
                className="p-1.5 rounded-full text-indigo-500 hover:bg-indigo-100 transition duration-150 flex-shrink-0"
                aria-label={task.completed ? "Mark as Active" : "Mark as Complete"}
            >
                {task.completed ? (
                    <CheckCircle size={24} className="text-green-500" />
                ) : (
                    <Circle size={24} className="text-gray-300 hover:text-indigo-400" />
                )}
            </button>

            {/* 2. Task Title */}
            <div className={`flex-1 mx-4 min-w-0 ${task.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                <p className="font-semibold truncate">{task.title}</p>
            </div>

            {/* 3. Pomodoro Count */}
            {task.pomodoros > 0 && (
                <div className="flex items-center text-sm font-medium text-yellow-600 px-3 py-1 rounded-full bg-yellow-100 mr-4 flex-shrink-0">
                    <Clock size={14} className="mr-1.5" />
                    {task.pomodoros} {task.pomodoros === 1 ? 'Pomodoro' : 'Pomodoros'}
                </div>
            )}

            {/* 4. Due Date Display (Enhanced) */}
            {dateInfo && (
                <div className={`flex items-center text-xs font-medium px-3 py-1 rounded-full mr-4 flex-shrink-0 ${dateInfo.urgencyClass}`}>
                    <Calendar size={14} className="mr-1.5" />
                    {dateInfo.urgencyText}
                </div>
            )}

            {/* 5. Actions (Visible on Hover/Always on Mobile) */}
            <div className={`flex space-x-2 transition-all duration-300 flex-shrink-0 ${isHovered || task.completed ? 'opacity-100' : 'opacity-0 sm:opacity-100'}`}>
                
                {/* Edit Button */}
                {!task.completed && (
                    <button
                        onClick={() => onEdit(task)}
                        className="p-2 text-indigo-500 hover:bg-indigo-100 rounded-lg transition"
                        aria-label="Edit Task"
                    >
                        <Edit size={18} />
                    </button>
                )}
                
                {/* Delete Button */}
                <button
                    onClick={() => onDelete(task.id)}
                    className="p-2 text-red-500 hover:bg-red-100 rounded-lg transition"
                    aria-label="Delete Task"
                >
                    <Trash2 size={18} />
                </button>
            </div>
        </div>
    );
};