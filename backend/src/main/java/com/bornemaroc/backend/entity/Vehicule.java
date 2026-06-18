package com.bornemaroc.backend.entity;

import javax.persistence.*;
import lombok.Data;

@Entity
@Table(name = "vehicules")
@Data
public class Vehicule {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String marque;
    
    private String modele;
    
    private String immatriculation;
    
    private String couleur;
    
    private Integer annee;
    
    private String typeCarburant;
    
    private Boolean estPrincipal = false;
    
    @ManyToOne
    @JoinColumn(name = "conducteur_id")
    private Conducteur conducteur;
}