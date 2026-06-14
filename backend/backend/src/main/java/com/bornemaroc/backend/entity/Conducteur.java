package com.bornemaroc.backend.entity;

import com.bornemaroc.backend.enums.TypePrise;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
public class Conducteur extends Utilisateur {

    private String vehicule;

    @Enumerated(EnumType.STRING)
    private TypePrise typePrise;

    private boolean estBloque = false;
}