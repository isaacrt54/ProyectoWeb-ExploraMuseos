import axios from 'axios';

// Axios instance with base URL
const api = axios.create({
  baseURL: 'http://localhost:5000/api'
});

// Request interceptor to add Authorization header if token exists
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token'); 
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, error => {
  return Promise.reject(error);
});

export default api;
