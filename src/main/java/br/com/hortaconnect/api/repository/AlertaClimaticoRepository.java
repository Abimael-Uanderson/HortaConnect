package br.com.hortaconnect.api.repository;
import br.com.hortaconnect.api.entity.AlertaClimatico;
import br.com.hortaconnect.api.enums.TipoAlerta;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDateTime;
import java.util.List;

public interface AlertaClimaticoRepository extends JpaRepository<AlertaClimatico, Long> {

    List<AlertaClimatico> findByUsuarioIdOrderByLidoAscDataCriacaoDesc(Long usuarioId);

    boolean existsByUsuarioIdAndTipoAlertaAndDataAlerta(Long usuarioId, TipoAlerta tipoAlerta, LocalDateTime dataAlerta);
}