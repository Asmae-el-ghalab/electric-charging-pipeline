package com.bornemaroc.backend.entity;

import com.bornemaroc.backend.enums.RoleUtilisateur;
import javax.persistence.*;
import java.util.Date;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
@Table(name = "utilisateur")
@Inheritance(strategy = InheritanceType.JOINED)
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
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
    @Temporal(TemporalType.TIMESTAMP)
    private Date dateInscription;
    
    private String dtype;
    
    private String vehicule;
    
    @Column(name = "derniere_connexion")
    @Temporal(TemporalType.TIMESTAMP)
    private Date derniereConnexion;
    
    @Column(name = "niveau_acces")
    private Integer niveauAcces;
    
    @Column(name = "est_bloque")
    private Boolean estBloque = false;
    
    @Column(name = "type_prise")
    private String typePrise;
    
    @Column(name = "type_utilisateur")
    private String typeUtilisateur;
    
    public Utilisateur() {}
    
    // ============ GETTERS ============
    public Long getId() { return id; }
    public String getNom() { return nom; }
    public String getEmail() { return email; }
    public String getMotDePasse() { return motDePasse; }
    public RoleUtilisateur getRole() { return role; }
    public Date getDateInscription() { return dateInscription; }
    public String getDtype() { return dtype; }
    public String getVehicule() { return vehicule; }
    public Date getDerniereConnexion() { return derniereConnexion; }
    public Integer getNiveauAcces() { return niveauAcces; }
    public Boolean getEstBloque() { return estBloque; }
    public String getTypePrise() { return typePrise; }
    public String getTypeUtilisateur() { return typeUtilisateur; }
    
    // ============ SETTERS ============
    public void setId(Long id) { this.id = id; }
    public void setNom(String nom) { this.nom = nom; }
    public void setEmail(String email) { this.email = email; }
    public void setMotDePasse(String motDePasse) { this.motDePasse = motDePasse; }
    public void setRole(RoleUtilisateur role) { this.role = role; }
    public void setDateInscription(Date dateInscription) { this.dateInscription = dateInscription; }
    public void setDtype(String dtype) { this.dtype = dtype; }
    public void setVehicule(String vehicule) { this.vehicule = vehicule; }
    public void setDerniereConnexion(Date derniereConnexion) { this.derniereConnexion = derniereConnexion; }
    public void setNiveauAcces(Integer niveauAcces) { this.niveauAcces = niveauAcces; }
    public void setNiveauAcces(int niveauAcces) { this.niveauAcces = niveauAcces; }
    public void setEstBloque(Boolean estBloque) { this.estBloque = estBloque; }
    public void setEstBloque(boolean estBloque) { this.estBloque = estBloque; }
    public void setTypePrise(String typePrise) { this.typePrise = typePrise; }
    public void setTypeUtilisateur(String typeUtilisateur) { this.typeUtilisateur = typeUtilisateur; }
    
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