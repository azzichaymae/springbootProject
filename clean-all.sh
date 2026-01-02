#!/bin/bash

echo "======================================"
echo "Cleaning all microservices..."
echo "======================================"

# Array of services
services=("config-server" "service-discovery" "api-gateway" "user-service" "product-service" "order-service")

# Clean each service
for service in "${services[@]}"
do
    echo ""
    echo "Cleaning $service..."
    cd services/$service
    mvn clean
    cd ../..
done

echo ""
echo "Stopping and removing Docker containers..."
cd infrastructure/docker
docker-compose down -v

echo ""
echo "======================================"
echo "All services cleaned!"
echo "======================================"