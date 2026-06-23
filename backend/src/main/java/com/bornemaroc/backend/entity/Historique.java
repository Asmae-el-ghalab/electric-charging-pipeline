package com.bornemaroc.backend.entity;

import javax.persistence.*;
import java.util.Date;

@Entity
@Table(name = "historique")
public class Historique {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "conducteur_id")
    private Conducteur conducteur;

    @ManyToOne
    @JoinColumn(name = "borne_id")
    private Borne borne;

    @Column(name = "date_visite")
    @Temporal(TemporalType.TIMESTAMP)
    private Date dateVisite;

    private String action;

    public Historique() {}

    // ============ GETTERS ============
    public Long getId() { return id; }
    public Conducteur getConducteur() { return conducteur; }
    public Borne getBorne() { return borne; }
    public Date getDateVisite() { return dateVisite; }
    public String getAction() { return action; }

    // ============ SETTERS ============
    public void setId(Long id) { this.id = id; }
    public void setConducteur(Conducteur conducteur) { this.conducteur = conducteur; }
    public void setBorne(Borne borne) { this.borne = borne; }
    public void setDateVisite(Date dateVisite) { this.dateVisite = dateVisite; }
    public void setAction(String action) { this.action = action; }
}