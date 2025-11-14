package com.farmacia.controller;

import com.farmacia.model.Venda;
import com.farmacia.service.VendaService;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/vendas")
public class VendaController {
    private static final org.slf4j.Logger logger = org.slf4j.LoggerFactory.getLogger(VendaController.class);

    @Autowired
    private VendaService vendaService;

    public VendaController(VendaService vendaService) {
        this.vendaService = vendaService;
    }

    @PostMapping
    public ResponseEntity<Venda> realizarVenda(
            @RequestParam Long idCliente,
            @RequestParam Long idMedicamento,
            @RequestParam int quantidade) {

        try {
            Venda venda = vendaService.realizarVenda(idCliente, idMedicamento, quantidade);
            return ResponseEntity.status(HttpStatus.CREATED).body(venda);
        } catch (IllegalArgumentException e) {
            System.out.println("Erro de validação:" + e.getMessage());
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            System.out.println("Erro inesperado" + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping
    public List<Venda> listarVendas() {
        try {
            return vendaService.listarVendas();
        } catch (Exception e) {
            throw new RuntimeException("Erro ao listar vendas", e);
        }
    }
}