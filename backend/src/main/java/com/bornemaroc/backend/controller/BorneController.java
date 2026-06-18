// src/main/java/com/bornemaroc/backend/controller/BorneController.java
package com.bornemaroc.backend.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
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

import com.bornemaroc.backend.entity.Borne;
import com.bornemaroc.backend.entity.SessionRecharge;
import com.bornemaroc.backend.repository.BorneRepository;
import com.bornemaroc.backend.service.BorneService;
import com.bornemaroc.backend.service.SessionService;

@RestController
@RequestMapping("/api/bornes")
@CrossOrigin(origins = "http://localhost:4200")
public class BorneController {

    @Autowired
    private BorneService borneService;

    @Autowired
    private BorneRepository borneRepository;
    
    @Autowired
    private SessionService sessionService;  // ✅ Ajouter le service des sessions

    // GET http://localhost:8081/api/bornes?page=0&size=20
    @GetMapping
    public ResponseEntity<Page<Borne>> getAllBornes(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(borneRepository.findAll(pageable));
    }

    // GET http://localhost:8081/api/bornes/191005
    @GetMapping("/{id}")
    public ResponseEntity<Borne> getBorneById(
            @PathVariable Long id) {
        return ResponseEntity.ok(borneService.getBorneById(id));
    }

    // ✅ NOUVEAU: Vérifier la disponibilité d'une borne
    // GET http://localhost:8081/api/bornes/191005/disponibilite
    @GetMapping("/{id}/disponibilite")
    public ResponseEntity<Map<String, Object>> verifierDisponibilite(@PathVariable Long id) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            // 1. Récupérer la borne
            Borne borne = borneService.getBorneById(id);
            
            // 2. Vérifier si la borne est opérationnelle
            if (!"Operational".equals(borne.getStatus())) {
                response.put("disponible", false);
                response.put("message", "La borne n'est pas opérationnelle (statut: " + borne.getStatus() + ")");
                return ResponseEntity.ok(response);
            }

            // 3. Vérifier si la borne est occupée
            if (borne.getIsOccupied() != null && borne.getIsOccupied()) {
                response.put("disponible", false);
                response.put("message", "La borne est actuellement occupée");
                
                // Récupérer la session active
                SessionRecharge sessionActive = sessionService.findActiveSessionByBorne(id);
                if (sessionActive != null) {
                    response.put("sessionActive", sessionActive);
                }
                return ResponseEntity.ok(response);
            }

            // 4. La borne est disponible
            response.put("disponible", true);
            response.put("message", "Borne disponible");
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            response.put("disponible", false);
            response.put("message", "Erreur: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    // POST http://localhost:8081/api/bornes
    @PostMapping
    public ResponseEntity<Borne> addBorne(
            @RequestBody Borne borne) {
        return ResponseEntity.ok(borneService.addBorne(borne));
    }

    // PUT http://localhost:8081/api/bornes/191005/status?status=Operational
    @PutMapping("/{id}/status")
    public ResponseEntity<Borne> updateStatus(
            @PathVariable Long id,
            @RequestParam String status) {
        return ResponseEntity.ok(borneService.updateStatus(id, status));
    }

    // ✅ NOUVEAU: Mettre à jour l'occupation d'une borne
    // PUT http://localhost:8081/api/bornes/191005/occupation?occupied=true
    @PutMapping("/{id}/occupation")
    public ResponseEntity<Borne> updateOccupation(
            @PathVariable Long id,
            @RequestParam boolean occupied) {
        Borne borne = borneService.getBorneById(id);
        borne.setIsOccupied(occupied);
        if (!occupied) {
            borne.setSessionId(null);
        }
        return ResponseEntity.ok(borneRepository.save(borne));
    }

    // DELETE http://localhost:8081/api/bornes/191005
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBorne(
            @PathVariable Long id) {
        borneService.deleteBorne(id);
        return ResponseEntity.ok().build();
    }

    // GET http://localhost:8081/api/bornes/filter?status=Operational
    // GET http://localhost:8081/api/bornes/filter?city=Casablanca
    // GET http://localhost:8081/api/bornes/filter?operator=Fastvolt
    @GetMapping("/filter")
    public List<Borne> filterBornes(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String city,
            @RequestParam(required = false) String operator) {
        if (status != null)
            return borneService.getByStatus(status);
        if (city != null)
            return borneService.getByCity(city);
        if (operator != null)
            return borneService.getByOperator(operator);
        return borneService.getAllBornes();
    }
}