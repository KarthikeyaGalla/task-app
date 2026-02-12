import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

console.log("🚀 [DEBUG] Configured API_URL:", API_URL);

export const api = {
    getTasks: () => {
        console.log("📡 [DEBUG] Fetching tasks from:", `${API_URL}/tasks`);
        return axios.get(`${API_URL}/tasks`).then(res => {
            console.log("✅ [DEBUG] Tasks response:", res.data);
            return res.data;
        }).catch(err => {
            console.error("❌ [DEBUG] Fetch failed:", err);
            throw err;
        });
    },
    addTask: (task) => {
        console.log("📡 [DEBUG] Adding task to:", `${API_URL}/tasks`, task);
        return axios.post(`${API_URL}/tasks`, task).then(res => res.data);
    },
    updateTask: (id, updates) => axios.put(`${API_URL}/tasks/${id}`, updates).then(res => res.data),
    deleteTask: (id) => axios.delete(`${API_URL}/tasks/${id}`).then(res => res.data),
};
