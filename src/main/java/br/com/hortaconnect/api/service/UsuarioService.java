package br.com.hortaconnect.api.service;


import br.com.hortaconnect.api.dto.LoginRequestDTO;
import br.com.hortaconnect.api.dto.LoginResponseDTO;
import br.com.hortaconnect.api.dto.UsuarioRequestDTO;
import br.com.hortaconnect.api.dto.UsuarioResponseDTO;
import br.com.hortaconnect.api.entity.Usuario;
import br.com.hortaconnect.api.mapper.UsuarioMapper;
import br.com.hortaconnect.api.repository.UsuarioRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final UsuarioMapper usuarioMapper;
    private final PasswordEncoder passwordEncoder;
    private final TokenService tokenService;

    public UsuarioService(UsuarioRepository usuarioRepository, UsuarioMapper usuarioMapper, PasswordEncoder passwordEncoder, TokenService tokenService) {
        this.usuarioRepository = usuarioRepository;
        this.usuarioMapper = usuarioMapper;
        this.passwordEncoder = passwordEncoder;
        this.tokenService = tokenService;
    }

    public UsuarioResponseDTO cadastrarUsuario(UsuarioRequestDTO dto) {
        Usuario usuario = usuarioMapper.toEntity(dto);
        String senhaCriptografada = passwordEncoder.encode(usuario.getSenha());
        usuario.setSenha(senhaCriptografada);

        usuario = usuarioRepository.save(usuario);
        return usuarioMapper.toDTO(usuario);
    }

    public LoginResponseDTO login(LoginRequestDTO loginData) {
        Usuario usuario = usuarioRepository.findByEmail(loginData.getEmail()).orElseThrow(() -> new RuntimeException ("Usuário ou senha inválidos"));

        boolean senhaBate = passwordEncoder.matches(loginData.getSenha(), usuario.getSenha());

        if(!senhaBate) {
            throw new RuntimeException("Usuário ou senha inválidos");
        }

        String token = tokenService.gerarToken(usuario);

        LoginResponseDTO resposta = new LoginResponseDTO();
        resposta.setToken(token);
        resposta.setUsuario(usuarioMapper.toDTO(usuario));
        return resposta;
    }

    public void deletarUsuario(Long id) {
        if (!usuarioRepository.existsById(id)) {
            throw new RuntimeException("Usuário não encontrado");
        }
        usuarioRepository.deleteById(id);
    }

    public UsuarioResponseDTO buscarUsuarioPorId(Long id) {
        return usuarioRepository.findById(id)
                .map(usuarioMapper::toDTO)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
    }


}
