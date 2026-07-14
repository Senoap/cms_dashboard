import api from './api';

export const contentService = {
  // Ambil semua artikel
  getAll: async () => {
    const response = await api.get('/posts');
    return response.data;
  },

  // Tambah artikel baru
  create: async (payload) => {
    const response = await api.post('/posts', payload);
    return response.data;
  },

  // Update artikel berdasarkan ID
  update: async (id, payload) => {
    const response = await api.put(`/posts/${id}`, payload);
    return response.data;
  },

  // Hapus artikel
  delete: async (id) => {
    const response = await api.delete(`/posts/${id}`);
    return response.data;
  }
};