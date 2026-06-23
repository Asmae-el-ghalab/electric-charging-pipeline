package com.bornemaroc.backend.controller;

import com.bornemaroc.backend.entity.Utilisateur;
import com.bornemaroc.backend.enums.RoleUtilisateur;
import com.bornemaroc.backend.service.UtilisateurService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.crypto.password.PasswordEncoder;



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

    // GET - Récupérer tous les utilisateurs
    @GetMapping
    public ResponseEntity<List<Utilisateur>> getAllUtilisateurs() {
        List<Utilisateur> utilisateurs = utilisateurService.getAllUtilisateurs();
        return ResponseEntity.ok(utilisateurs);
    }

    // GET - Récupérer un utilisateur par ID
    @GetMapping("/{id}")
    public ResponseEntity<Utilisateur> getUtilisateurById(@PathVariable Long id) {
        Utilisateur utilisateur = utilisateurService.getUtilisateurById(id);
        return ResponseEntity.ok(utilisateur);
    }

    // GET - Récupérer un utilisateur par email
    @GetMapping("/email/{email}")
    public ResponseEntity<Utilisateur> getUtilisateurByEmail(@PathVariable String email) {
        Utilisateur utilisateur = utilisateurService.getUtilisateurByEmail(email);
        return ResponseEntity.ok(utilisateur);
    }

    // POST - Créer un utilisateur
    @PostMapping
    public ResponseEntity<Utilisateur> createUtilisateur(@RequestBody Utilisateur utilisateur) {
        Utilisateur newUtilisateur = utilisateurService.createUtilisateur(utilisateur);
        return ResponseEntity.ok(newUtilisateur);
    }

    // PUT - Mettre à jour un utilisateur
    @PutMapping("/{id}")
    public ResponseEntity<Utilisateur> updateUtilisateur(
            @PathVariable Long id,
            @RequestBody Utilisateur utilisateur) {
        Utilisateur updatedUtilisateur = utilisateurService.updateUtilisateur(id, utilisateur);
        return ResponseEntity.ok(updatedUtilisateur);
    }

    // PUT - Bloquer un utilisateur
    @PutMapping("/{id}/bloquer")
    public ResponseEntity<Utilisateur> bloquerUtilisateur(@PathVariable Long id) {
        Utilisateur utilisateur = utilisateurService.bloquerUtilisateur(id);
        return ResponseEntity.ok(utilisateur);
    }

    // PUT - Débloquer un utilisateur
    @PutMapping("/{id}/debloquer")
    public ResponseEntity<Utilisateur> debloquerUtilisateur(@PathVariable Long id) {
        Utilisateur utilisateur = utilisateurService.debloquerUtilisateur(id);
        return ResponseEntity.ok(utilisateur);
    }

    // PUT - Promouvoir en administrateur
    @PutMapping("/{id}/promouvoir")
    public ResponseEntity<Utilisateur> promouvoirAdmin(@PathVariable Long id) {
        Utilisateur utilisateur = utilisateurService.promouvoirAdmin(id);
        return ResponseEntity.ok(utilisateur);
    }

    // PUT - Rétrograder de administrateur
    @PutMapping("/{id}/retrograder")
    public ResponseEntity<Utilisateur> retrograderAdmin(@PathVariable Long id) {
        Utilisateur utilisateur = utilisateurService.retrograderAdmin(id);
        return ResponseEntity.ok(utilisateur);
    }

    // DELETE - Supprimer un utilisateur
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> supprimerUtilisateur(@PathVariable Long id) {
        utilisateurService.supprimerUtilisateur(id);
        return ResponseEntity.ok().build();
    }

    // GET - Statistiques
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Long>> getStats() {
        Map<String, Long> stats = utilisateurService.getStats();
        return ResponseEntity.ok(stats);
    }

    // GET - Rechercher des utilisateurs
    @GetMapping("/recherche")
    public ResponseEntity<List<Utilisateur>> rechercher(@RequestParam(required = false) String term) {
        List<Utilisateur> utilisateurs = utilisateurService.rechercher(term);
        return ResponseEntity.ok(utilisateurs);
    }

    // GET - Filtrer par rôle
    @GetMapping("/filtre/role")
    public ResponseEntity<List<Utilisateur>> filtrerParRole(@RequestParam String role) {
        RoleUtilisateur roleEnum;
        try {
            roleEnum = RoleUtilisateur.valueOf(role.toUpperCase());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
        List<Utilisateur> utilisateurs = utilisateurService.filtrerParRole(roleEnum);
        return ResponseEntity.ok(utilisateurs);
    }

    // ==================== LOGIN AVEC VÉRIFICATION DE BLOCAGE ====================
    
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        try {
            // 1. Récupérer l'utilisateur par email
            Utilisateur utilisateur = utilisateurService.getUtilisateurByEmail(loginRequest.getEmail());
            
            // 2. Vérifier si l'utilisateur existe
            if (utilisateur == null) {
                Map<String, String> error = new HashMap<>();
                error.put("error", "Email ou mot de passe incorrect");
                return ResponseEntity.status(401).body(error);
            }
            
            // 3. Vérifier le mot de passe
           // 3. Vérifier le mot de passe avec BCrypt
if (!passwordEncoder.matches(
        loginRequest.getMotDePasse(),
        utilisateur.getMotDePasse())) {

    Map<String, String> error = new HashMap<>();
    error.put("error", "Email ou mot de passe incorrect");
    return ResponseEntity.status(401).body(error);
}
            // ✅ 4. VÉRIFICATION : Si l'utilisateur est bloqué
            if (utilisateur.getEstBloque() != null && utilisateur.getEstBloque()) {
                Map<String, Object> response = new HashMap<>();
                response.put("error", "Votre compte est bloqué. Contactez l'administrateur.");
                response.put("estBloque", true);
                response.put("id", utilisateur.getId());
                response.put("nom", utilisateur.getNom());
                response.put("email", utilisateur.getEmail());
                response.put("role", utilisateur.getRole().name());
                return ResponseEntity.status(403).body(response);
            }
            
            // 5. Générer un token
            String token = "token_" + utilisateur.getId() + "_" + System.currentTimeMillis();
            
            // 6. Construire la réponse
            Map<String, Object> response = new HashMap<>();
            response.put("id", utilisateur.getId());
            response.put("nom", utilisateur.getNom());
            response.put("email", utilisateur.getEmail());
            response.put("role", utilisateur.getRole().name());
            response.put("estBloque", utilisateur.getEstBloque() != null && utilisateur.getEstBloque());
            response.put("token", token);
            response.put("message", "Connexion réussie");
            
            System.out.println("✅ Connexion réussie pour: " + utilisateur.getEmail());
            System.out.println("🔒 Est bloqué: " + (utilisateur.getEstBloque() != null && utilisateur.getEstBloque()));
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Erreur lors de la connexion: " + e.getMessage());
            return ResponseEntity.status(500).body(error);
        }
    }

    // ==================== ENDPOINT POUR COMPATIBILITÉ AVEC /auth/login ====================
    
    @PostMapping("/auth/login")
    public ResponseEntity<?> authLogin(@RequestBody LoginRequest loginRequest) {
        return login(loginRequest);
    }

    // ==================== INNER CLASS ====================
    
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
