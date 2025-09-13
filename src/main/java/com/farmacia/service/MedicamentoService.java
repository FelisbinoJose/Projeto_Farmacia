package com.farmacia.service;

import com.farmacia.model.Cliente;
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

    public MedicamentoService(MedicamentoRepository medicamentoRepository) {
        this.medicamentoRepository = medicamentoRepository;
    }

    public Medicamento salvar(Medicamento medicamento) {
        return medicamentoRepository.save(medicamento);
    }

    public List<Medicamento> listarTodos() {
        return medicamentoRepository.findAll();
    }

    public Optional<Medicamento> buscarPorId(Long id) {
        return medicamentoRepository.findById(id);
    }

    public void deletar(Long id) {
        medicamentoRepository.deleteById(id);
    }
}
