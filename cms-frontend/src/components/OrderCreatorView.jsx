import React from 'react';

export default function OrderCreatorView(props) {
  // Destructuring semua props yang dilempar dari parent
  const {
    barangList, itemInput, customerForm, cart, loading, grandTotal,
    handleItemInputChange, handleCustomerInputChange, handleAddToCart,
    handleRemoveFromCart, handleSubmitOrder, todayDate
  } = props;

  return (
    <div className="form-container-premium order-form-container">
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
              <option key={b.id} value={b.id}>
                {b.nmBarang} (Rp {b.harga?.toLocaleString('id-ID')})
              </option>
            ))}
          </select>
        </div>

        <div className="form-group-premium">
          <label>Jumlah Pesanan (Pcs)</label>
          <input 
            type="number" 
            name="jumlah" 
            placeholder="Masukkan jumlah pesanan..." 
            value={itemInput.jumlah} 
            onChange={handleItemInputChange} 
          />
        </div>

        <button
          type="button"
          onClick={handleAddToCart}
          className="btn-submit-premium btn-add-cart"
        >
          ➕ Masukkan ke Keranjang
        </button>

        {/* --- AREA 2: TABEL KERANJANG SEMENTARA --- */}
        {cart.length > 0 && (
          <div className="cart-container">
            <h4 className="cart-title">🛒 Daftar Item Keranjang Sementara:</h4>
            <table className="crud-table-premium cart-table">
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
                    <td className="cart-subtotal">Rp {item.subTotal.toLocaleString('id-ID')}</td>
                    <td style={{ textAlign: 'center' }}>
                      <button 
                        type="button" 
                        onClick={() => handleRemoveFromCart(index)} 
                        className="btn-remove-cart"
                      >
                        ❌ Hapus
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="cart-grand-total">
              Grand Total: <span className="cart-grand-total-value">Rp {grandTotal.toLocaleString('id-ID')}</span>
            </div>
          </div>
        )}

        {/* --- AREA 3: FORM UTAMA PELANGGAN --- */}
        <form onSubmit={handleSubmitOrder}>
          <div className="form-grid-2">
            <div className="form-group-premium">
              <label>Tanggal Pesan</label>
              <input
                type="date"
                value={todayDate} // Auto isi tanggal hari ini
                disabled          // Biar admin gak bisa edit
                className="input-readonly"
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