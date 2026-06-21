import { useEffect, useState } from 'react';
import { getMedicamentos, getClientes, getVendas } from '../hooks/useApi';
import MedicamentoForm from '../components/medicamento/MedicamentoForm';
import ClienteForm     from '../components/cliente/ClienteForm';
import ClienteList     from '../components/cliente/ClienteList';
import VendaForm       from '../components/venda/VendaForm';
import VendaList       from '../components/venda/VendaList';

export default function DashboardFarmaceutico() {
  const [resumo, setResumo]     = useState({ meds: '—', clientes: '—', vendas: '—' });
  const [refresh, setRefresh]   = useState(0);

  const recarregar = () => setRefresh(r => r + 1);

  useEffect(() => {
    Promise.all([getMedicamentos(), getClientes(), getVendas()])
      .then(([m, c, v]) => setResumo({ meds: m.length, clientes: c.length, vendas: v.length }))
      .catch(() => {});
  }, [refresh]);

  return (
    <div className="dash-conteudo">
      <div className="dash-bem-vindo">
        <h1>Painel do Farmacêutico ⚕️</h1>
        <p>Gerencie o estoque, pedidos e clientes da farmácia.</p>
      </div>

      {/* Cards de resumo */}
      <div className="dash-cards-resumo">
        <div className="resumo-card">
          <span className="resumo-icon">💊</span>
          <div><span className="resumo-label">Medicamentos</span><strong>{resumo.meds}</strong></div>
        </div>
        <div className="resumo-card">
          <span className="resumo-icon">👤</span>
          <div><span className="resumo-label">Clientes</span><strong>{resumo.clientes}</strong></div>
        </div>
        <div className="resumo-card">
          <span className="resumo-icon">🛒</span>
          <div><span className="resumo-label">Vendas</span><strong>{resumo.vendas}</strong></div>
        </div>
      </div>

      <div className="dash-secoes">
        <MedicamentoForm onSalvo={recarregar} />
        <ClienteForm     onSalvo={recarregar} />
        <ClienteList     atualizar={refresh}  />
        <VendaForm       onSalvo={recarregar} />
        <VendaList       atualizar={refresh}  />
      </div>
    </div>
  );
}
