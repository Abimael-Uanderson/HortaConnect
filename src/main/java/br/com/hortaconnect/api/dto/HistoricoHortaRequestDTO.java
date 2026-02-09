package br.com.hortaconnect.api.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PastOrPresent;
import lombok.Data;

import java.time.LocalDate;

@Data
public class HistoricoHortaRequestDTO {

    @NotNull(message = "O ID do plantio é obrigatório")
    private Long plantioId;

    @NotBlank(message = "O título do evento é obrigatório")
    private String titulo;

    @NotBlank(message = "A descrição é obrigatória")
    private String descricao;

    private String imagem;

    @NotNull(message = "A data do evento é obrigatória")
    @PastOrPresent(message = "A data do histórico deve ser hoje ou no passado")
    private LocalDate dataEvento;
}