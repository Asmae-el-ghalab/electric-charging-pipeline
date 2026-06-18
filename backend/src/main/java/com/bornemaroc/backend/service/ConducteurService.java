package com.bornemaroc.backend.service;

import com.bornemaroc.backend.entity.Conducteur;
import com.bornemaroc.backend.entity.HistoriqueTrajet;
import com.bornemaroc.backend.entity.Notification;
import com.bornemaroc.backend.entity.Vehicule;

import com.bornemaroc.backend.repository.ConducteurRepository;
import com.bornemaroc.backend.repository.VehiculeRepository;
import com.bornemaroc.backend.repository.HistoriqueTrajetRepository;
import com.bornemaroc.backend.repository.NotificationRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class ConducteurService {
    
    @Autowired
    private ConducteurRepository conducteurRepository;
    
    @Autowired
    private VehiculeRepository vehiculeRepository;
    
    @Autowired
    private HistoriqueTrajetRepository historiqueTrajetRepository;
    
    @Autowired
    private NotificationRepository notificationRepository;
    
    public Conducteur getConducteurById(Long id) {
        return conducteurRepository.findById(id).orElse(null);
    }
    
    public Conducteur updateConducteur(Long id, Conducteur conducteur) {
        conducteur.setId(id);
        return conducteurRepository.save(conducteur);
    }
    
    public Map<String, Object> getMesStatistiques(Long id) {
        Map<String, Object> stats = new HashMap<>();
        List<HistoriqueTrajet> trajets = historiqueTrajetRepository.findByConducteurId(id);
        
        stats.put("totalTrajets", trajets.size());
        stats.put("totalDistance", trajets.stream().mapToDouble(HistoriqueTrajet::getDistance).sum());
        stats.put("totalEconomie", trajets.stream().mapToDouble(HistoriqueTrajet::getCout).sum());
        stats.put("moyenneParTrajet", trajets.stream().mapToDouble(HistoriqueTrajet::getDistance).average().orElse(0));
        stats.put("dernierTrajet", trajets.stream().max(Comparator.comparing(HistoriqueTrajet::getDateDebut)).orElse(null));
        stats.put("tempsTotalConduite", trajets.stream().mapToInt(HistoriqueTrajet::getDuree).sum());
        
        return stats;
    }
    
    public List<HistoriqueTrajet> getTrajetsByConducteur(Long id) {
        return historiqueTrajetRepository.findByConducteurIdOrderByDateDebutDesc(id);
    }
    
    public HistoriqueTrajet getTrajetDetail(Long conducteurId, Long trajetId) {
        return historiqueTrajetRepository.findByIdAndConducteurId(trajetId, conducteurId);
    }
    
    public List<Vehicule> getVehiculesByConducteur(Long id) {
        return vehiculeRepository.findByConducteurId(id);
    }
    
    public Vehicule addVehicule(Long conducteurId, Vehicule vehicule) {
        Conducteur conducteur = conducteurRepository.findById(conducteurId).orElse(null);
        vehicule.setConducteur(conducteur);
        return vehiculeRepository.save(vehicule);
    }
    
    public void deleteVehicule(Long vehiculeId) {
        vehiculeRepository.deleteById(vehiculeId);
    }
    
    public List<Notification> getNotificationsByConducteur(Long id) {
        return notificationRepository.findByConducteurIdOrderByDateCreationDesc(id);
    }
    
    public Notification marquerNotificationLue(Long notificationId) {
        Notification notification = notificationRepository.findById(notificationId).orElse(null);
        if (notification != null) {
            notification.setEstLue(true);
            return notificationRepository.save(notification);
        }
        return null;
    }
}