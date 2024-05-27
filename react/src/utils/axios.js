// src/api/axios.js
import axios from 'axios';
import { getToken, removeToken } from '../context/AuthContext';

const axiosInstance = axios.create({
  baseURL: 'http://127.0.0.1:8000/',
});

axiosInstance.interceptors.request.use(
  (config) => {
      const token = getToken();
      if (token) {
          config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
      if (error.response.status === 401) {
          removeToken();
          // Optional: Redirect to login page
      }
      return Promise.reject(error);
  }
);

export default axiosInstance;

