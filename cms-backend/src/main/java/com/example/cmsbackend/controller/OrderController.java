package com.example.cmsbackend.controller;

import com.example.cmsbackend.model.Order;
import com.example.cmsbackend.model.OrderDetail;
import com.example.cmsbackend.model.Barang;
import com.example.cmsbackend.repository.OrderRepository;
import com.example.cmsbackend.repository.BarangRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/order")
public class OrderController {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private BarangRepository barangRepository;

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
            // Cek apakah data list details dikirim dari frontend React
            if (order.getDetails() != null && !order.getDetails().isEmpty()) {
                List<OrderDetail> validatedDetails = new ArrayList<>();

                for (OrderDetail detail : order.getDetails()) {
                    // 🍏 KRUSIAL: Link balik objek induk ke setiap item detail
                    detail.setOrder(order);

                    // Validasi dan tarik data barang asli dari database berdasarkan ID yang dikirim
                    if (detail.getBarang() != null && detail.getBarang().getId() != null) {
                        var barangOpt = barangRepository.findById(detail.getBarang().getId());
                        if (barangOpt.isPresent()) {
                            Barang barangAsli = barangOpt.get();
                            detail.setBarang(barangAsli);

                            // Hitung ulang subtotal otomatis di sisi backend agar aman
                            detail.setSubTotal(barangAsli.getHarga() * detail.getJumlah());
                        }
                    }
                    validatedDetails.add(detail);
                }

                // Set kembali list detail yang sudah valid dan terikat ke objek utama
                order.setDetails(validatedDetails);
            }

            // Simpan objek utama. Karena cascade = CascadeType.ALL, detail otomatis ikut tersimpan!
            Order savedOrder = orderRepository.save(order);
            return ResponseEntity.ok(savedOrder);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}