package hope.harvest.user_service.service;

import hope.harvest.user_service.dto.*;
import hope.harvest.user_service.model.RefreshToken;
import hope.harvest.user_service.model.User;
import hope.harvest.user_service.repo.RefreshTokenRepo;
import hope.harvest.user_service.repo.UserRepo;
import hope.harvest.user_service.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.ZonedDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class UserService {

    @Autowired
    private UserRepo userRepo;

    @Autowired
    private RefreshTokenRepo refreshTokenRepo;

    private BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @Autowired
    private JwtUtil jwtUtil;

    public List<User> getAllUsers() {
        return userRepo.findAll();
    }

    public LoginResponseDto register(UserRegistrationDto dto) {
//        if (userRepo.existsByEmail(dto.getEmail())) {
//            throw new RuntimeException("Email already registered");
//        }

        User user = new User();
        user.setEmail(dto.getEmail());
        user.setPassword_hash(passwordEncoder.encode(dto.getPassword()));
        user.setFirst_name(dto.getFirstName());
        user.setLast_name(dto.getLastName());
        user.setPhone_number(dto.getPhoneNumber());
        user.setAddress_city(dto.getAddressCity());
        user.setAddress_postal_code(dto.getAddressPostalCode());
        user.setAddress_country(dto.getAddressCountry());
        user.setEmail_verified(false);
        user.setRole("USER");


        User savedUser = userRepo.save(user);
        String accessToken = jwtUtil.generateAccessToken(savedUser);
        String refreshTokenValue = jwtUtil.generateRefreshToken();

        // Save refresh token
        RefreshToken refreshToken = new RefreshToken();
        refreshToken.setUser(savedUser);
        refreshToken.setToken_value(refreshTokenValue);
        refreshToken.setExpires_at(ZonedDateTime.now().plusDays(7));
        refreshToken.setIs_revoked(false);
        refreshTokenRepo.save(refreshToken);

        // Create response
        LoginResponseDto response = new LoginResponseDto();
        response.setUserId(savedUser.getUser_id());
        response.setFirstName(savedUser.getFirst_name());
        response.setLastName(savedUser.getLast_name());
        response.setEmail(savedUser.getEmail());
        response.setRole(savedUser.getRole());
        response.setAccessToken(accessToken);
        response.setRefreshToken(refreshTokenValue);
        response.setExpiresIn(3600L); // 1 hour

        return response;
    }

    public LoginResponseDto login(LoginDto dto) {
        // Find user by email
        User user = userRepo.findByEmail(dto.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid credentials"));

        // Check password
        if (!passwordEncoder.matches(dto.getPassword(), user.getPassword_hash())) {
            throw new RuntimeException("Invalid credentials");
        }

        // Generate tokens
        String accessToken = jwtUtil.generateAccessToken(user);
        String refreshTokenValue = jwtUtil.generateRefreshToken();

        // Delete old refresh tokens
        //refreshTokenRepo.deleteByUser_UserId(user.getUser_id());

        // Save new refresh token
        RefreshToken refreshToken = new RefreshToken();
        refreshToken.setUser(user);
        refreshToken.setToken_value(refreshTokenValue);
        refreshToken.setExpires_at(ZonedDateTime.now().plusDays(7));
        refreshToken.setIs_revoked(false);
        refreshTokenRepo.save(refreshToken);

        // Create response
        LoginResponseDto response = new LoginResponseDto();
        response.setUserId(user.getUser_id());
        response.setFirstName(user.getFirst_name());
        response.setLastName(user.getLast_name());
        response.setEmail(user.getEmail());
        response.setRole(user.getRole());
        response.setAccessToken(accessToken);
        response.setRefreshToken(refreshTokenValue);
        response.setPhoneNumber(user.getPhone_number());
        response.setAddressCity(user.getAddress_city());
        response.setAddressPostalCode(user.getAddress_postal_code());
        response.setAddressCountry(user.getAddress_country());
        response.setExpiresIn(3600L); // 1 hour

        return response;
    }
}