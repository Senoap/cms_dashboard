import api from './api';

export const invoiceService = {
  // Ambil semua riwayat invoice dari backend
  getAll: async () => {
    const response = await api.get('/invoice');
    return response.data;
  },

  // Simpan data invoice baru
  create: async (payload) => {
    const response = await api.post('/invoice', payload);
    return response.data;
  },

  // Opsional: Simpan konfigurasi template ke backend agar permanen (tidak hilang saat di-refresh)
  saveTemplate: async (payload) => {
    const response = await api.put('/invoice/template', payload);
    return response.data;
  }
};