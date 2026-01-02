package com.microservices.userservice.service;

import com.microservices.userservice.dto.CreateUserRequest;
import com.microservices.userservice.dto.UserDto;
import com.microservices.userservice.exception.UserAlreadyExistsException;
import com.microservices.userservice.exception.UserNotFoundException;
import com.microservices.userservice.model.User;
import com.microservices.userservice.model.UserRole;
import com.microservices.userservice.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class UserService {
    
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    
    public UserDto createUser(CreateUserRequest request) {
        log.info("Creating user with email: {}", request.getEmail());
        
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new UserAlreadyExistsException("User already exists with email: " + request.getEmail());
        }
        
        User user = User.builder()
            .email(request.getEmail())
            .password(passwordEncoder.encode(request.getPassword()))
            .firstName(request.getFirstName())
            .lastName(request.getLastName())
            .role(UserRole.USER)
            .active(true)
            .build();
        
        User savedUser = userRepository.save(user);
        log.info("User created successfully with id: {}", savedUser.getId());
        
        return mapToDto(savedUser);
    }
    
    public UserDto getUserById(Long id) {
        log.info("Fetching user with id: {}", id);
        User user = userRepository.findById(id)
            .orElseThrow(() -> new UserNotFoundException("User not found with id: " + id));
        return mapToDto(user);
    }
    
    public UserDto getUserByEmail(String email) {
        log.info("Fetching user with email: {}", email);
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new UserNotFoundException("User not found with email: " + email));
        return mapToDto(user);
    }
    
    public List<UserDto> getAllUsers() {
        log.info("Fetching all active users");
        return userRepository.findByActiveTrue().stream()
            .map(this::mapToDto)
            .collect(Collectors.toList());
    }
    
    public UserDto updateUser(Long id, CreateUserRequest request) {
        log.info("Updating user with id: {}", id);
        User user = userRepository.findById(id)
            .orElseThrow(() -> new UserNotFoundException("User not found with id: " + id));
        
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        
        if (request.getPassword() != null && !request.getPassword().isEmpty()) {
            user.setPassword(passwordEncoder.encode(request.getPassword()));
        }
        
        User updatedUser = userRepository.save(user);
        log.info("User updated successfully with id: {}", updatedUser.getId());
        
        return mapToDto(updatedUser);
    }
    
    public void deleteUser(Long id) {
        log.info("Deleting user with id: {}", id);
        User user = userRepository.findById(id)
            .orElseThrow(() -> new UserNotFoundException("User not found with id: " + id));
        
        user.setActive(false);
        userRepository.save(user);
        log.info("User deactivated successfully with id: {}", id);
    }
    
    private UserDto mapToDto(User user) {
        return UserDto.builder()
            .id(user.getId())
            .email(user.getEmail())
            .firstName(user.getFirstName())
            .lastName(user.getLastName())
            .role(user.getRole())
            .active(user.getActive())
            .createdAt(user.getCreatedAt())
            .updatedAt(user.getUpdatedAt())
            .build();
    }
}