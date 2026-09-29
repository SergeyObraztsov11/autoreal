# Autoreal

Nuxt 4 site for Автореал (Volgodonsk): SSR + Nitro API for callback requests and site reviews.

## Setup

```bash
npm install
```

Copy env template and fill values (Telegram is optional — forms work without it):

```bash
cp .env.example .env
```

## Development

```bash
npm run dev
```

App: `http://127.0.0.1:3000`

## Production

Do **not** use `nuxt generate` for this project — forms and Telegram need a running Node server.

```bash
npm run build
npm run start
```

`npm start` runs `node .output/server/index.mjs` (default port `3000`, or set `PORT` / `HOST`).

### Required on the server

| Need | Why |
|------|-----|
| Writable `data/` | `requests.json`, `site-reviews.json` (created at runtime; gitignored) |
| Writable `logs/` | App logs + retention plugin |
| Env from `.env.example` | Logging, rate limit, timezone, Telegram |

Important env keys:

- `NUXT_TELEGRAM_BOT_TOKEN` / `NUXT_TELEGRAM_CHAT_ID` — notify on new callbacks and reviews
- `NUXT_LOG_LEVEL`, `NUXT_LOG_RETENTION_DAYS`
- `NUXT_RATE_LIMIT_MAX`, `NUXT_RATE_LIMIT_WINDOW_MINUTES`
- `NUXT_APP_TIMEZONE` (default `Europe/Moscow`)

Never commit `.env`.

## Lint / format

```bash
npm run check
npm run fix
```

## Docs

- [Nuxt deployment](https://nuxt.com/docs/getting-started/deployment)
- [docs/design.md](docs/design.md) — UI system
