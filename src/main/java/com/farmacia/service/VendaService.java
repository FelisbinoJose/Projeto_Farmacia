package com.farmacia.service;

import com.farmacia.model.Medicamento;
import com.farmacia.model.Venda;
import com.farmacia.repository.MedicamentoRepository;
import com.farmacia.repository.VendaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class VendaService {
    @Autowired
    private VendaRepository vendaRepository;
    @Autowired
    private MedicamentoRepository medicamentoRepository;

    public Venda registrarVenda(Venda venda) {
        // Atualizar estoque do medicamento
        Medicamento medicamento = venda.getMedicamento();
        medicamento.setQuantidadeEstoque(medicamento.getQuantidadeEstoque() - venda.getQuantidade());
        medicamentoRepository.save(medicamento);

        // Registrar a venda
        venda.setDataVenda(LocalDateTime.now());
        return vendaRepository.save(venda);
    }

    public List<Venda> listarVendas() {
        return vendaRepository.findAll();
    }
}