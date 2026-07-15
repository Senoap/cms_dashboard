import { useState, useEffect } from 'react';
import { dashboardService } from '../services/dashboardService';

export function useDashboardData() {
  const [posts, setPosts] = useState([]);
  const [barangList, setBarangList] = useState([]);
  const [orders, setOrders] = useState([]);
  const [invoices, setInvoices] = useState([]);

  const loadPosts = async () => { try { const data = await dashboardService.fetchPosts(); setPosts(data); } catch (e) { console.error(e); } };
  const loadBarang = async () => { try { const data = await dashboardService.fetchBarang(); setBarangList(data); } catch (e) { console.error(e); } };
  const loadOrders = async () => { try { const data = await dashboardService.fetchOrders(); setOrders(data); } catch (e) { console.error(e); } };
  const loadInvoices = async () => { try { const data = await dashboardService.fetchInvoices(); setInvoices(data); } catch (e) { console.error(e); } };

  useEffect(() => {
    loadPosts();
    loadBarang();
    loadOrders();
    loadInvoices();
  }, []);

  return { posts, barangList, orders, invoices, loadPosts, loadBarang, loadOrders, loadInvoices };
}