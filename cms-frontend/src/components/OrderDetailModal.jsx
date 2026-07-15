import React, { useEffect, useState } from 'react';
import '../css/OrderModal.css'; // Memastikan style presisi terpasang

function OrderDetailModal({ isOpen, onClose, orderData }) {
  // State untuk form view data utama orderan dari tbl_order
  const [pemesan, setPemesan] = useState('');
  const [noHpPemesan, setNoHpPemesan] = useState('');
  const [tanggalPesan, setTanggalPesan] = useState('');
  const [tanggalAcara, setTanggalAcara] = useState('');
  const [alamat, setAlamat] = useState('');

  // Sinkronisasi seluruh field data ketika modal dibuka dengan data orderan tertentu
  useEffect(() => {
    if (orderData) {
      setPemesan(orderData.pemesan || '');
      setNoHpPemesan(orderData.noHpPemesan || '');
      setTanggalPesan(orderData.tanggalPesan || '');
      setTanggalAcara(orderData.tanggalAcara || '');
      setAlamat(orderData.alamat || '');
    }
  }, [orderData, isOpen]);

  if (!isOpen || !orderData) return null;

  return (
    <div className="modal-content-premium">

      {/* Header Modal */}
      <div className="modal-header-premium">
        <h3>👁️ Detail Transaksi Order</h3>
        <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#888' }}>&times;</button>
      </div>

      {/* Body Modal */}
      <div className="modal-body-premium" style={{ maxHeight: '65vh', overflowY: 'auto', paddingRight: '4px' }}>

        {/* ================= GRID DATA UTAMA DARI TBL_ORDER ================= */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '25px' }}>
          <div style={{ background: '#f8fafc', padding: '10px 14px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
            <label style={{ display: 'block', fontSize: '12px', color: '#64748b', fontWeight: '600', marginBottom: '4px' }}>Nama Pemesan / Pelanggan</label>
            <span style={{ fontSize: '14px', color: '#1e293b', fontWeight: '500' }}>{pemesan}</span>
          </div>
          
          <div style={{ background: '#f8fafc', padding: '10px 14px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
            <label style={{ display: 'block', fontSize: '12px', color: '#64748b', fontWeight: '600', marginBottom: '4px' }}>Nomor Telepon / WA</label>
            <span style={{ fontSize: '14px', color: '#1e293b', fontWeight: '500' }}>{noHpPemesan}</span>
          </div>
          
          <div style={{ background: '#f8fafc', padding: '10px 14px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
            <label style={{ display: 'block', fontSize: '12px', color: '#64748b', fontWeight: '600', marginBottom: '4px' }}>Tanggal Pesan</label>
            <span style={{ fontSize: '14px', color: '#1e293b', fontWeight: '500' }}>{tanggalPesan}</span>
          </div>
          
          <div style={{ background: '#f8fafc', padding: '10px 14px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
            <label style={{ display: 'block', fontSize: '12px', color: '#64748b', fontWeight: '600', marginBottom: '4px' }}>Tanggal Acara</label>
            <span style={{ fontSize: '14px', color: '#1e293b', fontWeight: '500' }}>{tanggalAcara}</span>
          </div>

          <div style={{ gridColumn: 'span 2', background: '#f8fafc', padding: '10px 14px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
            <label style={{ display: 'block', fontSize: '12px', color: '#64748b', fontWeight: '600', marginBottom: '4px' }}>Alamat Pengiriman / Lokasi Acara</label>
            <span style={{ fontSize: '14px', color: '#1e293b', fontWeight: '500', display: 'block', whiteSpace: 'pre-wrap' }}>{alamat}</span>
          </div>
        </div>

        {/* ================= TABEL ITEM DARI TBL_ORDER_DETAIL ================= */}
        <h4 style={{ marginBottom: '10px', color: '#1e293b' }}>📦 Daftar Item Barang</h4>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #e2e8f0' }}>
              <th style={{ textAlign: 'left', padding: '8px 0' }}>Nama Barang</th>
              <th style={{ textAlign: 'right', padding: '8px 0' }}>Harga</th>
              <th style={{ textAlign: 'center', padding: '8px 0' }}>Qty</th>
              <th style={{ textAlign: 'right', padding: '8px 0' }}>Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {(orderData.details || orderData.items || []).length > 0 ? (
              (orderData.details || orderData.items).map((item, index) => (
                <tr key={item.id || index} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ textAlign: 'left', padding: '10px 0' }}>
                    {item.barang ? item.barang.nmBarang : 'Barang Terhapus'}
                  </td>
                  <td style={{ textAlign: 'right', padding: '10px 0' }}>
                    Rp {item.barang ? (item.barang.harga || 0).toLocaleString('id-ID') : 0}
                  </td>
                  <td style={{ textAlign: 'center', padding: '10px 0' }}>{item.jumlah || 0} pcs</td>
                  <td style={{ textAlign: 'right', padding: '10px 0', fontWeight: '500', color: '#16a34a' }}>
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
          <span style={{ color: '#2563eb', fontSize: '18px', fontWeight: 'bold' }}>
            Rp {(orderData.harga || 0).toLocaleString('id-ID')}
          </span>
        </div>

      </div>

      {/* Footer Modal Action */}
      <div className="modal-footer-premium" style={{ justifyContent: 'flex-end', borderTop: '1px solid #e2e8f0', paddingTop: '15px' }}>
        <button type="button" onClick={onClose} style={{ backgroundColor: '#475569', color: '#fff', padding: '8px 16px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontWeight: '600' }}>
          Tutup Halaman
        </button>
      </div>

    </div>
  );
}

export default OrderDetailModal;