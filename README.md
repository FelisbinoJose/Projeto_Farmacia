# 💊 Sistema de Gestão de Farmácia

Sistema web completo para gerenciamento de uma farmácia, permitindo o controle de medicamentos, cadastro de clientes, registro de vendas, autenticação por token JWT e fluxo de auto-cadastro para clientes.

O projeto é estruturado em uma arquitetura moderna separando o **Backend (Spring Boot REST API)** e o **Frontend (React Single Page Application)**.

---

## 🎯 Funcionalidades Principais
* **Autenticação Segura:** Autenticação via tokens JWT com perfis separados para **Farmacêutico (Admin)** e **Cliente**.
* **Auto-Cadastro de Clientes:** Fluxo público na tela de login para que novos clientes cadastrem suas credenciais e dados pessoais (Nome, CPF, Idade, Endereço).
* **Painel Administrativo do Farmacêutico (em Abas):**
  * **Visão Geral:** Métricas e cards de resumo em tempo real.
  * **Cadastro de Medicamentos:** Entrada de nome, preço, fabricante, lote, data de validade e estoque inicial.
  * **Estoque de Medicamentos:** Vitrine de medicamentos cadastrados exibindo a quantidade em estoque (com alertas de baixo estoque) e datas de validade.
  * **Cadastro e Listagem de Clientes:** Visualização de todos os perfis registrados no sistema.
  * **Registro e Histórico de Vendas:** Registro de pedidos associando clientes e medicamentos com controle de estoque integrado.
* **Vitrine e Carrinho do Cliente:** Visualização pública de medicamentos disponíveis, busca rápida por utilidade, e carrinho de compras interativo.

---

## 🚀 Tecnologias Utilizadas

### 🔙 Backend (Spring Boot API)
* **Java 21**
* **Spring Boot 3.4.5**
* **Spring Security & JWT Auth**
* **Spring Data JPA**
* **H2 Database (Desenvolvimento local em memória)** / **MySQL (Produção/Nuvem)**

### 🔜 Frontend (React SPA)
* **React 18** (Vite)
* **Context API** (Gerenciamento de estado de login e carrinho)
* **Axios** (Integração HTTP com interceptores de Token JWT)
* **CSS3 Vanilla** (Design responsivo e micro-animações premium)

---

## ⚙️ Pré-requisitos
Para rodar este projeto localmente, você precisará de:
* **Java JDK 21** ou superior
* **Node.js** (versão 18 ou superior)
* **Maven** (ou use o Maven Wrapper contido no projeto)

---

## ▶️ Como Executar o Projeto

O projeto é executado iniciando o backend e o frontend simultaneamente em terminais separados.

### 1️⃣ Inicializar o Backend (API)
Acesse a pasta do backend e rode a aplicação:
```bash
cd Backend
# Usando o Maven Wrapper
# No Windows:
mvnw.cmd spring-boot:run
# No Linux/macOS:
./mvnw spring-boot:run
```
O servidor do backend iniciará em **[http://localhost:8080](http://localhost:8080)**.

*Nota: Ao iniciar, o banco de dados em memória H2 é automaticamente populado com as credenciais padrão de teste.*

### 2️⃣ Inicializar o Frontend (React)
Acesse a pasta do frontend, instale as dependências e inicie o servidor de desenvolvimento:
```bash
cd frontend
# Instalar dependências
npm install
# Iniciar servidor
npm run dev
```
O frontend iniciará em **[http://localhost:5173](http://localhost:5173)**.

---

## 🔑 Credenciais Padrão de Teste (Auto-seeded)
Você pode usar as seguintes contas pré-configuradas para testar o sistema:

| Perfil | Usuário | Senha |
| :--- | :--- | :--- |
| ⚕️ **Farmacêutico (Admin)** | `admin` | `admin123` |
| 👤 **Cliente** | `cliente` | `cliente123` |

---

## 📁 Estrutura de Pastas
```
farmacia/
│
├── Backend/                 # Código Spring Boot (REST API)
│   ├── src/                 # Controllers, Services, Repositories, Security
│   ├── pom.xml              # Dependências Maven
│   └── application.properties
│
└── frontend/                # Código React (Single Page Application)
    ├── src/
    │   ├── components/      # Modais e Formulários reutilizáveis
    │   ├── context/         # AppContext (Auth e Carrinho)
    │   ├── hooks/           # useApi (Conexão Axios)
    │   ├── pages/           # Site público e Dashboards
    │   └── App.css          # Estilização Global
    ├── package.json
    └── vite.config.js
```
