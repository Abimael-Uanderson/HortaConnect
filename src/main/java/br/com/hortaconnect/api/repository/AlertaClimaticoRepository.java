package br.com.hortaconnect.api.repository;

import br.com.hortaconnect.api.entity.AlertaClimatico;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AlertaClimaticoRepository extends JpaRepository<AlertaClimatico, Long> {
    List<AlertaClimatico> findByUsuarioId(Long usuarioId);
}
