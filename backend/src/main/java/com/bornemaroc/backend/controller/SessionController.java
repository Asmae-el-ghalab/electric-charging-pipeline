// src/main/java/com/bornemaroc/backend/controller/SessionController.java
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
import org.springframework.web.bind.annotation.RestController;

import com.bornemaroc.backend.entity.SessionRecharge;
import com.bornemaroc.backend.service.SessionService;

@RestController
@RequestMapping("/api/sessions")
@CrossOrigin(origins = "http://localhost:4200")
public class SessionController {

    @Autowired
    private SessionService sessionService;

    /**
     * Démarrer une session de recharge
     * POST /api/sessions/recharge
     */
    @PostMapping("/recharge")
    public ResponseEntity<Map<String, Object>> demarrerRecharge(@RequestBody Map<String, Object> request) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            Long borneId = Long.valueOf(request.get("borneId").toString());
            Long conducteurId = Long.valueOf(request.get("conducteurId").toString());
            
            SessionRecharge session = sessionService.demarrerSession(borneId, conducteurId);
            
            response.put("id", session.getId());
            response.put("borneId", session.getBorneId());
            response.put("conducteurId", session.getConducteurId());
            response.put("dateDebut", session.getDateDebut());
            response.put("status", session.getStatus());
            
            return ResponseEntity.ok(response);
            
        } catch (IllegalStateException e) {
            response.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.CONFLICT).body(response);
            
        } catch (Exception e) {
            response.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    /**
     * Terminer une session
     * PUT /api/sessions/{id}/terminer
     */
    @PutMapping("/{id}/terminer")
    public ResponseEntity<SessionRecharge> terminerSession(@PathVariable Long id) {
        try {
            SessionRecharge session = sessionService.terminerSession(id);
            return ResponseEntity.ok(session);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Annuler une session
     * PUT /api/sessions/{id}/annuler
     */
    @PutMapping("/{id}/annuler")
    public ResponseEntity<SessionRecharge> annulerSession(@PathVariable Long id) {
        try {
            SessionRecharge session = sessionService.annulerSession(id);
            return ResponseEntity.ok(session);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Obtenir une session par ID
     * GET /api/sessions/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<SessionRecharge> getSession(@PathVariable Long id) {
        SessionRecharge session = sessionService.getSessionById(id);
        if (session == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(session);
    }

    /**
     * Obtenir les sessions actives d'un conducteur
     * GET /api/sessions/conducteur/{conducteurId}/active
     */
    @GetMapping("/conducteur/{conducteurId}/active")
    public ResponseEntity<List<SessionRecharge>> getSessionsActives(@PathVariable Long conducteurId) {
        List<SessionRecharge> sessions = sessionService.findActiveSessionsByConducteur(conducteurId);
        return ResponseEntity.ok(sessions);
    }

    /**
     * Obtenir la session active d'une borne
     * GET /api/sessions/borne/{borneId}/active
     */
    @GetMapping("/borne/{borneId}/active")
    public ResponseEntity<SessionRecharge> getSessionActiveParBorne(@PathVariable Long borneId) {
        SessionRecharge session = sessionService.findActiveSessionByBorne(borneId);
        if (session == null) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(session);
    }

    /**
     * Obtenir l'historique des sessions d'un conducteur
     * GET /api/sessions/conducteur/{conducteurId}/historique
     */
    @GetMapping("/conducteur/{conducteurId}/historique")
    public ResponseEntity<List<SessionRecharge>> getHistoriqueSessions(@PathVariable Long conducteurId) {
        List<SessionRecharge> sessions = sessionService.getHistoriqueConducteur(conducteurId);
        return ResponseEntity.ok(sessions);
    }
}