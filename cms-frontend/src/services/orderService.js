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
  }
};