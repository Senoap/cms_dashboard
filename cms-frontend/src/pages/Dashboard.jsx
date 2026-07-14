import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../css/Dashboard.css';
import logoImg from '../assets/pl_img.jpeg';

// Import Komponen Sub-Menu
import ManageContent from '../components/ManageContent';
import ManageInventory from '../components/ManageInventory';
import ManageOrder from '../components/ManageOrder';
import ManageInvoice from '../components/ManageInvoice';
import OrderDetail from '../components/OrderDetail';

// Import Service & Modal Popup
import { dashboardService } from '../services/dashboardService'; 
import EditBarangModal from '../components/EditBarangModal';
import OrderDetailModal from '../components/OrderDetailModal';

function Dashboard() {
  const [openMenu, setOpenMenu] = useState('content');
  const [isLightMode, setIsLightMode] = useState(false);
  const [activeTab, setActiveTab] = useState('list-content');

  // 🍏 State Utama Hanya Menyimpan Data Array dari Backend
  const [posts, setPosts] = useState([]);
  const [barangList, setBarangList] = useState([]);
  const [orders, setOrders] = useState([]);
  const [invoices, setInvoices] = useState([]);

  // State Modal Global & Data yang Sedang Dipilih
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedBarang, setSelectedBarang] = useState(null);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // State Konfigurasi Template Invoice Tetap di Sini (Global Share)
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

  // 🍏 Fungsi Tarik Data dari Pusat Service
  const loadPosts = async () => { try { const data = await dashboardService.fetchPosts(); setPosts(data); } catch (e) { console.error(e); } };
  const loadBarang = async () => { try { const data = await dashboardService.fetchBarang(); setBarangList(data); } catch (e) { console.error(e); } };
  const loadOrders = async () => { try { const data = await dashboardService.fetchOrders(); setOrders(data); } catch (e) { console.error(e); } };
  const loadInvoices = async () => { try { const data = await dashboardService.fetchInvoices(); setInvoices(data); } catch (e) { console.error(e); } };

  useEffect(() => { loadPosts(); loadBarang(); loadOrders(); loadInvoices(); }, []);

  const toggleMenu = (menuName) => setOpenMenu(openMenu === menuName ? '' : menuName);

  // Aksi pembuka modal edit barang
  const handleEditBarang = (barang) => {
    setSelectedBarang(barang);
    setIsEditModalOpen(true);
  };

  // Aksi pembuka modal detail order dari tabel
  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setIsOrderModalOpen(true);
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
                <li className={`submenu-item ${activeTab === 'create-content' ? 'active' : ''}`} onClick={() => setActiveTab('create-content')}>➕ Create Content</li>
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

        <ManageContent
          posts={posts}
          onRefreshPosts={loadPosts}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />

        <ManageInventory
          barangList={barangList}
          onRefreshBarang={loadBarang}
          activeTab={activeTab}
          onEditBarang={handleEditBarang}
        />

        {/* 🍏 Bersih total dari props state form bawaan */}
        <ManageOrder 
          orders={orders} 
          barangList={barangList} 
          onRefreshOrder={loadOrders} 
          activeTab={activeTab} 
        />

        {/* 🍏 Ringkas karena urusan form input dan parsing ditangani sendiri oleh ManageInvoice */}
        <ManageInvoice 
          invoices={invoices} 
          orders={orders} 
          onRefreshInvoice={loadInvoices} 
          activeTab={activeTab} 
          templateConfig={templateConfig} 
          setTemplateConfig={setTemplateConfig} 
        />

        {activeTab === 'detail-order' && (
          <OrderDetail orderData={selectedOrder} onBack={() => setActiveTab('list-order')} />
        )}
      </main>

      {/* MODAL WINDOW POPUP GLOBAL */}
      <EditBarangModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        barangData={selectedBarang}
        onRefresh={loadBarang}
      />

      <OrderDetailModal 
        isOpen={isOrderModalOpen} 
        onClose={() => setIsOrderModalOpen(false)} 
        orderData={selectedOrder} 
        onRefresh={loadOrders} 
      />
    </div>
  );
}

export default Dashboard;