import { useEffect, useState } from "react";
import axios from "axios";

const ClienteList = () => {
    const [clientes, setClientes] = useState([]);

    const carregarClientes = () => {
       
        axios.get('http://localhost:8080/api/clientes')
            .then(response => {
                setClientes(response.data);
            })
            .catch(error => {
                console.error("Erro ao procurar clientes:", error);
            });
    };

    useEffect(() => {
        carregarClientes();
    }, []);

    return (
        <div style={{ marginTop: '20px' }}>
            <h3>Lista de Clientes Registados</h3>
            <table border="1" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                    <tr style={{ backgroundColor: '#ecf0f1' }}>
                        <th>Nome</th>
                        <th>CPF</th>
                        <th>Idade</th>
                    </tr>
                </thead>
                <tbody>
                    {clientes.length > 0 ? (
                        clientes.map((cli) => (
                            <tr key={cli.id}>
                                <td style={{ padding: '8px' }}>{cli.nome}</td>
                                <td style={{ padding: '8px' }}>{cli.cpf}</td>
                                <td style={{ padding: '8px' }}>{cli.idade}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="3" style={{ padding: '10px', textAlign: 'center' }}>
                                Nenhum cliente encontrado.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
            <button 
                onClick={carregarClientes} 
                style={{ marginTop: '10px', padding: '5px 10px', cursor: 'pointer' }}
            >
                Atualizar Lista
            </button>
        </div>
    );
};

export default ClienteList;