import React from 'react';
import { TaskItem } from './TaskItem';
import { motion } from 'framer-motion';

export function UpcomingTasks({ tasks, onEdit, onDelete }) {
    // Sort tasks: Date -> Mode (Hard > Medium > Easy)
    const modePriority = { 'Hard': 3, 'Medium': 2, 'Easy': 1, 'default': 0 };

    const sortedTasks = [...tasks].sort((a, b) => {
        // 1. Date Ascending
        const dateA = new Date(a.DueDate);
        const dateB = new Date(b.DueDate);
        if (dateA.getTime() !== dateB.getTime()) {
            return dateA.getTime() - dateB.getTime();
        }
        // 2. Mode Priority Descending
        const priorityA = modePriority[a.Mode] || 0;
        const priorityB = modePriority[b.Mode] || 0;
        return priorityB - priorityA;
    });

    return (
        <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <span className="bg-purple-100 text-purple-600 p-2 rounded-lg mr-3">
                    📅
                </span>
                Upcoming Tasks (Next 7 Days)
            </h2>

            {sortedTasks.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                    <p className="text-gray-400 font-medium">No upcoming tasks scheduled.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {sortedTasks.map(task => (
                        <TaskItem
                            key={task.TaskId}
                            task={task}
                            onEdit={onEdit}
                            onDelete={onDelete}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
