import React from 'react';

function OrderDetail({ orderData, onBack }) {
  // 🍏 Guard Clause: Jika data orderan belum dimuat atau kosong, tampilin loading
  if (!orderData) {
    return (
      <div className="order-detail-loading">
        ⏳ Memuat detail transaksi dari database...
      </div>
    );
  }

  return (
    <div className="form-container-premium">
      {/* Header Form Detail */}
      <div className="form-header-premium order-detail-header">
        <div>
          <h3>📄 Detail Transaksi Order</h3>
          <p>Menampilkan informasi lengkap pesanan dan item barang dari database.</p>
        </div>
        <button onClick={onBack} className="btn-back-gray">
          ⬅️ Kembali ke List
        </button>
      </div>

      <div className="form-body-premium" style={{ marginTop: '20px' }}>
        
        {/* ================= SECTION 1: INFORMASI PELANGGAN ================= */}
        <div className="order-info-grid">
          <div>
            <label className="order-info-label">Nama Pelanggan</label>
            <div className="order-info-value-bold">
              {orderData.pemesan || orderData.namaPelanggan || '-'}
            </div>
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
            <div className="order-info-value">
              {orderData.noHpPemesan || orderData.telepon || '-'}
            </div>
          </div>
        </div>

        {/* ================= SECTION 2: TABEL ITEM BARANG ================= */}
        <div className="table-header-premium" style={{ paddingLeft: '0', marginBottom: '10px' }}>
          <h4>📦 Daftar Item yang Dipesan</h4>
        </div>
        
        <div className="table-responsive-premium">
          <table className="crud-table-premium" style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#f1f3f5' }}>
                <th style={{ textAlign: 'left', padding: '12px' }}>Nama Barang / Jasa</th>
                <th className="th-harga-satuan">Harga Satuan</th>
                <th className="th-jumlah">Jumlah</th>
                <th className="th-subtotal">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {orderData.items && orderData.items.length > 0 ? (
                orderData.items.map((item, index) => (
                  <tr key={item.id || index} style={{ borderBottom: '1px solid #e9ecef' }}>
                    <td className="td-item-name"><strong>{item.nmBarang || item.namaBarang}</strong></td>
                    <td className="td-item-price">Rp {(item.harga || 0).toLocaleString('id-ID')}</td>
                    <td className="td-item-qty">{item.quantity || item.jumlah || 1} Merek/Pcs</td>
                    <td className="td-item-subtotal">
                      Rp {((item.harga || 0) * (item.quantity || item.jumlah || 1)).toLocaleString('id-ID')}
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

        {/* ================= SECTION 3: RINGKASAN TOTAL ================= */}
        <div className="order-summary-box">
          <div style={{ textAlign: 'right' }}>
            <span className="order-summary-text">Total Keseluruhan:</span>
            <h2 className="order-summary-total">
              Rp {(orderData.totalHarga || orderData.totalAmount || 0).toLocaleString('id-ID')}
            </h2>
          </div>
        </div>

      </div>
    </div>
  );
}

export default OrderDetail;