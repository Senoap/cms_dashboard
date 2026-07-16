import { useState } from 'react';
import { orderService } from '../services/orderService';
import '../css/OrderModal.css';

function OrderDetailModal({ isOpen, onClose, orderData, onUpdateOrder }) {
  if (!isOpen || !orderData) return null;

  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState(orderData);

  const handleSave = async () => {
    try {
      await orderService.update(editForm.id, editForm);
      onUpdateOrder(editForm);
      setIsEditing(false);
      alert("Order berhasil diupdate!");
    } catch (err) {
      alert("Gagal update data!");
      console.error(err);
    }
  };

  return (
    <div className="modal-content-premium">
      <div className="modal-header-premium">
        <h3>{isEditing ? "✏️ Edit Transaksi" : "👁️ Detail Transaksi Order"}</h3>
        <button onClick={onClose} className="btn-close-modal">&times;</button>
      </div>

      <div className="modal-body-premium" style={{ maxHeight: '65vh', overflowY: 'auto', paddingRight: '4px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '25px' }}>
          
          {/* Field: Pemesan */}
          <div className="form-group">
            <label>Nama Pemesan</label>
            {isEditing ? (
              <input value={editForm.pemesan} onChange={(e) => setEditForm({...editForm, pemesan: e.target.value})} className="form-input-premium" />
            ) : (
              <p className="modal-text-value">{orderData.pemesan}</p>
            )}
          </div>

          {/* Field: No HP */}
          <div className="form-group">
            <label>Nomor HP / WA</label>
            {isEditing ? (
              <input value={editForm.noHpPemesan} onChange={(e) => setEditForm({...editForm, noHpPemesan: e.target.value})} className="form-input-premium" />
            ) : (
              <p className="modal-text-value">{orderData.noHpPemesan}</p>
            )}
          </div>

          {/* Field: Tanggal Pesan */}
          <div className="form-group">
            <label>Tanggal Pesan</label>
            {isEditing ? (
              <input type="date" value={editForm.tanggalPesan} onChange={(e) => setEditForm({...editForm, tanggalPesan: e.target.value})} className="form-input-premium" />
            ) : (
              <p className="modal-text-value">{orderData.tanggalPesan}</p>
            )}
          </div>

          {/* Field: Tanggal Acara */}
          <div className="form-group">
            <label>Tanggal Acara</label>
            {isEditing ? (
              <input type="date" value={editForm.tanggalAcara} onChange={(e) => setEditForm({...editForm, tanggalAcara: e.target.value})} className="form-input-premium" />
            ) : (
              <p className="modal-text-value">{orderData.tanggalAcara}</p>
            )}
          </div>

          {/* Field: Alamat */}
          <div style={{ gridColumn: 'span 2' }} className="form-group">
            <label>Alamat Pengiriman</label>
            {isEditing ? (
              <textarea value={editForm.alamat} onChange={(e) => setEditForm({...editForm, alamat: e.target.value})} className="form-input-premium" />
            ) : (
              <p className="modal-text-value" style={{ whiteSpace: 'pre-wrap' }}>{orderData.alamat}</p>
            )}
          </div>
        </div>

        {/* Tabel Item Tetap */}
        <h4 style={{ marginBottom: '10px' }}>📦 Daftar Item Barang</h4>
        <table style={{ width: '100%', fontSize: '14px', marginBottom: '20px' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #e2e8f0' }}>
              <th style={{ textAlign: 'left' }}>Nama Barang</th>
              <th style={{ textAlign: 'right' }}>Harga</th>
              <th style={{ textAlign: 'center' }}>Qty</th>
              <th style={{ textAlign: 'right' }}>Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {(orderData.details || []).map((item, index) => (
              <tr key={item.id || index} style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '10px 0' }}>{item.barang?.nmBarang || 'Barang Terhapus'}</td>
                <td style={{ textAlign: 'right' }}>Rp {(item.barang?.harga || 0).toLocaleString('id-ID')}</td>
                <td style={{ textAlign: 'center' }}>{item.jumlah} pcs</td>
                <td style={{ textAlign: 'right', color: '#16a34a' }}>Rp {(item.subTotal || 0).toLocaleString('id-ID')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer Aksi */}
      <div className="modal-actions" style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '20px' }}>
        {!isEditing ? (
          <button 
            onClick={() => setIsEditing(true)} 
            className="btn-edit"
            disabled={orderData.statusOrder === 'Pengiriman'}
            style={{ opacity: orderData.statusOrder === 'Pengiriman' ? 0.5 : 1 }}
          >
            {orderData.statusOrder === 'Pengiriman' ? "🔒 Terkunci" : "✏️ Edit Order"}
          </button>
        ) : (
          <>
            <button onClick={handleSave} className="btn-save">💾 Simpan Perubahan</button>
            <button onClick={() => setIsEditing(false)} className="btn-cancel">❌ Batal</button>
          </>
        )}
        <button onClick={onClose} className="btn-close">Tutup</button>
      </div>
    </div>
  );
}

export default OrderDetailModal;