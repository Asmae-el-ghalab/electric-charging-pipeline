package com.bornemaroc.backend.service;

import com.bornemaroc.backend.entity.Connection;
import com.bornemaroc.backend.repository.ConnectionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
public class ConnectionService {

    @Autowired
    private ConnectionRepository connectionRepository;

    // ============ MÉTHODES EXISTANTES ============
    
    public List<Connection> getConnectionsByBorneId(Long borneId) {
        return connectionRepository.findByStationId(borneId);
    }

    public List<Connection> getConnectionsByBorneIdAndCurrentType(Long borneId, String currentType) {
        return connectionRepository.findByStationIdAndCurrentType(borneId, currentType);
    }

    @Transactional
    public Connection saveConnection(Connection connection) {
        return connectionRepository.save(connection);
    }

    public Connection getConnectionById(Long id) {
        return connectionRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Connection not found with id: " + id));
    }

    @Transactional
    public void deleteConnection(Long id) {
        connectionRepository.deleteById(id);
    }

    public List<Connection> getAllConnections() {
        return connectionRepository.findAll();
    }

    // ============ NOUVELLES MÉTHODES ============
    
    // Méthode pour getConnections(Long borneId) - appelée par ConnectionController
    public List<Connection> getConnections(Long borneId) {
        return connectionRepository.findByStationId(borneId);
    }

    // Méthode pour updateConnection - appelée par ConnectionController
    @Transactional
    public Connection updateConnection(Long id, Connection connectionDetails) {
        Connection existingConnection = getConnectionById(id);
        
        // Mettre à jour les champs
        if (connectionDetails.getConnectionType() != null) {
            existingConnection.setConnectionType(connectionDetails.getConnectionType());
        }
        if (connectionDetails.getPowerKw() != null) {
            existingConnection.setPowerKw(connectionDetails.getPowerKw());
        }
        if (connectionDetails.getQuantity() != null) {
            existingConnection.setQuantity(connectionDetails.getQuantity());
        }
        if (connectionDetails.getVoltage() != null) {
            existingConnection.setVoltage(connectionDetails.getVoltage());
        }
        if (connectionDetails.getAmps() != null) {
            existingConnection.setAmps(connectionDetails.getAmps());
        }
        if (connectionDetails.getLevel() != null) {
            existingConnection.setLevel(connectionDetails.getLevel());
        }
        if (connectionDetails.getCurrentType() != null) {
            existingConnection.setCurrentType(connectionDetails.getCurrentType());
        }
        
        return connectionRepository.save(existingConnection);
    }
}