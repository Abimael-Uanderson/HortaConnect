package br.com.hortaconnect.api.controller;

import br.com.hortaconnect.api.dto.AgendaCuidadoRequestDTO;
import br.com.hortaconnect.api.dto.AgendaCuidadoResponseDTO;
import br.com.hortaconnect.api.service.AgendaCuidadoService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("agenda-cuidados")
public class AgendaCuidadoController {
    private final AgendaCuidadoService agendaCuidadoService;

    public AgendaCuidadoController(AgendaCuidadoService agendaCuidadoService) {
        this.agendaCuidadoService = agendaCuidadoService;
    }

    @PostMapping
    public ResponseEntity<AgendaCuidadoResponseDTO> agendar(@RequestBody @Valid AgendaCuidadoRequestDTO dto) {
        AgendaCuidadoResponseDTO cuidadoSalvo = agendaCuidadoService.agendarCuidado(dto);

        return ResponseEntity.status(HttpStatus.CREATED).body(cuidadoSalvo);
    }

    @GetMapping("/plantio/{plantioId}")
    public ResponseEntity<List<AgendaCuidadoResponseDTO>> listarPorPlantio(@PathVariable Long plantioId) {
        List<AgendaCuidadoResponseDTO> cuidados = agendaCuidadoService.listarPorPlantio(plantioId);

        return ResponseEntity.ok(cuidados);
    }

    @PatchMapping("/{id}/concluir")
    public ResponseEntity<AgendaCuidadoResponseDTO> concluir(@PathVariable Long id) {
        AgendaCuidadoResponseDTO cuidadoConcluido = agendaCuidadoService.concluirCuidado(id);

        return ResponseEntity.ok(cuidadoConcluido);
    }

    @PatchMapping("/{id}/cancelar")
    public ResponseEntity<Void> cancelar(@PathVariable Long id) {
        agendaCuidadoService.cancelarCuidado(id);

        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<AgendaCuidadoResponseDTO> atualizar(@PathVariable Long id, @RequestBody @Valid AgendaCuidadoRequestDTO dto) {
        AgendaCuidadoResponseDTO atualizado = agendaCuidadoService.atualizarCuidado(id, dto);
        return ResponseEntity.ok(atualizado);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        agendaCuidadoService.deletarCuidado(id);
        return ResponseEntity.noContent().build();
    }

}
