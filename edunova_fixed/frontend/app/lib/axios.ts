import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api';

export const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  withCredentials: true,
});

// Request interceptor untuk menambahkan token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor untuk handle error
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API functions
export const authApi = {
  register: (data: {
    name: string;
    email: string;
    password: string;
    role?: string;
  }) => axiosInstance.post('/auth/register', data),
  
  login: (data: { email: string; password: string }) =>
    axiosInstance.post('/auth/login', data),
  
  logout: () => axiosInstance.post('/auth/logout'),
  
  getMe: () => axiosInstance.get('/auth/me'),
  
  changePassword: (data: { oldPassword: string; newPassword: string }) =>
    axiosInstance.put('/auth/change-password', data),
};

export default axiosInstance;