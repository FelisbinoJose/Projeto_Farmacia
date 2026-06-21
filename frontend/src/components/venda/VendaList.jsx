import { useEffect, useState } from 'react';
import { getVendas, formatarData, formatarPreco } from '../../hooks/useApi';

export default function VendaList({ atualizar }) {
  const [vendas, setVendas] = useState([]);

  useEffect(() => {
    getVendas().then(setVendas).catch(() => setVendas([]));
  }, [atualizar]);

  return (
    <div className="dash-secao">
      <h3>📋 Histórico de Vendas</h3>
      <div className="tabela-wrap">
        <table>
          <thead>
            <tr>
              <th>Cliente</th>
              <th>Medicamento</th>
              <th>Qtd</th>
              <th>Preço Unit.</th>
              <th>Total</th>
              <th>Data</th>
            </tr>
          </thead>
          <tbody>
            {vendas.length === 0 ? (
              <tr><td colSpan={6} style={{ textAlign: 'center', color: 'var(--texto-suave)', padding: '2rem' }}>Nenhuma venda registrada.</td></tr>
            ) : (
              vendas.map(v => (
                <tr key={v.id}>
                  <td>{v.cliente?.nome              || '—'}</td>
                  <td>{v.medicamento?.nomeComercial || '—'}</td>
                  <td>{v.quantidade}</td>
                  <td>{v.medicamento?.preco ? formatarPreco(v.medicamento.preco) : '—'}</td>
                  <td style={{ fontWeight: 700, color: 'var(--verde)' }}>
                    {v.medicamento?.preco ? formatarPreco(v.medicamento.preco * v.quantidade) : '—'}
                  </td>
                  <td>{formatarData(v.dataVenda)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
