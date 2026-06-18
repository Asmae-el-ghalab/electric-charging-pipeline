// src/main/java/com/bornemaroc/backend/entity/Signalement.java
package com.bornemaroc.backend.entity;

import javax.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "signalement")
@Data
@NoArgsConstructor
public class Signalement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "conducteur_id")
    private Long conducteurId;
    
    @Column(name = "borne_id")
    private Long borneId;
    
    private String type;
    
    private String description;
    
    private String statut;
    
    @Column(name = "date_signalement")
    private LocalDateTime dateSignalement;
    
    @PrePersist
    protected void onCreate() {
        if (dateSignalement == null) {
            dateSignalement = LocalDateTime.now();
        }
        if (statut == null) {
            statut = "EN_ATTENTE";
        }
    }
}