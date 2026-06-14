package com.bornemaroc.backend.controller;

import com.bornemaroc.backend.entity.Borne;
import com.bornemaroc.backend.repository.BorneRepository;
import com.bornemaroc.backend.service.BorneService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/bornes")
@CrossOrigin(origins = "http://localhost:4200")
public class BorneController {

    @Autowired
    private BorneService borneService;

    @Autowired
    private BorneRepository borneRepository;

    // GET http://localhost:8080/api/bornes?page=0&size=20
    @GetMapping
    public ResponseEntity<Page<Borne>> getAllBornes(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(borneRepository.findAll(pageable));
    }

    // GET http://localhost:8080/api/bornes/191005
    @GetMapping("/{id}")
    public ResponseEntity<Borne> getBorneById(
            @PathVariable Long id) {
        return ResponseEntity.ok(borneService.getBorneById(id));
    }

    // POST http://localhost:8080/api/bornes
    @PostMapping
    public ResponseEntity<Borne> addBorne(
            @RequestBody Borne borne) {
        return ResponseEntity.ok(borneService.addBorne(borne));
    }

    // PUT http://localhost:8080/api/bornes/191005/status?status=Operational
    @PutMapping("/{id}/status")
    public ResponseEntity<Borne> updateStatus(
            @PathVariable Long id,
            @RequestParam String status) {
        return ResponseEntity.ok(borneService.updateStatus(id, status));
    }

    // DELETE http://localhost:8080/api/bornes/191005
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBorne(
            @PathVariable Long id) {
        borneService.deleteBorne(id);
        return ResponseEntity.ok().build();
    }

    // GET http://localhost:8080/api/bornes/filter?status=Operational
    // GET http://localhost:8080/api/bornes/filter?city=Casablanca
    // GET http://localhost:8080/api/bornes/filter?operator=Fastvolt
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