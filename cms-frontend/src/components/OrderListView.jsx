import { useState } from 'react';
import OrderDetailModal from './OrderDetailModal'; 
import '../css/OrderModal.css';
import { orderService } from '../services/orderService';

function OrderListView({ orders, onRefreshOrder }) {
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false); 
    const [deletingId, setDeletingId] = useState(null);

    const handleViewClick = (order) => {
        setSelectedOrder(order); 
        setIsModalOpen(true); 
    };

    const handleUpdateOrder = (updatedData) => {
        console.log("Data diperbarui:", updatedData); 
        setIsModalOpen(false); 
        if (typeof onRefreshOrder === 'function') onRefreshOrder(); 
    };

    const handleDeleteClick = async (id, name) => {
        const konfirmasi = window.confirm(`Apakah lu yakin mau menghapus transaksi atas nama "${name}"? Semua detail item belanjaan juga bakal ikut kehapus permanen, cuy.`);
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

    return (
        <div className="table-container-premium" style={{ maxWidth: '100%' }}>
            <div className="table-header-premium">
                <h3>📋 Daftar Transaksi Masuk</h3>
                <p>Seluruh riwayat pesanan pelanggan yang masuk ke Pinarak Langgeng.</p>
            </div>

            <div className="table-responsive-premium">
                <table className="crud-table-premium">
                    <thead>
                        <tr>
                            <th>Nama Pemesan</th>
                            <th>Tgl Pesan</th>
                            <th>Tgl Acara</th>
                            <th style={{ textAlign: 'center' }}>Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.length === 0 ? (
                            <tr>
                                <td colSpan="4" style={{ textAlign: 'center', padding: '20px', color: '#888' }}>
                                    📭 Belum ada data order masuk.
                                </td>
                            </tr>
                        ) : (
                            orders.map((ord) => (
                                <tr key={ord.id}>
                                    <td><strong>{ord.pemesan}</strong></td>
                                    <td>{ord.tanggalPesan}</td>
                                    <td><code className="code-slug-premium">{ord.tanggalAcara}</code></td>
                                    <td style={{ textAlign: 'center' }}>
                                        <button
                                            type="button"
                                            onClick={() => handleViewClick(ord)}
                                            className="btn-premium-info"
                                        >
                                            👁️ View
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleDeleteClick(ord.id, ord.pemesan)}
                                            disabled={deletingId === ord.id}
                                            className="btn-premium-danger"
                                            style={{ marginLeft: '8px' }}
                                        >
                                            {deletingId === ord.id ? "⏳..." : "🗑️ Hapus"}
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