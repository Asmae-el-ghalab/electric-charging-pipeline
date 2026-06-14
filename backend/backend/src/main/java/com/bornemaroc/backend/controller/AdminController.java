package com.bornemaroc.backend.controller;

import com.bornemaroc.backend.entity.Borne;
import com.bornemaroc.backend.entity.Conducteur;
import com.bornemaroc.backend.service.AdminService;
import com.bornemaroc.backend.service.BorneService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:4200")
public class AdminController {

    @Autowired
    private AdminService adminService;

    @Autowired
    private BorneService borneService;

    // GET http://localhost:8080/api/admin/statistiques
    @GetMapping("/statistiques")
    public ResponseEntity<Map<String, Object>> getStatistiques() {
        return ResponseEntity.ok(
                adminService.getStatistiques());
    }

    // GET http://localhost:8080/api/admin/conducteurs
    @GetMapping("/conducteurs")
    public List<Conducteur> getAllConducteurs() {
        return adminService.getAllConducteurs();
    }

    // PUT http://localhost:8080/api/admin/conducteurs/1/bloquer
    @PutMapping("/conducteurs/{id}/bloquer")
    public ResponseEntity<Conducteur> bloquerConducteur(
            @PathVariable Long id) {
        return ResponseEntity.ok(
                adminService.bloquerConducteur(id));
    }

    // PUT http://localhost:8080/api/admin/conducteurs/1/debloquer
    @PutMapping("/conducteurs/{id}/debloquer")
    public ResponseEntity<Conducteur> debloquerConducteur(
            @PathVariable Long id) {
        return ResponseEntity.ok(
                adminService.debloquerConducteur(id));
    }

    // POST http://localhost:8080/api/admin/bornes
    @PostMapping("/bornes")
    public ResponseEntity<Borne> addBorne(
            @RequestBody Borne borne) {
        return ResponseEntity.ok(
                borneService.addBorne(borne));
    }

    // DELETE http://localhost:8080/api/admin/bornes/1
    @DeleteMapping("/bornes/{id}")
    public ResponseEntity<Void> deleteBorne(
            @PathVariable Long id) {
        borneService.deleteBorne(id);
        return ResponseEntity.ok().build();
    }
}
