import axios from 'axios';

// 🍏 Jalur dasar API
const API_BASE_URL = 'http://localhost:8081/api';

// 🍏 Cek apakah kita lagi di mode development
const isDev = process.env.NODE_ENV !== 'production';

// 🍏 Logger helper: cuma jalan pas lagi mode development
const log = (message, data = '') => {
  if (isDev) console.log(message, data);
};

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 1. Request Interceptor: Menempelkan Token & Logging
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  log(`🚀 [API REQUEST]: ${config.method.toUpperCase()} ${config.url}`, config.data || '');
  return config;
}, (error) => {
  return Promise.reject(error);
});

// 2. Response Interceptor: Handling Response & Error Logging
api.interceptors.response.use(
  (response) => {
    log(`✅ [API RESPONSE]: ${response.config.url}`, response.data);
    return response;
  },
  (error) => {
    // Error logging tetep dimunculin buat bantu trace issue
    console.group(`❌ [API ERROR]`);
    console.error("Endpoint:", error.config?.url);
    console.error("Status:", error.response?.status);
    console.error("Pesan:", error.message);
    console.groupEnd();
    
    return Promise.reject(error);
  }
);

export default api;