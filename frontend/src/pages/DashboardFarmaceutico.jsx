import { useEffect, useState } from 'react';
import { getMedicamentos, getClientes, getVendas } from '../hooks/useApi';
import MedicamentoForm from '../components/medicamento/MedicamentoForm';
import MedicamentoList from '../components/medicamento/MedicamentoList';
import ClienteForm     from '../components/cliente/ClienteForm';
import ClienteList     from '../components/cliente/ClienteList';
import VendaForm       from '../components/venda/VendaForm';
import VendaList       from '../components/venda/VendaList';

export default function DashboardFarmaceutico() {
  const [resumo, setResumo]     = useState({ meds: '—', clientes: '—', vendas: '—' });
  const [refresh, setRefresh]   = useState(0);
  const [abaAtiva, setAbaAtiva] = useState('visao_geral'); 
  // 'visao_geral' | 'cadastrar_medicamento' | 'lista_medicamentos' | 'cadastrar_cliente' | 'lista_clientes' | 'registrar_venda' | 'lista_vendas'

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

      {/* Sub-navbar de Abas */}
      <div className="sub-navbar-tabs">
        <button 
          className={`sub-navbar-tab ${abaAtiva === 'visao_geral' ? 'ativa' : ''}`} 
          onClick={() => setAbaAtiva('visao_geral')}
        >
          📊 Visão Geral
        </button>
        <button 
          className={`sub-navbar-tab ${abaAtiva === 'cadastrar_medicamento' ? 'ativa' : ''}`} 
          onClick={() => setAbaAtiva('cadastrar_medicamento')}
        >
          ➕ Cadastrar Medicamento
        </button>
        <button 
          className={`sub-navbar-tab ${abaAtiva === 'lista_medicamentos' ? 'ativa' : ''}`} 
          onClick={() => setAbaAtiva('lista_medicamentos')}
        >
          📋 Estoque de Medicamentos
        </button>
        <button 
          className={`sub-navbar-tab ${abaAtiva === 'cadastrar_cliente' ? 'ativa' : ''}`} 
          onClick={() => setAbaAtiva('cadastrar_cliente')}
        >
          ➕ Cadastrar Cliente
        </button>
        <button 
          className={`sub-navbar-tab ${abaAtiva === 'lista_clientes' ? 'ativa' : ''}`} 
          onClick={() => setAbaAtiva('lista_clientes')}
        >
          👥 Lista de Clientes
        </button>
        <button 
          className={`sub-navbar-tab ${abaAtiva === 'registrar_venda' ? 'ativa' : ''}`} 
          onClick={() => setAbaAtiva('registrar_venda')}
        >
          🛒 Registrar Venda
        </button>
        <button 
          className={`sub-navbar-tab ${abaAtiva === 'lista_vendas' ? 'ativa' : ''}`} 
          onClick={() => setAbaAtiva('lista_vendas')}
        >
          🧾 Histórico de Vendas
        </button>
      </div>

      {/* Renderização Condicional das "Páginas" */}

      {abaAtiva === 'visao_geral' && (
        <div style={{ animation: 'fadeIn 0.2s ease' }}>
          {/* Cards de resumo */}
          <div className="dash-cards-resumo">
            <div className="resumo-card" onClick={() => setAbaAtiva('lista_medicamentos')} style={{ cursor: 'pointer' }}>
              <span className="resumo-icon">💊</span>
              <div><span className="resumo-label">Medicamentos</span><strong>{resumo.meds}</strong></div>
            </div>
            <div className="resumo-card" onClick={() => setAbaAtiva('lista_clientes')} style={{ cursor: 'pointer' }}>
              <span className="resumo-icon">👤</span>
              <div><span className="resumo-label">Clientes</span><strong>{resumo.clientes}</strong></div>
            </div>
            <div className="resumo-card" onClick={() => setAbaAtiva('lista_vendas')} style={{ cursor: 'pointer' }}>
              <span className="resumo-icon">🛒</span>
              <div><span className="resumo-label">Vendas</span><strong>{resumo.vendas}</strong></div>
            </div>
          </div>

          <div className="dash-secao" style={{ marginTop: '2rem' }}>
            <h3>Acesso Rápido</h3>
            <p style={{ color: 'var(--texto-suave)', marginBottom: '1.5rem' }}>Selecione um atalho rápido abaixo para acessar as ferramentas administrativas:</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
              <div className="resumo-card" onClick={() => setAbaAtiva('cadastrar_medicamento')} style={{ cursor: 'pointer', borderLeft: '3px solid var(--verde)' }}>
                <span className="resumo-icon">➕</span>
                <div><span className="resumo-label">Estoque</span><strong>Novo Medicamento</strong></div>
              </div>
              <div className="resumo-card" onClick={() => setAbaAtiva('lista_medicamentos')} style={{ cursor: 'pointer', borderLeft: '3px solid var(--verde)' }}>
                <span className="resumo-icon">📋</span>
                <div><span className="resumo-label">Estoque</span><strong>Ver Catálogo</strong></div>
              </div>
              <div className="resumo-card" onClick={() => setAbaAtiva('cadastrar_cliente')} style={{ cursor: 'pointer', borderLeft: '3px solid var(--azul)' }}>
                <span className="resumo-icon">👤</span>
                <div><span className="resumo-label">Clientes</span><strong>Novo Cadastro</strong></div>
              </div>
              <div className="resumo-card" onClick={() => setAbaAtiva('lista_clientes')} style={{ cursor: 'pointer', borderLeft: '3px solid var(--azul)' }}>
                <span className="resumo-icon">👥</span>
                <div><span className="resumo-label">Clientes</span><strong>Ver Listagem</strong></div>
              </div>
              <div className="resumo-card" onClick={() => setAbaAtiva('registrar_venda')} style={{ cursor: 'pointer', borderLeft: '3px solid var(--laranja, #f59e0b)' }}>
                <span className="resumo-icon">🛒</span>
                <div><span className="resumo-label">Transações</span><strong>Registrar Venda</strong></div>
              </div>
              <div className="resumo-card" onClick={() => setAbaAtiva('lista_vendas')} style={{ cursor: 'pointer', borderLeft: '3px solid var(--laranja, #f59e0b)' }}>
                <span className="resumo-icon">🧾</span>
                <div><span className="resumo-label">Transações</span><strong>Histórico</strong></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {abaAtiva === 'cadastrar_medicamento' && (
        <div style={{ animation: 'fadeIn 0.2s ease' }}>
          <MedicamentoForm onSalvo={recarregar} />
        </div>
      )}

      {abaAtiva === 'lista_medicamentos' && (
        <div style={{ animation: 'fadeIn 0.2s ease' }}>
          <div className="dash-secao">
            <h3>Estoque e Validade de Medicamentos</h3>
            <MedicamentoList />
          </div>
        </div>
      )}

      {abaAtiva === 'cadastrar_cliente' && (
        <div style={{ animation: 'fadeIn 0.2s ease' }}>
          <ClienteForm     onSalvo={recarregar} />
        </div>
      )}

      {abaAtiva === 'lista_clientes' && (
        <div style={{ animation: 'fadeIn 0.2s ease' }}>
          <ClienteList     atualizar={refresh}  />
        </div>
      )}

      {abaAtiva === 'registrar_venda' && (
        <div style={{ animation: 'fadeIn 0.2s ease' }}>
          <VendaForm       onSalvo={recarregar} />
        </div>
      )}

      {abaAtiva === 'lista_vendas' && (
        <div style={{ animation: 'fadeIn 0.2s ease' }}>
          <VendaList       atualizar={refresh}  />
        </div>
      )}
    </div>
  );
}
