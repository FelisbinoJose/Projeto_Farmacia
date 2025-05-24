package com.farmacia;

import com.farmacia.model.Cliente;
import com.farmacia.service.ClienteService;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ApplicationContext;

@SpringBootApplication
public class FarmaciaApplication {
	public static void main(String[] args) {
		ApplicationContext context = SpringApplication.run(FarmaciaApplication.class, args);

		ClienteService clienteService = context.getBean(ClienteService.class);

		Cliente cliente = new Cliente();
		cliente.setNome("João Silva");
		cliente.setCpf("123.456.789-00");
		cliente.setTelefone("11987654321");
		clienteService.cadastrarCliente(cliente);

		for (Cliente c : clienteService.listarClientes()) {
			System.out.println(c.getNome());
		}
	}
}