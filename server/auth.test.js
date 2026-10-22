import test from 'node:test'
import assert from 'node:assert/strict'
import { mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { once } from 'node:events'
import { DatabaseSync } from 'node:sqlite'
import { createApp } from './app.js'

test('cadastro, validação, senha, sessão persistente e logout', async () => {
  const dir = mkdtempSync(join(tmpdir(), 'malagon-test-'))
  const databasePath = join(dir, 'test.sqlite')
  let server
  let base
  const start = async () => {
    server = createApp({ databasePath })
    server.listen(0, '127.0.0.1')
    await once(server, 'listening')
    base = `http://127.0.0.1:${server.address().port}`
  }
  const close = () => new Promise(resolve => server.close(resolve))
  const request = (path, body, cookie, headers = {}) => fetch(base + '/api/auth/' + path, {
    method: body === undefined ? 'GET' : 'POST',
    headers: { 'Content-Type': 'application/json', ...(cookie ? { Cookie: cookie } : {}), ...headers },
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
  })
  try {
    await start()
    assert.equal((await request('me')).status, 401)
    const data = { name: 'Maria Teste', email: 'MARIA@example.com', profile: 'graduacao', password: 'uma-senha-segura' }
    assert.equal((await request('register', { ...data, password: '123' })).status, 400)
    assert.equal((await request('register', data, null, { Origin: 'https://other.example' })).status, 403)
    const registered = await request('register', data)
    assert.equal(registered.status, 201)
    const cookie = registered.headers.get('set-cookie').split(';')[0]
    assert.match(registered.headers.get('set-cookie'), /HttpOnly; SameSite=Lax/)
    const { user } = await registered.json()
    assert.equal(user.email, 'maria@example.com')
    assert.equal(user.password_hash, undefined)
    assert.equal((await request('register', data)).status, 409)
    assert.equal((await request('login', { ...data, password: 'errada' })).status, 401)
    assert.equal((await request('login', { ...data, email: 'outro@example.com' })).status, 401)
    assert.equal((await request('me', undefined, cookie)).status, 200)
    await close()
    await start()
    assert.equal((await request('me', undefined, cookie)).status, 200, 'session survives restart')
    assert.equal((await request('logout', {}, cookie)).status, 200)
    assert.equal((await request('me', undefined, cookie)).status, 401)
    const login = await request('login', data)
    assert.equal(login.status, 200)
    const loginCookie = login.headers.get('set-cookie').split(';')[0]
    const db = new DatabaseSync(databasePath)
    const stored = db.prepare('SELECT * FROM users').get()
    assert.notEqual(stored.password_hash, data.password)
    assert.equal(stored.password_hash.length, 128)
    assert.equal(db.prepare('SELECT token_hash FROM sessions').get().token_hash.includes(loginCookie.split('=')[1]), false)
    db.prepare('UPDATE sessions SET expires=0').run()
    db.close()
    assert.equal((await request('me', undefined, loginCookie)).status, 401)
    for (let i = 0; i < 21; i++) await request('login', { ...data, password: 'errada' })
    assert.equal((await request('login', data)).status, 429)
  } finally {
    if (server?.listening) await close()
    rmSync(dir, { recursive: true, force: true })
  }
})
