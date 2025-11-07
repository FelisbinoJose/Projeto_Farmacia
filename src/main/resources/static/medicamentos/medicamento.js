document.addEventListener('DOMContentLoaded', () => {

    // APIs - Apenas o URL de medicamentos é necessário aqui
    const apiUrlMedicamentos = '/api/medicamentos';

    // Formulários - Apenas o de medicamento
    const formMedicamento = document.getElementById('form-medicamento');

    // Tabelas - Apenas a de medicamento
    const tabelaMedicamentos = document.getElementById('tabela-medicamentos').getElementsByTagName('tbody')[0];

    // --- FUNÇÕES GENÉRICAS (Copiadas do script.js original) ---

    // Função genérica para carregar dados
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

    // --- LÓGICA DE MEDICAMENTOS (Copiado do script.js original) ---
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
                // Ao deletar, apenas recarregamos os medicamentos
                deletarItem(apiUrlMedicamentos, medicamento.id, carregarMedicamentos);
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
            carregarMedicamentos(); // Recarrega a tabela
        } catch (error) {
            console.error('Erro ao salvar medicamento:', error);
        }
    });

    // --- LÓGICA DE PESQUISA (Copiada do script.js original) ---
    document.getElementById('pesquisa-medicamento').addEventListener('input', function() {
        const termoPesquisa = this.value.toLowerCase();
        const linhas = document.querySelectorAll('#tabela-medicamentos tbody tr');

        linhas.forEach(linha => {
            const nomeComercial = linha.cells[0].textContent.toLowerCase();
            if (nomeComercial.includes(termoPesquisa)) {
                linha.style.display = '';
            } else {
                linha.style.display = 'none';
            }
        });
    });

    // --- CARREGAMENTO INICIAL ---
    // Apenas carregamos os medicamentos quando esta página abre
    carregarMedicamentos();
});

// NOTA: A função openTab() e todo o código de clientes e vendas foram removidos.