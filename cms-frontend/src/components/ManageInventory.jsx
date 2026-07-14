import { useState } from 'react';
import { barangService } from '../services/barangService'; // 🍏 Menggunakan service yang sama

function ManageInventory({ barangList, onRefreshBarang, activeTab, onEditBarang }) {
  const [newNamaBarang, setNewNamaBarang] = useState('');
  const [hargaBarang, setHargaBarang] = useState('');
  const [loading, setLoading] = useState(false);

  // State pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = barangList.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(barangList.length / itemsPerPage);

  // Handle Tambah Barang Langsung via Service
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        nmBarang: newNamaBarang,
        harga: parseInt(hargaBarang, 10) || 0
      };

      await barangService.create(payload);
      alert('Barang berhasil ditambahkan!');
      
      // Reset form & refresh data ke dashboard utama
      setNewNamaBarang('');
      setHargaBarang('');
      onRefreshBarang();
    } catch (err) {
      console.error(err);
      alert('Gagal menambah barang baru, cuy!');
    } finally {
      setLoading(false);
    }
  };

  // Handle Hapus Barang Langsung via Service
  const handleDeleteClick = async (id, nama) => {
    const yakin = window.confirm(`Apakah Anda yakin ingin menghapus barang "${nama}"?`);
    if (!yakin) return;

    try {
      await barangService.delete(id);
      alert('Barang berhasil dihapus!');
      onRefreshBarang();
    } catch (err) {
      console.error(err);
      alert('Gagal menghapus barang!');
    }
  };

  if (activeTab === 'create-barang') {
    return (
      <div className="form-container-premium">
        <div className="form-header-premium">
          <h3>➕ Tambah Master Barang Baru</h3>
          <p>Masukkan data barang atau aset baru ke dalam inventaris Pinarak Langgeng.</p>
        </div>

        <form onSubmit={handleSubmit} className="form-body-premium">
          <div className="form-group-premium">
            <label>Nama Barang / Aset</label>
            <input
              type="text"
              placeholder="Contoh: Kursi Futura, Tenda Sarnafil VIP"
              value={newNamaBarang}
              onChange={e => setNewNamaBarang(e.target.value)}
              required
            />
          </div>

          <div className="form-group-premium">
            <label>Harga Sewa (Rp)</label>
            <input
              type="number"
              placeholder="Contoh: 50000"
              value={hargaBarang}
              onChange={e => setHargaBarang(e.target.value)}
              required
            />
          </div>

          <div className="form-actions-premium">
            <button type="submit" disabled={loading} className="btn-submit-premium">
              {loading ? "Menyimpan..." : "💾 Simpan Master Barang"}
            </button>
          </div>
        </form>
      </div>
    );
  }

  if (activeTab === 'list-barang') {
    return (
      <div className="table-container-premium">
        <div className="table-header-premium">
          <h3>📋 Daftar Stok / Master Barang</h3>
          <p>Semua aset yang tersedia dan bisa dipilih saat membuat transaksi order.</p>
        </div>

        <div className="table-responsive-premium">
          <table className="crud-table-premium">
            <thead>
              <tr>
                <th>Nama Barang / Jasa</th>
                <th style={{ width: '180px', textAlign: 'right' }}>Harga Sewa</th>
                <th style={{ width: '180px', textAlign: 'center' }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.length === 0 ? (
                <tr>
                  <td colSpan="3" style={{ textAlign: 'center', padding: '20px', color: '#888' }}>📭 Belum ada data barang.</td>
                </tr>
              ) : (
                currentItems.map((b, index) => (
                  <tr key={b.id || index}>
                    <td><strong>{b.nmBarang}</strong></td>
                    <td style={{ textAlign: 'right', fontWeight: 'bold', color: '#34c759' }}>
                      Rp {(b.harga || 0).toLocaleString('id-ID')}
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <button
                        onClick={() => onEditBarang(b)}
                        className="btn-action-edit"
                        style={{ marginRight: '8px', backgroundColor: 'rgba(0, 122, 255, 0.1)', color: '#007aff', borderColor: 'rgba(0, 122, 255, 0.2)', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer' }}
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => handleDeleteClick(b.id, b.nmBarang)}
                        className="btn-action-delete"
                        style={{ backgroundColor: 'rgba(255, 59, 48, 0.1)', color: '#ff3b30', borderColor: 'rgba(255, 59, 48, 0.2)', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer' }}
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '15px', marginTop: '20px', paddingBottom: '10px' }}>
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              style={{ padding: '8px 16px', borderRadius: '6px', border: '1px solid #ccc', cursor: currentPage === 1 ? 'not-allowed' : 'pointer', opacity: currentPage === 1 ? 0.5 : 1 }}
            >
              ⬅️ Previous
            </button>
            <span style={{ fontWeight: 'bold', color: '#333' }}>Halaman {currentPage} dari {totalPages}</span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              style={{ padding: '8px 16px', borderRadius: '6px', border: '1px solid #ccc', cursor: currentPage === totalPages ? 'not-allowed' : 'pointer', opacity: currentPage === totalPages ? 0.5 : 1 }}
            >
              Next ➡️
            </button>
          </div>
        )}
      </div>
    );
  }

  return null;
}

export default ManageInventory;