package com.farmacia.controller;

import com.farmacia.model.Medicamento;
import com.farmacia.service.MedicamentoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/medicamentos")
public class MedicamentoController {
    @Autowired
    private MedicamentoService medicamentoService;

    @PostMapping
    public Medicamento cadastrarMedicamento(@RequestBody Medicamento medicamento) {
        return medicamentoService.cadastrarMedicamento(medicamento);
    }

    @GetMapping
    public List<Medicamento> listarMedicamentos() {
        return medicamentoService.listarMedicamentos();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Medicamento> buscarMedicamento(@PathVariable Long id) {
        Optional<Medicamento> medicamento = medicamentoService.buscarMedicamento(id);
        return medicamento.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarMedicamento(@PathVariable Long id) {
        medicamentoService.deletarMedicamento(id);
        return ResponseEntity.noContent().build();
    }
}
