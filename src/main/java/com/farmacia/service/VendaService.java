package com.farmacia.service;

import com.farmacia.dto.AlertaReposicaoResponse;
import com.farmacia.model.Cliente;
import com.farmacia.model.InteracaoMedicamento;
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

    @Autowired
    private InteracaoMedicamentoService interacaoMedicamentoService;

    private final static int ESTOQUE_MENOR_QUE_ZERO = 0;
    private final static int DIAS_ALERTA_REPOSICAO = 3;

    public Venda realizarVenda(Long idCliente, Long idMedicamento, int quantidade) {
        return realizarVenda(idCliente, idMedicamento, quantidade, null);
    }

    public Venda realizarVenda(Long idCliente, Long idMedicamento, int quantidade, Integer diasConsumo) {
        Cliente cliente = clienteRepository.findById(idCliente)
                .orElseThrow(() -> new IllegalArgumentException("Cliente nao encontrado"));

        Medicamento medicamento = medicamentoRepository.findById(idMedicamento)
                .orElseThrow(() -> new IllegalArgumentException("Medicamento nao encontrado"));

        if (quantidade <= ESTOQUE_MENOR_QUE_ZERO) {
            throw new IllegalArgumentException("Quantidade deve ser maior que zero.");
        }

        if (medicamento.getDate() == null || medicamento.getDate().isBefore(LocalDate.now())) {
            throw new IllegalArgumentException("Medicamento vencido. Venda bloqueada.");
        }

        if (medicamento.getEstoque() < quantidade) {
            throw new IllegalArgumentException("Estoque insuficiente para realizar a venda.");
        }

        validarInteracoes(cliente.getId(), medicamento);

        int cicloConsumo = diasConsumo == null ? medicamento.getDiasConsumoPadrao() : diasConsumo;
        Venda venda = new Venda(medicamento, cliente, quantidade, LocalDate.now(), cicloConsumo);
        medicamento.setEstoque(medicamento.getEstoque() - quantidade);
        medicamentoRepository.save(medicamento);

        return vendaRepository.save(venda);
    }

    public List<Venda> listarVendas() {
        return vendaRepository.findAll();
    }

    public List<AlertaReposicaoResponse> listarAlertasReposicao() {
        LocalDate hoje = LocalDate.now();
        LocalDate limite = hoje.plusDays(DIAS_ALERTA_REPOSICAO);

        return vendaRepository.findByDataProximaCompraBetween(hoje, limite).stream()
                .map(venda -> new AlertaReposicaoResponse(
                        venda.getId(),
                        venda.getCliente().getId(),
                        venda.getCliente().getNome(),
                        venda.getMedicamento().getId(),
                        venda.getMedicamento().getNomeComercial(),
                        venda.getQuantidade(),
                        venda.getDataVenda(),
                        venda.getDataProximaCompra(),
                        "Cliente proximo do fim do ciclo de consumo."))
                .toList();
    }

    private void validarInteracoes(Long clienteId, Medicamento medicamento) {
        List<Venda> vendasDeHoje = vendaRepository.findByClienteIdAndDataVenda(clienteId, LocalDate.now());
        for (Venda venda : vendasDeHoje) {
            interacaoMedicamentoService.buscarEntre(venda.getMedicamento().getId(), medicamento.getId())
                    .ifPresent(interacao -> bloquearPorInteracao(venda, medicamento, interacao));
        }
    }

    private void bloquearPorInteracao(Venda vendaAnterior, Medicamento medicamento, InteracaoMedicamento interacao) {
        throw new IllegalArgumentException(
                "Interacao medicamentosa perigosa entre "
                        + vendaAnterior.getMedicamento().getNomeComercial()
                        + " e "
                        + medicamento.getNomeComercial()
                        + ": "
                        + interacao.getDescricao());
    }
}
