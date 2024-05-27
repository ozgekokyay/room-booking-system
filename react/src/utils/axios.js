// src/utils/axios.js

import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:8000/', // Django backend API URL
  timeout: 1000,
  headers: { 'Content-Type': 'application/json' },
});

instance.interceptors.request.use(
  (config) => {
    const tokens = JSON.parse(localStorage.getItem('tokens'));
    if (tokens) {
      config.headers.Authorization = `Bearer ${tokens.access}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default instance;

