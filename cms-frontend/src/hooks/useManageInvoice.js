import { useState, useEffect } from 'react';
import { invoiceService } from '../services/invoiceService';
import { formatSecureInvoiceNumber as formatInvoiceNumber } from '../utils/securityHelper';
import api from '../services/api';

export function useManageInvoice(invoices, onRefreshInvoice, templateConfig, setTemplateConfig) {
  const [selectedOrderId, setSelectedOrderId] = useState('');
  const [tanggalInvoice, setTanggalInvoice] = useState('');
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [loading, setLoading] = useState(false);

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

  // Sinkronisasi data dari konfigurasi global parent
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
        order: { id: numericOrderId }
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

  const handlePrint = () => { window.print(); };

  const updateStatus = async (orderId, newStatus) => {
    try {
      // Mengirim request PUT ke endpoint backend
      await api.put(`/order/${orderId}/status`, newStatus, {
        headers: { 'Content-Type': 'application/json' }
      });

      alert("Status berhasil diupdate!");
      onRefreshInvoice();
    } catch (err) {
      console.error("Error update status:", err);
      alert("Gagal update status, cek console ya!");
    }
  };
  return {
    selectedOrderId,
    setSelectedOrderId,
    tanggalInvoice,
    setTanggalInvoice,
    selectedInvoice,
    setSelectedInvoice,
    loading,
    templateForm,
    todayDate,
    handleTemplateInputChange,
    handleLogoChange,
    handleNoteChange,
    addNoteField,
    removeNoteField,
    handleSaveTemplate,
    handleCreateInvoice,
    handlePrint,
    formatInvoiceNumber,
    updateStatus
  };
}