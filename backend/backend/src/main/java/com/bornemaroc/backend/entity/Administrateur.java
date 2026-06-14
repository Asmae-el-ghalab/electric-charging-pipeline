package com.bornemaroc.backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.Date;

@Entity
@Data
@NoArgsConstructor
public class Administrateur extends Utilisateur {

    private int niveauAcces;
    private Date derniereConnexion;
}