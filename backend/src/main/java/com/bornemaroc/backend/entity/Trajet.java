// src/main/java/com/bornemaroc/backend/entity/Trajet.java
package com.bornemaroc.backend.entity;

import javax.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "trajets")
@Data
@NoArgsConstructor
public class Trajet {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "conducteur_id", nullable = false)
    private Long conducteurId;

    @Column(name = "borne_id", nullable = false)
    private Long borneId;

    @Column(name = "borne_nom")
    private String borneNom;

    @Column(name = "date_debut", nullable = false)
    private LocalDateTime dateDebut;

    @Column(name = "date_fin")
    private LocalDateTime dateFin;

    @Column(name = "duree_minutes")
    private Integer dureeMinutes;

    @Column(name = "consommation_kwh")
    private Double consommationKwh;

    @Column(name = "cout_total")
    private Double coutTotal;

    @Column(name = "distance_km")
    private Double distanceKm;

    private String status; // TERMINE, ANNULE, EN_COURS

    @Column(name = "ville_depart")
    private String villeDepart;

    @Column(name = "ville_arrivee")
    private String villeArrivee;

    private String vehicule;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
        if (updatedAt == null) {
            updatedAt = LocalDateTime.now();
        }
        if (status == null) {
            status = "EN_COURS";
        }
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}