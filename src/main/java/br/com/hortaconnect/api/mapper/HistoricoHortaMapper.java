package br.com.hortaconnect.api.mapper;

import br.com.hortaconnect.api.dto.HistoricoHortaRequestDTO;
import br.com.hortaconnect.api.dto.HistoricoHortaResponseDTO;
import br.com.hortaconnect.api.entity.HistoricoHorta;
import org.springframework.stereotype.Component;

@Component
public class HistoricoHortaMapper {

    public HistoricoHortaResponseDTO toDTO(HistoricoHorta entity) {
        HistoricoHortaResponseDTO dto = new HistoricoHortaResponseDTO();

        dto.setId(entity.getId());
        dto.setTitulo(entity.getTitulo());
        dto.setDescricao(entity.getDescricao());
        dto.setImagem(entity.getImagem());
        dto.setDataEvento(entity.getDataEvento());

        if (entity.getPlantio() != null) {
            dto.setPlantioId(entity.getPlantio().getId());
            dto.setNomeCultura(entity.getPlantio().getNomeCultura());
        }

        return dto;
    }

    public HistoricoHorta toEntity(HistoricoHortaRequestDTO dto) {
        HistoricoHorta entity = new HistoricoHorta();

        entity.setTitulo(dto.getTitulo());
        entity.setDescricao(dto.getDescricao());
        entity.setImagem(dto.getImagem());
        entity.setDataEvento(dto.getDataEvento());

        return entity;
    }
}