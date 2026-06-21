import { useState } from 'react';
import { useApp } from '../context/AppContext';

export default function ModalLogin({ onFechar }) {
  const { entrar } = useApp();
  const [aba, setAba] = useState('cliente');

  const handleEntrar = (tipo) => {
    entrar(tipo);
    onFechar();
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onFechar()}>
      <div className="modal-box">
        <button className="modal-close" onClick={onFechar}>✕</button>

        {/* Abas */}
        <div className="modal-tabs">
          <button className={`modal-tab ${aba === 'cliente' ? 'ativo' : ''}`} onClick={() => setAba('cliente')}>
            👤 Cliente
          </button>
          <button className={`modal-tab ${aba === 'farmaceutico' ? 'ativo' : ''}`} onClick={() => setAba('farmaceutico')}>
            ⚕️ Farmacêutico
          </button>
        </div>

        {/* Formulário Cliente */}
        {aba === 'cliente' && (
          <div className="modal-form active">
            <h2>Bem-vindo de volta!</h2>
            <p className="modal-sub">Acesse para fazer seus pedidos</p>
            <label>Email</label>
            <input type="email" placeholder="seu@email.com" />
            <label>Senha</label>
            <input type="password" placeholder="••••••••" />
            <button className="btn-modal" onClick={() => handleEntrar('cliente')}>
              Entrar como Cliente
            </button>
            <p className="modal-link">Não tem conta? <a href="#">Cadastre-se grátis</a></p>
          </div>
        )}

        {/* Formulário Farmacêutico */}
        {aba === 'farmaceutico' && (
          <div className="modal-form active">
            <h2>Acesso Profissional</h2>
            <p className="modal-sub">Área restrita para farmacêuticos</p>
            <label>CRF</label>
            <input type="text" placeholder="CRF-SC 00000" />
            <label>Senha</label>
            <input type="password" placeholder="••••••••" />
            <button className="btn-modal farma" onClick={() => handleEntrar('farmaceutico')}>
              Entrar como Farmacêutico
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
