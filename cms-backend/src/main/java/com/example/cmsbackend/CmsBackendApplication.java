package com.example.cmsbackend;

import org.springframework.beans.factory.annotation.Value; // 🍏 Impor ini buat baca properties
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@SpringBootApplication
public class CmsBackendApplication {

    // 🍏 Otomatis narik data dari app.cors.allowed-origins di application.properties
    @Value("${app.cors.allowed-origins}")
    private String[] allowedOrigins;

    public static void main(String[] args) {
        SpringApplication.run(CmsBackendApplication.class, args);
    }

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**")
                        .allowedOrigins(allowedOrigins) // 🍏 Tinggal masukin variabel array-nya di sini
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                        .allowedHeaders("*")
                        .allowCredentials(true);
            }
        };
    }
}