import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import '../css/Home.css';
import logoImg from '../assets/pl_img.jpeg';

function Home() {
  const [posts, setPosts] = useState([]);
  const [searchQuery, setSearchQuery] = useState(''); // State untuk Search Bar

  useEffect(() => {
    axios.get(`${API_BASE_URL}/api/posts`)
      .then(res => setPosts(res.data))
      .catch(err => console.error(err));
  }, []);

  // Fungsi untuk memfilter artikel berdasarkan apa yang diketik di Search Bar
  const filteredPosts = posts.filter(post => 
    post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      {/* --- HORIZONTAL NAVBAR --- */}
      <nav className="navbar">
        {/* 2. BUNGKUS LOGO DAN TEKS DI SINI */}
        <div className="navbar-brand-container">
          <img src={logoImg} alt="Pinarak Langgeng Logo" className="navbar-logo" />
          <h1 className="navbar-brand">Pinarak Langgeng</h1>
        </div>
        
        <div className="navbar-menu">
          <a href="#" className="nav-link">Beranda</a>
          <a href="#" className="nav-link">Programming</a>
          <a href="#" className="nav-link">Tutorial</a>
          <Link to="/dashboard" className="btn-admin">Dashboard Admin ➔</Link>
        </div>
      </nav>

      {/* --- DYNAMIC GRID LAYOUT --- */}
      <div className="main-layout">
        
        {/* KOLOM KIRI: Tempat Daftar Artikel (Grid Dinamis) */}
        <div className="articles-grid">
          {filteredPosts.length === 0 ? (
            <p style={{ gridColumn: '1/-1', textAlign: 'center', color: '#7f8c8d' }}>
              Order tidak ditemukan / belum ada Order.
            </p>
          ) : (
            filteredPosts.map(post => (
              <div key={post.id} className="post-card">
                <div>
                  <h2>{post.title}</h2>
                  <div className="post-meta">
                    <span className="badge-status">{post.status}</span> | /{post.slug}
                  </div>
                  <p className="post-content">
                    {post.content.length > 120 ? post.content.substring(0, 120) + '...' : post.content}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* KOLOM KANAN: Sidebar untuk Fitur Menu Tambahan */}
        <aside className="sidebar">
          {/* Fitur Search */}
          <div className="widget">
            <h3>🔍 Cari Artikel</h3>
            <input 
              type="text" 
              placeholder="Ketik judul atau konten..." 
              className="search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Fitur Kategori Konten */}
          <div className="widget">
            <h3>📂 Kategori </h3>
            <ul className="category-list">
              <li className="category-item">🔥 Menu 1 ({posts.length})</li>
              <li className="category-item">💻 Menu 2</li>
              <li className="category-item">⚛️ Menu 3</li>
              <li className="category-item">🗄️ Menu 4</li>
            </ul>
          </div>
        </aside>

      </div>
    </div>
  );
}

export default Home;