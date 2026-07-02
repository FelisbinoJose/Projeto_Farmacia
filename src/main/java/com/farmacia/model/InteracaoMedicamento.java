package com.farmacia.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@Entity
public class InteracaoMedicamento {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    private Medicamento medicamentoA;

    @ManyToOne(optional = false)
    private Medicamento medicamentoB;

    @Enumerated(EnumType.STRING)
    private GravidadeInteracao gravidade = GravidadeInteracao.ALTA;

    private String descricao;
    private String recomendacao;

    public InteracaoMedicamento(Medicamento medicamentoA, Medicamento medicamentoB, GravidadeInteracao gravidade,
            String descricao, String recomendacao) {
        setMedicamentoA(medicamentoA);
        setMedicamentoB(medicamentoB);
        setGravidade(gravidade);
        setDescricao(descricao);
        setRecomendacao(recomendacao);
    }

    public void setMedicamentoA(Medicamento medicamentoA) {
        if (medicamentoA == null) {
            throw new IllegalArgumentException("Medicamento A nao pode ser null.");
        }
        this.medicamentoA = medicamentoA;
    }

    public void setMedicamentoB(Medicamento medicamentoB) {
        if (medicamentoB == null) {
            throw new IllegalArgumentException("Medicamento B nao pode ser null.");
        }
        if (medicamentoA != null && medicamentoA.getId() != null && medicamentoA.getId().equals(medicamentoB.getId())) {
            throw new IllegalArgumentException("Interacao deve envolver dois medicamentos diferentes.");
        }
        this.medicamentoB = medicamentoB;
    }

    public void setGravidade(GravidadeInteracao gravidade) {
        if (gravidade == null) {
            throw new IllegalArgumentException("Gravidade nao pode ser nula.");
        }
        this.gravidade = gravidade;
    }

    public void setDescricao(String descricao) {
        if (descricao == null || descricao.trim().isEmpty()) {
            throw new IllegalArgumentException("Descricao nao pode ser nula ou vazia.");
        }
        this.descricao = descricao.trim();
    }

    public void setRecomendacao(String recomendacao) {
        this.recomendacao = recomendacao == null ? null : recomendacao.trim();
    }
}
