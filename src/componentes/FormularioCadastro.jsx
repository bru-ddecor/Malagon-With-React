import '../styles/FormularioCadastro.css';

function FormularioCadastro() {
    return (
        <>
        <div className="form-box cadastro">
      <form id="form-cadastro" action="#">
        <div className="form-title">
          <h2>Criar Conta Global</h2>
          <p>Comece a planejar seu intercâmbio gratuitamente.</p>
        </div>

        <div className="input-box">
          <label>Nome Completo</label>
          <input type="text" placeholder="Seu nome" required />
        </div>

        <div className="input-box">
          <label>E-mail</label>
          <input type="email" placeholder="seuemail@exemplo.com" required />
        </div>

        <div className="input-box">
          <label>Perfil Acadêmico</label>
          <select required className="select-perfil" defaultValue="">
            <option value="" disabled>Selecione seu objetivo...</option>
            <option value="graduacao">Graduação no Exterior</option>
            <option value="pos">Pós / Mestrado / Doutorado</option>
            <option value="idioma">Curso de Idiomas</option>
            <option value="pesquisa">Pesquisa / Estágio Tech</option>
          </select>
        </div>

        <div className="input-box">
          <label>Senha</label>
          <input type="password" placeholder="Crie uma senha forte" required />
        </div>

        <button type="submit" className="btn btn-primary">Criar Minha Conta →</button>
      </form>
    </div>

        </>
    );

}

export default FormularioCadastro;