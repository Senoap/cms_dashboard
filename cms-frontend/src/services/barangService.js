import api from './api';

export const barangService = {
  // Ambil semua data barang
  getAll: async () => {
    try {
      const response = await api.get('/barang');
      return response.data;
    } catch (err) {
      console.error("❌ [barangService.getAll] Error:", err);
      throw err;
    }
  },

  // Tambah barang baru
  create: async (payload) => {
    try {
      const response = await api.post('/barang', payload);
      return response.data;
    } catch (err) {
      console.error("❌ [barangService.create] Error:", err);
      throw err;
    }
  },

  // Update data barang berdasarkan ID
  update: async (id, payload) => {
    try {
      const response = await api.put(`/barang/${id}`, payload);
      return response.data;
    } catch (err) {
      console.error(`❌ [barangService.update] Error ID ${id}:`, err);
      throw err;
    }
  },

  // Hapus data barang
  delete: async (id) => {
    try {
      const response = await api.delete(`/barang/${id}`);
      return response.data;
    } catch (err) {
      console.error(`❌ [barangService.delete] Error ID ${id}:`, err);
      throw err;
    }
  }
};