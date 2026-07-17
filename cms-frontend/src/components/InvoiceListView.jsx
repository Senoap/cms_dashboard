import React from 'react';

export default function InvoiceListView(props) {
  const {
    filteredInvoices, invoices, activeInvoiceTab, setActiveInvoiceTab,
    selectedInvoice, setSelectedInvoice, handleUpdateStatusPenagihan,
    formatInvoiceNumber, handlePrint, templateConfig
  } = props;

  // Jika sedang mode "View Invoice Cetak"
  if (selectedInvoice) {
    return (
      <div className="table-container-premium">
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
                      <td><strong>{det.barang ? det.barang.nmBarang : 'Aset Terhapus'}</strong></td>
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
      </div>
    );
  }

  // Render Utama Table
  return (
    <div className="table-container-premium">
      <div className="table-header-premium">
        <h3>📋 Daftar Invoice Cetak</h3>
        <p>Riwayat seluruh tagihan yang telah dicetak dan diterbitkan.</p>

        <div className="tab-buttons-container">
          <button
            onClick={() => setActiveInvoiceTab('Semua')}
            className={`tab-button ${activeInvoiceTab === 'Semua' ? 'ongoing-active' : 'inactive'}`}
          >
            ⏳ Ongoing ({invoices.filter(i => i.statusPenagihan !== 'Terbayarkan').length})
          </button>
          <button
            onClick={() => setActiveInvoiceTab('Terbayarkan')}
            className={`tab-button ${activeInvoiceTab === 'Terbayarkan' ? 'terbayarkan-active' : 'inactive'}`}
          >
            ✅ Terbayarkan ({invoices.filter(i => i.statusPenagihan === 'Terbayarkan').length})
          </button>
        </div>
      </div>

      <div className="table-responsive-premium">
        <table className="crud-table-premium">
          <thead>
            <tr>
              <th style={{ width: '15%' }}>No. Tagihan</th>
              <th style={{ width: '10%' }}>Ref Order</th>
              <th style={{ width: '15%' }}>Status</th>
              <th style={{ width: '15%' }}>Nama Pelanggan</th>
              <th style={{ width: '15%' }}>Tanggal</th>
              <th style={{ width: '15%', textAlign: 'right' }}>Total</th>
              <th style={{ width: '15%', textAlign: 'center' }}>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filteredInvoices.map((item, index) => {
              const invoiceNumber = item.noInvoice || formatInvoiceNumber(item.orderId || (item.order?.id || '0'), item.tanggalInvoice);
              const orderId = item.orderId || item.order?.id || index;
              const isTerbayarkan = item.statusPenagihan === "Terbayarkan";

              return (
                <tr key={`${orderId}-${index}`} className="border-b hover:bg-gray-50">
                  <td className="p-3 font-semibold text-blue-600">{invoiceNumber}</td>
                  <td className="p-3">ORD-#{orderId}</td>
                  <td className="p-3">
                    <select
                      className={`status-dropdown-premium ${isTerbayarkan ? 'terbayarkan' : 'ongoing'}`}
                      value={item.statusPenagihan || "New"}
                      onChange={(e) => handleUpdateStatusPenagihan(item.id, e.target.value)}
                      disabled={isTerbayarkan}
                    >
                      <option value="New">New</option>
                      <option value="Proses Penagihan">Proses Penagihan</option>
                      <option value="Terbayarkan">Terbayarkan</option>
                    </select>
                  </td>
                  <td className="p-3">{item.order?.pemesan || 'N/A'}</td>
                  <td className="p-3">{item.tanggalInvoice}</td>
                  <td className="p-3 text-right font-bold text-green-600">
                    Rp {item.order?.harga?.toLocaleString('id-ID') || 0}
                  </td>
                  <td className="p-3 text-center">
                    <button className="btn-premium-info" onClick={() => setSelectedInvoice(item)}>
                      👁️ View
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}