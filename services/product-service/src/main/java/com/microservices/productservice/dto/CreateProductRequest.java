package com.microservices.productservice.dto;


import java.math.BigDecimal;

import com.microservices.productservice.model.ProductCategory;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateProductRequest {
     @NotBlank(message = "Product name is required")
     @Size(min = 2, max = 100, message = "Product name must be between 2 and 100 characters")
     private String name;

     @Size(max = 1000, message = "Description cannot exceed 1000 characters")
     private String description;

     @NotNull(message = "Price is required")
     @DecimalMin(value = "0.01", message = "Price must be greater than 0")
     private BigDecimal price;

     @NotNull(message = "Stock quantity is required")
     @Min(value = 0, message = "Stock quantity cannot be negative")
     private Integer stockQuantity;

     @NotBlank(message = "SKU is required")
     private String sku;

     @NotNull(message = "Category is required")
     private ProductCategory category;
}

