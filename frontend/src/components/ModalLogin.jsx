import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { registrarUsuarioApi, postCliente } from '../hooks/useApi';

export default function ModalLogin({ onFechar }) {
  const { entrar, toast } = useApp();
  const [modo, setModo] = useState('login'); // 'login' | 'cadastro'
  const [aba, setAba] = useState('cliente');
  const [usernameInput, setUsernameInput] = useState('');
  const [senhaInput, setSenhaInput] = useState('');
  const [nomeInput, setNomeInput] = useState('');
  const [idadeInput, setIdadeInput] = useState('');
  const [cpfInput, setCpfInput] = useState('');
  const [enderecoInput, setEnderecoInput] = useState('');
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);

  const mudarAba = (novaAba) => {
    setAba(novaAba);
    setUsernameInput('');
    setSenhaInput('');
    setErro('');
  };

  const limparCadastro = () => {
    setUsernameInput('');
    setSenhaInput('');
    setNomeInput('');
    setIdadeInput('');
    setCpfInput('');
    setEnderecoInput('');
    setErro('');
  };

  const handleEntrar = async (e) => {
    if (e) e.preventDefault();
    if (!usernameInput.trim() || !senhaInput) {
      setErro('Por favor, preencha todos os campos.');
      return;
    }
    setCarregando(true);
    setErro('');
    try {
      await entrar(usernameInput.trim(), senhaInput, aba);
      toast(`👋 Bem-vindo de volta, ${usernameInput}!`);
      onFechar();
    } catch (err) {
      console.error(err);
      if (err.response && err.response.data) {
        setErro(typeof err.response.data === 'string' ? err.response.data : 'Erro ao realizar login.');
      } else {
        setErro(err.message || 'Erro de conexão com o servidor.');
      }
    } finally {
      setCarregando(false);
    }
  };

  const handleCadastro = async (e) => {
    if (e) e.preventDefault();
    
    // Validações
    if (!usernameInput.trim() || !senhaInput || !nomeInput.trim() || !idadeInput || !cpfInput.trim() || !enderecoInput.trim()) {
      setErro('Por favor, preencha todos os campos do cadastro.');
      return;
    }
    if (senhaInput.length < 8) {
      setErro('A senha deve ter pelo menos 8 caracteres.');
      return;
    }
    if (!/^\d{11}$/.test(cpfInput.trim())) {
      setErro('O CPF deve conter exatamente 11 dígitos numéricos.');
      return;
    }
    const idadeNum = parseInt(idadeInput);
    if (isNaN(idadeNum) || idadeNum <= 0) {
      setErro('A idade deve ser um número válido maior que zero.');
      return;
    }

    setCarregando(true);
    setErro('');
    try {
      // 1. Criar o Usuário no banco
      await registrarUsuarioApi(usernameInput.trim(), senhaInput);
      
      // 2. Criar a ficha do Cliente no banco
      await postCliente({
        nome: nomeInput.trim(),
        idade: idadeNum,
        cpf: cpfInput.trim(),
        endereco: enderecoInput.trim()
      });

      // 3. Fazer o login automático
      await entrar(usernameInput.trim(), senhaInput, 'cliente');
      toast('🎉 Conta criada e logada com sucesso!');
      onFechar();
    } catch (err) {
      console.error(err);
      if (err.response && err.response.data) {
        setErro(typeof err.response.data === 'string' ? err.response.data : 'Erro ao realizar cadastro.');
      } else {
        setErro(err.message || 'Erro ao salvar cadastro. Verifique se o usuário ou CPF já existem.');
      }
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onFechar()}>
      <div className="modal-box" style={{ maxWidth: modo === 'cadastro' ? '480px' : '400px' }}>
        <button className="modal-close" onClick={onFechar}>✕</button>

        {modo === 'login' ? (
          <>
            {/* Abas */}
            <div className="modal-tabs">
              <button className={`modal-tab ${aba === 'cliente' ? 'ativo' : ''}`} onClick={() => mudarAba('cliente')}>
                👤 Cliente
              </button>
              <button className={`modal-tab ${aba === 'farmaceutico' ? 'ativo' : ''}`} onClick={() => mudarAba('farmaceutico')}>
                ⚕️ Farmacêutico
              </button>
            </div>

            {erro && <div className="modal-erro" style={{ color: 'var(--vermelho)', backgroundColor: '#ffebee', padding: '0.8rem', borderRadius: '4px', marginBottom: '1rem', fontSize: '0.9rem', textAlign: 'center' }}>⚠️ {erro}</div>}

            {/* Formulário Cliente */}
            {aba === 'cliente' && (
              <form className="modal-form active" onSubmit={handleEntrar}>
                <h2>Bem-vindo de volta!</h2>
                <p className="modal-sub">Acesse para fazer seus pedidos (ex: cliente / cliente123)</p>
                <label>Usuário ou Email</label>
                <input 
                  type="text" 
                  placeholder="Ex: cliente" 
                  value={usernameInput}
                  onChange={e => setUsernameInput(e.target.value)}
                />
                <label>Senha</label>
                <input 
                  type="password" 
                  placeholder="••••••••" 
                  value={senhaInput}
                  onChange={e => setSenhaInput(e.target.value)}
                />
                <button className="btn-modal" type="submit" disabled={carregando}>
                  {carregando ? 'Entrando...' : 'Entrar como Cliente'}
                </button>
                <p className="modal-link">Não tem conta? <a href="#" onClick={(e) => { e.preventDefault(); setModo('cadastro'); limparCadastro(); }}>Cadastre-se grátis</a></p>
              </form>
            )}

            {/* Formulário Farmacêutico */}
            {aba === 'farmaceutico' && (
              <form className="modal-form active" onSubmit={handleEntrar}>
                <h2>Acesso Profissional</h2>
                <p className="modal-sub">Área restrita para farmacêuticos (ex: admin / admin123)</p>
                <label>Usuário ou CRF</label>
                <input 
                  type="text" 
                  placeholder="Ex: admin" 
                  value={usernameInput}
                  onChange={e => setUsernameInput(e.target.value)}
                />
                <label>Senha</label>
                <input 
                  type="password" 
                  placeholder="••••••••" 
                  value={senhaInput}
                  onChange={e => setSenhaInput(e.target.value)}
                />
                <button className="btn-modal farma" type="submit" disabled={carregando}>
                  {carregando ? 'Entrando...' : 'Entrar como Farmacêutico'}
                </button>
              </form>
            )}
          </>
        ) : (
          <form className="modal-form active" onSubmit={handleCadastro}>
            <h2>Criar Conta de Cliente</h2>
            <p className="modal-sub">Cadastre-se para gerenciar seus pedidos</p>

            {erro && <div className="modal-erro" style={{ color: 'var(--vermelho)', backgroundColor: '#ffebee', padding: '0.8rem', borderRadius: '4px', marginBottom: '1rem', fontSize: '0.9rem', textAlign: 'center' }}>⚠️ {erro}</div>}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem' }}>
              <div>
                <label>Usuário (Login)</label>
                <input 
                  type="text" 
                  placeholder="Ex: maria_silva" 
                  value={usernameInput}
                  onChange={e => setUsernameInput(e.target.value)}
                />
              </div>
              <div>
                <label>Senha (min. 8)</label>
                <input 
                  type="password" 
                  placeholder="••••••••" 
                  value={senhaInput}
                  onChange={e => setSenhaInput(e.target.value)}
                />
              </div>
            </div>

            <label>Nome Completo</label>
            <input 
              type="text" 
              placeholder="Ex: Maria da Silva" 
              value={nomeInput}
              onChange={e => setNomeInput(e.target.value)}
            />

            <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr', gap: '0.8rem' }}>
              <div>
                <label>Idade</label>
                <input 
                  type="number" 
                  placeholder="30" 
                  value={idadeInput}
                  onChange={e => setIdadeInput(e.target.value)}
                />
              </div>
              <div>
                <label>CPF (11 dígitos, apenas números)</label>
                <input 
                  type="text" 
                  placeholder="Ex: 12345678901" 
                  maxLength={11}
                  value={cpfInput}
                  onChange={e => setCpfInput(e.target.value)}
                />
              </div>
            </div>

            <label>Endereço Completo</label>
            <input 
              type="text" 
              placeholder="Ex: Av. Brasil, 456 - Centro" 
              value={enderecoInput}
              onChange={e => setEnderecoInput(e.target.value)}
            />

            <button className="btn-modal" type="submit" disabled={carregando} style={{ marginTop: '1rem' }}>
              {carregando ? 'Cadastrando...' : 'Confirmar e Cadastrar'}
            </button>
            
            <p className="modal-link">Já tem uma conta? <a href="#" onClick={(e) => { e.preventDefault(); setModo('login'); setErro(''); }}>Fazer Login</a></p>
          </form>
        )}
      </div>
    </div>
  );
}
