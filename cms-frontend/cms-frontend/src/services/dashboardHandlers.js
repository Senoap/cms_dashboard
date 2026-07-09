import axios from 'axios';
import { barangService } from './barangService';
import { formatSecureInvoiceNumber } from '../utils/securityHelper';

export const dashboardHandlers = {
  // 🍏 1. Handler Content (Artikel)
  handleContentSubmit: async (e, { title, slug, content, status, isEditing, editId, clearForm, fetchPosts, setActiveTab }) => {
    e.preventDefault();
    const postData = { title, slug, content, status };
    try {
      if (isEditing) {
        await axios.put(`http://localhost:8081/api/posts/${editId}`, postData);
      } else {
        await axios.post('http://localhost:8081/api/posts', postData);
      }
      clearForm();
      if (fetchPosts) fetchPosts();
      setActiveTab('list-content');
    } catch (error) {
      console.error(error);
      alert("Gagal menyimpan artikel content, cuy!");
    }
  },

  handleEditClick: (post, { setIsEditing, setEditId, setTitle, setSlug, setContent, setStatus, setActiveTab }) => {
    setIsEditing(true);
    setEditId(post.id);
    setTitle(post.title);
    setSlug(post.slug);
    setContent(post.content);
    setStatus(post.status);
    setActiveTab('create-content');
  },

  handleContentDelete: async (id, { fetchPosts }) => {
    if (window.confirm("Hapus artikel ini?")) {
      try {
        await axios.delete(`http://localhost:8081/api/posts/${id}`);
        if (fetchPosts) fetchPosts();
      } catch (error) {
        console.error(error);
        alert("Gagal menghapus artikel!");
      }
    }
  },

  // 🍏 2. Handler Barang (Inventory)
  handleAddBarang: async (e, { newNamaBarang, hargaBarang, setNewNamaBarang, setHargaBarang, fetchBarang, setActiveTab }) => {
    e.preventDefault();
    try {
      await barangService.create({ nmBarang: newNamaBarang, harga: parseInt(hargaBarang, 10) || 0 });
      setNewNamaBarang('');
      setHargaBarang('');
      if (fetchBarang) fetchBarang();
      setActiveTab('list-barang');
    } catch (error) {
      alert("Gagal menambahkan barang!");
    }
  },

  handleDeleteBarang: async (id, { fetchBarang }) => {
    if (window.confirm("Beneran mau hapus barang ini, cuy?")) {
      try {
        await barangService.delete(id);
        alert("Barang berhasil dihapus!");
        if (fetchBarang) fetchBarang();
      } catch (err) {
        alert("Gagal menghapus barang, data terikat order!");
      }
    }
  },

  // 🍏 3. Handler Order (Transaksi)
  handleOrderSubmit: async (e, { orders, setOrders, barangList, selectedBarangId, setSelectedBarangId, jumlah, setJumlah, tanggalPesan, setTanggalPesan, tanggalAcara, setTanggalAcara, pemesan, setPemesan, noHpPemesan, setNoHpPemesan, fetchOrders }) => {
    e.preventDefault();
    const targetBarang = barangList.find(b => String(b.id) === String(selectedBarangId));
    if (!targetBarang) return alert("Barang tidak ditemukan!");

    const hargaSatuan = parseInt(targetBarang.harga, 10) || 0;
    const kuantitas = parseInt(jumlah, 10) || 0;
    const totalTagihan = hargaSatuan * kuantitas;

    const orderDataKeBackend = {
      pemesan: pemesan,
      noHpPemesan: noHpPemesan,
      jumlah: kuantitas,
      harga: totalTagihan,
      tanggalPesan: tanggalPesan,
      tanggalAcara: tanggalAcara,
      barang: { id: Number(selectedBarangId) }
    };

    try {
      const response = await axios.post('http://localhost:8081/api/order', orderDataKeBackend);
      alert("Order sukses disimpan ke database!");
      if (fetchOrders) fetchOrders();
      setSelectedBarangId(''); setJumlah(''); setTanggalPesan(''); setTanggalAcara(''); setPemesan(''); setNoHpPemesan('');
    } catch (error) {
      console.error(error);
      alert("Gagal simpan order, cuy!");
    }
  },

  // 🍏 4. Handler Invoice (ID Invoice = ID Order Angka Murni)
  handleInvoiceSubmit: async (e, { selectedOrderId, setSelectedOrderId, tanggalInvoice, setTanggalInvoice, invoices, setInvoices, fetchInvoices }) => {
    e.preventDefault();
    if (!selectedOrderId) return alert("Silakan pilih transaksi order terlebih dahulu!");

    // Generate nomor invoice dengan format baru romawi
    const generatedInvoiceNumber = formatSecureInvoiceNumber(selectedOrderId, tanggalInvoice);

    const invoiceDataKeBackend = {
      id: Number(selectedOrderId),       // ID Invoice mengikuti ID Order angka murni
      noInvoice: generatedInvoiceNumber, // Format teks romawi INV-xxx/MM/dd-YYYY
      tanggalInvoice: tanggalInvoice,
      order: { id: Number(selectedOrderId) }
    };

    try {
      const response = await axios.post('http://localhost:8081/api/invoice', invoiceDataKeBackend);
      alert(`Jrettt! Invoice ${generatedInvoiceNumber} berhasil diterbitkan!`);

      if (setInvoices && invoices) {
        setInvoices([...invoices, response.data || invoiceDataKeBackend]);
      }

      if (fetchInvoices) fetchInvoices();
      setSelectedOrderId('');
      setTanggalInvoice('');
    } catch (error) {
      console.error("Gagal insert invoice ke DB:", error);
      alert("Gagal terbit invoice! Pastikan sudah pasang @JsonFormat(pattern='yyyy-MM-dd') di Invoice.java backend.");
    }
  }
};