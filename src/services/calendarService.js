import api from './api';

export const calendarService = {
  create: async (eventData) => {
    const { data } = await api.post('/calendar', eventData);
    return data;
  },

  getAll: async () => {
    const { data } = await api.get('/calendar');
    return data;
  },

  update: async (id, eventData) => {
    const { data } = await api.put(`/calendar/${id}`, eventData);
    return data;
  }
};
