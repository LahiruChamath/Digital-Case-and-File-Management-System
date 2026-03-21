import api from './api';

export const caseService = {
  create: async (caseData) => {
    const { data } = await api.post('/cases', caseData);
    return data;
  },

  getAll: async (params) => {
    const { data } = await api.get('/cases', { params });
    return data;
  },

  update: async (id, caseData) => {
    const { data } = await api.put(`/cases/${id}`, caseData);
    return data;
  },

  updateStatus: async (id, status) => {
    const { data } = await api.put(`/cases/${id}/status`, { status });
    return data;
  },

  close: async (id) => {
    const { data } = await api.put(`/cases/${id}/close`);
    return data;
  },

  addNote: async (id, content) => {
    const { data } = await api.post(`/cases/${id}/notes`, { content });
    return data;
  }
};
