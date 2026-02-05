package br.com.hortaconnect.api.mapper;

import br.com.hortaconnect.api.dto.UsuarioRequestDTO;
import br.com.hortaconnect.api.dto.UsuarioResponseDTO;
import br.com.hortaconnect.api.entity.Usuario;
import org.springframework.stereotype.Component;

@Component
public class UsuarioMapper {

    public UsuarioResponseDTO toDTO(Usuario usuario) {
        UsuarioResponseDTO dto = new UsuarioResponseDTO();

        dto.setId(usuario.getId());
        dto.setNome(usuario.getNome());
        dto.setEmail(usuario.getEmail());
        dto.setTelefone(usuario.getTelefone());
        dto.setCep(usuario.getCep());
        dto.setCidade(usuario.getCidade());
        dto.setEstado(usuario.getEstado());
        dto.setDataCadastro(usuario.getDataCadastro());

        return dto;
    }

    public Usuario toEntity(UsuarioRequestDTO dto) {
        Usuario usuario = new Usuario();

        usuario.setNome(dto.getNome());
        usuario.setEmail(dto.getEmail());
        usuario.setTelefone(dto.getTelefone());
        usuario.setSenha(dto.getSenha());
        usuario.setCep(dto.getCep());
        usuario.setCidade(dto.getCidade());
        usuario.setEstado(dto.getEstado());

        return usuario;
    }
}
