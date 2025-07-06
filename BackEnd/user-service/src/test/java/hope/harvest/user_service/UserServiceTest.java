package hope.harvest.user_service;

import hope.harvest.user_service.dto.*;
import hope.harvest.user_service.model.RefreshToken;
import hope.harvest.user_service.model.User;
import hope.harvest.user_service.repo.RefreshTokenRepo;
import hope.harvest.user_service.repo.UserRepo;
import hope.harvest.user_service.service.Service;
import hope.harvest.user_service.util.JwtUtil;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.*;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepo userRepo;

    @Mock
    private RefreshTokenRepo refreshTokenRepo;

    private Service userService;

    private final UUID userId = UUID.randomUUID();
    private final String email = "test@example.com";
    private final String password = "password123";

    private User user;

    static class FakeJwtUtil extends JwtUtil {
        @Override
        public String generateAccessToken(User user) {
            return "fake-access-token";
        }

        @Override
        public String generateRefreshToken() {
            return "fake-refresh-token";
        }
    }

    @BeforeEach
    void setUp() {
        userService = new Service();
        ReflectionTestUtils.setField(userService, "userRepo", userRepo);
        ReflectionTestUtils.setField(userService, "refreshTokenRepo", refreshTokenRepo);
        ReflectionTestUtils.setField(userService, "jwtUtil", new FakeJwtUtil());

        user = new User();
        user.setUserId(userId);
        user.setEmail(email);
        user.setPasswordHash(new BCryptPasswordEncoder().encode(password));
        user.setRole("USER");
    }

    @Test
    void register_NewUser_ReturnsLoginResponse() {
        UserRegistrationDto dto = new UserRegistrationDto();
        dto.setEmail(email);
        dto.setPassword(password);
        dto.setFirstName("Test");
        dto.setLastName("User");

        when(userRepo.existsByEmail(email)).thenReturn(false);
        when(userRepo.save(any(User.class))).thenReturn(user);

        LoginResponseDto response = userService.register(dto);

        assertEquals(email, response.getEmail());
        assertEquals("USER", response.getRole());
        assertEquals("fake-access-token", response.getAccessToken());
        assertEquals("fake-refresh-token", response.getRefreshToken());
    }

    @Test
    void login_ValidCredentials_ReturnsLoginResponse() {
        LoginDto dto = new LoginDto();
        dto.setEmail(email);
        dto.setPassword(password);

        when(userRepo.findByEmail(email)).thenReturn(Optional.of(user));

        LoginResponseDto response = userService.login(dto);

        assertEquals(email, response.getEmail());
        assertEquals("USER", response.getRole());
    }

    @Test
    void logout_ValidToken_DeletesToken() {
        RefreshToken token = new RefreshToken();
        token.setTokenValue("refresh-token");

        when(refreshTokenRepo.findByTokenValue("refresh-token")).thenReturn(Optional.of(token));

        userService.logout("refresh-token");

        verify(refreshTokenRepo, times(1)).delete(token);
    }

    @Test
    void getCurrentUserProfile_ValidId_ReturnsProfile() {
        when(userRepo.findById(userId)).thenReturn(Optional.of(user));

        UserProfileDto dto = userService.getCurrentUserProfile(userId);

        assertEquals(email, dto.getEmail());
        assertEquals(userId, dto.getUserId());
    }

    @Test
    void updateUserPassword_CorrectOldPassword_UpdatesPassword() {
        UserPasswordUpdateDto dto = new UserPasswordUpdateDto();
        dto.setOldPassword(password);
        dto.setNewPassword("newpass456");

        when(userRepo.findById(userId)).thenReturn(Optional.of(user));

        userService.updateUserPassword(userId, dto);

        verify(userRepo, times(1)).save(user);
    }


    @Test
    void updateUserProfile_ValidData_UpdatesFields() {
        UserProfileUpdateDto dto = new UserProfileUpdateDto();
        dto.setFirstName("NewFirst");
        dto.setLastName("NewLast");
        dto.setPhoneNumber("0123456789");
        dto.setAddressCity("City");
        dto.setAddressPostalCode("1234");
        dto.setAddressCountry("Country");

        when(userRepo.findById(userId)).thenReturn(Optional.of(user));

        userService.updateUserProfile(userId, dto);

        assertEquals("NewFirst", user.getFirstName());
        assertEquals("NewLast", user.getLastName());
        assertEquals("0123456789", user.getPhoneNumber());
        assertEquals("City", user.getAddressCity());
        assertEquals("1234", user.getAddressPostalCode());
        assertEquals("Country", user.getAddressCountry());

        verify(userRepo).save(user);
    }

    @Test
    void getAllAdminUsers_ReturnsMappedList() {
        when(userRepo.findAll()).thenReturn(java.util.List.of(user));

        var result = userService.getAllAdminUsers();

        assertEquals(1, result.size());
        assertEquals(email, result.get(0).getEmail());
        assertEquals(userId, result.get(0).getUserId());
    }

    @Test
    void getAdminUserById_ValidId_ReturnsDto() {
        when(userRepo.findById(userId)).thenReturn(Optional.of(user));

        var dto = userService.getAdminUserById(userId);

        assertEquals(email, dto.getEmail());
        assertEquals(userId, dto.getUserId());
    }
}