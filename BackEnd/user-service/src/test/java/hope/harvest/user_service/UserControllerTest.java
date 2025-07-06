package hope.harvest.user_service;

import hope.harvest.user_service.controller.UserController;
import hope.harvest.user_service.dto.*;
import hope.harvest.user_service.service.Service;
import hope.harvest.user_service.util.JwtUtil;
import jakarta.servlet.http.HttpServletRequest;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.List;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserControllerTest {

    @Mock
    private Service userService;

    @Mock
    private JwtUtil jwtUtil;

    @Mock
    private HttpServletRequest request;

    @InjectMocks
    private UserController userController;

    private final UUID testUserId = UUID.randomUUID();
    private final String testToken = "testToken";

    @Test
    void register_Success_ReturnsCreated() {
        // Arrange
        UserRegistrationDto dto = new UserRegistrationDto();
        LoginResponseDto expectedResponse = new LoginResponseDto();
        expectedResponse.setUserId(testUserId);

        when(userService.register(any(UserRegistrationDto.class))).thenReturn(expectedResponse);

        // Act
        ResponseEntity<ApiResponse<LoginResponseDto>> response = userController.register(dto);

        // Assert
        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertEquals("success", response.getBody().getStatus());
        assertEquals(testUserId, response.getBody().getData().getUserId());
        verify(userService).register(dto);
    }

    @Test
    void register_Exception_ReturnsBadRequest() {
        // Arrange
        UserRegistrationDto dto = new UserRegistrationDto();
        when(userService.register(any(UserRegistrationDto.class)))
                .thenThrow(new RuntimeException("Email exists"));

        // Act
        ResponseEntity<ApiResponse<LoginResponseDto>> response = userController.register(dto);

        // Assert
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals("error", response.getBody().getStatus());
        assertEquals("Email exists", response.getBody().getMessage());
    }

    @Test
    void login_Success_ReturnsOk() {
        // Arrange
        LoginDto dto = new LoginDto();
        LoginResponseDto expectedResponse = new LoginResponseDto();
        expectedResponse.setUserId(testUserId);

        when(userService.login(any(LoginDto.class))).thenReturn(expectedResponse);

        // Act
        ResponseEntity<ApiResponse<LoginResponseDto>> response = userController.login(dto);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("success", response.getBody().getStatus());
        assertEquals(testUserId, response.getBody().getData().getUserId());
    }

    @Test
    void login_InvalidCredentials_ReturnsUnauthorized() {
        // Arrange
        LoginDto dto = new LoginDto();
        when(userService.login(any(LoginDto.class)))
                .thenThrow(new RuntimeException("Invalid credentials"));

        // Act
        ResponseEntity<ApiResponse<LoginResponseDto>> response = userController.login(dto);

        // Assert
        assertEquals(HttpStatus.UNAUTHORIZED, response.getStatusCode());
        assertEquals("error", response.getBody().getStatus());
        assertEquals("Invalid credentials", response.getBody().getMessage());
    }

    @Test
    void logout_Success_ReturnsOk() {
        // Arrange
        LogoutDto dto = new LogoutDto();
        dto.setRefreshToken("refreshToken");

        // Act
        ResponseEntity<ApiResponse<String>> response = userController.logout(dto);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("success", response.getBody().getStatus());
        verify(userService).logout("refreshToken");
    }

    @Test
    void getProfile_Success_ReturnsUserProfile() {
        // Arrange
        UserProfileDto expectedProfile = new UserProfileDto();
        expectedProfile.setUserId(testUserId);

        when(request.getHeader(HttpHeaders.AUTHORIZATION)).thenReturn("Bearer " + testToken);
        when(jwtUtil.extractUserId(testToken)).thenReturn(testUserId);
        when(userService.getCurrentUserProfile(testUserId)).thenReturn(expectedProfile);

        // Act
        ResponseEntity<ApiResponse<UserProfileDto>> response = userController.getProfile(request);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("success", response.getBody().getStatus());
        assertEquals(testUserId, response.getBody().getData().getUserId());
    }

    @Test
    void updateProfile_Success_ReturnsOk() {
        // Arrange
        UserProfileUpdateDto dto = new UserProfileUpdateDto();
        when(request.getHeader(HttpHeaders.AUTHORIZATION)).thenReturn("Bearer " + testToken);
        when(jwtUtil.extractUserId(testToken)).thenReturn(testUserId);

        // Act
        ResponseEntity<ApiResponse<String>> response = userController.updateProfile(dto, request);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("success", response.getBody().getStatus());
        verify(userService).updateUserProfile(testUserId, dto);
    }

    @Test
    void updatePassword_Success_ReturnsOk() {
        // Arrange
        UserPasswordUpdateDto dto = new UserPasswordUpdateDto();
        when(request.getHeader(HttpHeaders.AUTHORIZATION)).thenReturn("Bearer " + testToken);
        when(jwtUtil.extractUserId(testToken)).thenReturn(testUserId);

        // Act
        ResponseEntity<ApiResponse<String>> response = userController.updatePassword(dto, request);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("success", response.getBody().getStatus());
        verify(userService).updateUserPassword(testUserId, dto);
    }

    @Test
    void getAllAdminUsers_Success_ReturnsUserList() {
        // Arrange
        AdminUserDto user = new AdminUserDto(testUserId, "admin@test.com", true,
                "Admin", "User", "1234567890", "City", "12345", "Country", "ADMIN");

        when(userService.getAllAdminUsers()).thenReturn(List.of(user));

        // Act
        ResponseEntity<ApiResponse<List<AdminUserDto>>> response = userController.getAllAdminUsers();

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("success", response.getBody().getStatus());
        assertEquals(1, response.getBody().getData().size());
        assertEquals(testUserId, response.getBody().getData().get(0).getUserId());
    }

    @Test
    void getAdminUserById_Success_ReturnsUser() {
        // Arrange
        AdminUserDto expectedUser = new AdminUserDto(testUserId, "user@test.com", false,
                "Test", "User", "0987654321", "Town", "54321", "Nation", "USER");

        when(userService.getAdminUserById(testUserId)).thenReturn(expectedUser);

        // Act
        ResponseEntity<ApiResponse<AdminUserDto>> response = userController.getAdminUserById(testUserId);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("success", response.getBody().getStatus());
        assertEquals(testUserId, response.getBody().getData().getUserId());
    }
}