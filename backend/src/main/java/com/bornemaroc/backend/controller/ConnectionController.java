package com.bornemaroc.backend.service;

import com.bornemaroc.backend.entity.Connection;
import com.bornemaroc.backend.repository.ConnectionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ConnectionService {

    @Autowired
    private ConnectionRepository connectionRepository;

    // Get all connections for a specific borne
    public List<Connection> getConnectionsByBorneId(Long borneId) {
        return connectionRepository.findByBorneId(borneId);
    }

    // Get connections by borne ID and current type
    public List<Connection> getConnectionsByBorneIdAndCurrentType(Long borneId, String currentType) {
        return connectionRepository.findByBorneIdAndCurrentType(borneId, currentType);
    }

    // Save a connection
    @Transactional
    public Connection saveConnection(Connection connection) {
        connection.setDateCreation(LocalDateTime.now());
        return connectionRepository.save(connection);
    }

    // Get connection by ID
    public Connection getConnectionById(Long id) {
        return connectionRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Connection not found with id: " + id));
    }

    // Update a connection
    @Transactional
    public Connection updateConnection(Long id, Connection connectionDetails) {
        Connection existingConnection = getConnectionById(id);
        existingConnection.setStatut(connectionDetails.getStatut());
        existingConnection.setDateModification(LocalDateTime.now());
        return connectionRepository.save(existingConnection);
    }

    // Delete a connection
    @Transactional
    public void deleteConnection(Long id) {
        Connection connection = getConnectionById(id);
        connectionRepository.delete(connection);
    }

    // Get all connections
    public List<Connection> getAllConnections() {
        return connectionRepository.findAll();
    }
}