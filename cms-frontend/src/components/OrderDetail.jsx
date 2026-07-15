function OrderDetail({ orderData, onBack }) {
  if (!orderData) {
    return (
      <div className="order-detail-loading">
        ⏳ Memuat detail transaksi dari database...
      </div>
    );
  }

  return (
    <div className="form-container-premium">
      <div className="form-header-premium order-detail-header">
        <div>
          <h3>📄 Detail Transaksi Order</h3>
          <p>Menampilkan informasi lengkap pesanan dan item barang dari database.</p>
        </div>
        <button onClick={onBack} className="btn-premium-secondary">⬅️ Kembali ke List</button>
      </div>

      <div className="form-body-premium" style={{ marginTop: '20px' }}>
        
        {/* INFORMASI PELANGGAN */}
        <div className="order-info-grid">
          <div>
            <label className="order-info-label">Nama Pelanggan</label>
            <div className="order-info-value-bold">{orderData.pemesan || '-'}</div>
          </div>
          
          <div>
            <label className="order-info-label">Tanggal Order</label>
            <div className="order-info-value">
              {orderData.tanggalPesan ? new Date(orderData.tanggalPesan).toLocaleDateString('id-ID', {
                day: 'numeric', month: 'long', year: 'numeric'
              }) : '-'}
            </div>
          </div>

          <div>
            <label className="order-info-label">Status Pembayaran</label>
            <div className="order-info-value">
              <span className={`status-badge ${orderData.status === 'LUNAS' ? 'lunas' : 'pending'}`}>
                {orderData.status || 'PENDING'}
              </span>
            </div>
          </div>

          <div>
            <label className="order-info-label">Nomor Telepon</label>
            <div className="order-info-value">{orderData.noHpPemesan || '-'}</div>
          </div>

          <div style={{ gridColumn: 'span 2', marginTop: '10px' }}>
            <label className="order-info-label">Alamat Pengiriman / Lokasi Acara</label>
            <div className="order-info-value" style={{ background: '#f8fafc', padding: '10px', borderRadius: '6px', border: '1px solid #e2e8f0', minHeight: '40px' }}>
              {orderData.alamat || 'Tidak ada alamat pengiriman tercatat.'}
            </div>
          </div>
        </div>

        {/* TABEL ITEM BARANG */}
        <div className="table-header-premium" style={{ paddingLeft: '0', marginBottom: '10px' }}>
          <h4>📦 Daftar Item yang Dipesan</h4>
        </div>
        
        <div className="table-responsive-premium">
          <table className="crud-table-premium" style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#f1f3f5' }}>
                <th style={{ textAlign: 'left', padding: '12px' }}>Nama Barang / Jasa</th>
                <th style={{ textAlign: 'right' }}>Harga Satuan</th>
                <th style={{ textAlign: 'center' }}>Jumlah</th>
                <th style={{ textAlign: 'right' }}>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {orderData.details && orderData.details.length > 0 ? (
                orderData.details.map((item, index) => (
                  <tr key={item.id || index} style={{ borderBottom: '1px solid #e9ecef' }}>
                    <td className="td-item-name">
                      <strong>{item.barang ? item.barang.nmBarang : 'Barang Tidak Diketahui'}</strong>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      Rp {item.barang ? (item.barang.harga || 0).toLocaleString('id-ID') : 0}
                    </td>
                    <td style={{ textAlign: 'center' }}>{item.jumlah || 0} Pcs</td>
                    <td style={{ textAlign: 'right' }}>
                      Rp {(item.subTotal || 0).toLocaleString('id-ID')}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" style={{ textAlign: 'center', padding: '20px', color: '#888' }}>📭 Tidak ada rincian item barang.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* RINGKASAN TOTAL */}
        <div className="order-summary-box">
          <div style={{ textAlign: 'right' }}>
            <span className="order-summary-text">Total Keseluruhan:</span>
            <h2 style={{ color: '#16a34a', fontWeight: 'bold' }}>
              Rp {(orderData.harga || 0).toLocaleString('id-ID')}
            </h2>
          </div>
        </div>

      </div>
    </div>
  );
}

export default OrderDetail;