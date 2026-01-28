package br.com.hortaconnect.api.entity;

import br.com.hortaconnect.api.enums.EstagioCrescimento;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "plantios")
public class Plantio {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;

    @Column(name = "nome_cultura", nullable = false, length = 120)
    private String nomeCultura;

    @Column(length = 120)
    private String cultivar;

    @Column(name = "data_plantio")
    private LocalDate dataPlantio;

    @Column(name = "tipo_solo", length = 80)
    private String tipoSolo;

    @Enumerated(EnumType.STRING)
    @Column(name = "estagio_crescimento", length = 50)
    private EstagioCrescimento estagioCrescimento;

    @Column(name = "area_m2", precision = 8, scale = 2)
    private BigDecimal areaM2;

    private Boolean ativo;

    @Column(columnDefinition = "TEXT")
    private String observacoes;

    @Column(name = "data_criacao", updatable = false)
    private LocalDateTime dataCriacao;

    @Column(name = "data_atualizacao")
    private LocalDateTime dataAtualizacao;

    @PrePersist
    public void prePersist() {
        this.dataCriacao = LocalDateTime.now();
        if (this.ativo == null) {
            this.ativo = true;
        }
    }

    @PreUpdate
    public void preUpdate() {
        this.dataAtualizacao = LocalDateTime.now();
    }
}
