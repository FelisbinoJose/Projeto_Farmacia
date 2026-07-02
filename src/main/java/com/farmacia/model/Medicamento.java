package com.farmacia.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class Medicamento {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String nomeComercial;
    private String fabricante;
    private double preco;
    private int lote;
    private int estoque;
    private int estoqueMinimo = 5;
    private int diasAlertaValidade = 30;
    private int diasConsumoPadrao = 30;
    private String principioAtivo;
    private LocalDate date;
    @Enumerated(EnumType.STRING)
    private Classificacao classificacao;

    public Medicamento(String paracetamol, String ems, int i, LocalDate localDate, Classificacao classificacao) {
        setNomeComercial(paracetamol);
        setFabricante(ems);
        setPreco(i);
        setLote(1);
        setEstoque(1);
        setDate(localDate);
        setClassificacao(classificacao);
    }

    public String validar(String txt, String nomeDoCampo) {
        if (txt == null || txt.trim().isEmpty())
            throw new IllegalArgumentException("Campo " + nomeDoCampo + " não pode ser nulo ou vazio.");
        return txt;
    }

    public void setNomeComercial(String nomeComercial) {

        this.nomeComercial = validar(nomeComercial, "Nome Comercial");
    }

    public void setFabricante(String fabricante) {
        this.fabricante = validar(fabricante, "Fabricante");
    }

    private final static int MENOR_DO_QUE_ZERO = 0;

    public void setPreco(double preco) {
        if (preco <= MENOR_DO_QUE_ZERO)
            throw new IllegalArgumentException("Preço deve ser maior que zero.");
        this.preco = preco;
    }

    public void setLote(int lote) {
        if (lote <= MENOR_DO_QUE_ZERO)
            throw new IllegalArgumentException("Lote deve ser maior que zero.");
        this.lote = lote;
    }

    public void setEstoque(int estoque) {
        if (estoque < MENOR_DO_QUE_ZERO)
            throw new IllegalArgumentException("Estoque nao pode ser negativo.");
        this.estoque = estoque;
    }

    public void setEstoqueMinimo(int estoqueMinimo) {
        if (estoqueMinimo < MENOR_DO_QUE_ZERO)
            throw new IllegalArgumentException("Estoque minimo nao pode ser negativo.");
        this.estoqueMinimo = estoqueMinimo;
    }

    public void setDiasAlertaValidade(int diasAlertaValidade) {
        if (diasAlertaValidade < MENOR_DO_QUE_ZERO)
            throw new IllegalArgumentException("Dias de alerta de validade nao pode ser negativo.");
        this.diasAlertaValidade = diasAlertaValidade;
    }

    public void setDiasConsumoPadrao(int diasConsumoPadrao) {
        if (diasConsumoPadrao <= MENOR_DO_QUE_ZERO)
            throw new IllegalArgumentException("Dias de consumo padrao deve ser maior que zero.");
        this.diasConsumoPadrao = diasConsumoPadrao;
    }

    public void setPrincipioAtivo(String principioAtivo) {
        this.principioAtivo = principioAtivo == null ? null : principioAtivo.trim();
    }

    public void setDate(LocalDate date) {
        // Allow expiration date (validade) to be today or in the future
        if (date == null || date.isBefore(LocalDate.now())) {
            throw new IllegalArgumentException("Data de validade deve ser hoje ou posterior.");
        }
        this.date = date;
    }

    public void setClassificacao(Classificacao classificacao) {
        if (classificacao == null) {
            throw new IllegalArgumentException("Classificação não pode ser nula.");
        }

        this.classificacao = classificacao;
    }
}
