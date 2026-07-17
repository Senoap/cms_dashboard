import { useEffect, useState } from 'react';
import api from '../services/api'; 
import '../css/TransactionList.css'; // Pastikan path impor CSS ini sesuai folder lu

function TransactionList() {
    const [transaksi, setTransaksi] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('ongoing'); // Tetap disimpan jika dibutuhkan navigasi parent

    // Fetch data transaksi dari backend saat komponen dimuat
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
                <div className="loading-text">Memuat data...</div>
            ) : (
                <div className="table-responsive-premium">
                    <table className="crud-table-premium">
                        <thead>
                            <tr>
                                <th>No Invoice</th>
                                <th>Pemesan</th>
                                <th>Tanggal Invoice</th>
                                <th className="text-right">Total Pendapatan</th>
                            </tr>
                        </thead>
                        <tbody>
                            {transaksi.length > 0 ? (
                                transaksi.map((item, index) => (
                                    <tr key={item.id || index}>
                                        <td>{item.noInvoice || '-'}</td>
                                        <td>{item.pemesan || '-'}</td>
                                        <td>{item.tglInvoice || '-'}</td>
                                        <td className="text-right font-bold text-success">
                                            Rp {item.harga ? item.harga.toLocaleString('id-ID') : 0}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="text-center">Data tidak ditemukan.</td>
                                </tr>
                            )}
                        </tbody>
                        <tfoot>
                            <tr className="table-footer-row">
                                <td colSpan="3" className="table-footer-cell">Total Keseluruhan:</td>
                                <td className="table-footer-cell text-success">
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