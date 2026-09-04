import '../styles/FormularioLogin.css';

function FormularioLogin({ onLogin }) {
    return (
        <>
            <div className="form-box login">
                <form id="form-login" onSubmit={(event) => {
                    event.preventDefault();
                    onLogin();
                }}>
                    <div className="form-title">
                        <h2>Acesse sua Conta</h2>
                        <p>Entre para acompanhar simulações e vistos salvos.</p>
                    </div>

                    <div className="input-box">
                        <label>E-mail Acadêmico ou Pessoal</label>
                        <input type="email" placeholder="seuemail@exemplo.com" required />
                    </div>

                    <div className="input-box">
                        <div className="label-row">
                            <label>Senha</label>
                            <a href="#" className="esqueci-link">Esqueceu a senha?</a>
                        </div>
                        <input type="password" placeholder="••••••••" required />
                    </div>

                    <button type="submit" className="btn btn-primary">Entrar na Plataforma →</button>

                    <div className="divisor">
                        <span>ou entre com</span>
                    </div>

                    <div className="social-login">
                        <button type="button" className="btn-social">
                            <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google"/> Google
                        </button>
                        <button type="button" className="btn-social">
                            <img src="https://www.svgrepo.com/show/512317/github-142.svg" alt="GitHub"/> GitHub
                        </button>
                    </div>
                </form>
            </div>

        </>
    );

}

export default FormularioLogin;