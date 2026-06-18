// src/main/java/com/bornemaroc/backend/service/SignalementService.java
package com.bornemaroc.backend.service;

import com.bornemaroc.backend.entity.Borne;
import com.bornemaroc.backend.entity.Signalement;
import com.bornemaroc.backend.repository.BorneRepository;
import com.bornemaroc.backend.repository.SignalementRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class SignalementService {

    @Autowired
    private SignalementRepository signalementRepository;

    @Autowired
    private BorneRepository borneRepository;

    public Signalement signalerBorne(Long conducteurId, Long borneId, String type, String description) {
        System.out.println("📝 =========================================");
        System.out.println("📝 Vérification de la borne: " + borneId);
        
        // ✅ Vérifier si la borne existe
        Borne borne = borneRepository.findById(borneId)
                .orElseThrow(() -> {
                    System.err.println("❌ Borne non trouvée: " + borneId);
                    return new RuntimeException("La borne spécifiée n'existe pas dans notre système. Vérifiez l'ID.");
                });
        
        System.out.println("✅ Borne trouvée: " + borne.getTitle() + " (ID: " + borne.getId() + ")");
        System.out.println("📝 Création du signalement...");
        
        // ✅ Créer le signalement
        Signalement signalement = new Signalement();
        signalement.setConducteurId(conducteurId);
        signalement.setBorneId(borneId);
        signalement.setType(type);
        signalement.setDescription(description);
        signalement.setStatut("EN_ATTENTE");
        signalement.setDateSignalement(LocalDateTime.now());
        
        Signalement saved = signalementRepository.save(signalement);
        System.out.println("✅ Signalement créé avec ID: " + saved.getId());
        System.out.println("📝 =========================================");
        
        return saved;
    }

    public List<Signalement> getAllSignalements() {
        return signalementRepository.findAll();
    }

    public List<Signalement> getSignalementsEnAttente() {
        return signalementRepository.findByStatut("EN_ATTENTE");
    }

    // ✅ Version corrigée - utiliser findByConducteurId et trier manuellement
    public List<Signalement> getSignalementsByConducteur(Long conducteurId) {
        List<Signalement> signalements = signalementRepository.findByConducteurId(conducteurId);
        // Trier par date décroissante
        signalements.sort((s1, s2) -> s2.getDateSignalement().compareTo(s1.getDateSignalement()));
        return signalements;
    }

    public Signalement traiterSignalement(Long id, String statut) {
        Signalement signalement = signalementRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Signalement non trouvé"));
        signalement.setStatut(statut);
        return signalementRepository.save(signalement);
    }
}