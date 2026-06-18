package com.bornemaroc.backend.entity;

import javax.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "connections")
@Data
@NoArgsConstructor
public class Prise {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String connectionType;
    private Double powerKw;
    private Integer quantity;
    private Integer voltage;
    private Integer amps;
    private String level;
    private String currentType;

    @ManyToOne
    @JoinColumn(name = "station_id")
    private Borne borne;
}
