import api from './api';

export const adminService = {
  getUsers: async () => {
    const { data } = await api.get('/admin/users');
    return data;
  },

  toggleUserStatus: async (userId) => {
    const { data } = await api.put(`/admin/users/${userId}/toggle-status`);
    return data;
  },

  getSystemHealth: async () => {
    const { data } = await api.get('/admin/system/health');
    return data;
  }
};
