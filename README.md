# Malagon — React + backend de autenticação

Requer Node.js 24 ou mais recente (validado com 24.19.0) e npm.

## Rodar em desenvolvimento

```sh
npm ci
npm run dev
```

O comando inicia o frontend Vite na porta 5173 e a API na porta 3001. O Vite encaminha `/api` para o backend, mantendo os cookies na mesma origem. Ambos reiniciam ao editar seus arquivos. Use Ctrl+C para encerrar os dois processos.

```sh
npm test       # integração da API, com banco temporário isolado
npm run lint
npm run build
```

## Como cadastro e login funcionam

1. O formulário de cadastro envia nome, e-mail, perfil acadêmico e senha para `POST /api/auth/register`. O servidor valida os campos e impede e-mails duplicados, normalizando maiúsculas e espaços do e-mail.
2. O SQLite salva os usuários em `data/malagon.sqlite`. A senha nunca é salva em texto: o servidor usa `scrypt` com um salt aleatório para produzir um hash. No login, compara o hash da senha enviada com o hash armazenado.
3. Cadastro ou login válido cria uma sessão de sete dias. O navegador recebe um cookie HttpOnly, que o JavaScript da página não consegue ler. Apenas o hash do identificador da sessão é salvo no banco.
4. Ao atualizar a página, `GET /api/auth/me` verifica a sessão e recupera o usuário. `POST /api/auth/logout` remove a sessão no servidor e apaga o cookie.

O backend usa consultas SQL parametrizadas, verificação de origem nas operações de escrita e limite de 20 tentativas de autenticação por minuto por endereço IP. A limitação de tentativas fica em memória e reinicia com o processo. O login tem resposta genérica para usuário inexistente ou senha errada.

O banco é criado automaticamente e permanece após reiniciar os servidores. A pasta `data/` é ignorada pelo Git: não publique nem versione dados pessoais ou bancos de usuários. Para zerar dados de desenvolvimento, pare os servidores e remova essa pasta conscientemente. Faça backups antes de apagar qualquer banco real.

## Arquivos principais

- `server/app.js`: API, banco de dados, proteção de senhas e sessões.
- `server/index.js`: inicialização do backend.
- `src/api.js`: comunicação do frontend com a API.
- `src/componentes/FormularioCadastro.jsx` e `FormularioLogin.jsx`: envio dos formulários e mensagens de erro.
- `src/App.jsx`: recuperação da sessão, identificação do usuário e saída.

## Executar o build

```sh
npm run build
npm start
```

O backend também serve os arquivos de `dist/`, permitindo executar frontend e API juntos na porta 3001. Configurações opcionais:

- `PORT`: porta do backend (padrão `3001`). No desenvolvimento, mantenha 3001 para o proxy do Vite.
- `HOST`: interface do backend (padrão `127.0.0.1`). Use `0.0.0.0` quando a hospedagem precisar receber conexões externas.
- `DATABASE_PATH`: caminho do SQLite; padrão `data/malagon.sqlite` no projeto.
- `NODE_ENV=production`: habilita o atributo Secure no cookie. Nesse modo, a aplicação deve ser acessada por HTTPS.

Para publicar para usuários reais, configure HTTPS e armazenamento persistente com backups para o SQLite. Execute uma única instância do backend nesta versão; escalabilidade e limitação distribuída de tentativas precisam de uma solução compartilhada. Nenhuma publicação foi feita automaticamente.

Cadastro e login por e-mail/senha estão implementados. Login Google/GitHub, recuperação de senha e confirmação de e-mail não estão implementados; os controles antigos que simulavam essas funções foram removidos. A página inicial mantém seu conteúdo demonstrativo; simulações, vistos e recomendações ainda não têm backend.
