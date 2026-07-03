import { useEffect, useState } from 'react';
import { getClientes, deleteCliente } from '../../hooks/useApi';
import { useApp } from '../../context/AppContext';

export default function ClienteList({ atualizar }) {
  const { toast } = useApp();
  const [clientes, setClientes] = useState([]);

  const carregar = () => getClientes().then(setClientes).catch(() => setClientes([]));

  useEffect(() => { carregar(); }, [atualizar]);

  const handleDeletar = async (id, nome) => {
    if (!confirm(`Remover cliente "${nome}"?`)) return;
    try {
      await deleteCliente(id);
      toast('✅ Cliente removido.');
      carregar();
    } catch {
      toast('❌ Erro ao remover cliente.', 'erro');
    }
  };

  return (
    <div className="dash-secao">
      <h3>📋 Lista de Clientes</h3>
      <div className="tabela-wrap">
        <table>
          <thead>
            <tr>
              <th>Nome</th>
              <th>CPF</th>
              <th>Idade</th>
              <th>Endereço</th>
              <th>Ação</th>
            </tr>
          </thead>
          <tbody>
            {clientes.length === 0 ? (
              <tr><td colSpan={5} style={{ textAlign: 'center', color: 'var(--texto-suave)', padding: '2rem' }}>Nenhum cliente cadastrado.</td></tr>
            ) : (
              clientes.map(c => (
                <tr key={c.id}>
                  <td>{c.nome}</td>
                  <td>{c.cpf}</td>
                  <td>{c.idade}</td>
                  <td>{c.endereco || '—'}</td>
                  <td>
                    <button
                      onClick={() => handleDeletar(c.id, c.nome)}
                      style={{ background: 'var(--vermelho)', color: '#fff', border: 'none', padding: '0.4rem 0.8rem', borderRadius: '8px', cursor: 'pointer', fontSize: '0.8rem' }}
                    >
                      🗑️ Remover
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
