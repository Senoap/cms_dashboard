import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios'; // 🍏 Sudah dipastikan 'axios' bukan 'ajax'
import '../css/Dashboard.css';
import logoImg from '../assets/pl_img.jpeg';

// Import Komponen Sub-Menu
import ManageContent from '../components/ManageContent';
import ManageInventory from '../components/ManageInventory';
import ManageOrder from '../components/ManageOrder';
import ManageInvoice from '../components/ManageInvoice';

// Import Service, Handlers, dan Modal Popup
import { barangService } from '../services/barangService';
import { dashboardHandlers } from '../services/dashboardHandlers';
import EditBarangModal from '../components/EditBarangModal';

function Dashboard() {
  const [openMenu, setOpenMenu] = useState('content');
  const [isLightMode, setIsLightMode] = useState(false);
  const [activeTab, setActiveTab] = useState('list-content');

  // State Content (Artikel)
  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [content, setContent] = useState('');
  const [status, setStatus] = useState('draft');
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  // State Inventory (Barang)
  const [barangList, setBarangList] = useState([]);
  const [newNamaBarang, setNewNamaBarang] = useState('');
  const [hargaBarang, setHargaBarang] = useState('');

  // State Modal Edit
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedBarang, setSelectedBarang] = useState(null);

  // State Order
  const [orders, setOrders] = useState([]);
  const [selectedBarangId, setSelectedBarangId] = useState('');
  const [jumlah, setJumlah] = useState('');
  const [tanggalPesan, setTanggalPesan] = useState('');
  const [tanggalAcara, setTanggalAcara] = useState('');
  const [pemesan, setPemesan] = useState('');
  const [noHpPemesan, setNoHpPemesan] = useState('');

  // State Invoice
  const [invoices, setInvoices] = useState([]);
  const [selectedOrderId, setSelectedOrderId] = useState('');
  const [tanggalInvoice, setTanggalInvoice] = useState('');
  const [templateConfig, setTemplateConfig] = useState({
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
  });

  // Fetch Data Awal saat Load Page dari Database Spring Boot
  const fetchPosts = async () => { try { const res = await axios.get('http://localhost:8081/api/posts'); setPosts(res.data); } catch (e) { console.error(e); } };
  const fetchBarang = async () => { try { const data = await barangService.getAll(); setBarangList(data); } catch (e) { console.error(e); } };
  const fetchOrders = async () => { try { const res = await axios.get('http://localhost:8081/api/order'); setOrders(res.data); } catch (e) { console.error(e); } };
  const fetchInvoices = async () => { try { const res = await axios.get('http://localhost:8081/api/invoice'); setInvoices(res.data); } catch (e) { console.error(e); } };

  useEffect(() => { fetchPosts(); fetchBarang(); fetchOrders(); fetchInvoices(); }, []);

  const toggleMenu = (menuName) => setOpenMenu(openMenu === menuName ? '' : menuName);
  const generateSlug = (text) => text.toLowerCase().trim().replace(/[^a-z0-9 -]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-');
  const clearForm = () => { setIsEditing(false); setEditId(null); setTitle(''); setSlug(''); setContent(''); setStatus('draft'); };

  // 🍏 JEMBATAN KE FILE HANDLERS OUTSOURCING
  const handleContentSubmit = (e) => dashboardHandlers.handleContentSubmit(e, { title, slug, content, status, isEditing, editId, clearForm, fetchPosts, setActiveTab });
  const handleEditClick = (post) => dashboardHandlers.handleEditClick(post, { setIsEditing, setEditId, setTitle, setSlug, setContent, setStatus, setActiveTab });
  const handleContentDelete = (id) => dashboardHandlers.handleContentDelete(id, { fetchPosts });

  const handleAddBarang = (e) => dashboardHandlers.handleAddBarang(e, { newNamaBarang, hargaBarang, setNewNamaBarang, setHargaBarang, fetchBarang, setActiveTab });
  const handleDeleteBarang = (id) => dashboardHandlers.handleDeleteBarang(id, { fetchBarang });
  
  // Memastikan fetchOrders dikirim agar form order langsung refresh list tabel
  const handleOrderSubmit = (e, extraData) => dashboardHandlers.handleOrderSubmit(e, extraData, { orders, setOrders, barangList, selectedBarangId, setSelectedBarangId, jumlah, setJumlah, tanggalPesan, setTanggalPesan, tanggalAcara, setTanggalAcara, pemesan, setPemesan, noHpPemesan, setNoHpPemesan, fetchOrders });
  
  // 🍏 FIX: fetchInvoices SEKARANG DI-OPER BIAR INSTAN MASUK LIST TABEL TANPA REFRESH BROWSER MANUAL
  const handleInvoiceSubmit = (e) => dashboardHandlers.handleInvoiceSubmit(e, { selectedOrderId, setSelectedOrderId, tanggalInvoice, setTanggalInvoice, invoices, setInvoices, orders, fetchInvoices });

  const handleEditBarang = (barang) => {
    setSelectedBarang(barang);
    setIsEditModalOpen(true);
  };

  return (
    <div className={`admin-container ${isLightMode ? 'light-theme' : ''}`}>
      {/* SIDEBAR KIRI */}
      <aside className="admin-sidebar">
        <div className="sidebar-header">
          <img src={logoImg} alt="Logo" className="sidebar-logo" />
          <h1 className="sidebar-title">Pinarak Langgeng</h1>
        </div>
        <div className="theme-switch-wrapper">
          <span>Dark</span>
          <label className="theme-switch">
            <input type="checkbox" checked={isLightMode} onChange={() => setIsLightMode(!isLightMode)} />
            <div className="slider"></div>
          </label>
          <span>Light</span>
        </div>

        <ul className="sidebar-menu">
          <li>
            <div className="menu-item" onClick={() => toggleMenu('content')}><span>📂 Menu Content</span><span>{openMenu === 'content' ? '🔼' : '🔽'}</span></div>
            {openMenu === 'content' && (
              <ul className="submenu-list">
                <li className={`submenu-item ${activeTab === 'create-content' ? 'active' : ''}`} onClick={() => { setActiveTab('create-content'); clearForm(); }}>➕ Create Content</li>
                <li className={`submenu-item ${activeTab === 'list-content' ? 'active' : ''}`} onClick={() => setActiveTab('list-content')}>📋 List Content</li>
              </ul>
            )}
          </li>
          <li>
            <div className="menu-item" onClick={() => toggleMenu('inventory')}><span>🛠️ Menu Inventory</span><span>{openMenu === 'inventory' ? '🔼' : '🔽'}</span></div>
            {openMenu === 'inventory' && (
              <ul className="submenu-list">
                <li className={`submenu-item ${activeTab === 'create-barang' ? 'active' : ''}`} onClick={() => setActiveTab('create-barang')}>➕ Create Barang</li>
                <li className={`submenu-item ${activeTab === 'list-barang' ? 'active' : ''}`} onClick={() => setActiveTab('list-barang')}>📋 List Barang</li>
              </ul>
            )}
          </li>
          <li>
            <div className="menu-item" onClick={() => toggleMenu('order')}><span>📦 Menu Order</span><span>{openMenu === 'order' ? '🔼' : '🔽'}</span></div>
            {openMenu === 'order' && (
              <ul className="submenu-list">
                <li className={`submenu-item ${activeTab === 'create-order' ? 'active' : ''}`} onClick={() => setActiveTab('create-order')}>➕ Create Order</li>
                <li className={`submenu-item ${activeTab === 'list-order' ? 'active' : ''}`} onClick={() => setActiveTab('list-order')}>📋 List Order</li>
              </ul>
            )}
          </li>
          <li>
            <div className="menu-item" onClick={() => toggleMenu('invoice')}><span>🧾 Menu Invoice</span><span>{openMenu === 'invoice' ? '🔼' : '🔽'}</span></div>
            {openMenu === 'invoice' && (
              <ul className="submenu-list">
                <li className={`submenu-item ${activeTab === 'create-invoice' ? 'active' : ''}`} onClick={() => setActiveTab('create-invoice')}>➕ Create Invoice</li>
                <li className={`submenu-item ${activeTab === 'list-invoice' ? 'active' : ''}`} onClick={() => setActiveTab('list-invoice')}>📋 List Invoice</li>
                <li className={`submenu-item ${activeTab === 'template-invoice' ? 'active' : ''}`} onClick={() => setActiveTab('template-invoice')}>⚙️ Template Invoice</li>
              </ul>
            )}
          </li>
        </ul>
        <div className="sidebar-footer"><Link to="/" className="link-back">🥞 Keluar ke Web Utama</Link></div>
      </aside>

      {/* KONTEN KANAN */}
      <main className="admin-content">
        <div className="content-header"><h2>Halaman Kendali Admin ({activeTab.replace('-', ' ').toUpperCase()})</h2></div>

        <ManageContent posts={posts} onSubmit={handleContentSubmit} onEdit={handleEditClick} onDelete={handleContentDelete} isEditing={isEditing} clearForm={clearForm} title={title} setTitle={setTitle} slug={slug} setSlug={setSlug} content={content} setContent={setContent} status={status} setStatus={setStatus} generateSlug={generateSlug} activeTab={activeTab} />

        <ManageInventory barangList={barangList} handleAddBarang={handleAddBarang} newNamaBarang={newNamaBarang} setNewNamaBarang={setNewNamaBarang} hargaBarang={hargaBarang} setHargaBarang={setHargaBarang} activeTab={activeTab} onDeleteBarang={handleDeleteBarang} onEditBarang={handleEditBarang} />

        <ManageOrder orders={orders} barangList={barangList} onOrderSubmit={handleOrderSubmit} selectedBarangId={selectedBarangId} setSelectedBarangId={setSelectedBarangId} jumlah={jumlah} setQuantity={setJumlah} setJumlah={setJumlah} tanggalPesan={tanggalPesan} setTimestamp={setTanggalPesan} setTanggalPesan={setTanggalPesan} tanggalAcara={tanggalAcara} setTanggalAcara={setTanggalAcara} pemesan={pemesan} setPemesan={setPemesan} noHpPemesan={noHpPemesan} setNoHpPemesan={setNoHpPemesan} activeTab={activeTab} />

        <ManageInvoice invoices={invoices} orders={orders} onInvoiceSubmit={handleInvoiceSubmit} selectedOrderId={selectedOrderId} setSelectedOrderId={setSelectedOrderId} tanggalInvoice={tanggalInvoice} setTanggalInvoice={setTanggalInvoice} activeTab={activeTab} templateConfig={templateConfig} setTemplateConfig={setTemplateConfig} />
      </main>

      {/* MODAL EDIT BARANG POPUP */}
      <EditBarangModal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} barangData={selectedBarang} onRefresh={fetchBarang} />
    </div>
  );
}

export default Dashboard; // 🍏 Di bawah baris ini dijamin sudah tidak ada kurung kurawal kesasar lagi!