import { createContext, useContext, useState, useCallback } from 'react';
import { loginApi, logoutApi } from '../hooks/useApi';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  // ── Auth ──
  const [token, setToken] = useState(() => localStorage.getItem('farmacia_token'));
  const [perfil, setPerfil] = useState(() => localStorage.getItem('farmacia_perfil')); // null | 'cliente' | 'farmaceutico'
  const [usuario, setUsuario] = useState(() => localStorage.getItem('farmacia_usuario'));

  const entrar = async (username, senha, tipo) => {
    const res = await loginApi(username, senha);
    if (res && res.token) {
      localStorage.setItem('farmacia_token', res.token);
      localStorage.setItem('farmacia_perfil', tipo);
      localStorage.setItem('farmacia_usuario', username);
      setToken(res.token);
      setPerfil(tipo);
      setUsuario(username);
      return res;
    } else {
      throw new Error('Falha na autenticação: token não retornado');
    }
  };

  const sair = async () => {
    try {
      await logoutApi();
    } catch (e) {
      console.warn("Erro ao fazer logout no servidor (provavelmente já expirado ou inválido):", e);
    }
    localStorage.removeItem('farmacia_token');
    localStorage.removeItem('farmacia_perfil');
    localStorage.removeItem('farmacia_usuario');
    setToken(null);
    setPerfil(null);
    setUsuario(null);
    setCarrinho([]);
  };

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
      perfil, entrar, sair, usuario, token,
      carrinho, adicionarAoCarrinho, removerDoCarrinho, limparCarrinho, totalCarrinho,
      toast, toasts,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
