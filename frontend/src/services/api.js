import axios from 'axios';

// Use the VITE_API_URL environment variable if it exists (for production),
// otherwise fall back to /api to use the Vite proxy (for local development)
const API_URL = import.meta.env.VITE_API_URL || '/api';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Response interceptor to handle 401s globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Only clear token if we're not already on the login page to avoid redirect loops
      if (window.location.pathname !== '/login') {
        localStorage.removeItem('token');
        // We'll let the React components handle redirecting based on auth state
        // or trigger a custom event that AuthContext can listen to.
        // A simple page reload also works to reset state and send user to login.
        window.location.reload();
      }
    }
    return Promise.reject(error);
  }
);