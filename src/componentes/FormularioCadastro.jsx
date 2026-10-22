import { useState } from 'react';
import { authRequest } from '../api.js';
import '../styles/FormularioCadastro.css';

function FormularioCadastro({ onLogin }) {
    const [error, setError] = useState('');
    const [busy, setBusy] = useState(false);
    async function submit(event) {
        event.preventDefault();
        const fields = new FormData(event.currentTarget);
        setError(''); setBusy(true);
        try {
            const { user } = await authRequest('register', Object.fromEntries(fields));
            onLogin(user);
        } catch (error) { setError(error.message); }
        finally { setBusy(false); }
    }
    return (
        <>
        <div className="form-box cadastro">
      <form id="form-cadastro" onSubmit={submit}>
        <div className="form-title">
          <h2>Criar Conta Global</h2>
          <p>Comece a planejar seu intercâmbio gratuitamente.</p>
        </div>

        <div className="input-box">
          <label>Nome Completo</label>
          <input name="name" autoComplete="name" minLength={2} maxLength={100} type="text" placeholder="Seu nome" required />
        </div>

        <div className="input-box">
          <label>E-mail</label>
          <input name="email" autoComplete="email" maxLength={254} type="email" placeholder="seuemail@exemplo.com" required />
        </div>

        <div className="input-box">
          <label>Perfil Acadêmico</label>
          <select name="profile" required className="select-perfil" defaultValue="">
            <option value="" disabled>Selecione seu objetivo...</option>
            <option value="graduacao">Graduação no Exterior</option>
            <option value="pos">Pós / Mestrado / Doutorado</option>
            <option value="idioma">Curso de Idiomas</option>
            <option value="pesquisa">Pesquisa / Estágio Tech</option>
          </select>
        </div>

        <div className="input-box">
          <label>Senha</label>
          <input name="password" autoComplete="new-password" minLength={8} maxLength={128} type="password" placeholder="Crie uma senha forte" required />
        </div>

        {error && <p role="alert" className="auth-error">{error}</p>}
        <small>Use uma senha com pelo menos 8 caracteres.</small>
        <button type="submit" className="btn btn-primary" disabled={busy}>{busy ? 'Criando conta…' : 'Criar Minha Conta →'}</button>
      </form>
    </div>

        </>
    );

}

export default FormularioCadastro;