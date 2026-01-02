#!/bin/bash

echo "======================================"
echo "Starting microservices infrastructure..."
echo "======================================"

# Navigate to docker directory
cd infrastructure/docker

# Start infrastructure services first
echo ""
echo "Starting infrastructure services..."
docker-compose up -d postgres-user postgres-product postgres-order rabbitmq redis zipkin

echo "Waiting for infrastructure to be ready (30 seconds)..."
sleep 30

# Start config server
echo ""
echo "Starting Config Server..."
docker-compose up -d config-server

echo "Waiting for Config Server to be ready (30 seconds)..."
sleep 30

# Start service discovery
echo ""
echo "Starting Service Discovery..."
docker-compose up -d service-discovery

echo "Waiting for Service Discovery to be ready (40 seconds)..."
sleep 40

# Start API Gateway
echo ""
echo "Starting API Gateway..."
docker-compose up -d api-gateway

echo "Waiting for API Gateway to be ready (30 seconds)..."
sleep 30

# Start business services
echo ""
echo "Starting Business Services..."
docker-compose up -d user-service product-service

echo "Waiting for User and Product services to be ready (40 seconds)..."
sleep 40

# Start order service (depends on user and product)
echo ""
echo "Starting Order Service..."
docker-compose up -d order-service

echo ""
echo "======================================"
echo "All services started!"
echo "======================================"
echo ""
echo "Service URLs:"
echo "- Config Server: http://localhost:8888"
echo "- Eureka Dashboard: http://localhost:8761"
echo "- API Gateway: http://localhost:8080"
echo "- User Service: http://localhost:8081"
echo "- Product Service: http://localhost:8082"
echo "- Order Service: http://localhost:8083"
echo "- RabbitMQ Management: http://localhost:15672 (guest/guest)"
echo "- Zipkin: http://localhost:9411"
echo ""
echo "Check status with: docker-compose ps"
echo "View logs with: docker-compose logs -f [service-name]"
echo "======================================"