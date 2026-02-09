package br.com.hortaconnect.api.dto;

import lombok.Data;

@Data
public class ClimaAtualResponseDTO {
    private String cidade;
    private String estado;
    private double temperatura;
    private double sensacaoTermica;
    private String descricao;
    private String icone;
    private double umidade;
    private double vento;
}