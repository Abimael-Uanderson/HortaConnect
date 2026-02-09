package br.com.hortaconnect.api.dto;

import br.com.hortaconnect.api.entity.Plantio;
import br.com.hortaconnect.api.enums.StatusCuidado;
import br.com.hortaconnect.api.enums.TipoCuidado;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;

@Data
public class AgendaCuidadoRequestDTO {

    @NotNull(message = "O ID do plantio é obrigatório")
    private Long plantioId;

    @NotNull(message = "O tipo de cuidado é obrigatório")
    private TipoCuidado tipoCuidado;

    @NotNull(message = "A data do agendamento é obrigatória")
    @FutureOrPresent(message = "A data deve ser hoje ou no futuro")
    private LocalDate dataAgendamento;

    @NotBlank
    private String descricao;

}
