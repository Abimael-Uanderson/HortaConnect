package br.com.hortaconnect.api.mapper;

import br.com.hortaconnect.api.dto.AgendaCuidadoRequestDTO;
import br.com.hortaconnect.api.dto.AgendaCuidadoResponseDTO;
import br.com.hortaconnect.api.entity.AgendaCuidado;
import org.springframework.stereotype.Component;

@Component
public class AgendaCuidadoMapper {

    public AgendaCuidadoResponseDTO toDTO(AgendaCuidado entity) {
        AgendaCuidadoResponseDTO dto = new AgendaCuidadoResponseDTO();

        dto.setId(entity.getId());
        dto.setTipoCuidado(entity.getTipoCuidado());
        dto.setDataAgendamento(entity.getDataAgendamento());
        dto.setDescricao(entity.getDescricao());
        dto.setStatusCuidado(entity.getStatusCuidado());

        if (entity.getPlantio() != null) {
            dto.setPlantioId(entity.getPlantio().getId());
            dto.setNomeCultura(entity.getPlantio().getNomeCultura());
        }

        return dto;
    }

    public AgendaCuidado toEntity(AgendaCuidadoRequestDTO dto) {
        AgendaCuidado entity = new AgendaCuidado();

        entity.setTipoCuidado(dto.getTipoCuidado());
        entity.setDataAgendamento(dto.getDataAgendamento());
        entity.setDescricao(dto.getDescricao());

        return entity;
    }

    public void atualizarEntity(AgendaCuidadoRequestDTO dto, AgendaCuidado entity) {
        entity.setTipoCuidado(dto.getTipoCuidado());
        entity.setDataAgendamento(dto.getDataAgendamento());
        entity.setDescricao(dto.getDescricao());

    }
}