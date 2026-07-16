package com.example.cmsbackend.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonManagedReference;

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
    private Integer harga;

    @Column(name = "alamat", length = 500)
    private String alamat;

    @Column(name = "lokasi_acara", length = 500)
    private String lokasiAcara;

    @Column(name = "status_order")
    private String statusOrder = "Order Baru";

    // 🍏 Mengamankan serialisasi data satu arah dari Induk ke Anak
    @JsonManagedReference
    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    private List<OrderDetail> details;

    // --- GETTER & SETTER MANUAL (Jangan pakai toString otomatis jika ada relasi) ---
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

    public String getAlamat() { return alamat; }
    public void setAlamat(String alamat) { this.alamat = alamat; }

    public String getLokasiAcara() { return lokasiAcara; }
    public void setLokasiAcara(String lokasiAcara) { this.lokasiAcara = lokasiAcara; }

    public List<OrderDetail> getDetails() { return details; }
    public void setDetails(List<OrderDetail> details) { this.details = details; }

    public String getStatusOrder() { return statusOrder; }
    public void setStatusOrder(String statusOrder) { this.statusOrder = statusOrder; }
}