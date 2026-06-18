package com.bornemaroc.backend.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.bornemaroc.backend.entity.Favori;
import com.bornemaroc.backend.service.FavoriService;

@RestController
@RequestMapping("/api/favoris")
@CrossOrigin(origins = "http://localhost:4200")
public class FavoriController {

    @Autowired
    private FavoriService favoriService;

    // POST http://localhost:8081/api/favoris
    // Body: {"conducteurId":1, "borneId":2}
    @PostMapping
    public ResponseEntity<Favori> ajouterFavori(
            @RequestBody Map<String, String> body) {
        Favori f = favoriService.ajouterFavori(
                Long.parseLong(body.get("conducteurId")),
                Long.parseLong(body.get("borneId"))
        );
        return ResponseEntity.ok(f);
    }

    // GET http://localhost:8081/api/favoris/conducteur/1
    @GetMapping("/conducteur/{conducteurId}")
    public List<Favori> getFavoris(
            @PathVariable Long conducteurId) {
        return favoriService.getFavoris(conducteurId);
    }

    // DELETE http://localhost:8081/api/favoris?conducteurId=1&borneId=2
    @DeleteMapping
    public ResponseEntity<Void> supprimerFavori(
            @RequestParam Long conducteurId,
            @RequestParam Long borneId) {
        favoriService.supprimerFavori(conducteurId, borneId);
        return ResponseEntity.ok().build();
    }
}