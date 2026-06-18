// src/main/java/com/bornemaroc/backend/entity/Administrateur.java
package com.bornemaroc.backend.entity;

import com.bornemaroc.backend.enums.RoleUtilisateur;
import javax.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "administrateur")
@Data
@NoArgsConstructor
public class Administrateur extends Utilisateur {

    // ✅ Utiliser le même type que le parent (Integer)
    @Column(name = "niveau_acces")
    private Integer niveauAccesAdmin = 1;
    
    @Column(name = "derniere_connexion")
    private java.util.Date derniereConnexionAdmin;
    
    @PrePersist
    protected void onCreate() {
        super.onCreate();
        if (niveauAccesAdmin == null) {
            niveauAccesAdmin = 1;
        }
        if (derniereConnexionAdmin == null) {
            derniereConnexionAdmin = new java.util.Date();
        }
        // ✅ Ne pas override getNiveauAcces() 
        // Utiliser le setter du parent
        setNiveauAcces(niveauAccesAdmin);
        setDtype("administrateur");
        setTypeUtilisateur("administrateur");
        setRole(RoleUtilisateur.ADMIN);
    }
}