function ManageOrder({ 
  orders, barangList, onOrderSubmit, selectedBarangId, setSelectedBarangId, 
  jumlah, setJumlah, tanggalPesan, setTanggalPesan, tanggalAcara, setTanggalAcara, 
  pemesan, setPemesan, noHpPemesan, setNoHpPemesan, activeTab 
}) {

  if (activeTab === 'create-order') {
    return (
      <div className="form-container-premium" style={{ maxWidth: '850px' }}>
        <div className="form-header-premium">
          <h3>📦 Buat Transaksi Order Baru</h3>
          <p>Catat pesanan pelanggan baru dengan memilih barang dari inventaris.</p>
        </div>
        
        <form onSubmit={onOrderSubmit} className="form-body-premium">
          <div className="form-group-premium">
            <label>Pilih Barang / Aset</label>
            <select value={selectedBarangId} onChange={e => setSelectedBarangId(e.target.value)} required>
              <option value="">-- Silakan Pilih Barang --</option>
              {barangList.map(b => (
                <option key={b.id} value={b.id}>{b.nmBarang}</option>
              ))}
            </select>
          </div>

          <div className="form-group-premium">
            <label>Jumlah Pesanan (Pcs)</label>
            <input type="number" placeholder="Masukkan jumlah pesanan..." value={jumlah} onChange={e => setJumlah(e.target.value)} required />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div className="form-group-premium">
              <label>Tanggal Pesan</label>
              <input type="date" value={tanggalPesan} onChange={e => setTanggalPesan(e.target.value)} required />
            </div>
            <div className="form-group-premium">
              <label>Tanggal Acara</label>
              <input type="date" value={tanggalAcara} onChange={e => setTanggalAcara(e.target.value)} required />
            </div>
          </div>

          <div className="form-group-premium">
            <label>Nama Lengkap Pemesan</label>
            <input type="text" placeholder="Contoh: Bapak Budi" value={pemesan} onChange={e => setPemesan(e.target.value)} required />
          </div>

          <div className="form-group-premium">
            <label>Nomor HP / WhatsApp</label>
            <input type="text" placeholder="Contoh: 081234567xxx" value={noHpPemesan} onChange={e => setNoHpPemesan(e.target.value)} required />
          </div>

          <div className="form-actions-premium">
            <button type="submit" className="btn-submit-premium">
              💾 Simpan Transaksi Order
            </button>
          </div>
        </form>
      </div>
    );
  }

  if (activeTab === 'list-order') {
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
                <th>ID Order</th>
                <th>Nama Pemesan</th>
                <th>Barang</th>
                <th>Jumlah</th>
                <th>Tgl Pesan</th>
                <th>Tgl Acara</th>
                <th>No HP / WA</th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '30px', color: '#888' }}>
                    📭 Belum ada transaksi order masuk.
                  </td>
                </tr>
              ) : (
                orders.map(ord => (
                  <tr key={ord.id}>
                    <td><span className="text-id-premium">#{ord.id}</span></td>
                    <td><strong>{ord.pemesan}</strong></td>
                    <td>{ord.barang ? ord.barang.nmBarang : <span style={{ color: 'red' }}>Aset Terhapus</span>}</td>
                    <td>{ord.jumlah} pcs</td>
                    <td>{ord.tanggalPesan}</td>
                    <td><code className="code-slug-premium">{ord.tanggalAcara}</code></td>
                    <td>{ord.noHpPemesan}</td>
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

export default ManageOrder;