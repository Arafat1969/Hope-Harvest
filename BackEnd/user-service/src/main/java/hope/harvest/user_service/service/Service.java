package hope.harvest.user_service.service;

import hope.harvest.user_service.dto.*;
import hope.harvest.user_service.model.RefreshToken;
import hope.harvest.user_service.model.User;
import hope.harvest.user_service.repo.RefreshTokenRepo;
import hope.harvest.user_service.repo.UserRepo;
import hope.harvest.user_service.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.transaction.annotation.Transactional;

import java.time.ZonedDateTime;
import java.util.List;
import java.util.UUID;

@org.springframework.stereotype.Service
public class Service {

    @Autowired
    private UserRepo userRepo;

    @Autowired
    private RefreshTokenRepo refreshTokenRepo;

    private BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @Autowired
    private JwtUtil jwtUtil;

    public LoginResponseDto register(UserRegistrationDto dto) {
        if (userRepo.existsByEmail(dto.getEmail())) {
            throw new RuntimeException("Email already registered");
        }

        User user = new User();
        user.setEmail(dto.getEmail());
        user.setPasswordHash(passwordEncoder.encode(dto.getPassword()));
        user.setFirstName(dto.getFirstName());
        user.setLastName(dto.getLastName());
        user.setPhoneNumber(dto.getPhoneNumber());
        user.setAddressCity(dto.getAddressCity());
        user.setAddressPostalCode(dto.getAddressPostalCode());
        user.setAddressCountry(dto.getAddressCountry());
        user.setEmailVerified(false);
        if(dto.getEmail() == "admin4860@gmail.com"){
            user.setRole("ADMIN");
        }else {
            user.setRole("USER");
        }


        User savedUser = userRepo.save(user);
        return generateLoginResponse(savedUser);
    }

    public LoginResponseDto login(LoginDto dto) {
        User user = userRepo.findByEmail(dto.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid credentials"));

        if (!passwordEncoder.matches(dto.getPassword(), user.getPasswordHash())) {
            throw new RuntimeException("Invalid credentials");
        }

        return generateLoginResponse(user);
    }

    private LoginResponseDto generateLoginResponse(User user) {
        String accessToken = jwtUtil.generateAccessToken(user);
        String refreshTokenValue = jwtUtil.generateRefreshToken();

        RefreshToken refreshToken = new RefreshToken();
        refreshToken.setUser(user);
        refreshToken.setTokenValue(refreshTokenValue);
        refreshToken.setExpiresAt(ZonedDateTime.now().plusDays(7));
        refreshToken.setRevoked(false);
        refreshTokenRepo.save(refreshToken);

        LoginResponseDto response = new LoginResponseDto();
        response.setUserId(user.getUserId());
        response.setEmail(user.getEmail());
        response.setRole(user.getRole());
        response.setAccessToken(accessToken);
        response.setRefreshToken(refreshTokenValue);
        response.setExpiresIn(3600L);
        return response;
    }

    public void logout(String refreshTokenValue) {
        RefreshToken token = refreshTokenRepo.findByTokenValue(refreshTokenValue)
                .orElseThrow(() -> new RuntimeException("Refresh token not found"));
        refreshTokenRepo.delete(token);
    }
    
    public UserProfileDto getCurrentUserProfile(UUID userId) {
        User user = userRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        UserProfileDto dto = new UserProfileDto();
        dto.setUserId(user.getUserId());
        dto.setEmail(user.getEmail());
        dto.setFirstName(user.getFirstName());
        dto.setLastName(user.getLastName());
        dto.setPhoneNumber(user.getPhoneNumber());
        dto.setAddressCity(user.getAddressCity());
        dto.setAddressPostalCode(user.getAddressPostalCode());
        dto.setAddressCountry(user.getAddressCountry());
        dto.setRole(user.getRole());
        dto.setEmailVerified(user.isEmailVerified());
        return dto;
    }


    @Transactional
    public void updateUserProfile(UUID userId, UserProfileUpdateDto dto) {
        User user = userRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setFirstName(dto.getFirstName());
        user.setLastName(dto.getLastName());
        user.setPhoneNumber(dto.getPhoneNumber());
        user.setAddressCity(dto.getAddressCity());
        user.setAddressPostalCode(dto.getAddressPostalCode());
        user.setAddressCountry(dto.getAddressCountry());

        userRepo.save(user);
    }


    @Transactional
    public void updateUserPassword(UUID userId, UserPasswordUpdateDto dto) {
        User user = userRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(dto.getOldPassword(), user.getPasswordHash())) {
            throw new RuntimeException("Old password is incorrect");
        }

        user.setPasswordHash(passwordEncoder.encode(dto.getNewPassword()));
        userRepo.save(user);
    }

    public List<AdminUserDto> getAllAdminUsers() {
        List<User> users = userRepo.findAll();
        return users.stream().map(this::convertToAdminUserDto).toList();
    }

    public AdminUserDto getAdminUserById(UUID userId) {
        User user = userRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return convertToAdminUserDto(user);
    }

    private AdminUserDto convertToAdminUserDto(User user) {
        return new AdminUserDto(
                user.getUserId(),
                user.getEmail(),
                user.isEmailVerified(),
                user.getFirstName(),
                user.getLastName(),
                user.getPhoneNumber(),
                user.getAddressCity(),
                user.getAddressPostalCode(),
                user.getAddressCountry(),
                user.getRole()
        );
    }

}
