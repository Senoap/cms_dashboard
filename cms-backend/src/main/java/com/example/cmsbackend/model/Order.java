package com.example.cmsbackend.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "tbl_order")
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Relasi ke tabel master barang pakai Foreign Key 'barang_id'
    @ManyToOne
    @JoinColumn(name = "barang_id", nullable = false)
    private Barang barang;

    @Column(nullable = false)
    private Integer jumlah;

    @Column(name = "tanggal_pesan", nullable = false)
    private LocalDate tanggalPesan;

    @Column(name = "tanggal_acara", nullable = false)
    private LocalDate tanggalAcara;

    @Column(nullable = false)
    private String pemesan;

    @Column(name = "no_hp_pemesan", nullable = false, length = 20)
    private String noHpPemesan;

    // --- GETTER & SETTER ---
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Barang getBarang() { return barang; }
    public void setBarang(Barang barang) { this.barang = barang; }

    public Integer getJumlah() { return jumlah; }
    public void setJumlah(Integer jumlah) { this.jumlah = jumlah; }

    public LocalDate getTanggalPesan() { return tanggalPesan; }
    public void setTanggalPesan(LocalDate tanggalPesan) { this.tanggalPesan = tanggalPesan; }

    public LocalDate getTanggalAcara() { return tanggalAcara; }
    public void setTanggalAcara(LocalDate tanggalAcara) { this.tanggalAcara = tanggalAcara; }

    public String getPemesan() { return pemesan; }
    public void setPemesan(String pemesan) { this.pemesan = pemesan; }

    public String getNoHpPemesan() { return noHpPemesan; }
    public void setNoHpPemesan(String noHpPemesan) { this.noHpPemesan = noHpPemesan; }
}