package com.bornemaroc.backend.controller;

import com.bornemaroc.backend.dto.ConnectionDto;
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
    public List<ConnectionDto> getConnections(@PathVariable Long id) {
        return connectionService.getConnections(id);
    }

    // AJOUTE CES DEUX METHODES :
    
    // PUT /api/connections/{id} - Modifier une connexion
    @PutMapping("/{id}")
    public ResponseEntity<ConnectionDto> updateConnection(
            @PathVariable Long id,
            @RequestBody ConnectionDto connectionDto) {
        ConnectionDto updatedConnection = connectionService.updateConnection(id, connectionDto);
        return ResponseEntity.ok(updatedConnection);
    }

    // DELETE /api/connections/{id} - Supprimer une connexion
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteConnection(@PathVariable Long id) {
        connectionService.deleteConnection(id);
        return ResponseEntity.ok().build();
    }
}