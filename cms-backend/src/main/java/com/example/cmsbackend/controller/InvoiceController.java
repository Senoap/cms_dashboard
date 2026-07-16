package com.example.cmsbackend.controller;

import com.example.cmsbackend.model.Invoice;
import com.example.cmsbackend.repository.InvoiceRepository;
import com.example.cmsbackend.repository.TransaksiRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.example.cmsbackend.model.Transaksi;

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

    @PutMapping("/{id}/status-penagihan")
    public ResponseEntity<?> updateStatusPenagihan(@PathVariable Long id, @RequestBody java.util.Map<String, String> payload) {
        try {
            String statusBaru = payload.get("status");

            // Cari data invoice berdasarkan ID
            java.util.Optional<Invoice> invoiceOpt = invoiceRepository.findById(id);
            if (invoiceOpt.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            Invoice invoice = invoiceOpt.get();
            invoice.setStatusPenagihan(statusBaru);

            // Simpan status baru ke tbl_invoice
            invoiceRepository.save(invoice);

            // LOGIKA OTOMATIS: Jika status diubah jadi "Terbayarkan", masukkan ke tbl_transaksi
            if ("Terbayarkan".equalsIgnoreCase(statusBaru)) {
                Transaksi transaksiBaru = new Transaksi();

                // Ambil data noInvoice dari entitas Invoice
                transaksiBaru.setNoInvoice(invoice.getNoInvoice());

                // Ambil data harga dan pemesan dari relasi Order
                if (invoice.getOrder() != null) {
                    transaksiBaru.setHarga(Double.valueOf(invoice.getOrder().getHarga()));
                    transaksiBaru.setPemesan(invoice.getOrder().getPemesan());
                }

                // Simpan ke tbl_transaksi
                transaksiRepository.save(transaksiBaru);
            }

            return ResponseEntity.ok(invoice);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }}