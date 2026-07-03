package com.farmacia.repository;

import com.farmacia.model.InteracaoMedicamento;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface InteracaoMedicamentoRepository extends JpaRepository<InteracaoMedicamento, Long> {
    Optional<InteracaoMedicamento> findByMedicamentoAIdAndMedicamentoBId(Long medicamentoAId, Long medicamentoBId);

    List<InteracaoMedicamento> findByMedicamentoAIdOrMedicamentoBId(Long medicamentoAId, Long medicamentoBId);
}
