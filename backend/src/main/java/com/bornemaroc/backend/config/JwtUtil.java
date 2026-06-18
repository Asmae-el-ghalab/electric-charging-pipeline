package com.bornemaroc.backend.config;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.stereotype.Component;
import java.util.Date;

@Component
public class JwtUtil {

    private static final String SECRET_KEY = "bornemarocSecretKey2024ForJWTTokenGeneration123456789";
    private static final long EXPIRATION_TIME = 86400000; // 24h

    // Générer token avec ID
    public String generateToken(String email, String role, Long id) {
        return Jwts.builder()
                .setSubject(email)
                .claim("role", role)
                .claim("id", id)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .signWith(SignatureAlgorithm.HS256, SECRET_KEY)
                .compact();
    }
    
    // Override pour compatibilité (sans ID)
    public String generateToken(String email, String role) {
        return generateToken(email, role, 0L);
    }

    // Lire email depuis token
    public String getEmailFromToken(String token) {
        return getClaims(token).getSubject();
    }

    // Lire role depuis token
    public String getRoleFromToken(String token) {
        return getClaims(token).get("role", String.class);
    }
    
    // Lire ID depuis token
    public Long getIdFromToken(String token) {
        return getClaims(token).get("id", Long.class);
    }

    // Valider token
    public boolean validateToken(String token) {
        try {
            getClaims(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    private Claims getClaims(String token) {
        return Jwts.parser()
                .setSigningKey(SECRET_KEY)
                .parseClaimsJws(token)
                .getBody();
    }
}