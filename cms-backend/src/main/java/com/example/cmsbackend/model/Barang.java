package com.example.cmsbackend.model;

import jakarta.persistence.*;
import org.hibernate.annotations.CollectionId;

@Entity
@Table(name = "tbl_barang")
public class Barang {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "nm_barang", nullable = false, unique = true)
    private String nmBarang;

    @Column(name = "harga", nullable = true)
    private Integer harga = 0;

    // --- GETTER & SETTER ---
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getNmBarang() { return nmBarang; }
    public void setNmBarang(String nmBarang) { this.nmBarang = nmBarang; }

    public Integer getHarga() {
        return harga;
    }

    public void setHarga(Integer harga) {
        this.harga = harga;
    }
}