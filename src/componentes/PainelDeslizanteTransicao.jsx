import '../styles/PainelDeslizanteTransicao.css';

function PainelDeslizanteTransicao({ onShowCadastro, onShowLogin }) {
    return (
        <>
            <div className="toggle-box">
                <div className="toggle-panel toggle-left">
                    <span className="badge-feature">Inteligência Acadêmica</span>
                    <h3>Primeira vez no Malagon?</h3>
                    <p>Crie sua conta para acessar recomendações por IA, comparador de custos globais e checklist completo de visto.</p>
                    <button type="button" className="btn btn-outline btn-cadastro" onClick={onShowCadastro}>Cadastrar-se Agora</button>
                </div>

                <div className="toggle-panel toggle-right">
                    <span className="badge-feature">Plataforma Internacional</span>
                    <h3>Já planeja conosco?</h3>
                    <p>Acesse seu painel para continuar sua aplicação e gerenciar seu orçamento de intercâmbio.</p>
                    <button type="button" className="btn btn-outline btn-login" onClick={onShowLogin}>Voltar ao Login</button>
                </div>
            </div>

        </>

    );

}

export default PainelDeslizanteTransicao;