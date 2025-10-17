document.addEventListener('DOMContentLoaded', () => {

    // APIs - caminhos base dos controllers do backend
    const apiUrlMedicamentos = '/api/medicamentos';
    const apiUrlClientes = '/api/clientes';

    // Formulários
    const formMedicamento = document.getElementById('form-medicamento');
    const formCliente = document.getElementById('form-cliente');

    // Tabelas
    const tabelaMedicamentos = document.getElementById('tabela-medicamentos').getElementsByTagName('tbody')[0];
    const tabelaClientes = document.getElementById('tabela-clientes').getElementsByTagName('tbody')[0];

    // Função genérica para carregar dados e preencher tabelas
    async function carregarDados(apiUrl, tabela, preencherTabelaFn) {
        try {
            const response = await fetch(apiUrl);
            if (!response.ok) throw new Error(`Erro ao buscar dados da API: ${apiUrl} - ${response.status}`);

            const dados = await response.json();
            tabela.innerHTML = '';
            dados.forEach(item => preencherTabelaFn(item, tabela));
        } catch (error) {
            console.error(error);
        }
    }

    // Função genérica para deletar
    async function deletarItem(apiUrl, id, callback) {
        try {
            const response = await fetch(`${apiUrl}/${id}`, { method: 'DELETE' });
            if (!response.ok) throw new Error('Erro ao deletar o item.');
            callback(); // Recarrega a lista
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
        const id = medicamento.id ?? medicamento.Id ?? medicamento.ID;
        row.dataset.id = id;
        row.insertCell(0).textContent = medicamento.nomeComercial || '';
        row.insertCell(1).textContent = medicamento.fabricante || '';
        row.insertCell(2).textContent = (typeof medicamento.preco === 'number') ? `R$ ${medicamento.preco.toFixed(2)}` : '';
        row.insertCell(3).textContent = medicamento.lote != null ? medicamento.lote : '';
        row.insertCell(4).textContent = formatDate(medicamento.date);
        row.insertCell(5).textContent = medicamento.classificacao || '';

        const cellAcoes = row.insertCell(6);
        const btnDelete = document.createElement('button');
        btnDelete.textContent = 'Excluir';
        btnDelete.className = 'btn-delete';
        btnDelete.onclick = () => {
            if (confirm('Confirma exclusão do medicamento?')) {
                deletarItem(apiUrlMedicamentos, id, carregarMedicamentos);
            }
        };
        cellAcoes.appendChild(btnDelete);
    }

    const carregarMedicamentos = () => carregarDados(apiUrlMedicamentos, tabelaMedicamentos, preencherTabelaMedicamentos);

    formMedicamento.addEventListener('submit', async (event) => {
        event.preventDefault();

        const nomeComercial = document.getElementById('med-nome-comercial').value;
        const fabricante = document.getElementById('med-fabricante').value;
        const preco = parseFloat(document.getElementById('med-preco').value);
        const lote = parseInt(document.getElementById('med-lote').value);
        const date = document.getElementById('med-data').value;
        const classificacao = document.getElementById('med-classificacao').value;

        const novoMedicamento = {
            nomeComercial,
            fabricante,
            preco,
            lote,
            date,
            classificacao
        };

        try {
            const resp = await fetch(apiUrlMedicamentos, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(novoMedicamento)
            });

            if (!resp.ok) {
                const txt = await resp.text();
                throw new Error(`API retornou ${resp.status}: ${txt}`);
            }

            formMedicamento.reset();
            carregarMedicamentos();
        } catch (error) {
            console.error('Erro ao salvar medicamento:', error);
            alert('Erro ao salvar medicamento. Veja o console para detalhes.');
        }
    });

    // --- LÓGICA DE CLIENTES ---
    function preencherTabelaClientes(cliente, tabela) {
        const row = tabela.insertRow();
        const id = cliente.id ?? cliente.Id ?? cliente.ID;
        row.dataset.id = id;
        row.insertCell(0).textContent = cliente.nome || '';
        row.insertCell(1).textContent = cliente.cpf || '';
        // Ajuste aqui para corresponder aos dados que você quer exibir
        row.insertCell(2).textContent = cliente.idade || '';
        row.insertCell(3).textContent = cliente.endereco || '';

        const cellAcoes = row.insertCell(4); // A coluna de ações muda de índice
        const btnDelete = document.createElement('button');
        btnDelete.textContent = 'Excluir';
        btnDelete.className = 'btn-delete';
        btnDelete.onclick = () => {
            if (confirm('Confirma exclusão do cliente?')) {
                deletarItem(apiUrlClientes, id, carregarClientes);
            }
        };
        cellAcoes.appendChild(btnDelete);
    }

    const carregarClientes = () => carregarDados(apiUrlClientes, tabelaClientes, preencherTabelaClientes);

    formCliente.addEventListener('submit', async (event) => {
        event.preventDefault();
        let cpfRaw = document.getElementById('cli-cpf').value || '';
        const cpfDigits = cpfRaw.replace(/\D/g, '');

        if (cpfDigits.length !== 11) {
            alert('CPF deve conter 11 dígitos numéricos. Por favor corrija o CPF antes de enviar.');
            return;
        }

        const novoCliente = {
            nome: document.getElementById('cli-nome').value,
            cpf: cpfDigits,
            idade: parseInt(document.getElementById('cli-idade').value) || 0,
            endereco: document.getElementById('cli-endereco').value || null
        };

        try {
            const resp = await fetch(apiUrlClientes, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(novoCliente)
            });

            if (!resp.ok) {
                const txt = await resp.text();
                throw new Error(`API retornou ${resp.status}: ${txt}`);
            }

            formCliente.reset();
            carregarClientes();
        } catch (error) {
            console.error('Erro ao salvar cliente:', error);
            alert('Erro ao salvar cliente. Veja o console para detalhes.');
        }
    });

    // Carrega dados iniciais ao abrir a página
    carregarMedicamentos();
    carregarClientes();
});

// --- LÓGICA DAS ABAS (TABS) ---
function openTab(event, tabName) {
    const tabContents = document.getElementsByClassName('tab-content');
    for (let i = 0; i < tabContents.length; i++) {
        tabContents[i].style.display = 'none';
        tabContents[i].classList.remove('active');
    }

    const tabButtons = document.getElementsByClassName('tab-button');
    for (let i = 0; i < tabButtons.length; i++) {
        tabButtons[i].classList.remove('active');
    }

    document.getElementById(tabName).style.display = 'block';
    document.getElementById(tabName).classList.add('active');
    event.currentTarget.classList.add('active');
}