package com.bornemaroc.backend.entity;

import javax.persistence.*;

@Entity
@Table(name = "favori")
public class Favori {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "conducteur_id")
    private Conducteur conducteur;
    
    @ManyToOne
    @JoinColumn(name = "borne_id")
    private Borne borne;
    
    public Favori() {}
    
    // ============ GETTERS ============
    public Long getId() { return id; }
    public Conducteur getConducteur() { return conducteur; }
    public Borne getBorne() { return borne; }
    
    // ============ SETTERS ============
    public void setId(Long id) { this.id = id; }
    public void setConducteur(Conducteur conducteur) { this.conducteur = conducteur; }
    public void setBorne(Borne borne) { this.borne = borne; }
}