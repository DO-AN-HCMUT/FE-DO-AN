import axios from 'axios';

import storage from '@/utils/storage';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

api.interceptors.request.use(
  (config) => {
    config.headers.Authorization = `Bearer ${storage.getItem('token')}`;
    return config;
  },
  (error) => {
    Promise.reject(error);
  },
);

export default api;
