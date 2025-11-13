// static/login/login.js
document.addEventListener('DOMContentLoaded', () => {
    
    const formLogin = document.getElementById('form-login');

    formLogin.addEventListener('submit', (event) => {
        event.preventDefault(); 
        
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        if (password === '123') { 
            if (username.toLowerCase() === 'admin') {
                // 1. Armazena a função no navegador
                sessionStorage.setItem('userRole', 'ADMIN');
                // 2. Redireciona para a página correta
                window.location.href = '../medicamentos/medicamento.html';

            } else if (username.toLowerCase() === 'atendente') {
                // 1. Armazena a função no navegador
                sessionStorage.setItem('userRole', 'ATENDENTE');
                // 2. Redireciona para a página de clientes (assumindo que o nome do ficheiro será 'cliente.html')
                window.location.href = '../clientes/cliente.html';
                
            } else {
                alert('Usuário desconhecido. Use "admin" ou "atendente".');
            }
        } else {
            alert('Senha incorreta!');
        }
    });
});