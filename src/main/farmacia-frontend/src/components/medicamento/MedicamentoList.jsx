import { useEffect, useState } from "react";
import axios from "axios";

const MedicamentoList = () => {
    const [medicamentos, setMedicamentos] = useState([]);

    // Hook para buscar os dados assim que o componente for montado
    useEffect(() => {
        // Certifique-se que o seu Spring Boot está rodando na porta 8080
       axios.get('http://localhost:8080/api/medicamentos')
            .then(response => {
                setMedicamentos(response.data);
            })
            .catch(error => {
                console.error("Erro ao buscar medicamentos:", error);
            });
    }, []);

    return (
        <div style={{ marginTop: '20px' }}>
            <h2>Lista de Medicamentos</h2>
            <table border="1" style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
                <thead>
                    <tr style={{ backgroundColor: '#f2f2f2' }}>
                        <th>Nome Comercial</th>
                        <th>Fabricante</th>
                        <th>Preço de Venda</th>
                    </tr>
                </thead>
                <tbody>
                    {medicamentos.length > 0 ? (
                        medicamentos.map((med) => (
                            <tr key={med.id}>
                                <td>{med.nomeComercial}</td>
                                <td>{med.fabricante}</td>
                                <td>R$ {med.precoVenda}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="3">Nenhum medicamento encontrado no banco.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default MedicamentoList;