import axios from 'axios';
import useStore from '../store';

// Set your backend URL in a .env file at the root of /frontend
// VITE_API_URL=http://localhost:8000/api-v1
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api-v1';

const api = axios.create({
  baseURL: API_URL,
  responseType: 'json',
});

// Axios interceptor to add the JWT token from the store to every request header
api.interceptors.request.use(
  (config) => {
    const token = useStore.getState().user?.token;
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;