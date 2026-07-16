import { useState } from 'react';
import { orderService } from '../services/orderService';
import '../css/OrderModal.css';

function OrderDetailModal({ isOpen, onClose, orderData, onUpdateOrder }) {
  if (!isOpen || !orderData) return null;

  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState(orderData);

  const handleSave = async () => {
    try {
      const grandTotal = editForm.details.reduce((sum, item) => sum + item.subTotal, 0);
      const dataToSave = { ...editForm, harga: grandTotal };
      
      await orderService.update(editForm.id, dataToSave);
      onUpdateOrder(dataToSave);
      setIsEditing(false);
      alert("Order berhasil diupdate!");
    } catch (err) {
      alert("Gagal update data!");
      console.error(err);
    }
  };

  const handleDetailChange = (index, field, value) => {
    const updatedDetails = [...editForm.details];
    updatedDetails[index][field] = value;

    if (field === 'jumlah') {
      const hargaSatuan = updatedDetails[index].barang?.harga || 0;
      updatedDetails[index].subTotal = hargaSatuan * parseInt(value || 0);
    }

    setEditForm({ ...editForm, details: updatedDetails });
  };

  return (
    <div className="modal-content-premium">
      <div className="modal-header-premium">
        <h3>{isEditing ? "✏️ Edit Transaksi" : "👁️ Detail Transaksi Order"}</h3>
        <button onClick={onClose} className="btn-close-modal">&times;</button>
      </div>

      <div className="modal-body-premium">
        <div className="modal-grid-container">
          <div className="modal-form-group">
            <label>Nama Pemesan</label>
            {isEditing ? (
              <input value={editForm.pemesan} onChange={(e) => setEditForm({...editForm, pemesan: e.target.value})} className="form-input-premium" />
            ) : (
              <p className="modal-text-value">{editForm.pemesan}</p>
            )}
          </div>
          <div className="modal-form-group">
            <label>Nomor HP / WA</label>
            {isEditing ? (
              <input value={editForm.noHpPemesan} onChange={(e) => setEditForm({...editForm, noHpPemesan: e.target.value})} className="form-input-premium" />
            ) : (
              <p className="modal-text-value">{editForm.noHpPemesan}</p>
            )}
          </div>
          <div className="modal-form-group">
            <label>Tanggal Pesan</label>
            {isEditing ? (
              <input type="date" value={editForm.tanggalPesan} onChange={(e) => setEditForm({...editForm, tanggalPesan: e.target.value})} className="form-input-premium" />
            ) : (
              <p className="modal-text-value">{editForm.tanggalPesan}</p>
            )}
          </div>
          <div className="modal-form-group">
            <label>Tanggal Acara</label>
            {isEditing ? (
              <input type="date" value={editForm.tanggalAcara} onChange={(e) => setEditForm({...editForm, tanggalAcara: e.target.value})} className="form-input-premium" />
            ) : (
              <p className="modal-text-value">{editForm.tanggalAcara}</p>
            )}
          </div>
          <div className="modal-form-group" style={{ gridColumn: 'span 2' }}>
            <label>Alamat Pengiriman</label>
            {isEditing ? (
              <textarea value={editForm.alamat} onChange={(e) => setEditForm({...editForm, alamat: e.target.value})} className="form-input-premium" />
            ) : (
              <p className="modal-text-value">{editForm.alamat}</p>
            )}
          </div>
        </div>

        <h4>📦 Daftar Item Barang</h4>
        <table className="modal-table">
          <thead>
            <tr>
              <th>Nama Barang</th>
              {/* <th>Harga</th> */}
              <th>Qty</th>
              {/* <th>Subtotal</th> */}
            </tr>
          </thead>
          <tbody>
            {editForm.details.map((item, index) => (
              <tr key={index}>
                <td>{item.barang?.nmBarang || 'Barang Terhapus'}</td>
                {/* <td>Rp {(item.barang?.harga || 0).toLocaleString('id-ID')}</td> */}
                <td>
                  {isEditing ? (
                    <input type="number" value={item.jumlah} onChange={(e) => handleDetailChange(index, 'jumlah', e.target.value)} className="qty-input" />
                  ) : (
                    `${item.jumlah} pcs`
                  )}
                </td>
                {/* <td>Rp {(item.subTotal || 0).toLocaleString('id-ID')}</td> */}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="modal-actions">
        {!isEditing ? (
          <button 
            onClick={() => setIsEditing(true)} 
            className="btn-edit"
            disabled={editForm.statusOrder === 'Pengiriman'}
          >
            {editForm.statusOrder === 'Pengiriman' ? "🔒 Terkunci" : "✏️ Edit Order"}
          </button>
        ) : (
          <>
            <button onClick={handleSave} className="btn-save">💾 Simpan Perubahan</button>
            <button onClick={() => { setIsEditing(false); setEditForm(orderData); }} className="btn-cancel">❌ Batal</button>
          </>
        )}
        <button onClick={onClose} className="btn-close">Tutup</button>
      </div>
    </div>
  );
}

export default OrderDetailModal;