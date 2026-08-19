package com.timeheist.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.timeheist.backend.dto.ApiResponse;
import com.timeheist.backend.dto.AuthResponse;
import com.timeheist.backend.dto.LoginRequest;
import com.timeheist.backend.dto.RegisterRequest;
import com.timeheist.backend.dto.UserDto;
import com.timeheist.backend.service.AuthService;
import com.timeheist.backend.service.UserService;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;
    
    @Autowired
    private UserService userService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<Void>> register(
            @RequestBody RegisterRequest request) {

        authService.register(request);
        
        ApiResponse<Void> response = ApiResponse.<Void>builder()
                .success(true)
                .message("user registered succesfully")
                .data(null)
                .build();

        return ResponseEntity.ok(
                response
        );
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(
            @RequestBody LoginRequest request) {

        String token = authService.login(request);
        
        ApiResponse<AuthResponse> response = ApiResponse.<AuthResponse>builder()
                .success(true)
                .message("user login succesfully")
                .data(new AuthResponse(token))
                .build();

        return ResponseEntity.ok(
        		response
        );
    }
    
    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserDto>> getUserDetails(Authentication authentication){
    	String username = authentication.getName();
    	UserDto user = userService.getUserDetailsByName(username);
    	ApiResponse<UserDto> response = ApiResponse.<UserDto>builder()
                .success(true)
                .data(user)
                .build();

        return ResponseEntity.ok(
        		response
        );
    }
}