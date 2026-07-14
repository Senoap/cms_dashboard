import React, { useState, useEffect } from 'react';
import { barangService } from '../services/barangService';
import '../css/EditBarangModal.css';

export default function EditBarangModal({ isOpen, onClose, barangData, onRefresh }) {
  const [formEdit, setFormEdit] = useState({ id: '', nmBarang: '', harga: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (barangData) {
      setFormEdit({
        id: barangData.id || '',
        nmBarang: barangData.nmBarang || '',    
        harga: barangData.harga || ''
      });
    }
  }, [barangData]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payloadKeBackend = {
        nmBarang: formEdit.nmBarang,
        harga: parseInt(formEdit.harga, 10) || 0 
      };

      const result = await barangService.update(formEdit.id, payloadKeBackend);
      
      alert(result.message || "Barang berhasil diperbarui!");
      onRefresh();
      onClose();
    } catch (err) {
      console.error(err);
      alert("Gagal mengupdate data barang, cuy!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <h3>✏️ Edit Data Barang</h3>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nama Barang</label>
            <input
              type="text"
              value={formEdit.nmBarang}
              onChange={(e) => setFormEdit({ ...formEdit, nmBarang: e.target.value })}
              required
            />
          </div>
          
          <div className="form-group">
            <label>Harga Sewa (Rp)</label>
            <input
              type="number"
              value={formEdit.harga}
              onChange={(e) => setFormEdit({ ...formEdit, harga: e.target.value })}
              required
            />
          </div>
          
          <div className="modal-actions">
            <button type="button" onClick={onClose} disabled={loading} className="btn-batal">
              Batal
            </button>
            <button type="submit" disabled={loading} className="btn-simpan">
              {loading ? "Menyimpan..." : "Simpan Perubahan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}