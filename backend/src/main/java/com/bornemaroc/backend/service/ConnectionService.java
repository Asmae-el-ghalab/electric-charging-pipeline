// src/main/java/com/bornemaroc/backend/service/ConnectionService.java
package com.bornemaroc.backend.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.bornemaroc.backend.entity.Connection;
import com.bornemaroc.backend.repository.ConnectionRepository;

@Service
public class ConnectionService {
    
    @Autowired
    private ConnectionRepository connectionRepository;
    
    public List<Connection> getConnectionsByBorneId(Long borneId) {
        return connectionRepository.findByStationId(borneId);
    }
    
    public List<Connection> getConnectionsByBorneIdOrdered(Long borneId) {
        return connectionRepository.findByStationIdOrderByPowerKwDesc(borneId);
    }
    
    public List<Connection> getConnectionsByBorneIdAndCurrentType(Long borneId, String currentType) {
        return connectionRepository.findByStationIdAndCurrentType(borneId, currentType);
    }
    
    public List<Connection> getConnectionsByBorneIdAndType(Long borneId, String connectionType) {
        return connectionRepository.findByStationIdAndConnectionType(borneId, connectionType);
    }
    
    public Connection saveConnection(Connection connection) {
        return connectionRepository.save(connection);
    }
    
    public void deleteConnection(Long id) {
        connectionRepository.deleteById(id);
    }
    
    public Connection getConnectionById(Long id) {
        return connectionRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Connection non trouvée avec l'id: " + id));
    }
}