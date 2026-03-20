import api from './api';

export const adminService = {
  getUsers: async () => {
    const { data } = await api.get('/admin/users');
    return data;
  },

  createUser: async (userData) => {
    const { data } = await api.post('/admin/users', userData);
    return data;
  },

  updateUserRole: async (userId, role) => {
    const { data } = await api.put(`/admin/users/${userId}/role`, { role });
    return data;
  },

  toggleUserStatus: async (userId) => {
    const { data } = await api.put(`/admin/users/${userId}/toggle-status`);
    return data;
  },

  getSystemHealth: async () => {
    const { data } = await api.get('/admin/system/health');
    return data;
  },

  triggerBackup: async () => {
    const { data } = await api.post('/admin/backup');
    return data;
  },

  getBackups: async () => {
    const { data } = await api.get('/admin/backups');
    return data;
  },

  getSystemStats: async () => {
    const { data } = await api.get('/system/stats');
    return data;
  }
};
