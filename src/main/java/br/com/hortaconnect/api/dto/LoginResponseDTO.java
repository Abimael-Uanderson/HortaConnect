package br.com.hortaconnect.api.dto;

import lombok.Data;

@Data
public class LoginResponseDTO {
    private String token;
    private UsuarioResponseDTO usuario;
}