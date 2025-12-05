import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Clock, Play, Pause, X, Loader2 } from 'lucide-react';

// Default Pomodoro times in minutes
const DEFAULT_WORK_MIN = 25;
const DEFAULT_SHORT_BREAK_MIN = 5;
const DEFAULT_LONG_BREAK_MIN = 15;

/**
 * Self-contained Pomodoro Timer Component
 */
export const PomodoroTimer = ({ tasks, updatePomodoroCount }) => {
    // Customizable times
    const [workTime, setWorkTime] = useState(DEFAULT_WORK_MIN);
    const [shortBreakTime, setShortBreakTime] = useState(DEFAULT_SHORT_BREAK_MIN);
    const [longBreakTime, setLongBreakTime] = useState(DEFAULT_LONG_BREAK_MIN);
    const [pomodoroCount, setPomodoroCount] = useState(0);

    // Timer states
    const [timerState, setTimerState] = useState('work'); // 'work', 'short-break', 'long-break'
    const [isRunning, setIsRunning] = useState(false);
    const [timeRemaining, setTimeRemaining] = useState(DEFAULT_WORK_MIN * 60);
    const [activeTask, setActiveTask] = useState(null);

    const cycleCount = 4;

    const getTargetTime = useCallback(() => {
        switch (timerState) {
            case 'short-break': return shortBreakTime;
            case 'long-break': return longBreakTime;
            case 'work':
            default: return workTime;
        }
    }, [timerState, workTime, shortBreakTime, longBreakTime]);

    useEffect(() => {
        if (!isRunning) {
            setTimeRemaining(getTargetTime() * 60);
        }
    }, [getTargetTime, isRunning]);

    useEffect(() => {
        if (!isRunning) return;

        const interval = setInterval(() => {
            setTimeRemaining(prevTime => {
                if (prevTime > 0) {
                    return prevTime - 1;
                } else {
                    clearInterval(interval);
                    
                    if (timerState === 'work') {
                        const newCount = pomodoroCount + 1;
                        setPomodoroCount(newCount);

                        if (activeTask) {
                            const currentTask = tasks.find(t => t.id === activeTask.id);
                            const currentPomodoros = currentTask?.pomodoros || 0;
                            updatePomodoroCount(activeTask.id, currentPomodoros + 1);
                        }
                        
                        if (newCount % cycleCount === 0) {
                            setTimerState('long-break');
                        } else {
                            setTimerState('short-break');
                        }

                    } else {
                        setTimerState('work');
                    }

                    setIsRunning(false);
                    return getTargetTime() * 60;
                }
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [isRunning, timerState, activeTask, pomodoroCount, tasks, updatePomodoroCount, getTargetTime, cycleCount]);

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const handleReset = () => {
        setIsRunning(false);
        setTimeRemaining(getTargetTime() * 60);
    };

    const getHeaderClasses = (state) => `p-3 px-5 rounded-full font-semibold text-sm transition-colors ${
        timerState === state 
        ? 'bg-white text-gray-900 shadow-md ring-2 ring-red-500/50' 
        : 'bg-red-50 text-red-700 hover:bg-red-100'
    }`;
    
    const totalTimeInSeconds = getTargetTime() * 60;
    const progress = totalTimeInSeconds > 0 ? (totalTimeInSeconds - timeRemaining) / totalTimeInSeconds : 0;
    const strokeDashoffset = 472 - (472 * progress);

    return (
        <div className="p-8 space-y-8 max-w-4xl mx-auto">
            <h1 className="text-3xl font-extrabold text-gray-900 flex items-center">
                <Clock size={28} className="mr-3 text-red-600" /> Pomodoro Timer
            </h1>
            <p className="text-gray-600">
                Focus on tasks using the Pomodoro Technique. Cycles completed: <span className="font-bold text-red-600">{pomodoroCount}</span>.
            </p>

            <div className="bg-white p-8 rounded-2xl shadow-xl border">
                <div className="flex justify-center space-x-4 mb-8">
                    <button onClick={() => setTimerState('work')} className={getHeaderClasses('work')}>Work ({workTime} min)</button>
                    <button onClick={() => setTimerState('short-break')} className={getHeaderClasses('short-break')}>Short Break ({shortBreakTime} min)</button>
                    <button onClick={() => setTimerState('long-break')} className={getHeaderClasses('long-break')}>Long Break ({longBreakTime} min)</button>
                </div>

                <div className="flex flex-col items-center justify-center">
                    <div className="relative w-64 h-64">
                        <svg className="w-full h-full transform -rotate-90">
                            <circle cx="128" cy="128" r="75" fill="none" stroke="#e5e7eb" strokeWidth="8" />
                            <circle
                                cx="128" cy="128" r="75"
                                fill="none" stroke="#f87171" strokeWidth="8" strokeLinecap="round"
                                style={{ strokeDasharray: 472, strokeDashoffset: strokeDashoffset }}
                                className="transition-all duration-1000 ease-linear"
                            />
                        </svg>

                        <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-900">
                            <p className="text-6xl font-extrabold">{formatTime(timeRemaining)}</p>
                            <p className="text-sm font-medium capitalize text-gray-500">{timerState.replace('-', ' ')}</p>
                        </div>
                    </div>

                    <div className="flex space-x-4 mt-8">
                        <button
                            onClick={() => setIsRunning(prev => !prev)}
                            className={`flex items-center px-6 py-3 rounded-full text-white font-bold text-lg shadow-lg transition-all ${
                                isRunning ? 'bg-red-500 hover:bg-red-600 shadow-red-500/50' : 'bg-green-500 hover:bg-green-600 shadow-green-500/50'
                            }`}
                        >
                            {isRunning ? <Pause size={24} className="mr-2" /> : <Play size={24} className="mr-2" />}
                            {isRunning ? 'Pause' : 'Start'}
                        </button>
                        <button onClick={handleReset} className="flex items-center px-6 py-3 rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300 font-medium transition">
                            <Loader2 size={20} className="mr-2" /> Reset
                        </button>
                    </div>
                </div>

                <div className="mt-8 pt-6 border-t border-gray-100">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Focusing on Task:</label>
                    <div className="flex space-x-3">
                        <select 
                            onChange={(e) => setActiveTask(tasks.find(t => t.id === e.target.value) || null)}
                            value={activeTask?.id || ''}
                            className="flex-1 p-3 border rounded-xl shadow-sm focus:ring-red-500"
                            disabled={isRunning}
                        >
                            <option value="">Select a task...</option>
                            {tasks.filter(t => !t.completed).map(task => (
                                <option key={task.id} value={task.id}>
                                    {task.title} (Pomos: {task.pomodoros || 0})
                                </option>
                            ))}
                        </select>
                        {activeTask && (
                            <button 
                                onClick={() => setActiveTask(null)}
                                className="p-3 bg-red-100 text-red-600 rounded-xl hover:bg-red-200"
                                title="Clear Task"
                                disabled={isRunning}
                            >
                                <X size={20} />
                            </button>
                        )}
                    </div>
                    {isRunning && <p className="text-xs text-gray-500 mt-2">Stop the timer to change the focused task.</p>}
                </div>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-xl border space-y-4">
                <h2 className="text-xl font-bold text-gray-900 border-b pb-2">Customize Durations (in minutes)</h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Work Session</label>
                        <input type="number" min="1" value={workTime} onChange={(e) => setWorkTime(Math.max(1, parseInt(e.target.value) || 1))} className="w-full p-3 border rounded-xl shadow-sm focus:ring-red-500" disabled={isRunning} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Short Break</label>
                        <input type="number" min="1" value={shortBreakTime} onChange={(e) => setShortBreakTime(Math.max(1, parseInt(e.target.value) || 1))} className="w-full p-3 border rounded-xl shadow-sm focus:ring-red-500" disabled={isRunning} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Long Break (Every {cycleCount} cycles)</label>
                        <input type="number" min="1" value={longBreakTime} onChange={(e) => setLongBreakTime(Math.max(1, parseInt(e.target.value) || 1))} className="w-full p-3 border rounded-xl shadow-sm focus:ring-red-500" disabled={isRunning} />
                    </div>
                </div>
                {isRunning && <p className="text-sm text-red-500 mt-2">Stop the timer to change durations.</p>}
            </div>
        </div>
    );
};