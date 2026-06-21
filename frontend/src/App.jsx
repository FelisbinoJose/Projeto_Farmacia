import { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Navbar                  from './components/Navbar';
import ModalLogin              from './components/ModalLogin';
import Carrinho                from './components/Carrinho';
import SitePublico             from './pages/SitePublico';
import DashboardCliente        from './pages/DashboardCliente';
import DashboardFarmaceutico   from './pages/DashboardFarmaceutico';
import './App.css';

function Toast() {
  const { toasts } = useApp();
  return (
    <div className="toast-wrap">
      {toasts.map(t => (
        <div key={t.id} className={`toast ${t.tipo}`}>{t.msg}</div>
      ))}
    </div>
  );
}

function AppInner() {
  const { perfil }          = useApp();
  const [loginAberto, setLoginAberto]       = useState(false);
  const [carrinhoAberto, setCarrinhoAberto] = useState(false);

  return (
    <>
      <Navbar
        onAbrirLogin={() => setLoginAberto(true)}
        onAbrirCarrinho={() => setCarrinhoAberto(true)}
      />

      {/* Conteúdo principal por perfil */}
      {!perfil               && <SitePublico onAbrirLogin={() => setLoginAberto(true)} />}
      {perfil === 'cliente'  && <DashboardCliente />}
      {perfil === 'farmaceutico' && <DashboardFarmaceutico />}

      {/* Modais globais */}
      {loginAberto    && <ModalLogin onFechar={() => setLoginAberto(false)} />}
      {carrinhoAberto && <Carrinho   onFechar={() => setCarrinhoAberto(false)} />}

      <Toast />
    </>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppInner />
    </AppProvider>
  );
}
