import React from 'react';
import { useManageInvoice } from '../hooks/useManageInvoice';
import TemplateConfigView from './TemplateConfigView';
import InvoiceCreatorView from './InvoiceCreatorView';
import InvoiceListView from './InvoiceListView';
import '../css/ManageInvoice.css'; // Import file CSS yang baru dibuat

function ManageInvoice({
  invoices, orders, onRefreshInvoice, activeTab,
  templateConfig, setTemplateConfig
}) {
  // Panggil semua state dan function dari Custom Hook
  const hooksData = useManageInvoice(invoices, onRefreshInvoice, templateConfig, setTemplateConfig);

  // Router sederhana berdasarkan activeTab
  return (
    <>
      {activeTab === 'template-invoice' && (
        <TemplateConfigView {...hooksData} />
      )}

      {activeTab === 'create-invoice' && (
        <InvoiceCreatorView
          {...hooksData}
          orders={orders}
          invoices={invoices}
        />
      )}

      {activeTab === 'list-invoice' && (
        <InvoiceListView
          {...hooksData}
          invoices={invoices}
          templateConfig={templateConfig}
        />
      )}
    </>
  );
}

export default ManageInvoice;