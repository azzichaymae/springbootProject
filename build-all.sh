#!/bin/bash

echo "======================================"
echo "Building all microservices..."
echo "======================================"

# Array of services
services=("config-server" "service-discovery" "api-gateway" "user-service" "product-service" "order-service")

# Build each service
for service in "${services[@]}"
do
    echo ""
    echo "Building $service..."
    cd services/$service
    mvn clean package -DskipTests
    if [ $? -eq 0 ]; then
        echo "✓ $service built successfully"
    else
        echo "✗ Failed to build $service"
        exit 1
    fi
    cd ../..
done

echo ""
echo "======================================"
echo "All services built successfully!"
echo "======================================"