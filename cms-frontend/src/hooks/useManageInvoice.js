import { useState, useEffect } from 'react';
import { invoiceService } from '../services/invoiceService';
import { formatSecureInvoiceNumber as formatInvoiceNumber } from '../utils/securityHelper';

export function useManageInvoice(invoices, onRefreshInvoice, templateConfig, setTemplateConfig) {
  const [selectedOrderId, setSelectedOrderId] = useState('');
  const [tanggalInvoice, setTanggalInvoice] = useState('');
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [loading, setLoading] = useState(false);
  // const [activeTab, setActiveTab] = useState('ongoing');


  // 🍏 State baru buat filter Tab
  const [activeInvoiceTab, setActiveInvoiceTab] = useState('Semua');

  // State lokal untuk konfigurasi template cetak
  const [templateForm, setTemplateForm] = useState({
    companyName: templateConfig.companyName,
    companySlogan: templateConfig.companySlogan,
    companyAddress: templateConfig.companyAddress,
    signatureLocation: templateConfig.signatureLocation,
    signatureName: templateConfig.signatureName,
    notes: [...templateConfig.notes],
    companyLogo: templateConfig.companyLogo
  });

  const todayDate = new Date().toISOString().split('T')[0];

  // 🍏 Logika Filter: Filter invoice berdasarkan status
  const filteredInvoices = invoices.filter(item => {
    // Kalau tab-nya 'Terbayarkan', tampilkan yang 'Terbayarkan' saja
    if (activeInvoiceTab === 'Terbayarkan') {
      return item.statusPenagihan === 'Terbayarkan';
    }

    // Kalau tab-nya bukan 'Terbayarkan' (berarti 'Ongoing'), 
    // tampilkan yang BUKAN 'Terbayarkan'
    return item.statusPenagihan !== 'Terbayarkan';
  });

  useEffect(() => {
    setTemplateForm({
      companyName: templateConfig.companyName,
      companySlogan: templateConfig.companySlogan,
      companyAddress: templateConfig.companyAddress,
      signatureLocation: templateConfig.signatureLocation,
      signatureName: templateConfig.signatureName,
      notes: [...templateConfig.notes],
      companyLogo: templateConfig.companyLogo
    });
  }, [templateConfig]);

  const handleTemplateInputChange = (e) => {
    const { name, value } = e.target;
    setTemplateForm(prev => ({ ...prev, [name]: value }));
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setTemplateForm(prev => ({ ...prev, companyLogo: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleNoteChange = (index, value) => {
    const updatedNotes = [...templateForm.notes];
    updatedNotes[index] = value;
    setTemplateForm(prev => ({ ...prev, notes: updatedNotes }));
  };

  const addNoteField = () => {
    setTemplateForm(prev => ({ ...prev, notes: [...prev.notes, ''] }));
  };

  const removeNoteField = (index) => {
    setTemplateForm(prev => ({
      ...prev,
      notes: prev.notes.filter((_, i) => i !== index)
    }));
  };

  const handleSaveTemplate = async (e) => {
    e.preventDefault();
    const cleanedData = {
      ...templateForm,
      notes: templateForm.notes.filter(note => note.trim() !== '')
    };
    setTemplateConfig(cleanedData);
    alert("Template Invoice & Logo berhasil diperbarui!");
  };

  const handleCreateInvoice = async (e) => {
    e.preventDefault();
    if (!selectedOrderId || !tanggalInvoice) return alert("Pilih order dan tanggal dulu, cuy!");

    setLoading(true);
    try {
      const numericOrderId = Number(selectedOrderId);
      const generatedNoInvoice = formatInvoiceNumber(numericOrderId, tanggalInvoice);

      const payload = {
        id: numericOrderId,
        tanggalInvoice: tanggalInvoice,
        noInvoice: generatedNoInvoice,
        order: { id: numericOrderId },
        statusPenagihan: "New"
      };

      await invoiceService.create(payload);
      alert("Invoice berhasil diterbitkan!");

      setSelectedOrderId('');
      setTanggalInvoice('');
      onRefreshInvoice();
    } catch (err) {
      console.error(err);
      alert("Gagal menerbitkan invoice!");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatusPenagihan = async (invoiceId, newStatus) => {
    try {
      await invoiceService.updateStatusPenagihan(invoiceId, newStatus);
      if (typeof onRefreshInvoice === 'function') onRefreshInvoice();
      alert(`✅ Status penagihan berhasil diubah jadi: ${newStatus}`);
    } catch (error) {
      console.error("Gagal update status penagihan:", error);
      alert("❌ Gagal update status!");
    }
  };

  const handlePrint = () => { window.print(); };

  return {
    selectedOrderId, setSelectedOrderId, tanggalInvoice, setTanggalInvoice,
    selectedInvoice, setSelectedInvoice, loading, templateForm, todayDate,
    handleTemplateInputChange, handleLogoChange, handleNoteChange,
    addNoteField, removeNoteField, handleSaveTemplate, handleCreateInvoice,
    handlePrint, formatInvoiceNumber, handleUpdateStatusPenagihan,
    // 🍏 Export state dan data filter baru
    activeInvoiceTab, setActiveInvoiceTab, filteredInvoices
  };
}