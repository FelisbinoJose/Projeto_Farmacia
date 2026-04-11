import { useEffect, useState } from "react";
import axios from "axios";

const VendaList = () => {
    const [vendas, setVendas] = useState([]);

    const carregarVendas = () => {
        axios.get('http://localhost:8080/api/vendas')
            .then(response => {
                setVendas(Array.isArray(response.data) ? response.data : []);
            })
            .catch(error => {
                console.error("Erro ao procurar vendas:", error);
            });
    };

    useEffect(() => {
        carregarVendas();
    }, []);

    return (
        <div style={{ marginTop: '20px' }}>
            <h3>Histórico de Vendas</h3>
            <table border="1" style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr style={{ backgroundColor: '#f39c12', color: 'white' }}>
                        <th>ID</th>
                        <th>Cliente</th>
                        <th>Medicamento</th>
                        <th>Qtd</th>
                        <th>Data</th>
                    </tr>
                </thead>
                <tbody>
                    {vendas.length > 0 ? (
                        vendas.map((v) => (
                            <tr key={v.id}>
                                <td>{v.id}</td>
                                <td>{v.cliente?.nome || "Cliente não encontrado"}</td>
                                <td>{v.medicamento?.nomeComercial || "Medicamento não encontrado"}</td>
                                <td>{v.quantidade}</td>
                                <td>{v.dataVenda ? new Date(v.dataVenda).toLocaleDateString() : "Sem data"}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5" style={{ textAlign: 'center', padding: '10px' }}>
                                Nenhuma venda registrada.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
            <button onClick={carregarVendas} style={{ marginTop: '10px' }}>Atualizar Histórico</button>
        </div>
    );
};

export default VendaList;