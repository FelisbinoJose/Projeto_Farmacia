package com.farmacia.dto;

import com.farmacia.model.GravidadeInteracao;

public record InteracaoMedicamentoRequest(
        Long medicamentoAId,
        Long medicamentoBId,
        GravidadeInteracao gravidade,
        String descricao,
        String recomendacao) {
}
