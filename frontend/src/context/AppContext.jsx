import { createContext, useContext, useState, useCallback } from 'react';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  // ── Auth ──
  const [perfil, setPerfil] = useState(null); // null | 'cliente' | 'farmaceutico'

  const entrar  = (tipo) => setPerfil(tipo);
  const sair    = ()     => { setPerfil(null); setCarrinho([]); };

  // ── Carrinho ──
  const [carrinho, setCarrinho] = useState([]);

  const adicionarAoCarrinho = (med, qtd = 1) => {
    setCarrinho(prev => {
      const existe = prev.find(i => i.id === med.id);
      if (existe) return prev.map(i => i.id === med.id ? { ...i, qtd: i.qtd + qtd } : i);
      return [...prev, { ...med, qtd }];
    });
  };

  const removerDoCarrinho = (id) =>
    setCarrinho(prev => prev.filter(i => i.id !== id));

  const limparCarrinho = () => setCarrinho([]);

  const totalCarrinho = carrinho.reduce((acc, i) => acc + i.qtd, 0);

  // ── Toast ──
  const [toasts, setToasts] = useState([]);

  const toast = useCallback((msg, tipo = 'sucesso') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, msg, tipo }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000);
  }, []);

  return (
    <AppContext.Provider value={{
      perfil, entrar, sair,
      carrinho, adicionarAoCarrinho, removerDoCarrinho, limparCarrinho, totalCarrinho,
      toast, toasts,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
