package com.farmacia.controller;

import com.farmacia.dto.AlertaReposicaoResponse;
import com.farmacia.model.Venda;
import com.farmacia.service.VendaService;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/vendas")
public class VendaController {
    private final VendaService vendaService;

    public VendaController(VendaService vendaService) {
        this.vendaService = vendaService;
    }

    @PostMapping
    public ResponseEntity<?> realizarVenda(
            @RequestParam Long idCliente,
            @RequestParam Long idMedicamento,
            @RequestParam int quantidade,
            @RequestParam(required = false) Integer diasConsumo) {

        try {
            Venda venda = vendaService.realizarVenda(idCliente, idMedicamento, quantidade, diasConsumo);
            return ResponseEntity.status(HttpStatus.CREATED).body(venda);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Erro inesperado ao registrar venda.");
        }
    }

    @GetMapping
    public List<Venda> listarVendas() {
        return vendaService.listarVendas();
    }

    @GetMapping("/reposicoes")
    public List<AlertaReposicaoResponse> listarAlertasReposicao() {
        return vendaService.listarAlertasReposicao();
    }
}
