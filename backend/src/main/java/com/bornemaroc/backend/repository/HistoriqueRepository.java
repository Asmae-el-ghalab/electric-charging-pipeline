package com.bornemaroc.backend.repository;

import com.bornemaroc.backend.entity.Historique;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface HistoriqueRepository
        extends JpaRepository<Historique, Long> {

    List<Historique> findByConducteurId(Long conducteurId);
    List<Historique> findByBorneId(Long borneId);
}