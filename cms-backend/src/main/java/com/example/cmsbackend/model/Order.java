package com.example.cmsbackend.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "tbl_order")
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String pemesan;

    @Column(name = "no_hp_pemesan", nullable = false, length = 20)
    private String noHpPemesan;

    @Column(name = "tanggal_pesan", nullable = false)
    private LocalDate tanggalPesan;

    @Column(name = "tanggal_acara", nullable = false)
    private LocalDate tanggalAcara;

    @Column(nullable = false)
    private Integer harga; // Berfungsi sebagai Grand Total semua item sewa

    // 🍏 Relasi baru ke list detail item sewa
    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<OrderDetail> details;

    // --- GETTER & SETTER ---
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getPemesan() { return pemesan; }
    public void setPemesan(String pemesan) { this.pemesan = pemesan; }

    public String getNoHpPemesan() { return noHpPemesan; }
    public void setNoHpPemesan(String noHpPemesan) { this.noHpPemesan = noHpPemesan; }

    public LocalDate getTanggalPesan() { return tanggalPesan; }
    public void setTanggalPesan(LocalDate tanggalPesan) { this.tanggalPesan = tanggalPesan; }

    public LocalDate getTanggalAcara() { return tanggalAcara; }
    public void setTanggalAcara(LocalDate tanggalAcara) { this.tanggalAcara = tanggalAcara; }

    public Integer getHarga() { return harga; }
    public void setHarga(Integer harga) { this.harga = harga; }

    public List<OrderDetail> getDetails() { return details; }
    public void setDetails(List<OrderDetail> details) { this.details = details; }
}