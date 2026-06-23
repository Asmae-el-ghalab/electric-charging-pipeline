package com.bornemaroc.backend.entity;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "signalement")
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
    
    public Signalement() {}
    
    // ============ GETTERS ============
    public Long getId() { return id; }
    public Long getConducteurId() { return conducteurId; }
    public Long getBorneId() { return borneId; }
    public String getType() { return type; }
    public String getDescription() { return description; }
    public String getStatut() { return statut; }
    public LocalDateTime getDateSignalement() { return dateSignalement; }
    
    // ============ SETTERS ============
    public void setId(Long id) { this.id = id; }
    public void setConducteurId(Long conducteurId) { this.conducteurId = conducteurId; }
    public void setBorneId(Long borneId) { this.borneId = borneId; }
    public void setType(String type) { this.type = type; }
    public void setDescription(String description) { this.description = description; }
    public void setStatut(String statut) { this.statut = statut; }
    public void setDateSignalement(LocalDateTime dateSignalement) { this.dateSignalement = dateSignalement; }
    
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