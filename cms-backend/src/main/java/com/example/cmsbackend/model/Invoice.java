package com.example.cmsbackend.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "tbl_invoice")
public class Invoice {

    @Id
    // ⚠️ JANGAN gunakan @GeneratedValue di sini karena ID-nya murni meng-copas ID Order dari frontend
    private Long id;

    @Column(name = "no_invoice", nullable = false, unique = true)
    private String noInvoice; // Menampung "INV/2026/VII/001"

    @Column(name = "tanggal_invoice", nullable = false)
    private LocalDate tanggalInvoice;

    @Column(name = "status_tagihan")
    private String statusTagihan = "Belum Tertagih";

    @OneToOne
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;

    // --- GETTER & SETTER ---
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getNoInvoice() { return noInvoice; }
    public void setNoInvoice(String noInvoice) { this.noInvoice = noInvoice; }

    public LocalDate getTanggalInvoice() { return tanggalInvoice; }
    public void setTanggalInvoice(LocalDate tanggalInvoice) { this.tanggalInvoice = tanggalInvoice; }

    public Order getOrder() { return order; }
    public void setOrder(Order order) { this.order = order; }

    public String getStatusTagihan() { return statusTagihan; }
    public void setStatusTagihan(String statusTagihan) { this.statusTagihan = statusTagihan; }
}