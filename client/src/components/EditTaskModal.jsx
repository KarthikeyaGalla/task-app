import React, { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '../api';

const DOMAINS = ['DSA', 'Development', 'Basic Task', 'Ofc Work'];
const MODES = ['Easy', 'Medium', 'Hard'];
const STATUSES = ['Not Started', 'In Progress', 'Completed'];

export function EditTaskModal({ task, isOpen, onClose, onTaskUpdated }) {
    const [formData, setFormData] = useState({
        TaskName: '',
        Domain: '',
        Mode: '',
        Status: '',
        DueDate: '',
        Description: ''
    });

    useEffect(() => {
        if (task) {
            setFormData({
                TaskName: task.TaskName || '',
                Domain: task.Domain || 'Development',
                Mode: task.Mode || 'Medium',
                Status: task.Status || 'Not Started',
                DueDate: task.DueDate ? task.DueDate.split('T')[0] : '',
                Description: task.Description || ''
            });
        }
    }, [task]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.updateTask(task.TaskId, formData);
            onTaskUpdated();
            onClose();
        } catch (err) {
            console.error(err);
            alert("Failed to update task: " + (err.response?.data?.error || err.message));
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.95, opacity: 0 }}
                    className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden"
                    onClick={e => e.stopPropagation()}
                >
                    <div className="flex justify-between items-center p-6 border-b border-gray-100">
                        <h2 className="text-xl font-bold text-gray-800">Edit Task</h2>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="p-6 space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Task Name</label>
                            <input
                                type="text"
                                required
                                className="w-full px-4 py-2 rounded-lg bg-gray-50 border border-gray-200 focus:border-blue-500 focus:bg-white transition-all outline-none font-medium text-gray-800"
                                value={formData.TaskName}
                                onChange={e => setFormData({ ...formData, TaskName: e.target.value })}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Domain</label>
                                <select
                                    className="w-full px-4 py-2 rounded-lg bg-gray-50 border border-gray-200 focus:border-blue-500 outline-none"
                                    value={formData.Domain}
                                    onChange={e => setFormData({ ...formData, Domain: e.target.value })}
                                >
                                    {DOMAINS.map(d => <option key={d} value={d}>{d}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Mode</label>
                                <select
                                    className="w-full px-4 py-2 rounded-lg bg-gray-50 border border-gray-200 focus:border-blue-500 outline-none"
                                    value={formData.Mode}
                                    onChange={e => setFormData({ ...formData, Mode: e.target.value })}
                                >
                                    {MODES.map(m => <option key={m} value={m}>{m}</option>)}
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Status</label>
                                <select
                                    className="w-full px-4 py-2 rounded-lg bg-gray-50 border border-gray-200 focus:border-blue-500 outline-none"
                                    value={formData.Status}
                                    onChange={e => setFormData({ ...formData, Status: e.target.value })}
                                >
                                    {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Due Date</label>
                                <input
                                    type="date"
                                    className="w-full px-4 py-2 rounded-lg bg-gray-50 border border-gray-200 focus:border-blue-500 outline-none"
                                    value={formData.DueDate}
                                    onChange={e => setFormData({ ...formData, DueDate: e.target.value })}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Description / Topics</label>
                            <textarea
                                rows={4}
                                className="w-full px-4 py-2 rounded-lg bg-gray-50 border border-gray-200 focus:border-blue-500 focus:bg-white transition-all outline-none"
                                value={formData.Description}
                                onChange={e => setFormData({ ...formData, Description: e.target.value })}
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full py-3 rounded-xl bg-blue-600 text-white font-bold text-lg shadow-lg hover:bg-blue-700 active:scale-95 transition-all flex items-center justify-center gap-2 mt-4"
                        >
                            <Save size={20} />
                            Save Changes
                        </button>
                    </form>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
