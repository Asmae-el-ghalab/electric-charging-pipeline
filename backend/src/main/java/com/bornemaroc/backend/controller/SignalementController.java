// src/main/java/com/bornemaroc/backend/controller/SignalementController.java
package com.bornemaroc.backend.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.bornemaroc.backend.entity.Signalement;
import com.bornemaroc.backend.service.SignalementService;

@RestController
@RequestMapping("/api/signalements")
@CrossOrigin(origins = "http://localhost:4200")
public class SignalementController {

    @Autowired
    private SignalementService signalementService;

    @PostMapping
    public ResponseEntity<?> signalerBorne(@RequestBody Map<String, String> body) {
        try {
            System.out.println("📝 =========================================");
            System.out.println("📝 Requête de signalement reçue");
            System.out.println("📝 Body: " + body);
            System.out.println("📝 =========================================");
            
            // ✅ Extraire les données
            String conducteurIdStr = body.get("conducteurId");
            String borneIdStr = body.get("borneId");
            String type = body.get("type");
            String description = body.get("description");
            
            // ✅ Validation
            if (conducteurIdStr == null || borneIdStr == null || type == null || type.isEmpty()) {
                Map<String, String> error = new HashMap<>();
                error.put("error", "Données incomplètes: conducteurId, borneId et type sont requis");
                return ResponseEntity.badRequest().body(error);
            }
            
            Long conducteurId = Long.parseLong(conducteurIdStr);
            Long borneId = Long.parseLong(borneIdStr);
            
            // ✅ Appeler le service
            Signalement signalement = signalementService.signalerBorne(conducteurId, borneId, type, description);
            
            return ResponseEntity.status(HttpStatus.CREATED).body(signalement);
            
        } catch (NumberFormatException e) {
            System.err.println("❌ Erreur de format: " + e.getMessage());
            Map<String, String> error = new HashMap<>();
            error.put("error", "Les IDs doivent être des nombres valides");
            return ResponseEntity.badRequest().body(error);
            
        } catch (RuntimeException e) {
            System.err.println("❌ " + e.getMessage());
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
            
        } catch (Exception e) {
            System.err.println("❌ Erreur: " + e.getMessage());
            e.printStackTrace();
            
            Map<String, String> error = new HashMap<>();
            error.put("error", "Erreur interne du serveur");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    @GetMapping
    public ResponseEntity<?> getAllSignalements() {
        try {
            List<Signalement> signalements = signalementService.getAllSignalements();
            return ResponseEntity.ok(signalements);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    @GetMapping("/attente")
    public ResponseEntity<?> getSignalementsEnAttente() {
        try {
            List<Signalement> signalements = signalementService.getSignalementsEnAttente();
            return ResponseEntity.ok(signalements);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    @GetMapping("/conducteur/{conducteurId}")
    public ResponseEntity<?> getSignalementsByConducteur(@PathVariable Long conducteurId) {
        try {
            List<Signalement> signalements = signalementService.getSignalementsByConducteur(conducteurId);
            return ResponseEntity.ok(signalements);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    @PutMapping("/{id}/traiter")
    public ResponseEntity<?> traiterSignalement(
            @PathVariable Long id, 
            @RequestParam String statut) {
        try {
            Signalement signalement = signalementService.traiterSignalement(id, statut);
            return ResponseEntity.ok(signalement);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    } 
    @GetMapping("/stats")
public ResponseEntity<Map<String, Object>> getStats() {

    List<Signalement> list = signalementService.getAllSignalements();

    long total = list.size();

    long attente = list.stream()
            .filter(s -> "EN_ATTENTE".equalsIgnoreCase(s.getStatut()))
            .count();

    long traite = list.stream()
            .filter(s -> "TRAITE".equalsIgnoreCase(s.getStatut()))
            .count();

    long refuse = list.stream()
            .filter(s -> "REFUSE".equalsIgnoreCase(s.getStatut()))
            .count();

    Map<String, Object> stats = new HashMap<>();

    stats.put("total", total);
    stats.put("attente", attente);
    stats.put("traite", traite);
    stats.put("refuse", refuse);

    return ResponseEntity.ok(stats);

}
}