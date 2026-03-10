package br.com.hortaconnect.api.service;

import br.com.hortaconnect.api.dto.PlantioRequestDTO;
import br.com.hortaconnect.api.dto.PlantioResponseDTO;
import br.com.hortaconnect.api.entity.Plantio;
import br.com.hortaconnect.api.entity.Usuario;
import br.com.hortaconnect.api.enums.EstagioCrescimento;
import br.com.hortaconnect.api.mapper.PlantioMapper;
import br.com.hortaconnect.api.repository.PlantioRepository;
import br.com.hortaconnect.api.repository.UsuarioRepository;
import org.springframework.stereotype.Service;
import org.springframework.security.core.context.SecurityContextHolder;


import java.util.List;


@Service
public class PlantioService {

    private final PlantioRepository plantioRepository;
    private final PlantioMapper plantioMapper;
    private final UsuarioRepository usuarioRepository;

    public PlantioService(PlantioRepository plantioRepository, PlantioMapper plantioMapper, UsuarioRepository usuarioRepository) {
        this.plantioRepository = plantioRepository;
        this.plantioMapper = plantioMapper;
        this.usuarioRepository = usuarioRepository;
    }

    public PlantioResponseDTO cadastrarPlantio(PlantioRequestDTO dto) {
        Usuario usuarioLogado = (Usuario) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        Plantio plantio = plantioMapper.toEntity(dto);
        plantio.setUsuario(usuarioLogado);
        plantio = plantioRepository.save(plantio);

        return plantioMapper.toDTO(plantio);
    }

    public List<PlantioResponseDTO> listarPlantios(String estagioFiltro) {
        Usuario usuarioLogado =  (Usuario) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Long usuarioId = usuarioLogado.getId();

        List<Plantio> plantios;

        // Verifica se o filtro veio preenchido e é diferente de "TODOS"
        if (estagioFiltro != null && !estagioFiltro.trim().isEmpty() && !estagioFiltro.equalsIgnoreCase("TODOS")) {
            try {
                // Converte a String (ex: "GERMINACAO") para o Enum
                EstagioCrescimento estagioEnum = EstagioCrescimento.valueOf(estagioFiltro.toUpperCase());
                // Busca filtrando pelo estágio
                plantios = plantioRepository.findAllByUsuarioIdAndEstagioCrescimentoAndAtivoTrue(usuarioId, estagioEnum);
            } catch (IllegalArgumentException e) {
                // Se o frontend enviar um estágio inválido que não existe no Enum, ignoramos o erro e buscamos todos
                plantios = plantioRepository.findAllByUsuarioIdAndAtivoTrue(usuarioId);
            }
        } else {
            // Sem filtro, busca todos
            plantios = plantioRepository.findAllByUsuarioIdAndAtivoTrue(usuarioId);
        }

        return plantios.stream()
                .map(plantioMapper::toDTO)
                .toList();
    }

    public PlantioResponseDTO buscarPorId(Long id) {
        Usuario usuarioLogado =  (Usuario) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        Plantio plantio = plantioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Plantio não encontrado"));

        if(!plantio.getUsuario().getId().equals(usuarioLogado.getId())) {
            throw new RuntimeException("Acesso Negado: Você não é o dono deste plantio!");
        }

        return plantioMapper.toDTO(plantio);
    }

    @org.springframework.transaction.annotation.Transactional
    public PlantioResponseDTO atualizarPlantio(Long id, PlantioRequestDTO dto) {
        Usuario usuarioLogado = (Usuario) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        Plantio plantio = plantioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Plantio não encontrado"));

        if (!plantio.getUsuario().getId().equals(usuarioLogado.getId())) {
            throw new RuntimeException("Acesso Negado: Você não pode alterar esse plantio!");
        }

        plantioMapper.atualizarEntity(dto, plantio);
        plantio = plantioRepository.save(plantio);

        return plantioMapper.toDTO(plantio);
    }

    @org.springframework.transaction.annotation.Transactional
    public void deletarPlantio(Long id) {
        Usuario usuarioLogado = (Usuario) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        Plantio plantio = plantioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Plantio não encontrado"));

        if (!plantio.getUsuario().getId().equals(usuarioLogado.getId())) {
            throw new RuntimeException("Acesso Negado: Você não pode excluir esse plantio!");
        }

        plantio.setAtivo(false);
        plantioRepository.save(plantio);
    }
}
