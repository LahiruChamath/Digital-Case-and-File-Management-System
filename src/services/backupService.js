import api from './api';

const backupService = {
  createBackup: async () => { const response = await api.post('/backup/create'); return response.data; },
  getBackups: async () => { const response = await api.get('/backup'); return response.data; },
  getBackupById: async (id) => { const response = await api.get(`/backup/${id}`); return response.data; },
  verifyBackup: async (id) => { const response = await api.post(`/backup/${id}/verify`); return response.data; },
  restoreBackup: async (id) => { const response = await api.post(`/backup/${id}/restore`); return response.data; },
  deleteBackup: async (id) => { const response = await api.delete(`/backup/${id}`); return response.data; },
  getLatestStatus: async () => { const response = await api.get('/backup/status/latest'); return response.data; },
};

export default backupService;
