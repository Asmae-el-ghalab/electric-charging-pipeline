package com.bornemaroc.backend.entity;

import javax.persistence.*;

@Entity
@Table(name = "vehicules")
public class Vehicule {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "conducteur_id")
    private Conducteur conducteur;
    
    private String marque;
    private String modele;
    private String plaque;
    private Integer annee;
    
    public Vehicule() {}
    
    // ============ GETTERS ============
    public Long getId() { return id; }
    public Conducteur getConducteur() { return conducteur; }
    public String getMarque() { return marque; }
    public String getModele() { return modele; }
    public String getPlaque() { return plaque; }
    public Integer getAnnee() { return annee; }
    
    // ============ SETTERS ============
    public void setId(Long id) { this.id = id; }
    public void setConducteur(Conducteur conducteur) { this.conducteur = conducteur; }
    public void setMarque(String marque) { this.marque = marque; }
    public void setModele(String modele) { this.modele = modele; }
    public void setPlaque(String plaque) { this.plaque = plaque; }
    public void setAnnee(Integer annee) { this.annee = annee; }
}