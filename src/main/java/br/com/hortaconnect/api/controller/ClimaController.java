package br.com.hortaconnect.api.controller;

import br.com.hortaconnect.api.dto.ClimaAtualResponseDTO;
import br.com.hortaconnect.api.service.ClimaService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/clima")
public class ClimaController {

    private final ClimaService climaService;

    public ClimaController(ClimaService climaService) {
        this.climaService = climaService;
    }

    @GetMapping("/atual")
    public ResponseEntity<ClimaAtualResponseDTO> getClimaAtual() {
        return ResponseEntity.ok(climaService.obterClimaAtualDoUsuarioLogado());
    }
}