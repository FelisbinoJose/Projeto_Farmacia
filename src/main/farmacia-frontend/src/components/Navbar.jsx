import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav style={{ 
      padding: '1rem', 
      backgroundColor: '#2c3e50', 
      color: 'white',
      display: 'flex',
      gap: '20px' 
    }}>
      <Link to="/" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold' }}>Home</Link>
      <Link to="/medicamentos" style={{ color: 'white', textDecoration: 'none' }}>Medicamentos</Link>
      <Link to="/clientes" style={{ color: 'white', textDecoration: 'none' }}>Clientes</Link>
      <Link to="/vendas" style={{ color: 'white', textDecoration: 'none' }}>Nova Venda</Link>
    </nav>
  );
};

export default Navbar;