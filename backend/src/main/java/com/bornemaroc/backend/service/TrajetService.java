// src/main/java/com/bornemaroc/backend/service/TrajetService.java
package com.bornemaroc.backend.service;

import com.bornemaroc.backend.entity.Trajet;
import com.bornemaroc.backend.entity.Borne;
import com.bornemaroc.backend.entity.SessionRecharge;
import com.bornemaroc.backend.repository.TrajetRepository;
import com.bornemaroc.backend.repository.BorneRepository;
import com.bornemaroc.backend.repository.SessionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.HashMap;      // ✅ Ajouter
import java.util.List;
import java.util.Map;          // ✅ Ajouter

@Service
public class TrajetService {

    @Autowired
    private TrajetRepository trajetRepository;

    @Autowired
    private BorneRepository borneRepository;

    @Autowired
    private SessionRepository sessionRepository;

    /**
     * Créer un trajet à partir d'une session de recharge
     */
    @Transactional
    public Trajet creerTrajetDepuisSession(Long sessionId) {
        SessionRecharge session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new RuntimeException("Session non trouvée"));

        Borne borne = borneRepository.findById(session.getBorneId())
                .orElse(null);

        Trajet trajet = new Trajet();
        trajet.setConducteurId(session.getConducteurId());
        trajet.setBorneId(session.getBorneId());
        trajet.setDateDebut(session.getDateDebut());
        trajet.setStatus("EN_COURS");

        if (borne != null) {
            trajet.setBorneNom(borne.getTitle());
            trajet.setVilleDepart(borne.getCity());
            trajet.setVilleArrivee(borne.getCity());
        }

        // Calculer la distance estimée (exemple: 50km par heure de recharge)
        if (session.getDuree() != null) {
            double distance = session.getDuree() * 0.8; // 0.8 km par minute
            trajet.setDistanceKm(Math.round(distance * 10) / 10.0);
        }

        if (session.getConsommation() != null) {
            trajet.setConsommationKwh(session.getConsommation());
        }

        if (session.getMontantTotal() != null) {
            trajet.setCoutTotal(session.getMontantTotal());
        }

        return trajetRepository.save(trajet);
    }

    /**
     * Terminer un trajet
     */
    @Transactional
    public Trajet terminerTrajet(Long trajetId, Double distanceReelle, String villeArrivee) {
        Trajet trajet = trajetRepository.findById(trajetId)
                .orElseThrow(() -> new RuntimeException("Trajet non trouvé"));

        trajet.setDateFin(LocalDateTime.now());
        trajet.setStatus("TERMINE");

        if (distanceReelle != null) {
            trajet.setDistanceKm(distanceReelle);
        }

        if (villeArrivee != null) {
            trajet.setVilleArrivee(villeArrivee);
        }

        // Calculer la durée en minutes
        long duree = ChronoUnit.MINUTES.between(trajet.getDateDebut(), trajet.getDateFin());
        trajet.setDureeMinutes((int) duree);

        return trajetRepository.save(trajet);
    }

    /**
     * Annuler un trajet
     */
    @Transactional
    public Trajet annulerTrajet(Long trajetId) {
        Trajet trajet = trajetRepository.findById(trajetId)
                .orElseThrow(() -> new RuntimeException("Trajet non trouvé"));
        trajet.setStatus("ANNULE");
        trajet.setDateFin(LocalDateTime.now());
        return trajetRepository.save(trajet);
    }

    /**
     * Récupérer tous les trajets d'un conducteur
     */
    public List<Trajet> getTrajetsByConducteur(Long conducteurId) {
        return trajetRepository.findByConducteurIdOrderByDateDebutDesc(conducteurId);
    }

    /**
     * Récupérer les trajets d'un conducteur par statut
     */
    public List<Trajet> getTrajetsByConducteurAndStatus(Long conducteurId, String status) {
        return trajetRepository.findByConducteurIdAndStatusOrderByDateDebutDesc(conducteurId, status);
    }

    /**
     * Récupérer les trajets d'un conducteur entre deux dates
     */
    public List<Trajet> getTrajetsByConducteurAndDateRange(Long conducteurId, LocalDateTime debut, LocalDateTime fin) {
        return trajetRepository.findByConducteurIdAndDateDebutBetween(conducteurId, debut, fin);
    }

    /**
     * Récupérer un trajet par son ID
     */
    public Trajet getTrajetById(Long id) {
        return trajetRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Trajet non trouvé"));
    }

    /**
     * Mettre à jour un trajet
     */
    @Transactional
    public Trajet updateTrajet(Trajet trajet) {
        return trajetRepository.save(trajet);
    }

    /**
     * Statistiques des trajets d'un conducteur
     */
    public Map<String, Object> getStatistiques(Long conducteurId) {
        List<Trajet> trajets = trajetRepository.findByConducteurId(conducteurId);

        Map<String, Object> stats = new HashMap<>();
        stats.put("total", trajets.size());
        stats.put("termines", trajets.stream().filter(t -> "TERMINE".equals(t.getStatus())).count());
        stats.put("enCours", trajets.stream().filter(t -> "EN_COURS".equals(t.getStatus())).count());
        stats.put("annules", trajets.stream().filter(t -> "ANNULE".equals(t.getStatus())).count());

        double distanceTotale = trajets.stream()
                .filter(t -> t.getDistanceKm() != null)
                .mapToDouble(Trajet::getDistanceKm)
                .sum();
        stats.put("distanceTotale", Math.round(distanceTotale * 10) / 10.0);

        double coutTotal = trajets.stream()
                .filter(t -> t.getCoutTotal() != null)
                .mapToDouble(Trajet::getCoutTotal)
                .sum();
        stats.put("coutTotal", Math.round(coutTotal * 100) / 100.0);

        // Ajouter la durée totale
        int dureeTotale = trajets.stream()
                .filter(t -> t.getDureeMinutes() != null)
                .mapToInt(Trajet::getDureeMinutes)
                .sum();
        stats.put("dureeTotale", dureeTotale);

        return stats;
    }
}