package br.com.hortaconnect.api.mapper;

import br.com.hortaconnect.api.dto.PlantioRequestDTO;
import br.com.hortaconnect.api.dto.PlantioResponseDTO;
import br.com.hortaconnect.api.entity.Plantio;
import org.springframework.stereotype.Component;


@Component
public class PlantioMapper {

    public PlantioResponseDTO toDTO(Plantio plantio) {
        PlantioResponseDTO dto = new PlantioResponseDTO();

        dto.setId(plantio.getId());
        dto.setNomeCultura(plantio.getNomeCultura());
        dto.setCultivar(plantio.getCultivar());
        dto.setDataPlantio(plantio.getDataPlantio());
        dto.setTipoSolo(plantio.getTipoSolo());
        dto.setEstagioCrescimento(plantio.getEstagioCrescimento());
        dto.setAreaM2(plantio.getAreaM2());
        dto.setObservacoes(plantio.getObservacoes());
        dto.setAtivo(plantio.getAtivo());

        return dto;
    }

    public Plantio toEntity(PlantioRequestDTO dto) {
        Plantio plantio= new Plantio();

        plantio.setNomeCultura(dto.getNomeCultura());
        plantio.setCultivar(dto.getCultivar());
        plantio.setDataPlantio(dto.getDataPlantio());
        plantio.setTipoSolo(dto.getTipoSolo());
        plantio.setEstagioCrescimento(dto.getEstagioCrescimento());
        plantio.setAreaM2(dto.getAreaM2());
        plantio.setObservacoes(dto.getObservacoes());

        return plantio;
    }

    public void atualizarEntity(PlantioRequestDTO dto, Plantio plantio) {
        plantio.setNomeCultura(dto.getNomeCultura());
        plantio.setCultivar(dto.getCultivar());
        plantio.setDataPlantio(dto.getDataPlantio());
        plantio.setTipoSolo(dto.getTipoSolo());
        plantio.setEstagioCrescimento(dto.getEstagioCrescimento());
        plantio.setAreaM2(dto.getAreaM2());
        plantio.setObservacoes(dto.getObservacoes());
    }




}
