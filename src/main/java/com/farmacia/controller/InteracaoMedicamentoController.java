package com.farmacia.controller;

import com.farmacia.dto.InteracaoMedicamentoRequest;
import com.farmacia.model.InteracaoMedicamento;
import com.farmacia.service.InteracaoMedicamentoService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/interacoes")
public class InteracaoMedicamentoController {
    private final InteracaoMedicamentoService interacaoService;

    public InteracaoMedicamentoController(InteracaoMedicamentoService interacaoService) {
        this.interacaoService = interacaoService;
    }

    @GetMapping
    public List<InteracaoMedicamento> listarInteracoes() {
        return interacaoService.listarTodos();
    }

    @PostMapping
    public ResponseEntity<?> cadastrarInteracao(@RequestBody InteracaoMedicamentoRequest request) {
        try {
            return ResponseEntity.status(HttpStatus.CREATED).body(interacaoService.salvar(request));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarInteracao(@PathVariable Long id) {
        interacaoService.deletar(id);
        return ResponseEntity.noContent().build();
    }
}
