package com.farmacia.service;

import com.farmacia.dto.AlertaMedicamentoResponse;
import com.farmacia.model.Medicamento;
import com.farmacia.repository.MedicamentoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
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

    public List<AlertaMedicamentoResponse> listarAlertas() {
        LocalDate hoje = LocalDate.now();
        List<AlertaMedicamentoResponse> alertas = new ArrayList<>();

        for (Medicamento medicamento : medicamentoRepository.findAll()) {
            if (medicamento.getEstoque() <= medicamento.getEstoqueMinimo()) {
                alertas.add(AlertaMedicamentoResponse.estoqueBaixo(medicamento));
            }

            if (medicamento.getDate() == null) {
                continue;
            }

            if (medicamento.getDate().isBefore(hoje)) {
                alertas.add(AlertaMedicamentoResponse.validade(
                        medicamento,
                        "VENCIDO",
                        "Medicamento vencido. Bloqueie a venda e remova do estoque."));
            } else if (!medicamento.getDate().isAfter(hoje.plusDays(medicamento.getDiasAlertaValidade()))) {
                alertas.add(AlertaMedicamentoResponse.validade(
                        medicamento,
                        "VALIDADE_PROXIMA",
                        "Medicamento proximo do vencimento."));
            }
        }

        return alertas;
    }

    public Optional<Medicamento> buscarPorId(Long id) {
        return medicamentoRepository.findById(id);
    }

    public void deletar(Long id) {
        medicamentoRepository.deleteById(id);
    }
}
