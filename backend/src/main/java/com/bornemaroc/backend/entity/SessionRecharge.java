// src/main/java/com/bornemaroc/backend/entity/SessionRecharge.java
package com.bornemaroc.backend.entity;

import javax.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "sessions_recharge")
@Data
public class SessionRecharge {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "borne_id", nullable = false)
    private Long borneId;
    
    @Column(name = "conducteur_id", nullable = false)
    private Long conducteurId;
    
    @Column(name = "date_debut", nullable = false)
    private LocalDateTime dateDebut;
    
    @Column(name = "date_fin")
    private LocalDateTime dateFin;
    
    private Integer duree; // en minutes
    
    private Double consommation; // en kWh
    
    @Column(name = "montant_total")
    private Double montantTotal; // en euros
    
    private String status; // ACTIVE, TERMINEE, ANNULEE
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}