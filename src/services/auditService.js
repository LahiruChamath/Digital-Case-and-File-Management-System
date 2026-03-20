import api from './api';

const auditService = {
  getAuditLogs: async (params = {}) => {
    const queryParams = new URLSearchParams(params);
    const response = await api.get(`/system/audit-logs?${queryParams}`);
    return response.data;
  },
  exportAuditLogs: async (params = {}) => {
    const queryParams = new URLSearchParams(params);
    const response = await api.get(`/system/audit-logs/export?${queryParams}`, { responseType: 'blob' });
    return response.data;
  },
};

export default auditService;
