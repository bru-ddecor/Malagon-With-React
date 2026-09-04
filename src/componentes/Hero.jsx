import fundo from '../assets/fundo.jpg'
import fundo2 from '../assets/fundo2.jpg'
import fundo3 from '../assets/fundo3.jpg'
import '../styles/Hero.css';

function Hero() {
    return (
    <section className="hero">
            <div className="bg ativo" style={{ backgroundImage: `url(${fundo})` }}></div>
            <div className="bg" style={{ backgroundImage: `url(${fundo2})` }}></div>
            <div className="bg" style={{ backgroundImage: `url(${fundo3})` }}></div>
      <div className="hero-overlay"></div>


            <div className="hero-content">
              <span className="tag-badge">IA + Intercâmbio</span>
              <h1>Planeje seu <span>Intercâmbio</span> com Inteligência</h1>
                <p>Simule custos, organize vistos e encontre sua rota acadêmica em qualquer lugar do mundo com total segurança e precisão.</p>

                <div className="botoes">
                  <a href="/" className="btn-primary">Começar Simulação</a>
                  <button className="btn-secondary" id="btnVerMais">Saiba Mais ↓</button>
                </div>
            </div>

            <div className="hero-dashboard">
          <div className="dash-card">
            <div className="card-topo">
              <span className="icone orange">📊</span>
              <small>MONTHLY AVG</small>
            </div>
            <div className="valor-stat">€ 850,00</div>
            <p className="desc-stat">Média estimada para o seu destino.</p>
            <div className="line orange"></div>
          </div>

          <div className="dash-card">
            <div className="card-topo">
              <span className="icone purple">🎯</span>
              <small>TARGET</small>
            </div>
            <div className="valor-stat">€ 3.500,00</div>
            <p className="desc-stat">Reserva para visto acadêmico.</p>
            <div className="line purple"></div>
          </div>

          <div className="dash-card">
            <div className="card-topo">
              <span className="icone green">🚀</span>
              <small>MATCHING IA</small>
            </div>
            <div className="valor-stat">95.8%</div>
            <div className="status-area">
              <span className="status">Alta Compatibilidade</span>
            </div>
            <div className="line green"></div>
          </div>
        </div>
      
        </section>

    );

}

export default Hero;