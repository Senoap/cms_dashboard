/**
 * Security, Data Schema & Formatting Helper
 * Pinarak Langgeng - Admin Dashboard
 */

export const DB_CONFIG = {
  TABLE_INVOICE: 'tbl_invoice',
  TABLE_ORDER: 'tbl_order',
  FIELD_ID_INVOICE: 'id_invoice',
  FIELD_ORDER_ID: 'id_order',
  FIELD_TANGGAL_INVOICE: 'tanggal_invoice'
};

// Fungsi pembantu konversi angka bulan ke Romawi
const getRomawiMonth = (monthStr) => {
  const months = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];
  const monthIndex = parseInt(monthStr, 10) - 1;
  return months[monthIndex] || 'I';
};

export const formatSecureInvoiceNumber = (selectedOrderId, tanggalInvoice) => {
  const orderIdAngka = parseInt(selectedOrderId, 10) || 0;

  // Logika Reset dari awal jika mencapai 999
  let sequenceNumber = orderIdAngka % 1000;
  if (sequenceNumber === 0 && orderIdAngka > 0) {
    sequenceNumber = 999; 
  }

  const formattedOrderId = String(sequenceNumber).padStart(3, '0');

  // Parsing Tanggal (YYYY-MM-DD)
  const dateParts = tanggalInvoice.split('-');
  const year = dateParts[0];
  const monthRomawi = getRomawiMonth(dateParts[1]);
  const day = dateParts[2]; // 🍏 AMBIL NILAI HARI BIAR GAK UNDEFINED

  // Format Hasil: INV-xxx/romawi(MM)/dd-YYYY
  return `INV-${formattedOrderId}/${monthRomawi}/${day}-${year}`;
};