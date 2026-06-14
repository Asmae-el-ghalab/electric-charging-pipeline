package com.bornemaroc.backend.controller;

import com.bornemaroc.backend.entity.Signalement;
import com.bornemaroc.backend.enums.StatutTraitement;
import com.bornemaroc.backend.enums.TypeSignalement;
import com.bornemaroc.backend.service.SignalementService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/signalements")
@CrossOrigin(origins = "http://localhost:4200")
public class SignalementController {

    @Autowired
    private SignalementService signalementService;

    // POST http://localhost:8080/api/signalements
    // Body: {"conducteurId":1, "borneId":2,
    //        "type":"PANNE", "description":"..."}
    @PostMapping
    public ResponseEntity<Signalement> signalerBorne(
            @RequestBody Map<String, String> body) {
        Signalement s = signalementService.signalerBorne(
                Long.parseLong(body.get("conducteurId")),
                Long.parseLong(body.get("borneId")),
                TypeSignalement.valueOf(body.get("type")),
                body.get("description")
        );
        return ResponseEntity.ok(s);
    }

    // GET http://localhost:8080/api/signalements
    @GetMapping
    public List<Signalement> getAllSignalements() {
        return signalementService.getAllSignalements();
    }

    // GET http://localhost:8080/api/signalements/attente
    @GetMapping("/attente")
    public List<Signalement> getSignalementsEnAttente() {
        return signalementService.getSignalementsEnAttente();
    }

    // PUT http://localhost:8080/api/signalements/1/traiter?statut=RESOLU
    @PutMapping("/{id}/traiter")
    public ResponseEntity<Signalement> traiterSignalement(
            @PathVariable Long id,
            @RequestParam StatutTraitement statut) {
        return ResponseEntity.ok(
                signalementService.traiterSignalement(id, statut));
    }
}