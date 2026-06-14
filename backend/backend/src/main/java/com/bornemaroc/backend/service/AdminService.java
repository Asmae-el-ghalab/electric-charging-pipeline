package com.bornemaroc.backend.service;

import com.bornemaroc.backend.entity.Borne;
import com.bornemaroc.backend.entity.Conducteur;
import com.bornemaroc.backend.repository.BorneRepository;
import com.bornemaroc.backend.repository.ConducteurRepository;
import com.bornemaroc.backend.repository.SignalementRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class AdminService {

    @Autowired
    private BorneRepository borneRepository;

    @Autowired
    private ConducteurRepository conducteurRepository;

    @Autowired
    private SignalementRepository signalementRepository;

    // Statistiques globales
    public Map<String, Object> getStatistiques() {
        Map<String, Object> stats = new HashMap<>();

        // Total bornes
        stats.put("totalBornes", borneRepository.count());

        // B HADI:
        stats.put("bornesDisponibles",
                borneRepository.findByStatus("Operational").size()
        );

        stats.put("bornesOccupees",
                borneRepository.findByStatus("Not Operational").size()
        );

        stats.put("bornesHorsService",
                borneRepository.findByStatus("Unknown").size()
        );

        // Total conducteurs
        stats.put("totalConducteurs",
                conducteurRepository.count()
        );

        // Conducteurs bloques
        stats.put("conducteursBloques",
                conducteurRepository.findByEstBloque(true).size()
        );

        // Total signalements
        stats.put("totalSignalements",
                signalementRepository.count()
        );

        // Signalements en attente
        stats.put("signalementsEnAttente",
                signalementRepository.findByStatut(
                        com.bornemaroc.backend.enums.StatutTraitement.EN_ATTENTE
                ).size()
        );

        return stats;
    }

    // Bloquer conducteur
    public Conducteur bloquerConducteur(Long id) {
        Conducteur conducteur = conducteurRepository
                .findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Conducteur mkaynach!")
                );
        conducteur.setEstBloque(true);
        return conducteurRepository.save(conducteur);
    }

    // Débloquer conducteur
    public Conducteur debloquerConducteur(Long id) {
        Conducteur conducteur = conducteurRepository
                .findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Conducteur mkaynach!")
                );
        conducteur.setEstBloque(false);
        return conducteurRepository.save(conducteur);
    }

    // Liste conducteurs
    public List<Conducteur> getAllConducteurs() {
        return conducteurRepository.findAll();
    }

    // Liste bornes
    public List<Borne> getAllBornes() {
        return borneRepository.findAll();
    }
}
