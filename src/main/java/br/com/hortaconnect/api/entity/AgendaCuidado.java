package br.com.hortaconnect.api.entity;

import br.com.hortaconnect.api.enums.StatusCuidado;
import br.com.hortaconnect.api.enums.TipoCuidado;
import jakarta.persistence.Entity;
import jakarta.persistence.*;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "agenda_cuidados")
public class AgendaCuidado {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "plantio_id", nullable = false)
    private Plantio plantio;

    @Enumerated(EnumType.STRING)
    @Column(name = "tipo_cuidado", length = 50)
    private TipoCuidado tipoCuidado;

    @Column(name = "data_agendamento")
    private LocalDate dataAgendamento;

    @Column(columnDefinition = "TEXT")
    private String descricao;

    @Enumerated(EnumType.STRING)
    @Column(name = "status_cuidado", length = 50)
    private StatusCuidado statusCuidado;

    @Column(name = "data_cadastro", updatable = false)
    private LocalDateTime dataCadastro;

    @Column(name = "data_atualizacao")
    private LocalDateTime dataAtualizacao;

    @PrePersist
    public void prePersist() {
        this.dataCadastro = LocalDateTime.now();
        if (this.statusCuidado == null) {
            this.statusCuidado = StatusCuidado.PENDENTE;
        }
    }

    @PreUpdate
    public void preUpdate() {
        this.dataAtualizacao = LocalDateTime.now();
    }

}
