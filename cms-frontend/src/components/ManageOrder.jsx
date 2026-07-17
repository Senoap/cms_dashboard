import React from 'react';
import { useManageOrder } from '../hooks/useManageOrder';
import OrderListView from './OrderListView';
import OrderCreatorView from './OrderCreatorView';
import '../css/ManageOrder.css'; // Pastikan path import CSS ini sesuai dengan struktur folder lu

function ManageOrder({ orders, barangList, onRefreshOrder, activeTab }) {
  // Panggil hook untuk mengatur semua state & logic
  const hooksData = useManageOrder(barangList, onRefreshOrder);
  
  // Kalkulasi tanggal hari ini
  const todayDate = new Date().toISOString().split('T')[0];

  // Routing Tab
  if (activeTab === 'create-order') {
    return (
      <OrderCreatorView 
        {...hooksData} 
        barangList={barangList} 
        todayDate={todayDate} 
      />
    );
  }

  if (activeTab === 'list-order') {
    return (
      <OrderListView 
        orders={orders} 
        onRefreshOrder={onRefreshOrder} 
      />
    );
  }

  return null;
}

export default ManageOrder;