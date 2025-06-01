package hope.harvest.user_service.controller;

import hope.harvest.user_service.dto.*;
import hope.harvest.user_service.model.User;
import hope.harvest.user_service.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/v1")
public class UserController {

    @Autowired
    private UserService service;

    @GetMapping("/admin/users")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(service.getAllUsers());
    }

    @PostMapping("/auth/register")
    public ResponseEntity<ApiResponse<LoginResponseDto>> register(@RequestBody UserRegistrationDto dto) {
        try {
            LoginResponseDto response = service.register(dto);
            ApiResponse<LoginResponseDto> apiResponse = new ApiResponse<>("success", "Registration successful", response);
            return ResponseEntity.status(HttpStatus.CREATED).body(apiResponse);
        } catch (Exception e) {
            ApiResponse<LoginResponseDto> errorResponse = new ApiResponse<>("error", e.getMessage(), null);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
        }
    }

    @PostMapping("/auth/login")
    public ResponseEntity<ApiResponse<LoginResponseDto>> login(@RequestBody LoginDto dto) {
        try {
            LoginResponseDto response = service.login(dto);
            ApiResponse<LoginResponseDto> apiResponse = new ApiResponse<>("success", "Login successful", response);
            return ResponseEntity.ok(apiResponse);
        } catch (Exception e) {
            ApiResponse<LoginResponseDto> errorResponse = new ApiResponse<>("error", e.getMessage(), null);
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(errorResponse);
        }
    }

//    @PostMapping("/auth/logout")
//    public ResponseEntity<ApiResponse<String>> logout(@RequestBody LogoutDto dto) {
//        try {
//            service.logout(dto.getRefreshToken());
//            ApiResponse<String> apiResponse = new ApiResponse<>("success", "Logout successful", null);
//            return ResponseEntity.ok(apiResponse);
//        } catch (Exception e) {
//            ApiResponse<String> errorResponse = new ApiResponse<>("error", e.getMessage(), null);
//            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
//        }
//    }
}