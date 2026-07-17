package com.example.cmsbackend.controller;

import com.example.cmsbackend.model.Order;
import com.example.cmsbackend.model.OrderDetail;
import com.example.cmsbackend.model.Barang;
import com.example.cmsbackend.repository.OrderRepository;
import com.example.cmsbackend.repository.BarangRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
// import com.example.cmsbackend.model.Transaksi;
// import com.example.cmsbackend.repository.TransaksiRepository;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/order")
public class OrderController {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private BarangRepository barangRepository;

    // @Autowired
    // private TransaksiRepository transaksiRepository;

    @GetMapping
    public ResponseEntity<List<Order>> getAllOrder() {
        try {
            List<Order> orders = orderRepository.findAll();
            if (orders == null) {
                return ResponseEntity.ok(new ArrayList<>());
            }
            return ResponseEntity.ok(orders);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping
    public ResponseEntity<Order> createOrder(@RequestBody Order order) {
        try {
            // Force set tanggalPesan ke hari ini di server
            // Ini memastikan tanggal tetap tercatat meski dikirim kosong dari frontend
            order.setTanggalPesan(java.time.LocalDate.now());

            // ... logic detail lainnya (tetap sama) ...

            Order savedOrder = orderRepository.save(order);
            return ResponseEntity.ok(savedOrder);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteOrder(@PathVariable Long id) {
        try {
            var orderOpt = orderRepository.findById(id);
            if (orderOpt.isPresent()) {
                orderRepository.delete(orderOpt.get());
                return ResponseEntity.ok().build();
            }
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Order> updateOrder(@PathVariable Long id, @RequestBody Order updatedOrder) {
        try {
            return orderRepository.findById(id).map(existingOrder -> {
                // 1. Update data induk utama
                existingOrder.setPemesan(updatedOrder.getPemesan());
                existingOrder.setNoHpPemesan(updatedOrder.getNoHpPemesan());
                existingOrder.setTanggalPesan(updatedOrder.getTanggalPesan());
                existingOrder.setTanggalAcara(updatedOrder.getTanggalAcara());
                existingOrder.setAlamat(updatedOrder.getAlamat());
                existingOrder.setHarga(updatedOrder.getHarga());

                // 2. Bersihkan list item detail lama
                existingOrder.getDetails().clear();

                // 3. Masukkan list item detail baru jika dikirim dari frontend
                if (updatedOrder.getDetails() != null) {
                    for (OrderDetail detail : updatedOrder.getDetails()) {
                        detail.setOrder(existingOrder);

                        if (detail.getBarang() != null && detail.getBarang().getId() != null) {
                            var barangOpt = barangRepository.findById(detail.getBarang().getId());
                            if (barangOpt.isPresent()) {
                                Barang barangAsli = barangOpt.get();
                                detail.setBarang(barangAsli);
                                detail.setSubTotal(barangAsli.getHarga() * detail.getJumlah());
                            }
                        }
                        existingOrder.getDetails().add(detail);
                    }
                }

                // 4. Simpan perubahan total
                Order savedOrder = orderRepository.save(existingOrder);
                return ResponseEntity.ok(savedOrder);
            }).orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // Tambahkan endpoint ini di OrderController
    @Transactional
    @PutMapping("/{id}/status-order")
    public ResponseEntity<Order> updateStatusOrder(@PathVariable Long id, @RequestBody String status) {
        String cleanStatus = status.replace("\"", "");

        return orderRepository.findById(id).map(order -> {
            // Logika sederhana: update status order (Order Baru > Konfirmasi > Pengiriman)
            order.setStatusOrder(cleanStatus);
            return ResponseEntity.ok(orderRepository.save(order));
        }).orElse(ResponseEntity.notFound().build());
    }
}

