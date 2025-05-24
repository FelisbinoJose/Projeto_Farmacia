package com.farmacia.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
@Setter
@Getter
@NoArgsConstructor
public class Cliente {
    private String nome;
    private int idade;
    private String cpf;
    private String endereco;

    public Cliente(String nome, int idade, String cpf, String endereco) {
        setNome(nome);
        this.idade = idade;
        setCpf(cpf);
        this.endereco = endereco;
    }



    public void setNome(String nome) {
        if (nome == null || nome.trim().isEmpty()) {
            throw new IllegalArgumentException("Nome não pode ser nulo ou vazio.");
        }
        if (!nome.matches("[A-Za-zÀ-ú ]+")) {
            throw new IllegalArgumentException("Nome deve conter apenas letras e espaços.");
        }
        if (nome.length() < 3) {
            throw new IllegalArgumentException("Nome deve ter pelo menos 3 caracteres.");
        }
        this.nome = nome;
    }

    public void setCpf(String cpf) {
        if (cpf == null || cpf.trim().isEmpty()) {
            throw new IllegalArgumentException("CPF não pode ser nulo ou vazio.");
        }
        if (!cpf.matches("\\d{11}")) {
            throw new IllegalArgumentException("CPF deve conter exatamente 11 dígitos.");
        }
        this.cpf = cpf;
    }



}
