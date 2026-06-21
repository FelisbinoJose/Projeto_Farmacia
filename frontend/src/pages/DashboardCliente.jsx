import MedicamentoList from '../components/medicamento/MedicamentoList';

export default function DashboardCliente() {
  return (
    <div className="dash-conteudo">
      <div className="dash-bem-vindo">
        <h1>Olá! 😊</h1>
        <p>Encontre os melhores medicamentos para você e sua família.</p>
      </div>
      <MedicamentoList />
    </div>
  );
}
