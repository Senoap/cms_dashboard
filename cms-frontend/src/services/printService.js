// Fungsi helper format tanggal
export const formatTanggal = (tanggalString) => {
    if (!tanggalString) return "-";
    const date = new Date(tanggalString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
};

// Fungsi utama cetak yang sudah fleksibel
export const printSuratJalan = (order, customConfig = {}) => {
    // Config default yang bisa dioverride
    const config = {
        namaToko: "Pinarak Langgeng",
        catatan: "Terima kasih atas kepercayaan Anda.",
        ...customConfig
    };

    const printWindow = window.open('', '_blank', 'width=800,height=600');
    
    printWindow.document.write(`
        <html>
            <head>
                <title>Surat Jalan - ${order.pemesan}</title>
                <style>
                    body { font-family: 'Segoe UI', Arial, sans-serif; padding: 40px; color: #333; }
                    .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #000; padding-bottom: 10px; }
                    .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px; }
                    table { width: 100%; border-collapse: collapse; margin-top: 10px; }
                    th, td { border: 1px solid #000; padding: 12px; text-align: left; }
                    th { background-color: #f2f2f2; }
                    .signature-section { margin-top: 50px; display: grid; grid-template-columns: 1fr 1fr; text-align: center; }
                    .footer-note { margin-top: 20px; font-style: italic; font-size: 14px; }
                </style>
            </head>
            <body>
                <div class="header">
                    <h1>SURAT JALAN</h1>
                    <p><strong>${config.namaToko}</strong></p>
                </div>
                
                <div class="info-grid">
                    <div>
                        <p><strong>Kepada:</strong> ${order.pemesan}</p>
                        <p><strong>Alamat:</strong> ${order.alamat}</p>
                    </div>
                    <div>
                        <p><strong>Tgl Acara:</strong> ${formatTanggal(order.tanggalAcara)}</p>
                        <p><strong>Tgl Pengiriman:</strong> ${formatTanggal(new Date().toISOString().split('T')[0])}</p>
                    </div>
                </div>

                <table>
                    <thead><tr><th>No</th><th>Nama Barang</th><th>Jumlah</th></tr></thead>
                    <tbody>
                        ${order.details.map((d, i) => `
                            <tr>
                                <td>${i + 1}</td>
                                <td>${d.barang?.nmBarang || 'Barang Terhapus'}</td>
                                <td>${d.jumlah} pcs</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>

                <div class="footer-note">
                    <p>Catatan: ${config.catatan}</p>
                </div>

                <div class="signature-section">
                    <div><p>Driver / Pengirim,</p><br><br><br><p>____________________</p></div>
                    <div><p>Penerima Barang,</p><br><br><br><p>____________________</p></div>
                </div>
            </body>
        </html>
    `);
    printWindow.document.close();
    printWindow.print();
};