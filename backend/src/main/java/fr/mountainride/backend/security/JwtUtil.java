package fr.mountainride.backend.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

// Utilitaire pour créer et valider les tokens JWT
@Component
public class JwtUtil {

    @Value("${jwt.secret}")
    private String secret;

    @Value("${jwt.expiration}")
    private long expiration;

    // Convertit la clé secrète (String) en clé cryptographique utilisable par l'algorithme HMAC-SHA
    private SecretKey getSigningKey() {
        return Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
    }

    public String generateToken(String email, String role) {
        return Jwts.builder()
                .subject(email)             // Identifiant principal (qui est connecté)
                .claim("role", role)     // Donnée custom (rôle ADMIN/EMPLOYEE)
                .issuedAt(new Date())       // Date de création
                .expiration(new Date(System.currentTimeMillis() + expiration))  // Date d'expiration
                .signWith(getSigningKey())  // Signature avec la clé secrète
                .compact();                 // Génère le token final (string)
    }

    public Claims extractClaims(String token) {
        return Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    public String extractEmail(String token) {
        return extractClaims(token).getSubject();
    }

    public String extractRole(String token) {
        return extractClaims(token).get("role", String.class);
    }

    public boolean isTokenValid(String token) {
        try {
            return extractClaims(token).getExpiration().after(new Date());
        } catch (Exception e) {
            return false;   // Token invalide ou expiré
        }
    }
}
