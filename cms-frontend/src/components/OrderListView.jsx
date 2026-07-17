import React, { useState } from 'react';
import OrderDetailModal from './OrderDetailModal';
import { orderService } from '../services/orderService';
import { printSuratJalan } from '../services/printService';
import '../css/OrderList.css';
import '../css/OrderModal.css';

function OrderListView({ orders, onRefreshOrder }) {
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [deletingId, setDeletingId] = useState(null);
    const [activeTab, setActiveTab] = useState('ongoing');

    const handleViewClick = (order) => {
        setSelectedOrder(order);
        setIsModalOpen(true);
    };

    const handleUpdateOrder = (updatedData) => {
        console.log("Data diperbarui:", updatedData);
        setIsModalOpen(false);
        if (typeof onRefreshOrder === 'function') onRefreshOrder();
    };

    const handlePrintSuratJalan = (order) => {
        const catatanUser = prompt("Masukkan catatan untuk surat jalan:", "Pesanan harap dicek kembali.");
        if (catatanUser !== null) {
            printSuratJalan(order, {
                namaToko: "Pinarak Langgeng Baru",
                catatan: catatanUser
            });
        }
    };

    const handleStatusChange = async (id, newStatus) => {
        try {
            await orderService.updateStatusOrder(id, newStatus);
            onRefreshOrder();
            alert("Status berhasil diperbarui!");
        } catch (err) {
            alert("Gagal update status.");
        }
    };

    const handleDeleteClick = async (id, name) => {
        const konfirmasi = window.confirm(`Apakah lu yakin mau menghapus transaksi atas nama "${name}"? Semua detail item belanjaan juga bakal ikut kehapus permanen.`);
        if (!konfirmasi) return;

        setDeletingId(id);
        try {
            await orderService.delete(id);
            alert("Transaksi order berhasil dihapus!");
            if (typeof onRefreshOrder === 'function') onRefreshOrder();
        } catch (err) {
            console.error(err);
            alert("Gagal menghapus transaksi order!");
        } finally {
            setDeletingId(null);
        }
    };

    // Filter berdasarkan Tab
    const filteredOrders = orders.filter(order => {
        if (activeTab === 'ongoing') return order.statusOrder !== 'Pengiriman';
        if (activeTab === 'selesai') return order.statusOrder === 'Pengiriman';
        return true;
    });

    return (
        <div className="table-container-premium" style={{ maxWidth: '100%' }}>
            <div className="table-header-premium">
                <h3>📋 Daftar Transaksi Masuk</h3>
                <p>Seluruh riwayat pesanan pelanggan yang masuk ke Pinarak Langgeng.</p>
            </div>

            {/* TAB BUTTONS */}
            <div className="tab-container">
                <button 
                    onClick={() => setActiveTab('ongoing')}
                    className={`btn-tab ongoing ${activeTab === 'ongoing' ? 'active' : 'inactive'}`}
                >
                    ⏳ Ongoing ({orders.filter(o => o.statusOrder !== 'Pengiriman').length})
                </button>
                <button 
                    onClick={() => setActiveTab('selesai')}
                    className={`btn-tab selesai ${activeTab === 'selesai' ? 'active' : 'inactive'}`}
                >
                    ✅ Selesai ({orders.filter(o => o.statusOrder === 'Pengiriman').length})
                </button>
            </div>

            <div className="table-responsive-premium">
                <table className="crud-table-premium">
                    <thead>
                        <tr>
                            <th>Nama Pemesan</th>
                            <th>Tgl Pesan</th>
                            <th>Tgl Acara</th>
                            <th>Status</th>
                            <th style={{ textAlign: 'center' }}>Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredOrders.length === 0 ? (
                            <tr>
                                <td colSpan="5" style={{ textAlign: 'center', padding: '20px', color: '#888' }}>
                                    📭 Belum ada data order untuk kategori ini.
                                </td>
                            </tr>
                        ) : (
                            filteredOrders.map((order) => (
                                <tr key={order.id}>
                                    <td><strong>{order.pemesan}</strong></td>
                                    <td>{order.tanggalPesan}</td>
                                    <td><code className="code-slug-premium">{order.tanggalAcara}</code></td>
                                    <td>
                                        <select
                                            value={order.statusOrder || "Order Baru"}
                                            onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                            className="status-dropdown-premium"
                                            disabled={order.statusOrder === "Pengiriman"}
                                        >
                                            <option value="Order Baru">Order Baru</option>
                                            <option value="Konfirmasi">Konfirmasi</option>
                                            <option value="Pengiriman">Pengiriman</option>
                                        </select>
                                    </td>
                                    <td className="action-container-premium">
                                        <button
                                            onClick={() => handlePrintSuratJalan(order)}
                                            className={`btn-premium-info btn-surat-jalan ${order.statusOrder === "Pengiriman" ? 'active' : ''}`}
                                            disabled={order.statusOrder !== "Pengiriman"}
                                        >
                                            🚚 Surat Jalan
                                        </button>
                                        <button onClick={() => handleViewClick(order)} className="btn-premium-info">
                                            👁️ View
                                        </button>
                                        <button
                                            onClick={() => handleDeleteClick(order.id, order.pemesan)}
                                            disabled={deletingId === order.id || order.statusOrder === "Pengiriman"}
                                            className="btn-premium-danger btn-delete-order"
                                        >
                                            {deletingId === order.id ? "⏳..." : "🗑️ Hapus"}
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {isModalOpen && (
                <div className="modal-overlay-custom">
                    <OrderDetailModal
                        isOpen={isModalOpen}
                        onClose={() => setIsModalOpen(false)}
                        orderData={selectedOrder}
                        onUpdateOrder={handleUpdateOrder}
                    />
                </div>
            )}
        </div>
    );
}

export default OrderListView;