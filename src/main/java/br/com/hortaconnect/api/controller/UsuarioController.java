package br.com.hortaconnect.api.controller;

import br.com.hortaconnect.api.dto.LoginRequestDTO;
import br.com.hortaconnect.api.dto.LoginResponseDTO;
import br.com.hortaconnect.api.dto.UsuarioRequestDTO;
import br.com.hortaconnect.api.dto.UsuarioResponseDTO;
import br.com.hortaconnect.api.entity.Usuario;
import br.com.hortaconnect.api.service.UsuarioService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.context.SecurityContextHolder;

@RestController
@RequestMapping("/usuarios")
public class UsuarioController {


    private final UsuarioService usuarioService;

    public UsuarioController(UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }

    @GetMapping("/teste")
    public String boasVindas() {
        return "Boas vindas";
    }


    @PostMapping("/cadastro")
    public ResponseEntity<UsuarioResponseDTO> criarUsuario(@RequestBody  @Valid UsuarioRequestDTO usuario) {
        UsuarioResponseDTO usuarioSalvo = usuarioService.cadastrarUsuario(usuario);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(usuarioSalvo);
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponseDTO> login(@RequestBody LoginRequestDTO loginDto) {
        LoginResponseDTO loginResponse = usuarioService.login(loginDto);
        return ResponseEntity.ok(loginResponse);
    }

    @DeleteMapping("/excluir-conta/{id}")
    public ResponseEntity<?> apagarUsuario(@PathVariable Long id) {
        usuarioService.deletarUsuario(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/lista/{id}")
    public ResponseEntity<?> listarPorId(@PathVariable Long id) {
        UsuarioResponseDTO usuario = usuarioService.buscarUsuarioPorId(id);
        return ResponseEntity.ok(usuario);
    }





    //@DeleteMapping("apagar-conta")


}
