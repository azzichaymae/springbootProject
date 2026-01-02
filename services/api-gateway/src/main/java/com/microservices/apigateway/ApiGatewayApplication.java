package com.microservices.apigateway;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.gateway.route.RouteDefinitionLocator;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class ApiGatewayApplication {
    public static void main(String[] args) {
        SpringApplication.run(ApiGatewayApplication.class, args);
    }
    
    @Bean
    public CommandLineRunner debugRoutes(RouteDefinitionLocator locator) {
        return args -> {
            System.out.println("=== ROUTES CONFIGURATION ===");
            locator.getRouteDefinitions()
                .subscribe(route -> {
                    System.out.println("Route ID: " + route.getId());
                    System.out.println("Predicates: " + route.getPredicates());
                    System.out.println("Filters: " + route.getFilters());
                    System.out.println("---");
                });
        };
    }
}