package com.bornemaroc.backend.service;

import com.bornemaroc.backend.entity.Borne;
import com.bornemaroc.backend.entity.Conducteur;
import com.bornemaroc.backend.entity.Historique;
import com.bornemaroc.backend.repository.BorneRepository;
import com.bornemaroc.backend.repository.ConducteurRepository;
import com.bornemaroc.backend.repository.HistoriqueRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.Date;
import java.util.List;

@Service
public class HistoriqueService {

    @Autowired
    private HistoriqueRepository historiqueRepository;

    @Autowired
    private ConducteurRepository conducteurRepository;

    @Autowired
    private BorneRepository borneRepository;

    // Enregistrer visite
    public Historique ajouterHistorique(Long conducteurId,
                                        Long borneId) {
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

        Historique historique = new Historique();
        historique.setConducteur(conducteur);
        historique.setBorne(borne);
        historique.setDateVisite(new Date());

        return historiqueRepository.save(historique);
    }

    // Jiب historique dial conducteur
    public List<Historique> getHistorique(Long conducteurId) {
        return historiqueRepository
                .findByConducteurId(conducteurId);
    }
}