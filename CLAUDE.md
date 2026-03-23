# Zesty Finance API

## Overview
Express.js REST API for the Zesty Finance application. Provides account management and session handling.

## Runtime & Package Manager
- **Runtime:** Node.js 24.13.1 (see `.nvmrc`)
- **Package Manager:** npm
- **Language:** TypeScript (ES Modules)

## Key Commands
```bash
npm run start:dev       # Dev server with hot reload (tsc-watch + dotenvx)
npm run build           # Compile TypeScript to dist/
npm run test            # Run Mocha tests
npm run lint            # ESLint
npm run lint:fix        # ESLint with auto-fix
npm run db:migrate:up   # Run next pending migration
npm run db:migrate:down # Roll back last migration
npm run db:migrate:create # Create new migration file
# Run all pending migrations at once:
./node_modules/.bin/dotenvx run -f .env.local -- node ./dist/src/db/migrator.js latest
```

## Architecture
Layered architecture — requests flow: `controllers → services → repositories → db`

```
src/
├── app/
│   ├── controllers/    # Route handlers
│   ├── repositories/   # Data access (Kysely queries)
│   ├── schemas/        # Joi validation schemas (placeholder)
│   ├── services/       # Business logic
│   ├── lib/            # Logger, authorization utilities, AsyncLocalStorage context
│   └── utils/          # Shared utilities (sanitize, etc.)
├── config/
│   ├── env.ts          # Typed environment variable exports
│   ├── auth.ts         # better-auth configuration (email, OAuth, hooks, email callbacks)
│   ├── authHooks.ts    # better-auth databaseHooks (sanitization + logging)
│   ├── mailer.ts       # Nodemailer transporter
│   └── accessControls.ts # RBAC configuration
├── db/
│   ├── migrations/     # SQL migration files (timestamp-ordered)
│   ├── migrator.ts     # Migration runner (up/down/latest)
│   └── zesty-finance-db.ts # Kysely instance
├── express/
│   ├── middleware/     # CORS, account, authorize, requestContext, etc.
│   └── index.ts        # Express app setup
└── tests/
    └── utils/          # Test utilities
```

## Key Technologies
- **Framework:** Express.js
- **Database:** PostgreSQL via Kysely (type-safe query builder)
- **Auth:** better-auth (email/password, Google OAuth, Apple OAuth)
- **Email:** Nodemailer (password reset, email verification)
- **Validation:** Joi
- **Logging:** Winston
- **Environment:** dotenvx (`.env.local` for dev, `.env.production` for prod)
- **Testing:** Mocha + Chai

## Authentication

Authentication is handled entirely by **better-auth** (`src/config/auth.ts`).

- Auth endpoints are mounted at `/auth/*` via `toNodeHandler(auth)` — before `express.json()` so better-auth handles its own body parsing
- Supported methods: email/password, Google OAuth, Apple OAuth
- better-auth manages four tables: `accounts`, `sessions`, `account_providers`, `account_verifications`
- Custom table names are set via `modelName` in `src/config/auth.ts`
- Custom column names are set via `fields` (e.g. `userId → account_id`)

### Request flow
```
POST /auth/*       → toNodeHandler(auth)      ← intercepted before middleware chain
GET/POST /account  → accountMiddleware         ← calls auth.api.getSession()
                   → authorizeMiddleware        ← enforces access controls
                   → route handler
```

### Session access
`accountMiddleware` (`src/express/middleware/account.ts`) calls `auth.api.getSession()` on every request and populates:
- `req.authenticated` — `true` if a valid session exists
- `req.account` — better-auth user object + `roles[]` fetched from `accounts_roles`

### better-auth hooks (`src/config/authHooks.ts`)
`databaseHooks` intercept all better-auth DB operations:
- **`user.create.before`** — sanitizes `email`/`username` (empty string → null); sets `is_active: true` on new accounts
- **`user.create/update/delete.after`** — inserts a row into `logs`; `actor_id` resolved from session or falls back to the user's own id
- **`session.create.before`** — checks `is_active = true` and `is_deleted = false`; throws if either check fails, blocking sign-in for inactive/deleted accounts
- **`session.create.after`** — runs two operations in parallel: inserts a `login` log entry, and increments `sign_in_count` + sets `sign_in_at` to UTC now on the `accounts` row
- **`session.update/delete.after`** — logs `refresh_session` / `logout`
- **`account.create/update/delete.after`** — logs OAuth provider link/update/unlink events
- **`verification.create/delete.after`** — logs verification token creation/deletion

### Email callbacks (`src/config/auth.ts`)
- `emailAndPassword.onExistingUserSignUp` — if sign-up is attempted with an already-registered email and the account is **unverified**, re-sends the verification email; if already verified, silently no-ops (anti-enumeration: the response always looks like success)
- `emailAndPassword.sendResetPassword` — sends reset password email via Nodemailer
- `emailAndPassword.onPasswordReset` — logs `reset_password` after successful reset
- `emailVerification.sendVerificationEmail` — sends verification email via Nodemailer
- `emailVerification.afterEmailVerification` — logs `verify_email` after confirmation

### better-auth migration
To generate/run schema changes after modifying `src/config/auth.ts`:
```bash
./node_modules/.bin/dotenvx run -f .env.local -- npx @better-auth/cli migrate
```

## Authorization System

Authorization is a custom role-based system spread across three files:

- **`src/config/accessControls.ts`** — Policy definitions (roles, selectors, grants)
- **`src/app/lib/authorize.ts`** — Authorization engine (evaluates policies per request)
- **`src/express/middleware/authorize.ts`** — Express middleware (enforces the result)

### How it works

Each role in `accessControls` has:
- `selector(req)` — returns `true` if the role applies to the current request
- `grants` — map of resources to allowed `route`, `methods`, and `actions`

On every request the middleware calls `authorize(req)`, which iterates all roles, runs each selector, and accumulates matching routes/actions into `req.authorized`. The middleware then checks the current route+method against that set.

**Response behavior:**
| Condition | Response |
|---|---|
| Route + method is authorized | `next()` |
| Route doesn't exist at all | 404 |
| Route exists, not permitted, authenticated | 403 |
| Route exists, not permitted, unauthenticated | 401 |

### Current roles

| Role | Selector | Grants |
|---|---|---|
| `*` | always true | `GET /account` |
| `not-authenticated` | `!req.authenticated` | all methods on `/auth/*` |
| `authenticated` | `req.authenticated` | `PUT/PATCH/DESTROY /account` (update, delete) |
| `admin` | `account.roles[].label === 'admin'` | wildcard — all routes/methods/actions |

### Adding a new protected route

1. Add a grant to the appropriate role in `src/config/accessControls.ts`
2. No middleware changes needed — the engine picks it up automatically

### `aliases`
A `manage` alias is defined (expands to all CRUD actions + all HTTP methods) but is not currently applied by the engine.

## Database Schema

All migrations live in `src/db/migrations/` and run in timestamp order.

| Table | Owner | Purpose |
|---|---|---|
| `accounts` | better-auth | User identity (email, name, password hash, sign-in tracking, active/deleted flags) |
| `sessions` | better-auth | Active sessions |
| `account_providers` | better-auth | OAuth provider links |
| `account_verifications` | better-auth | Email verification tokens |
| `account_plans` | App | Subscription plan definitions |
| `account_roles` | App | Shared role definitions (admin, etc.) |
| `accounts_roles` | App | Many-to-many: accounts ↔ account_roles (composite PK) |
| `account_history` | App | Tracks changes to `email` and `username` fields (via DB trigger) |
| `logs` | App | Generic activity log for all app events |

### `accounts` app-managed columns
In addition to better-auth core fields, `accounts` has:
| Column | Type | Default | Purpose |
|---|---|---|---|
| `sign_in_count` | integer | 0 | Incremented on every successful sign-in |
| `sign_in_at` | timestamp | null | Set to UTC now on every successful sign-in |
| `is_active` | boolean | false | Set to `true` on account creation; sign-in blocked if false |
| `is_deleted` | boolean | false | Soft-delete flag; sign-in blocked if true |

These are exposed to better-auth as `additionalFields` (`signInCount`, `signInAt`, `isActive`, `isDeleted`) so they appear on the user object returned by `getSession()`.

### Key constraints & triggers
- All tables have an `updated_at` trigger (`set_updated_at`) that auto-updates the column on row change
- `accounts.email` — UNIQUE constraint (also indexed); CHECK: not empty string
- `accounts.username` — UNIQUE constraint (`accounts_username_key`); `NULL` or non-empty (enforced via better-auth `before` hooks)
- `account_history` — populated automatically by a PostgreSQL `AFTER INSERT OR UPDATE` trigger on `accounts`; tracks `email` and `username` changes; `field` column is an enum (`account_history_field`: `email` | `username`)
- `accounts_roles` — composite PK on `(account_id, account_role_id)` with named FK constraints
- `logs.account_id` / `logs.actor_id` — both FK to `accounts.id` with `ON DELETE SET NULL`

### Performance indexes (`1774191635857-better-auth-optimizations`)
- `sessions(account_id)` — look up all sessions for an account
- `account_providers(account_id)` — look up all providers for an account
- `account_providers(provider_id, provider_account_id)` — OAuth callback lookup
- `account_verifications(identifier)` — token lookup by email
- `accounts.email` and `sessions.token` — already indexed via their UNIQUE constraints

## Middleware

| Middleware | Purpose |
|---|---|
| `requestContextMiddleware` | Stores `ip_address` and `user_agent` in `AsyncLocalStorage` — auto-populated on every `LogRepository.insert` |
| `accountMiddleware` | Resolves session via `auth.api.getSession()`, populates `req.authenticated` and `req.account` |
| `authorizeMiddleware` | Enforces RBAC access controls |
| `corsMiddleware` | CORS headers |
| `loggerMiddleware` | Request logging via Winston |
| `inputValidationMiddleware` | Joi schema validation |
| `error404Middleware` | 404 handler |
| `errorHandlerMiddleware` | Global error handler |

## Utilities

- **`src/app/utils/sanitize.ts`** — `emptyStringToNull(value)`: converts a single empty string to `null`; applied explicitly where needed (e.g. better-auth `before` hooks)
- **`src/app/lib/requestContext.ts`** — `AsyncLocalStorage` store; set by `requestContextMiddleware`, read by `LogRepository.insert`

## Environment
- Dev server runs on port **3001** (`APP_PORT`)
- Environment files: `.env`, `.env.local`, `.env.production`
- Never commit `.env.local` or `.env.production` — they contain secrets

Key env vars:

| Variable | Purpose |
|---|---|
| `BETTER_AUTH_SECRET` | Session signing secret |
| `BETTER_AUTH_URL` | Base URL (e.g. `http://localhost:3001`) |
| `GOOGLE_CLIENT_ID/SECRET` | Google OAuth credentials |
| `APPLE_CLIENT_ID/SECRET` | Apple OAuth credentials |
| `APPLE_APP_BUNDLE_IDENTIFIER` | Apple app bundle ID |
| `MAIL_HOST` | SMTP host |
| `MAIL_PORT` | SMTP port (default: 587) |
| `MAIL_USER` | SMTP username |
| `MAIL_PASSWORD` | SMTP password |
| `MAIL_FROM` | From address for outbound email |

## Testing
- Framework: Mocha + Chai
- Test files: `src/tests/**/*.spec.mjs`
- Run: `npm run test`

## Code Style
- ESLint with TypeScript + stylistic rules (`eslint.config.js`)
- TypeScript strict mode enabled
- ES Modules throughout (`"type": "module"` in package.json)
