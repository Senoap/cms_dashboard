package com.example.cmsbackend.controller;

import com.example.cmsbackend.model.Invoice;
import com.example.cmsbackend.repository.InvoiceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/invoice")
//@CrossOrigin(origins = "*")
public class InvoiceController {

    @Autowired
    private InvoiceRepository invoiceRepository;

    // Tambah/Generate Invoice Baru (Create)
    @PostMapping
    public Invoice createInvoice(@RequestBody Invoice invoice) {
        return invoiceRepository.save(invoice);
    }

    // Ambil Semua List Invoice (Read)
    @GetMapping
    public List<Invoice> getAllInvoice() {
        return invoiceRepository.findAll();
    }
}