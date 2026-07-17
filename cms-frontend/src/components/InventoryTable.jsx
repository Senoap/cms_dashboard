export default function InventoryTable({ currentItems, totalPages, currentPage, setCurrentPage, onEditBarang, handleDeleteClick }) {
  return (
    <div className="table-container-premium">
      <div className="table-header-premium">
        <h3>📋 Daftar Stok / Master Barang</h3>
        <p>Semua aset yang tersedia dan bisa dipilih saat membuat transaksi order.</p>
      </div>

      <div className="table-responsive-premium">
        <table className="crud-table-premium">
          <thead>
            <tr>
              <th>Nama Barang / Jasa</th>
              <th className="text-right">Harga Sewa</th>
              <th className="text-center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.length === 0 ? (
              <tr><td colSpan="3" className="text-center p-20">📭 Belum ada data barang.</td></tr>
            ) : (
              currentItems.map((b, index) => (
                <tr key={b.id || index}>
                  <td><strong>{b.nmBarang}</strong></td>
                  <td className="text-right font-bold text-green">Rp {(b.harga || 0).toLocaleString('id-ID')}</td>
                  <td className="text-center">
                    <div className="table-actions-premium">
                      <button onClick={() => onEditBarang(b)} className="btn-premium-info">✏️ Edit</button>
                      <button onClick={() => handleDeleteClick(b.id, b.nmBarang)} className="btn-premium-danger">🗑️ Hapus</button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="pagination-container">
          <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1} className="btn-pagination">⬅️ Previous</button>
          <span className="page-info">Halaman {currentPage} dari {totalPages}</span>
          <button onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages} className="btn-pagination">Next ➡️</button>
        </div>
      )}
    </div>
  );
}