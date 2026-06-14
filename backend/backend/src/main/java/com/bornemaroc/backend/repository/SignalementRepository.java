package com.bornemaroc.backend.repository;

import com.bornemaroc.backend.entity.Signalement;
import com.bornemaroc.backend.enums.StatutTraitement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface SignalementRepository
        extends JpaRepository<Signalement, Long> {

    List<Signalement> findByStatut(StatutTraitement statut);
    List<Signalement> findByConducteurId(Long conducteurId);
    List<Signalement> findByBorneId(Long borneId);
}