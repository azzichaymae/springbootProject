# E-Commerce Microservices Platform

A complete microservices architecture built with Spring Boot 3.3.5, Spring Cloud, Docker, and PostgreSQL.

## Architecture Overview

This project implements a modern microservices architecture with the following components:

### Infrastructure Services
- **Config Server** (Port 8888): Centralized configuration management
- **Service Discovery** (Port 8761): Eureka server for service registration and discovery
- **API Gateway** (Port 8080): Single entry point for all client requests

### Business Services
- **User Service** (Port 8081): User management and authentication
- **Product Service** (Port 8082): Product catalog management
- **Order Service** (Port 8083): Order processing and management

### Supporting Infrastructure
- **PostgreSQL**: Separate databases for each service
- **RabbitMQ**: Message broker for asynchronous communication
- **Redis**: Caching and session storage
- **Zipkin**: Distributed tracing

## Technologies Used

- **Java 21**: Latest LTS version
- **Spring Boot 3.3.5**: Main framework
- **Spring Cloud 2023.0.3**: Microservices tools
- **PostgreSQL 15**: Relational database
- **RabbitMQ**: Message broker
- **Redis**: Cache
- **Docker & Docker Compose**: Containerization
- **Maven**: Build tool
- **Lombok**: Boilerplate code reduction

## Prerequisites

- Java 21 or higher
- Maven 3.9+
- Docker & Docker Compose
- Git

## Project Structure
microservices-ecommerce/
├── services/
│   ├── config-server/
│   ├── service-discovery/
│   ├── api-gateway/
│   ├── user-service/
│   ├── product-service/
│   └── order-service/
├── infrastructure/
│   └── docker/
│       └── docker-compose.yml
├── config-repo/
│   ├── user-service.yml
│   ├── product-service.yml
│   └── order-service.yml
├── build-all.sh
├── start-all.sh
├── stop-all.sh
└── README.md