package com.example.cmsbackend.controller;

import com.example.cmsbackend.model.Barang;
import com.example.cmsbackend.repository.BarangRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.http.ResponseEntity;

import java.util.List;

@RestController
@RequestMapping("/api/barang")
@CrossOrigin(origins = "http://localhost:5173",
        allowedHeaders = "*",
        methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE})
public class BarangController {

    @Autowired
    private BarangRepository barangRepository;

    // Tambah Barang Baru (Create)
    @PostMapping
    public Barang createBarang(@RequestBody Barang barang) {
        return barangRepository.save(barang);
    }

    // Ambil Semua List Barang (Read)
    @GetMapping
    public List<Barang> getAllBarang() {
        return barangRepository.findAll();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteBarang(@PathVariable Long id) {
        barangRepository.deleteById(id); // sesuaikan nama repo/service lu
        return ResponseEntity.ok("Barang berhasil dihapus");
    }

    // 🍏 Fitur Edit/Update Barang yang di-Review biar GAK MERAH lagi
    @PutMapping("/{id}")
    public org.springframework.http.ResponseEntity<?> updateBarang(@PathVariable Long id, @RequestBody Barang barangDetails) {
        try {
            // 1. Cek dulu apakah barangnya emang ada di database
            if (!barangRepository.existsById(id)) {
                return org.springframework.http.ResponseEntity.status(404)
                        .body(java.util.Map.of("error", "Barang dengan ID " + id + " tidak ditemukan!"));
            }

            // 2. Karena id-nya sama, kita paksa set ID-nya agar menimpa data lama di DB
            barangDetails.setId(id); // pastikan di model Barang lu ada setId() atau pakai Lombok

            // 3. Save langsung untuk meng-update
            Barang barangDiupdate = barangRepository.save(barangDetails);

            return org.springframework.http.ResponseEntity.ok(java.util.Map.of(
                    "message", "Barang berhasil diperbarui!",
                    "data", barangDiupdate
            ));
        } catch (Exception e) {
            return org.springframework.http.ResponseEntity.status(500)
                    .body(java.util.Map.of("error", "Gagal mengupdate data: " + e.getMessage()));
        }
    }
}