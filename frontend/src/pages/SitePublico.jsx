import MedicamentoList from '../components/medicamento/MedicamentoList';

export default function SitePublico({ onAbrirLogin }) {
  return (
    <>
      {/* Hero */}
      <section className="hero">
        <div className="hero-conteudo">
          <div className="hero-tag">✅ Farmácia com propósito</div>
          <h1 className="hero-titulo">Sua saúde<br /><em>merece o melhor</em></h1>
          <p className="hero-sub">Medicamentos de qualidade, orientação profissional e entrega rápida até você.</p>
          <div className="hero-botoes">
            <button className="btn-hero-prim" onClick={() => document.getElementById('vitrine')?.scrollIntoView({ behavior: 'smooth' })}>
              💊 Ver Medicamentos
            </button>
            <button className="btn-hero-sec" onClick={onAbrirLogin}>
              👤 Criar Conta
            </button>
          </div>
          <div className="hero-selos">
            <span className="selo">🔐 Compra segura</span>
            <span className="selo">🚗 Entrega rápida</span>
            <span className="selo">⚕️ Orientação farmacêutica</span>
          </div>
        </div>
        <div className="hero-visual">
          <div className="prateleira">
            <div className="prat-item destaque">💊<span>Analgésicos</span></div>
            <div className="prat-item">⚕️<span>Prescrição</span></div>
            <div className="prat-item">🌿<span>Vitaminas</span></div>
            <div className="prat-item">🧴<span>Dermatologia</span></div>
          </div>
        </div>
      </section>

      {/* Vitrine */}
      <section id="vitrine" className="vitrine-secao">
        <MedicamentoList vitrine />
      </section>

      {/* Sobre */}
      <section id="sobre" className="sobre-secao">
        <div className="sobre-conteudo">
          <h2>Por que escolher a FarmaVida?</h2>
          <div className="sobre-grid">
            <div className="sobre-card">
              <span className="sobre-icon">⚕️</span>
              <h3>Farmacêuticos especializados</h3>
              <p>Nossa equipe orienta você na escolha do medicamento ideal.</p>
            </div>
            <div className="sobre-card">
              <span className="sobre-icon">🔐</span>
              <h3>Compra 100% segura</h3>
              <p>Seus dados protegidos e medicamentos com procedência garantida.</p>
            </div>
            <div className="sobre-card">
              <span className="sobre-icon">🚗</span>
              <h3>Entrega ágil</h3>
              <p>Receba seus medicamentos com comodidade e rapidez.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contato */}
      <section id="contato" className="contato-secao">
        <h2>📞 Entre em Contato</h2>
        <p>Dúvidas? Nossa equipe atende de segunda a sábado, das 8h às 20h.</p>
        <div className="contato-canais">
          <div className="canal">📞 (48) 99999-0000</div>
          <div className="canal">📧 contato@farmavida.com.br</div>
          <div className="canal">📍 Rua da Saúde, 100 — SC</div>
        </div>
      </section>

      <footer className="rodape">
        <p>© 2024 FarmaVida — Todos os direitos reservados.</p>
        <p style={{ fontSize: '0.8rem', opacity: 0.6 }}>Projeto acadêmico — Unibave</p>
      </footer>
    </>
  );
}
