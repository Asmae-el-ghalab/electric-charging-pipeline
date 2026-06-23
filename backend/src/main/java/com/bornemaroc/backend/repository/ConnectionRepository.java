package com.bornemaroc.backend.repository;

import com.bornemaroc.backend.entity.Connection;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ConnectionRepository extends JpaRepository<Connection, Long> {
    
    // Utiliser stationId au lieu de borneId
    List<Connection> findByStationId(Long stationId);
    
    List<Connection> findByStationIdAndCurrentType(Long stationId, String currentType);
}