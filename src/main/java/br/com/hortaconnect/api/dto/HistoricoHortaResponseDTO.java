package br.com.hortaconnect.api.dto;

import lombok.Data;
import java.time.LocalDate;

@Data
public class HistoricoHortaResponseDTO {
    private Long id;
    private Long plantioId;
    private String nomeCultura; 
    private String titulo;
    private String descricao;
    private String imagem;
    private LocalDate dataEvento;
}