import React from 'react';
import '../css/SuratJalan.css'; // Buat file CSS ini

function SuratJalan({ orderData, onPrint }) {
  if (!orderData) return null;

  return (
    <div className="surat-jalan-page">
      <div className="surat-jalan-header">
        <h2>SURAT JALAN</h2>
        <p>Pinarak Langgeng</p>
      </div>
      
      <div className="surat-jalan-info">
        <p><strong>Kepada:</strong> {orderData.pemesan}</p>
        <p><strong>Alamat:</strong> {orderData.alamat}</p>
        <p><strong>Tgl Acara:</strong> {orderData.tanggalAcara}</p>
      </div>

      <table className="sj-table">
        <thead>
          <tr>
            <th>No</th>
            <th>Nama Barang</th>
            <th>Jumlah</th>
          </tr>
        </thead>
        <tbody>
          {orderData.details.map((item, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{item.barang?.nmBarang}</td>
              <td>{item.jumlah} pcs</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="catatan-section">
        <p><strong>Catatan:</strong> Pesanan harap diperiksa kembali saat diterima.</p>
      </div>

      <button onClick={window.print} className="no-print">🖨️ Cetak Surat</button>
    </div>
  );
}

export default SuratJalan;