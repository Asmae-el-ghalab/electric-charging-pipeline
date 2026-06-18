// src/main/java/com/bornemaroc/backend/service/AdminService.java
package com.bornemaroc.backend.service;

import com.bornemaroc.backend.entity.Conducteur;
import com.bornemaroc.backend.entity.Signalement;
import com.bornemaroc.backend.entity.Utilisateur;
import com.bornemaroc.backend.entity.SessionRecharge;
import com.bornemaroc.backend.repository.ConducteurRepository;
import com.bornemaroc.backend.repository.SignalementRepository;
import com.bornemaroc.backend.repository.UtilisateurRepository;
import com.bornemaroc.backend.repository.SessionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class AdminService {

    @Autowired
    private SignalementRepository signalementRepository;

    @Autowired
    private UtilisateurRepository utilisateurRepository;

    @Autowired
    private ConducteurRepository conducteurRepository;

    @Autowired
    private SessionRepository sessionRepository;

    // ========== GESTION DES SIGNALEMENTS ==========

    public List<Signalement> getAllSignalements() {
        return signalementRepository.findAll();
    }

    public List<Signalement> getSignalementsEnAttente() {
        return signalementRepository.findByStatut("EN_ATTENTE");
    }

    public Signalement traiterSignalement(Long id, String statut) {
        Signalement signalement = signalementRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Signalement non trouvé"));
        signalement.setStatut(statut);
        return signalementRepository.save(signalement);
    }

    // ========== GESTION DES CONDUCTEURS ==========

    public List<Conducteur> getAllConducteurs() {
        return conducteurRepository.findAll();
    }

    public void bloquerConducteur(Long id) {
        Conducteur conducteur = conducteurRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Conducteur non trouvé"));
        conducteur.setEstBloque(true);
        conducteurRepository.save(conducteur);
        
        // Mettre à jour aussi dans Utilisateur
        Utilisateur utilisateur = utilisateurRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));
        utilisateur.setEstBloque(true);
        utilisateurRepository.save(utilisateur);
    }

    public void debloquerConducteur(Long id) {
        Conducteur conducteur = conducteurRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Conducteur non trouvé"));
        conducteur.setEstBloque(false);
        conducteurRepository.save(conducteur);
        
        // Mettre à jour aussi dans Utilisateur
        Utilisateur utilisateur = utilisateurRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));
        utilisateur.setEstBloque(false);
        utilisateurRepository.save(utilisateur);
    }

    // ========== GESTION DES UTILISATEURS ==========

    public List<Utilisateur> getAllUtilisateurs() {
        return utilisateurRepository.findAll();
    }

    public Utilisateur getUtilisateurById(Long id) {
        return utilisateurRepository.findById(id).orElse(null);
    }

    public void bloquerUtilisateur(Long id) {
        Utilisateur utilisateur = utilisateurRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));
        utilisateur.setEstBloque(true);
        utilisateurRepository.save(utilisateur);
    }

    public void debloquerUtilisateur(Long id) {
        Utilisateur utilisateur = utilisateurRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));
        utilisateur.setEstBloque(false);
        utilisateurRepository.save(utilisateur);
    }

    // ========== STATISTIQUES ==========

    public Map<String, Object> getStatistiques() {
        Map<String, Object> stats = new HashMap<>();
        
        long totalUtilisateurs = utilisateurRepository.count();
        long totalConducteurs = conducteurRepository.count();
        long totalSignalements = signalementRepository.count();
        long signalementsEnAttente = signalementRepository.findByStatut("EN_ATTENTE").size();
        
        stats.put("totalUtilisateurs", totalUtilisateurs);
        stats.put("totalConducteurs", totalConducteurs);
        stats.put("totalSignalements", totalSignalements);
        stats.put("signalementsEnAttente", signalementsEnAttente);
        
        return stats;
    }
}