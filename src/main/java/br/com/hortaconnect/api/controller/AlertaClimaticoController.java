package br.com.hortaconnect.api.controller;
import br.com.hortaconnect.api.dto.AlertaClimaticoResponseDTO;
import br.com.hortaconnect.api.service.AlertaClimaticoService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/alertas")
public class AlertaClimaticoController {
    private final AlertaClimaticoService service;

    public AlertaClimaticoController(AlertaClimaticoService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<AlertaClimaticoResponseDTO>> listar() {
        return ResponseEntity.ok(service.listarMeusAlertas());
    }

    @PatchMapping("/{id}/lido")
    public ResponseEntity<Void> marcarLido(@PathVariable Long id) {
        service.marcarComoLido(id);
        return ResponseEntity.noContent().build();
    }
}