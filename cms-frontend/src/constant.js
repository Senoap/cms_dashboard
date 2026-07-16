import logoImg from './assets/pl_img.jpeg';

export const DEFAULT_TEMPLATE_CONFIG = {
  companyName: 'PINARAK LANGGENG',
  companySlogan: 'Solusi Penyewaan Alat Pesta & Event Terbaik',
  companyAddress: 'Jl. Raya Pinarak No. 88, Jawa Tengah | Telp: 0812-3456-7890',
  notes: [
    'Invoice ini merupakan bukti pembayaran/tagihan resmi yang sah.',
    'Harap lakukan konfirmasi H-3 sebelum tanggal pelaksanaan acara dimulai.'
  ],
  signatureLocation: 'Jawa Tengah',
  signatureName: 'Admin PL',
  companyLogo: logoImg
};

// 🍏 SEPARATED MENU ICONS & STRUCTURE CONSTANT
export const MENU_STRUCTURE = [
  {
    id: 'content',
    label: '📂 Menu Content',
    items: [
      { tabId: 'create-content', label: '➕ Create Content' },
      { tabId: 'list-content', label: '📋 List Content' }
    ]
  },
  {
    id: 'inventory',
    label: '🛠️ Menu Inventory',
    items: [
      { tabId: 'create-barang', label: '➕ Create Barang' },
      { tabId: 'list-barang', label: '📋 List Barang' }
    ]
  },
  {
    id: 'order',
    label: '📦 Menu Order',
    items: [
      { tabId: 'create-order', label: '➕ Create Order' },
      { tabId: 'list-order', label: '📋 List Order' }
    ]
  },
  {
    id: 'invoice',
    label: '🧾 Menu Invoice',
    items: [
      { tabId: 'create-invoice', label: '➕ Create Invoice' },
      { tabId: 'list-invoice', label: '📋 List Invoice' },
      { tabId: 'template-invoice', label: '⚙️ Template Invoice' },
      { tabId: 'transaksi', label: 'Laporan Transaksi' }
    ]
  }
];