package br.com.hortaconnect.api.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ProdutoCotacaoDTO {
    private String nome;
    private String preco;
    private String estabelecimento;
    private String bairro;
    private String dataHora;
    private Double latitude;
    private Double longitude;
    private String logradouro;
    private String numero;
}