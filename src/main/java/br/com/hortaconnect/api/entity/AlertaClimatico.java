package br.com.hortaconnect.api.entity;

import br.com.hortaconnect.api.enums.TipoAlerta; // Vamos criar esse arquivo já já
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "alertas_climaticos")
public class AlertaClimatico {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;

    @Enumerated(EnumType.STRING)
    @Column(name = "tipo_alerta", length = 50, nullable = false)
    private TipoAlerta tipoAlerta;

    @Column(nullable = false)
    private String mensagem;

    @Column(name = "data_alerta")
    private LocalDateTime dataAlerta;

    private boolean lido;

    @Column(name = "data_criacao", updatable = false)
    private LocalDateTime dataCriacao;

    @PrePersist
    public void prePersist() {
        this.dataCriacao = LocalDateTime.now();
        this.lido = false;

        if (this.dataAlerta == null) {
            this.dataAlerta = LocalDateTime.now();
        }
    }
}