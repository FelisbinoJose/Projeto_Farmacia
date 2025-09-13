package com.farmacia.repository;

import com.farmacia.model.Venda;
import org.springframework.data.jpa.repository.JpaRepository;

public interface VendaRepository extends JpaRepository<Venda, Long> {

    boolean existsByMedicamentoId(Long id);
}
