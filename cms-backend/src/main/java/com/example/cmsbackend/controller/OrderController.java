package com.example.cmsbackend.controller;

// 🍏 TAMBAHKAN BARIS IMPORT INI DI ATAS BIAR KATA-KATANYA DIKENAL:
import com.example.cmsbackend.model.Order;
import com.example.cmsbackend.model.OrderDetail; // Supaya kenal OrderDetail
import com.example.cmsbackend.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;       // Supaya kenal HttpStatus
import org.springframework.http.ResponseEntity;   // Supaya kenal ResponseEntity
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/order")
//@CrossOrigin(origins = "*")
public class OrderController {

    @Autowired
    private OrderRepository orderRepository;

    // Tambah Order Baru (Create)
    @PostMapping
    public ResponseEntity<Order> createOrder(@RequestBody Order order) {
        try {
            // 🍏 KUNCI UTAMA: Loop isi rincian barang, ikat objek induk ke setiap anak detailnya!
            if (order.getDetails() != null) {
                for (OrderDetail detail : order.getDetails()) {
                    detail.setOrder(order); // Menghindari kolom 'order_id' bernilai NULL di database
                }
            }

            // Simpan data induk beserta anak-anaknya secara otomatis (Cascade)
            Order savedOrder = orderRepository.save(order);
            return ResponseEntity.ok(savedOrder);
        } catch (Exception e) {
            // Print eror asli di terminal Java biar lu bisa pantau kalau ada yang ganjil
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // Ambil Semua List Order (Read)
    @GetMapping
    public List<Order> getAllOrder() {
        return orderRepository.findAll();
    }
}