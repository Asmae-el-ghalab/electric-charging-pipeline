// ConducteurController.java
package com.bornemaroc.backend.controller;

import com.bornemaroc.backend.entity.Conducteur;
import com.bornemaroc.backend.entity.HistoriqueTrajet;
import com.bornemaroc.backend.entity.Notification;
import com.bornemaroc.backend.entity.Vehicule;
import com.bornemaroc.backend.service.ConducteurService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/conducteur")
@CrossOrigin(origins = "http://localhost:4200", allowCredentials = "true")
public class ConducteurController {

    @Autowired
    private ConducteurService conducteurService;

    // Profil
    @GetMapping("/profil/{id}")
    public ResponseEntity<Conducteur> getProfil(@PathVariable Long id) {
        return ResponseEntity.ok(conducteurService.getConducteurById(id));
    }

    @PutMapping("/profil/{id}")
    public ResponseEntity<Conducteur> updateProfil(@PathVariable Long id, @RequestBody Conducteur conducteur) {
        return ResponseEntity.ok(conducteurService.updateConducteur(id, conducteur));
    }

    // Statistiques
    @GetMapping("/statistiques/{id}")
    public ResponseEntity<Map<String, Object>> getMesStatistiques(@PathVariable Long id) {
        return ResponseEntity.ok(conducteurService.getMesStatistiques(id));
    }

    // Trajets
    @GetMapping("/trajets/{id}")
    public ResponseEntity<List<HistoriqueTrajet>> getMesTrajets(@PathVariable Long id) {
        return ResponseEntity.ok(conducteurService.getTrajetsByConducteur(id));
    }

    @GetMapping("/trajets/{conducteurId}/{trajetId}")
    public ResponseEntity<HistoriqueTrajet> getTrajetDetail(
            @PathVariable Long conducteurId,
            @PathVariable Long trajetId) {
        return ResponseEntity.ok(conducteurService.getTrajetDetail(conducteurId, trajetId));
    }

    // Véhicules
    @GetMapping("/vehicules/{id}")
    public ResponseEntity<List<Vehicule>> getMesVehicules(@PathVariable Long id) {
        return ResponseEntity.ok(conducteurService.getVehiculesByConducteur(id));
    }

    @PostMapping("/vehicules/{conducteurId}")
    public ResponseEntity<Vehicule> addVehicule(@PathVariable Long conducteurId, @RequestBody Vehicule vehicule) {
        return ResponseEntity.ok(conducteurService.addVehicule(conducteurId, vehicule));
    }

    @DeleteMapping("/vehicules/{vehiculeId}")
    public ResponseEntity<Void> deleteVehicule(@PathVariable Long vehiculeId) {
        conducteurService.deleteVehicule(vehiculeId);
        return ResponseEntity.ok().build();
    }

    // Notifications
    @GetMapping("/notifications/{id}")
    public ResponseEntity<List<Notification>> getMesNotifications(@PathVariable Long id) {
        return ResponseEntity.ok(conducteurService.getNotificationsByConducteur(id));
    }

    @PutMapping("/notifications/{notificationId}/lire")
    public ResponseEntity<Notification> marquerNotificationLue(@PathVariable Long notificationId) {
        return ResponseEntity.ok(conducteurService.marquerNotificationLue(notificationId));
    }
}