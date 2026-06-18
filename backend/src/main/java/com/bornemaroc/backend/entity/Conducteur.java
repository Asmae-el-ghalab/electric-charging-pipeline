// src/main/java/com/bornemaroc/backend/entity/Conducteur.java
package com.bornemaroc.backend.entity;

import com.bornemaroc.backend.enums.TypePrise;
import com.bornemaroc.backend.enums.RoleUtilisateur;
import javax.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "conducteur")
@Data
@NoArgsConstructor
public class Conducteur extends Utilisateur {

    @Column(name = "est_bloque")
    private Boolean estBloqueConducteur = false;
    
    @Column(name = "type_prise")
    private String typePrise;  // ✅ Utiliser String comme le parent
    
    private String vehicule;
    
    @PrePersist
    protected void onCreate() {
        super.onCreate();
        if (estBloqueConducteur == null) {
            estBloqueConducteur = false;
        }
        if (vehicule == null) {
            vehicule = "Non renseigné";
        }
        // Mettre à jour les champs hérités
        setVehicule(vehicule);
        setTypePrise(typePrise);
        setEstBloque(estBloqueConducteur);
        setDtype("conducteur");
        setTypeUtilisateur("conducteur");
        setRole(RoleUtilisateur.CONDUCTEUR);
    }
}