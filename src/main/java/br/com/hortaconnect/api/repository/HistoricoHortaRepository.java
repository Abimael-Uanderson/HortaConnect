package br.com.hortaconnect.api.repository;

import br.com.hortaconnect.api.entity.HistoricoHorta;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HistoricoHortaRepository extends JpaRepository<HistoricoHorta, Long> {
    List<HistoricoHorta> findByPlantioId(Long plantioId);
    List<HistoricoHorta> findByPlantioIdOrderByDataEventoDesc(Long plantioId);
}
