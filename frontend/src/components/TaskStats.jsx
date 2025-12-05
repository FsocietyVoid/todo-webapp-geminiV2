import React, { useMemo } from 'react';
import { 
    BarChart, 
    List, 
    CheckCircle, 
    Zap, 
    Target,
    Calendar,
    Clock,
    Award,
    TrendingUp
} from 'lucide-react';

// Stat card component
const StatCard = ({ title, value, icon: Icon, color, bgColor, subtitle }) => (
    <div className={`${bgColor} rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-200`}>
        <div className="flex items-start justify-between">
            <div className="flex-1">
                <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
                <p className="text-3xl font-bold text-gray-900 mb-1">{value}</p>
                {subtitle && (
                    <p className="text-xs text-gray-500">{subtitle}</p>
                )}
            </div>
            <div className={`p-3 ${color} bg-opacity-10 rounded-xl`}>
                <Icon size={24} className={color} />
            </div>
        </div>
    </div>
);

// Progress bar component
const ProgressBar = ({ percentage, color }) => (
    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
        <div 
            className={`h-full ${color} transition-all duration-500 ease-out rounded-full`}
            style={{ width: `${percentage}%` }}
        />
    </div>
);

// Helper component for status items
const StatusItem = ({ label, count, color, percentage }) => (
    <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3 flex-1">
            <div className={`w-3 h-3 rounded-full ${color}`} />
            <span className="text-sm font-medium text-gray-700">{label}</span>
        </div>
        <div className="flex items-center space-x-3">
            <span className="text-sm font-bold text-gray-900">{count}</span>
            <span className="text-xs text-gray-500 w-12 text-right">
                {percentage.toFixed(0)}%
            </span>
        </div>
    </div>
);

// Helper component for insights
const InsightItem = ({ emoji, text, color }) => (
    <div className="flex items-start space-x-2 p-3 bg-white bg-opacity-60 rounded-lg">
        <span className="text-xl">{emoji}</span>
        <p className={`text-sm font-medium ${color}`}>{text}</p>
    </div>
);

export const TaskStats = ({ tasks }) => {
    // Calculate all statistics
    const stats = useMemo(() => {
        const completed = tasks.filter(t => t.completed);
        const incomplete = tasks.filter(t => !t.completed);
        const totalPomodoros = tasks.reduce((sum, t) => sum + (t.pomodoros || 0), 0);
        
        // Tasks with due dates
        const overdueTasks = incomplete.filter(t => {
            if (!t.dueDate) return false;
            const dueDate = new Date(t.dueDate);
            return dueDate < new Date();
        });
        
        // Today's tasks
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const todayEnd = new Date(today);
        todayEnd.setHours(23, 59, 59, 999);
        
        const todaysTasks = tasks.filter(t => {
            if (!t.dueDate) return false;
            const dueDate = new Date(t.dueDate);
            return dueDate >= today && dueDate <= todayEnd;
        });
        
        // Completion rate
        const completionRate = tasks.length > 0 
            ? Math.round((completed.length / tasks.length) * 100) 
            : 0;
        
        // Average pomodoros per task
        const avgPomodoros = tasks.length > 0
            ? (totalPomodoros / tasks.length).toFixed(1)
            : 0;
        
        return {
            total: tasks.length,
            completed: completed.length,
            incomplete: incomplete.length,
            overdue: overdueTasks.length,
            today: todaysTasks.length,
            totalPomodoros,
            completionRate,
            avgPomodoros
        };
    }, [tasks]);

    return (
        <div className="p-8 space-y-8 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-4xl font-extrabold text-gray-900 flex items-center">
                        <BarChart size={32} className="mr-3 text-indigo-600" />
                        Statistics
                    </h1>
                    <p className="text-gray-500 mt-2">Track your productivity and progress</p>
                </div>
            </div>

            {/* Main Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard 
                    title="Total Tasks" 
                    value={stats.total} 
                    icon={List} 
                    color="text-indigo-600"
                    bgColor="bg-white"
                />
                <StatCard 
                    title="Completed" 
                    value={stats.completed} 
                    icon={CheckCircle} 
                    color="text-green-600"
                    bgColor="bg-white"
                    subtitle={`${stats.incomplete} remaining`}
                />
                <StatCard 
                    title="Pomodoros" 
                    value={stats.totalPomodoros} 
                    icon={Zap} 
                    color="text-yellow-600"
                    bgColor="bg-white"
                    subtitle={`${stats.avgPomodoros} avg per task`}
                />
                <StatCard 
                    title="Completion Rate" 
                    value={`${stats.completionRate}%`} 
                    icon={Target} 
                    color="text-purple-600"
                    bgColor="bg-white"
                />
            </div>

            {/* Secondary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard 
                    title="Due Today" 
                    value={stats.today} 
                    icon={Calendar} 
                    color="text-blue-600"
                    bgColor="bg-blue-50"
                    subtitle="Tasks scheduled for today"
                />
                <StatCard 
                    title="Overdue" 
                    value={stats.overdue} 
                    icon={Clock} 
                    color="text-red-600"
                    bgColor="bg-red-50"
                    subtitle="Need immediate attention"
                />
                <StatCard 
                    title="Focus Score" 
                    value={stats.totalPomodoros > 20 ? "🔥" : stats.totalPomodoros > 10 ? "⭐" : "💪"} 
                    icon={Award} 
                    color="text-orange-600"
                    bgColor="bg-orange-50"
                    subtitle={`${stats.totalPomodoros} total sessions`}
                />
            </div>

            {/* Progress Section */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                    <TrendingUp size={24} className="mr-2 text-indigo-600" />
                    Progress Overview
                </h2>
                <div className="space-y-6">
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-gray-700">Task Completion</span>
                            <span className="text-sm font-bold text-indigo-600">
                                {stats.completed} / {stats.total}
                            </span>
                        </div>
                        <ProgressBar percentage={stats.completionRate} color="bg-gradient-to-r from-green-400 to-green-600" />
                    </div>

                    {stats.overdue > 0 && (
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium text-gray-700">Overdue Tasks</span>
                                <span className="text-sm font-bold text-red-600">
                                    {stats.overdue} / {stats.incomplete}
                                </span>
                            </div>
                            <ProgressBar 
                                percentage={stats.incomplete > 0 ? (stats.overdue / stats.incomplete) * 100 : 0} 
                                color="bg-gradient-to-r from-red-400 to-red-600" 
                            />
                        </div>
                    )}

                    {stats.totalPomodoros > 0 && (
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium text-gray-700">Focus Sessions</span>
                                <span className="text-sm font-bold text-yellow-600">
                                    {stats.totalPomodoros} sessions
                                </span>
                            </div>
                            <div className="flex items-center space-x-2">
                                {[...Array(Math.min(10, Math.ceil(stats.totalPomodoros / 5)))].map((_, i) => (
                                    <div key={i} className="flex-1 h-8 bg-gradient-to-t from-yellow-400 to-yellow-500 rounded-t-lg" />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Task Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Status Distribution */}
                <div className="bg-white rounded-2xl p-6 shadow-sm">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Task Status</h2>
                    <div className="space-y-3">
                        <StatusItem 
                            label="Completed" 
                            count={stats.completed} 
                            color="bg-green-500" 
                            percentage={stats.total > 0 ? (stats.completed / stats.total) * 100 : 0}
                        />
                        <StatusItem 
                            label="In Progress" 
                            count={stats.incomplete - stats.overdue} 
                            color="bg-blue-500" 
                            percentage={stats.total > 0 ? ((stats.incomplete - stats.overdue) / stats.total) * 100 : 0}
                        />
                        <StatusItem 
                            label="Overdue" 
                            count={stats.overdue} 
                            color="bg-red-500" 
                            percentage={stats.total > 0 ? (stats.overdue / stats.total) * 100 : 0}
                        />
                    </div>
                </div>

                {/* Productivity Insights */}
                <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-6 shadow-sm">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Insights</h2>
                    <div className="space-y-3">
                        {stats.completionRate >= 80 && (
                            <InsightItem 
                                emoji="🎉" 
                                text="Excellent completion rate! Keep up the great work!" 
                                color="text-green-700"
                            />
                        )}
                        {stats.completionRate < 50 && stats.total > 0 && (
                            <InsightItem 
                                emoji="💪" 
                                text="Focus on completing existing tasks before adding more." 
                                color="text-orange-700"
                            />
                        )}
                        {stats.overdue > 0 && (
                            <InsightItem 
                                emoji="⚠️" 
                                text={`You have ${stats.overdue} overdue task${stats.overdue > 1 ? 's' : ''}. Prioritize them!`}
                                color="text-red-700"
                            />
                        )}
                        {stats.totalPomodoros > 20 && (
                            <InsightItem 
                                emoji="🔥" 
                                text="Amazing focus! You're in the zone!" 
                                color="text-orange-700"
                            />
                        )}
                        {stats.total === 0 && (
                            <InsightItem 
                                emoji="✨" 
                                text="Start by adding your first task to get organized!" 
                                color="text-indigo-700"
                            />
                        )}
                        {stats.today > 0 && (
                            <InsightItem 
                                emoji="📅" 
                                text={`${stats.today} task${stats.today > 1 ? 's' : ''} due today. Stay focused!`}
                                color="text-blue-700"
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};