
package com.bornemaroc.backend.service;

import com.bornemaroc.backend.entity.Borne;
import com.bornemaroc.backend.entity.Conducteur;
import com.bornemaroc.backend.entity.Signalement;
import com.bornemaroc.backend.enums.StatutTraitement;
import com.bornemaroc.backend.enums.TypeSignalement;
import com.bornemaroc.backend.repository.BorneRepository;
import com.bornemaroc.backend.repository.ConducteurRepository;
import com.bornemaroc.backend.repository.SignalementRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.Date;
import java.util.List;

@Service
public class SignalementService {

    @Autowired
    private SignalementRepository signalementRepository;

    @Autowired
    private ConducteurRepository conducteurRepository;

    @Autowired
    private BorneRepository borneRepository;

    // Conducteur ysignali borne
    public Signalement signalerBorne(Long conducteurId,
                                     Long borneId,
                                     TypeSignalement type,
                                     String description) {
        Conducteur conducteur = conducteurRepository
                .findById(conducteurId)
                .orElseThrow(() ->
                        new RuntimeException("Conducteur mkaynach!")
                );

        Borne borne = borneRepository
                .findById(borneId)
                .orElseThrow(() ->
                        new RuntimeException("Borne mkaynach!")
                );

        Signalement signalement = new Signalement();
        signalement.setConducteur(conducteur);
        signalement.setBorne(borne);
        signalement.setType(type);
        signalement.setDescription(description);
        signalement.setDateSignalement(new Date());
        signalement.setStatut(StatutTraitement.EN_ATTENTE);

        return signalementRepository.save(signalement);
    }

    // Admin ychof kolchi signalements
    public List<Signalement> getAllSignalements() {
        return signalementRepository.findAll();
    }

    // Admin ychof signalements EN_ATTENTE
    public List<Signalement> getSignalementsEnAttente() {
        return signalementRepository
                .findByStatut(StatutTraitement.EN_ATTENTE);
    }

    // Admin ytraiti signalement
    public Signalement traiterSignalement(Long id,
                                          StatutTraitement statut) {
        Signalement signalement = signalementRepository
                .findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Signalement mkaynach!")
                );

        signalement.setStatut(statut);
        return signalementRepository.save(signalement);
    }
}