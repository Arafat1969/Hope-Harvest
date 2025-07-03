package hope.harvest.user_service.controller;

import hope.harvest.user_service.dto.*;
import hope.harvest.user_service.service.UserService;
import hope.harvest.user_service.util.JwtUtil;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/v1/user-service")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private JwtUtil jwtUtil;




    @PostMapping("/auth/register")
    public ResponseEntity<ApiResponse<LoginResponseDto>> register(@RequestBody UserRegistrationDto dto) {
        try {
            LoginResponseDto response = userService.register(dto);
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
            LoginResponseDto response = userService.login(dto);
            ApiResponse<LoginResponseDto> apiResponse = new ApiResponse<>("success", "Login successful", response);
            return ResponseEntity.ok(apiResponse);
        } catch (Exception e) {
            ApiResponse<LoginResponseDto> errorResponse = new ApiResponse<>("error", e.getMessage(), null);
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(errorResponse);
        }
    }



    @PostMapping("/auth/logout")
    public ResponseEntity<ApiResponse<String>> logout(@RequestBody LogoutDto dto) {
        try {
            userService.logout(dto.getRefreshToken());
            ApiResponse<String> apiResponse = new ApiResponse<>("success", "Logout successful", null);
            return ResponseEntity.ok(apiResponse);
        } catch (Exception e) {
            ApiResponse<String> errorResponse = new ApiResponse<>("error", e.getMessage(), null);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
        }
    }


    // Extract userId from JWT token (common helper function)
    private UUID extractUserIdFromRequest(HttpServletRequest request) {
        String authHeader = request.getHeader(HttpHeaders.AUTHORIZATION);
        String token = authHeader.substring(7); // remove Bearer
        return jwtUtil.extractUserId(token);
    }



    @GetMapping("/users/me")
    public ResponseEntity<ApiResponse<UserProfileDto>> getProfile(HttpServletRequest request) {
        UUID userId = extractUserIdFromRequest(request);
        UserProfileDto dto = userService.getCurrentUserProfile(userId);
        return ResponseEntity.ok(new ApiResponse<>("success", "Profile loaded", dto));
    }



    @PutMapping("/users/me")
    public ResponseEntity<ApiResponse<String>> updateProfile(@RequestBody UserProfileUpdateDto profileUpdateDto,
                                                             HttpServletRequest request) {
        UUID userId = extractUserIdFromRequest(request);
        userService.updateUserProfile(userId, profileUpdateDto);
        return ResponseEntity.ok(new ApiResponse<>("success", "Profile updated", null));
    }



    @PatchMapping("/users/me/password")
    public ResponseEntity<ApiResponse<String>> updatePassword(@RequestBody UserPasswordUpdateDto passwordUpdateDto,
                                                              HttpServletRequest request) {
        UUID userId = extractUserIdFromRequest(request);
        userService.updateUserPassword(userId, passwordUpdateDto);
        return ResponseEntity.ok(new ApiResponse<>("success", "Password updated", null));
    }



    @GetMapping("/admin/users")
    public ResponseEntity<ApiResponse<List<AdminUserDto>>> getAllAdminUsers() {
        List<AdminUserDto> users = userService.getAllAdminUsers();
        return ResponseEntity.ok(new ApiResponse<>("success", "All users fetched", users));
    }


    @GetMapping("/admin/users/{userId}")
    public ResponseEntity<ApiResponse<AdminUserDto>> getAdminUserById(@PathVariable UUID userId) {
        AdminUserDto user = userService.getAdminUserById(userId);
        return ResponseEntity.ok(new ApiResponse<>("success", "User details fetched", user));
    }

}
