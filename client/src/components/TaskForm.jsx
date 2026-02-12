import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '../api';

const DOMAINS = ['DSA', 'Development', 'Basic Task', 'Ofc Work'];
const MODES = ['Easy', 'Medium', 'Hard'];

export function TaskForm({ onTaskAdded }) {
    const [isOpen, setIsOpen] = useState(false);
    const [task, setTask] = useState({
        TaskName: '',
        Domain: 'Development',
        Mode: 'Medium',
        DueDate: new Date().toISOString().split('T')[0],
        Description: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.addTask(task);
            onTaskAdded();
            setIsOpen(false);
            setTask({
                TaskName: '',
                Domain: 'Development',
                Mode: 'Medium',
                DueDate: new Date().toISOString().split('T')[0],
                Description: ''
            });
        } catch (err) {
            console.error(err);
            const msg = err.response?.data?.error || err.message || JSON.stringify(err);
            alert(`Failed to add task.\nDetails: ${msg}`);
        }
    };

    return (
        <div className="mb-8">
            {!isOpen ? (
                <motion.button
                    layout
                    onClick={() => setIsOpen(true)}
                    className="w-full py-4 rounded-xl border-2 border-dashed border-gray-300 text-gray-400 font-medium hover:border-blue-500 hover:text-blue-500 transition-colors flex items-center justify-center gap-2 group"
                >
                    <div className="bg-gray-100 p-2 rounded-full group-hover:bg-blue-100 transition-colors">
                        <Plus size={24} />
                    </div>
                    Add New Task
                </motion.button>
            ) : (
                <motion.form
                    layout
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100"
                    onSubmit={handleSubmit}
                >
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold text-gray-800">New Task</h2>
                        <button
                            type="button"
                            onClick={() => setIsOpen(false)}
                            className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div className="col-span-2">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Task Name</label>
                            <input
                                required
                                type="text"
                                placeholder="What needs to be done?"
                                className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-50/50 transition-all outline-none"
                                value={task.TaskName}
                                onChange={(e) => setTask({ ...task, TaskName: e.target.value })}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Domain</label>
                            <select
                                className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:bg-white focus:border-blue-500 outline-none"
                                value={task.Domain}
                                onChange={(e) => setTask({ ...task, Domain: e.target.value })}
                            >
                                {DOMAINS.map(d => <option key={d} value={d}>{d}</option>)}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Mode</label>
                            <select
                                className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:bg-white focus:border-blue-500 outline-none"
                                value={task.Mode}
                                onChange={(e) => setTask({ ...task, Mode: e.target.value })}
                            >
                                {MODES.map(m => <option key={m} value={m}>{m}</option>)}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Due Date</label>
                            <input
                                type="date"
                                className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:bg-white focus:border-blue-500 outline-none"
                                value={task.DueDate}
                                onChange={(e) => setTask({ ...task, DueDate: e.target.value })}
                            />
                        </div>

                        <div className="col-span-2">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Topics / Description</label>
                            <textarea
                                placeholder="Topics covered, notes, or details..."
                                className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-50/50 transition-all outline-none"
                                rows={3}
                                value={task.Description}
                                onChange={(e) => setTask({ ...task, Description: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={() => setIsOpen(false)}
                            className="px-6 py-2.5 rounded-lg text-gray-600 font-medium hover:bg-gray-100 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-6 py-2.5 rounded-lg bg-blue-600 text-white font-bold shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:bg-blue-700 active:scale-95 transition-all"
                        >
                            Create Task
                        </button>
                    </div>
                </motion.form>
            )}
        </div>
    );
}
