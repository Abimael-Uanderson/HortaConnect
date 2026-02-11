package br.com.hortaconnect.api.controller;

import br.com.hortaconnect.api.dto.HistoricoHortaRequestDTO;
import br.com.hortaconnect.api.dto.HistoricoHortaResponseDTO;
import br.com.hortaconnect.api.service.HistoricoHortaService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/historico")
public class HistoricoHortaController {

    private final HistoricoHortaService historicoService;

    public HistoricoHortaController(HistoricoHortaService historicoService) {
        this.historicoService = historicoService;
    }

    @PostMapping
    public ResponseEntity<HistoricoHortaResponseDTO> registrar(@RequestBody @Valid HistoricoHortaRequestDTO dto) {
        HistoricoHortaResponseDTO salvo = historicoService.registrar(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(salvo);
    }

    @GetMapping("/plantio/{plantioId}")
    public ResponseEntity<List<HistoricoHortaResponseDTO>> listar(@PathVariable Long plantioId) {
        List<HistoricoHortaResponseDTO> timeline = historicoService.listar(plantioId);
        return ResponseEntity.ok(timeline);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable Long id) {
        historicoService.excluir(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<HistoricoHortaResponseDTO> atualizar(@PathVariable Long id, @RequestBody @Valid HistoricoHortaRequestDTO dto) {
        HistoricoHortaResponseDTO atualizado = historicoService.atualizar(id, dto);
        return ResponseEntity.ok(atualizado);
    }

}