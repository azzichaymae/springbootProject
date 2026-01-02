package com.microservices.productservice.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.microservices.productservice.model.ProductCategory;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductDto {
    private Long id;
    private String name;
    private String description;
    private BigDecimal price;
    private Integer stockQuantity;
    private String sku;
    private ProductCategory category;
    private Boolean active;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
