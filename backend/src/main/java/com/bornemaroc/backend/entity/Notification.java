package com.bornemaroc.backend.entity;

import javax.persistence.*;
import java.util.Date;

@Entity
@Table(name = "notifications")
public class Notification {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String titre;
    
    private String message;
    
    @Temporal(TemporalType.TIMESTAMP)
    private Date dateCreation;
    
    private Boolean estLue = false;
    
    private String type; // INFO, SUCCESS, WARNING, ERROR
    
    @ManyToOne
    @JoinColumn(name = "conducteur_id")
    private Conducteur conducteur;
    
    public Notification() {}
    
    // ============ GETTERS ============
    public Long getId() { return id; }
    public String getTitre() { return titre; }
    public String getMessage() { return message; }
    public Date getDateCreation() { return dateCreation; }
    public Boolean getEstLue() { return estLue; }
    public String getType() { return type; }
    public Conducteur getConducteur() { return conducteur; }
    
    // ============ SETTERS ============
    public void setId(Long id) { this.id = id; }
    public void setTitre(String titre) { this.titre = titre; }
    public void setMessage(String message) { this.message = message; }
    public void setDateCreation(Date dateCreation) { this.dateCreation = dateCreation; }
    public void setEstLue(Boolean estLue) { this.estLue = estLue; }
    public void setEstLue(boolean estLue) { this.estLue = estLue; }
    public void setType(String type) { this.type = type; }
    public void setConducteur(Conducteur conducteur) { this.conducteur = conducteur; }
}