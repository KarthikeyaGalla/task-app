import React from 'react';
import { motion } from 'framer-motion';
import { Trash2, Edit2, Calendar, Activity } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import clsx from 'clsx';

const DomainColors = {
    DSA: 'bg-blue-50 text-blue-700 border-blue-200 ring-blue-500/20',
    Development: 'bg-green-50 text-green-700 border-green-200 ring-green-500/20',
    'Basic Task': 'bg-amber-50 text-amber-700 border-amber-200 ring-amber-500/20',
    'Ofc Work': 'bg-gray-50 text-gray-700 border-gray-200 ring-gray-500/20'
};

const ModeBadge = ({ mode }) => {
    const colors = {
        Easy: 'bg-lime-50 text-lime-600 border-lime-200',
        Medium: 'bg-orange-50 text-orange-600 border-orange-200',
        Hard: 'bg-red-50 text-red-600 border-red-200',
    };
    return (
        <span className={clsx("text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider border", colors[mode] || colors.Medium)}>
            {mode}
        </span>
    );
};

export function TaskItem({ task, onDelete, onEdit }) {
    const domainStyle = DomainColors[task.Domain] || DomainColors['Ofc Work'];

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            whileHover={{ y: -4, boxShadow: "0 12px 20px -8px rgba(0, 0, 0, 0.1)" }}
            className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex flex-col justify-between h-full group"
        >
            {/* Top Header: Domain & Mode */}
            <div className="flex justify-between items-start mb-3">
                <span className={clsx("text-[10px] font-extrabold px-2 py-1 rounded-md border tracking-wide", domainStyle)}>
                    {task.Domain}
                </span>
                <ModeBadge mode={task.Mode} />
            </div>

            {/* Main Content: Title & Desc */}
            <div className="mb-4">
                <h3 className="font-bold text-gray-800 text-base leading-snug mb-2">{task.TaskName}</h3>
                {task.Description && (
                    <div className="bg-gray-50 p-2 rounded-lg border border-gray-100">
                        <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">{task.Description}</p>
                    </div>
                )}
            </div>

            {/* Footer: Date & Actions */}
            <div className="mt-auto pt-3 border-t border-gray-50 flex items-center justify-between">
                <div className="flex items-center text-gray-400 text-xs font-semibold">
                    <Calendar size={12} className="mr-1.5 text-gray-300" />
                    {task.DueDate ? format(parseISO(task.DueDate), 'MMM d') : 'No Date'}
                </div>

                <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0 duration-200">
                    <button
                        onClick={() => onEdit(task)}
                        className="p-1.5 hover:bg-blue-50 text-blue-500 rounded-md transition-colors"
                        title="Edit Task"
                    >
                        <Edit2 size={14} />
                    </button>
                    <button
                        onClick={() => onDelete(task.TaskId)}
                        className="p-1.5 hover:bg-red-50 text-red-500 rounded-md transition-colors"
                        title="Delete Task"
                    >
                        <Trash2 size={14} />
                    </button>
                </div>
            </div>
        </motion.div>
    );
}
