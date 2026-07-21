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

export const createWorkspace = async (data: any) => {
  const response = await api.post('/workspaces', data);
  return response.data.data;
};

export const getWorkspaceStats = async (id: string) => {
  const response = await api.get(`/workspaces/${id}/stats`);
  return response.data.data;
};

export const addMemberToWorkspace = async (workspaceId: string, email: string, role: string) => {
  const response = await api.post(`/workspaces/${workspaceId}/members`, { email, role });
  return response.data.data;
};

export const getTasks = async (workspaceId: string) => {
  const response = await api.get(`/workspaces/${workspaceId}/tasks`);
  return response.data.data.tasks;
};

export const createTask = async (workspaceId: string, data: any) => {
  // Use FormData if attachments exist, otherwise JSON
  if (data instanceof FormData) {
    const response = await api.post(`/workspaces/${workspaceId}/tasks`, data, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data.data;
  }
  const response = await api.post(`/workspaces/${workspaceId}/tasks`, data);
  return response.data.data;
};

export const updateTaskStatus = async (taskId: string, status: string) => {
  const response = await api.patch(`/tasks/${taskId}/status`, { status });
  return response.data.data;
};

export const markAllNotificationsRead = async () => {
  const response = await api.put(`/notifications/read-all`)
  return response.data
}

export const getWorkspaceMessages = async (workspaceId: string, channel: string = 'General') => {
  const response = await api.get(`/workspaces/${workspaceId}/messages?channel=${channel}`)
  return response.data.data.messages
}

export const sendMessage = async (workspaceId: string, data: any) => {
  // data can be FormData if it contains attachments
  const response = await api.post(`/workspaces/${workspaceId}/messages`, data)
  return response.data.data
}

export const getNotifications = async () => {
  const response = await api.get('/notifications');
  return response.data.data;
};

export const markNotificationRead = async (id: string) => {
  const response = await api.patch(`/notifications/${id}/read`);
  return response.data.data;
};

export const getWorkspaceActivity = async (workspaceId: string) => {
  const response = await api.get(`/workspaces/${workspaceId}/activity`);
  return response.data.data;
};


export const updateProfile = async (data: any) => {
  const response = await api.put('/auth/profile', data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return response.data.user;
};

export const createChannel = async (workspaceId: string, data: { name: string; isPrivate?: boolean }) => {
  const response = await api.post(`/workspaces/${workspaceId}/channels`, data);
  return response.data.data;
};

export const getTaskComments = async (taskId: string) => {
  const response = await api.get(`/tasks/${taskId}/comments`);
  return response.data.data;
};

export const addTaskComment = async (taskId: string, content: string) => {
  const response = await api.post(`/tasks/${taskId}/comments`, { content });
  return response.data.data;
};

export const updateTask = async (taskId: string, data: any) => {
  const response = await api.patch(`/tasks/${taskId}`, data);
  return response.data.data;
};

export const deleteTask = async (taskId: string) => {
  const response = await api.delete(`/tasks/${taskId}`);
  return response.data.data;
};

export const assignTask = async (taskId: string, assigneeId: string) => {
  const response = await api.patch(`/tasks/${taskId}/assign`, { assigneeId });
  return response.data.data;
};

export const globalSearch = async (workspaceId: string, q: string) => {
  const response = await api.get(`/workspaces/${workspaceId}/search?q=${q}`);
  return response.data.data;
};

export const acceptInvitation = async (notificationId: string) => {
  const response = await api.post(`/notifications/${notificationId}/accept`);
  return response.data.data;
};

export const rejectInvitation = async (notificationId: string) => {
  const response = await api.post(`/notifications/${notificationId}/reject`);
  return response.data.data;
};

export const removeMemberFromWorkspace = async (workspaceId: string, userId: string) => {
  const response = await api.delete(`/workspaces/${workspaceId}/members/${userId}`);
  return response.data.data;
};

export const deleteChannel = async (workspaceId: string, channelName: string) => {
  const response = await api.delete(`/workspaces/${workspaceId}/channels/${channelName}`);
  return response.data.data;
};

export default api;