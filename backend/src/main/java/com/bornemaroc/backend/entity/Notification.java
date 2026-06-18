package com.bornemaroc.backend.entity;

import javax.persistence.*;
import lombok.Data;
import java.util.Date;

@Entity
@Table(name = "notifications")
@Data
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
}