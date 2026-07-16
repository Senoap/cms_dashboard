import { useState } from 'react';
import { Link } from 'react-router-dom';
import '../css/Dashboard.css';
import logoImg from '../assets/pl_img.jpeg';

// Import Sub-Menu Components
import ManageContent from '../components/ManageContent';
import ManageInventory from '../components/ManageInventory';
import ManageOrder from '../components/ManageOrder';
import ManageInvoice from '../components/ManageInvoice';
import OrderDetail from '../components/OrderDetail';
import TransactionList from '../components/TransactionList';

// Import Services, Configs & Global Modals
import { useDashboardData } from '../hooks/useDashboardData';
import { DEFAULT_TEMPLATE_CONFIG, MENU_STRUCTURE } from '../constant';
import EditBarangModal from '../components/EditBarangModal';
import OrderDetailModal from '../components/OrderDetailModal';

function Dashboard() {
  // =================================================================
  // 1. STATE MANAGEMENT: NAVIGATION & THEME STATE
  // =================================================================
  const [openMenu, setOpenMenu] = useState('content');
  const [isLightMode, setIsLightMode] = useState(false);
  const [activeTab, setActiveTab] = useState('list-content');

  // =================================================================
  // 2. STATE MANAGEMENT: MODALS & GLOBAL PRINT INVOICE CONFIG
  // =================================================================
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedBarang, setSelectedBarang] = useState(null);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [templateConfig, setTemplateConfig] = useState(DEFAULT_TEMPLATE_CONFIG);

  // =================================================================
  // 3. CUSTOM HOOKS: DATA FETCHING PROCESS
  // =================================================================
  const {
    posts,
    barangList,
    orders,
    invoices,
    loadPosts,
    loadBarang,
    loadOrders,
    loadInvoices
  } = useDashboardData();

  // =================================================================
  // 4. INTERACTION HANDLERS
  // =================================================================
  const toggleMenu = (menuName) => setOpenMenu(openMenu === menuName ? '' : menuName);

  const handleEditBarang = (barang) => {
    setSelectedBarang(barang);
    setIsEditModalOpen(true);
  };

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setIsOrderModalOpen(true);
  };

  // =================================================================
  // 5. DYNAMIC RENDER CONTROLLER (Fungsi Perapian Utama)
  // =================================================================
  const renderMainContent = () => {
    // Mengecek prefix menu untuk memuat komponen yang sesuai secara dinamis
    if (activeTab.includes('content')) {
      return <ManageContent posts={posts} onRefreshPosts={loadPosts} activeTab={activeTab} setActiveTab={setActiveTab} />;
    }
    if (activeTab.includes('barang')) {
      return <ManageInventory barangList={barangList} onRefreshBarang={loadBarang} activeTab={activeTab} onEditBarang={handleEditBarang} />;
    }
    if (activeTab.includes('order')) {
      return <ManageOrder orders={orders} barangList={barangList} onRefreshOrder={loadOrders} activeTab={activeTab} />;
    }
    if (activeTab.includes('invoice')) {
      return <ManageInvoice invoices={invoices} orders={orders} onRefreshInvoice={loadInvoices} activeTab={activeTab} templateConfig={templateConfig} setTemplateConfig={setTemplateConfig} />;
    }
    if (activeTab === 'transaksi') {
      return <TransactionList />;
    }
    if (activeTab === 'detail-order') {
      return <OrderDetail orderData={selectedOrder} onBack={() => setActiveTab('list-order')} />;
    }
    return <div>Pilih menu di sebelah kiri, cuy.</div>;
  };

  return (
    <div className={`admin-container ${isLightMode ? 'light-theme' : ''}`}>

      {/* VIEW SECTION: LEFT SIDEBAR NAVIGATION */}
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

        {/* Looping Dinamis Menu Sidebar */}
        <ul className="sidebar-menu">
          {MENU_STRUCTURE.map((menu) => (
            <li key={menu.id}>
              <div className="menu-item" onClick={() => toggleMenu(menu.id)}>
                <span>{menu.label}</span>
                <span>{openMenu === menu.id ? '🔼' : '🔽'}</span>
              </div>
              {openMenu === menu.id && (
                <ul className="submenu-list">
                  {menu.items.map((sub) => (
                    <li
                      key={sub.tabId}
                      className={`submenu-item ${activeTab === sub.tabId ? 'active' : ''}`}
                      onClick={() => setActiveTab(sub.tabId)}
                    >
                      {sub.label}
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>

        <div className="sidebar-footer">
          <Link to="/" className="link-back">🥞 Keluar ke Web Utama</Link>
        </div>
      </aside>

      {/* VIEW SECTION: RIGHT MAIN CONTENT AREA */}
      <main className="admin-content">
        <div className="content-header">
          <h2>Halaman Kendali Admin ({activeTab.replace('-', ' ').toUpperCase()})</h2>
        </div>

        {/* 🍏 Bersih dan Efisien: Hanya memuat komponen yang sedang aktif */}
        {renderMainContent()}
      </main>

      {/* VIEW SECTION: BACKGROUND OVERLAY GLOBAL MODALS WINDOWS */}
      <EditBarangModal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} barangData={selectedBarang} onRefresh={loadBarang} />
      <OrderDetailModal isOpen={isOrderModalOpen} onClose={() => setIsOrderModalOpen(false)} orderData={selectedOrder} onRefresh={loadOrders} />
    </div>
  );
}

export default Dashboard;