// src/main/java/com/bornemaroc/backend/controller/BorneController.java
package com.bornemaroc.backend.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.bornemaroc.backend.entity.Borne;
import com.bornemaroc.backend.entity.Connection;
import com.bornemaroc.backend.entity.SessionRecharge;
import com.bornemaroc.backend.repository.BorneRepository;
import com.bornemaroc.backend.service.BorneService;
import com.bornemaroc.backend.service.ConnectionService;
import com.bornemaroc.backend.service.SessionService;

@RestController
@RequestMapping("/api/bornes")
@CrossOrigin(origins = "http://localhost:4200")
public class BorneController {

    @Autowired
    private BorneService borneService;

    @Autowired
    private BorneRepository borneRepository;
    
    @Autowired
    private SessionService sessionService;
    
    @Autowired
    private ConnectionService connectionService;

    // ============================================================
    // 1. GESTION DES BORNES
    // ============================================================

    /**
     * Récupère toutes les bornes avec pagination
     * GET http://localhost:8081/api/bornes?page=0&size=20
     */
    @GetMapping
    public ResponseEntity<Page<Borne>> getAllBornes(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Borne> bornes = borneRepository.findAll(pageable);
        
        // Charger les connections pour chaque borne
        bornes.getContent().forEach(borne -> {
            List<Connection> connections = connectionService.getConnectionsByBorneId(borne.getId());
            borne.setConnections(connections);
        });
        
        return ResponseEntity.ok(bornes);
    }

    /**
     * Récupère une borne par son ID avec ses connections
     * GET http://localhost:8081/api/bornes/191005
     */
    @GetMapping("/{id}")
    public ResponseEntity<Borne> getBorneById(@PathVariable Long id) {
        Borne borne = borneService.getBorneById(id);
        // Charger les connections
        List<Connection> connections = connectionService.getConnectionsByBorneId(id);
        borne.setConnections(connections);
        return ResponseEntity.ok(borne);
    }

    /**
     * Récupère les villes disponibles
     * GET http://localhost:8081/api/bornes/villes
     */
    @GetMapping("/villes")
    public ResponseEntity<List<String>> getVilles() {
        List<String> villes = borneRepository.findAll().stream()
            .map(Borne::getCity)
            .filter(city -> city != null && !city.isEmpty())
            .distinct()
            .sorted()
            .collect(java.util.stream.Collectors.toList());
        return ResponseEntity.ok(villes);
    }

    /**
     * Récupère les opérateurs disponibles
     * GET http://localhost:8081/api/bornes/operateurs
     */
    @GetMapping("/operateurs")
    public ResponseEntity<List<String>> getOperateurs() {
        List<String> operateurs = borneRepository.findAll().stream()
            .map(Borne::getOperator)
            .filter(op -> op != null && !op.isEmpty() && !op.equals("(Unknown Operator)"))
            .distinct()
            .sorted()
            .collect(java.util.stream.Collectors.toList());
        return ResponseEntity.ok(operateurs);
    }

    /**
     * Récupère les statuts disponibles
     * GET http://localhost:8081/api/bornes/status
     */
    @GetMapping("/status")
    public ResponseEntity<List<String>> getStatus() {
        List<String> status = borneRepository.findAll().stream()
            .map(Borne::getStatus)
            .filter(s -> s != null && !s.isEmpty())
            .distinct()
            .sorted()
            .collect(java.util.stream.Collectors.toList());
        return ResponseEntity.ok(status);
    }

    // ============================================================
    // 2. GESTION DES CONNECTIONS
    // ============================================================

    /**
     * Récupère toutes les connections d'une borne
     * GET http://localhost:8081/api/bornes/{id}/connections
     */
    @GetMapping("/{id}/connections")
    public ResponseEntity<List<Connection>> getBorneConnections(@PathVariable Long id) {
        List<Connection> connections = connectionService.getConnectionsByBorneId(id);
        return ResponseEntity.ok(connections);
    }

    /**
     * Récupère les connections DC d'une borne
     * GET http://localhost:8081/api/bornes/{id}/connections/dc
     */
    @GetMapping("/{id}/connections/dc")
    public ResponseEntity<List<Connection>> getDCConnections(@PathVariable Long id) {
        List<Connection> connections = connectionService.getConnectionsByBorneIdAndCurrentType(id, "DC");
        return ResponseEntity.ok(connections);
    }

    /**
     * Récupère les connections AC d'une borne
     * GET http://localhost:8081/api/bornes/{id}/connections/ac
     */
    @GetMapping("/{id}/connections/ac")
    public ResponseEntity<List<Connection>> getACConnections(@PathVariable Long id) {
        List<Connection> connections = connectionService.getConnectionsByBorneIdAndCurrentType(id, "AC (Three-Phase)");
        return ResponseEntity.ok(connections);
    }

    /**
     * Récupère les types de connecteurs uniques d'une borne
     * GET http://localhost:8081/api/bornes/{id}/connections/types
     */
    @GetMapping("/{id}/connections/types")
    public ResponseEntity<List<String>> getConnectionTypes(@PathVariable Long id) {
        List<Connection> connections = connectionService.getConnectionsByBorneId(id);
        List<String> types = connections.stream()
            .map(Connection::getConnectionType)
            .distinct()
            .collect(java.util.stream.Collectors.toList());
        return ResponseEntity.ok(types);
    }

    /**
     * Récupère la puissance maximale d'une borne
     * GET http://localhost:8081/api/bornes/{id}/connections/max-power
     */
    @GetMapping("/{id}/connections/max-power")
    public ResponseEntity<Map<String, Object>> getMaxPower(@PathVariable Long id) {
        List<Connection> connections = connectionService.getConnectionsByBorneId(id);
        Map<String, Object> response = new HashMap<>();
        
        if (connections.isEmpty()) {
            response.put("maxPower", 0);
            response.put("message", "Aucune connection trouvée");
        } else {
            double maxPower = connections.stream()
                .mapToDouble(Connection::getPowerKw)
                .max()
                .orElse(0);
            response.put("maxPower", maxPower);
            response.put("message", "Puissance maximale trouvée");
        }
        
        return ResponseEntity.ok(response);
    }

    /**
     * Récupère le nombre total de connecteurs d'une borne
     * GET http://localhost:8081/api/bornes/{id}/connections/total
     */
    @GetMapping("/{id}/connections/total")
    public ResponseEntity<Map<String, Object>> getTotalConnectors(@PathVariable Long id) {
        List<Connection> connections = connectionService.getConnectionsByBorneId(id);
        Map<String, Object> response = new HashMap<>();
        
        int total = connections.stream()
            .mapToInt(Connection::getQuantity)
            .sum();
        
        response.put("totalConnectors", total);
        response.put("connectionTypes", connections.size());
        return ResponseEntity.ok(response);
    }

    /**
     * Ajoute une connection à une borne
     * POST http://localhost:8081/api/bornes/{id}/connections
     */
    @PostMapping("/{id}/connections")
    public ResponseEntity<Connection> addConnection(
            @PathVariable Long id,
            @RequestBody Connection connection) {
        connection.setStationId(id);
        Connection saved = connectionService.saveConnection(connection);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    /**
     * Met à jour une connection
     * PUT http://localhost:8081/api/bornes/connections/{connectionId}
     */
    @PutMapping("/connections/{connectionId}")
    public ResponseEntity<Connection> updateConnection(
            @PathVariable Long connectionId,
            @RequestBody Connection connection) {
        Connection existing = connectionService.getConnectionById(connectionId);
        existing.setConnectionType(connection.getConnectionType());
        existing.setPowerKw(connection.getPowerKw());
        existing.setQuantity(connection.getQuantity());
        existing.setVoltage(connection.getVoltage());
        existing.setAmps(connection.getAmps());
        existing.setLevel(connection.getLevel());
        existing.setCurrentType(connection.getCurrentType());
        
        Connection updated = connectionService.saveConnection(existing);
        return ResponseEntity.ok(updated);
    }

    /**
     * Supprime une connection
     * DELETE http://localhost:8081/api/bornes/connections/{connectionId}
     */
    @DeleteMapping("/connections/{connectionId}")
    public ResponseEntity<Void> deleteConnection(@PathVariable Long connectionId) {
        connectionService.deleteConnection(connectionId);
        return ResponseEntity.ok().build();
    }

    // ============================================================
    // 3. GESTION DE LA DISPONIBILITÉ ET DES SESSIONS
    // ============================================================

    /**
     * Vérifie la disponibilité d'une borne
     * GET http://localhost:8081/api/bornes/{id}/disponibilite
     */
    @GetMapping("/{id}/disponibilite")
    public ResponseEntity<Map<String, Object>> verifierDisponibilite(@PathVariable Long id) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            Borne borne = borneService.getBorneById(id);
            
            // Vérifier si la borne est opérationnelle
            if (!"Operational".equals(borne.getStatus())) {
                response.put("disponible", false);
                response.put("message", "La borne n'est pas opérationnelle (statut: " + borne.getStatus() + ")");
                return ResponseEntity.ok(response);
            }

            // Vérifier si la borne est occupée
            if (borne.getIsOccupied() != null && borne.getIsOccupied()) {
                response.put("disponible", false);
                response.put("message", "La borne est actuellement occupée");
                
                SessionRecharge sessionActive = sessionService.findActiveSessionByBorne(id);
                if (sessionActive != null) {
                    response.put("sessionActive", sessionActive);
                }
                return ResponseEntity.ok(response);
            }

            response.put("disponible", true);
            response.put("message", "Borne disponible");
            
            // Ajouter les informations des connections
            List<Connection> connections = connectionService.getConnectionsByBorneId(id);
            response.put("connections", connections);
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            response.put("disponible", false);
            response.put("message", "Erreur: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    /**
     * Met à jour l'occupation d'une borne
     * PUT http://localhost:8081/api/bornes/{id}/occupation?occupied=true
     */
    @PutMapping("/{id}/occupation")
    public ResponseEntity<Borne> updateOccupation(
            @PathVariable Long id,
            @RequestParam boolean occupied) {
        Borne borne = borneService.getBorneById(id);
        borne.setIsOccupied(occupied);
        if (!occupied) {
            borne.setSessionId(null);
        }
        return ResponseEntity.ok(borneRepository.save(borne));
    }

    // ============================================================
    // 4. CRUD COMPLET
    // ============================================================

    /**
     * Ajoute une nouvelle borne
     * POST http://localhost:8081/api/bornes
     */
     @PostMapping
public ResponseEntity<Borne> addBorne(@RequestBody Borne borne) {
    borne.setId(null);
    Borne saved = borneService.addBorne(borne);
    return ResponseEntity.status(HttpStatus.CREATED).body(saved);
}
    /**
     * Met à jour le statut d'une borne
     * PUT http://localhost:8081/api/bornes/{id}/status?status=Operational
     */
    @PutMapping("/{id}/status")
    public ResponseEntity<Borne> updateStatus(
            @PathVariable Long id,
            @RequestParam String status) {
        return ResponseEntity.ok(borneService.updateStatus(id, status));
    }

    /**
     * Met à jour une borne
     * PUT http://localhost:8081/api/bornes/{id}
     */
    @PutMapping("/{id}")
    public ResponseEntity<Borne> updateBorne(
            @PathVariable Long id,
            @RequestBody Borne borne) {
        Borne existing = borneService.getBorneById(id);
        existing.setTitle(borne.getTitle());
        existing.setAddress(borne.getAddress());
        existing.setCity(borne.getCity());
        existing.setProvince(borne.getProvince());
        existing.setPostcode(borne.getPostcode());
        existing.setLatitude(borne.getLatitude());
        existing.setLongitude(borne.getLongitude());
        existing.setOperator(borne.getOperator());
        existing.setOperatorWebsite(borne.getOperatorWebsite());
        existing.setStatus(borne.getStatus());
        existing.setIsOperational(borne.getIsOperational());
        existing.setUsageCost(borne.getUsageCost());
        existing.setConnectorType(borne.getConnectorType());
        existing.setPower(borne.getPower());
        
        return ResponseEntity.ok(borneRepository.save(existing));
    }

    /**
     * Supprime une borne
     * DELETE http://localhost:8081/api/bornes/{id}
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBorne(@PathVariable Long id) {
        borneService.deleteBorne(id);
        return ResponseEntity.ok().build();
    }

    // ============================================================
    // 5. FILTRES ET RECHERCHE
    // ============================================================

    /**
     * Filtre les bornes par statut, ville ou opérateur
     * GET http://localhost:8081/api/bornes/filter?status=Operational
     * GET http://localhost:8081/api/bornes/filter?city=Casablanca
     * GET http://localhost:8081/api/bornes/filter?operator=Fastvolt
     * GET http://localhost:8081/api/bornes/filter?minPower=50&maxPower=200
     * GET http://localhost:8081/api/bornes/filter?connectionType=CCS
     */
    @GetMapping("/filter")
    public ResponseEntity<List<Borne>> filterBornes(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String city,
            @RequestParam(required = false) String operator,
            @RequestParam(required = false) Double minPower,
            @RequestParam(required = false) Double maxPower,
            @RequestParam(required = false) String connectionType) {
        
        List<Borne> bornes;
        
        // Filtres de base
        if (status != null) {
            bornes = borneService.getByStatus(status);
        } else if (city != null) {
            bornes = borneService.getByCity(city);
        } else if (operator != null) {
            bornes = borneService.getByOperator(operator);
        } else {
            bornes = borneService.getAllBornes();
        }
        
        // Filtre par puissance
        if (minPower != null || maxPower != null) {
            bornes = bornes.stream()
                .filter(borne -> {
                    List<Connection> connections = connectionService.getConnectionsByBorneId(borne.getId());
                    double maxPowerBorne = connections.stream()
                        .mapToDouble(Connection::getPowerKw)
                        .max()
                        .orElse(0);
                    
                    if (minPower != null && maxPowerBorne < minPower) return false;
                    if (maxPower != null && maxPowerBorne > maxPower) return false;
                    return true;
                })
                .collect(java.util.stream.Collectors.toList());
        }
        
        // Filtre par type de connecteur
        if (connectionType != null && !connectionType.isEmpty()) {
            bornes = bornes.stream()
                .filter(borne -> {
                    List<Connection> connections = connectionService.getConnectionsByBorneId(borne.getId());
                    return connections.stream().anyMatch(c -> 
                        c.getConnectionType().toLowerCase().contains(connectionType.toLowerCase())
                    );
                })
                .collect(java.util.stream.Collectors.toList());
        }
        
        // Charger les connections pour chaque borne
        bornes.forEach(borne -> {
            List<Connection> connections = connectionService.getConnectionsByBorneId(borne.getId());
            borne.setConnections(connections);
        });
        
        return ResponseEntity.ok(bornes);
    }

    /**
     * Recherche des bornes par texte (titre, adresse, ville)
     * GET http://localhost:8081/api/bornes/search?q=Agadir
     */
    @GetMapping("/search")
    public ResponseEntity<List<Borne>> searchBornes(@RequestParam String q) {
        List<Borne> bornes = borneService.searchBornes(q);
        
        // Charger les connections
        bornes.forEach(borne -> {
            List<Connection> connections = connectionService.getConnectionsByBorneId(borne.getId());
            borne.setConnections(connections);
        });
        
        return ResponseEntity.ok(bornes);
    }

    // ============================================================
    // 6. STATISTIQUES
    // ============================================================

    /**
     * Récupère les statistiques des bornes
     * GET http://localhost:8081/api/bornes/stats
     */
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getStats() {
        List<Borne> bornes = borneService.getAllBornes();
        
        long total = bornes.size();
        long operational = bornes.stream().filter(b -> "Operational".equals(b.getStatus())).count();
        long maintenance = bornes.stream().filter(b -> "Maintenance".equals(b.getStatus())).count();
        long outOfService = bornes.stream().filter(b -> "OutOfService".equals(b.getStatus())).count();
        long occupied = bornes.stream().filter(b -> b.getIsOccupied() != null && b.getIsOccupied()).count();
        long available = bornes.stream().filter(b -> 
            "Operational".equals(b.getStatus()) && 
            (b.getIsOccupied() == null || !b.getIsOccupied())
        ).count();
        
        Map<String, Object> stats = new HashMap<>();
        stats.put("total", total);
        stats.put("operational", operational);
        stats.put("maintenance", maintenance);
        stats.put("outOfService", outOfService);
        stats.put("occupied", occupied);
        stats.put("available", available);
        
        return ResponseEntity.ok(stats);
    }

    /**
     * Récupère les bornes disponibles
     * GET http://localhost:8081/api/bornes/available
     */
    @GetMapping("/available")
    public ResponseEntity<List<Borne>> getAvailableBornes() {
        List<Borne> bornes = borneService.getAvailableBornes();
        
        // Charger les connections
        bornes.forEach(borne -> {
            List<Connection> connections = connectionService.getConnectionsByBorneId(borne.getId());
            borne.setConnections(connections);
        });
        
        return ResponseEntity.ok(bornes);
    }
}