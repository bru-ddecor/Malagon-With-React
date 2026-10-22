import { useEffect, useState } from 'react'
import PaginaInicial from './pages/PaginaInicial.jsx'
import Login from './pages/Login.jsx'
import { authRequest } from './api.js'
import './App.css'

function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [loggingOut, setLoggingOut] = useState(false)

  async function restore() {
    setLoading(true)
    setError('')
    try { setUser((await authRequest('me')).user) }
    catch (error) { if (error.status !== 401) setError(error.message) }
    finally { setLoading(false) }
  }
  useEffect(() => {
    let active = true
    authRequest('me')
      .then(({ user }) => { if (active) setUser(user) })
      .catch(error => { if (active && error.status !== 401) setError(error.message) })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [])

  async function logout() {
    setLoggingOut(true)
    setError('')
    try { await authRequest('logout', {}); setUser(null) }
    catch (error) { setError(error.message) }
    finally { setLoggingOut(false) }
  }

  if (loading) return <p role="status">Carregando sua conta…</p>
  if (!user && error) return <div role="alert"><p>{error}</p><button onClick={restore}>Tentar novamente</button></div>
  return (
    <div className="App">
      {user ? <>
        <header className="account-bar">
          <span>Olá, {user.name}</span>
          <button className="btn btn-outline" onClick={logout} disabled={loggingOut}>{loggingOut ? 'Saindo…' : 'Sair'}</button>
          {error && <p role="alert">{error}</p>}
        </header>
        <PaginaInicial />
      </> : <Login onLogin={setUser} />}
    </div>
  )
}
export default App
