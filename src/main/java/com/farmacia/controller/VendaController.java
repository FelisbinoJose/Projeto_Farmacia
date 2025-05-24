package com.farmacia.controller;

import com.farmacia.model.Venda;
import com.farmacia.service.VendaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/vendas")
public class VendaController {
    @Autowired
    private VendaService vendaService;

    @PostMapping
    public Venda registrarVenda(@RequestBody Venda venda) {
        return vendaService.registrarVenda(venda);
    }

    @GetMapping
    public List<Venda> listarVendas() {
        return vendaService.listarVendas();
    }
}