import { useState } from 'react';
import { postCliente } from '../../hooks/useApi';
import { useApp } from '../../context/AppContext';

export default function ClienteForm({ onSalvo }) {
  const { toast } = useApp();
  const [form, setForm] = useState({ nome: '', cpf: '', idade: '', endereco: '' });

  const set = (campo, valor) => setForm(f => ({ ...f, [campo]: valor }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const cpf = form.cpf.replace(/\D/g, '');
    if (cpf.length !== 11) { toast('CPF deve ter 11 dígitos.', 'erro'); return; }
    try {
      await postCliente({ ...form, cpf, idade: parseInt(form.idade) || 0 });
      toast('✅ Cliente cadastrado!');
      setForm({ nome: '', cpf: '', idade: '', endereco: '' });
      onSalvo?.();
    } catch {
      toast('❌ Erro ao cadastrar cliente.', 'erro');
    }
  };

  return (
    <div className="dash-secao">
      <h3>👤 Cadastrar Cliente</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-grupo">
            <label>Nome</label>
            <input value={form.nome} onChange={e => set('nome', e.target.value)} required />
          </div>
          <div className="form-grupo">
            <label>CPF (só números)</label>
            <input value={form.cpf} maxLength={14} onChange={e => set('cpf', e.target.value)} required />
          </div>
        </div>
        <div className="form-row">
          <div className="form-grupo">
            <label>Idade</label>
            <input type="number" min="0" value={form.idade} onChange={e => set('idade', e.target.value)} />
          </div>
          <div className="form-grupo">
            <label>Endereço</label>
            <input value={form.endereco} onChange={e => set('endereco', e.target.value)} />
          </div>
        </div>
        <button type="submit" className="btn-dash">+ Cadastrar</button>
      </form>
    </div>
  );
}
