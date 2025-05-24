package com.farmacia;

import com.farmacia.model.Cliente;
import com.farmacia.model.Medicamento;
import com.farmacia.model.Venda;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

import java.time.LocalDate;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

@SpringBootTest
class FarmaciaApplicationTests {

	@Test
	void NomeClienteInavalidoTest() {
		Exception exception = assertThrows(IllegalArgumentException.class, () -> {
			new Cliente("Paula", 25, "abc123", "Rua F");
		});
		assertEquals("CPF deve conter exatamente 11 dígitos.", exception.getMessage());
	}

	@Test
	void CpfNullTest() {
		Exception exception = assertThrows(IllegalArgumentException.class, () -> {
			new Cliente("Rian", 21, "", "rua f");
		});

		assertEquals("CPF não pode ser nulo ou vazio.", exception.getMessage());
	}

	@Test
	void medicamentoNomeComercialNullTest() {
		Medicamento medicamento = new Medicamento();
		IllegalArgumentException ex = assertThrows(IllegalArgumentException.class,
				() -> medicamento.setNomeComercial(null));
		assertEquals("Campo Nome Comercial não pode ser nulo ou vazio.", ex.getMessage());
	}

	@Test
	void medicamentoFabricanteNullTest() {
		Medicamento medicamento = new Medicamento();
		IllegalArgumentException ex = assertThrows(IllegalArgumentException.class,
				() -> medicamento.setFabricante(null));
		assertEquals("Campo Fabricante não pode ser nulo ou vazio.", ex.getMessage());

	}

	@Test
	void MedicamentoLoteNegativoTest() {
		Medicamento medicamento = new Medicamento();
		IllegalArgumentException ex = assertThrows(IllegalArgumentException.class, () -> medicamento.setLote(-1));
		assertEquals("Lote deve ser maior que zero.", ex.getMessage());
	}

	@Test
	void medicamentoDataDoPassadoTest() {
		Medicamento medicamento = new Medicamento();
		IllegalArgumentException ex = assertThrows(IllegalArgumentException.class,
				() -> medicamento.setDate(LocalDate.now().minusDays(1)));
		assertEquals("Data de validade deve ser futura.", ex.getMessage());

	}

	@Test
	void medicamentoForaDaClassificacaoTest() {
		Medicamento medicamento = new Medicamento();
		IllegalArgumentException ex = assertThrows(IllegalArgumentException.class,
				() -> medicamento.setClassificacao(null));
		assertEquals("Classificação não pode ser nula.", ex.getMessage());
	}

	@Test
	void medicamentoPrecoNegativoTest() {
		Medicamento medicamento = new Medicamento();
		IllegalArgumentException ex = assertThrows(IllegalArgumentException.class, () -> medicamento.setPreco(-1));
		assertEquals("Preço deve ser maior que zero.", ex.getMessage());
	}

	@Test
	void vendaMedimentoNUllTest() {
		Venda venda = new Venda();
		IllegalArgumentException ex = assertThrows(IllegalArgumentException.class, () -> venda.setMedicamento(null));
		assertEquals("Medicamento Não pode ser null.", ex.getMessage());
	}

	void vendaClienteNUllTest() {
		Venda venda = new Venda();
		IllegalArgumentException ex = assertThrows(IllegalArgumentException.class, () -> venda.setCliente(null));
		assertEquals("Cliente Não pode ser null.", ex.getMessage());
	}

	@Test
	void vendaQuantidadeMenorQueZeroTest() {
		Venda venda = new Venda();
		IllegalArgumentException ex = assertThrows(IllegalArgumentException.class, () -> venda.setQuantidade(-1));
		assertEquals("Quantidade de pedido Deve ser maior do que zero.", ex.getMessage());
	}

	@Test
	void DataDeVendaComDiaAnteriorTest() {
		Venda venda = new Venda();
		IllegalArgumentException ex = assertThrows(IllegalArgumentException.class,
				() -> venda.setDate(LocalDate.now().plusDays(1)));
		assertEquals("Data da venda deve ser hoje ou anterior.", ex.getMessage());
	}

}
