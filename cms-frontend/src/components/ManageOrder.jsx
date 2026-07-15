import { useState } from 'react';
import { orderService } from '../services/orderService'; // 🍏 Import service baru
import OrderListView from './OrderListView'; // 🍏 Import komponen tabel yang baru dibuat

function ManageOrder({ orders, barangList, onRefreshOrder, activeTab }) {
  // 🍏 ISOLASI STATE: Semua form input di-manage di sini sekarang
  const [selectedBarangId, setSelectedBarangId] = useState('');
  const [jumlah, setJumlah] = useState('');
  const [tanggalPesan, setTanggalPesan] = useState('');
  const [tanggalAcara, setTanggalAcara] = useState('');
  const [pemesan, setPemesan] = useState('');
  const [noHpPemesan, setNoHpPemesan] = useState('');
  const [alamat, setAlamat] = useState('');

  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);

  // 🍏 Fungsi nambah barang ke keranjang
  const handleAddToCart = (e) => {
    e.preventDefault();
    if (!selectedBarangId || !jumlah || parseInt(jumlah, 10) <= 0) {
      alert("Pilih barang dan isi jumlah kuantitas yang valid dulu, cuy!");
      return;
    }

    const targetBarang = barangList.find(b => String(b.id) === String(selectedBarangId));
    if (!targetBarang) return;

    const qty = parseInt(jumlah, 10);
    const hargaSatuan = parseInt(targetBarang.harga, 10) || 0;
    const subTotal = hargaSatuan * qty;

    const existingIndex = cart.findIndex(item => String(item.barangId) === String(targetBarang.id));

    if (existingIndex > -1) {
      const updatedCart = [...cart];
      updatedCart[existingIndex].jumlah += qty;
      updatedCart[existingIndex].subTotal += subTotal;
      setCart(updatedCart);
    } else {
      setCart([...cart, {
        barangId: targetBarang.id,
        nmBarang: targetBarang.nmBarang,
        hargaSatuan: hargaSatuan,
        jumlah: qty,
        subTotal: subTotal
      }]);
    }

    // Reset input barang & kuantitas
    setSelectedBarangId('');
    setJumlah('');
  };

  // 🍏 Fungsi hapus baris dari keranjang
  const handleRemoveFromCart = (indexToDrop) => {
    setCart(cart.filter((_, idx) => idx !== indexToDrop));
  };

  // 🍏 Hitung total harga saat ini di keranjang
  const grandTotal = cart.reduce((sum, item) => sum + item.subTotal, 0);

  // 🍏 Fungsi kirim data ke Backend via Service
  // 🍏 Ganti fungsi handleSubmitOrder bawaan lu dengan ini:
  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    if (cart.length === 0) return alert("Keranjang belanja kosong! Isi barang dulu cuy.");

    setLoading(true);
    try {
      const payload = {
        tanggalPesan, //
        tanggalAcara, //
        pemesan, //
        noHpPemesan, //
        alamat,
        harga: grandTotal, //
        // 🍏 PERBAIKAN UTAMA: Sesuaikan struktur item keranjang
        details: cart.map(item => ({
          barang: {
            id: item.barangId
          },
          jumlah: item.jumlah,
          subTotal: item.subTotal
        }))
      };

      await orderService.create(payload); //[cite: 5]
      alert("Transaksi Order Berhasil Disimpan!");

      // Reset semua form & keranjang[cite: 5]
      setCart([]); //[cite: 5]
      setTanggalPesan(''); //[cite: 5]
      setTanggalAcara(''); //[cite: 5]
      setPemesan(''); //[cite: 5]
      setNoHpPemesan(''); //[cite: 5]
      setAlamat('');

      // Refresh data list order di parent[cite: 5]
      onRefreshOrder(); //[cite: 5]
    } catch (err) {
      console.error(err);
      alert("Gagal menyimpan transaksi order!");
    } finally {
      setLoading(false); //[cite: 5]
    }
  };

  if (activeTab === 'create-order') {
    return (
      <div className="form-container-premium" style={{ maxWidth: '850px' }}>
        <div className="form-header-premium">
          <h3>📦 Buat Transaksi Order Baru</h3>
          <p>Catat pesanan pelanggan baru dengan memilih beberapa jenis barang sekaligus.</p>
        </div>

        <div className="form-body-premium">
          {/* AREA 1: INPUT BARANG & QUANTITY */}
          <div className="form-group-premium">
            <label>Pilih Barang / Aset</label>
            <select value={selectedBarangId} onChange={e => setSelectedBarangId(e.target.value)}>
              <option value="">-- Silakan Pilih Barang --</option>
              {barangList.map(b => (
                <option key={b.id} value={b.id}>{b.nmBarang} (Rp {b.harga?.toLocaleString('id-ID')})</option>
              ))}
            </select>
          </div>

          <div className="form-group-premium">
            <label>Jumlah Pesanan (Pcs)</label>
            <input type="number" placeholder="Masukkan jumlah pesanan..." value={jumlah} onChange={e => setJumlah(e.target.value)} />
          </div>

          <button
            type="button"
            onClick={handleAddToCart}
            className="btn-submit-premium"
            style={{ backgroundColor: '#4f46e5', marginBottom: '25px', width: 'auto', display: 'inline-block' }}
          >
            ➕ Masukkan ke Keranjang
          </button>

          {/* AREA 2: TABEL KERANJANG BELANJA SEMENTARA */}
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

          {/* AREA 3: FORM UTAMA DATA PELANGGAN */}
          <form onSubmit={handleSubmitOrder}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div className="form-group-premium">
                <label>Tanggal Pesan</label>
                <input type="date" value={tanggalPesan} onChange={e => setTanggalPesan(e.target.value)} required />
              </div>
              <div className="form-group-premium">
                <label>Tanggal Acara</label>
                <input type="date" value={tanggalAcara} onChange={e => setTanggalAcara(e.target.value)} required />
              </div>
            </div>

            <div className="form-group-premium">
              <label>Nama Lengkap Pemesan</label>
              <input type="text" placeholder="Contoh: Bapak Budi" value={pemesan} onChange={e => setPemesan(e.target.value)} required />
            </div>

            <div className="form-group-premium">
              <label>Nomor HP / WhatsApp</label>
              <input type="text" placeholder="Contoh: 081234567xxx" value={noHpPemesan} onChange={e => setNoHpPemesan(e.target.value)} required />
            </div>

            <div className="form-group-premium">
              <label>Alamat Pengiriman</label>
              <textarea
                className="form-input-premium"
                placeholder="Masukkan alamat lokasi acara..."
                value={alamat}
                onChange={(e) => setAlamat(e.target.value)}
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

  // 🍏 Ganti blok list-order di ManageOrder.jsx dengan kode ringkas ini:
  if (activeTab === 'list-order') {
    return (
      <OrderListView
        orders={orders}
        onRefreshOrder={onRefreshOrder}
      />
    );
  }

  return null;
}

export default ManageOrder;