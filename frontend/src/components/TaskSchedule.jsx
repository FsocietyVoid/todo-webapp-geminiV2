import React, { useState, useMemo } from 'react';
import { Calendar, TrendingUp, Award, Flame, Target, Clock, CheckCircle2, AlertCircle, Zap } from 'lucide-react';
import { TaskItem } from './TaskItem';

/**
 * Enhanced Task Schedule with visualizations and gamification
 */
export const TaskSchedule = ({ tasks, onToggle, onEdit, onDelete }) => {
    const [selectedView, setSelectedView] = useState('timeline'); // 'timeline' or 'list'
    
    // Filter and categorize tasks
    const scheduledTasks = useMemo(() => {
        return tasks.filter(t => !t.completed && t.dueDate);
    }, [tasks]);

    // Calculate statistics
    const stats = useMemo(() => {
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        
        const overdue = scheduledTasks.filter(t => new Date(t.dueDate) < today).length;
        const dueToday = scheduledTasks.filter(t => {
            const dueDate = new Date(t.dueDate);
            return dueDate.toDateString() === today.toDateString();
        }).length;
        const upcoming = scheduledTasks.filter(t => new Date(t.dueDate) > today).length;
        
        const completedTasks = tasks.filter(t => t.completed);
        const completedToday = completedTasks.filter(t => {
            const completedDate = t.completedAt?.toDate() || new Date();
            return completedDate.toDateString() === today.toDateString();
        }).length;
        
        // Calculate streak (simplified - days with completed tasks)
        const streak = completedToday > 0 ? Math.min(completedTasks.length, 30) : 0;
        
        // Calculate completion rate
        const totalTasks = tasks.length;
        const completionRate = totalTasks > 0 ? Math.round((completedTasks.length / totalTasks) * 100) : 0;
        
        return { overdue, dueToday, upcoming, completedToday, streak, completionRate };
    }, [tasks, scheduledTasks]);

    // Group tasks by date
    const tasksByDate = useMemo(() => {
        const grouped = {};
        scheduledTasks.forEach(task => {
            const date = task.dueDate;
            if (!grouped[date]) {
                grouped[date] = [];
            }
            grouped[date].push(task);
        });
        return Object.entries(grouped).sort(([a], [b]) => new Date(a) - new Date(b)).slice(0, 10);
    }, [scheduledTasks]);

    // Reward badge system
    const badges = useMemo(() => {
        const earned = [];
        if (stats.streak >= 3) earned.push({ name: '🔥 3-Day Streak', color: 'orange' });
        if (stats.streak >= 7) earned.push({ name: '⚡ Week Warrior', color: 'yellow' });
        if (stats.completedToday >= 5) earned.push({ name: '✨ Productivity Star', color: 'blue' });
        if (stats.completionRate >= 80) earned.push({ name: '🎯 Master Finisher', color: 'green' });
        return earned;
    }, [stats]);

    // Format date for display
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        
        if (date.toDateString() === today.toDateString()) return 'Today';
        if (date.toDateString() === tomorrow.toDateString()) return 'Tomorrow';
        
        const diffTime = date - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays < 0) return `${Math.abs(diffDays)} days overdue`;
        if (diffDays <= 7) return `In ${diffDays} days`;
        
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    // Get urgency color
    const getUrgencyColor = (dateString) => {
        const date = new Date(dateString);
        const today = new Date();
        const diffDays = Math.ceil((date - today) / (1000 * 60 * 60 * 24));
        
        if (diffDays < 0) return 'border-l-red-500 bg-red-50';
        if (diffDays === 0) return 'border-l-orange-500 bg-orange-50';
        if (diffDays <= 3) return 'border-l-yellow-500 bg-yellow-50';
        return 'border-l-green-500 bg-green-50';
    };

    return (
        <div className="p-8 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900 flex items-center">
                        <Calendar size={28} className="mr-3 text-blue-600" />
                        Upcoming Schedule
                    </h1>
                    <p className="text-gray-600 mt-1">
                        Your tasks organized by timeline and urgency
                    </p>
                </div>
                
                {/* View Toggle */}
                <div className="flex bg-gray-100 rounded-lg p-1">
                    <button
                        onClick={() => setSelectedView('timeline')}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition ${
                            selectedView === 'timeline' 
                                ? 'bg-white text-blue-600 shadow-sm' 
                                : 'text-gray-600 hover:text-gray-900'
                        }`}
                    >
                        <TrendingUp size={16} className="inline mr-1" /> Timeline
                    </button>
                    <button
                        onClick={() => setSelectedView('list')}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition ${
                            selectedView === 'list' 
                                ? 'bg-white text-blue-600 shadow-sm' 
                                : 'text-gray-600 hover:text-gray-900'
                        }`}
                    >
                        <Calendar size={16} className="inline mr-1" /> List
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <StatCard
                    icon={AlertCircle}
                    label="Overdue"
                    value={stats.overdue}
                    color="text-red-500"
                    bgColor="bg-red-50"
                />
                <StatCard
                    icon={Clock}
                    label="Due Today"
                    value={stats.dueToday}
                    color="text-orange-500"
                    bgColor="bg-orange-50"
                />
                <StatCard
                    icon={Calendar}
                    label="Upcoming"
                    value={stats.upcoming}
                    color="text-blue-500"
                    bgColor="bg-blue-50"
                />
                <StatCard
                    icon={CheckCircle2}
                    label="Done Today"
                    value={stats.completedToday}
                    color="text-green-500"
                    bgColor="bg-green-50"
                />
            </div>

            {/* Progress & Rewards Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Completion Progress */}
                <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl p-6 text-white shadow-lg">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-2">
                            <Target size={24} />
                            <h3 className="text-lg font-bold">Completion Rate</h3>
                        </div>
                        <span className="text-3xl font-extrabold">{stats.completionRate}%</span>
                    </div>
                    <div className="w-full bg-white/20 rounded-full h-3 overflow-hidden">
                        <div 
                            className="bg-white h-full rounded-full transition-all duration-500 shadow-glow"
                            style={{ width: `${stats.completionRate}%` }}
                        />
                    </div>
                    <p className="text-sm mt-2 text-white/80">
                        {tasks.filter(t => t.completed).length} of {tasks.length} tasks completed
                    </p>
                </div>

                {/* Streak Counter */}
                <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-xl p-6 text-white shadow-lg">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-2">
                            <Flame size={24} />
                            <h3 className="text-lg font-bold">Current Streak</h3>
                        </div>
                        <span className="text-3xl font-extrabold">{stats.streak}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        {[...Array(7)].map((_, i) => (
                            <div
                                key={i}
                                className={`h-8 flex-1 rounded ${
                                    i < stats.streak ? 'bg-white' : 'bg-white/20'
                                } transition-all`}
                            />
                        ))}
                    </div>
                    <p className="text-sm mt-2 text-white/80">
                        Keep going! Complete tasks daily to maintain your streak
                    </p>
                </div>
            </div>

            {/* Badges */}
            {badges.length > 0 && (
                <div className="bg-white rounded-xl p-6 shadow-md border">
                    <div className="flex items-center space-x-2 mb-4">
                        <Award size={24} className="text-yellow-500" />
                        <h3 className="text-lg font-bold text-gray-900">Achievements Unlocked</h3>
                    </div>
                    <div className="flex flex-wrap gap-3">
                        {badges.map((badge, idx) => (
                            <div
                                key={idx}
                                className="px-4 py-2 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full text-white font-semibold text-sm shadow-md animate-bounce-subtle"
                            >
                                {badge.name}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Task Display */}
            {scheduledTasks.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-xl border border-dashed border-gray-200 shadow-sm">
                    <Calendar size={48} className="text-gray-400 mx-auto mb-4" />
                    <p className="text-lg font-medium text-gray-600">
                        No upcoming tasks scheduled!
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                        Add a due date to your tasks to see them appear here.
                    </p>
                </div>
            ) : selectedView === 'timeline' ? (
                // Timeline View
                <div className="space-y-6">
                    {tasksByDate.map(([date, dateTasks]) => (
                        <div key={date} className="relative">
                            {/* Date Header */}
                            <div className="sticky top-0 z-10 bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 mb-3 shadow-sm">
                                <div className="flex items-center justify-between">
                                    <h3 className="font-bold text-gray-900">{formatDate(date)}</h3>
                                    <span className="text-sm text-gray-600">
                                        {new Date(date).toLocaleDateString('en-US', { 
                                            weekday: 'long', 
                                            month: 'long', 
                                            day: 'numeric' 
                                        })}
                                    </span>
                                </div>
                            </div>
                            
                            {/* Tasks for this date */}
                            <div className="space-y-3 pl-4 border-l-4 border-blue-200">
                                {dateTasks.map(task => (
                                    <div 
                                        key={task.id}
                                        className={`border-l-4 ${getUrgencyColor(task.dueDate)} rounded-r-lg overflow-hidden transition-all hover:shadow-md`}
                                    >
                                        <TaskItem 
                                            task={task} 
                                            onToggle={onToggle} 
                                            onEdit={onEdit} 
                                            onDelete={onDelete} 
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                // List View
                <div className="space-y-3">
                    {scheduledTasks.slice(0, 15).map(task => (
                        <div 
                            key={task.id}
                            className={`border-l-4 ${getUrgencyColor(task.dueDate)} rounded-r-lg overflow-hidden transition-all hover:shadow-md`}
                        >
                            <TaskItem 
                                task={task} 
                                onToggle={onToggle} 
                                onEdit={onEdit} 
                                onDelete={onDelete} 
                            />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

// Stat Card Component
const StatCard = ({ icon: Icon, label, value, color, bgColor }) => (
    <div className={`${bgColor} rounded-xl p-4 border border-gray-200 shadow-sm`}>
        <div className="flex items-center justify-between">
            <Icon size={24} className={color} />
            <span className="text-2xl font-extrabold text-gray-900">{value}</span>
        </div>
        <p className="text-sm font-medium text-gray-600 mt-2">{label}</p>
    </div>
);