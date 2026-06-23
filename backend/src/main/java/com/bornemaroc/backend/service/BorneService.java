// src/main/java/com/bornemaroc/backend/service/BorneService.java
package com.bornemaroc.backend.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.bornemaroc.backend.entity.Borne;
import com.bornemaroc.backend.repository.BorneRepository;

@Service
public class BorneService {
    
    @Autowired
    private BorneRepository borneRepository;
    
    // ============================================================
    // CRUD DE BASE
    // ============================================================
    
    public List<Borne> getAllBornes() {
        return borneRepository.findAll();
    }
    
    public Borne getBorneById(Long id) {
        return borneRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Borne non trouvée avec l'id: " + id));
    }
    
    public Borne addBorne(Borne borne) {
        return borneRepository.save(borne);
    }
    
    public Borne updateStatus(Long id, String status) {
        Borne borne = getBorneById(id);
        borne.setStatus(status);
        return borneRepository.save(borne);
    }
    
    public void deleteBorne(Long id) {
        borneRepository.deleteById(id);
    }
    
    // ============================================================
    // FILTRES
    // ============================================================
    
    public List<Borne> getByStatus(String status) {
        return borneRepository.findByStatus(status);
    }
    
    public List<Borne> getByCity(String city) {
        return borneRepository.findByCity(city);
    }
    
    public List<Borne> getByOperator(String operator) {
        return borneRepository.findByOperator(operator);
    }
    
    // ============================================================
    // RECHERCHE
    // ============================================================
    
    /**
     * Recherche des bornes par texte (titre, adresse, ville)
     */
    public List<Borne> searchBornes(String query) {
        if (query == null || query.trim().isEmpty()) {
            return getAllBornes();
        }
        
        String searchTerm = query.toLowerCase().trim();
        return borneRepository.findAll().stream()
            .filter(borne -> 
                (borne.getTitle() != null && borne.getTitle().toLowerCase().contains(searchTerm)) ||
                (borne.getAddress() != null && borne.getAddress().toLowerCase().contains(searchTerm)) ||
                (borne.getCity() != null && borne.getCity().toLowerCase().contains(searchTerm)) ||
                (borne.getProvince() != null && borne.getProvince().toLowerCase().contains(searchTerm)) ||
                (borne.getOperator() != null && borne.getOperator().toLowerCase().contains(searchTerm))
            )
            .collect(Collectors.toList());
    }
    
    // ============================================================
    // DISPONIBILITÉ
    // ============================================================
    
    /**
     * Récupère les bornes disponibles (opérationnelles et non occupées)
     */
    public List<Borne> getAvailableBornes() {
        return borneRepository.findAll().stream()
            .filter(borne -> 
                "Operational".equals(borne.getStatus()) && 
                (borne.getIsOccupied() == null || !borne.getIsOccupied())
            )
            .collect(Collectors.toList());
    }
    
    /**
     * Vérifie si une borne est disponible
     */
    public boolean isBorneAvailable(Long id) {
        Borne borne = getBorneById(id);
        return "Operational".equals(borne.getStatus()) && 
               (borne.getIsOccupied() == null || !borne.getIsOccupied());
    }
    
    // ============================================================
    // STATISTIQUES
    // ============================================================
    
    /**
     * Récupère le nombre total de bornes
     */
    public long getTotalBornes() {
        return borneRepository.count();
    }
    
    /**
     * Récupère le nombre de bornes opérationnelles
     */
    public long getOperationalBornes() {
        return borneRepository.findByStatus("Operational").size();
    }
    
    /**
     * Récupère le nombre de bornes occupées
     */
    public long getOccupiedBornes() {
        return borneRepository.findAll().stream()
            .filter(b -> b.getIsOccupied() != null && b.getIsOccupied())
            .count();
    }
    
    /**
     * Récupère le nombre de bornes disponibles
     */
    public long getAvailableBornesCount() {
        return getAvailableBornes().size();
    }
}