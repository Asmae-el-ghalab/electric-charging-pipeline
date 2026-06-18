// src/main/java/com/bornemaroc/backend/service/SessionService.java
package com.bornemaroc.backend.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.bornemaroc.backend.entity.Borne;
import com.bornemaroc.backend.entity.SessionRecharge;
import com.bornemaroc.backend.repository.BorneRepository;
import com.bornemaroc.backend.repository.SessionRepository;

@Service
public class SessionService {

    @Autowired
    private SessionRepository sessionRepository;

    @Autowired
    private BorneRepository borneRepository;

    @Autowired
    private BorneService borneService;

    /**
     * Trouver une session active par borne
     */
    public SessionRecharge findActiveSessionByBorne(Long borneId) {
        return sessionRepository.findByBorneIdAndStatus(borneId, "ACTIVE").orElse(null);
    }

    /**
     * Trouver les sessions actives d'un conducteur
     */
    public List<SessionRecharge> findActiveSessionsByConducteur(Long conducteurId) {
        return sessionRepository.findByConducteurIdAndStatus(conducteurId, "ACTIVE");
    }

    /**
     * Obtenir une session par ID
     */
    public SessionRecharge getSessionById(Long id) {
        return sessionRepository.findById(id).orElse(null);
    }

    /**
     * Démarrer une session
     */
    @Transactional
    public SessionRecharge demarrerSession(Long borneId, Long conducteurId) {
        // 1. Vérifier si la borne existe
        Borne borne = borneService.getBorneById(borneId);
        if (borne == null) {
            throw new RuntimeException("Borne non trouvée");
        }

        // 2. Vérifier si la borne est disponible
        if (borne.getIsOccupied() != null && borne.getIsOccupied()) {
            throw new IllegalStateException("Borne déjà occupée");
        }

        // 3. Vérifier si la borne est opérationnelle
        if (!"Operational".equals(borne.getStatus())) {
            throw new IllegalStateException("Borne non opérationnelle");
        }

        // 4. Créer la session
        SessionRecharge session = new SessionRecharge();
        session.setBorneId(borneId);
        session.setConducteurId(conducteurId);
        session.setDateDebut(LocalDateTime.now());
        session.setStatus("ACTIVE");

        // 5. Sauvegarder la session
        SessionRecharge savedSession = sessionRepository.save(session);

        // 6. Mettre à jour la borne
        borne.setIsOccupied(true);
        borne.setSessionId(savedSession.getId());
        borneRepository.save(borne);

        return savedSession;
    }

    /**
     * Terminer une session
     */
    @Transactional
    public SessionRecharge terminerSession(Long sessionId) {
        // 1. Récupérer la session
        SessionRecharge session = getSessionById(sessionId);
        if (session == null) {
            throw new RuntimeException("Session non trouvée");
        }

        // 2. Vérifier si la session est active
        if (!"ACTIVE".equals(session.getStatus())) {
            throw new IllegalStateException("Session déjà terminée");
        }

        // 3. Mettre à jour la session
        session.setDateFin(LocalDateTime.now());
        session.setStatus("TERMINEE");
        
        // Calculer la durée en minutes
        long dureeMinutes = java.time.Duration.between(session.getDateDebut(), session.getDateFin()).toMinutes();
        session.setDuree((int) dureeMinutes);

        // 4. Sauvegarder la session
        SessionRecharge savedSession = sessionRepository.save(session);

        // 5. Libérer la borne
        Borne borne = borneService.getBorneById(session.getBorneId());
        if (borne != null) {
            borne.setIsOccupied(false);
            borne.setSessionId(null);
            borneRepository.save(borne);
        }

        return savedSession;
    }

    /**
     * Annuler une session
     */
    @Transactional
    public SessionRecharge annulerSession(Long sessionId) {
        SessionRecharge session = getSessionById(sessionId);
        if (session == null) {
            throw new RuntimeException("Session non trouvée");
        }

        session.setStatus("ANNULEE");
        SessionRecharge savedSession = sessionRepository.save(session);

        // Libérer la borne
        Borne borne = borneService.getBorneById(session.getBorneId());
        if (borne != null) {
            borne.setIsOccupied(false);
            borne.setSessionId(null);
            borneRepository.save(borne);
        }

        return savedSession;
    }

    /**
     * Obtenir l'historique des sessions d'un conducteur
     */
    public List<SessionRecharge> getHistoriqueConducteur(Long conducteurId) {
        return sessionRepository.findByConducteurIdOrderByDateDebutDesc(conducteurId);
    }
}