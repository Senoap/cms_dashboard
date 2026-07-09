import axios from 'axios';
import { barangService } from './barangService';
import { formatSecureInvoiceNumber } from '../utils/securityHelper';
import API_BASE_URL from './api';

export const dashboardHandlers = {
    // 🍏 1. Handler Content (Artikel)
    handleContentSubmit: async (e, { title, slug, content, status, isEditing, editId, clearForm, fetchPosts, setActiveTab }) => {
        e.preventDefault();
        const postData = { title, slug, content, status };
        try {
            if (isEditing) {
                await axios.put(`${API_BASE_URL}/api/posts/${editId}`, postData);
            } else {
                await axios.post(`${API_BASE_URL}/api/posts`, postData);
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
                await axios.delete(`${API_BASE_URL}/api/posts/${id}`);
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
    // 🍏 HANDLE SUBMIT ORDER MULTI-BARANG TERBARU
    handleOrderSubmit: async (e, extraData, {
        tanggalPesan, setTanggalPesan, tanggalAcara, setTanggalAcara,
        pemesan, setPemesan, noHpPemesan, setNoHpPemesan, fetchOrders
    }) => {
        // Ambil data cart, grandTotal, dan fungsi reset setCart yang dikirim dari komponen anak
        const { cart, grandTotal, setCart } = extraData;

        if (!cart || cart.length === 0) {
            alert("Waduh, keranjang belanja masih kosong, cuy! Tambah barang dulu.");
            return;
        }

        // 1. Susun payload JSON terstruktur (Induk & Rincian Anak)
        const orderPayload = {
            pemesan: pemesan,
            noHpPemesan: noHpPemesan,
            tanggalPesan: tanggalPesan,
            tanggalAcara: tanggalAcara,
            harga: grandTotal, // Grand total gabungan masuk ke kolom induk 'harga'
            details: cart.map(item => ({
                barang: { id: Number(item.barangId) }, // Masuk ke tbl_order_detail relasi barang_id
                jumlah: item.jumlah,
                subTotal: item.subTotal
            }))
        };

        try {
            // 2. Tembak data ke API Backend Java Spring Boot
            await axios.post(`${API_BASE_URL}/api/order`, orderPayload);

            alert("💥 Jrettt! Transaksi Multi-Barang sukses disimpan ke Cloud Database!");

            // 3. Reset total isi form & bersihkan keranjang belanja di UI
            setCart([]);
            setPemesan('');
            setNoHpPemesan('');
            setTanggalPesan('');
            setTanggalAcara('');

            // 4. Refresh list data orderan biar langsung tampil di tabel rincian terbaru
            if (fetchOrders) fetchOrders();
        } catch (error) {
            console.error("Gagal menyimpan transaksi order:", error);
            alert("Gagal simpan order! Periksa console log atau pastikan Controller Java lu nerima @RequestBody Order.");
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
            const response = await axios.post(`${API_BASE_URL}/api/invoice`, invoiceDataKeBackend);
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