package com.bornemaroc.backend.entity;

import javax.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
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
}