# Автореал

Сайт автотехцентра и магазина автозапчастей «Автореал» (Волгодонск).

Стек: **Nuxt 4** (SSR) + **Nitro API** — формы заявок и отзывов, уведомления в Telegram, данные в JSON-файлах на диске.

Сейчас в проде: [http://170.168.112.201](http://170.168.112.201)  
(домен и HTTPS можно подключить позже)

---

## Содержание

- [Требования](#требования)
- [Быстрый старт (локально)](#быстрый-старт-локально)
- [Переменные окружения](#переменные-окружения)
- [Скрипты npm](#скрипты-npm)
- [Страницы сайта](#страницы-сайта)
- [Деплой на VPS](#деплой-на-vps)
- [Сервер: что где лежит](#сервер-что-где-лежит)
- [Telegram на VPS](#telegram-на-vps)
- [Важно](#важно)
- [Документация](#документация)

---

## Требования

- Node.js **22+** (локально и на сервере)
- npm
- Для деплоя с Windows: OpenSSH (`ssh`, `scp`) и ключ `~/.ssh/autoreal_deploy`

---

## Быстрый старт (локально)

```bash
npm install
cp .env.example .env
```

Заполни в `.env` Telegram-токен и chat id (можно оставить пустыми — формы всё равно работают).

```bash
npm run dev
```

Сайт: [http://127.0.0.1:3000](http://127.0.0.1:3000)

---

## Переменные окружения

Файл `.env` **не коммитится**. Образец — `.env.example`.

| Переменная | Назначение | По умолчанию |
|---|---|---|
| `NUXT_LOG_LEVEL` | Уровень логов: `silent` / `error` / `warn` / `info` / `debug` | `info` |
| `NUXT_LOG_RETENTION_DAYS` | Сколько дней хранить файлы логов | `14` |
| `NUXT_RATE_LIMIT_MAX` | Макс. заявок/отзывов с одного IP за окно | `5` |
| `NUXT_RATE_LIMIT_WINDOW_MINUTES` | Окно rate limit (минуты) | `15` |
| `NUXT_APP_TIMEZONE` | Часовой пояс (IANA) | `Europe/Moscow` |
| `NUXT_TELEGRAM_BOT_TOKEN` | Токен бота (@BotFather) | пусто |
| `NUXT_TELEGRAM_CHAT_ID` | Chat id (несколько через запятую) | пусто |

Если Telegram не задан — сайт работает, уведомления просто не уходят.

На сервере `.env` лежит в `/var/www/autoreal/.env`.

PM2 **не** читает `.env` через `env_file` (в разных версиях это ненадёжно). Файл `ecosystem.config.cjs` сам подгружает ключи из `.env` в `env` процесса. Поэтому после правки `.env` или самого `ecosystem.config.cjs` нужно не просто `restart`, а перезапуск из конфига:

```bash
cd /var/www/autoreal
pm2 delete autoreal
pm2 start ecosystem.config.cjs
pm2 save
```

Проверка, что токен попал в процесс:

```bash
pm2 env 0 | grep NUXT_TELEGRAM
```

---

## Скрипты npm

| Команда | Что делает |
|---|---|
| `npm run dev` | Локальная разработка |
| `npm run build` | Сборка продакшена в `.output/` |
| `npm run deploy` | Сборка + заливка на VPS + перезапуск PM2 (Windows) |
| `npm run check` | ESLint + Prettier (проверка) |
| `npm run fix` | ESLint + Prettier (автоисправление) |

Статический `nuxt generate` для этого проекта не подходит — нужны серверные API и запись на диск.

На сервере сайт поднимает **PM2** (`ecosystem.config.cjs` → `.output/server/index.mjs`), не `npm start`.

---

## Страницы сайта

| Путь | Описание |
|---|---|
| `/` | Главная |
| `/service` | Автотехцентр, каталог услуг |
| `/store` | Магазин |
| `/about` | О компании, отзывы, адреса, VK |
| `/privacy` | Политика персональных данных |

Редиректы: `/services` → `/service`, `/parts` → `/store`, `/contacts` → `/about`.

API:

- `POST /api/request` — заявка на звонок → JSON + Telegram  
- `POST /api/review` — отзыв с сайта → JSON + Telegram  

Данные пишутся в `data/` (в git не попадают):

- `data/requests.json` — заявки  
- `data/site-reviews.json` — отзывы  

Логи: папка `logs/`.

---

## Деплой на VPS

Сборка на слабом VPS (1 GB RAM) часто падает. Поэтому билд делается **на своём компьютере**, на сервер уезжает готовый `.output`.

### Обычное обновление сайта

1. Внеси правки локально  
2. При необходимости закоммить и запушь в GitHub  
3. В PowerShell из корня проекта:

```powershell
npm run deploy
```

Скрипт (`scripts/deploy.ps1`):

1. `npm run build`  
2. заливает `.output` по SSH на сервер  
3. ставит зависимости в `.output/server`  
4. делает `pm2 restart autoreal`  

Нужен ключ: `C:\Users\Sergey\.ssh\autoreal_deploy`  
(уже добавлен на сервер в `authorized_keys`).

Проверка входа по ключу:

```powershell
ssh -i $env:USERPROFILE\.ssh\autoreal_deploy root@170.168.112.201
```

Опциональные переменные для скрипта:

- `AUTOREAL_DEPLOY_HOST` (по умолчанию `170.168.112.201`)  
- `AUTOREAL_DEPLOY_USER` (по умолчанию `root`)  
- `AUTOREAL_DEPLOY_KEY` (путь к приватному ключу)  

### Ручной деплой (если скрипт недоступен)

```powershell
npm run build
scp -i $env:USERPROFILE\.ssh\autoreal_deploy -r .output root@170.168.112.201:/var/www/autoreal/
ssh -i $env:USERPROFILE\.ssh\autoreal_deploy root@170.168.112.201 "cd /var/www/autoreal/.output/server && npm install --omit=dev && cd /var/www/autoreal && pm2 restart autoreal"
```

---

## Сервер: что где лежит

| Путь | Назначение |
|---|---|
| `/var/www/autoreal` | Код проекта |
| `/var/www/autoreal/.output` | Прод-сборка |
| `/var/www/autoreal/.env` | Секреты и настройки |
| `/var/www/autoreal/ecosystem.config.cjs` | Конфиг PM2 |
| `/var/www/autoreal/data/` | Заявки и отзывы |
| `/var/www/autoreal/logs/` | Логи приложения |

Стек на VPS:

- **Node.js** — приложение  
- **PM2** — держит процесс и поднимает после reboot  
- **Nginx** — порт 80 → прокси на `127.0.0.1:3000` (без `:3000` в URL)  

Полезные команды на сервере:

```bash
pm2 status
pm2 logs autoreal
pm2 restart autoreal
systemctl status nginx
```

Сеть VPS (актуально после смены IP в панели RuVDS):

- IP: `170.168.112.201/24`  
- Шлюз: `170.168.112.1`  
- Netplan: `/etc/netplan/50-cloud-init.yaml`  

---

## Telegram на VPS

Заявки сохраняются в `data/requests.json` даже если Telegram недоступен. Если в логах есть `callback request accepted`, а в чат ничего не пришло — смотри уведомления и сеть.

### 1. Переменные в PM2

Симптом: заявка принята, в error-логе тихо или `telegram notifier skipped`.

Причина: в процессе PM2 нет `NUXT_TELEGRAM_BOT_TOKEN` / `NUXT_TELEGRAM_CHAT_ID`.

Что сделать: убедиться, что `.env` заполнен, перезапустить через `ecosystem.config.cjs` (команды выше), проверить `pm2 env 0 | grep NUXT_TELEGRAM`.

### 2. Сеть до api.telegram.org (RuVDS)

Симптом в логах:

```text
callback notification failed … The operation was aborted due to timeout
```

На части российских VPS DNS отдаёт IP Telegram, до которого **TCP 443 не проходит** (ping при этом может отвечать). Рабочий обход — зафиксировать доступный DC в `/etc/hosts` и предпочесть IPv4:

```bash
# Проверка: есть ли HTTPS до API
curl -4 -v --connect-timeout 5 --max-time 10 https://api.telegram.org/

# Если таймаут — прописать рабочий IP (актуальный на момент настройки: 149.154.167.220)
echo '149.154.167.220 api.telegram.org' >> /etc/hosts

# Предпочитать IPv4 (на всякий случай)
echo 'precedence :ffff:0:0/96  100' >> /etc/gai.conf

# Повторная проверка
getent hosts api.telegram.org
curl -4 -sS -o /dev/null -w "%{http_code}\n" --connect-timeout 5 https://api.telegram.org/
```

Тест заявки с сервера:

```bash
curl -sS -X POST http://127.0.0.1:3000/api/request \
  -H 'Content-Type: application/json' \
  -d '{"name":"Test","phone":"+79990001122","consent":true,"title":"Telegram check"}'
pm2 logs autoreal --lines 30 --nostream
```

Успех: HTTP 200 и **нет** новой строки `callback notification failed` в error-логе; сообщение появляется в Telegram.

Если IP в hosts снова перестанет отвечать — подбери другой DC тем же способом (`curl --resolve api.telegram.org:443:<IP> https://api.telegram.org/`) и обнови строку в `/etc/hosts`.

### 3. Токен светился в логах / чате

Перевыпусти токен у [@BotFather](https://t.me/BotFather) (`/revoke` или новый бот), обнови `NUXT_TELEGRAM_BOT_TOKEN` в `/var/www/autoreal/.env`, перезапусти PM2 из `ecosystem.config.cjs`.

---

## Важно

- `.env`, `data/*.json`, `logs/` — не коммитить  
- После смены Telegram-токена или `.env` на сервере — перезапуск через `ecosystem.config.cjs` (не полагаться только на `pm2 restart`, если менялся способ загрузки env)  
- Если в панели RuVDS сменился публичный IP — обнови netplan, DNS (когда будет домен) и `AUTOREAL_DEPLOY_HOST` / скрипт деплоя  
- Отзывы с формы сохраняются как `pending` и уходят в Telegram; на витрину сайта сами не попадают (там отдельные данные)  
- На RuVDS для Telegram может понадобиться запись `api.telegram.org` в `/etc/hosts` — см. [Telegram на VPS](#telegram-на-vps)  

---

## Документация

- [docs/design.md](docs/design.md) — дизайн-система  
- [docs/services-catalog.md](docs/services-catalog.md) — каталог услуг  
- [Nuxt: deployment](https://nuxt.com/docs/getting-started/deployment)  
