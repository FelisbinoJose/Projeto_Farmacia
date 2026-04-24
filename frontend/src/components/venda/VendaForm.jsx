import { useState, useEffect } from "react";
import axios from "axios";

const VendaForm = () => {
    const [clientes, setClientes] = useState([]);
    const [medicamentos, setMedicamentos] = useState([]);
    const [venda, setVenda] = useState({
        clienteId: "",
        medicamentoId: "",
        quantidade: 1
    });

    // Carregar dados iniciais para popular os selects
    useEffect(() => {
        axios.get('http://localhost:8080/api/clientes').then(res => setClientes(res.data));
        axios.get('http://localhost:8080/api/medicamentos').then(res => setMedicamentos(res.data));
    }, []);

    const handleSubmit = (e) => {
    e.preventDefault();
    
   
    axios.post('http://localhost:8080/api/vendas', null, {
        params: {
            idCliente: venda.clienteId,
            idMedicamento: venda.medicamentoId,
            quantidade: venda.quantidade
        }
    })
    .then(() => {
        alert("Venda realizada com sucesso!");
        setVenda({ clienteId: "", medicamentoId: "", quantidade: 1 });
    })
    .catch(err => {
        console.error("Erro na venda:", err);
        alert("Erro ao realizar venda. Verifique se o cliente e o remédio existem.");
    });
};

    return (
        <div style={{ maxWidth: '500px', padding: '20px', border: '1px solid #ddd' }}>
            <h3>Nova Venda</h3>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                
                <label>Selecionar Cliente:</label>
                <select 
                    value={venda.clienteId} 
                    onChange={(e) => setVenda({...venda, clienteId: e.target.value})}
                    required
                >
                    <option value="">Selecione...</option>
                    {clientes.map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}
                </select>

                <label>Selecionar Medicamento:</label>
                <select 
                    value={venda.medicamentoId} 
                    onChange={(e) => setVenda({...venda, medicamentoId: e.target.value})}
                    required
                >
                    <option value="">Selecione...</option>
                    {medicamentos.map(m => <option key={m.id} value={m.id}>{m.nomeComercial} - R$ {m.precoVenda}</option>)}
                </select>

                <label>Quantidade:</label>
                <input 
                    type="number" 
                    min="1" 
                    value={venda.quantidade} 
                    onChange={(e) => setVenda({...venda, quantidade: e.target.value})}
                />

                <button type="submit" style={{ backgroundColor: '#e67e22', color: 'white', padding: '10px' }}>
                    Finalizar Venda
                </button>
            </form>
        </div>
    );
};

export default VendaForm;