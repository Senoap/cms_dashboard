import { useManageContent } from '../hooks/useManageContent';

function ManageContent({ posts, onRefreshPosts, activeTab, setActiveTab }) {
  // 🍏 Memakai custom hook lokal untuk memisahkan seluruh logika bisnis & state
  const {
    formData,
    isEditing,
    loading,
    handleInputChange,
    setManualSlug,
    clearForm,
    handleSubmit,
    handleEditClick,
    handleContentDelete
  } = useManageContent(onRefreshPosts, setActiveTab);

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
              name="title" // 🍏 Harus cocok dengan key properti di hook
              placeholder="Masukkan judul yang menarik..." 
              value={formData.title} 
              onChange={handleInputChange} 
              required 
            />
          </div>

          <div className="form-group-premium">
            <label>Slug URL (Terisi Otomatis)</label>
            <input 
              type="text" 
              name="slug"
              value={formData.slug} 
              onChange={e => setManualSlug(e.target.value)} 
              disabled={!isEditing} 
              required 
              className="input-slug-premium"
            />
          </div>

          <div className="form-group-premium">
            <label>Isi Konten Artikel</label>
            <textarea 
              name="content" // 🍏 Harus cocok dengan key properti di hook
              placeholder="Tuliskan cerita atau informasi lengkap di sini..." 
              value={formData.content} 
              onChange={handleInputChange} 
              required 
              rows="10" 
            />
          </div>

          <div className="form-group-premium">
            <label>Status Publikasi</label>
            <select name="status" value={formData.status} onChange={handleInputChange}>
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