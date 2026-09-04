import { useState } from 'react'
import CabecalhoMacOSCard from '../componentes/CabecalhoMacOSCard.jsx'
import FormularioLogin from '../componentes/FormularioLogin.jsx'
import FormularioCadastro from '../componentes/FormularioCadastro.jsx'
import PainelDeslizanteTransicao from '../componentes/PainelDeslizanteTransicao.jsx'

function Login({ onLogin }) {
  const [isCadastro, setIsCadastro] = useState(false)

  return (
    <div className={`container${isCadastro ? ' active' : ''}`}>
      <CabecalhoMacOSCard />
      <FormularioLogin onLogin={onLogin} />
      <FormularioCadastro />
      <PainelDeslizanteTransicao
        onShowCadastro={() => setIsCadastro(true)}
        onShowLogin={() => setIsCadastro(false)}
      />
    </div>
  )
}

export default Login
