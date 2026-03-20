import api from './api';

export const invoiceService = {
  generateAndDownload: async (caseId, caseNumber) => {
    try {
      const response = await api.get(`/invoices/generate/${caseId}`, {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Invoice_${caseNumber}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Invoice download failed', error);
      throw error;
    }
  },

  getAll: async () => {
    const { data } = await api.get('/invoices');
    return data;
  }
};
