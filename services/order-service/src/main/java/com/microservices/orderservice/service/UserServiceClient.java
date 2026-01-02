package com.microservices.orderservice.service;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.microservices.orderservice.dto.UserDto;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserServiceClient {
    
    private final RestTemplate restTemplate;
    
    public UserDto getUserById(Long userId) {
        log.info("Fetching user with id: {} from user-service", userId);
        String url = "http://user-service/users/" + userId;
        return restTemplate.getForObject(url, UserDto.class);
    }
}