// src/main/java/com/bornemaroc/backend/entity/Utilisateur.java
package com.bornemaroc.backend.entity;

import com.bornemaroc.backend.enums.RoleUtilisateur;
import javax.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.Date;

@Entity
@Table(name = "utilisateur")
@Inheritance(strategy = InheritanceType.JOINED)
@Data
@NoArgsConstructor
public class Utilisateur {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nom;
    
    @Column(unique = true, nullable = false)
    private String email;
    
    @Column(name = "mot_de_passe")
    private String motDePasse;

    @Enumerated(EnumType.STRING)
    private RoleUtilisateur role;
    
    @Column(name = "date_inscription")
    private Date dateInscription;
    
    private String dtype;
    
    private String vehicule;
    
    @Column(name = "derniere_connexion")
    private Date derniereConnexion;
    
    @Column(name = "niveau_acces")
    private Integer niveauAcces;  // ✅ Utiliser Integer (Wrapper)
    
    @Column(name = "est_bloque")
    private Boolean estBloque = false;
    
    @Column(name = "type_prise")
    private String typePrise;  // ✅ String dans Utilisateur
    
    @Column(name = "type_utilisateur")
    private String typeUtilisateur;
    
    @PrePersist
    protected void onCreate() {
        if (dateInscription == null) {
            dateInscription = new Date();
        }
        if (role == null) {
            role = RoleUtilisateur.CONDUCTEUR;
        }
        if (dtype == null) {
            dtype = "conducteur";
        }
        if (estBloque == null) {
            estBloque = false;
        }
        if (typeUtilisateur == null) {
            typeUtilisateur = "conducteur";
        }
        if (derniereConnexion == null) {
            derniereConnexion = new Date();
        }
        if (niveauAcces == null) {
            niveauAcces = 1;
        }
    }
}