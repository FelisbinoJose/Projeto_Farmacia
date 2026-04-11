import { useState } from "react";
import axios from "axios";


const MedicamentoForm = () => {
    const [formData, setFormData] = useState({
        nomeComercial: '',
        fabricante: '',
        precoVenda: '',
    });


    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post('http://localhost:8080/api/medicamentos', formData)
        .then(() => alert('Medicamento cadastrado com sucesso!'))
        .catch(error => console.error('Erro ao cadastrar medicamento:', error));
    };

    return (
        <form onSubmit={handleSubmit}>
            <input 
                type="text" 
                placeholder="Nome do Remédio" 
                onChange={(e) => setFormData({...formData, nomeComercial: e.target.value})} 
            />
            <input 
            type="text" 
            placeholder="Fabricante" 
            value={formData.fabricante}
            onChange={(e) => setFormData({...formData, fabricante: e.target.value})} // 👈 Verifique se essa linha existe
            />
            <input 
            type="text" 
            placeholder="Preço de Venda" 
            value={formData.precoVenda}
            onChange={(e) => setFormData({...formData, precoVenda: e.target.value})} // 👈 Verifique se essa linha existe
            />
            <button type="submit">Cadastrar</button>
        </form>
    );
};
export default MedicamentoForm;
            


    