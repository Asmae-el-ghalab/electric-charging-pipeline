package com.bornemaroc.backend.service;

import com.bornemaroc.backend.dto.ConnectionDto;
import com.bornemaroc.backend.entity.Prise;
import com.bornemaroc.backend.repository.PriseRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ConnectionService {

    @Autowired
    private PriseRepository priseRepository;

    public List<ConnectionDto> getConnections(Long borneId) {

        List<Prise> prises = priseRepository.findByBorneId(borneId);

        return prises.stream().map(prise -> {

            ConnectionDto dto = new ConnectionDto();

            dto.setId(prise.getId());
            dto.setConnectionType(prise.getConnectionType());
            dto.setPowerKw(prise.getPowerKw());
            dto.setQuantity(prise.getQuantity());
            dto.setVoltage(prise.getVoltage());
            dto.setAmps(prise.getAmps());
            dto.setLevel(prise.getLevel());
            dto.setCurrentType(prise.getCurrentType());

            return dto;

        }).collect(Collectors.toList());
    }

    // AJOUTE CES DEUX METHODES :

    // Modifier une connexion
    @Transactional
    public ConnectionDto updateConnection(Long id, ConnectionDto connectionDto) {
        // Récupérer la prise existante
        Prise existingPrise = priseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Connexion non trouvée avec l'id: " + id));

        // Mettre à jour les champs
        existingPrise.setConnectionType(connectionDto.getConnectionType());
        existingPrise.setPowerKw(connectionDto.getPowerKw());
        existingPrise.setQuantity(connectionDto.getQuantity());
        existingPrise.setVoltage(connectionDto.getVoltage());
        existingPrise.setAmps(connectionDto.getAmps());
        existingPrise.setLevel(connectionDto.getLevel());
        existingPrise.setCurrentType(connectionDto.getCurrentType());

        // Sauvegarder
        Prise updatedPrise = priseRepository.save(existingPrise);

        // Convertir en DTO et retourner
        ConnectionDto responseDto = new ConnectionDto();
        responseDto.setId(updatedPrise.getId());
        responseDto.setConnectionType(updatedPrise.getConnectionType());
        responseDto.setPowerKw(updatedPrise.getPowerKw());
        responseDto.setQuantity(updatedPrise.getQuantity());
        responseDto.setVoltage(updatedPrise.getVoltage());
        responseDto.setAmps(updatedPrise.getAmps());
        responseDto.setLevel(updatedPrise.getLevel());
        responseDto.setCurrentType(updatedPrise.getCurrentType());

        return responseDto;
    }

    // Supprimer une connexion
    @Transactional
    public void deleteConnection(Long id) {
        // Vérifier si la prise existe
        Prise prise = priseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Connexion non trouvée avec l'id: " + id));

        // Supprimer
        priseRepository.delete(prise);
    }
}