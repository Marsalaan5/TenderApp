import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const getToken = () => localStorage.getItem('token');

const axiosInstance = axios.create({
  baseURL: API_URL,
});

axiosInstance.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const signup = (data) => axiosInstance.post('/auth/signup', data);
export const login = (data) => axiosInstance.post('/auth/login', data);

export const fetchTenders = (params) => axiosInstance.get('/tenders', { params });

export const uploadTender = (data) => axiosInstance.post('/tenders', data);

export const askAI = (question) => axiosInstance.post('/ai/ask', { question });
