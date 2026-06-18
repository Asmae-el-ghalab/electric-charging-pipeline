// src/main/java/com/bornemaroc/backend/repository/SessionRepository.java
package com.bornemaroc.backend.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.bornemaroc.backend.entity.SessionRecharge;

@Repository
public interface SessionRepository extends JpaRepository<SessionRecharge, Long> {
    
    Optional<SessionRecharge> findByBorneIdAndStatus(Long borneId, String status);
    
    List<SessionRecharge> findByConducteurIdAndStatus(Long conducteurId, String status);
    
    List<SessionRecharge> findByConducteurIdOrderByDateDebutDesc(Long conducteurId);
    
    List<SessionRecharge> findByStatus(String status);
}