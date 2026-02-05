package br.com.hortaconnect.api.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class UsuarioResponseDTO {

    private Long id;
    private String nome;
    private String email;
    private String telefone;
    private String cep;
    private String cidade;
    private String estado;
    private LocalDateTime dataCadastro;
}
