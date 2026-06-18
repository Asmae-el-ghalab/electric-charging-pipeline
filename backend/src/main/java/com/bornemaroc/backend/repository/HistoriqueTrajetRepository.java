package com.bornemaroc.backend.repository;

import com.bornemaroc.backend.entity.HistoriqueTrajet;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface HistoriqueTrajetRepository extends JpaRepository<HistoriqueTrajet, Long> {

    List<HistoriqueTrajet> findByConducteurId(Long conducteurId);

    List<HistoriqueTrajet> findByConducteurIdOrderByDateDebutDesc(Long conducteurId);

    HistoriqueTrajet findByIdAndConducteurId(Long id, Long conducteurId);
}