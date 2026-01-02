package com.microservices.orderservice.service;

import com.microservices.orderservice.dto.*;
import com.microservices.orderservice.event.OrderCreatedEvent;
import com.microservices.orderservice.exception.InsufficientStockException;
import com.microservices.orderservice.exception.OrderNotFoundException;
import com.microservices.orderservice.model.Order;
import com.microservices.orderservice.model.OrderItem;
import com.microservices.orderservice.model.OrderStatus;
import com.microservices.orderservice.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class OrderService {
    
    private final OrderRepository orderRepository;
    private final UserServiceClient userServiceClient;
    private final ProductServiceClient productServiceClient;
    private final RabbitTemplate rabbitTemplate;
    
    public OrderDto createOrder(CreateOrderRequest request) {
        log.info("Creating order for user id: {}", request.getUserId());
        
        // Verify user exists
        UserDto user = userServiceClient.getUserById(request.getUserId());
        log.info("User verified: {}", user.getEmail());
        
        // Calculate total and verify stock
        BigDecimal totalAmount = BigDecimal.ZERO;
        List<OrderItem> orderItems = new ArrayList<>();
        
        for (OrderItemRequest itemRequest : request.getItems()) {
            ProductDto product = productServiceClient.getProductById(itemRequest.getProductId());
            
            if (product.getStockQuantity() < itemRequest.getQuantity()) {
                throw new InsufficientStockException(
                    "Insufficient stock for product: " + product.getName() + 
                    ". Available: " + product.getStockQuantity() + 
                    ", Requested: " + itemRequest.getQuantity()
                );
            }
            
            BigDecimal subtotal = product.getPrice().multiply(BigDecimal.valueOf(itemRequest.getQuantity()));
            totalAmount = totalAmount.add(subtotal);
            
            OrderItem orderItem = OrderItem.builder()
                .productId(product.getId())
                .productName(product.getName())
                .price(product.getPrice())
                .quantity(itemRequest.getQuantity())
                .subtotal(subtotal)
                .build();
            
            orderItems.add(orderItem);
        }
        
        // Create order
        Order order = Order.builder()
            .userId(request.getUserId())
            .status(OrderStatus.PENDING)
            .totalAmount(totalAmount)
            .items(orderItems)
            .build();
        
        Order savedOrder = orderRepository.save(order);
        log.info("Order created with id: {}", savedOrder.getId());
        
        // Update stock for each product
        for (OrderItem item : orderItems) {
            ProductDto product = productServiceClient.getProductById(item.getProductId());
            Integer newStock = product.getStockQuantity() - item.getQuantity();
            productServiceClient.updateProductStock(item.getProductId(), newStock);
            log.info("Updated stock for product id: {} to {}", item.getProductId(), newStock);
        }
        
        // Publish order created event
        OrderCreatedEvent event = OrderCreatedEvent.builder()
            .orderId(savedOrder.getId())
            .userId(savedOrder.getUserId())
            .totalAmount(totalAmount)
            .createdAt(LocalDateTime.now())
            .build();
        
        rabbitTemplate.convertAndSend("order-exchange", "order.created", event);
        log.info("Published OrderCreatedEvent for order id: {}", savedOrder.getId());
        
        return mapToDto(savedOrder);
    }
    
    public OrderDto getOrderById(Long id) {
        log.info("Fetching order with id: {}", id);
        Order order = orderRepository.findById(id)
            .orElseThrow(() -> new OrderNotFoundException("Order not found with id: " + id));
        return mapToDto(order);
    }
    
    public List<OrderDto> getAllOrders() {
        log.info("Fetching all orders");
        return orderRepository.findAll().stream()
            .map(this::mapToDto)
            .collect(Collectors.toList());
    }
    
    public List<OrderDto> getOrdersByUserId(Long userId) {
        log.info("Fetching orders for user id: {}", userId);
        return orderRepository.findByUserId(userId).stream()
            .map(this::mapToDto)
            .collect(Collectors.toList());
    }
    
    public OrderDto updateOrderStatus(Long orderId, OrderStatus newStatus) {
        log.info("Updating order id: {} to status: {}", orderId, newStatus);
        Order order = orderRepository.findById(orderId)
            .orElseThrow(() -> new OrderNotFoundException("Order not found with id: " + orderId));
        
        order.setStatus(newStatus);
        Order updatedOrder = orderRepository.save(order);
        log.info("Order status updated successfully");
        
        return mapToDto(updatedOrder);
    }
    
    public void cancelOrder(Long orderId) {
        log.info("Cancelling order id: {}", orderId);
        Order order = orderRepository.findById(orderId)
            .orElseThrow(() -> new OrderNotFoundException("Order not found with id: " + orderId));
        
        if (order.getStatus() == OrderStatus.DELIVERED || order.getStatus() == OrderStatus.CANCELLED) {
            throw new IllegalStateException("Cannot cancel order with status: " + order.getStatus());
        }
        
        // Restore stock
        for (OrderItem item : order.getItems()) {
            ProductDto product = productServiceClient.getProductById(item.getProductId());
            Integer newStock = product.getStockQuantity() + item.getQuantity();
            productServiceClient.updateProductStock(item.getProductId(), newStock);
            log.info("Restored stock for product id: {} to {}", item.getProductId(), newStock);
        }
        
        order.setStatus(OrderStatus.CANCELLED);
        orderRepository.save(order);
        log.info("Order cancelled successfully");
    }
    
    private OrderDto mapToDto(Order order) {
        return OrderDto.builder()
            .id(order.getId())
            .userId(order.getUserId())
            .status(order.getStatus())
            .totalAmount(order.getTotalAmount())
            .items(order.getItems().stream()
                .map(this::mapOrderItemToDto)
                .collect(Collectors.toList()))
            .createdAt(order.getCreatedAt())
            .updatedAt(order.getUpdatedAt())
            .build();
    }
    
    private OrderItemDto mapOrderItemToDto(OrderItem item) {
        return OrderItemDto.builder()
            .id(item.getId())
            .productId(item.getProductId())
            .productName(item.getProductName())
            .price(item.getPrice())
            .quantity(item.getQuantity())
            .subtotal(item.getSubtotal())
            .build();
    }
}