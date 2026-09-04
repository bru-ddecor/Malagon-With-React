import '../styles/CabecalhoMacOSCard.css';

function CabecalhoMacOSCard() {
  return (
    <>
      <div className="login-bg"></div>
      <div className="overlay"></div>
       
        <div className="card-header">
          <span className="btn-fechar"></span>
      <span className="btn-minimizar"></span>
      <span className="btn-expandir"></span>
      <span className="titulo-janela">Portal do Estudante | Malagon</span>
    </div>
    </>
  );
}

export default CabecalhoMacOSCard;