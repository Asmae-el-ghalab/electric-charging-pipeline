// src/main/java/com/bornemaroc/backend/repository/SignalementRepository.java
package com.bornemaroc.backend.repository;

import com.bornemaroc.backend.entity.Signalement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SignalementRepository extends JpaRepository<Signalement, Long> {
    
    List<Signalement> findByConducteurId(Long conducteurId);
    
    List<Signalement> findByBorneId(Long borneId);
    
    List<Signalement> findByStatut(String statut);
    
    // ✅ Méthode corrigée - supprimer OrderBy si elle n'existe pas
    // Ou utiliser la méthode existante
}