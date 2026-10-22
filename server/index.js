import { createApp } from './app.js'
const port = Number(process.env.PORT || 3001)
const server = createApp({ databasePath: process.env.DATABASE_PATH, secureCookies: process.env.NODE_ENV === 'production' })
server.listen(port, process.env.HOST || '127.0.0.1', () => console.log(`Backend iniciado na porta ${port}`))
for (const signal of ['SIGINT', 'SIGTERM']) process.on(signal, () => server.close())
