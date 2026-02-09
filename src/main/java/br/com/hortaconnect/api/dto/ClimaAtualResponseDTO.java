package br.com.hortaconnect.api.dto;

import lombok.Data;

@Data
public class ClimaAtualResponseDTO {
    private String cidade;
    private String estado;
    private double temperatura;
    private double sensacaoTermica;
    private String descricao; // "céu limpo", "chuva leve"
    private String icone; // código do ícone (ex: "10d")
    private double umidade;
    private double vento;
}