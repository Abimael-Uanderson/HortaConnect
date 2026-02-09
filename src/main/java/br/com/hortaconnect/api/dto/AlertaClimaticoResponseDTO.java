package br.com.hortaconnect.api.dto;
import br.com.hortaconnect.api.enums.TipoAlerta;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class AlertaClimaticoResponseDTO {
    private Long id;
    private TipoAlerta tipoAlerta;
    private String mensagem;
    private boolean lido;
    private LocalDateTime dataAlerta;
}