// 1. PASTIKAN SUDAH IMPORT useState DI SINI, CUY!
import { useState } from 'react';
import { formatSecureInvoiceNumber as formatInvoiceNumber, DB_CONFIG } from '../utils/securityHelper';

// 2. Gunakan props yang sudah dikirim dari Dashboard (newNamaBarang & setNewNamaBarang)
function ManageInventory({ barangList, handleAddBarang, newNamaBarang, setNewNamaBarang, activeTab,
  hargaBarang, setHargaBarang, onDeleteBarang, onEditBarang }) {

  // Hapus baris const [nmBarang, setNmBarang] karena sudah diwakili oleh props di atas!
  // Cukup buat satu state ini saja untuk menampung harga inputan baru:
  // const [hargaBarang, setHargaBarang] = useState(''); 

  // ... sisa kode fungsi handleAddBarang dan return JSX lu ke bawah ...

  if (activeTab === 'create-barang') {
    return (
      <div className="form-container-premium">
        <div className="form-header-premium">
          <h3>➕ Tambah Master Barang Baru</h3>
          <p>Masukkan data barang atau aset baru ke dalam inventaris Pinarak Langgeng.</p>
        </div>

        <form onSubmit={handleAddBarang} className="form-body-premium">
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
            <button type="submit" className="btn-submit-premium">
              💾 Simpan Master Barang
            </button>
          </div>
        </form>
      </div>
    );
  }
  // Taruh fungsi ini di dalam ManageInventory sebelum blok return JSX
  const handleDeleteClick = (id, nama) => {
    // 🍏 Pop-up konfirmasi bawaan browser yang rapi & aman
    const yakin = window.confirm(`Apakah Anda yakin ingin menghapus barang "${nama}"?`);

    if (yakin) {
      // Jika admin klik OK, panggil fungsi onDeleteBarang yang dikirim dari Dashboard
      onDeleteBarang(id);
    }
  };
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
                <th style={{ width: '80px' }}>ID</th>
                <th>Nama Barang / Jasa</th>
                <th style={{ width: '180px', textAlign: 'right' }}>Harga Sewa</th>
                <th style={{ width: '180px', textAlign: 'center' }}>Aksi</th> {/* 🍏 TAMBAH HEADER INI */}
              </tr>
            </thead>
            <tbody>
              {barangList.length === 0 ? (
                <tr>
                  <td colSpan="4" style={{ textAlign: 'center', padding: '20px', color: '#888' }}>📭 Belum ada data barang.</td>
                </tr>
              ) : (
                barangList.map((b, index) => (
                  <tr key={b.id || index}>
                    <td>{b.id}</td>
                    <td><strong>{b.nmBarang}</strong></td>
                    <td style={{ textAlign: 'right', fontWeight: 'bold', color: '#34c759' }}>
                      Rp {(b.harga || 0).toLocaleString('id-ID')}
                    </td>
                    {/* 🍏 KEDUA TOMBOL AKSI BARU */}
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
      </div>
    );
  }

  return null;
}

export default ManageInventory;