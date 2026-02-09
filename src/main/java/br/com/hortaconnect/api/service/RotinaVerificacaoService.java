package br.com.hortaconnect.api.service;

import br.com.hortaconnect.api.entity.AgendaCuidado;
import br.com.hortaconnect.api.enums.StatusCuidado;
import br.com.hortaconnect.api.repository.AgendaCuidadoRepository;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
public class RotinaVerificacaoService {

    private final AgendaCuidadoRepository repository;

    public RotinaVerificacaoService(AgendaCuidadoRepository repository) {
        this.repository = repository;
    }
    
    @Scheduled(cron = "0 0 0 * * *")
    @Transactional
    public void verificarAtrasos() {
        System.out.println("🤖 Robô Horta: Iniciando verificação diária...");

        LocalDate hoje = LocalDate.now();

        List<AgendaCuidado> atrasados = repository.findByStatusCuidadoAndDataAgendamentoBefore(
                StatusCuidado.PENDENTE,
                hoje
        );

        if (atrasados.isEmpty()) {
            System.out.println("✅ Nenhuma tarefa atrasada encontrada.");
        } else {
            atrasados.forEach(cuidado -> {
                cuidado.setStatusCuidado(StatusCuidado.ATRASADO);
                System.out.println("⚠️ Tarefa ID " + cuidado.getId() + " marcada como ATRASADA.");
            });

            repository.saveAll(atrasados);
            System.out.println("🏁 Total atualizado: " + atrasados.size());
        }
    }
}