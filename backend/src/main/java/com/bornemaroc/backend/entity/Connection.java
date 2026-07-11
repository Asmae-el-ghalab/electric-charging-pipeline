package com.bornemaroc.backend.entity;

import javax.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
@Table(name = "connections")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Connection {
    
    @Id
@GeneratedValue(strategy = GenerationType.IDENTITY)
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
    
    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "station_id", insertable = false, updatable = false)
    private Borne borne;
    
    public Connection() {}
    
    // Getters
    public Long getId() { return id; }
    public Long getStationId() { return stationId; }
    public String getConnectionType() { return connectionType; }
    public Double getPowerKw() { return powerKw; }
    public Integer getQuantity() { return quantity; }
    public Integer getVoltage() { return voltage; }
    public Integer getAmps() { return amps; }
    public String getLevel() { return level; }
    public String getCurrentType() { return currentType; }
    public Borne getBorne() { return borne; }
    
    // Setters
    public void setId(Long id) { this.id = id; }
    public void setStationId(Long stationId) { this.stationId = stationId; }
    public void setConnectionType(String connectionType) { this.connectionType = connectionType; }
    public void setPowerKw(Double powerKw) { this.powerKw = powerKw; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }
    public void setVoltage(Integer voltage) { this.voltage = voltage; }
    public void setAmps(Integer amps) { this.amps = amps; }
    public void setLevel(String level) { this.level = level; }
    public void setCurrentType(String currentType) { this.currentType = currentType; }
    public void setBorne(Borne borne) { this.borne = borne; }
}