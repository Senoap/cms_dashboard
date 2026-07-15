import React, { useState, useEffect } from 'react';
import '../css/OrderModal.css'; // Memastikan style presisi terpasang

function OrderDetailModal({ isOpen, onClose, orderData, onUpdateOrder }) {
  // State untuk form edit data utama orderan dari tbl_order
  const [pemesan, setPemesan] = useState('');
  const [noHpPemesan, setNoHpPemesan] = useState('');
  const [tanggalPesan, setTanggalPesan] = useState('');
  const [tanggalAcara, setTanggalAcara] = useState('');
  const [status, setStatus] = useState('PENDING');
  const [alamat, setAlamat] = useState('');

  // Sinkronisasi seluruh field data ketika modal dibuka dengan data orderan tertentu
  useEffect(() => {
    if (orderData) {
      setPemesan(orderData.pemesan || '');
      setNoHpPemesan(orderData.noHpPemesan || '');
      setTanggalPesan(orderData.tanggalPesan || '');
      setTanggalAcara(orderData.tanggalAcara || '');
      setStatus(orderData.status || 'PENDING');
      setAlamat(orderData.alamat || '');
    }
  }, [orderData, isOpen]);

  if (!isOpen || !orderData) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    // Susun data yang diperbarui untuk dikirim ke backend/parent
    const updatedData = {
      ...orderData,
      pemesan,
      noHpPemesan,
      tanggalPesan,
      tanggalAcara,
      status,
      alamat
    };
    onUpdateOrder(updatedData);
  };

  return (
    <div className="modal-content-premium">

      {/* Header Modal */}
      <div className="modal-header-premium">
        <h3>📝 Detail & Edit Order Transaksi</h3>
        <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#888' }}>&times;</button>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Body Modal */}
        <div className="modal-body-premium" style={{ maxHeight: '65vh', overflowY: 'auto', paddingRight: '4px' }}>

          {/* ================= GRID DATA UTAMA DARI TBL_ORDER ================= */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
            <div>
              <label>Nama Pemesan / Pelanggan</label>
              <input
                type="text"
                value={pemesan}
                onChange={(e) => setPemesan(e.target.value)}
                required
              />
            </div>
            <div>
              <label>Nomor Telepon / WA</label>
              <input
                type="text"
                value={noHpPemesan}
                onChange={(e) => setNoHpPemesan(e.target.value)}
                required
              />
            </div>
            <div>
              <label>Tanggal Pesan</label>
              <input
                type="date"
                value={tanggalPesan}
                onChange={(e) => setTanggalPesan(e.target.value)}
                required
              />
            </div>
            <div>
              <label>Tanggal Acara</label>
              <input
                type="date"
                value={tanggalAcara}
                onChange={(e) => setTanggalAcara(e.target.value)}
                required
              />
            </div>

            {/* 🍏 ALAMAT PENGIRIMAN DILETAKKAN DI SINI (GRID UTAMA) - AMAN DARI ERROR TBODY */}
            <div style={{ gridColumn: 'span 2' }}>
              <label>Alamat Pengiriman / Lokasi Acara</label>
              <textarea
                value={alamat}
                onChange={(e) => setAlamat(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '9px 12px',
                  borderRadius: '6px',
                  border: '1px solid #cbd5e1',
                  minHeight: '60px',
                  boxSizing: 'border-box',
                  fontFamily: 'inherit',
                  fontSize: '14px'
                }}
              />
            </div>

            <div style={{ gridColumn: 'span 2' }}>
              <label>Status Pembayaran</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="PENDING">PENDING</option>
                <option value="LUNAS">LUNAS</option>
                <option value="BATAL">BATAL</option>
              </select>
            </div>
          </div>

          {/* ================= TABEL ITEM DARI TBL_ORDER_DETAIL ================= */}
          <h4>📦 Daftar Item Barang</h4>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
            <thead>
              <tr>
                <th style={{ textAlign: 'left' }}>Nama Barang</th>
                <th style={{ textAlign: 'right' }}>Harga</th>
                <th style={{ textAlign: 'center' }}>Qty</th>
                <th style={{ textAlign: 'right' }}>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {(orderData.details || orderData.items || []).length > 0 ? (
                (orderData.details || orderData.items).map((item, index) => (
                  <tr key={item.id || index}>
                    <td style={{ textAlign: 'left' }}>
                      {item.barang ? item.barang.nmBarang : 'Barang Terhapus'}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      Rp {item.barang ? (item.barang.harga || 0).toLocaleString('id-ID') : 0}
                    </td>
                    <td style={{ textAlign: 'center' }}>{item.jumlah || 0} pcs</td>
                    <td style={{ textAlign: 'right', fontWeight: '500' }}>
                      Rp {(item.subTotal || 0).toLocaleString('id-ID')}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" style={{ textAlign: 'center', color: '#888', padding: '15px' }}>
                    📭 Tidak ada rincian item ditemukan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* TOTAL HARGA */}
          <div className="modal-summary-box-custom">
            <strong>Total Keseluruhan:</strong>
            <span>
              Rp {(orderData.harga || 0).toLocaleString('id-ID')}
            </span>
          </div>

        </div>

        {/* Footer Modal Action */}
        <div className="modal-footer-premium">
          <button type="button" onClick={onClose}>
            Batal
          </button>
          <button type="submit">
            Simpan Perubahan
          </button>
        </div>
      </form>

    </div>
  );
}

export default OrderDetailModal;