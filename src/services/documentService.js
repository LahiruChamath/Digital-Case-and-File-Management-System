import api from './api';

export const documentService = {
  upload: async (documentData) => {
    const formData = new FormData();
    Object.keys(documentData).forEach(key => {
      formData.append(key, documentData[key]);
    });
    const { data } = await api.post('/documents/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return data;
  },

  updateVersion: async (id, file) => {
    const formData = new FormData();
    formData.append('file', file);
    const { data } = await api.put(`/documents/${id}/version`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return data;
  },

  search: async (query = '') => {
    const { data } = await api.get(`/documents/search?query=${query}`);
    return data;
  },

  upload: async (formData) => {
    const { data } = await api.post('/documents/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return data;
  },

  delete: async (id) => {
    const { data } = await api.delete(`/documents/${id}`);
    return data;
  }
};
