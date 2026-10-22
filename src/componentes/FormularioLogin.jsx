import { useState } from 'react';
import { authRequest } from '../api.js';
import '../styles/FormularioLogin.css';

function FormularioLogin({ onLogin }) {
    const [error, setError] = useState('');
    const [busy, setBusy] = useState(false);
    async function submit(event) {
        event.preventDefault();
        const fields = new FormData(event.currentTarget);
        setError(''); setBusy(true);
        try {
            const { user } = await authRequest('login', Object.fromEntries(fields));
            onLogin(user);
        } catch (error) { setError(error.message); }
        finally { setBusy(false); }
    }
    return (
        <>
            <div className="form-box login">
                <form id="form-login" onSubmit={submit}>
                    <div className="form-title">
                        <h2>Acesse sua Conta</h2>
                        <p>Entre para acompanhar simulações e vistos salvos.</p>
                    </div>

                    <div className="input-box">
                        <label>E-mail Acadêmico ou Pessoal</label>
                        <input name="email" autoComplete="email" type="email" placeholder="seuemail@exemplo.com" required />
                    </div>

                    <div className="input-box">
                        <div className="label-row">
                            <label>Senha</label>

                        </div>
                        <input name="password" autoComplete="current-password" maxLength={128} type="password" placeholder="••••••••" required />
                    </div>

                    {error && <p role="alert" className="auth-error">{error}</p>}
                    <button type="submit" className="btn btn-primary" disabled={busy}>{busy ? 'Entrando…' : 'Entrar na Plataforma →'}</button>
                </form>
            </div>

        </>
    );

}

export default FormularioLogin;