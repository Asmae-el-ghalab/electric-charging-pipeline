package com.bornemaroc.backend.entity;

import com.bornemaroc.backend.enums.TypePrise;
import com.bornemaroc.backend.enums.RoleUtilisateur;
import javax.persistence.*;

@Entity
@Table(name = "conducteur")
public class Conducteur extends Utilisateur {

    @Column(name = "est_bloque")
    private Boolean estBloqueConducteur = false;
    
    @Column(name = "type_prise")
    private String typePrise;
    
    private String vehicule;
    
    public Conducteur() {
        super();
        this.estBloqueConducteur = false;
        this.vehicule = "Non renseigné";
    }
    
    // Getters
    public Boolean getEstBloqueConducteur() { return estBloqueConducteur; }
    public String getTypePrise() { return typePrise; }
    public String getVehicule() { return vehicule; }
    
    // Setters
    public void setEstBloqueConducteur(Boolean estBloqueConducteur) { 
        this.estBloqueConducteur = estBloqueConducteur; 
        super.setEstBloque(estBloqueConducteur);
    }
    public void setEstBloqueConducteur(boolean estBloqueConducteur) { 
        this.estBloqueConducteur = estBloqueConducteur; 
        super.setEstBloque(estBloqueConducteur);
    }
    public void setTypePrise(String typePrise) { this.typePrise = typePrise; }
    public void setVehicule(String vehicule) { this.vehicule = vehicule; }
    
    @PrePersist
    protected void onCreate() {
        super.onCreate();
        if (estBloqueConducteur == null) {
            estBloqueConducteur = false;
        }
        if (vehicule == null) {
            vehicule = "Non renseigné";
        }
        super.setVehicule(vehicule);
        super.setTypePrise(typePrise);
        super.setEstBloque(estBloqueConducteur);
        super.setDtype("conducteur");
        super.setTypeUtilisateur("conducteur");
        super.setRole(RoleUtilisateur.CONDUCTEUR);
    }
}