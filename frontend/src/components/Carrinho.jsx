import { useApp } from '../context/AppContext';
import { formatarPreco, getEmoji } from '../hooks/useApi';

export default function Carrinho({ onFechar }) {
  const { carrinho, removerDoCarrinho, limparCarrinho, toast } = useApp();

  const total = carrinho.reduce((acc, i) => acc + i.preco * i.qtd, 0);

  const finalizar = () => {
    limparCarrinho();
    toast('🎉 Pedido realizado! Em breve entraremos em contato.');
    onFechar();
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onFechar()}>
      <div className="modal-box">
        <button className="modal-close" onClick={onFechar}>✕</button>
        <h2 style={{ marginBottom: '1.5rem' }}>🛒 Meu Pedido</h2>

        {carrinho.length === 0 ? (
          <div className="carrinho-vazio">
            <span>🛒</span>
            <p>Nenhum item ainda</p>
          </div>
        ) : (
          <>
            {carrinho.map(item => (
              <div key={item.id} className="carrinho-item">
                <div>
                  <div className="carrinho-item-nome">
                    {getEmoji(item.nomeComercial, item.classificacao)} {item.nomeComercial}
                  </div>
                  <div className="carrinho-item-detalhe">
                    {item.qtd} × {formatarPreco(item.preco)}
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span className="carrinho-item-preco">{formatarPreco(item.preco * item.qtd)}</span>
                  <button className="btn-rm" onClick={() => removerDoCarrinho(item.id)}>🗑️</button>
                </div>
              </div>
            ))}

            <div className="carrinho-total-row">
              <span>Total estimado:</span>
              <strong>{formatarPreco(total)}</strong>
            </div>

            <button className="btn-modal" onClick={finalizar}>✅ Finalizar Pedido</button>
          </>
        )}
      </div>
    </div>
  );
}
