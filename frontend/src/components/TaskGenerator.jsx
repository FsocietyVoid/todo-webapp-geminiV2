import React, { useState } from 'react';
import { Zap, Plus, Aperture, Loader2, Clock, X } from 'lucide-react';

// Get backend URL from environment
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

/** Call the backend API to generate tasks using Gemini */
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

/** Component to display a single generated task */
const GeneratedTaskItem = ({ task, onAdd }) => (
    <div className="flex items-center p-4 bg-white rounded-xl shadow-sm transition hover:shadow-md">
        <div className="p-1.5 rounded-full text-gray-300">
            <X size={24} />
        </div>
        
        <div className="flex-1 mx-4 min-w-0 text-gray-800">
            <p className="font-semibold truncate">{task.title}</p>
        </div>

        <div className="flex items-center text-sm font-medium text-gray-600 px-3 py-1 rounded-full bg-purple-50 mr-4">
            <Clock size={14} className="text-purple-500 mr-1.5" />
            {task.duration || 'N/A'}
        </div>

        <button onClick={() => onAdd(task)} className="p-2 text-green-500 hover:bg-green-50 rounded-lg text-sm font-medium flex items-center">
            <Plus size={16} className="mr-1" /> Add
        </button>
    </div>
);

export const TaskGenerator = ({ userId, appId, addTask }) => {
    const [prompt, setPrompt] = useState('');
    const [generatedTasks, setGeneratedTasks] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleGenerate = async (e) => {
        e.preventDefault();
        if (!prompt.trim() || !userId) return;

        setIsLoading(true);
        setGeneratedTasks([]);
        setError(null);

        try {
            const tasks = await generateTasksFromBackend(prompt);
            setGeneratedTasks(Array.isArray(tasks) ? tasks : []);
        } catch (err) {
            console.error("Backend API Error:", err);
            setError(err.message || "Error connecting to the AI service. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddSingleTask = async (task) => {
        await addTask(appId, userId, task.title, '');
        setGeneratedTasks(prev => prev.filter(t => t !== task));
    };

    const handleAddAllTasks = async () => {
        await Promise.all(generatedTasks.map(task => addTask(appId, userId, task.title, '')));
        setGeneratedTasks([]);
        setPrompt('');
    };

    return (
        <div className="p-8 space-y-6">
            <h1 className="text-3xl font-extrabold text-gray-900 flex items-center">
                <Aperture size={28} className="mr-3 text-purple-600" />
                AI Task Generator
            </h1>
            <p className="text-gray-600">
                Enter a project or goal, and Gemini will generate a breakdown of actionable steps for your to-do list.
            </p>

            <form onSubmit={handleGenerate} className="bg-white p-6 rounded-xl shadow-md border space-y-4">
                <textarea 
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Example: Plan a week-long trip to Rome, or, Write a report on Q3 financial metrics."
                    className="w-full p-4 border rounded-xl shadow-sm focus:ring-purple-500 resize-none h-24"
                    disabled={isLoading}
                    required
                />
                <button 
                    type="submit" 
                    className="w-full px-6 py-3 text-white bg-purple-600 rounded-xl hover:bg-purple-700 font-medium shadow-lg shadow-purple-500/50 flex items-center justify-center transition-opacity"
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <>
                            <Loader2 size={20} className="mr-2 animate-spin" /> Generating Tasks...
                        </>
                    ) : (
                        <>
                            <Zap size={20} className="mr-2" /> Generate Task List
                        </>
                    )}
                </button>
            </form>

            {error && (
                <div className="p-4 bg-red-100 text-red-700 rounded-xl font-medium">
                    {error}
                </div>
            )}

            {generatedTasks.length > 0 && (
                <div className="space-y-4 pt-4 border-t border-gray-200">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-bold text-gray-900">Generated Tasks ({generatedTasks.length})</h2>
                        <button onClick={handleAddAllTasks} className="px-4 py-2 text-white bg-green-500 rounded-lg hover:bg-green-600 font-medium flex items-center">
                            <Plus size={16} className="mr-1" /> Add All to List
                        </button>
                    </div>
                    
                    <div className="space-y-3">
                        {generatedTasks.map((task, index) => (
                            <GeneratedTaskItem 
                                key={index} 
                                task={task} 
                                onAdd={handleAddSingleTask} 
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};