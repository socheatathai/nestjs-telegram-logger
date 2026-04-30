# nestjs-telegram-logger

NestJS API with PostgreSQL, Swagger, user CRUD, and opt-in Telegram request logging.

## Project Structure

```text
src/
  app.module.ts
  main.ts

  users/
    dto/
      create-user.dto.ts
      update-user.dto.ts
    user.entity.ts
    users.controller.ts
    users.module.ts
    users.service.ts

  telegram/
    decorators/
      telegram-log.decorator.ts
    dto/
      test-telegram-message.dto.ts
    interceptors/
      telegram-log.interceptor.ts
    types/
      telegram-api.types.ts
    telegram.controller.ts
    telegram.module.ts
    telegram.service.ts
```

Telegram-specific decorators, interceptors, and types stay inside `telegram/` because they are not shared app-wide utilities.

## Setup

Install dependencies:

```bash
pnpm install
```

Create `.env`:

```bash
cp .env.example .env
```

PowerShell:

```powershell
Copy-Item .env.example .env
```

Example `.env`:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=root
DB_NAME=db_bot
DB_SYNCHRONIZE=true
PORT=3000

TELEGRAM_BOT_TOKEN=your_bot_token_here
TELEGRAM_CHAT_ID=your_group_chat_id_here
```

Do not commit `.env`.

## Run

```bash
pnpm dev
```

or:

```bash
npm run dev
```

Swagger:

```text
http://localhost:3000/api
```

The server logs the Swagger URL on startup.

## Database

The app uses TypeORM with PostgreSQL. Tables are synchronized automatically when:

```env
DB_SYNCHRONIZE=true
```

Seed users:

```bash
pnpm seed
```

The seed script inserts Alice and Bob only when the `users` table is empty.

## User CRUD

Routes:

```text
POST   /users
GET    /users
GET    /users/:id
PATCH  /users/:id
DELETE /users/:id
```

Create body:

```json
{
  "mail": "user@example.com",
  "name": "John Doe",
  "age": 25,
  "isActive": true
}
```

Validation:

- `mail` must be an email.
- `name` must be a string.
- `age` must be an integer greater than or equal to `0`.
- `isActive` must be boolean.
- Unknown request body fields are rejected.

Errors:

- Missing user returns `404`.
- Duplicate `mail` returns `409`.

## Telegram Logging

Telegram request logging is opt-in. An endpoint sends logs only when it has `@TelegramLog()`.

Example:

```ts
import { TelegramLog } from '../telegram/decorators/telegram-log.decorator';

@Get()
@TelegramLog()
findAll() {
  return this.usersService.findAll();
}
```

Currently logged endpoints:

```text
GET /users
GET /users/:id
```

Telegram helper endpoints do not log themselves:

```text
GET  /telegram/chats
POST /telegram/test-message
```

## Create Bot And Send Logs To Group

### 1. Create The Bot

1. Open Telegram.
2. Message `@BotFather`.
3. Run:

```text
/newbot
```

4. Follow BotFather instructions.
5. Copy the token into `.env`:

```env
TELEGRAM_BOT_TOKEN=your_bot_token_here
```

If the token was shared publicly, regenerate it with BotFather.

### 2. Add Bot To Group

1. Create or open the group that should receive logs.
2. Add your bot to that group.
3. Send a message in the group:

```text
/start
```

or:

```text
test
```

Telegram must receive at least one group message before the group appears in updates.

### 3. Get Group Chat Id From API

Start the server:

```bash
pnpm dev
```

Open Swagger:

```text
http://localhost:3000/api
```

Call:

```text
GET /telegram/chats
```

Example response:

```json
[
  {
    "id": 0000000000,
    "first_name": "username",
    "username": "@username",
    "type": "private"
  },
  {
    "id": -0000000100,
    "title": "group receive logger",
    "type": "group",
    "all_members_are_administrators": false,
    "accepted_gift_types": {
      "unlimited_gifts": false,
      "limited_gifts": false,
      "unique_gifts": false,
      "premium_subscription": false,
      "gifts_from_channels": false
    }
  }
]
```

If you already requested updates or there are no new messages, the response can be an empty array:

```json
[]
```

Send a small message in the group (for example: "hi") and call the endpoint again.

Use the group id, not the private id:

```env
TELEGRAM_CHAT_ID=-5299367040
```

Group ids are usually negative. Supergroup ids often start with `-100`.

### 4. Restart And Test

After changing `.env`, restart the API:

```bash
pnpm dev
```

In Swagger, call:

```text
POST /telegram/test-message
```

Optional body:

```json
{
  "message": "Telegram logging is connected."
}
```

Expected response:

```json
{
  "sent": true
}
```

The message should appear in the group. Then call `GET /users` or `GET /users/:id` to test request logging.

### Group Not In `GET /telegram/chats`

Check:

- The bot is in the group.
- You sent `/start` or `test` in the group after adding the bot.
- The API is using the correct `TELEGRAM_BOT_TOKEN`.

## Checks

```bash
pnpm exec tsc --noEmit
pnpm test
pnpm exec prettier --check "src/**/*.ts" README.md
```
