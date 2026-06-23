package com.bornemaroc.backend.entity;

import javax.persistence.*;
import java.util.Date;

@Entity
@Table(name = "historique_trajets")
public class HistoriqueTrajet {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Temporal(TemporalType.TIMESTAMP)
    private Date dateDebut;
    
    @Temporal(TemporalType.TIMESTAMP)
    private Date dateFin;
    
    private String pointDepart;
    
    private String pointArrivee;
    
    private Double distance;
    
    private Integer duree; // en minutes
    
    private Double cout;
    
    private String statut; // TERMINE, ANNULE, EN_COURS
    
    private String borneDepart;
    
    private String borneArrivee;
    
    @ManyToOne
    @JoinColumn(name = "conducteur_id")
    private Conducteur conducteur;
    
    public HistoriqueTrajet() {}
    
    // ============ GETTERS ============
    public Long getId() { return id; }
    public Date getDateDebut() { return dateDebut; }
    public Date getDateFin() { return dateFin; }
    public String getPointDepart() { return pointDepart; }
    public String getPointArrivee() { return pointArrivee; }
    public Double getDistance() { return distance; }
    public Integer getDuree() { return duree; }
    public Double getCout() { return cout; }
    public String getStatut() { return statut; }
    public String getBorneDepart() { return borneDepart; }
    public String getBorneArrivee() { return borneArrivee; }
    public Conducteur getConducteur() { return conducteur; }
    
    // ============ SETTERS ============
    public void setId(Long id) { this.id = id; }
    public void setDateDebut(Date dateDebut) { this.dateDebut = dateDebut; }
    public void setDateFin(Date dateFin) { this.dateFin = dateFin; }
    public void setPointDepart(String pointDepart) { this.pointDepart = pointDepart; }
    public void setPointArrivee(String pointArrivee) { this.pointArrivee = pointArrivee; }
    public void setDistance(Double distance) { this.distance = distance; }
    public void setDuree(Integer duree) { this.duree = duree; }
    public void setDuree(int duree) { this.duree = duree; }
    public void setCout(Double cout) { this.cout = cout; }
    public void setStatut(String statut) { this.statut = statut; }
    public void setBorneDepart(String borneDepart) { this.borneDepart = borneDepart; }
    public void setBorneArrivee(String borneArrivee) { this.borneArrivee = borneArrivee; }
    public void setConducteur(Conducteur conducteur) { this.conducteur = conducteur; }
}