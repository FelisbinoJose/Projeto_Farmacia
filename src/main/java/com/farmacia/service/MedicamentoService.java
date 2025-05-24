package com.farmacia.service;

import com.farmacia.model.Medicamento;
import com.farmacia.repository.MedicamentoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class MedicamentoService {
    @Autowired
    private MedicamentoRepository medicamentoRepository;

    public Medicamento cadastrarMedicamento(Medicamento medicamento) {
        return medicamentoRepository.save(medicamento);
    }

    public List<Medicamento> listarMedicamentos() {
        return medicamentoRepository.findAll();
    }

    public Optional<Medicamento> buscarMedicamento(Long id) {
        return medicamentoRepository.findById(id);
    }

    public void deletarMedicamento(Long id) {
        medicamentoRepository.deleteById(id);
    }
}