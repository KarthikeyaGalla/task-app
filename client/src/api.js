import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const api = {
    getTasks: () => axios.get(`${API_URL}/tasks`).then(res => res.data),
    addTask: (task) => axios.post(`${API_URL}/tasks`, task).then(res => res.data),
    updateTask: (id, updates) => axios.put(`${API_URL}/tasks/${id}`, updates).then(res => res.data),
    deleteTask: (id) => axios.delete(`${API_URL}/tasks/${id}`).then(res => res.data),
};
