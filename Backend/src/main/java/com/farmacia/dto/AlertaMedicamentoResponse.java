package com.farmacia.dto;

import com.farmacia.model.Medicamento;

import java.time.LocalDate;

public record AlertaMedicamentoResponse(
        Long medicamentoId,
        String nomeComercial,
        String tipo,
        String mensagem,
        int estoque,
        int estoqueMinimo,
        LocalDate validade) {

    public static AlertaMedicamentoResponse estoqueBaixo(Medicamento medicamento) {
        return new AlertaMedicamentoResponse(
                medicamento.getId(),
                medicamento.getNomeComercial(),
                "ESTOQUE_BAIXO",
                "Estoque igual ou abaixo do minimo definido.",
                medicamento.getEstoque(),
                medicamento.getEstoqueMinimo(),
                medicamento.getDate());
    }

    public static AlertaMedicamentoResponse validade(Medicamento medicamento, String tipo, String mensagem) {
        return new AlertaMedicamentoResponse(
                medicamento.getId(),
                medicamento.getNomeComercial(),
                tipo,
                mensagem,
                medicamento.getEstoque(),
                medicamento.getEstoqueMinimo(),
                medicamento.getDate());
    }
}
