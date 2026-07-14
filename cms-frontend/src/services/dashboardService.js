import api from './api'; 

export const dashboardService = {
  fetchPosts: async () => {
    const res = await api.get('/posts'); 
    return res.data;
  },

  fetchBarang: async () => {
    const res = await api.get('/barang'); 
    return res.data;
  },

  fetchOrders: async () => {
    // 🍏 Diubah dari '/orders' menjadi '/order' agar tidak 404
    const res = await api.get('/order'); 
    return res.data;
  },

  fetchInvoices: async () => {
    // 🍏 Diubah dari '/invoices' menjadi '/invoice' agar tidak 404
    const res = await api.get('/invoice'); 
    return res.data;
  }
};