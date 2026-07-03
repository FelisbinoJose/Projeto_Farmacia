import { useEffect, useState } from 'react';
import { getMedicamentos, getClientes, postVenda } from '../../hooks/useApi';
import { useApp } from '../../context/AppContext';

export default function VendaForm({ onSalvo }) {
  const { toast } = useApp();
  const [clientes, setClientes]         = useState([]);
  const [medicamentos, setMedicamentos] = useState([]);
  const [form, setForm]                 = useState({ idCliente: '', idMedicamento: '', quantidade: 1 });

  useEffect(() => {
    getClientes().then(setClientes).catch(() => {});
    getMedicamentos().then(setMedicamentos).catch(() => {});
  }, []);

  const set = (campo, valor) => setForm(f => ({ ...f, [campo]: valor }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.idCliente || !form.idMedicamento) { toast('Selecione cliente e medicamento.', 'erro'); return; }
    try {
      await postVenda(form.idCliente, form.idMedicamento, form.quantidade);
      toast('✅ Venda registrada!');
      setForm({ idCliente: '', idMedicamento: '', quantidade: 1 });
      onSalvo?.();
    } catch (err) {
      const msg = typeof err.response?.data === 'string'
        ? err.response.data
        : (err.response?.data?.message || 'Erro ao registrar venda.');
      toast(`❌ ${msg}`, 'erro');
    }
  };

  return (
    <div className="dash-secao">
      <h3>🛒 Registrar Venda</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-grupo">
            <label>Cliente</label>
            <select value={form.idCliente} onChange={e => set('idCliente', e.target.value)} required>
              <option value="">Selecione...</option>
              {clientes.map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}
            </select>
          </div>
          <div className="form-grupo">
            <label>Medicamento</label>
            <select value={form.idMedicamento} onChange={e => set('idMedicamento', e.target.value)} required>
              <option value="">Selecione...</option>
              {medicamentos.map(m => <option key={m.id} value={m.id}>{m.nomeComercial}</option>)}
            </select>
          </div>
        </div>
        <div className="form-grupo" style={{ marginTop: '1rem' }}>
          <label>Quantidade</label>
          <input type="number" min="1" value={form.quantidade} onChange={e => set('quantidade', e.target.value)} required />
        </div>
        <button type="submit" className="btn-dash farma">✅ Registrar Venda</button>
      </form>
    </div>
  );
}
