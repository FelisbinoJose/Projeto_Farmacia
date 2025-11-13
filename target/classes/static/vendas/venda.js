document.addEventListener('DOMContentLoaded', () => {

    // APIs - Precisamos de todos os 3 URLs aqui
    const apiUrlMedicamentos = '/api/medicamentos';
    const apiUrlClientes = '/api/clientes';
    const apiUrlVendas = '/api/vendas';

    // Formulários
    const formVenda = document.getElementById('form-venda');

    // Tabelas
    const tabelaVendas = document.getElementById('tabela-vendas').getElementsByTagName('tbody')[0];

    // Campos de Seleção (Selects) para Vendas
    const selectCliente = document.getElementById('venda-cliente');
    const selectMedicamento = document.getElementById('venda-medicamento');

    // --- FUNÇÕES GENÉRICAS (Copiadas do script.js original) ---

    // Função genérica para carregar dados (usada para o histórico e para os selects)
    async function carregarDados(apiUrl, tabela, preencherTabelaFn) {
        try {
            const response = await fetch(apiUrl);
            if (!response.ok) throw new Error(`Erro na API: ${response.status}`);
            const dados = await response.json();
            
            // Se uma tabela e uma função de preenchimento forem fornecidas, use-as
            if (tabela && preencherTabelaFn) {
                tabela.innerHTML = '';
                dados.forEach(item => preencherTabelaFn(item, tabela));
            }
            return dados; // Retorna os dados para uso posterior (ex: popular selects)
        } catch (error) {
            console.error(`Falha ao carregar dados de ${apiUrl}:`, error);
            return []; // Retorna um array vazio em caso de erro
        }
    }
    
    // Função de formatar data (copiada do script.js original)
    function formatDate(dateString) {
        if (!dateString) return '';
        const data = new Date(dateString);
        data.setDate(data.getDate() + 1);
        return data.toLocaleDateString();
    }


    // --- LÓGICA DE VENDAS (Copiada do script.js original) ---

    function preencherTabelaVendas(venda, tabela) {
        const row = tabela.insertRow();
        row.insertCell(0).textContent = venda.cliente?.nome || 'Cliente não encontrado';
        row.insertCell(1).textContent = venda.medicamento?.nomeComercial || 'Medicamento não encontrado';
        row.insertCell(2).textContent = venda.quantidade;
        row.insertCell(3).textContent = formatDate(venda.dataVenda);
    }

    // Carrega apenas o histórico de vendas
    const carregarVendas = () => carregarDados(apiUrlVendas, tabelaVendas, preencherTabelaVendas);

    // Popula os menus <select>
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
            carregarVendas(); // Recarrega apenas o histórico de vendas
        } catch (error) {
            console.error(error);
            alert(error.message);
        }
    });

    // --- LÓGICA DE CARREGAMENTO INICIAL (Adaptada do script.js original) ---
    
    // Esta função é chamada assim que a página carrega
    async function carregarPaginaVendas() {
        // Busca os dados de clientes e medicamentos em paralelo
        // Note que não passamos tabela ou função de preenchimento,
        // pois só queremos os dados para os <select>
        const [clientes, medicamentos] = await Promise.all([
            carregarDados(apiUrlClientes),
            carregarDados(apiUrlMedicamentos)
        ]);

        // Usa os dados retornados para popular os menus de seleção
        popularSelects(clientes, medicamentos);

        // Carrega o histórico de vendas (que preenche a sua própria tabela)
        carregarVendas();
    }

    // Chama a função principal que inicia tudo
    carregarPaginaVendas(); 
});