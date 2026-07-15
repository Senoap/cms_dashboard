import React, { useState } from 'react';
import OrderDetailModal from './OrderDetailModal'; // Pastikan path file modal lu sudah benar[cite: 3]
import '../css/OrderModal.css';
import { orderService } from '../services/orderService';

function OrderListView({ orders, onRefreshOrder }) {
    // State internal untuk mengontrol modal detail[cite: 3]
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false); //[cite: 3]
    // 🍏 State untuk tracking ID yang sedang dihapus (efek loading)
    const [deletingId, setDeletingId] = useState(null);

    // Fungsi saat tombol View diklik[cite: 3]
    const handleViewClick = (order) => {
        setSelectedOrder(order); //[cite: 3]
        setIsModalOpen(true); //[cite: 3]
    };

    const handleUpdateOrder = (updatedData) => {
        console.log("Data diperbarui:", updatedData); //[cite: 3]
        setIsModalOpen(false); //[cite: 3]
        if (typeof onRefreshOrder === 'function') onRefreshOrder(); //[cite: 3]
    };

    const handleDeleteClick = async (id, name) => {
        const konfirmasi = window.confirm(`Apakah lu yakin mau menghapus transaksi atas nama "${name}"? Semua detail item belanjaan juga bakal ikut kehapus permanen, cuy.`);

        if (!konfirmasi) return;

        setDeletingId(id);
        try {
            await orderService.delete(id);
            alert("Transaksi order berhasil dihapus!");
            if (typeof onRefreshOrder === 'function') onRefreshOrder(); // Refresh data list tabel
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
                                            className="btn-submit-premium"
                                            style={{
                                                padding: '6px 12px',
                                                fontSize: '12px',
                                                backgroundColor: '#0284c7',
                                                margin: 0,
                                                width: 'auto'
                                            }}
                                        >
                                            👁️ View
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleDeleteClick(ord.id, ord.pemesan)}
                                            disabled={deletingId === ord.id}
                                            className="btn-submit-premium"
                                            style={{
                                                padding: '6px 12px',
                                                fontSize: '12px',
                                                backgroundColor: '#dc2626',
                                                margin: 0,
                                                width: 'auto'
                                            }}
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

            {/* 🍏 SEKARANG MENGGUNAKAN CLASSNAME CSS DARI FILE TERPISAH */}
            {isModalOpen && (
                <div className="modal-overlay-custom">
                    <OrderDetailModal
                        isOpen={isModalOpen} //[cite: 3]
                        onClose={() => setIsModalOpen(false)} //[cite: 3]
                        orderData={selectedOrder} //[cite: 3]
                        onUpdateOrder={handleUpdateOrder} //[cite: 3]
                    />
                </div>
            )}
        </div>
    );
}

export default OrderListView;