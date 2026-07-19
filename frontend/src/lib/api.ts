import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api', // adjust if backend port is different
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export const getWorkspaces = async () => {
  const response = await api.get('/workspaces');
  return response.data.data;
};

export const getWorkspaceById = async (id: string) => {
  const response = await api.get(`/workspaces/${id}`);
  return response.data.data;
};

export default api;
