import { useState } from 'react';
import { contentService } from '../services/contentService'; // 🍏 Menggunakan service baru

function ManageContent({ posts, onRefreshPosts, activeTab, setActiveTab }) {
  // 1. Isolasi semua state form artikel di sini[cite: 12]
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [content, setContent] = useState('');
  const [status, setStatus] = useState('draft');
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);

  // 2. Helper Lokal untuk Form Konten[cite: 12]
  const generateSlug = (text) => 
    text.toLowerCase().trim().replace(/[^a-z0-9 -]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-');

  const clearForm = () => { 
    setIsEditing(false); 
    setEditId(null); 
    setTitle(''); 
    setSlug(''); 
    setContent(''); 
    setStatus('draft'); 
  };

  // 3. Aksi Form Submit (Create & Update) Langsung via Service
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = { title, slug, content, status };

      if (isEditing) {
        await contentService.update(editId, payload);
        alert('Artikel berhasil diperbarui!');
      } else {
        await contentService.create(payload);
        alert('Artikel berhasil ditambahkan!');
      }

      clearForm();
      onRefreshPosts();
      setActiveTab('list-content');
    } catch (err) {
      console.error(err);
      alert('Gagal menyimpan artikel, cuy!');
    } finally {
      setLoading(false);
    }
  };

  // 4. Aksi Pengisian Form Saat Tombol Edit Ditekan
  const handleEditClick = (post) => {
    setIsEditing(true);
    setEditId(post.id);
    setTitle(post.title);
    setSlug(post.slug);
    setContent(post.content);
    setStatus(post.status);
    setActiveTab('create-content'); // Pindah ke tab form edit
  };

  // 5. Aksi Hapus Konten Langsung via Service
  const handleContentDelete = async (id) => {
    const yakin = window.confirm('Apakah Anda yakin ingin menghapus artikel ini?');
    if (!yakin) return;

    try {
      await contentService.delete(id);
      alert('Artikel berhasil dihapus!');
      onRefreshPosts();
    } catch (err) {
      console.error(err);
      alert('Gagal menghapus artikel!');
    }
  };

  // 6. Render UI HTML Premium bawaan kamu tanpa mengubah class/style sedikitpun[cite: 12]
  if (activeTab === 'create-content') {
    return (
      <div className="form-container-premium">
        <div className="form-header-premium">
          <h3>{isEditing ? "🔄 Edit Postingan Artikel" : "✨ Buat Artikel Baru"}</h3>
          <p>Isi formulir di bawah ini untuk menerbitkan artikel ke halaman utama.</p>
        </div>
        
        <form onSubmit={handleSubmit} className="form-body-premium">
          <div className="form-group-premium">
            <label>Judul Artikel</label>
            <input 
              type="text" 
              placeholder="Masukkan judul yang menarik..." 
              value={title} 
              onChange={e => { setTitle(e.target.value); if (!isEditing) setSlug(generateSlug(e.target.value)); }} 
              required 
            />
          </div>

          <div className="form-group-premium">
            <label>Slug URL (Terisi Otomatis)</label>
            <input 
              type="text" 
              value={slug} 
              onChange={e => setSlug(e.target.value)} 
              disabled={!isEditing} 
              required 
              className="input-slug-premium"
            />
          </div>

          <div className="form-group-premium">
            <label>Isi Konten Artikel</label>
            <textarea 
              placeholder="Tuliskan cerita atau informasi lengkap di sini..." 
              value={content} 
              onChange={e => setContent(e.target.value)} 
              required 
              rows="10" 
            />
          </div>

          <div className="form-group-premium">
            <label>Status Publikasi</label>
            <select value={status} onChange={e => setStatus(e.target.value)}>
              <option value="draft">📁 Simpan sebagai Draft</option>
              <option value="published">🚀 Terbitkan Langsung (Published)</option>
            </select>
          </div>

          <div className="form-actions-premium">
            <button type="submit" disabled={loading} className="btn-submit-premium">
              {loading ? "Memproses..." : (isEditing ? "🔄 Perbarui Artikel" : "💾 Cetak & Tayangkan")}
            </button>
            {isEditing && (
              <button type="button" onClick={clearForm} className="btn-cancel-premium">
                ❌ Batalkan Perubahan
              </button>
            )}
          </div>
        </form>
      </div>
    );
  }

  if (activeTab === 'list-content') {
    return (
      <div className="table-container-premium">
        <div className="table-header-premium">
          <h3>📋 Daftar Artikel Terdaftar</h3>
          <p>Semua artikel yang sudah dibuat. Anda bisa mengubah status atau menghapus konten dari sini.</p>
        </div>
        
        <div className="table-responsive-premium">
          <table className="crud-table-premium">
            <thead>
              <tr>
                <th>Judul Artikel</th>
                <th style={{ width: '180px' }}>Status</th>
                <th style={{ width: '180px', textAlign: 'center' }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {posts.length === 0 ? (
                <tr>
                  <td colSpan="3" style={{ textAlign: 'center', padding: '30px', color: '#888' }}>
                    📭 Belum ada artikel yang dibuat.
                  </td>
                </tr>
              ) : (
                posts.map(post => (
                  <tr key={post.id}>
                    <td><strong>{post.title}</strong></td>
                    <td>
                      <span className={`badge-status-premium ${post.status === 'published' ? 'badge-published-premium' : 'badge-draft-premium'}`}>
                        {post.status === 'published' ? '🚀 Published' : '📁 Draft'}
                      </span>
                    </td>
                    <td>
                      <div className="table-actions-premium">
                        <button onClick={() => handleEditClick(post)} className="btn-action-edit" title="Edit Artikel">
                          ✏️ Edit
                        </button>
                        <button onClick={() => handleContentDelete(post.id)} className="btn-action-delete" title="Hapus Artikel">
                          🗑️ Hapus
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return null;
}

export default ManageContent;