import { useApp } from '../context/AppContext';

export default function Navbar({ onAbrirLogin, onAbrirCarrinho }) {
  const { perfil, sair, totalCarrinho } = useApp();

  if (!perfil) return (
    <nav className="navbar">
      <div className="navbar-logo">💊 FarmaVida</div>
      <div className="navbar-links">
        <a href="#vitrine">Medicamentos</a>
        <a href="#sobre">Sobre</a>
        <a href="#contato">Contato</a>
      </div>
      <button className="btn-entrar" onClick={onAbrirLogin}>🔐 Entrar</button>
    </nav>
  );

  if (perfil === 'cliente') return (
    <nav className="navbar">
      <div className="navbar-logo">💊 FarmaVida</div>
      <div style={{ display: 'flex', gap: '0.7rem' }}>
        <button className="btn-nav" onClick={onAbrirCarrinho} style={{ position: 'relative' }}>
          🛒 Meu Pedido
          {totalCarrinho > 0 && <span className="badge-carrinho">{totalCarrinho}</span>}
        </button>
        <button className="btn-nav" onClick={sair}>↩ Sair</button>
      </div>
    </nav>
  );

  return (
    <nav className="navbar navbar-dash">
      <div className="navbar-logo">⚕️ Painel Farmacêutico</div>
      <button className="btn-nav" onClick={sair}>↩ Sair</button>
    </nav>
  );
}
