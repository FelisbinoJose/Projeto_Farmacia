package com.farmacia.service;

import com.farmacia.model.Cliente;
import com.farmacia.model.Medicamento;
import com.farmacia.model.Venda;
import com.farmacia.repository.ClienteRepository;
import com.farmacia.repository.MedicamentoRepository;
import com.farmacia.repository.VendaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class VendaService {
    @Autowired
    private VendaRepository vendaRepository;

    @Autowired
    private MedicamentoRepository medicamentoRepository;

    @Autowired
    private ClienteRepository clienteRepository;

    private final static int ESTOQUE_MENOR_QUE_ZERO = 0;

    public Venda realizarVenda(Long idCliente, Long idMedicamento, int quantidade) {
        Cliente cliente = clienteRepository.findById(idCliente)
                .orElseThrow(() -> new IllegalArgumentException("Cliente não encontrado"));

        Medicamento medicamento = medicamentoRepository.findById(idMedicamento)
                .orElseThrow(() -> new IllegalArgumentException("Medicamento não encontrado"));

        if (quantidade <= ESTOQUE_MENOR_QUE_ZERO) {
            throw new IllegalArgumentException("Quantidade deve ser maior que zero.");
        }

        Venda venda = new Venda(medicamento, cliente, quantidade, LocalDate.now());

        return vendaRepository.save(venda);
    }

    public List<Venda> listarVendas() {
        return vendaRepository.findAll();
    }
}
