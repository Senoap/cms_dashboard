package com.example.cmsbackend.controller;

import com.example.cmsbackend.model.Transaksi;
import com.example.cmsbackend.repository.TransaksiRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/transaksi")
//@CrossOrigin(origins = "http://localhost:5173") // Sesuaikan dengan port React lu
public class TransaksiController {

    @Autowired
    private TransaksiRepository transaksiRepository;

    // 1. Ambil semua data transaksi yang sudah masuk
    @GetMapping
    public List<Transaksi> getAllTransaksi() {
        return transaksiRepository.findAll();
    }

    // 2. Ambil transaksi berdasarkan ID
    @GetMapping("/{id}")
    public Transaksi getTransaksiById(@PathVariable Long id) {
        return transaksiRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Transaksi tidak ditemukan!"));
    }
}