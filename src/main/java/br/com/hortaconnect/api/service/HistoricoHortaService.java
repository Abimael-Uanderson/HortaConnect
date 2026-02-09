package br.com.hortaconnect.api.service;

import br.com.hortaconnect.api.dto.HistoricoHortaRequestDTO;
import br.com.hortaconnect.api.dto.HistoricoHortaResponseDTO;
import br.com.hortaconnect.api.entity.HistoricoHorta;
import br.com.hortaconnect.api.entity.Plantio;
import br.com.hortaconnect.api.entity.Usuario;
import br.com.hortaconnect.api.mapper.HistoricoHortaMapper;
import br.com.hortaconnect.api.repository.HistoricoHortaRepository;
import br.com.hortaconnect.api.repository.PlantioRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class HistoricoHortaService {

    private final HistoricoHortaRepository historicoRepository;
    private final PlantioRepository plantioRepository;
    private final HistoricoHortaMapper historicoMapper;

    public HistoricoHortaService(HistoricoHortaRepository historicoRepository,
                                 PlantioRepository plantioRepository,
                                 HistoricoHortaMapper historicoMapper) {
        this.historicoRepository = historicoRepository;
        this.plantioRepository = plantioRepository;
        this.historicoMapper = historicoMapper;
    }

    @Transactional
    public HistoricoHortaResponseDTO registrar(HistoricoHortaRequestDTO dto) {
        Usuario usuarioLogado = (Usuario) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        Plantio plantio = plantioRepository.findById(dto.getPlantioId())
                .orElseThrow(() -> new RuntimeException("Plantio não encontrado"));

        if (!plantio.getUsuario().getId().equals(usuarioLogado.getId())) {
            throw new RuntimeException("Acesso Negado: Você não pode adicionar histórico no plantio de outro usuário!");
        }

        HistoricoHorta historico = historicoMapper.toEntity(dto);
        historico.setPlantio(plantio);

        historico = historicoRepository.save(historico);

        return historicoMapper.toDTO(historico);
    }

    public List<HistoricoHortaResponseDTO> listar(Long plantioId) {
        Usuario usuarioLogado = (Usuario) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        Plantio plantio = plantioRepository.findById(plantioId)
                .orElseThrow(() -> new RuntimeException("Plantio não encontrado"));

        if (!plantio.getUsuario().getId().equals(usuarioLogado.getId())) {
            throw new RuntimeException("Acesso Negado!");
        }

        return historicoRepository.findByPlantioIdOrderByDataEventoDesc(plantioId)
                .stream()
                .map(historicoMapper::toDTO)
                .toList();
    }

    @Transactional
    public void excluir(Long id) {
        Usuario usuarioLogado = (Usuario) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        HistoricoHorta historico = historicoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Evento não encontrado"));

        if (!historico.getPlantio().getUsuario().getId().equals(usuarioLogado.getId())) {
            throw new RuntimeException("Acesso Negado!");
        }

        historicoRepository.delete(historico);
    }

    @Transactional
    public HistoricoHortaResponseDTO atualizar(Long id, HistoricoHortaRequestDTO dto) {
        Usuario usuarioLogado = (Usuario) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        HistoricoHorta historico = historicoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Evento não encontrado"));

        if (!historico.getPlantio().getUsuario().getId().equals(usuarioLogado.getId())) {
            throw new RuntimeException("Acesso Negado: Você não pode alterar o histórico de outro usuário!");
        }

        historicoMapper.atualizarEntity(dto, historico);

        historico = historicoRepository.save(historico);

        return historicoMapper.toDTO(historico);
    }

}