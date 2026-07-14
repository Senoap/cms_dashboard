import api from './api';

export const orderService = {
  // Ambil semua transaksi order masuk
  getAll: async () => {
    const response = await api.get('/orders');
    return response.data;
  },

  // Simpan transaksi order baru beserta data keranjangnya
  create: async (payload) => {
    const response = await api.post('/orders', payload);
    return response.data;
  }
};