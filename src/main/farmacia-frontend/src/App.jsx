import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import MedicamentoForm from './components/medicamento/MedicamentoForm';
import MedicamentoList from './components/medicamento/MedicamentoList';

function App() {
  return (
    <Router>
      <Navbar />
      <div style={{ padding: '20px' }}>
        <Routes>
          <Route path="/" element={<h2>Bem-vindo ao Sistema da Farmácia</h2>} />
          
          <Route path="/medicamentos" element={
            <>
              <MedicamentoForm />
              <hr />
              <MedicamentoList />
            </>
          } />

          <Route path="/clientes" element={<h2>Tela de Clientes (A criar...)</h2>} />
          <Route path="/vendas" element={<h2>Tela de Vendas (A criar...)</h2>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;