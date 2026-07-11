package com.bornemaroc.backend.controller;

import com.bornemaroc.backend.entity.Connection;
import com.bornemaroc.backend.service.ConnectionService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/connections")
@CrossOrigin(origins = "http://localhost:4200")
public class ConnectionController {

    @Autowired
    private ConnectionService connectionService;

    @GetMapping("/station/{id}")
    public List<Connection> getConnections(@PathVariable Long id) {
        return connectionService.getConnections(id);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Connection> updateConnection(
            @PathVariable Long id,
            @RequestBody Connection connection) {

        Connection updatedConnection =
                connectionService.updateConnection(id, connection);

        return ResponseEntity.ok(updatedConnection);
    }
    @PostMapping
    public ResponseEntity<Connection> addConnection(@RequestBody Connection connection) {
    connection.setId(null);
    Connection savedConnection = connectionService.saveConnection(connection);
    return ResponseEntity.status(201).body(savedConnection);
}
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteConnection(@PathVariable Long id) {
        connectionService.deleteConnection(id);
        return ResponseEntity.ok().build();
    }
}