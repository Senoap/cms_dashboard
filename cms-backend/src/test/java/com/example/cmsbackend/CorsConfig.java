package com.example.cmsbackend; // 🍏 SESUAIKAN dengan nama package utama project lu!

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import java.util.List;

@Configuration
public class CorsConfig implements WebMvcConfigurer {

    // Membaca konfigurasi IP dari file application.properties secara dinamis
    @Value("${app.cors.allowed-origins}")
    private List<String> allowedOrigins;

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**") // Mengamankan semua jalur endpoint /api/
                .allowedOrigins(allowedOrigins.toArray(new String[0])) // Mengubah List jadi Array String
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS") // Menentukan method yang sah
                .allowedHeaders("*") // Mengizinkan semua header bawaan browser/axios
                .allowCredentials(true); // Mengizinkan pengiriman cookie/auth session jika nanti lu butuh
    }
}