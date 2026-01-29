package br.com.hortaconnect.api.controller;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping
public class UsuarioController {



    @GetMapping("/teste")
    public String boasVindas() {
        return "Boas vindas";
    }
    //@PostMapping("/cadastro")



    //@PostMapping("/login")


    //@DeleteMapping("apagar-conta")


}
