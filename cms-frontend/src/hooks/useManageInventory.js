import { useState } from 'react';
import { barangService } from '../services/barangService';

export function useManageInventory(barangList, onRefreshBarang) {
  const [formData, setFormData] = useState({
    newNamaBarang: '',
    hargaBarang: ''
  });
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Perhitungan Data Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = barangList.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(barangList.length / itemsPerPage);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        nmBarang: formData.newNamaBarang,
        harga: parseInt(formData.hargaBarang, 10) || 0
      };

      await barangService.create(payload);
      alert('Barang berhasil ditambahkan!');
      
      setFormData({ newNamaBarang: '', hargaBarang: '' });
      onRefreshBarang();
    } catch (err) {
      console.error(err);
      alert('Gagal menambah barang baru, cuy!');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = async (id, nama) => {
    const yakin = window.confirm(`Apakah Anda yakin ingin menghapus barang "${nama}"?`);
    if (!yakin) return;

    try {
      await barangService.delete(id);
      alert('Barang berhasil dihapus!');
      onRefreshBarang();
      
      // Mengamankan halaman pagination jika item terakhir di halaman tersebut dihapus
      const updatedTotalPages = Math.ceil((barangList.length - 1) / itemsPerPage);
      if (currentPage > updatedTotalPages && updatedTotalPages > 0) {
        setCurrentPage(updatedTotalPages);
      }
    } catch (err) {
      console.error(err);
      alert('Gagal menghapus barang!');
    }
  };

  return {
    formData,
    loading,
    currentPage,
    currentItems,
    totalPages,
    setCurrentPage,
    handleInputChange,
    handleSubmit,
    handleDeleteClick
  };
}