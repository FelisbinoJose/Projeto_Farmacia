import { useEffect, useState } from "react";
import axios from "axios";

// 1. Garanta que as props { perfil, aoComprar } estão aqui nos parênteses
const MedicamentoList = ({ perfil, aoComprar }) => { 
    const [medicamentos, setMedicamentos] = useState([]);
    const [erro, setErro] = useState(null);

    useEffect(() => {
        axios.get('http://localhost:8080/api/medicamentos')
            .then(res => {
                // 2. Verifica se o que voltou do Java é realmente uma lista
                setMedicamentos(Array.isArray(res.data) ? res.data : []);
            })
            .catch(err => {
                console.error("Erro ao carregar medicamentos:", err);
                setErro("Não foi possível carregar a lista. O Java está rodando?");
            });
    }, []);

    if (erro) return <div style={{ color: 'red' }}>{erro}</div>;

    return (
        <div style={{ marginTop: '20px', backgroundColor: 'white', padding: '15px', borderRadius: '8px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr style={{ backgroundColor: '#f4f4f4', textAlign: 'left' }}>
                        <th style={{ padding: '10px' }}>Medicamento</th>
                        <th style={{ padding: '10px' }}>Preço</th>
                        {/* 3. Só mostra a coluna de ação se for cliente */}
                        {perfil === 'cliente' && <th style={{ padding: '10px' }}>Ação</th>}
                    </tr>
                </thead>
                <tbody>
                    {medicamentos.length > 0 ? (
                        medicamentos.map(med => (
                            <tr key={med.id} style={{ borderBottom: '1px solid #eee' }}>
                                <td style={{ padding: '10px' }}>{med.nomeComercial}</td>
                                <td style={{ padding: '10px' }}>R$ {med.precoVenda}</td>
                                {perfil === 'cliente' && (
                                    <td style={{ padding: '10px' }}>
                                        <button 
                                            onClick={() => aoComprar && aoComprar(med)} // 4. Verificação de segurança
                                            style={{ backgroundColor: '#27ae60', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}
                                        >
                                            🛒 Comprar
                                        </button>
                                    </td>
                                )}
                            </tr>
                        ))
                    ) : (
                        <tr><td colSpan="3" style={{ padding: '10px' }}>Nenhum medicamento no estoque.</td></tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default MedicamentoList;