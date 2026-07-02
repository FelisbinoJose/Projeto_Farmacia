package com.farmacia.dto;

import java.time.LocalDate;

public record AlertaReposicaoResponse(
        Long vendaId,
        Long clienteId,
        String clienteNome,
        Long medicamentoId,
        String medicamentoNome,
        int quantidadeComprada,
        LocalDate dataVenda,
        LocalDate dataProximaCompra,
        String mensagem) {
}
