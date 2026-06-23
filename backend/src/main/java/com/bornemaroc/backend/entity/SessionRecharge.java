package com.bornemaroc.backend.entity;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "sessions_recharge")
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
    
    public SessionRecharge() {}
    
    // ============ GETTERS ============
    public Long getId() { return id; }
    public Long getBorneId() { return borneId; }
    public Long getConducteurId() { return conducteurId; }
    public LocalDateTime getDateDebut() { return dateDebut; }
    public LocalDateTime getDateFin() { return dateFin; }
    public Integer getDuree() { return duree; }
    public Double getConsommation() { return consommation; }
    public Double getMontantTotal() { return montantTotal; }
    public String getStatus() { return status; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    
    // ============ SETTERS ============
    public void setId(Long id) { this.id = id; }
    public void setBorneId(Long borneId) { this.borneId = borneId; }
    public void setConducteurId(Long conducteurId) { this.conducteurId = conducteurId; }
    public void setDateDebut(LocalDateTime dateDebut) { this.dateDebut = dateDebut; }
    public void setDateFin(LocalDateTime dateFin) { this.dateFin = dateFin; }
    public void setDuree(Integer duree) { this.duree = duree; }
    public void setDuree(int duree) { this.duree = duree; }
    public void setConsommation(Double consommation) { this.consommation = consommation; }
    public void setMontantTotal(Double montantTotal) { this.montantTotal = montantTotal; }
    public void setStatus(String status) { this.status = status; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}