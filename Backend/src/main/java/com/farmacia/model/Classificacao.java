package com.farmacia.model;

public enum Classificacao {
        CONTROLADO("controlado"),VENDA_LIVRE("venda livre");

        private final String descricao;

        Classificacao(String descricao) {
                this.descricao = descricao;
        }

        public String getDescricao() {
                return descricao;
        }
}
