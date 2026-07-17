package com.example.cmsbackend.model; // Sesuaikan dengan nama package lu

import jakarta.persistence.*;

import java.time.LocalDate;

@Entity
@Table(name = "tbl_transaksi")
public class Transaksi {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "no_invoice")
    private String noInvoice;

    @Column(name = "harga")
    private Double harga;

    @Column(name = "pemesan")
    private String pemesan;

    @Column(name = "tanggal_invoice")
    private LocalDate tglInvoice;

    // Default Constructor
    public Transaksi() {}

    // Getter dan Setter
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getNoInvoice() { return noInvoice; }
    public void setNoInvoice(String noInvoice) { this.noInvoice = noInvoice; }

    public Double getHarga() { return harga; }
    public void setHarga(Double harga) { this.harga = harga; }

    public String getPemesan() { return pemesan; }
    public void setPemesan(String pemesan) { this.pemesan = pemesan; }

    public LocalDate getTglInvoice() { return tglInvoice;}
    public  void setTglInvoice(LocalDate tglInvoice) { this.tglInvoice = tglInvoice; }
}