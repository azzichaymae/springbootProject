package com.microservices.orderservice.service;

import com.microservices.orderservice.dto.ProductDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class ProductServiceClient {
    
    private final RestTemplate restTemplate;
    
    public ProductDto getProductById(Long productId) {
        log.info("Fetching product with id: {} from product-service", productId);
        String url = "http://product-service/products/" + productId;
        return restTemplate.getForObject(url, ProductDto.class);
    }
    
    public void updateProductStock(Long productId, Integer newStock) {
        log.info("Updating stock for product id: {} to {}", productId, newStock);
        String url = "http://product-service/products/" + productId + "/stock";
        
        Map<String, Integer> request = new HashMap<>();
        request.put("stockQuantity", newStock);
        
        restTemplate.patchForObject(url, request, ProductDto.class);
    }
}