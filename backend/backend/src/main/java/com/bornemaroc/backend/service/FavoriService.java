package com.bornemaroc.backend.service;

import com.bornemaroc.backend.entity.Borne;
import com.bornemaroc.backend.entity.Conducteur;
import com.bornemaroc.backend.entity.Favori;
import com.bornemaroc.backend.repository.BorneRepository;
import com.bornemaroc.backend.repository.ConducteurRepository;
import com.bornemaroc.backend.repository.FavoriRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class FavoriService {

    @Autowired
    private FavoriRepository favoriRepository;

    @Autowired
    private ConducteurRepository conducteurRepository;

    @Autowired
    private BorneRepository borneRepository;

    // Zid borne l favoris
    public Favori ajouterFavori(Long conducteurId, Long borneId) {

        // Check wach déjà kayen
        if (favoriRepository.existsByConducteurIdAndBorneId(
                conducteurId, borneId)) {
            throw new RuntimeException("Borne déjà f favoris!");
        }

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

        Favori favori = new Favori();
        favori.setConducteur(conducteur);
        favori.setBorne(borne);

        return favoriRepository.save(favori);
    }

    // Jiب favoris dial conducteur
    public List<Favori> getFavoris(Long conducteurId) {
        return favoriRepository.findByConducteurId(conducteurId);
    }

    // 7yed men favoris
    public void supprimerFavori(Long conducteurId, Long borneId) {
        favoriRepository.deleteByConducteurIdAndBorneId(
                conducteurId, borneId);
    }
}