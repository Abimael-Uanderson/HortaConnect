package br.com.hortaconnect.api.dto;


import br.com.hortaconnect.api.enums.EstagioCrescimento;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class PlantioRequestDTO {

    @NotBlank(message = "O nome da cultura é obrigatório")
    private String nomeCultura;

    private String cultivar;

    @NotNull(message = "A data do plantio é obrigatória")
    private LocalDate dataPlantio;

    private String tipoSolo;

    private EstagioCrescimento estagioCrescimento;

    @Positive(message = "A área deve ser maior que zero")
    private BigDecimal areaM2;

    private  String observacoes;

}
