package com.farmacia.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@NoArgsConstructor
@Getter
@Entity
public class Venda {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne
    private Medicamento medicamento;
    @ManyToOne
    private Cliente cliente;
    private int quantidade;
    private LocalDate dataVenda;
    private int diasConsumo;
    private LocalDate dataProximaCompra;

    public Venda(Medicamento medicamento, Cliente cliente, int quantidade, LocalDate dateVenda) {
        setMedicamento(medicamento);
        setCliente(cliente);
        setQuantidade(quantidade);
        setDate(dateVenda);
    }

    public Venda(Medicamento medicamento, Cliente cliente, int quantidade, LocalDate dateVenda, int diasConsumo) {
        this(medicamento, cliente, quantidade, dateVenda);
        setDiasConsumo(diasConsumo);
        this.dataProximaCompra = dateVenda.plusDays(diasConsumo);
    }

    public void setMedicamento(Medicamento medicamento) {
        if (medicamento == null) {
            throw new IllegalArgumentException("Medicamento Não pode ser null.");
        }
        this.medicamento = medicamento;
    }

    public void setCliente(Cliente cliente) {
        if (cliente == null) {
            throw new IllegalArgumentException("Cliente Não pode ser null.");
        }
        this.cliente = cliente;
    }

    private static final int MENOR_DO_QUE_ZERO = 0;

    public void setQuantidade(int quantidade) {
        if (quantidade <= MENOR_DO_QUE_ZERO) {
            throw new IllegalArgumentException("Quantidade de pedido Deve ser maior do que zero.");
        }
        this.quantidade = quantidade;
    }

    public void setDiasConsumo(int diasConsumo) {
        if (diasConsumo <= MENOR_DO_QUE_ZERO) {
            throw new IllegalArgumentException("Dias de consumo deve ser maior do que zero.");
        }
        this.diasConsumo = diasConsumo;
    }

    public void setDate(LocalDate date) {
        if (date == null || date.isAfter(LocalDate.now())) {
            throw new IllegalArgumentException("Data da venda deve ser hoje ou anterior.");
        }
        this.dataVenda = date;
    }
}
