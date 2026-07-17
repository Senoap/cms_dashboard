import { useState, useEffect } from 'react';
import { barangService } from '../services/barangService';
import '../css/EditBarangModal.css';

export default function EditBarangModal({ isOpen, onClose, barangData, onRefresh }) {
  // State utama
  const [formEdit, setFormEdit] = useState({ id: '', nmBarang: '', harga: '' });
  const [loading, setLoading] = useState(false);

  // Sync data dari props saat barangData berubah
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

  // Handler Input
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormEdit((prev) => ({ ...prev, [name]: value }));
  };

  // Handler Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const payload = {
        nmBarang: formEdit.nmBarang,
        harga: parseInt(formEdit.harga, 10) || 0 
      };

      const result = await barangService.update(formEdit.id, payload);
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
              name="nmBarang"
              value={formEdit.nmBarang}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label>Harga Sewa (Rp)</label>
            <input
              type="number"
              name="harga"
              value={formEdit.harga}
              onChange={handleInputChange}
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