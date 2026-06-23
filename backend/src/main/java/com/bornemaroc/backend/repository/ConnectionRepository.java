// src/main/java/com/bornemaroc/backend/repository/ConnectionRepository.java
package com.bornemaroc.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.bornemaroc.backend.entity.Connection;

@Repository
public interface ConnectionRepository extends JpaRepository<Connection, Long> {
    
    List<Connection> findByStationId(Long stationId);
    
    List<Connection> findByStationIdOrderByPowerKwDesc(Long stationId);
    
    List<Connection> findByStationIdAndCurrentType(Long stationId, String currentType);
    
    List<Connection> findByStationIdAndConnectionType(Long stationId, String connectionType);
}