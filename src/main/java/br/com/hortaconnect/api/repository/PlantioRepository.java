package br.com.hortaconnect.api.repository;

import br.com.hortaconnect.api.entity.Plantio;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PlantioRepository extends JpaRepository<Plantio, Long> {
    List<Plantio> findByUsuarioId(Long usuarioId);
    List<Plantio> findAllByUsuarioIdAndAtivoTrue(Long usuarioId);
}
