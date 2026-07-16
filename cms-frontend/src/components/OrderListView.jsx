import { useState } from 'react';
import OrderDetailModal from './OrderDetailModal';
import '../css/OrderModal.css';
import '../css/OrderList.css';
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

    const handlePrintSuratJalan = (id) => {
        // Nanti kita arahkan ke halaman cetak atau buka modal
        alert("Fitur Cetak Surat Jalan untuk Order ID: " + id);
    };

    const handleStatusChange = async (id, newStatus) => {
        try {
            await orderService.updateStatusOrder(id, newStatus);
            // Panggil fungsi refresh list biar UI update otomatis
            onRefreshOrder();
            alert("Status berhasil diperbarui!");
        } catch (err) {
            alert("Gagal update status.");
        }
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
                            <th>Status</th>
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
                            orders.map((order) => (
                                <tr key={order.id}>
                                    <td><strong>{order.pemesan}</strong></td>
                                    <td>{order.tanggalPesan}</td>
                                    <td><code className="code-slug-premium">{order.tanggalAcara}</code></td>
                                    <td>
                                        <select
                                            value={order.statusOrder || "Order Baru"}
                                            onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                            className="status-dropdown-premium"
                                        >
                                            <option value="Order Baru">Order Baru</option>
                                            <option value="Konfirmasi">Konfirmasi</option>
                                            <option value="Pengiriman">Pengiriman</option>
                                        </select>
                                    </td>
                                    <td className="action-container-premium">
                                        <button
                                            onClick={() => handlePrintSuratJalan(order.id)}
                                            className="btn-premium-info" // Lu bisa ganti class sesuai warna yang lu mau
                                            disabled={order.statusOrder !== "Pengiriman"} // 🔒 KUNCI DI SINI
                                            style={{
                                                marginLeft: '8px',
                                                backgroundColor: order.statusOrder === "Pengiriman" ? '#10b981' : '#4b5563', // Hijau kalau aktif, abu kalau mati
                                                cursor: order.statusOrder === "Pengiriman" ? 'pointer' : 'not-allowed'
                                            }}
                                        >
                                            🚚 Surat Jalan
                                        </button>
                                        <button onClick={() => handleViewClick(order)} className="btn-premium-info">
                                            👁️ View
                                        </button>
                                        <button
                                            onClick={() => handleDeleteClick(order.id, order.pemesan)}
                                            // 🔒 Tombol hapus jadi disable jika status sudah 'Pengiriman'
                                            disabled={deletingId === order.id || order.statusOrder === "Pengiriman"}
                                            className="btn-premium-danger"
                                            style={{
                                                marginLeft: '8px',
                                                // Opsional: kasih indikator visual kalau tombolnya mati
                                                opacity: order.statusOrder === "Pengiriman" ? 0.5 : 1,
                                                cursor: order.statusOrder === "Pengiriman" ? 'not-allowed' : 'pointer'
                                            }}
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