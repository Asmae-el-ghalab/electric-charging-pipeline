package com.bornemaroc.backend.repository;

import com.bornemaroc.backend.entity.Favori;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface FavoriRepository
        extends JpaRepository<Favori, Long> {

    List<Favori> findByConducteurId(Long conducteurId);
    boolean existsByConducteurIdAndBorneId(Long conducteurId, Long borneId);
    void deleteByConducteurIdAndBorneId(Long conducteurId, Long borneId);
}