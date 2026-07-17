import React from 'react';

export default function InvoiceCreatorView({ selectedOrderId, setSelectedOrderId, tanggalInvoice, setTanggalInvoice, loading, handleCreateInvoice, orders, invoices }) {
  return (
    <div className="form-container-premium">
      <div className="form-header-premium">
        <h3>🧾 Generate Invoice / Tagihan</h3>
        <p>Terbitkan tagihan baru berdasarkan ID Order yang sudah ada.</p>
      </div>

      <form onSubmit={handleCreateInvoice} className="form-body-premium">
        <div className="form-group-premium">
          <label>Pilih Transaksi Order</label>
          <select value={selectedOrderId} onChange={e => setSelectedOrderId(e.target.value)} required>
            <option value="">-- Pilih Order Aktif --</option>
            {orders
              .filter(order => {
                const isReadyToInvoice = order.statusOrder === "Pengiriman";
                const alreadyHasInvoice = invoices.some(inv => {
                  const invOrderId = inv.orderId || (inv.order ? inv.order.id : null);
                  return invOrderId == order.id;
                });
                return isReadyToInvoice && !alreadyHasInvoice;
              })
              .map(order => (
                <option key={order.id} value={order.id}>
                  Order #{order.id} - {order.pemesan}
                </option>
              ))
            }
          </select>
        </div>
        <div className="form-group-premium">
          <label>Tanggal Penerbitan Invoice</label>
          <input type="date" value={tanggalInvoice} onChange={e => setTanggalInvoice(e.target.value)} required />
        </div>
        <div className="form-input-premium">
          <button type="submit" disabled={loading} className="btn-premium-primary">
            {loading ? "Memproses..." : "🧾 Cetak & Terbitkan Invoice"}
          </button>
        </div>
      </form>
    </div>
  );
}