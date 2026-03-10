import api from './api';

const systemService = {
  getSettings: async () => { const response = await api.get('/system/settings'); return response.data; },
  updateSettings: async (settings) => { const response = await api.put('/system/settings', settings); return response.data; },
  getSystemHealth: async () => { const response = await api.get('/system/health'); return response.data; },
  getSystemStats: async () => { const response = await api.get('/system/stats'); return response.data; },
};

export default systemService;
