document.addEventListener('DOMContentLoaded', () => {

    // APIs - Apenas o URL de clientes
    const apiUrlClientes = '/api/clientes';

    // Formulários - Apenas o de cliente
    const formCliente = document.getElementById('form-cliente');

    // Tabelas - Apenas a de cliente
    const tabelaClientes = document.getElementById('tabela-clientes').getElementsByTagName('tbody')[0];

    // --- FUNÇÕES GENÉRICAS (Copiadas do script.js original) ---

    // Função genérica para carregar dados
    async function carregarDados(apiUrl, tabela, preencherTabelaFn) {
        try {
            const response = await fetch(apiUrl);
            if (!response.ok) throw new Error(`Erro na API: ${response.status}`);
            const dados = await response.json();
            tabela.innerHTML = '';
            dados.forEach(item => preencherTabelaFn(item, tabela));
            return dados;
        } catch (error) {
            console.error(`Falha ao carregar dados de ${apiUrl}:`, error);
            return [];
        }
    }

    // Função genérica para deletar
    async function deletarItem(apiUrl, id, callback) {
        try {
            const response = await fetch(`${apiUrl}/${id}`, { method: 'DELETE' });
            if (!response.ok) throw new Error('Erro ao deletar o item.');
            callback();
        } catch (error) {
            console.error(error);
        }
    }

    // --- LÓGICA DE CLIENTES (Copiada do script.js original) ---

    function preencherTabelaClientes(cliente, tabela) {
        const row = tabela.insertRow();
        row.dataset.id = cliente.id;
        row.insertCell(0).textContent = cliente.nome;
        row.insertCell(1).textContent = cliente.cpf;
        row.insertCell(2).textContent = cliente.idade;
        row.insertCell(3).textContent = cliente.endereco;
        const cellAcoes = row.insertCell(4);
        const btnDelete = document.createElement('button');
        btnDelete.textContent = 'Excluir';
        btnDelete.className = 'btn-delete';
        btnDelete.onclick = () => {
            if (confirm('Confirma exclusão do cliente?')) {
                // Atualizado para recarregar apenas os clientes
                deletarItem(apiUrlClientes, cliente.id, carregarClientes);
            }
        };
        cellAcoes.appendChild(btnDelete);
    }

    const carregarClientes = () => carregarDados(apiUrlClientes, tabelaClientes, preencherTabelaClientes);

    formCliente.addEventListener('submit', async (event) => {
        event.preventDefault();
        const cpfDigits = (document.getElementById('cli-cpf').value || '').replace(/\D/g, '');
        if (cpfDigits.length !== 11) {
            alert('CPF deve conter 11 dígitos.');
            return;
        }
        const novoCliente = {
            nome: document.getElementById('cli-nome').value,
            cpf: cpfDigits,
            idade: parseInt(document.getElementById('cli-idade').value) || 0,
            endereco: document.getElementById('cli-endereco').value || null
        };
        try {
            const resp = await fetch(apiUrlClientes, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(novoCliente) });
            if (!resp.ok) throw new Error(`API retornou ${await resp.text()}`);
            formCliente.reset();
            carregarClientes(); // Atualizado para recarregar apenas os clientes
        } catch (error) {
            console.error('Erro ao salvar cliente:', error);
        }
    });

    // --- LÓGICA DE PESQUISA (Copiada do script.js original) ---

    document.getElementById('pesquisa-cliente').addEventListener('input', function() {
        const termoPesquisa = this.value.toLowerCase();
        const linhas = document.querySelectorAll('#tabela-clientes tbody tr');

        linhas.forEach(linha => {
            const nome = linha.cells[0].textContent.toLowerCase();
            const cpf = linha.cells[1].textContent.toLowerCase();
            
            if (nome.includes(termoPesquisa) || cpf.includes(termoPesquisa)) {
                linha.style.display = ''; // Mostra a linha
            } else {
                linha.style.display = 'none'; // Esconde a linha
            }
        });
    });

    // --- CARREGAMENTO INICIAL ---
    carregarClientes();
});