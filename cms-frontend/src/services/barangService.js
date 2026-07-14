import api from './api'; // Pastikan Axios instance lu di api.js sudah benar

export const barangService = {
  // Ambil semua data barang
  getAll: async () => {
    const response = await api.get('/barang');
    return response.data;
  },

  // Tambah barang baru
  create: async (payload) => {
    const response = await api.post('/barang', payload);
    return response.data;
  },

  // Update data barang berdasarkan ID
  update: async (id, payload) => {
    const response = await api.put(`/barang/${id}`, payload);
    return response.data;
  },

  // Hapus data barang
  delete: async (id) => {
    const response = await api.delete(`/barang/${id}`);
    return response.data;
  }
};