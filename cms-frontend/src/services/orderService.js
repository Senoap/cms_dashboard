import api from './api';

export const orderService = {
  // Ambil semua transaksi order masuk
  getAll: async () => {
    try {
      const response = await api.get('/order');
      return response.data;
    } catch (err) {
      console.error("❌ [orderService.getAll] Error:", err);
      throw err;
    }
  },

  // Simpan transaksi order baru beserta data keranjangnya
  create: async (payload) => {
    try {
      const response = await api.post('/order', payload);
      return response.data;
    } catch (err) {
      console.error("❌ [orderService.create] Error:", err);
      throw err;
    }
  },

  // Aksi hapus transaksi order berdasarkan ID
  delete: async (id) => {
    try {
      const response = await api.delete(`/order/${id}`);
      return response.data;
    } catch (err) {
      console.error(`❌ [orderService.delete] Error ID ${id}:`, err);
      throw err;
    }
  },

  // Update transaksi order
  update: async (id, payload) => {
    try {
      const response = await api.put(`/order/${id}`, payload);
      return response.data;
    } catch (err) {
      console.error(`❌ [orderService.update] Error ID ${id}:`, err);
      throw err;
    }
  }
};