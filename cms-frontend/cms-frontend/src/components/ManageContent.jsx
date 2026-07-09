import { useState } from 'react';

function ManageContent({ posts, onSubmit, onEdit, onDelete, isEditing, clearForm, title, setTitle, slug, setSlug, content, setContent, status, setStatus, generateSlug, activeTab, setActiveTab }) {
  
  if (activeTab === 'create-content') {
    return (
      <div className="form-container-premium">
        <div className="form-header-premium">
          <h3>{isEditing ? "🔄 Edit Postingan Artikel" : "✨ Buat Artikel Baru"}</h3>
          <p>Isi formulir di bawah ini untuk menerbitkan artikel ke halaman utama.</p>
        </div>
        
        <form onSubmit={onSubmit} className="form-body-premium">
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
            <button type="submit" className="btn-submit-premium">
              {isEditing ? "🔄 Perbarui Artikel" : "💾 Cetak & Tayangkan"}
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

  // ... (Bagian case 'create-content' di atas biarkan tetap sama)

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
                {/* 📝 HANYA MENAMPILKAN JUDUL, STATUS, DAN AKSI */}
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
                    {/* ID DAN SLUG SUDAH DIHAPUS DARI SINI */}
                    <td><strong>{post.title}</strong></td>
                    <td>
                      <span className={`badge-status-premium ${post.status === 'published' ? 'badge-published-premium' : 'badge-draft-premium'}`}>
                        {post.status === 'published' ? '🚀 Published' : '📁 Draft'}
                      </span>
                    </td>
                    <td>
                      <div className="table-actions-premium">
                        <button onClick={() => onEdit(post)} className="btn-action-edit" title="Edit Artikel">
                          ✏️ Edit
                        </button>
                        <button onClick={() => onDelete(post.id)} className="btn-action-delete" title="Hapus Artikel">
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