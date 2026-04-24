const Navbar = ({ perfil, setPerfil }) => {
  return (
    <nav style={navStyle}>
      <div className="logo">💊 Farmácia Unibave</div>
      
      <div className="links">
        <Link to="/">Home</Link>

        {perfil === 'funcionario' && (
          <>
            <Link to="/estoque">Gerir Estoque</Link>
            <Link to="/clientes">Clientes</Link>
            <Link to="/pedidos-recebidos">Pedidos</Link>
          </>
        )}

        {perfil === 'cliente' && (
          <Link to="/meus-pedidos">Fazer Pedido</Link>
        )}

        {/* BOTÕES DE LOGIN (Simulados para teste) */}
        {perfil === 'publico' ? (
          <div>
            <button onClick={() => setPerfil('funcionario')}>Login Funcional</button>
            <button onClick={() => setPerfil('cliente')}>Login Cliente</button>
          </div>
        ) : (
          <button onClick={() => setPerfil('publico')}>Sair (Logout)</button>
        )}
      </div>
    </nav>
  );
};