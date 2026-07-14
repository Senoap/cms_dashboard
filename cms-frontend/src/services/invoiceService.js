import api from './api';

export const invoiceService = {
  // Ambil semua riwayat invoice dari backend
  getAll: async () => {
    const response = await api.get('/invoices');
    return response.data;
  },

  // Simpan data invoice baru
  create: async (payload) => {
    const response = await api.post('/invoices', payload);
    return response.data;
  },

  // Opsional: Simpan konfigurasi template ke backend agar permanen (tidak hilang saat di-refresh)
  saveTemplate: async (payload) => {
    const response = await api.put('/invoices/template', payload);
    return response.data;
  }
};