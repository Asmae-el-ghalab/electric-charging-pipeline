package com.bornemaroc.backend.entity;

import javax.persistence.*;
import lombok.Data;
import java.util.Date;

@Entity
@Table(name = "historique_trajets")
@Data
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
}