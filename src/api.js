export async function authRequest(action, data) {
  let response
  try {
    response = await fetch(`/api/auth/${action}`, {
      method: data === undefined ? 'GET' : 'POST',
      headers: data === undefined ? {} : { 'Content-Type': 'application/json' },
      credentials: 'same-origin',
      ...(data === undefined ? {} : { body: JSON.stringify(data) }),
    })
  } catch {
    throw new Error('Não foi possível conectar. Verifique sua conexão e tente novamente.')
  }
  let result
  try { result = await response.json() } catch { throw new Error('Servidor indisponível. Tente novamente.') }
  if (!response.ok) {
    const error = new Error(result.error || 'Não foi possível concluir.')
    error.status = response.status
    throw error
  }
  return result
}
