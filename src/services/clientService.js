import api from './api';

export const clientService = {
  register: async (clientData) => {
    const { data } = await api.post('/clients', clientData);
    return data;
  },

  getAll: async (params) => {
    const { data } = await api.get('/clients', { params });
    return data;
  },

  update: async (id, clientData) => {
    const { data } = await api.put(`/clients/${id}`, clientData);
    return data;
  },

  addCommunication: async (id, commData) => {
    const { data } = await api.post(`/clients/${id}/communication`, commData);
    return data;
  },

  delete: async (clientId) => {
    const { data } = await api.delete(`/clients/${clientId}`);
    return data;
  }
};
