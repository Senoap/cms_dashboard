import axios from 'axios';

const API_URL = 'http://localhost:8081/api/barang';

export const barangService = {
  // 1. Ambil semua barang
  getAll: async () => {
    const response = await axios.get(API_URL);
    return response.data;
  },

  // 2. Tambah barang baru
  create: async (dataBarang) => {
    const response = await axios.post(API_URL, dataBarang);
    return response.data;
  },

  // 3. Edit / Update barang berdasarkan ID
  update: async (id, dataBarang) => {
    // Memastikan key dikirim sebagai "nmBarang" dan "harga" sesuai kebutuhan backend
    const response = await axios.put(`${API_URL}/${id}`, {
      nmBarang: dataBarang.nmBarang,
      harga: Number(dataBarang.harga),
    });
    return response.data;
  },

  // 4. Hapus barang
  delete: async (id) => {
    const response = await axios.delete(`${`${API_URL}/${id}`}`);
    return response.data;
  }
};