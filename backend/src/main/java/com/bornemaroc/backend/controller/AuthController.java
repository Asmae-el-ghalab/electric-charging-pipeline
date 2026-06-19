package com.bornemaroc.backend.controller;

import com.bornemaroc.backend.entity.Utilisateur;
import com.bornemaroc.backend.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:4200")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<Utilisateur> register(
            @RequestBody Map<String, String> body) {
        Utilisateur u = authService.register(
                body.get("nom"),
                body.get("email"),
                body.get("motDePasse"),
                body.get("vehicule")
        );
        return ResponseEntity.ok(u);
    }

    // ✅ CORRECTION : Type de retour Map<String, Object>
    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(
            @RequestBody Map<String, String> body) {
        Map<String, Object> response = authService.login(
                body.get("email"),
                body.get("motDePasse")
        );
        return ResponseEntity.ok(response);
    }
}