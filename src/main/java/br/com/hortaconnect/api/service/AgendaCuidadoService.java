package br.com.hortaconnect.api.service;

import br.com.hortaconnect.api.dto.AgendaCuidadoRequestDTO;
import br.com.hortaconnect.api.dto.AgendaCuidadoResponseDTO;
import br.com.hortaconnect.api.entity.AgendaCuidado;
import br.com.hortaconnect.api.entity.Plantio;
import br.com.hortaconnect.api.entity.Usuario;
import br.com.hortaconnect.api.mapper.AgendaCuidadoMapper;
import br.com.hortaconnect.api.repository.AgendaCuidadoRepository;
import br.com.hortaconnect.api.repository.PlantioRepository;
import jakarta.transaction.Transactional;
import org.springframework.security.core.context.SecurityContextHolder;

public class AgendaCuidadoService {

    private final AgendaCuidadoRepository agendaCuidadoRepository;
    private final PlantioRepository plantioRepository;
    private final AgendaCuidadoMapper agendaCuidadoMapper;

    public AgendaCuidadoService(AgendaCuidadoRepository agendaCuidadoRepository, PlantioRepository plantioRepository, AgendaCuidadoMapper agendaCuidadoMapper) {
        this.agendaCuidadoRepository = agendaCuidadoRepository;
        this.plantioRepository = plantioRepository;
        this.agendaCuidadoMapper = agendaCuidadoMapper;
    }

    @Transactional
    public AgendaCuidadoResponseDTO agendaCuidado(AgendaCuidadoRequestDTO dto) {
        Usuario usuarioLogado = (Usuario) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        Plantio plantio = plantioRepository.findById(dto.getPlantioId())
                .orElseThrow(() -> new RuntimeException("Plantio não encontrado"));

        AgendaCuidado cuidado = agendaCuidadoMapper.toEntity(dto);
        cuidado.setPlantio(plantio);
        cuidado = agendaCuidadoRepository.save(cuidado);

        // 7. Retornar DTO
        return agendaCuidadoMapper.toDTO(cuidado);
    }
}
