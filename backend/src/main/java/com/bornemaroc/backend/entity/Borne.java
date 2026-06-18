// src/main/java/com/bornemaroc/backend/entity/Borne.java
package com.bornemaroc.backend.entity;

import javax.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "stations")
@Data
@NoArgsConstructor
public class Borne {

    @Id
    private Long id;

    private String uuid;
    private String title;
    private String address;
    private String city;
    private String province;
    private String postcode;
    private double latitude;
    private double longitude;
    private String operator;
    
    @Column(name = "operator_website")
    private String operatorWebsite;
    
    private String status;
    
    @Column(name = "is_operational")
    private Boolean isOperational;
    
    @Column(name = "usage_cost")
    private String usageCost;

    // ✅ AJOUTER CES CHAMPS POUR LA GESTION DES SESSIONS
    @Column(name = "is_occupied")
    private Boolean isOccupied = false;
    
    @Column(name = "session_id")
    private Long sessionId;
    
    @Column(name = "connector_type")
    private String connectorType;
    
    private Double power;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @JsonIgnore
    @OneToMany(mappedBy = "borne", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Prise> prises;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (isOccupied == null) {
            isOccupied = false;
        }
        if (power == null) {
            power = 50.0;
        }
        if (connectorType == null) {
            connectorType = "Type 2";
        }
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}