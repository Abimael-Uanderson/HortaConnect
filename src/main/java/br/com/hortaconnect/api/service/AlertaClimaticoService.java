package br.com.hortaconnect.api.service;

import br.com.hortaconnect.api.dto.AlertaClimaticoResponseDTO;
import br.com.hortaconnect.api.entity.AlertaClimatico;
import br.com.hortaconnect.api.entity.Usuario;
import br.com.hortaconnect.api.enums.TipoAlerta;
import br.com.hortaconnect.api.repository.AlertaClimaticoRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class AlertaClimaticoService {

    private final AlertaClimaticoRepository alertaRepository;

    public AlertaClimaticoService(AlertaClimaticoRepository alertaRepository) {
        this.alertaRepository = alertaRepository;
    }

    @Transactional
    public void criarAlertaSeNaoExistir(Usuario usuario, TipoAlerta tipo, String msg, LocalDateTime dataAlerta) {
        // Evita spam verificando se já existe alerta para aquela data
        boolean existe = alertaRepository.existsByUsuarioIdAndTipoAlertaAndDataAlerta(
                usuario.getId(), tipo, dataAlerta
        );
        if (existe) return;

        AlertaClimatico alerta = new AlertaClimatico();
        alerta.setUsuario(usuario);
        alerta.setTipoAlerta(tipo);
        alerta.setMensagem(msg);
        alerta.setDataAlerta(dataAlerta);
        alertaRepository.save(alerta);
        System.out.println("✅ Alerta criado: " + msg);
    }

    public List<AlertaClimaticoResponseDTO> listarMeusAlertas() {
        Usuario usuario = (Usuario) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return alertaRepository.findByUsuarioIdOrderByLidoAscDataCriacaoDesc(usuario.getId())
                .stream().map(this::toDTO).toList();
    }

    @Transactional
    public void marcarComoLido(Long id) {
        Usuario usuario = (Usuario) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        AlertaClimatico alerta = alertaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Alerta não encontrado"));

        if (!alerta.getUsuario().getId().equals(usuario.getId())) throw new RuntimeException("Acesso Negado");

        alerta.setLido(true);
        alertaRepository.save(alerta);
    }

    private AlertaClimaticoResponseDTO toDTO(AlertaClimatico entity) {
        AlertaClimaticoResponseDTO dto = new AlertaClimaticoResponseDTO();
        dto.setId(entity.getId());
        dto.setTipoAlerta(entity.getTipoAlerta());
        dto.setMensagem(entity.getMensagem());
        dto.setLido(entity.isLido());
        dto.setDataAlerta(entity.getDataAlerta());
        return dto;
    }
}