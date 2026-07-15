import { useManageInvoice } from '../hooks/useManageInvoice';

function ManageInvoice({
  invoices, orders, onRefreshInvoice, activeTab,
  templateConfig, setTemplateConfig
}) {
  // 🍏 Mengisolasi puluhan state form dan fungsi utilitas ke custom hook lokal
  const {
    selectedOrderId,
    setSelectedOrderId,
    tanggalInvoice,
    setTanggalInvoice,
    selectedInvoice,
    setSelectedInvoice,
    loading,
    templateForm,
    todayDate,
    handleTemplateInputChange,
    handleLogoChange,
    handleNoteChange,
    addNoteField,
    removeNoteField,
    handleSaveTemplate,
    handleCreateInvoice,
    handlePrint,
    formatInvoiceNumber
  } = useManageInvoice(invoices, onRefreshInvoice, templateConfig, setTemplateConfig);

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
            <div className="form-group-premium">
              <label>Upload Logo Perusahaan (.png, .jpg, .jpeg)</label>
              <input type="file" accept="image/png, image/jpeg, image/jpg" onChange={handleLogoChange} style={{ padding: '10px' }} />
            </div>

            <div className="form-group-premium">
              <label>Nama Perusahaan / Bisnis</label>
              <input type="text" name="companyName" value={templateForm.companyName} onChange={handleTemplateInputChange} required />
            </div>

            <div className="form-group-premium">
              <label>Slogan / Deskripsi Bisnis</label>
              <input type="text" name="companySlogan" value={templateForm.companySlogan} onChange={handleTemplateInputChange} required />
            </div>

            <div className="form-group-premium">
              <label>Alamat & Kontak Perusahaan</label>
              <input type="text" name="companyAddress" value={templateForm.companyAddress} onChange={handleTemplateInputChange} required />
            </div>

            <div className="form-group-premium">
              <label>Kota / Lokasi Tanda Tangan (Kaki Kanan)</label>
              <input type="text" name="signatureLocation" value={templateForm.signatureLocation} onChange={handleTemplateInputChange} required />
            </div>

            <div className="form-group-premium">
              <label>Nama di Tanda Tangan</label>
              <input type="text" name="signatureName" value={templateForm.signatureName} onChange={handleTemplateInputChange} required />
            </div>

            <div className="form-group-premium" style={{ gap: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label>Catatan Penting (Kaki Invoice)</label>
                <button
                  type="button"
                  onClick={addNoteField}
                  className="btn-premium-info"
                >
                  ➕ Tambah Catatan
                </button>
              </div>

              {templateForm.notes.map((note, index) => (
                <div key={index} style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <span style={{ color: '#888', fontWeight: 'bold', fontSize: '14px', minWidth: '20px' }}>{index + 1}.</span>
                  <input type="text" value={note} onChange={e => handleNoteChange(index, e.target.value)} required />
                  {templateForm.notes.length > 1 && (
                    <button type="button" onClick={() => removeNoteField(index)} className="btn-premium-danger" style={{ padding: '12px' }}>❌</button>
                  )}
                </div>
              ))}
            </div>

            <div className="form-actions-premium">
              <button type="submit" className="btn-premium-primary">💾 Terapkan Perubahan Template</button>
            </div>
          </form>
        </div>

        {/* KOLOM KANAN: LIVE PREVIEW DENGAN LOGO */}
        <div className="invoice-view-wrapper">
          <div style={{ color: '#888', fontSize: '13px', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '-10px', letterSpacing: '0.5px' }}>👁️ Live Preview Tampilan Cetak:</div>
          <div className="invoice-paper" style={{ transform: 'scale(0.95)', transformOrigin: 'top center', boxShadow: '0 10px 40px rgba(0,0,0,0.2)' }}>
            <div className="invoice-paper-header">
              <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                {templateForm.companyLogo && <img src={templateForm.companyLogo} alt="Logo Perusahaan" style={{ width: '65px', height: '65px', objectFit: 'contain' }} />}
                <div className="company-info">
                  <h2>{templateForm.companyName}</h2>
                  <p>{templateForm.companySlogan}</p>
                  <p className="company-subtext">{templateForm.companyAddress}</p>
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
                <p><strong>Alamat:</strong> {selectedInvoice.order && selectedInvoice.order.alamat ? selectedInvoice.order.alamat : '-'}</p>
              </div>
              <div className="event-details">
                <h4>Detail Pelaksanaan Acara:</h4>
                <p><strong>Tanggal Order:</strong> {todayDate}</p>
                <p><strong>Tanggal Acara:</strong> {todayDate}</p>
                <p><strong>Lokasi Acara:</strong> {selectedInvoice.order && selectedInvoice.order.lokasiAcara ? selectedInvoice.order.lokasiAcara : (selectedInvoice.order && selectedInvoice.order.alamat ? selectedInvoice.order.alamat : '-')}</p>
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
                {templateForm.notes.map((note, index) => (
                  note.trim() !== '' && <p key={index}>{index + 1}. {note}</p>
                ))}
              </div>
              <div className="signature-space">
                <p>{templateForm.signatureLocation}, {todayDate}</p>
                <br /><br /><br />
                <p><strong>( Hormat Kami, {templateForm.signatureName} )</strong></p>
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

        <form onSubmit={handleCreateInvoice} className="form-body-premium">
          <div className="form-group-premium">
            <label>Pilih Transaksi Order</label>
            <select value={selectedOrderId} onChange={e => setSelectedOrderId(e.target.value)} required>
              <option value="">-- Pilih Order Aktif --</option>
              {orders
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
          <div className="form-input-premium">
            <button type="submit" disabled={loading} className="btn-premium-primary">
              {loading ? "Memproses..." : "🧾 Cetak & Terbitkan Invoice"}
            </button>
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
                    <th>Ref Order</th>
                    <th>Nama Pelanggan</th>
                    <th>Tanggal Terbit</th>
                    <th style={{ textAlign: 'right' }}>Total Tagihan</th>
                    <th style={{ width: '150px', textAlign: 'center' }}>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {invoices.map((item, index) => {
                    const invoiceNumber = item.noInvoice || (typeof formatInvoiceNumber === 'function'
                      ? formatInvoiceNumber(item.orderId || (item.order ? item.order.id : '0'), item.tanggalInvoice)
                      : 'INV-Error');

                    const orderId = item.orderId || (item.order ? item.order.id : index);

                    return (
                      <tr key={`${orderId}-${index}`} className="border-b hover:bg-gray-50 text-gray-700">
                        <td className="p-3 font-semibold text-blue-600">
                          {invoiceNumber}
                        </td>
                        <td className="p-3 font-medium text-gray-600">
                          ORD-#{orderId}
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
                          {/* 🍏 DIBUNGKUS WRAPPER FLEX DAN STANDARDISASI TOMBOL AKSI TABEL */}
                          <div className="table-actions-premium">
                            <button
                              className="btn-premium-info"
                              onClick={() => setSelectedInvoice(item)}
                            >
                              👁️ Lihat / Cetak
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          /* KERTAS INVOICE REAL SAAT MAU DICETAK */
          <div className="invoice-view-wrapper">
            <div className="invoice-control-buttons">
              <button onClick={() => setSelectedInvoice(null)} className="btn-premium-secondary">⬅️ Kembali ke Daftar</button>
              <button onClick={handlePrint} className="btn-premium-primary">𖨡 Cetak / Simpan PDF</button>
            </div>

            <div className="invoice-paper">
              <div className="invoice-paper-header">
                <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                  {templateConfig.companyLogo && <img src={templateConfig.companyLogo} alt="Logo" style={{ width: '65px', height: '65px', objectFit: 'contain' }} />}
                  <div className="company-info">
                    <h2>{templateConfig.companyName}</h2>
                    <p>{templateConfig.companySlogan}</p>
                    <p className="company-subtext">{templateConfig.companyAddress}</p>
                  </div>
                </div>
                <div className="invoice-title-meta">
                  <h1>INVOICE</h1>
                  <p><strong>No:</strong> {selectedInvoice.noInvoice || formatInvoiceNumber(selectedInvoice.orderId || (selectedInvoice.order ? selectedInvoice.order.id : '0'), selectedInvoice.tanggalInvoice)}</p>
                  <p><strong>Tanggal Tagihan:</strong> {selectedInvoice.tanggalInvoice}</p>
                </div>
              </div>

              <hr className="invoice-divider" />

              <div className="invoice-billing-details">
                <div className="bill-to">
                  <h4>Ditagihkan Kepada:</h4>
                  <h3>{selectedInvoice.order?.pemesan ?? 'N/A'}</h3>
                  <p><strong>No. HP / WA:</strong> {selectedInvoice.order?.noHpPemesan ?? 'N/A'}</p>
                  <p><strong>Alamat Tagihan:</strong> {selectedInvoice.order?.alamat ?? '-'}</p>
                </div>
                <div className="event-details">
                  <h4>Detail Pelaksanaan Acara:</h4>
                  <p><strong>Tanggal Order:</strong> {selectedInvoice.order?.tanggalPesan ?? 'N/A'}</p>
                  <p><strong>Tanggal Acara:</strong> {selectedInvoice.order?.tanggalAcara ?? 'N/A'}</p>
                  <p><strong>Lokasi Acara:</strong> {selectedInvoice.order?.lokasiAcara ?? '-'}</p>
                </div>
              </div>

              <table className="invoice-items-table">
                <thead>
                  <tr>
                    <th>Deskripsi Layanan / Barang</th>
                    <th style={{ textAlign: 'center', width: '100px' }}>Qty</th>
                    <th style={{ textAlign: 'right', width: '150px' }}>Sub Total</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedInvoice.order && selectedInvoice.order.details && selectedInvoice.order.details.length > 0 ? (
                    selectedInvoice.order.details.map((det, index) => (
                      <tr key={index}>
                        <td>
                          <strong>{det.barang ? det.barang.nmBarang : 'Aset Terhapus'}</strong>
                        </td>
                        <td style={{ textAlign: 'center' }}>{det.jumlah} Pcs</td>
                        <td style={{ textAlign: 'right', fontWeight: 'bold' }}>
                          Rp {((det.barang ? det.barang.harga : 0) * det.jumlah).toLocaleString('id-ID')}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td><strong>Penyewaan perlengkapan acara.</strong></td>
                      <td style={{ textAlign: 'center' }}>1 Pcs</td>
                      <td style={{ textAlign: 'right', fontWeight: 'bold' }}>
                        Rp {selectedInvoice.order ? (selectedInvoice.order.harga || 0).toLocaleString('id-ID') : 0}
                      </td>
                    </tr>
                  )}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan="2" style={{ textAlign: 'right', fontWeight: 'bold', borderTop: '2px solid #ddd', padding: '15px 10px' }}>Grand Total Tagihan:</td>
                    <td style={{ textAlign: 'right', fontWeight: 'bold', borderTop: '2px solid #ddd', padding: '15px 10px', fontSize: '15px', color: '#16a34a' }}>
                      Rp {selectedInvoice.order ? (selectedInvoice.order.harga || 0).toLocaleString('id-ID') : 0}
                    </td>
                  </tr>
                </tfoot>
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