package com.bornemaroc.backend.entity;

import com.bornemaroc.backend.enums.StatutTraitement;
import com.bornemaroc.backend.enums.TypeSignalement;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.Date;

@Entity
@Data
@NoArgsConstructor
public class Signalement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    private TypeSignalement type;

    private String description;
    private Date dateSignalement;

    @Enumerated(EnumType.STRING)
    private StatutTraitement statut;

    @ManyToOne
    @JoinColumn(name = "conducteur_id")
    private Conducteur conducteur;

    @ManyToOne
    @JoinColumn(name = "borne_id")
    private Borne borne;
}