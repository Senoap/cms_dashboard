import { useState } from 'react';
import { contentService } from '../services/contentService';

export function useManageContent(onRefreshPosts, setActiveTab) {
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    content: '',
    status: 'draft'
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);

  const generateSlug = (text) => 
    text.toLowerCase().trim().replace(/[^a-z0-9 -]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updated = { ...prev, [name]: value };
      // Otomatis generate slug hanya saat mengisi judul di mode "Create"
      if (name === 'title' && !isEditing) {
        updated.slug = generateSlug(value);
      }
      return updated;
    });
  };

  const setManualSlug = (value) => {
    setFormData((prev) => ({ ...prev, slug: value }));
  };

  const clearForm = () => { 
    setIsEditing(false); 
    setEditId(null); 
    setFormData({ title: '', slug: '', content: '', status: 'draft' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isEditing) {
        await contentService.update(editId, formData);
        alert('Artikel berhasil diperbarui!');
      } else {
        await contentService.create(formData);
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

  const handleEditClick = (post) => {
    setIsEditing(true);
    setEditId(post.id);
    setFormData({
      title: post.title,
      slug: post.slug,
      content: post.content,
      status: post.status
    });
    setActiveTab('create-content');
  };

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

  return {
    formData,
    isEditing,
    loading,
    handleInputChange,
    setManualSlug,
    clearForm,
    handleSubmit,
    handleEditClick,
    handleContentDelete
  };
}