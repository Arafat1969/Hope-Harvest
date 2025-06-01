package hope.harvest.user_service.util;

import hope.harvest.user_service.model.User;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Base64;
import java.util.Date;
import java.util.UUID;

@Component
public class JwtUtil {

    @Value("${jwt.secret:dGhpc2lzYXZlcnlsb25nc2VjcmV0a2V5Zm9yaG9wZWhhcnZlc3RhcHBsaWNhdGlvbjIwMjQ=}")
    private String secretKey;

    @Value("${jwt.expiration:3600000}")
    private Long expiration;

    private Key getSigningKey() {
        byte[] keyBytes = Base64.getDecoder().decode(secretKey);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    public String generateAccessToken(User user) {
        return Jwts.builder()
                .setSubject(user.getUser_id().toString())
                .claim("email", user.getEmail())
                .claim("role", user.getRole())
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + expiration))
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    public String generateRefreshToken() {
        return UUID.randomUUID().toString();
    }
}