package com.microservices.productservice.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.microservices.productservice.dto.CreateProductRequest;
import com.microservices.productservice.dto.ProductDto;
import com.microservices.productservice.exception.ProductNotFoundException;
import com.microservices.productservice.model.Product;
import com.microservices.productservice.model.ProductCategory;
import com.microservices.productservice.repository.ProductRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class ProductService {
     private final ProductRepository productRepository;

     public ProductDto createProduct(CreateProductRequest request) {
          log.info("Creating product with SKU: {}", request.getSku());

          if (productRepository.existsBySku(request.getSku())) {
               throw new IllegalArgumentException("Product already exists with SKU: " + request.getSku());
          }

          Product product = Product.builder()
                    .name(request.getName())
                    .description(request.getDescription())
                    .price(request.getPrice())
                    .stockQuantity(request.getStockQuantity())
                    .sku(request.getSku())
                    .category(request.getCategory())
                    .active(true)
                    .build();

          Product savedProduct = productRepository.save(product);
          log.info("Product created successfully with id: {}", savedProduct.getId());

          return mapToDto(savedProduct);
     }

     public ProductDto getProduct(Long id) {
          log.info("Fetching product with id: {}", id);
          Product product = productRepository.findById(id)
                    .orElseThrow(() -> new ProductNotFoundException("Product not found with id: " + id));
          return mapToDto(product);
     }

     public ProductDto getProductBySku(String sku) {
          log.info("Fetching product with SKU: {}", sku);
          Product product = productRepository.findBySku(sku)
                    .orElseThrow(() -> new ProductNotFoundException("Product not found with SKU: " + sku));
          return mapToDto(product);
     }

     public List<ProductDto> getAllProducts() {
          log.info("Fetching all active products");
          return productRepository.findByActiveTrue().stream()
                    .map(this::mapToDto)
                    .collect(Collectors.toList());
     }

     public List<ProductDto> getProductsByCategory(ProductCategory category) {
          log.info("Fetching products by category: {}", category);
          return productRepository.findByActiveTrueAndCategory(category).stream()
                    .map(this::mapToDto)
                    .collect(Collectors.toList());
     }

     public ProductDto updateProduct(Long id, CreateProductRequest request) {
          log.info("Updating product with id: {}", id);
          Product product = productRepository.findById(id)
                    .orElseThrow(() -> new ProductNotFoundException("Product not found with id: " + id));

          product.setName(request.getName());
          product.setDescription(request.getDescription());
          product.setPrice(request.getPrice());
          product.setStockQuantity(request.getStockQuantity());
          product.setCategory(request.getCategory());

          Product updatedProduct = productRepository.save(product);
          log.info("Product updated successfully with id: {}", updatedProduct.getId());

          return mapToDto(updatedProduct);
     }

     public ProductDto updateStock(Long productId, Integer quantity) {
          log.info("Updating stock for product id: {} to quantity: {}", productId, quantity);
          Product product = productRepository.findById(productId)
                    .orElseThrow(() -> new ProductNotFoundException("Product not found with id: " + productId));

          product.setStockQuantity(quantity);
          Product updatedProduct = productRepository.save(product);
          log.info("Stock updated successfully for product id: {}", productId);

          return mapToDto(updatedProduct);
     }

     public void deleteProduct(Long id) {
          log.info("Deleting product with id: {}", id);
          Product product = productRepository.findById(id)
                    .orElseThrow(() -> new ProductNotFoundException("Product not found with id: " + id));

          product.setActive(false);
          productRepository.save(product);
          log.info("Product deactivated successfully with id: {}", id);
     }

     private ProductDto mapToDto(Product product) {
          return ProductDto.builder()
                    .id(product.getId())
                    .name(product.getName())
                    .description(product.getDescription())
                    .price(product.getPrice())
                    .stockQuantity(product.getStockQuantity())
                    .sku(product.getSku())
                    .category(product.getCategory())
                    .active(product.getActive())
                    .createdAt(product.getCreatedAt())
                    .updatedAt(product.getUpdatedAt())
                    .build();
     }
}
