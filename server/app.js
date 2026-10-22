import { createServer } from 'node:http'
import { DatabaseSync } from 'node:sqlite'
import { randomBytes, scrypt as derive, createHash, timingSafeEqual } from 'node:crypto'
import { promisify } from 'node:util'
import { mkdirSync, readFileSync, existsSync } from 'node:fs'
import { dirname, resolve, extname } from 'node:path'
import { fileURLToPath } from 'node:url'

const scrypt = promisify(derive)
const root = fileURLToPath(new URL('../', import.meta.url))
const hash = value => createHash('sha256').update(value).digest('hex')
const profiles = ['graduacao', 'pos', 'idioma', 'pesquisa']
const publicUser = row => ({ id: row.id, name: row.name, email: row.email, profile: row.profile })

export function createApp({ databasePath = resolve(root, 'data/malagon.sqlite'), secureCookies = false } = {}) {
  mkdirSync(dirname(databasePath), { recursive: true })
  const db = new DatabaseSync(databasePath)
  db.exec(`PRAGMA journal_mode=WAL; PRAGMA foreign_keys=ON;
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY, name TEXT NOT NULL, email TEXT NOT NULL UNIQUE,
      profile TEXT NOT NULL, salt TEXT NOT NULL, password_hash TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS sessions (
      token_hash TEXT PRIMARY KEY, user_id INTEGER NOT NULL REFERENCES users(id), expires INTEGER NOT NULL
    );`)
  const attempts = new Map()
  const dummySalt = randomBytes(16).toString('hex')
  const cookie = (token, age) => `malagon_session=${token}; HttpOnly; SameSite=Lax; Path=/; Max-Age=${age}${secureCookies ? '; Secure' : ''}`
  const server = createServer(async (req, res) => {
    const send = (status, data) => { res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' }); res.end(JSON.stringify(data)) }
    res.setHeader('X-Content-Type-Options', 'nosniff')
    try {
      const path = new URL(req.url, 'http://localhost').pathname
      if (!path.startsWith('/api/')) {
        if (req.method !== 'GET' && req.method !== 'HEAD') return send(405, { error: 'Método não permitido.' })
        const dist = resolve(root, 'dist')
        let file = resolve(dist, '.' + decodeURIComponent(path))
        if (!file.startsWith(dist + '/')) file = resolve(dist, 'index.html')
        if (!existsSync(file) || !extname(file)) file = resolve(dist, 'index.html')
        if (!existsSync(file)) return send(404, { error: 'Execute npm run build para gerar o frontend.' })
        const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.jpg': 'image/jpeg' }
        res.writeHead(200, { 'Content-Type': types[extname(file)] || 'application/octet-stream' })
        return res.end(req.method === 'HEAD' ? undefined : readFileSync(file))
      }
      if (req.method === 'GET' && path === '/api/health') return send(200, { status: 'ok' })
      const token = req.headers.cookie?.split(';').map(v => v.trim()).find(v => v.startsWith('malagon_session='))?.slice('malagon_session='.length)
      if (req.method === 'GET' && path === '/api/auth/me') {
        const user = token && db.prepare('SELECT users.* FROM users JOIN sessions ON users.id=sessions.user_id WHERE token_hash=? AND expires>?').get(hash(token), Date.now())
        return user ? send(200, { user: publicUser(user) }) : send(401, { error: 'Entre na sua conta.' })
      }
      if (req.method !== 'POST' || !['/api/auth/register', '/api/auth/login', '/api/auth/logout'].includes(path)) return send(404, { error: 'Rota não encontrada.' })
      // Browser requests must originate from the same host; do not trust forwarded headers.
      if (req.headers['sec-fetch-site'] === 'cross-site' || (req.headers.origin && new URL(req.headers.origin).host !== req.headers.host)) return send(403, { error: 'Origem não permitida.' })
      if (path === '/api/auth/logout') {
        if (token) db.prepare('DELETE FROM sessions WHERE token_hash=?').run(hash(token))
        res.setHeader('Set-Cookie', cookie('', 0))
        return send(200, { ok: true })
      }
      if (!req.headers['content-type']?.startsWith('application/json')) return send(415, { error: 'Envie os dados como JSON.' })
      const key = req.socket.remoteAddress
      const now = Date.now()
      for (const [ip, entry] of attempts) if (entry.until <= now) attempts.delete(ip)
      const entry = attempts.get(key) || { count: 0, until: now + 60_000 }
      attempts.set(key, entry)
      if (++entry.count > 20) { res.setHeader('Retry-After', '60'); return send(429, { error: 'Muitas tentativas. Aguarde um minuto.' }) }
      let body = ''
      for await (const chunk of req) {
        body += chunk
        if (Buffer.byteLength(body) > 8192) return send(413, { error: 'Dados muito grandes.' })
      }
      let data
      try { data = JSON.parse(body) } catch { return send(400, { error: 'Dados inválidos.' }) }
      const email = typeof data?.email === 'string' ? data.email.trim().toLowerCase() : ''
      const password = data?.password
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254 || typeof password !== 'string' || password.length > 128 || !password.length) return send(400, { error: 'Informe um e-mail válido e uma senha de até 128 caracteres.' })
      let user
      if (path === '/api/auth/register') {
        const name = typeof data.name === 'string' ? data.name.trim() : ''
        if (name.length < 2 || name.length > 100 || !profiles.includes(data.profile) || password.length < 8) return send(400, { error: 'Informe seu nome, perfil e uma senha com pelo menos 8 caracteres.' })
        const salt = randomBytes(16).toString('hex')
        const passwordHash = (await scrypt(password, salt, 64)).toString('hex')
        try {
          const result = db.prepare('INSERT INTO users(name,email,profile,salt,password_hash) VALUES(?,?,?,?,?)').run(name, email, data.profile, salt, passwordHash)
          user = db.prepare('SELECT * FROM users WHERE id=?').get(result.lastInsertRowid)
        } catch (error) {
          if (error.code === 'ERR_SQLITE_ERROR' && error.message.includes('UNIQUE')) return send(409, { error: 'Não foi possível cadastrar esse e-mail. Tente entrar na sua conta.' })
          throw error
        }
      } else {
        user = db.prepare('SELECT * FROM users WHERE email=?').get(email)
        const candidate = await scrypt(password, user?.salt || dummySalt, 64)
        if (!user || !timingSafeEqual(candidate, Buffer.from(user.password_hash, 'hex'))) return send(401, { error: 'E-mail ou senha incorretos.' })
      }
      db.prepare('DELETE FROM sessions WHERE expires<=?').run(now)
      if (token) db.prepare('DELETE FROM sessions WHERE token_hash=?').run(hash(token))
      const session = randomBytes(32).toString('hex')
      db.prepare('INSERT INTO sessions(token_hash,user_id,expires) VALUES(?,?,?)').run(hash(session), user.id, now + 7 * 86400_000)
      res.setHeader('Set-Cookie', cookie(session, 7 * 86400))
      send(path.endsWith('register') ? 201 : 200, { user: publicUser(user) })
    } catch (error) {
      console.error('Falha na requisição:', error.code || error.name)
      if (!res.headersSent) send(500, { error: 'Não foi possível concluir. Tente novamente.' })
      else res.end()
    }
  })
  server.on('close', () => db.close())
  return server
}
