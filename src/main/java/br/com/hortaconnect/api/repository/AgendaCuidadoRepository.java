package br.com.hortaconnect.api.repository;

import br.com.hortaconnect.api.entity.AgendaCuidado;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface AgendaCuidadoRepository extends JpaRepository<AgendaCuidado, Long> {
    List<AgendaCuidado> findByPlantioId(Long PlantioId);

}
