import { useManageOrder } from '../hooks/useManageOrder';
import OrderListView from './OrderListView';

function ManageOrder({ orders, barangList, onRefreshOrder, activeTab }) {
  const {
    itemInput,
    customerForm,
    cart,
    loading,
    grandTotal,
    handleItemInputChange,
    handleCustomerInputChange,
    handleAddToCart,
    handleRemoveFromCart,
    handleSubmitOrder
  } = useManageOrder(barangList, onRefreshOrder);


  const todayDate = new Date().toISOString().split('T')[0];

  if (activeTab === 'create-order') {
    return (
      <div className="form-container-premium" style={{ maxWidth: '850px' }}>

        {/* --- HEADER --- */}
        <div className="form-header-premium">
          <h3>📦 Buat Transaksi Order Baru</h3>
          <p>Catat pesanan pelanggan baru dengan memilih beberapa jenis barang sekaligus.</p>
        </div>

        <div className="form-body-premium">

          {/* --- AREA 1: INPUT BARANG & QUANTITY --- */}
          <div className="form-group-premium">
            <label>Pilih Barang / Aset</label>
            <select name="selectedBarangId" value={itemInput.selectedBarangId} onChange={handleItemInputChange}>
              <option value="">-- Silakan Pilih Barang --</option>
              {barangList.map(b => (
                <option key={b.id} value={b.id}>{b.nmBarang} (Rp {b.harga?.toLocaleString('id-ID')})</option>
              ))}
            </select>
          </div>

          <div className="form-group-premium">
            <label>Jumlah Pesanan (Pcs)</label>
            <input type="number" name="jumlah" placeholder="Masukkan jumlah pesanan..." value={itemInput.jumlah} onChange={handleItemInputChange} />
          </div>

          <button
            type="button"
            onClick={handleAddToCart}
            className="btn-submit-premium"
            style={{ backgroundColor: '#4f46e5', marginBottom: '25px', width: 'auto', display: 'inline-block' }}
          >
            ➕ Masukkan ke Keranjang
          </button>

          {/* --- AREA 2: TABEL KERANJANG SEMENTARA --- */}
          {cart.length > 0 && (
            <div style={{ marginBottom: '30px', padding: '15px', background: '#f9fafb', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
              <h4 style={{ marginBottom: '10px', color: '#1f2937' }}>🛒 Daftar Item Keranjang Sementara:</h4>
              <table className="crud-table-premium" style={{ width: '100%', fontSize: '13px' }}>
                <thead>
                  <tr>
                    <th>Nama Barang</th>
                    <th>Harga Satuan</th>
                    <th>Qty</th>
                    <th>Sub Total</th>
                    <th style={{ textAlign: 'center' }}>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {cart.map((item, index) => (
                    <tr key={`${item.barangId}-${index}`}>
                      <td><strong>{item.nmBarang}</strong></td>
                      <td>Rp {item.hargaSatuan.toLocaleString('id-ID')}</td>
                      <td>{item.jumlah} pcs</td>
                      <td style={{ color: '#16a34a', fontWeight: 'bold' }}>Rp {item.subTotal.toLocaleString('id-ID')}</td>
                      <td style={{ textAlign: 'center' }}>
                        <button type="button" onClick={() => handleRemoveFromCart(index)} style={{ color: '#dc2626', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>❌ Hapus</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div style={{ textAlign: 'right', marginTop: '15px', fontSize: '14px', fontWeight: 'bold', color: '#1e3a8a' }}>
                Grand Total: <span style={{ fontSize: '18px', color: '#2563eb' }}>Rp {grandTotal.toLocaleString('id-ID')}</span>
              </div>
            </div>
          )}

          {/* --- AREA 3: FORM UTAMA PELANGGAN --- */}
          <form onSubmit={handleSubmitOrder}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div className="form-group-premium">
                <label>Tanggal Pesan</label>
                <input
                  type="date"
                  value={todayDate} // <-- Auto isi tanggal hari ini
                  disabled          // <-- Biar admin gak bisa edit
                  style={{ backgroundColor: '#f1f5f9', cursor: 'not-allowed' }}
                />
              </div>
              <div className="form-group-premium">
                <label>Tanggal Acara</label>
                <input type="date" name="tanggalAcara" value={customerForm.tanggalAcara} onChange={handleCustomerInputChange} required />
              </div>
            </div>

            <div className="form-group-premium">
              <label>Nama Lengkap Pemesan</label>
              <input type="text" name="pemesan" placeholder="Contoh: Bapak Budi" value={customerForm.pemesan} onChange={handleCustomerInputChange} required />
            </div>

            <div className="form-group-premium">
              <label>Nomor HP / WhatsApp</label>
              <input type="text" name="noHpPemesan" placeholder="Contoh: 081234567xxx" value={customerForm.noHpPemesan} onChange={handleCustomerInputChange} required />
            </div>

            {/* --- ALAMAT TAGIHAN --- */}
            <div className="form-group-premium">
              <label>Alamat Penagihan (Billing Address)</label>
              <textarea
                name="alamat"
                className="form-input-premium"
                placeholder="Masukkan alamat domisili / kantor pelanggan..."
                value={customerForm.alamat}
                onChange={handleCustomerInputChange}
                required
              />
            </div>

            {/* --- ALAMAT ACARA --- */}
            <div className="form-group-premium">
              <label>Alamat Pelaksanaan Acara</label>
              <textarea
                name="lokasiAcara"
                className="form-input-premium"
                placeholder="Contoh: Gedung Balai Sudirman, Jl. Dr. Saharjo..."
                value={customerForm.lokasiAcara}
                onChange={handleCustomerInputChange}
                required
              />
            </div>

            <div className="form-actions-premium">
              <button type="submit" disabled={loading} className="btn-submit-premium">
                {loading ? "Menyimpan..." : "💾 Simpan Transaksi Order"}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  if (activeTab === 'list-order') {
    return <OrderListView orders={orders} onRefreshOrder={onRefreshOrder} />;
  }

  return null;
}

export default ManageOrder;