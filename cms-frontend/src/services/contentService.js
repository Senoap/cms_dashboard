import api from './api';

export const contentService = {
  // Ambil semua artikel
  getAll: async () => {
    try {
      const response = await api.get('/posts');
      return response.data;
    } catch (err) {
      console.error("❌ [contentService.getAll] Error:", err);
      throw err;
    }
  },

  // Tambah artikel baru
  create: async (payload) => {
    try {
      const response = await api.post('/posts', payload);
      return response.data;
    } catch (err) {
      console.error("❌ [contentService.create] Error:", err);
      throw err;
    }
  },

  // Update artikel berdasarkan ID
  update: async (id, payload) => {
    try {
      const response = await api.put(`/posts/${id}`, payload);
      return response.data;
    } catch (err) {
      console.error(`❌ [contentService.update] Error ID ${id}:`, err);
      throw err;
    }
  },

  // Hapus artikel
  delete: async (id) => {
    try {
      const response = await api.delete(`/posts/${id}`);
      return response.data;
    } catch (err) {
      console.error(`❌ [contentService.delete] Error ID ${id}:`, err);
      throw err;
    }
  }
};