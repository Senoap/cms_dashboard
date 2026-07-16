import { useState } from 'react';
import OrderDetailModal from './OrderDetailModal';
import '../css/OrderModal.css';
import '../css/OrderList.css';
import { orderService } from '../services/orderService';
import { printSuratJalan } from '../services/printService';

function OrderListView({ orders, onRefreshOrder }) {
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [deletingId, setDeletingId] = useState(null);
    
    // 🍏 STATE BARU UNTUK TAB
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

    const formatTanggal = (tanggalString) => {
        if (!tanggalString) return "-";
        const date = new Date(tanggalString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}-${month}-${year}`; // Hasilnya jadi DD-MM-YYYY
    };

    const handlePrintSuratJalan = (order) => {
        // Contoh: Admin bisa edit catatan sebelum cetak
        const catatanUser = prompt("Masukkan catatan untuk surat jalan:", "Pesanan harap dicek kembali.");

        if (catatanUser !== null) {
            printSuratJalan(order, {
                namaToko: "Pinarak Langgeng Baru",
                catatan: catatanUser
            });
        }
    };

    const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
    const [orderToPrint, setOrderToPrint] = useState(null);

    const initiatePrint = (order) => {
        setOrderToPrint(order);
        setIsPrintModalOpen(true);
    };

    const executePrint = (config) => {
        printSuratJalan(orderToPrint, config);
        setIsPrintModalOpen(false);
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

    // 🍏 LOGIKA FILTER BERDASARKAN TAB
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

            {/* 🍏 UI UNTUK TOMBOL TAB */}
            <div style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
                <button 
                    onClick={() => setActiveTab('ongoing')}
                    style={{ 
                        padding: '10px 20px', 
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontWeight: 'bold',
                        color: 'white',
                        backgroundColor: activeTab === 'ongoing' ? '#4f46e5' : '#9ca3af',
                        transition: 'background-color 0.3s'
                    }}
                >
                    ⏳ Ongoing ({orders.filter(o => o.statusOrder !== 'Pengiriman').length})
                </button>
                <button 
                    onClick={() => setActiveTab('selesai')}
                    style={{ 
                        padding: '10px 20px', 
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontWeight: 'bold',
                        color: 'white',
                        backgroundColor: activeTab === 'selesai' ? '#10b981' : '#9ca3af',
                        transition: 'background-color 0.3s'
                    }}
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
                        {/* 🍏 GANTI orders.length JADI filteredOrders.length */}
                        {filteredOrders.length === 0 ? (
                            <tr>
                                <td colSpan="5" style={{ textAlign: 'center', padding: '20px', color: '#888' }}>
                                    📭 Belum ada data order untuk kategori ini.
                                </td>
                            </tr>
                        ) : (
                            // 🍏 GANTI orders.map JADI filteredOrders.map
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
                                            style={{
                                                cursor: order.statusOrder === "Pengiriman" ? 'not-allowed' : 'pointer'
                                            }}
                                        >
                                            <option value="Order Baru">Order Baru</option>
                                            <option value="Konfirmasi">Konfirmasi</option>
                                            <option value="Pengiriman">Pengiriman</option>
                                        </select>
                                    </td>
                                    <td className="action-container-premium">
                                        <button
                                            onClick={() => handlePrintSuratJalan(order)}
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
                                        <button onClick={() => handleViewClick(order)} className="btn-premium-info" style={{ marginLeft: '8px' }}>
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