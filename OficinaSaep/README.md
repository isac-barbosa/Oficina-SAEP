# Oficina Mecânica · Hot Garage Skull Crew

Sistema web para operação de uma oficina mecânica. O projeto reúne um frontend React para gestão da oficina e uma API REST em Node.js/Express, com persistência em MySQL e autenticação por token JWT.

## Funcionalidades

- Login e registro de usuários.
- Dashboard com visão geral de clientes, veículos e ordens de serviço.
- Cadastro, consulta, edição e remoção de clientes.
- Cadastro, consulta, edição e remoção de veículos vinculados a clientes.
- Gestão de ordens de serviço, com cliente, veículo, descrição, valor, data e status.
- Perfil da conta e encerramento da sessão.
- Rotas privadas e envio automático do token Bearer nas chamadas à API.

## Tecnologias

| Camada | Tecnologias |
| --- | --- |
| Frontend | React, Vite, React Router, Tailwind CSS, Axios |
| Backend | Node.js, Express, MySQL2 |
| Autenticação | JWT e bcrypt |
| Banco de dados | MySQL |

## Estrutura do projeto

```text
Oficina_mecanica_simulado/
├── backend/
│   ├── config/             # Conexão, schema e seed do banco
│   ├── controller/         # Regras dos endpoints
│   ├── middlewares/        # Autenticação
│   ├── routes/             # Rotas da API
│   └── src/                # Inicialização do servidor e da aplicação
└── frontend/
    └── oficina_frontend/
        └── src/
            ├── components/ # Componentes visuais
            ├── lib/        # Estado da oficina e utilitários
            ├── pages/      # Telas do sistema
            ├── routes/     # Rotas do frontend
            └── services/   # Comunicação com a API
```

## Requisitos

- Node.js 20.19+ ou 22.12+ e npm.
- MySQL 8 ou compatível.
- Git, caso vá clonar o repositório.

## Configuração e execução

Execute os passos a seguir em dois terminais, a partir da pasta raiz do repositório.

### 1. Preparar o banco de dados

Crie as tabelas usando o schema do projeto:

```powershell
Get-Content -Raw backend/config/schema.sql | mysql -u root -p
```

O schema cria e seleciona o banco `saep_db`. Também é possível abrir `backend/config/schema.sql` no MySQL Workbench e executar o arquivo.

### 2. Configurar e iniciar a API

Crie o arquivo local de ambiente a partir do modelo:

```powershell
Copy-Item backend/.env.example backend/.env
```

Edite `backend/.env` e informe as credenciais do seu MySQL. Defina também um `JWT_SECRET` próprio, aleatório e forte; não use o valor de exemplo em produção. As variáveis disponíveis são:

| Variável | Descrição | Padrão do exemplo |
| --- | --- | --- |
| `PORT` | Porta HTTP da API | `3000` |
| `DB_HOST` | Servidor MySQL | `localhost` |
| `DB_USER` | Usuário MySQL | `root` |
| `DB_PASSWORD` | Senha MySQL | `senai` |
| `DB_NAME` | Banco de dados | `saep_db` |
| `JWT_SECRET` | Chave de assinatura dos tokens | Troque por uma chave privada |

Instale as dependências, carregue os dados iniciais e inicie o servidor:

```powershell
Set-Location backend
npm ci
npm run seed
npm run dev
```

A API ficará disponível em `http://localhost:3000`. Para iniciar sem modo de desenvolvimento, use `npm start`.

O seed cria o usuário inicial `admin@oficina.com` com a senha `12345678`. Altere essa senha assim que possível e evite usar essas credenciais fora de um ambiente local.

### 3. Iniciar o frontend

Em outro terminal, na raiz do repositório:

```powershell
Set-Location frontend/oficina_frontend
npm ci
npm run dev
```

Abra o endereço informado pelo Vite, normalmente `http://localhost:5173`. Em desenvolvimento, o Vite encaminha chamadas `/api` para `http://localhost:3000`.

Para apontar o proxy de desenvolvimento a outro servidor, defina `VITE_API_PROXY_TARGET`. Para builds servidos em produção, defina `VITE_API_URL` com a URL base da API, incluindo `/api`, por exemplo `https://api.exemplo.com/api`.

## Rotas do frontend

| Caminho | Tela | Acesso |
| --- | --- | --- |
| `/` | Login | Público |
| `/dashboard` | Painel da oficina | Autenticado |
| `/clientes` | Clientes | Autenticado |
| `/veiculos` | Veículos | Autenticado |
| `/ordens-servico` | Ordens de serviço | Autenticado |
| `/profile` | Perfil | Autenticado |

## API REST

Todas as rotas de dados exigem o cabeçalho `Authorization: Bearer <token>`.

| Método | Endpoint | Descrição |
| --- | --- | --- |
| `POST` | `/api/auth/login` | Autentica e retorna token e usuário |
| `POST` | `/api/auth/register` | Registra usuário |
| `GET` | `/api/clientes` | Lista clientes |
| `POST` | `/api/clientes` | Cria cliente |
| `GET`, `PUT`, `DELETE` | `/api/clientes/:id` | Consulta, atualiza ou remove cliente |
| `GET` | `/api/veiculos` | Lista veículos |
| `POST` | `/api/veiculos` | Cria veículo |
| `GET`, `PUT`, `DELETE` | `/api/veiculos/:id` | Consulta, atualiza ou remove veículo |
| `GET` | `/api/ordens-servico` | Lista ordens de serviço |
| `POST` | `/api/ordens-servico` | Cria ordem de serviço |
| `GET`, `PUT`, `DELETE` | `/api/ordens-servico/:id` | Consulta, atualiza ou remove ordem |

Exemplo de login:

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@oficina.com",
  "password": "12345678"
}
```

## Comandos úteis

Frontend, executados em `frontend/oficina_frontend`:

```powershell
npm run dev      # Servidor local
npm run build    # Build de produção
npm run preview  # Visualiza o build localmente
npm run lint     # ESLint
```

Backend, executados em `backend`:

```powershell
npm run dev      # API com reinicialização automática via Node
npm start        # API em modo normal
npm run seed     # Insere os dados de demonstração no banco
```

## Observações

- O arquivo `backend/.env` contém credenciais e não deve ser enviado ao repositório.
- Execute o seed uma vez em um banco vazio; os registros usam identificadores fixos para relacionar clientes, veículos e ordens.
- O token JWT expira após uma hora. Faça login novamente quando a sessão expirar.
- Em produção, configure HTTPS, restrinja CORS ao domínio do frontend e use segredos e senhas fortes.
