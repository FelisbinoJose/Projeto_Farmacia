// static/auth.js
document.addEventListener('DOMContentLoaded', () => {
    // Pega a função que foi salva no login
    const userRole = sessionStorage.getItem('userRole');

    // 1. Se não há função (não fez login), expulsa para o index.
    if (!userRole) {
        alert('Acesso negado. Por favor, faça o login.');
        window.location.href = '../index.html'; // Ajuste o caminho se o seu login.html não for o index
        return;
    }

    // 2. Se a função é ATENDENTE...
    if (userRole === 'ATENDENTE') {
        // ...procura pelo link de "Medicamentos" na navegação e remove-o.
        const navMedicamentos = document.querySelector('a[href*="medicamento.html"]');
        if (navMedicamentos) {
            navMedicamentos.remove();
        }

        // ...e se o ATENDENTE *tentar* aceder à página de medicamentos (digitando o URL)...
        if (window.location.pathname.includes('medicamento.html')) {
            alert('Você não tem permissão para aceder a esta página.');
            // ...expulsa-o para a página de clientes.
            window.location.href = '../clientes/cliente.html';
        }
    }

    // 3. Se a função é ADMIN (não fazemos nada, ele pode ver tudo)
    if (userRole === 'ADMIN') {
        // Nenhuma restrição
    }
});