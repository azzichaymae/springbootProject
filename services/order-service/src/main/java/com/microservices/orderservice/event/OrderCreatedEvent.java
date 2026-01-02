package com.microservices.orderservice.event;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderCreatedEvent implements Serializable {
    private Long orderId;
    private Long userId;
    private BigDecimal totalAmount;
    private LocalDateTime createdAt;
}