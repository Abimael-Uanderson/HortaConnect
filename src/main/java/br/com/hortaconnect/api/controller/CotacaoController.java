package br.com.hortaconnect.api.controller;

import br.com.hortaconnect.api.dto.ProdutoCotacaoDTO;
import br.com.hortaconnect.api.service.CotacaoService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cotacoes")
public class CotacaoController {

    private final CotacaoService service;

    public CotacaoController(CotacaoService service) {
        this.service = service;
    }

    @GetMapping("/buscar")
    public ResponseEntity<List<ProdutoCotacaoDTO>> buscar(@RequestParam String termo) {

        System.out.println("💰 RECEBI PEDIDO DE COTAÇÃO PARA: " + termo);

        return ResponseEntity.ok(service.buscarMelhorPreco(termo));
    }
}