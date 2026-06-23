package com.bornemaroc.backend.dto;

import lombok.Data;

@Data
public class ConnectionDto {

    private Long id;
    private String connectionType;
    private Double powerKw;
    private Integer quantity;
    private Integer voltage;
    private Integer amps;
    private String level;
    private String currentType;

}