package br.com.hortaconnect.api.service;

import br.com.hortaconnect.api.dto.AgendaCuidadoRequestDTO;
import br.com.hortaconnect.api.dto.AgendaCuidadoResponseDTO;
import br.com.hortaconnect.api.entity.AgendaCuidado;
import br.com.hortaconnect.api.entity.Plantio;
import br.com.hortaconnect.api.entity.Usuario;
import br.com.hortaconnect.api.enums.StatusCuidado;
import br.com.hortaconnect.api.mapper.AgendaCuidadoMapper;
import br.com.hortaconnect.api.repository.AgendaCuidadoRepository;
import br.com.hortaconnect.api.repository.PlantioRepository;
import jakarta.transaction.Transactional;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
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
    public AgendaCuidadoResponseDTO agendarCuidado(AgendaCuidadoRequestDTO dto) {
        Usuario usuarioLogado = (Usuario) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        Plantio plantio = plantioRepository.findById(dto.getPlantioId())
                .orElseThrow(() -> new RuntimeException("Plantio não encontrado"));

        if (!plantio.getUsuario().getId().equals(usuarioLogado.getId())) {
            throw new RuntimeException("Acesso Negado: Você não pode agendar cuidado em plantio de outro usuário!");
        }

        AgendaCuidado cuidado = agendaCuidadoMapper.toEntity(dto);
        cuidado.setPlantio(plantio);
        cuidado = agendaCuidadoRepository.save(cuidado);

        return agendaCuidadoMapper.toDTO(cuidado);
    }

    public List<AgendaCuidadoResponseDTO> listarPorPlantio(Long plantioId) {
        Usuario usuarioLogado = (Usuario) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        Plantio plantio = plantioRepository.findById(plantioId)
                .orElseThrow(() -> new RuntimeException("Plantio não encontrado"));


        if (!plantio.getUsuario().getId().equals(usuarioLogado.getId())) {
            throw new RuntimeException("Acesso Negado: Você não pode ver a agenda de outro usuário!");
        }

        return agendaCuidadoRepository.findByPlantioId(plantioId)
                .stream()
                .map(agendaCuidadoMapper::toDTO)
                .toList();
    }

    @Transactional
    public AgendaCuidadoResponseDTO concluirCuidado(Long id) {
        Usuario usuarioLogado = (Usuario) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        AgendaCuidado cuidado = agendaCuidadoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Agendamento não encontrado"));

        if (!cuidado.getPlantio().getUsuario().getId().equals(usuarioLogado.getId())) {
            throw new RuntimeException("Acesso Negado: Você não pode concluir tarefas de outro usuário!");
        }

        cuidado.setStatusCuidado(StatusCuidado.CONCLUIDO);
        cuidado = agendaCuidadoRepository.save(cuidado);

        return agendaCuidadoMapper.toDTO(cuidado);
    }

    @Transactional
    public void cancelarCuidado(Long id) {
        Usuario usuarioLogado = (Usuario) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        AgendaCuidado cuidado = agendaCuidadoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Agendamento não encontrado"));

        if (!cuidado.getPlantio().getUsuario().getId().equals(usuarioLogado.getId())) {
            throw new RuntimeException("Acesso Negado: Você não pode cancelar tarefas de outro usuário!");
        }

        if (cuidado.getStatusCuidado() == br.com.hortaconnect.api.enums.StatusCuidado.CONCLUIDO) {
            throw new RuntimeException("Erro: Não é possível cancelar uma tarefa que já foi realizada!");
        }

        cuidado.setStatusCuidado(br.com.hortaconnect.api.enums.StatusCuidado.CANCELADO);
        agendaCuidadoRepository.save(cuidado);
    }

    @Transactional
    public AgendaCuidadoResponseDTO atualizarCuidado(Long id, AgendaCuidadoRequestDTO dto) {
        Usuario usuarioLogado = (Usuario) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        AgendaCuidado cuidado = agendaCuidadoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Agendamento não encontrado"));

        if (!cuidado.getPlantio().getUsuario().getId().equals(usuarioLogado.getId())) {
            throw new RuntimeException("Acesso Negado: Você não pode alterar tarefas de outro usuário!");
        }

        if (cuidado.getStatusCuidado() == StatusCuidado.CONCLUIDO || cuidado.getStatusCuidado() == StatusCuidado.CANCELADO) {
            throw new RuntimeException("Não é possível editar uma tarefa que já foi finalizada!");
        }

        agendaCuidadoMapper.atualizarEntity(dto, cuidado);

        // 4. Salva e Retorna
        cuidado = agendaCuidadoRepository.save(cuidado);
        return agendaCuidadoMapper.toDTO(cuidado);
    }

    @Transactional
    public void deletarCuidado(Long id) {
        Usuario usuarioLogado = (Usuario) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        AgendaCuidado cuidado = agendaCuidadoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Agendamento não encontrado"));

        if (!cuidado.getPlantio().getUsuario().getId().equals(usuarioLogado.getId())) {
            throw new RuntimeException("Acesso Negado: Você não pode excluir tarefas de outro usuário!");
        }

        agendaCuidadoRepository.delete(cuidado);
    }
}
