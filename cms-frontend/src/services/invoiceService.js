import api from './api';

export const invoiceService = {
  // Ambil semua riwayat invoice dari backend
  getAll: async () => {
    try {
      const response = await api.get('/invoice');
      return response.data;
    } catch (err) {
      console.error("❌ [invoiceService.getAll] Error:", err);
      throw err;
    }
  },

  // Simpan data invoice baru
  create: async (payload) => {
    try {
      const response = await api.post('/invoice', payload);
      return response.data;
    } catch (err) {
      console.error("❌ [invoiceService.create] Error:", err);
      throw err;
    }
  },

  // Simpan konfigurasi template ke backend agar permanen
  saveTemplate: async (payload) => {
    try {
      const response = await api.put('/invoice/template', payload);
      return response.data;
    } catch (err) {
      console.error("❌ [invoiceService.saveTemplate] Error:", err);
      throw err;
    }
  }
};