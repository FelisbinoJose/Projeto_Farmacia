import { useState } from 'react';
import { postMedicamento } from '../../hooks/useApi';
import { useApp } from '../../context/AppContext';

export default function MedicamentoForm({ onSalvo }) {
  const { toast } = useApp();
  const [form, setForm] = useState({
    nomeComercial: '', fabricante: '', preco: '',
    lote: '', date: '', classificacao: 'VENDA_LIVRE', utilidade: '', estoque: '',
  });

  const set = (campo, valor) => setForm(f => ({ ...f, [campo]: valor }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await postMedicamento({ 
        ...form, 
        preco: parseFloat(form.preco), 
        lote: parseInt(form.lote),
        estoque: parseInt(form.estoque || 0)
      });
      toast('✅ Medicamento cadastrado!');
      setForm({ nomeComercial: '', fabricante: '', preco: '', lote: '', date: '', classificacao: 'VENDA_LIVRE', utilidade: '', estoque: '' });
      onSalvo?.();
    } catch (err) {
      const msg = typeof err.response?.data === 'string'
        ? err.response.data
        : (err.response?.data?.message || 'Erro ao cadastrar medicamento.');
      toast(`❌ ${msg}`, 'erro');
    }
  };

  return (
    <div className="dash-secao">
      <h3>💊 Cadastrar Medicamento</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-grupo">
            <label>Nome Comercial</label>
            <input value={form.nomeComercial} onChange={e => set('nomeComercial', e.target.value)} required />
          </div>
          <div className="form-grupo">
            <label>Fabricante</label>
            <input value={form.fabricante} onChange={e => set('fabricante', e.target.value)} required />
          </div>
        </div>
        <div className="form-row">
          <div className="form-grupo">
            <label>Preço (R$)</label>
            <input type="number" step="0.01" min="0.01" value={form.preco} onChange={e => set('preco', e.target.value)} required />
          </div>
          <div className="form-grupo">
            <label>Lote</label>
            <input type="number" min="1" value={form.lote} onChange={e => set('lote', e.target.value)} required />
          </div>
        </div>
        <div className="form-row">
          <div className="form-grupo">
            <label>Data de Validade</label>
            <input type="date" value={form.date} onChange={e => set('date', e.target.value)} required />
          </div>
          <div className="form-grupo">
            <label>Classificação</label>
            <select value={form.classificacao} onChange={e => set('classificacao', e.target.value)}>
              <option value="VENDA_LIVRE">Venda Livre</option>
              <option value="CONTROLADO">Controlado</option>
            </select>
          </div>
        </div>
        <div className="form-row" style={{ marginTop: '1rem' }}>
          <div className="form-grupo">
            <label>Para que serve</label>
            <input placeholder="Ex: Analgésico e antitérmico..." value={form.utilidade} onChange={e => set('utilidade', e.target.value)} required />
          </div>
          <div className="form-grupo">
            <label>Estoque Inicial</label>
            <input type="number" min="0" placeholder="Ex: 50" value={form.estoque} onChange={e => set('estoque', e.target.value)} required />
          </div>
        </div>
        <button type="submit" className="btn-dash" style={{ marginTop: '1rem' }}>+ Cadastrar</button>
      </form>
    </div>
  );
}
