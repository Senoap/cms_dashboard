import api from './api';

export const orderService = {
  // Ambil semua transaksi order masuk
  getAll: async () => {
    const response = await api.get('/order');
    return response.data;
  },

  // Simpan transaksi order baru beserta data keranjangnya
  create: async (payload) => {
    const response = await api.post('/order', payload);
    return response.data;
  },

  // 🍏 TAMBAHAN: Aksi hapus transaksi order berdasarkan ID
  delete: async (id) => {
    const response = await api.delete(`/order/${id}`);
    return response.data;
  },

  update: async (id, payload) => {
    const response = await api.put(`/order/${id}`, payload);
    return response.data;
  }
};