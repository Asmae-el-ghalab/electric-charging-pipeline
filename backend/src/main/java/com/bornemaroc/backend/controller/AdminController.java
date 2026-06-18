// src/main/java/com/bornemaroc/backend/controller/AdminController.java
package com.bornemaroc.backend.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.bornemaroc.backend.entity.Conducteur;
import com.bornemaroc.backend.entity.Signalement;
import com.bornemaroc.backend.entity.Utilisateur;
import com.bornemaroc.backend.service.AdminService;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:4200")
public class AdminController {

    @Autowired
    private AdminService adminService;

    // ========== STATISTIQUES ==========

    @GetMapping("/stats")
    public ResponseEntity<?> getStatistiques() {
        try {
            Map<String, Object> stats = adminService.getStatistiques();
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    // ========== GESTION DES CONDUCTEURS ==========

    @GetMapping("/conducteurs")
    public ResponseEntity<?> getAllConducteurs() {
        try {
            List<Conducteur> conducteurs = adminService.getAllConducteurs();
            return ResponseEntity.ok(conducteurs);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    @PutMapping("/conducteurs/{id}/bloquer")
    public ResponseEntity<?> bloquerConducteur(@PathVariable Long id) {
        try {
            // ✅ Appeler la méthode void directement
            adminService.bloquerConducteur(id);
            
            Map<String, String> response = new HashMap<>();
            response.put("message", "Conducteur bloqué avec succès");
            response.put("id", id.toString());
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    @PutMapping("/conducteurs/{id}/debloquer")
    public ResponseEntity<?> debloquerConducteur(@PathVariable Long id) {
        try {
            // ✅ Appeler la méthode void directement
            adminService.debloquerConducteur(id);
            
            Map<String, String> response = new HashMap<>();
            response.put("message", "Conducteur débloqué avec succès");
            response.put("id", id.toString());
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    // ========== GESTION DES SIGNALEMENTS ==========

    @GetMapping("/signalements")
    public ResponseEntity<?> getAllSignalements() {
        try {
            List<Signalement> signalements = adminService.getAllSignalements();
            return ResponseEntity.ok(signalements);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    @GetMapping("/signalements/attente")
    public ResponseEntity<?> getSignalementsEnAttente() {
        try {
            List<Signalement> signalements = adminService.getSignalementsEnAttente();
            return ResponseEntity.ok(signalements);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    @PutMapping("/signalements/{id}/traiter")
    public ResponseEntity<?> traiterSignalement(
            @PathVariable Long id, 
            @RequestParam String statut) {
        try {
            Signalement signalement = adminService.traiterSignalement(id, statut);
            return ResponseEntity.ok(signalement);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    // ========== GESTION DES UTILISATEURS ==========

    @GetMapping("/utilisateurs")
    public ResponseEntity<?> getAllUtilisateurs() {
        try {
            List<Utilisateur> utilisateurs = adminService.getAllUtilisateurs();
            return ResponseEntity.ok(utilisateurs);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    @GetMapping("/utilisateurs/{id}")
    public ResponseEntity<?> getUtilisateurById(@PathVariable Long id) {
        try {
            Utilisateur utilisateur = adminService.getUtilisateurById(id);
            if (utilisateur == null) {
                Map<String, String> error = new HashMap<>();
                error.put("error", "Utilisateur non trouvé");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
            }
            return ResponseEntity.ok(utilisateur);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    @PutMapping("/utilisateurs/{id}/bloquer")
    public ResponseEntity<?> bloquerUtilisateur(@PathVariable Long id) {
        try {
            adminService.bloquerUtilisateur(id);
            
            Map<String, String> response = new HashMap<>();
            response.put("message", "Utilisateur bloqué avec succès");
            response.put("id", id.toString());
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    @PutMapping("/utilisateurs/{id}/debloquer")
    public ResponseEntity<?> debloquerUtilisateur(@PathVariable Long id) {
        try {
            adminService.debloquerUtilisateur(id);
            
            Map<String, String> response = new HashMap<>();
            response.put("message", "Utilisateur débloqué avec succès");
            response.put("id", id.toString());
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }
}