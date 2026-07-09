package com.example.cmsbackend.controller;

import com.example.cmsbackend.model.Order;
import com.example.cmsbackend.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/order")
@CrossOrigin(origins = "*")
public class OrderController {

    @Autowired
    private OrderRepository orderRepository;

    // Tambah Order Baru (Create)
    @PostMapping
    public Order createOrder(@RequestBody Order order) {
        return orderRepository.save(order);
    }

    // Ambil Semua List Order (Read)
    @GetMapping
    public List<Order> getAllOrder() {
        return orderRepository.findAll();
    }
}