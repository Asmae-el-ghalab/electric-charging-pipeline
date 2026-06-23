package com.bornemaroc.backend.entity;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "trajets")
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

    public Trajet() {}

    // ============ GETTERS ============
    public Long getId() { return id; }
    public Long getConducteurId() { return conducteurId; }
    public Long getBorneId() { return borneId; }
    public String getBorneNom() { return borneNom; }
    public LocalDateTime getDateDebut() { return dateDebut; }
    public LocalDateTime getDateFin() { return dateFin; }
    public Integer getDureeMinutes() { return dureeMinutes; }
    public Double getConsommationKwh() { return consommationKwh; }
    public Double getCoutTotal() { return coutTotal; }
    public Double getDistanceKm() { return distanceKm; }
    public String getStatus() { return status; }
    public String getVilleDepart() { return villeDepart; }
    public String getVilleArrivee() { return villeArrivee; }
    public String getVehicule() { return vehicule; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }

    // ============ SETTERS ============
    public void setId(Long id) { this.id = id; }
    public void setConducteurId(Long conducteurId) { this.conducteurId = conducteurId; }
    public void setBorneId(Long borneId) { this.borneId = borneId; }
    public void setBorneNom(String borneNom) { this.borneNom = borneNom; }
    public void setDateDebut(LocalDateTime dateDebut) { this.dateDebut = dateDebut; }
    public void setDateFin(LocalDateTime dateFin) { this.dateFin = dateFin; }
    public void setDureeMinutes(Integer dureeMinutes) { this.dureeMinutes = dureeMinutes; }
    public void setDureeMinutes(int dureeMinutes) { this.dureeMinutes = dureeMinutes; }
    public void setConsommationKwh(Double consommationKwh) { this.consommationKwh = consommationKwh; }
    public void setConsommationKwh(double consommationKwh) { this.consommationKwh = consommationKwh; }
    public void setCoutTotal(Double coutTotal) { this.coutTotal = coutTotal; }
    public void setCoutTotal(double coutTotal) { this.coutTotal = coutTotal; }
    public void setDistanceKm(Double distanceKm) { this.distanceKm = distanceKm; }
    public void setDistanceKm(double distanceKm) { this.distanceKm = distanceKm; }
    public void setStatus(String status) { this.status = status; }
    public void setVilleDepart(String villeDepart) { this.villeDepart = villeDepart; }
    public void setVilleArrivee(String villeArrivee) { this.villeArrivee = villeArrivee; }
    public void setVehicule(String vehicule) { this.vehicule = vehicule; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

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