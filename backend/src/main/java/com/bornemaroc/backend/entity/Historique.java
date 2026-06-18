package com.bornemaroc.backend.entity;

import javax.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.Date;

@Entity
@Data
@NoArgsConstructor
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

    private Date dateVisite;
}