import api from './api';

export const expenseService = {
  record: async (expenseData) => {
    const { data } = await api.post('/expenses', expenseData);
    return data;
  },

  getCaseExpenses: async (caseId) => {
    const { data } = await api.get(`/expenses/case/${caseId}`);
    return data;
  },

  getAll: async () => {
    const { data } = await api.get('/expenses');
    return data;
  }
};
