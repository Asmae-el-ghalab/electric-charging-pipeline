package com.bornemaroc.backend.entity;

import com.bornemaroc.backend.enums.RoleUtilisateur;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.Date;

@Entity
@Data
@NoArgsConstructor
@Inheritance(strategy = InheritanceType.JOINED)
public abstract class Utilisateur {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nom;

    @Column(unique = true, nullable = false)
    private String email;

    private String motDePasse;
    private Date dateInscription;

    @Enumerated(EnumType.STRING)
    private RoleUtilisateur role;
}