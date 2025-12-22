import axios from 'axios';

// Create axios instance with backend URL
const API = axios.create({
  baseURL: 'https://task-management-mern-9nuk.onrender.com/api',
});

// Add JWT token to all requests
API.interceptors.request.use((req) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      req.headers.Authorization = `Bearer ${token}`;
    }
  }
  return req;
});

export default API;
