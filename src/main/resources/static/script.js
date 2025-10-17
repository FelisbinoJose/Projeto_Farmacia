document.addEventListener('DOMContentLoaded', () => {

    // APIs - caminhos base dos controllers do backend
    const apiUrlMedicamentos = '/api/medicamentos';
    const apiUrlClientes = '/api/clientes';
    const apiUrlVendas = '/api/vendas';

    // Formulários
    const formMedicamento = document.getElementById('form-medicamento');
    const formCliente = document.getElementById('form-cliente');
    const formVenda = document.getElementById('form-venda');

    // Tabelas
    const tabelaMedicamentos = document.getElementById('tabela-medicamentos').getElementsByTagName('tbody')[0];
    const tabelaClientes = document.getElementById('tabela-clientes').getElementsByTagName('tbody')[0];
    const tabelaVendas = document.getElementById('tabela-vendas').getElementsByTagName('tbody')[0];

    // Campos de Seleção (Selects) para Vendas
    const selectCliente = document.getElementById('venda-cliente');
    const selectMedicamento = document.getElementById('venda-medicamento');

    // Função genérica para carregar dados. Agora ela SEMPRE retorna os dados.
    async function carregarDados(apiUrl, tabela, preencherTabelaFn) {
        try {
            const response = await fetch(apiUrl);
            if (!response.ok) throw new Error(`Erro na API: ${response.status}`);
            const dados = await response.json();
            tabela.innerHTML = '';
            dados.forEach(item => preencherTabelaFn(item, tabela));
            return dados; // Retorna os dados para uso posterior
        } catch (error) {
            console.error(`Falha ao carregar dados de ${apiUrl}:`, error);
            return []; // Retorna um array vazio em caso de erro
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

    // --- LÓGICA DE MEDICAMENTOS ---
    function formatDate(dateString) {
        if (!dateString) return '';
        const data = new Date(dateString);
        data.setDate(data.getDate() + 1);
        return data.toLocaleDateString();
    }

    function preencherTabelaMedicamentos(medicamento, tabela) {
        const row = tabela.insertRow();
        row.dataset.id = medicamento.id;
        row.insertCell(0).textContent = medicamento.nomeComercial;
        row.insertCell(1).textContent = medicamento.fabricante;
        row.insertCell(2).textContent = `R$ ${medicamento.preco.toFixed(2)}`;
        row.insertCell(3).textContent = medicamento.lote;
        row.insertCell(4).textContent = formatDate(medicamento.date);
        row.insertCell(5).textContent = medicamento.classificacao;
        const cellAcoes = row.insertCell(6);
        const btnDelete = document.createElement('button');
        btnDelete.textContent = 'Excluir';
        btnDelete.className = 'btn-delete';
        btnDelete.onclick = () => {
            if (confirm('Confirma exclusão do medicamento?')) {
                deletarItem(apiUrlMedicamentos, medicamento.id, carregarPagina);
            }
        };
        cellAcoes.appendChild(btnDelete);
    }

    const carregarMedicamentos = () => carregarDados(apiUrlMedicamentos, tabelaMedicamentos, preencherTabelaMedicamentos);

    formMedicamento.addEventListener('submit', async (event) => {
        event.preventDefault();
        const novoMedicamento = {
            nomeComercial: document.getElementById('med-nome-comercial').value,
            fabricante: document.getElementById('med-fabricante').value,
            preco: parseFloat(document.getElementById('med-preco').value),
            lote: parseInt(document.getElementById('med-lote').value),
            date: document.getElementById('med-data').value,
            classificacao: document.getElementById('med-classificacao').value
        };
        try {
            const resp = await fetch(apiUrlMedicamentos, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(novoMedicamento) });
            if (!resp.ok) throw new Error(`API retornou ${await resp.text()}`);
            formMedicamento.reset();
            carregarPagina(); // Recarrega tudo para atualizar a lista
        } catch (error) {
            console.error('Erro ao salvar medicamento:', error);
        }
    });

    // --- LÓGICA DE CLIENTES ---
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
                deletarItem(apiUrlClientes, cliente.id, carregarPagina);
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
            carregarPagina(); // Recarrega tudo para atualizar a lista
        } catch (error) {
            console.error('Erro ao salvar cliente:', error);
        }
    });

    // --- LÓGICA DE VENDAS ---
    function preencherTabelaVendas(venda, tabela) {
        const row = tabela.insertRow();
        row.insertCell(0).textContent = venda.cliente?.nome || 'Cliente não encontrado';
        row.insertCell(1).textContent = venda.medicamento?.nomeComercial || 'Medicamento não encontrado';
        row.insertCell(2).textContent = venda.quantidade;
        row.insertCell(3).textContent = formatDate(venda.dataVenda);
    }

    const carregarVendas = () => carregarDados(apiUrlVendas, tabelaVendas, preencherTabelaVendas);

    // NOVA FUNÇÃO: Apenas popula os selects com os dados já buscados
    function popularSelects(clientes, medicamentos) {
        selectCliente.innerHTML = '<option value="" disabled selected>Selecione um cliente</option>';
        clientes.forEach(cliente => {
            selectCliente.add(new Option(cliente.nome, cliente.id));
        });

        selectMedicamento.innerHTML = '<option value="" disabled selected>Selecione um medicamento</option>';
        medicamentos.forEach(med => {
            selectMedicamento.add(new Option(med.nomeComercial, med.id));
        });
    }

    formVenda.addEventListener('submit', async (event) => {
        event.preventDefault();
        const idCliente = selectCliente.value;
        const idMedicamento = selectMedicamento.value;
        const quantidade = document.getElementById('venda-quantidade').value;

        if (!idCliente || !idMedicamento || !quantidade) {
            alert('Por favor, preencha todos os campos da venda.');
            return;
        }

        const url = `${apiUrlVendas}?idCliente=${idCliente}&idMedicamento=${idMedicamento}&quantidade=${quantidade}`;

        try {
            const resp = await fetch(url, { method: 'POST' });
            if (!resp.ok) throw new Error(`Erro ao registrar venda: ${await resp.text() || resp.statusText}`);

            alert('Venda registrada com sucesso!');
            formVenda.reset();
            carregarPagina(); // Recarrega tudo
        } catch (error) {
            console.error(error);
            alert(error.message);
        }
    });

    // --- LÓGICA DE CARREGAMENTO INICIAL (REFEITA) ---
    async function carregarPagina() {
        // Busca os dados de clientes e medicamentos em paralelo para mais performance
        const [clientes, medicamentos] = await Promise.all([
            carregarClientes(),
            carregarMedicamentos()
        ]);

        // Usa os dados retornados para popular os menus de seleção
        popularSelects(clientes, medicamentos);

        // Carrega o histórico de vendas
        carregarVendas();
    }

    carregarPagina(); // Chama a função principal que inicia tudo
});

// --- LÓGICA DAS ABAS (TABS) ---
function openTab(event, tabName) {
    const tabContents = document.getElementsByClassName('tab-content');
    for (let i = 0; i < tabContents.length; i++) {
        tabContents[i].classList.remove('active');
        tabContents[i].style.display = 'none';
    }
    const tabButtons = document.getElementsByClassName('tab-button');
    for (let i = 0; i < tabButtons.length; i++) {
        tabButtons[i].classList.remove('active');
    }
    const tabAtiva = document.getElementById(tabName);
    tabAtiva.style.display = 'block';
    tabAtiva.classList.add('active');
    event.currentTarget.classList.add('active');
}
