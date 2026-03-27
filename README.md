# 💊 Projeto Farmácia

Sistema web desenvolvido para gerenciamento de uma farmácia, permitindo o controle de medicamentos, organização de dados e suporte à tomada de decisões.

O projeto foi construído com foco educacional, aplicando conceitos de desenvolvimento fullstack, arquitetura MVC e boas práticas com Spring Boot.

---

## 🎯 Objetivo do Projeto

Este projeto tem como objetivo simular um sistema de farmácia, permitindo:

* Gerenciar medicamentos
* Organizar informações de produtos
* Criar uma base para evolução com funcionalidades mais avançadas
* Praticar integração entre backend e frontend

---

## 🚀 Tecnologias Utilizadas

### 🔙 Backend

* Java 17+
* Spring Boot
* Spring Web

### 🔜 Frontend

* HTML5
* CSS3
* JavaScript (Vanilla)

### 🛠️ Ferramentas

* Maven
* Git
* GitHub
* IntelliJ IDEA (ou similar)

---

## 🧱 Arquitetura

O projeto segue o padrão **MVC (Model-View-Controller)**:

* **Model** → Representação dos dados
* **Controller** → Regras e endpoints da aplicação
* **View** → Interface web (HTML, CSS, JS)

---

## 📦 Funcionalidades

* ✅ Cadastro de medicamentos
* ✅ Listagem de produtos
* ✅ Organização de dados em memória
* 🔄 Estrutura preparada para expansão

---

## ⚙️ Pré-requisitos

Antes de executar o projeto, você precisa ter instalado:

* Java JDK 17 ou superior
* Maven (ou usar o Maven Wrapper incluído)
* Git
* Navegador web atualizado

---

## ▶️ Como executar o projeto

### 1️⃣ Clonar o repositório

```bash
git clone https://github.com/FelisbinoJose/Projeto_Farmacia.git
```

---

### 2️⃣ Acessar a pasta do projeto

```bash
cd Projeto_Farmacia
```

---

### 3️⃣ Executar o projeto

#### ✔️ Usando Maven:

```bash
mvn spring-boot:run
```

#### ✔️ Usando Maven Wrapper:

Linux/Mac:

```bash
./mvnw spring-boot:run
```

Windows:

```bash
mvnw.cmd spring-boot:run
```

---

### 4️⃣ Acessar no navegador

Após iniciar o servidor:

```
http://localhost:8080
```

---

## 📁 Estrutura do Projeto

```
Projeto_Farmacia/
│
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── ... (controllers, models, etc.)
│   │   │
│   │   └── resources/
│   │       ├── static/      # HTML, CSS, JS
│   │       └── application.properties
│   │
│   └── test/
│
├── pom.xml
└── README.md
```

---

## 🔌 Endpoints (Exemplo)


| Método | Endpoint           | Descrição            |
| ------ | ------------------ | -------------------- |
| GET    | /medicamentos      | Lista medicamentos   |
| POST   | /medicamentos      | Cadastra medicamento |
| PUT    | /medicamentos/{id} | Atualiza medicamento |
| DELETE | /medicamentos/{id} | Remove medicamento   |

---

---

## ⭐ Dica

Se este projeto te ajudou, deixe uma ⭐ no repositório!
