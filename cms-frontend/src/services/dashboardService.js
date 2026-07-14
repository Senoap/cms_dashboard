import axios from 'axios';
import API_BASE_URL from './api';

export const dashboardService = {
  fetchPosts: async () => {
    const res = await axios.get(`${API_BASE_URL}/api/posts`);
    return res.data;
  },

  fetchBarang: async () => {
    const res = await axios.get(`${API_BASE_URL}/api/barang`);
    return res.data;
  },

  fetchOrders: async () => {
    const res = await axios.get(`${API_BASE_URL}/api/order`);
    return res.data;
  },

  fetchInvoices: async () => {
    const res = await axios.get(`${API_BASE_URL}/api/invoice`);
    return res.data;
  }
};