import { useState } from 'react';
import { orderService } from '../services/orderService';

export function useManageOrder(barangList, onRefreshOrder) {
  const [itemInput, setItemInput] = useState({ selectedBarangId: '', jumlah: '' });
  const [customerForm, setCustomerForm] = useState({
    tanggalPesan: '',
    tanggalAcara: '',
    pemesan: '',
    noHpPemesan: '',
    alamat: ''
  });
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleItemInputChange = (e) => {
    const { name, value } = e.target;
    setItemInput(prev => ({ ...prev, [name]: value }));
  };

  const handleCustomerInputChange = (e) => {
    const { name, value } = e.target;
    setCustomerForm(prev => ({ ...prev, [name]: value }));
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    const { selectedBarangId, jumlah } = itemInput;

    if (!selectedBarangId || !jumlah || parseInt(jumlah, 10) <= 0) {
      alert("Pilih barang dan isi jumlah kuantitas yang valid dulu, cuy!");
      return;
    }

    const targetBarang = barangList.find(b => String(b.id) === String(selectedBarangId));
    if (!targetBarang) return;

    const qty = parseInt(jumlah, 10);
    const hargaSatuan = parseInt(targetBarang.harga, 10) || 0;
    const subTotal = hargaSatuan * qty;

    const existingIndex = cart.findIndex(item => String(item.barangId) === String(targetBarang.id));

    if (existingIndex > -1) {
      const updatedCart = [...cart];
      updatedCart[existingIndex].jumlah += qty;
      updatedCart[existingIndex].subTotal += subTotal;
      setCart(updatedCart);
    } else {
      setCart([...cart, {
        barangId: targetBarang.id,
        nmBarang: targetBarang.nmBarang,
        hargaSatuan: hargaSatuan,
        jumlah: qty,
        subTotal: subTotal
      }]);
    }

    setItemInput({ selectedBarangId: '', jumlah: '' });
  };

  const handleRemoveFromCart = (indexToDrop) => {
    setCart(cart.filter((_, idx) => idx !== indexToDrop));
  };

  const grandTotal = cart.reduce((sum, item) => sum + item.subTotal, 0);

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    if (cart.length === 0) return alert("Keranjang belanja kosong! Isi barang dulu cuy.");

    setLoading(true);
    try {
      const payload = {
        ...customerForm,
        harga: grandTotal,
        details: cart.map(item => ({
          barang: { id: item.barangId },
          jumlah: item.jumlah,
          subTotal: item.subTotal
        }))
      };

      await orderService.create(payload);
      alert("Transaksi Order Berhasil Disimpan!");

      setCart([]);
      setCustomerForm({ tanggalPesan: '', tanggalAcara: '', pemesan: '', noHpPemesan: '', alamat: '' });
      onRefreshOrder();
    } catch (err) {
      console.error(err);
      alert("Gagal menyimpan transaksi order!");
    } finally {
      setLoading(false);
    }
  };

  return {
    itemInput,
    customerForm,
    cart,
    loading,
    grandTotal,
    handleItemInputChange,
    handleCustomerInputChange,
    handleAddToCart,
    handleRemoveFromCart,
    handleSubmitOrder
  };
}