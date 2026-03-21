import api from './api';

const searchService = {
  globalSearch: async (query, filters = {}) => {
    const params = new URLSearchParams({ q: query, ...filters });
    const response = await api.get(`/search?${params}`);
    return response.data;
  },
  searchCases: async (query) => {
    const response = await api.get(`/search/cases?q=${query}`);
    return response.data;
  },
  searchDocuments: async (query) => {
    const response = await api.get(`/search/documents?q=${query}`);
    return response.data;
  },
  searchClients: async (query) => {
    const response = await api.get(`/search/clients?q=${query}`);
    return response.data;
  },
};

export default searchService;
