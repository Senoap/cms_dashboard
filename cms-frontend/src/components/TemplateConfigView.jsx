import React from 'react';

export default function TemplateConfigView(props) {
  const {
    templateForm, todayDate, handleTemplateInputChange, handleLogoChange,
    handleNoteChange, addNoteField, removeNoteField, handleSaveTemplate,
    formatInvoiceNumber, selectedInvoice
  } = props;

  return (
    <div className="invoice-grid-wrapper">
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
              <button type="button" onClick={addNoteField} className="btn-premium-info">➕ Tambah Catatan</button>
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
        <div className="preview-badge">👁️ Live Preview Tampilan Cetak:</div>
        <div className="invoice-paper invoice-paper-preview">
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
              <p><strong>Alamat:</strong> {selectedInvoice?.order?.alamat ?? '-'}</p>
            </div>
            <div className="event-details">
              <h4>Detail Pelaksanaan Acara:</h4>
              <p><strong>Tanggal Order:</strong> {todayDate}</p>
              <p><strong>Tanggal Acara:</strong> {todayDate}</p>
              <p><strong>Lokasi Acara:</strong> {selectedInvoice?.order?.lokasiAcara ?? '-'}</p>
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