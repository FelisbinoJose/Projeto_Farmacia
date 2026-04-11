import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';

// Importe seus componentes (Verifique se os caminhos estão corretos na sua pasta)
import MedicamentoList from './components/medicamento/MedicamentoList';
import MedicamentoForm from './components/medicamento/MedicamentoForm';
import ClienteList from './components/cliente/ClienteList';
import ClienteForm from './components/cliente/ClienteForm';
import VendaForm from './components/venda/VendaForm';
import VendaList from './components/venda/VendaList';

function AppContent() {
  const [perfil, setPerfil] = useState('publico'); 
  const [medSelecionado, setMedSelecionado] = useState(null);
  const navigate = useNavigate();


  const lidarComCompra = (med) => {
    setMedSelecionado(med);
    setPerfil('cliente'); 
    navigate('/vendas');
  };

  return (
    <>
      {/* NAVBAR ORGANIZADA */}
      <nav style={navStyle}>
        <div style={{ fontWeight: 'bold' }}>💊 Farmácia Unibave</div>
        <div style={{ display: 'flex', gap: '15px' }}>
          <Link to="/" style={linkStyle}>Início</Link>

          {perfil === 'funcionario' && (
            <>
              <Link to="/estoque" style={linkStyle}>Gerenciar Estoque</Link>
              <Link to="/clientes" style={linkStyle}>Gerenciar Clientes</Link>
              <Link to="/pedidos-recebidos" style={linkStyle}>Pedidos Recebidos</Link>
            </>
          )}

          {perfil === 'cliente' && (
            <Link to="/vendas" style={linkStyle}>Fazer Pedido</Link>
          )}
        </div>

        {/* BOTÕES DE PERFIL PARA TESTE */}
        <div>
          <button onClick={() => setPerfil('publico')} style={btnPerfil}>Público</button>
          <button onClick={() => setPerfil('funcionario')} style={btnPerfil}>Funcionário</button>
          <button onClick={() => setPerfil('cliente')} style={btnPerfil}>Cliente</button>
        </div>
      </nav>

      <div style={{ padding: '20px' }}>
        <Routes>
          {/* ROTAS PÚBLICAS / COMPARTILHADAS */}
          <Route path="/" element={<MedicamentoList perfil={perfil} aoComprar={lidarComCompra} />} />
          <Route path="/medicamentos" element={<MedicamentoList perfil={perfil} aoComprar={lidarComCompra} />} />

          {/* ROTAS EXCLUSIVAS DO FUNCIONÁRIO */}
          {perfil === 'funcionario' && (
            <>
              <Route path="/estoque" element={
                <>
                  <MedicamentoForm />
                  <hr />
                  <MedicamentoList perfil={perfil} />
                </>
              } />
              <Route path="/clientes" element={
                <>
                  <ClienteForm />
                  <hr />
                  <ClienteList />
                </>
              } />
              <Route path="/pedidos-recebidos" element={<VendaList />} />
            </>
          )}

          {/* ROTA EXCLUSIVA DO CLIENTE */}
          {perfil === 'cliente' && (
            <Route path="/vendas" element={
              <VendaForm medicamentoPreSelecao={medSelecionado} perfil={perfil} />
            } />
          )}

          {/* ROTA DE ERRO (Caso a pessoa tente acessar algo sem permissão) */}
          <Route path="*" element={<h3>Página não encontrada ou Acesso Negado</h3>} />
        </Routes>
      </div>
    </>
  );
}

// Estilos básicos para manter o "tapa no visual"
const navStyle = { display: 'flex', justifyContent: 'space-between', padding: '15px', backgroundColor: '#2c3e50', color: 'white', alignItems: 'center' };
const linkStyle = { color: 'white', textDecoration: 'none', padding: '5px 10px' };
const btnPerfil = { marginLeft: '5px', fontSize: '10px', cursor: 'pointer' };

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}