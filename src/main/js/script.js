document.addEventListener('DOMContentLoaded', () => {

    // APIs
    const apiUrlMedicamentos = 'http://localhost:8080/medicamentos';
    const apiUrlClientes = 'http://localhost:8080/clientes';

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
            if (!response.ok) throw new Error(`Erro ao buscar dados da API: ${apiUrl}`);
            
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
            callback();
        } catch (error) {
            console.error(error);
        }
    }

    // --- LÓGICA DE MEDICAMENTOS ---
    function preencherTabelaMedicamentos(medicamento, tabela) {
        const row = tabela.insertRow();
        row.insertCell(0).textContent = medicamento.nome;
        row.insertCell(1).textContent = medicamento.anvisa;
        row.insertCell(2).textContent = `R$ ${medicamento.preco.toFixed(2)}`;
        row.insertCell(3).textContent = medicamento.estoque;
        
        const cellAcoes = row.insertCell(4);
        const btnDelete = document.createElement('button');
        btnDelete.textContent = 'Excluir';
        btnDelete.className = 'btn-delete';
        btnDelete.onclick = () => deletarItem(apiUrlMedicamentos, medicamento.id, carregarMedicamentos);
        cellAcoes.appendChild(btnDelete);
    }

    const carregarMedicamentos = () => carregarDados(apiUrlMedicamentos, tabelaMedicamentos, preencherTabelaMedicamentos);

    formMedicamento.addEventListener('submit', async (event) => {
        event.preventDefault();
        const novoMedicamento = {
            nome: document.getElementById('med-nome').value,
            anvisa: document.getElementById('med-anvisa').value,
            descricao: document.getElementById('med-descricao').value,
            preco: parseFloat(document.getElementById('med-preco').value),
            estoque: parseInt(document.getElementById('med-estoque').value)
        };
        
        try {
            await fetch(apiUrlMedicamentos, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(novoMedicamento)
            });
            formMedicamento.reset();
            carregarMedicamentos();
        } catch (error) {
            console.error('Erro ao salvar medicamento:', error);
        }
    });

    // --- LÓGICA DE CLIENTES ---
    function preencherTabelaClientes(cliente, tabela) {
        const row = tabela.insertRow();
        row.insertCell(0).textContent = cliente.nome;
        row.insertCell(1).textContent = cliente.cpf;
        row.insertCell(2).textContent = cliente.telefone;

        const cellAcoes = row.insertCell(3);
        const btnDelete = document.createElement('button');
        btnDelete.textContent = 'Excluir';
        btnDelete.className = 'btn-delete';
        btnDelete.onclick = () => deletarItem(apiUrlClientes, cliente.id, carregarClientes);
        cellAcoes.appendChild(btnDelete);
    }
    
    const carregarClientes = () => carregarDados(apiUrlClientes, tabelaClientes, preencherTabelaClientes);

    formCliente.addEventListener('submit', async (event) => {
        event.preventDefault();
        const novoCliente = {
            nome: document.getElementById('cli-nome').value,
            cpf: document.getElementById('cli-cpf').value,
            telefone: document.getElementById('cli-telefone').value,
            email: document.getElementById('cli-email').value,
        };

        try {
            await fetch(apiUrlClientes, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(novoCliente)
            });
            formCliente.reset();
            carregarClientes();
        } catch (error) {
            console.error('Erro ao salvar cliente:', error);
        }
    });
    
    // Carrega dados iniciais
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