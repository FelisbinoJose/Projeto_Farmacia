package com.farmacia.repository;

import com.farmacia.model.Medicamento;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MedicamentoRepository extends JpaRepository<Medicamento,Long> {
}
