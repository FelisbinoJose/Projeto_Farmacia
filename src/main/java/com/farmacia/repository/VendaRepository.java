package com.farmacia.repository;

import com.farmacia.model.Venda;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface VendaRepository extends JpaRepository<Venda,Long> {
    List<Venda> findByClienteIdAndDataVenda(Long clienteId, LocalDate dataVenda);

    List<Venda> findByDataProximaCompraBetween(LocalDate inicio, LocalDate fim);
}
