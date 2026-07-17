import { useEffect, useState } from 'react';
import api from '../services/api'; // Sesuaikan path ini dengan project lu

function TransactionList() {
    const [transaksi, setTransaksi] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('ongoing');


    // Fetch data transaksi dari backend
    useEffect(() => {
        const fetchTransaksi = async () => {
            try {
                const response = await api.get('/transaksi');
                setTransaksi(response.data);
            } catch (error) {
                console.error("Gagal mengambil data transaksi:", error);
                alert("Gagal memuat data transaksi, cek koneksi backend ya!");
            } finally {
                setLoading(false);
            }
        };
        fetchTransaksi();
    }, []);

    return (
        <div className="table-container-premium">
            <div className="table-header-premium">
                <h3>💰 Laporan Transaksi Masuk</h3>
                <p>Riwayat seluruh pembayaran yang sudah lunas.</p>
            </div>

            {loading ? (
                <div style={{ padding: '20px', textAlign: 'center' }}>Memuat data...</div>
            ) : (
                <div className="table-responsive-premium">
                    <table className="crud-table-premium">
                        <thead>
                            <tr>
                                <th>No Invoice</th>
                                <th>Pemesan</th>
                                <th>Tanggal Invoice</th>
                                <th style={{ textAlign: 'right' }}>Total Pendapatan</th>
                            </tr>
                        </thead>
                        <tbody>
                            {transaksi.length > 0 ? (
                                transaksi.map((item, index) => (
                                    <tr key={item.id || index}>
                                        <td>{item.noInvoice || '-'}</td>
                                        <td>{item.pemesan || '-'}</td>
                                        <td>{item.tglInvoice || '-'}</td>
                                        <td style={{ textAlign: 'right', fontWeight: 'bold', color: '#16a34a' }}>
                                            {/* Ganti item.total (kalau masih 0, pakai item.total juga) */}
                                            Rp {item.harga ? item.harga.toLocaleString('id-ID') : 0}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" style={{ textAlign: 'center' }}>Data tidak ditemukan.</td>
                                </tr>
                            )}
                        </tbody>
                        <tfoot>
                            <tr style={{ borderTop: '2px solid #ddd' }}>
                                <td colSpan="3" style={{ textAlign: 'right', fontWeight: 'bold', padding: '15px' }}>Total Keseluruhan:</td>
                                <td style={{ textAlign: 'right', fontWeight: 'bold', padding: '15px', color: '#16a34a' }}>
                                    Rp {transaksi.reduce((sum, item) => sum + (item.harga || 0), 0).toLocaleString('id-ID')}
                                </td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            )}
        </div>
    );
}

export default TransactionList;