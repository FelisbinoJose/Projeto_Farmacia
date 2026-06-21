import { useEffect, useState } from 'react';
import { getMedicamentos, getEmoji, getUtilidade, formatarPreco, formatarData } from '../../hooks/useApi';
import { useApp } from '../../context/AppContext';

function ModalProduto({ med, onFechar }) {
  const { perfil, adicionarAoCarrinho, toast } = useApp();
  const [qtd, setQtd] = useState(1);

  const handleAdicionar = () => {
    if (perfil !== 'cliente') { toast('Faça login como cliente para pedir.', 'erro'); return; }
    adicionarAoCarrinho(med, qtd);
    toast(`✅ ${med.nomeComercial} adicionado!`);
    onFechar();
  };

  const livre = med.classificacao !== 'CONTROLADO';

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onFechar()}>
      <div className="modal-produto-box">
        <button className="modal-close" onClick={onFechar}>✕</button>
        <div className="produto-detalhe-grid">
          <div className="produto-detalhe-img">
            <div className="produto-img-grande">{getEmoji(med.nomeComercial, med.classificacao)}</div>
            <span className={`badge ${livre ? 'badge-livre' : 'badge-controlado'}`}>
              {livre ? '✅ Venda Livre' : '⚠️ Controlado'}
            </span>
          </div>
          <div>
            <h2 style={{ color: 'var(--azul)', fontSize: '1.5rem', marginBottom: '0.3rem' }}>{med.nomeComercial}</h2>
            <p style={{ color: 'var(--texto-suave)', marginBottom: '0.5rem' }}>🏭 {med.fabricante}</p>
            <span className="detalhe-preco">{formatarPreco(med.preco)}</span>

            <div className="detalhe-descricao">
              <h4>🌿 Para que serve?</h4>
              <p>{getUtilidade(med)}</p>
            </div>

            <div className="detalhe-infos-grid">
              <div className="detalhe-info-item">
                <span className="info-label">Lote</span>
                <span className="info-valor">#{med.lote}</span>
              </div>
              <div className="detalhe-info-item">
                <span className="info-label">Validade</span>
                <span className="info-valor">{formatarData(med.date)}</span>
              </div>
              <div className="detalhe-info-item">
                <span className="info-label">Tipo</span>
                <span className="info-valor">{livre ? 'Livre' : 'Controlado'}</span>
              </div>
            </div>

            <div className="detalhe-acoes">
              <div className="qtd-control">
                <button onClick={() => setQtd(q => Math.max(1, q - 1))}>−</button>
                <span className="qtd-valor">{qtd}</span>
                <button onClick={() => setQtd(q => q + 1)}>+</button>
              </div>
              <button className="btn-pedir" onClick={handleAdicionar}>🛒 Adicionar ao Pedido</button>
            </div>

            {!livre && (
              <p className="aviso-controlado">⚠️ Medicamento controlado — necessita de receita médica.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function MedicamentoList({ vitrine = false }) {
  const [medicamentos, setMedicamentos]   = useState([]);
  const [filtro, setFiltro]               = useState('todos');
  const [busca, setBusca]                 = useState('');
  const [medSelecionado, setMedSelecionado] = useState(null);
  const [carregando, setCarregando]       = useState(true);

  useEffect(() => {
    getMedicamentos()
      .then(setMedicamentos)
      .catch(() => setMedicamentos([]))
      .finally(() => setCarregando(false));
  }, []);

  const filtrados = medicamentos.filter(m => {
    const bateFiltro = filtro === 'todos' || m.classificacao === filtro;
    const bateBusca  = (m.nomeComercial || '').toLowerCase().includes(busca.toLowerCase()) ||
                       (m.fabricante    || '').toLowerCase().includes(busca.toLowerCase());
    return bateFiltro && bateBusca;
  });

  if (carregando) return <p style={{ textAlign: 'center', padding: '3rem', color: 'var(--texto-suave)' }}>Carregando medicamentos...</p>;

  return (
    <>
      {vitrine && (
        <div className="secao-header">
          <h2>💊 Nossos Medicamentos</h2>
          <p>Produtos com qualidade e segurança garantidas</p>
          <div className="filtros">
            {['todos', 'VENDA_LIVRE', 'CONTROLADO'].map(f => (
              <button
                key={f}
                className={`filtro-btn ${filtro === f ? 'ativo' : ''}`}
                onClick={() => setFiltro(f)}
              >
                {f === 'todos' ? 'Todos' : f === 'VENDA_LIVRE' ? 'Venda Livre' : 'Controlado'}
              </button>
            ))}
          </div>
        </div>
      )}

      {!vitrine && (
        <div className="dash-pesquisa">
          <input
            type="text"
            placeholder="🔍 Buscar medicamento..."
            value={busca}
            onChange={e => setBusca(e.target.value)}
          />
        </div>
      )}

      {filtrados.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--texto-suave)' }}>
          <span style={{ fontSize: '3rem', display: 'block', marginBottom: '1rem' }}>🔍</span>
          <p>Nenhum medicamento encontrado.</p>
        </div>
      ) : (
        <div className="grade-produtos">
          {filtrados.map(med => {
            const livre   = med.classificacao !== 'CONTROLADO';
            const util    = getUtilidade(med);
            return (
              <div key={med.id} className="card-produto" onClick={() => setMedSelecionado(med)}>
                <div className="card-emoji">{getEmoji(med.nomeComercial, med.classificacao)}</div>
                <div className="card-nome">{med.nomeComercial}</div>
                <div className="card-fabricante">{med.fabricante}</div>
                <span className={`badge ${livre ? 'badge-livre' : 'badge-controlado'}`}>
                  {livre ? '✅ Venda Livre' : '⚠️ Controlado'}
                </span>
                <div className="card-utilidade">{util.length > 80 ? util.slice(0, 80) + '…' : util}</div>
                <div className="card-preco">{formatarPreco(med.preco)}</div>
                <button className="btn-ver-mais" onClick={e => { e.stopPropagation(); setMedSelecionado(med); }}>
                  🔍 Ver detalhes
                </button>
              </div>
            );
          })}
        </div>
      )}

      {medSelecionado && (
        <ModalProduto med={medSelecionado} onFechar={() => setMedSelecionado(null)} />
      )}
    </>
  );
}
