import React, { useState, useEffect } from 'react';

function OrderDetailModal({ isOpen, onClose, orderData, onUpdateOrder }) {
  // State untuk form edit data utama orderan
  const [pemesan, setPemesan] = useState('');
  const [noHpPemesan, setNoHpPemesan] = useState('');
  const [status, setStatus] = useState('PENDING');

  // Sinkronisasi data ketika modal dibuka dengan data orderan tertentu
  useEffect(() => {
    if (orderData) {
      setPemesan(orderData.pemesan || orderData.namaPelanggan || '');
      setNoHpPemesan(orderData.noHpPemesan || orderData.telepon || '');
      setStatus(orderData.status || 'PENDING');
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
      status
    };
    onUpdateOrder(updatedData);
  };

  return (
    <div className="modal-overlay-premium">
      <div className="modal-content-premium" style={{ maxWidth: '700px', width: '90%' }}>
        
        {/* Header Modal */}
        <div className="modal-header-premium" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e9ecef', paddingBottom: '15px' }}>
          <h3 style={{ margin: 0 }}>📝 Detail & Edit Order Transaksi</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#888' }}>&times;</button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Body Modal */}
          <div className="modal-body-premium" style={{ padding: '20px 0', maxHeight: '70vh', overflowY: 'auto' }}>
            
            {/* FORM EDIT DATA UTAMA */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px' }}>
              <div>
                <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>Nama Pemesan / Pelanggan</label>
                <input 
                  type="text" 
                  value={pemesan} 
                  onChange={(e) => setPemesan(e.target.value)} 
                  required 
                  style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                />
              </div>
              <div>
                <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>Nomor Telepon</label>
                <input 
                  type="text" 
                  value={noHpPemesan} 
                  onChange={(e) => setNoHpPemesan(e.target.value)} 
                  required 
                  style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                />
              </div>
              <div style={{ gridColumn: 'span 2' }}>
                <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>Status Pembayaran</label>
                <select 
                  value={status} 
                  onChange={(e) => setStatus(e.target.value)} 
                  style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                >
                  <option value="PENDING">PENDING</option>
                  <option value="LUNAS">LUNAS</option>
                  <option value="BATAL">BATAL</option>
                </select>
              </div>
            </div>

            {/* DETAIL TABEL ITEM YANG DIPESAN (READ ONLY DETAIL) */}
            <h4 style={{ marginBottom: '10px', marginTop: '20px' }}>📦 Daftar Item Barang</h4>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
              <thead>
                <tr style={{ backgroundColor: '#f8f9fa', borderBottom: '2px solid #dee2e6' }}>
                  <th style={{ textAlign: 'left', padding: '10px' }}>Nama Barang</th>
                  <th style={{ textAlign: 'right', padding: '10px' }}>Harga</th>
                  <th style={{ textAlign: 'center', padding: '10px' }}>Qty</th>
                  <th style={{ textAlign: 'right', padding: '10px' }}>Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {orderData.items && orderData.items.length > 0 ? (
                  orderData.items.map((item, index) => (
                    <tr key={item.id || index} style={{ borderBottom: '1px solid #eee' }}>
                      <td style={{ padding: '10px' }}>{item.nmBarang || item.namaBarang}</td>
                      <td style={{ textAlign: 'right', padding: '10px' }}>Rp {(item.harga || 0).toLocaleString('id-ID')}</td>
                      <td style={{ textAlign: 'center', padding: '10px' }}>{item.quantity || item.jumlah || 1}</td>
                      <td style={{ textAlign: 'right', padding: '10px' }}>
                        Rp {((item.harga || 0) * (item.quantity || item.jumlah || 1)).toLocaleString('id-ID')}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" style={{ textAlign: 'center', padding: '10px', color: '#888' }}>Tidak ada rincian item.</td>
                  </tr>
                )}
              </tbody>
            </table>

            {/* TOTAL HARGA */}
            <div style={{ textAlign: 'right', marginTop: '15px', padding: '10px', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
              <strong>Total Keseluruhan: </strong>
              <span style={{ color: '#28a745', fontWeight: 'bold', fontSize: '16px' }}>
                Rp {(orderData.totalHarga || 0).toLocaleString('id-ID')}
              </span>
            </div>

          </div>

          {/* Footer Modal Action */}
          <div className="modal-footer-premium" style={{ borderTop: '1px solid #e9ecef', paddingTop: '15px', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
            <button type="button" onClick={onClose} style={{ padding: '8px 16px', backgroundColor: '#6c757d', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
              Batal
            </button>
            <button type="submit" style={{ padding: '8px 16px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
              Simpan Perubahan
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}

export default OrderDetailModal;