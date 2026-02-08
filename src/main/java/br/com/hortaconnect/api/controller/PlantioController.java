package br.com.hortaconnect.api.controller;

import br.com.hortaconnect.api.dto.PlantioRequestDTO;
import br.com.hortaconnect.api.dto.PlantioResponseDTO;
import br.com.hortaconnect.api.service.PlantioService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/plantios")
public class PlantioController {

    private final PlantioService plantioService;

    public PlantioController(PlantioService plantioService) {
        this.plantioService = plantioService;
    }

    @PostMapping
    public ResponseEntity<PlantioResponseDTO> criarPlantio(@RequestBody @Valid PlantioRequestDTO dto) {
        PlantioResponseDTO  plantioSalvo = plantioService.cadastrarPlantio(dto);

        return ResponseEntity.status(HttpStatus.CREATED).body(plantioSalvo);
    }

    @GetMapping
    public ResponseEntity<List<PlantioResponseDTO>> listarPlantios() {
        List<PlantioResponseDTO> plantios = plantioService.listarPlantios();

        return ResponseEntity.ok(plantios);
    }

    @GetMapping("/{id}")
    public ResponseEntity<PlantioResponseDTO> buscarPorId(@PathVariable Long id) {
        PlantioResponseDTO plantio = plantioService.buscarPorId(id);

        return ResponseEntity.ok(plantio);
    }

    @PutMapping("/{id}")
    public ResponseEntity<PlantioResponseDTO> atualizar(@PathVariable Long id, @RequestBody @Valid PlantioRequestDTO dto) {
        PlantioResponseDTO plantioAtualizado = plantioService.atualizarPlantio(id, dto);

        return ResponseEntity.ok(plantioAtualizado);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        plantioService.deletarPlantio(id);

        return ResponseEntity.noContent().build();
    }

}
