import axios from 'axios';

// 🍏 Jalur dasar URL backend Spring Boot lu (sudah termasuk /api)
const API_BASE_URL = 'http://localhost:8081/api'; 

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // 🔒 WAJIB agar sinkron dengan allowCredentials(true) di Java CORS lu
  headers: {
    'Content-Type': 'application/json',
  },
});

// Otomatis menempelkan token JWT di header jika nanti lu pakai sistem login (opsional)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;