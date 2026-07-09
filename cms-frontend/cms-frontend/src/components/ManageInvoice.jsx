import { useState, useEffect } from 'react';
import { formatSecureInvoiceNumber as formatInvoiceNumber, DB_CONFIG } from '../utils/securityHelper'; // 🔒 IMPORT DARI FILE SECURITY

function ManageInvoice({
  invoices, orders, onInvoiceSubmit, selectedOrderId, setSelectedOrderId,
  tanggalInvoice, setTanggalInvoice, activeTab,
  templateConfig, setTemplateConfig
}) {
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  // State lokal untuk form config
  const [tempCompanyName, setTempCompanyName] = useState(templateConfig.companyName);
  const [tempCompanySlogan, setTempCompanySlogan] = useState(templateConfig.companySlogan);
  const [tempCompanyAddress, setTempCompanyAddress] = useState(templateConfig.companyAddress);
  const [tempSignatureLocation, setTempSignatureLocation] = useState(templateConfig.signatureLocation);
  const [tempSignatureName, setTempSignatureName] = useState(templateConfig.signatureName);
  const [tempNotes, setTempNotes] = useState([...templateConfig.notes]);
  const [tempCompanyLogo, setTempCompanyLogo] = useState(templateConfig.companyLogo); // State lokal untuk logo

  const todayDate = new Date().toISOString().split('T')[0];

  useEffect(() => {
    setTempNotes([...templateConfig.notes]);
    setTempSignatureName(templateConfig.signatureName);
    setTempSignatureLocation(templateConfig.signatureLocation);
    setTempCompanyLogo(templateConfig.companyLogo);
  }, [templateConfig.notes, templateConfig.signatureName, templateConfig.signatureLocation, templateConfig.companyLogo]);

  const handlePrint = () => { window.print(); };

  // Fungsi membaca file gambar dan konversi ke Base64 secara instan
  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setTempCompanyLogo(reader.result); // Mengisi format base64 gambar
      };
      reader.readAsDataURL(file);
    }
  };

  const handleNoteChange = (index, value) => {
    const updatedNotes = [...tempNotes];
    updatedNotes[index] = value;
    setTempNotes(updatedNotes);
  };

  const addNoteField = () => { setTempNotes([...tempNotes, '']); };

  const removeNoteField = (index) => {
    const updatedNotes = tempNotes.filter((_, i) => i !== index);
    setTempNotes(updatedNotes);
  };

  const handleSaveTemplate = (e) => {
    e.preventDefault();
    setTemplateConfig({
      companyName: tempCompanyName,
      companySlogan: tempCompanySlogan,
      companyAddress: tempCompanyAddress,
      signatureLocation: tempSignatureLocation,
      signatureName: tempSignatureName,
      companyLogo: tempCompanyLogo, // Simpan logo baru
      notes: tempNotes.filter(note => note.trim() !== '')
    });
    alert("Template Invoice & Logo berhasil diperbarui!");
  };

  // --- SUBMENU: CONFIG TEMPLATE INVOICE (LIVE PREVIEW) ---
  if (activeTab === 'template-invoice') {
    return (
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '30px', alignItems: 'start', maxWidth: '1400px', margin: '0 auto' }}>

        {/* KOLOM KIRI: FORM CONFIG */}
        <div className="form-container-premium" style={{ margin: '0', maxWidth: '100%' }}>
          <div className="form-header-premium">
            <h3>⚙️ Pengaturan Template Invoice</h3>
            <p>Ubah informasi teks bawaan serta logo yang akan tampil pada kertas invoice cetak.</p>
          </div>

          <form onSubmit={handleSaveTemplate} className="form-body-premium">
            {/* INPUT BARU: UPLOAD LOGO PERUSAHAAN */}
            <div className="form-group-premium">
              <label>Upload Logo Perusahaan (.png, .jpg, .jpeg)</label>
              <input type="file" accept="image/png, image/jpeg, image/jpg" onChange={handleLogoChange} style={{ padding: '10px' }} />
            </div>

            <div className="form-group-premium">
              <label>Nama Perusahaan / Bisnis</label>
              <input type="text" value={tempCompanyName} onChange={e => setTempCompanyName(e.target.value)} required />
            </div>

            <div className="form-group-premium">
              <label>Slogan / Deskripsi Bisnis</label>
              <input type="text" value={tempCompanySlogan} onChange={e => setTempCompanySlogan(e.target.value)} required />
            </div>

            <div className="form-group-premium">
              <label>Alamat & Kontak Perusahaan</label>
              <input type="text" value={tempCompanyAddress} onChange={e => setTempCompanyAddress(e.target.value)} required />
            </div>

            <div className="form-group-premium">
              <label>Kota / Lokasi Tanda Tangan (Kaki Kanan)</label>
              <input type="text" value={tempSignatureLocation} onChange={e => setTempSignatureLocation(e.target.value)} required />
            </div>

            <div className="form-group-premium">
              <label>Nama di Tanda Tangan</label>
              <input type="text" value={tempSignatureName} onChange={e => setTempSignatureName(e.target.value)} required />
            </div>

            <div className="form-group-premium" style={{ gap: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label>Catatan Penting (Kaki Invoice)</label>
                <button
                  type="button"
                  onClick={addNoteField}
                  className="btn-action-edit"
                  style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '6px 12px', background: 'rgba(52, 199, 89, 0.15)', color: '#34c759', borderColor: 'rgba(52, 199, 89, 0.3)' }}
                >
                  ➕ Tambah Catatan
                </button>
              </div>

              {tempNotes.map((note, index) => (
                <div key={index} style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <span style={{ color: '#888', fontWeight: 'bold', fontSize: '14px', minWidth: '20px' }}>{index + 1}.</span>
                  <input type="text" value={note} onChange={e => handleNoteChange(index, e.target.value)} required />
                  {tempNotes.length > 1 && (
                    <button type="button" onClick={() => removeNoteField(index)} style={{ background: 'rgba(231, 76, 60, 0.15)', color: '#e74c3c', border: '1px solid rgba(231, 76, 60, 0.3)', padding: '12px', borderRadius: '8px', cursor: 'pointer' }}>❌</button>
                  )}
                </div>
              ))}
            </div>

            <div className="form-actions-premium">
              <button type="submit" className="btn-submit-premium">💾 Terapkan Perubahan Template</button>
            </div>
          </form>
        </div>

        {/* KOLOM KANAN: LIVE PREVIEW DENGAN LOGO */}
        <div className="invoice-view-wrapper">
          <div style={{ color: '#888', fontSize: '13px', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '-10px', letterSpacing: '0.5px' }}>👁️ Live Preview Tampilan Cetak:</div>
          <div className="invoice-paper" style={{ transform: 'scale(0.95)', transformOrigin: 'top center', boxShadow: '0 10px 40px rgba(0,0,0,0.2)' }}>
            <div className="invoice-paper-header">
              <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                {/* RENDER LOGO PERUSAHAAN SECARA LIVE */}
                {tempCompanyLogo && <img src={tempCompanyLogo} alt="Logo Perusahaan" style={{ width: '65px', height: '65px', objectFit: 'contain' }} />}
                <div className="company-info">
                  <h2>{tempCompanyName}</h2>
                  <p>{tempCompanySlogan}</p>
                  <p className="company-subtext">{tempCompanyAddress}</p>
                </div>
              </div>
              <div className="invoice-title-meta">
                <h1>INVOICE</h1>
                <p><strong>No:</strong> {formatInvoiceNumber(4, todayDate)}</p>
                <p><strong>Tanggal Tagihan:</strong> {todayDate}</p>
              </div>
            </div>

            <hr className="invoice-divider" />

            <div className="invoice-billing-details">
              <div className="bill-to">
                <h4>Ditagihkan Kepada:</h4>
                <h3>[Nama Pelanggan Contoh]</h3>
                <p><strong>No. HP / WA:</strong> 081234567xxx</p>
              </div>
              <div className="event-details">
                <h4>Detail Pelaksanaan Acara:</h4>
                <p><strong>Tanggal Order:</strong> {todayDate}</p>
                <p><strong>Tanggal Acara:</strong> {todayDate}</p>
              </div>
            </div>

            <table className="invoice-items-table">
              <thead>
                <tr>
                  <th>Deskripsi Layanan / Barang</th>
                  <th style={{ textAlign: 'center', width: '120px' }}>Kuantitas</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <strong>[Contoh Nama Master Barang]</strong>
                    <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#666' }}>Penyewaan perlengkapan acara.</p>
                  </td>
                  <td style={{ textAlign: 'center' }}>0 Pcs</td>
                </tr>
              </tbody>
            </table>

            <div className="invoice-paper-footer">
              <div className="notes">
                <h4>Catatan Penting:</h4>
                {tempNotes.map((note, index) => (
                  note.trim() !== '' && <p key={index}>{index + 1}. {note}</p>
                ))}
              </div>
              <div className="signature-space">
                <p>{tempSignatureLocation}, {todayDate}</p>
                <br /><br /><br />
                <p><strong>( Hormat Kami, {tempSignatureName} )</strong></p>
              </div>
            </div>
          </div>
        </div>

      </div>
    );
  }

  // --- SUBMENU: CREATE INVOICE ---
  if (activeTab === 'create-invoice') {
    return (
      <div className="form-container-premium">
        <div className="form-header-premium">
          <h3>🧾 Generate Invoice / Tagihan</h3>
          <p>Terbitkan tagihan baru berdasarkan ID Order yang sudah ada.</p>
        </div>

        <form onSubmit={onInvoiceSubmit} className="form-body-premium">
          <div className="form-group-premium">
            <label>Pilih Transaksi Order</label>
            <select value={selectedOrderId} onChange={e => setSelectedOrderId(e.target.value)} required>
              <option value="">-- Pilih Order Aktif --</option>
              {orders
                // 🍏 FILTER: Hanya tampilkan order yang ID-nya belum pernah dibuatkan invoice
                .filter(ord => !invoices.some(inv => inv.orderId === ord.id))
                .map(ord => (
                  <option key={ord.id} value={ord.id}>
                    Order #{ord.id} - {ord.pemesan}
                  </option>
                ))
              }
            </select>
          </div>
          <div className="form-group-premium">
            <label>Tanggal Penerbitan Invoice</label>
            <input type="date" value={tanggalInvoice} onChange={e => setTanggalInvoice(e.target.value)} required />
          </div>
          <div className="form-actions-premium">
            <button type="submit" className="btn-submit-premium">🧾 Cetak & Terbitkan Invoice</button>
          </div>
        </form>
      </div>
    );
  }

  // --- SUBMENU: LIST INVOICE ---
  if (activeTab === 'list-invoice') {
    return (
      <div className="table-container-premium">
        {!selectedInvoice ? (
          <>
            <div className="table-header-premium">
              <h3>📋 Daftar Invoice Cetak</h3>
              <p>Riwayat seluruh tagihan yang telah dicetak dan diterbitkan.</p>
            </div>
            <div className="table-responsive-premium">
              <table className="crud-table-premium">
                <thead>
                  <tr>
                    <th>No. Tagihan</th>
                    <th>Tanggal Terbit</th>
                    <th>Nama Pelanggan</th>
                    <th>Deskripsi Barang</th>
                    <th>Kuantitas</th>
                    <th style={{ width: '150px', textAlign: 'center' }}>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {invoices.map((item) => {
                    // 🍏 Logika generate format nomor invoice romawi (INV-xxx/MM/dd-YYYY)
                    // Kita oper 'invoices' sebagai parameter ke-3 agar sinkron dengan setelan di securityHelper
                    const invoiceNumber = item.noInvoice || (typeof formatInvoiceNumber === 'function'
                      ? formatInvoiceNumber(item.orderId || (item.order ? item.order.id : '0'), item.tanggalInvoice)
                      : 'INV-Error');

                    return (
                      <tr key={item.id} className="border-b hover:bg-gray-50 text-gray-700">

                        {/* 🍏 1. KOLOM NOMOR INVOICE: Panggil variabel invoiceNumber yang sudah di-generate! */}
                        <td className="p-3 font-semibold text-blue-600">
                          {invoiceNumber}
                        </td>

                        {/* 🍏 2. KOLOM ID ORDER: Biar lu gak bingung, ini nampilin ID Kunci hubungannya */}
                        <td className="p-3 font-medium text-gray-600">
                          ORD-#{item.id}
                        </td>

                        <td className="p-3">
                          {item.order && item.order.pemesan ? item.order.pemesan : 'N/A'}
                        </td>
                        <td className="p-3">
                          {item.tanggalInvoice}
                        </td>
                        <td className="p-3 text-right font-bold text-green-600">
                          Rp {item.order && item.order.harga ? item.order.harga.toLocaleString('id-ID') : 0}
                        </td>
                        <td className="p-3 text-center">
                          <button
                            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-xs mr-2 transition"
                            onClick={() => setSelectedInvoice(item)}
                          >
                            👁️ Lihat / Cetak
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          /* KERTAS INVOICE REAL SAAT MAU DICETAK DENGAN LOGO */
          <div className="invoice-view-wrapper">
            <div className="invoice-control-buttons">
              <button onClick={() => setSelectedInvoice(null)} className="btn-cancel-premium" style={{ width: 'auto', padding: '10px 20px' }}>⬅️ Kembali ke Daftar</button>
              <button onClick={handlePrint} className="btn-submit-premium" style={{ width: 'auto', padding: '10px 25px' }}>𖨡 Cetak / Simpan PDF</button>
            </div>

            <div className="invoice-paper">
              <div className="invoice-paper-header">
                <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                  {/* LOGO PERUSAHAAN REAL SAAT PRINT */}
                  {templateConfig.companyLogo && <img src={templateConfig.companyLogo} alt="Logo" style={{ width: '65px', height: '65px', objectFit: 'contain' }} />}
                  <div className="company-info">
                    <h2>{templateConfig.companyName}</h2>
                    <p>{templateConfig.companySlogan}</p>
                    <p className="company-subtext">{templateConfig.companyAddress}</p>
                  </div>
                </div>
                <div className="invoice-title-meta">
                  <h1>INVOICE</h1>
                  <p><strong>No:</strong> {formatInvoiceNumber(selectedInvoice.orderId, selectedInvoice.tanggalInvoice)}</p>
                  <p><strong>Tanggal Tagihan:</strong> {selectedInvoice.tanggalInvoice}</p>
                </div>
              </div>

              <hr className="invoice-divider" />

              <div className="invoice-billing-details">
                <div className="bill-to">
                  <h4>Ditagihkan Kepada:</h4>
                  <h3>{selectedInvoice.order ? selectedInvoice.order.pemesan : 'N/A'}</h3>
                  <p><strong>No. HP / WA:</strong> {selectedInvoice.order ? selectedInvoice.order.noHpPemesan : 'N/A'}</p>
                </div>
                <div className="event-details">
                  <h4>Detail Pelaksanaan Acara:</h4>
                  <p><strong>Tanggal Order:</strong> {selectedInvoice.order ? selectedInvoice.order.tanggalPesan : 'N/A'}</p>
                  <p><strong>Tanggal Acara:</strong> {selectedInvoice.order ? selectedInvoice.order.tanggalAcara : 'N/A'}</p>
                </div>
              </div>

              <table className="invoice-items-table">
                <thead>
                  <tr>
                    <th>Deskripsi Layanan / Barang</th>
                    <th style={{ textAlign: 'center', width: '120px' }}>Kuantitas</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <strong>{selectedInvoice.order && selectedInvoice.order.barang ? selectedInvoice.order.barang.nmBarang : 'N/A'}</strong>
                      <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#666' }}>Penyewaan perlengkapan acara sesuai kesepakatan.</p>
                    </td>
                    <td style={{ textAlign: 'center' }}>{selectedInvoice.order ? selectedInvoice.order.jumlah : 0} Pcs</td>
                  </tr>
                </tbody>
              </table>

              <div className="invoice-paper-footer">
                <div className="notes">
                  <h4>Catatan Penting:</h4>
                  {templateConfig.notes && templateConfig.notes.map((note, index) => (
                    <p key={index}>{index + 1}. {note}</p>
                  ))}
                </div>
                <div className="signature-space">
                  <p>{templateConfig.signatureLocation}, {selectedInvoice.tanggalInvoice}</p>
                  <br /><br /><br />
                  <p><strong>({templateConfig.signatureName} )</strong></p>
                </div>
              </div>

            </div>
          </div>
        )}
      </div>
    );
  }

  return null;
}

export default ManageInvoice;