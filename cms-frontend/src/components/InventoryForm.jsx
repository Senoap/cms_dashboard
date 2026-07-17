export default function InventoryForm({ formData, loading, handleSubmit, handleInputChange }) {
  return (
    <div className="form-container-premium">
      <div className="form-header-premium">
        <h3>➕ Tambah Master Barang Baru</h3>
        <p>Masukkan data barang atau aset baru ke dalam inventaris Pinarak Langgeng.</p>
      </div>

      <form onSubmit={handleSubmit} className="form-body-premium">
        <div className="form-group-premium">
          <label>Nama Barang / Aset</label>
          <input type="text" name="newNamaBarang" placeholder="Contoh: Kursi Futura" value={formData.newNamaBarang} onChange={handleInputChange} required />
        </div>
        <div className="form-group-premium">
          <label>Harga Sewa (Rp)</label>
          <input type="number" name="hargaBarang" placeholder="Contoh: 50000" value={formData.hargaBarang} onChange={handleInputChange} required />
        </div>
        <div className="form-actions-premium">
          <button type="submit" disabled={loading} className="btn-premium-primary">
            {loading ? "Menyimpan..." : "💾 Simpan Master Barang"}
          </button>
        </div>
      </form>
    </div>
  );
}