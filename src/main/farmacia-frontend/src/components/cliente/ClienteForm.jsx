import { useState } from "react";
import axios from "axios";

const ClienteForm = () => {
    const [formData, setFormData] = useState({
        nome: '',
        cpf: '',
        email: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Lembra-te de adicionar o /api se configuraste assim no Java
        axios.post('http://localhost:8080/api/clientes', formData)
            .then(() => {
                alert('Cliente cadastrado com sucesso!');
                setFormData({ nome: '', cpf: '', email: '' }); // Limpa o formulário
            })
            .catch(error => {
                console.error('Erro ao cadastrar cliente:', error);
                alert('Erro ao cadastrar. Verifica o terminal do Java.');
            });
    };

    return (
        <div style={{ maxWidth: '400px', marginBottom: '20px' }}>
            <h3>Registar Novo Cliente</h3>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <input 
                    type="text" 
                    placeholder="Nome Completo" 
                    value={formData.nome}
                    onChange={(e) => setFormData({...formData, nome: e.target.value})}
                    required
                />
                <input 
                    type="text" 
                    placeholder="CPF (apenas números)" 
                    value={formData.cpf}
                    onChange={(e) => setFormData({...formData, cpf: e.target.value})}
                    required
                />
                <input 
                    type="number" 
                    placeholder="Idade" 
                    value={formData.idade}
                    onChange={(e) => setFormData({...formData, idade: e.target.value})}
                    required
                />
                <button type="submit" style={{ backgroundColor: '#27ae60', color: 'white', border: 'none', padding: '10px', cursor: 'pointer' }}>
                    Guardar Cliente
                </button>
            </form>
        </div>
    );
};

export default ClienteForm;