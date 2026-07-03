package com.farmacia.service;

import com.farmacia.dto.InteracaoMedicamentoRequest;
import com.farmacia.model.GravidadeInteracao;
import com.farmacia.model.InteracaoMedicamento;
import com.farmacia.model.Medicamento;
import com.farmacia.repository.InteracaoMedicamentoRepository;
import com.farmacia.repository.MedicamentoRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class InteracaoMedicamentoService {
    private final InteracaoMedicamentoRepository interacaoRepository;
    private final MedicamentoRepository medicamentoRepository;

    public InteracaoMedicamentoService(InteracaoMedicamentoRepository interacaoRepository,
            MedicamentoRepository medicamentoRepository) {
        this.interacaoRepository = interacaoRepository;
        this.medicamentoRepository = medicamentoRepository;
    }

    public InteracaoMedicamento salvar(InteracaoMedicamentoRequest request) {
        Medicamento medicamentoA = medicamentoRepository.findById(request.medicamentoAId())
                .orElseThrow(() -> new IllegalArgumentException("Medicamento A nao encontrado"));
        Medicamento medicamentoB = medicamentoRepository.findById(request.medicamentoBId())
                .orElseThrow(() -> new IllegalArgumentException("Medicamento B nao encontrado"));

        if (medicamentoA.getId().equals(medicamentoB.getId())) {
            throw new IllegalArgumentException("Interacao deve envolver dois medicamentos diferentes.");
        }

        if (buscarEntre(medicamentoA.getId(), medicamentoB.getId()).isPresent()) {
            throw new IllegalArgumentException("Interacao entre estes medicamentos ja cadastrada.");
        }

        GravidadeInteracao gravidade = request.gravidade() == null ? GravidadeInteracao.ALTA : request.gravidade();
        return interacaoRepository.save(new InteracaoMedicamento(
                medicamentoA,
                medicamentoB,
                gravidade,
                request.descricao(),
                request.recomendacao()));
    }

    public List<InteracaoMedicamento> listarTodos() {
        return interacaoRepository.findAll();
    }

    public void deletar(Long id) {
        interacaoRepository.deleteById(id);
    }

    public Optional<InteracaoMedicamento> buscarEntre(Long medicamentoAId, Long medicamentoBId) {
        return interacaoRepository.findByMedicamentoAIdAndMedicamentoBId(medicamentoAId, medicamentoBId)
                .or(() -> interacaoRepository.findByMedicamentoAIdAndMedicamentoBId(medicamentoBId, medicamentoAId));
    }
}
