import api from './api';

export const dashboardService = {
  fetchPosts: async () => {
    try {
      const res = await api.get('/posts');
      return res.data;
    } catch (err) {
      console.error("❌ [dashboardService.fetchPosts] Error:", err);
      throw err;
    }
  },

  fetchBarang: async () => {
    try {
      const res = await api.get('/barang');
      return res.data;
    } catch (err) {
      console.error("❌ [dashboardService.fetchBarang] Error:", err);
      throw err;
    }
  },

  fetchOrders: async () => {
    try {
      // 🍏 Endpoint disesuaikan ke '/order'
      const res = await api.get('/order');
      return res.data;
    } catch (err) {
      console.error("❌ [dashboardService.fetchOrders] Error:", err);
      throw err;
    }
  },

  fetchInvoices: async () => {
    try {
      // 🍏 Endpoint disesuaikan ke '/invoice'
      const res = await api.get('/invoice');
      return res.data;
    } catch (err) {
      console.error("❌ [dashboardService.fetchInvoices] Error:", err);
      throw err;
    }
  }
};