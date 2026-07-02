package com.bornemaroc.backend.entity;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
@Table(name = "stations")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Borne {

    @Id
@GeneratedValue(strategy = GenerationType.IDENTITY)
@Column(name = "id")
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
    
    @Column(name = "operator_website")
    private String operatorWebsite;
    
    private String status;
    
    @Column(name = "is_operational")
    private Boolean isOperational;
    
    @Column(name = "usage_cost")
    private String usageCost;

    @Column(name = "is_occupied")
    private Boolean isOccupied = false;
    
    @Column(name = "session_id")
    private Long sessionId;
    
    @Column(name = "connector_type")
    private String connectorType;
    
    private Double power;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @JsonIgnore
    @OneToMany(mappedBy = "borne", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Connection> connections = new ArrayList<>();
    
    // Constructeurs
    public Borne() {}
    
    // Getters et Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getUuid() { return uuid; }
    public void setUuid(String uuid) { this.uuid = uuid; }
    
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    
    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }
    
    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }
    
    public String getProvince() { return province; }
    public void setProvince(String province) { this.province = province; }
    
    public String getPostcode() { return postcode; }
    public void setPostcode(String postcode) { this.postcode = postcode; }
    
    public double getLatitude() { return latitude; }
    public void setLatitude(double latitude) { this.latitude = latitude; }
    
    public double getLongitude() { return longitude; }
    public void setLongitude(double longitude) { this.longitude = longitude; }
    
    public String getOperator() { return operator; }
    public void setOperator(String operator) { this.operator = operator; }
    
    public String getOperatorWebsite() { return operatorWebsite; }
    public void setOperatorWebsite(String operatorWebsite) { this.operatorWebsite = operatorWebsite; }
    
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    
    public Boolean getIsOperational() { return isOperational; }
    public void setIsOperational(Boolean isOperational) { this.isOperational = isOperational; }
    
    public String getUsageCost() { return usageCost; }
    public void setUsageCost(String usageCost) { this.usageCost = usageCost; }
    
    public Boolean getIsOccupied() { return isOccupied; }
    public void setIsOccupied(Boolean isOccupied) { this.isOccupied = isOccupied; }
    public void setIsOccupied(boolean isOccupied) { this.isOccupied = isOccupied; }
    
    public Long getSessionId() { return sessionId; }
    public void setSessionId(Long sessionId) { this.sessionId = sessionId; }
    
    public String getConnectorType() { return connectorType; }
    public void setConnectorType(String connectorType) { this.connectorType = connectorType; }
    
    public Double getPower() { return power; }
    public void setPower(Double power) { this.power = power; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
    
    public List<Connection> getConnections() { return connections; }
    public void setConnections(List<Connection> connections) { this.connections = connections; }
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (isOccupied == null) {
            isOccupied = false;
        }
        if (power == null) {
            power = 50.0;
        }
        if (connectorType == null) {
            connectorType = "Type 2";
        }
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
    
    public void addConnection(Connection connection) {
        if (this.connections == null) {
            this.connections = new ArrayList<>();
        }
        this.connections.add(connection);
        connection.setBorne(this);
    }
    
    public void removeConnection(Connection connection) {
        if (this.connections != null) {
            this.connections.remove(connection);
            connection.setBorne(null);
        }
    }
}