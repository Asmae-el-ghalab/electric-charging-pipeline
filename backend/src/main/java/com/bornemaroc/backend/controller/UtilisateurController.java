package com.bornemaroc.backend.controller;

import com.bornemaroc.backend.entity.Utilisateur;
import com.bornemaroc.backend.enums.RoleUtilisateur;
import com.bornemaroc.backend.service.UtilisateurService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/utilisateurs")
@CrossOrigin(origins = "http://localhost:4200")
public class UtilisateurController {

    @Autowired
    private UtilisateurService utilisateurService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // ==================== GET - TOUS LES UTILISATEURS ====================
    @GetMapping
    public ResponseEntity<List<Utilisateur>> getAllUtilisateurs() {
        return ResponseEntity.ok(utilisateurService.getAllUtilisateurs());
    }

    // ==================== GET - UTILISATEUR PAR ID ====================
    @GetMapping("/{id}")
    public ResponseEntity<Utilisateur> getUtilisateurById(@PathVariable Long id) {
        return ResponseEntity.ok(utilisateurService.getUtilisateurById(id));
    }

    // ==================== GET - UTILISATEUR PAR EMAIL ====================
    @GetMapping("/email/{email}")
    public ResponseEntity<Utilisateur> getUtilisateurByEmail(@PathVariable String email) {
        return ResponseEntity.ok(utilisateurService.getUtilisateurByEmail(email));
    }

    // ==================== POST - CRÉER UTILISATEUR (ADMIN) ====================
    @PostMapping
    public ResponseEntity<Utilisateur> createUtilisateur(@RequestBody Utilisateur utilisateur) {
        Utilisateur nouveauUtilisateur = utilisateurService.createUtilisateur(utilisateur);
        return ResponseEntity.status(201).body(nouveauUtilisateur);
    }

    // ==================== POST - INSCRIPTION ====================
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Utilisateur utilisateur) {
        try {
            // Important : createUtilisateur et non register
            Utilisateur nouveauUtilisateur = utilisateurService.createUtilisateur(utilisateur);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Inscription réussie");
            response.put("id", nouveauUtilisateur.getId());
            response.put("nom", nouveauUtilisateur.getNom());
            response.put("email", nouveauUtilisateur.getEmail());
            response.put("role", nouveauUtilisateur.getRole().name());

            return ResponseEntity.status(201).body(response);

        } catch (RuntimeException e) {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", e.getMessage());

            return ResponseEntity.badRequest().body(error);
        }
    }

    // ==================== PUT - MODIFIER UTILISATEUR ====================
    @PutMapping("/{id}")
    public ResponseEntity<Utilisateur> updateUtilisateur(
            @PathVariable Long id,
            @RequestBody Utilisateur utilisateur) {

        return ResponseEntity.ok(utilisateurService.updateUtilisateur(id, utilisateur));
    }

    // ==================== PUT - BLOQUER ====================
    @PutMapping("/{id}/bloquer")
    public ResponseEntity<Utilisateur> bloquerUtilisateur(@PathVariable Long id) {
        return ResponseEntity.ok(utilisateurService.bloquerUtilisateur(id));
    }

    // ==================== PUT - DÉBLOQUER ====================
    @PutMapping("/{id}/debloquer")
    public ResponseEntity<Utilisateur> debloquerUtilisateur(@PathVariable Long id) {
        return ResponseEntity.ok(utilisateurService.debloquerUtilisateur(id));
    }

    // ==================== PUT - PROMOUVOIR ADMIN ====================
    @PutMapping("/{id}/promouvoir")
    public ResponseEntity<Utilisateur> promouvoirAdmin(@PathVariable Long id) {
        return ResponseEntity.ok(utilisateurService.promouvoirAdmin(id));
    }

    // ==================== PUT - RÉTROGRADER ====================
    @PutMapping("/{id}/retrograder")
    public ResponseEntity<Utilisateur> retrograderAdmin(@PathVariable Long id) {
        return ResponseEntity.ok(utilisateurService.retrograderAdmin(id));
    }

    // ==================== DELETE ====================
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> supprimerUtilisateur(@PathVariable Long id) {
        utilisateurService.supprimerUtilisateur(id);
        return ResponseEntity.noContent().build();
    }

    // ==================== STATISTIQUES ====================
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Long>> getStats() {
        return ResponseEntity.ok(utilisateurService.getStats());
    }

    // ==================== RECHERCHE ====================
    @GetMapping("/recherche")
    public ResponseEntity<List<Utilisateur>> rechercher(
            @RequestParam(required = false) String term) {

        return ResponseEntity.ok(utilisateurService.rechercher(term));
    }

    // ==================== FILTRER PAR RÔLE ====================
    @GetMapping("/filtre/role")
    public ResponseEntity<List<Utilisateur>> filtrerParRole(@RequestParam String role) {
        try {
            RoleUtilisateur roleEnum = RoleUtilisateur.valueOf(role.toUpperCase());
            return ResponseEntity.ok(utilisateurService.filtrerParRole(roleEnum));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // ==================== LOGIN ====================
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        try {
            Utilisateur utilisateur = utilisateurService.getUtilisateurByEmail(loginRequest.getEmail());

            if (!passwordEncoder.matches(
                    loginRequest.getMotDePasse(),
                    utilisateur.getMotDePasse())) {

                Map<String, Object> error = new HashMap<>();
                error.put("error", "Email ou mot de passe incorrect");
                return ResponseEntity.status(401).body(error);
            }

            if (Boolean.TRUE.equals(utilisateur.getEstBloque())) {
                Map<String, Object> response = new HashMap<>();
                response.put("error", "Votre compte est bloqué. Contactez l'administrateur.");
                response.put("estBloque", true);
                response.put("id", utilisateur.getId());
                response.put("nom", utilisateur.getNom());
                response.put("email", utilisateur.getEmail());
                response.put("role", utilisateur.getRole().name());

                return ResponseEntity.status(403).body(response);
            }

            String token = "token_" + utilisateur.getId() + "_" + System.currentTimeMillis();

            Map<String, Object> response = new HashMap<>();
            response.put("id", utilisateur.getId());
            response.put("nom", utilisateur.getNom());
            response.put("email", utilisateur.getEmail());
            response.put("role", utilisateur.getRole().name());
            response.put("estBloque", Boolean.TRUE.equals(utilisateur.getEstBloque()));
            response.put("token", token);
            response.put("message", "Connexion réussie");

            return ResponseEntity.ok(response);

        } catch (RuntimeException e) {
            Map<String, Object> error = new HashMap<>();
            error.put("error", "Email ou mot de passe incorrect");
            return ResponseEntity.status(401).body(error);
        }
    }

    // Endpoint supplémentaire : /api/utilisateurs/auth/login
    @PostMapping("/auth/login")
    public ResponseEntity<?> authLogin(@RequestBody LoginRequest loginRequest) {
        return login(loginRequest);
    }

    public static class LoginRequest {
        private String email;
        private String motDePasse;

        public String getEmail() {
            return email;
        }

        public void setEmail(String email) {
            this.email = email;
        }

        public String getMotDePasse() {
            return motDePasse;
        }

        public void setMotDePasse(String motDePasse) {
            this.motDePasse = motDePasse;
        }
    }
}