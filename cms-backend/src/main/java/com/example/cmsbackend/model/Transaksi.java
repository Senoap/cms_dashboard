package com.example.cmsbackend.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
public class Transaksi {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "order_id")
    private Order order;

    private Double total;
    private LocalDate tanggal;

    public void setOrder(Order order) {
        this.order = order;
    }

    public void setTotal(Double total) {
        this.total = total;
    }

    public void setTanggal(java.time.LocalDate tanggal) {
        this.tanggal = tanggal;
    }
}