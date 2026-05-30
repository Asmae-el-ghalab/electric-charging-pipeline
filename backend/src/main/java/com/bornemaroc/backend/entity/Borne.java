package com.bornemaroc.backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "stations")
@Data
@NoArgsConstructor
public class Borne {

    @Id
    private Long id;

    private String uuid;
    private String title;
    private String address;
    private String city;
    private String province;
    private String postcode;
    private double latitude;
    private double longitude;
    private String operator;
    private String operatorWebsite;
    private String status;
    private Boolean isOperational;
    private String usageCost;

    @JsonIgnore
    @OneToMany(mappedBy = "borne", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Prise> prises;
}