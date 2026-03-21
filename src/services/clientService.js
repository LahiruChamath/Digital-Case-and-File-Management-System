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

  addCommunication: async (id, commData) => {
    const { data } = await api.post(`/clients/${id}/communication`, commData);
    return data;
  }
};
