#!/bin/bash

echo "======================================"
echo "Stopping all microservices..."
echo "======================================"

cd infrastructure/docker

docker-compose down

echo ""
echo "All services stopped!"
echo "======================================"