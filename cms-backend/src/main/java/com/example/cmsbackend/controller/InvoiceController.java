package com.example.cmsbackend.controller;

import com.example.cmsbackend.model.Invoice;
import com.example.cmsbackend.repository.InvoiceRepository;
import com.example.cmsbackend.repository.TransaksiRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/invoice")
public class InvoiceController {

    @Autowired
    private InvoiceRepository invoiceRepository;

    @Autowired
    private TransaksiRepository transaksiRepository;

    // Tambah/Generate Invoice Baru
    @PostMapping
    public Invoice createInvoice(@RequestBody Invoice invoice) {
        return invoiceRepository.save(invoice);
    }

    // Ambil Semua List Invoice
    @GetMapping
    public List<Invoice> getAllInvoice() {
        return invoiceRepository.findAll();
    }

    @PutMapping("/invoice/{id}/status")
    @Transactional
    public ResponseEntity<Invoice> updateStatus(@PathVariable Long id, @RequestBody String status) {
        // Membersihkan string dari kutip ganda agar menjadi format text yang valid
        String cleanStatus = status.replaceAll("^\"|\"$", "").trim();

        return invoiceRepository.findById(id).map(invoice -> {
            invoice.setStatusTagihan(cleanStatus);

            // Opsional: Jika ingin tetap ada logika transaksi otomatis di sini
            // bisa ditambah lagi di bawah ini sesuai kebutuhan bisnis lu.

            return ResponseEntity.ok(invoiceRepository.save(invoice));
        }).orElse(ResponseEntity.notFound().build());
    }
}