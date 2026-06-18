// src/main/java/com/bornemaroc/backend/repository/TrajetRepository.java
package com.bornemaroc.backend.repository;

import com.bornemaroc.backend.entity.Trajet;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface TrajetRepository extends JpaRepository<Trajet, Long> {

    List<Trajet> findByConducteurId(Long conducteurId);

    List<Trajet> findByConducteurIdOrderByDateDebutDesc(Long conducteurId);

    List<Trajet> findByConducteurIdAndStatus(Long conducteurId, String status);

    List<Trajet> findByConducteurIdAndDateDebutBetween(Long conducteurId, LocalDateTime debut, LocalDateTime fin);

    List<Trajet> findByConducteurIdAndStatusOrderByDateDebutDesc(Long conducteurId, String status);
}