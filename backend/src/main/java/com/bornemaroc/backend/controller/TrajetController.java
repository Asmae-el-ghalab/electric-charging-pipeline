// src/main/java/com/bornemaroc/backend/controller/TrajetController.java
package com.bornemaroc.backend.controller;

import com.bornemaroc.backend.entity.Trajet;
import com.bornemaroc.backend.service.TrajetService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/conducteur/trajets")
@CrossOrigin(origins = "http://localhost:4200")
public class TrajetController {

    @Autowired
    private TrajetService trajetService;

    /**
     * GET /api/conducteur/trajets/{conducteurId}
     * Récupérer tous les trajets d'un conducteur
     */
    @GetMapping("/{conducteurId}")
    public ResponseEntity<?> getTrajets(@PathVariable Long conducteurId) {
        try {
            List<Trajet> trajets = trajetService.getTrajetsByConducteur(conducteurId);
            return ResponseEntity.ok(trajets);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    /**
     * GET /api/conducteur/trajets/{conducteurId}/status/{status}
     * Récupérer les trajets d'un conducteur par statut
     */
    @GetMapping("/{conducteurId}/status/{status}")
    public ResponseEntity<?> getTrajetsByStatus(
            @PathVariable Long conducteurId,
            @PathVariable String status) {
        try {
            List<Trajet> trajets = trajetService.getTrajetsByConducteurAndStatus(conducteurId, status);
            return ResponseEntity.ok(trajets);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    /**
     * GET /api/conducteur/trajets/{conducteurId}/stats
     * Statistiques des trajets
     */
    @GetMapping("/{conducteurId}/stats")
    public ResponseEntity<?> getStatistiques(@PathVariable Long conducteurId) {
        try {
            Map<String, Object> stats = trajetService.getStatistiques(conducteurId);
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    /**
     * GET /api/conducteur/trajets/{conducteurId}/date
     * Récupérer les trajets entre deux dates
     */
    @GetMapping("/{conducteurId}/date")
    public ResponseEntity<?> getTrajetsByDateRange(
            @PathVariable Long conducteurId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime debut,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime fin) {
        try {
            List<Trajet> trajets = trajetService.getTrajetsByConducteurAndDateRange(conducteurId, debut, fin);
            return ResponseEntity.ok(trajets);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    /**
     * GET /api/conducteur/trajets/detail/{id}
     * Récupérer un trajet par son ID
     */
    @GetMapping("/detail/{id}")
    public ResponseEntity<?> getTrajetById(@PathVariable Long id) {
        try {
            Trajet trajet = trajetService.getTrajetById(id);
            return ResponseEntity.ok(trajet);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
        }
    }

    /**
     * POST /api/conducteur/trajets/from-session/{sessionId}
     * Créer un trajet depuis une session
     */
    @PostMapping("/from-session/{sessionId}")
    public ResponseEntity<?> creerTrajetDepuisSession(@PathVariable Long sessionId) {
        try {
            Trajet trajet = trajetService.creerTrajetDepuisSession(sessionId);
            return ResponseEntity.status(HttpStatus.CREATED).body(trajet);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    /**
     * PUT /api/conducteur/trajets/{id}/terminer
     * Terminer un trajet
     */
    @PutMapping("/{id}/terminer")
    public ResponseEntity<?> terminerTrajet(
            @PathVariable Long id,
            @RequestBody Map<String, Object> body) {
        try {
            Double distance = body.get("distance") != null ? 
                    Double.valueOf(body.get("distance").toString()) : null;
            String villeArrivee = body.get("villeArrivee") != null ? 
                    body.get("villeArrivee").toString() : null;
            
            Trajet trajet = trajetService.terminerTrajet(id, distance, villeArrivee);
            return ResponseEntity.ok(trajet);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    /**
     * PUT /api/conducteur/trajets/{id}/annuler
     * Annuler un trajet
     */
    @PutMapping("/{id}/annuler")
    public ResponseEntity<?> annulerTrajet(@PathVariable Long id) {
        try {
            Trajet trajet = trajetService.annulerTrajet(id);
            return ResponseEntity.ok(trajet);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }
}