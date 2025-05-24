package com.farmacia.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class Medicamento {
    private String nomeComercial;
    private String fabricante;
    private double preco;
    private int lote;
    private LocalDate date;
    private Classificacao classificacao;


    public String validar(String txt,String nomeDoCampo){
        if(txt==null|| txt.trim().isEmpty())throw new IllegalArgumentException("Campo " + nomeDoCampo + " não pode ser nulo ou vazio.");
        return txt;
    }


    public void setNomeComercial(String nomeComercial) {

        this.nomeComercial = validar(nomeComercial,"Nome Comercial");
    }

    public void setfabricante(String fabricante) {
        fabricante = validar(fabricante,"Fabricante");
    }
    private final static int MENOR_DO_QUE_ZERO=0;
    public void setPreco(double preco) {
        if (lote <= MENOR_DO_QUE_ZERO) throw new IllegalArgumentException("Preço deve ser maior que zero.");
        this.preco = preco;
    }
    public void setLote(int lote) {
        if (lote <= MENOR_DO_QUE_ZERO) throw new IllegalArgumentException("Lote deve ser maior que zero.");
        this.lote = lote;
    }

    public void setDate(LocalDate date) {
        if (date == null || date.isBefore(LocalDate.now())) {
            throw new IllegalArgumentException("Data de validade deve ser futura.");
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
