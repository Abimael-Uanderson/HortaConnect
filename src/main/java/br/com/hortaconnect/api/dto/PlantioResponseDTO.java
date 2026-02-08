package br.com.hortaconnect.api.dto;

import br.com.hortaconnect.api.enums.EstagioCrescimento;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class PlantioResponseDTO {

    private Long id;

    private String nomeCultura;
    private String cultivar;
    private LocalDate dataPlantio;
    private String tipoSolo;
    private EstagioCrescimento estagioCrescimento;
    private BigDecimal areaM2;
    private String observacoes;

    private Boolean ativo;
}