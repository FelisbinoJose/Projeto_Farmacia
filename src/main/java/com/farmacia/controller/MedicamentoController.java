package com.farmacia.controller;

import com.farmacia.model.Medicamento;
import com.farmacia.repository.MedicamentoRepository;
import com.farmacia.repository.VendaRepository;
import com.farmacia.service.MedicamentoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/medicamentos")
public class MedicamentoController {
    @Autowired
    private MedicamentoService medicamentoService;

    @Autowired
    private MedicamentoRepository medicamentoRepository;

    @Autowired
    private VendaRepository vendaRepository;

    @PostMapping
    public Medicamento cadastrarMedicamento(@RequestBody Medicamento medicamento) {
        return medicamentoService.salvar(medicamento);
    }

    @GetMapping
    public List<Medicamento> listarMedicamentos() {
        return medicamentoService.listarTodos();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Medicamento> buscarMedicamento(@PathVariable Long id) {
        Optional<Medicamento> medicamento = medicamentoService.buscarPorId(id);
        return medicamento.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarMedicamento(@PathVariable Long id) {
        if (!medicamentoRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Medicamento não encontrado");
        }

        boolean temVendas = vendaRepository.existsByMedicamentoId(id);
        if (temVendas) {
            throw new ResponseStatusException(HttpStatus.CONFLICT,
                    "Não é possível deletar: medicamento associado a vendas.");
        }
        medicamentoService.deletar(id);
        return ResponseEntity.noContent().build();
    }
}
