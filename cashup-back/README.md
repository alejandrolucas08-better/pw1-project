# CashUp Back

O CashUp e uma aplicacao para adicionar e acompanhar seus ativos em uma carteira pessoal. Este repositorio contem o backend do projeto, responsavel por autenticar usuarios, salvar os ativos no banco de dados e consultar cotacoes de mercado para montar o resumo da carteira.

## Tecnologias

- Node.js
- TypeScript
- Express
- PostgreSQL
- JWT
- Bcrypt
- Axios

## Como Rodar

1. Instale as dependencias:

```bash
npm install
```

2. Crie o arquivo `.env` com base no `.env.example`:

```env
PORT=3000
DATABASE_URL=sua_connection_string_do_postgresql
JWT_SECRET=sua_chave_secreta
BRAPI_TOKEN=seu_token_da_brapi
```

3. Garanta que o banco PostgreSQL tenha as tabelas usadas pelo backend:

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE user_assets (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  ticker VARCHAR(20) NOT NULL,
  quantity NUMERIC NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (user_id, ticker)
);
```

4. Rode o servidor em desenvolvimento:

```bash
npm run dev
```

Por padrao, a API fica disponivel em:

```text
http://localhost:3000
```

Para gerar a versao de producao:

```bash
npm run build
npm start
```

## Autenticacao

As rotas protegidas exigem o token JWT recebido no login:

```http
Authorization: Bearer seu_token
```

## Rotas

### Saude da API

| Rota | Metodo | Descricao | Retorna |
| --- | --- | --- | --- |
| `/api/health` | GET | Verifica se o backend esta rodando. | Status da API e mensagem de confirmacao. |

Exemplo de retorno:

```json
{
  "status": "up",
  "message": "Backend rodando perfeitamente com TS!"
}
```

### Autenticacao

| Rota | Metodo | Descricao | Retorna |
| --- | --- | --- | --- |
| `/api/auth/register` | POST | Cadastra um novo usuario. | Mensagem de sucesso e dados publicos do usuario criado. |
| `/api/auth/login` | POST | Autentica um usuario cadastrado. | Mensagem de sucesso, token JWT e dados publicos do usuario. |
| `/api/auth/me` | GET | Busca os dados do usuario autenticado. Rota protegida. | Objeto `user` com `id`, `name` e `email`. |

#### POST `/api/auth/register`

Corpo da requisicao:

```json
{
  "name": "Maria Silva",
  "email": "maria@email.com",
  "password": "123456"
}
```

Retorno:

```json
{
  "message": "Usuario cadastrado com sucesso!",
  "user": {
    "id": 1,
    "name": "Maria Silva",
    "email": "maria@email.com",
    "created_at": "2026-06-22T12:00:00.000Z"
  }
}
```

#### POST `/api/auth/login`

Corpo da requisicao:

```json
{
  "email": "maria@email.com",
  "password": "123456"
}
```

Retorno:

```json
{
  "message": "Login realizado com sucesso!",
  "token": "token_jwt",
  "user": {
    "id": 1,
    "name": "Maria Silva",
    "email": "maria@email.com"
  }
}
```

#### GET `/api/auth/me`

Headers:

```http
Authorization: Bearer token_jwt
```

Retorno:

```json
{
  "user": {
    "id": 1,
    "name": "Maria Silva",
    "email": "maria@email.com"
  }
}
```

### Ativos e Carteira

Todas as rotas abaixo sao protegidas e exigem o header `Authorization: Bearer token_jwt`.

| Rota | Metodo | Descricao | Retorna |
| --- | --- | --- | --- |
| `/api/assets` | POST | Adiciona um ativo na carteira do usuario. Se o ativo ja existir, soma a nova quantidade com a quantidade atual. | Mensagem de sucesso e ativo salvo. |
| `/api/portfolio` | GET | Lista a carteira do usuario com cotacoes e indicadores de mercado. | Valor total da carteira e lista de ativos calculados. |
| `/api/assets/:ticker` | PUT | Atualiza a quantidade de um ativo especifico da carteira. | Mensagem de sucesso e ativo atualizado. |
| `/api/assets/:ticker` | DELETE | Remove um ativo especifico da carteira. | Mensagem de sucesso e ativo removido. |

#### POST `/api/assets`

Corpo da requisicao:

```json
{
  "ticker": "PETR4",
  "quantity": 10
}
```

Retorno:

```json
{
  "message": "Ativo adicionado com sucesso!",
  "asset": {
    "id": 1,
    "user_id": 1,
    "ticker": "PETR4",
    "quantity": "10",
    "created_at": "2026-06-22T12:00:00.000Z"
  }
}
```

#### GET `/api/portfolio`

Retorno:

```json
{
  "total_wallet_value": 350.5,
  "assets": [
    {
      "ticker": "PETR4",
      "name": "Petroleo Brasileiro S.A. - Petrobras",
      "current_price": 35.05,
      "updated_at": "2026-06-22T12:00:00.000Z",
      "change": 0.25,
      "change_percent": 0.72,
      "day_high": 35.5,
      "day_low": 34.8,
      "volume": 12345678,
      "quantity": "10",
      "total_value": 350.5,
      "logo_url": "https://..."
    }
  ]
}
```

O retorno pode incluir campos especificos conforme o tipo do ativo:

- Acoes: `price_earnings`, `earnings_per_share`
- FIIs: `dividend_yield_12m`, `p_vp`, `net_worth`, `vacancy_rate`
- Criptomoedas: `market_cap`, `circulating_supply`, `max_supply`

Se a carteira estiver vazia, o retorno sera:

```json
{
  "total_wallet_value": 0,
  "assets": []
}
```

#### PUT `/api/assets/:ticker`

Exemplo de rota:

```http
PUT /api/assets/PETR4
```

Corpo da requisicao:

```json
{
  "quantity": 15
}
```

Retorno:

```json
{
  "message": "Ativo atualizado com sucesso!",
  "asset": {
    "id": 1,
    "user_id": 1,
    "ticker": "PETR4",
    "quantity": "15",
    "created_at": "2026-06-22T12:00:00.000Z"
  }
}
```

#### DELETE `/api/assets/:ticker`

Exemplo de rota:

```http
DELETE /api/assets/PETR4
```

Retorno:

```json
{
  "message": "Ativo PETR4 removido da carteira com sucesso!",
  "deleted_asset": {
    "id": 1,
    "user_id": 1,
    "ticker": "PETR4",
    "quantity": "15",
    "created_at": "2026-06-22T12:00:00.000Z"
  }
}
```

## Observacoes

- O backend aceita requisicoes CORS do frontend em `http://localhost:5173`.
- A rota `/api/portfolio` usa dados externos da BRAPI para acoes e FIIs.
- Criptomoedas sao consultadas pela API publica da CoinGecko.
- O token de login expira em 1 dia.
