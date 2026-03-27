import api from './api';

export const authService = {
  getLawyers: async () => {
    const { data } = await api.get('/auth/lawyers');
    return data;
  }
};
