package com.bornemaroc.backend.entity;

import javax.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Entity
@Table(name = "connections")
@Data
@NoArgsConstructor
@ToString(exclude = "borne")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Connection {
    
    @Id
    private Long id;
    
    @Column(name = "station_id")
    private Long stationId;
    
    @Column(name = "connection_type")
    private String connectionType;
    
    @Column(name = "power_kw")
    private Double powerKw;
    
    @Column(name = "quantity")
    private Integer quantity;
    
    @Column(name = "voltage")
    private Integer voltage;
    
    @Column(name = "amps")
    private Integer amps;
    
    @Column(name = "level")
    private String level;
    
    @Column(name = "current_type")
    private String currentType;
    
    // Relation avec Borne
    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "station_id", insertable = false, updatable = false)
    private Borne borne;
}