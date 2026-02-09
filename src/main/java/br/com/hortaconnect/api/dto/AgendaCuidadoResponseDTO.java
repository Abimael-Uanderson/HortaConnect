package br.com.hortaconnect.api.dto;

import br.com.hortaconnect.api.enums.StatusCuidado;
import br.com.hortaconnect.api.enums.TipoCuidado;
import lombok.Data;

import java.time.LocalDate;

@Data
public class AgendaCuidadoResponseDTO {
    private Long id;
    private Long plantioId;
    private String nomeCultura;
    private TipoCuidado tipoCuidado;
    private LocalDate dataAgendamento;
    private String descricao;
    private StatusCuidado statusCuidado;
}
