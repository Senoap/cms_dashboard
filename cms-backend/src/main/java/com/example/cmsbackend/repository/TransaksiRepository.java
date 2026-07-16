package com.example.cmsbackend.repository; // Sesuaikan package lu

import com.example.cmsbackend.model.Transaksi;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TransaksiRepository extends JpaRepository<Transaksi, Long> {
}