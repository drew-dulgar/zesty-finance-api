# Zesty Finance API

Express.js REST API for Zesty Finance. Handles authentication, account management, and role-based authorization.

## Requirements

- Node.js 24.13.1 (see `.nvmrc`)
- PostgreSQL

## Setup

```bash
npm install
cp .env .env.local   # fill in secrets
npm run start:dev
```

Server runs on port **3001** by default.

## Commands

```bash
npm run start:dev        # Dev server with hot reload
npm run build            # Compile TypeScript to dist/
npm run test             # Run Mocha tests
npm run lint             # ESLint
npm run lint:fix         # ESLint with auto-fix
npm run db:migrate:up    # Run next pending migration
npm run db:migrate:down  # Roll back last migration
```

Run all pending migrations at once:
```bash
./node_modules/.bin/dotenvx run -f .env.local -- node ./dist/src/db/migrator.js latest
```

## Architecture

Requests flow through: `controllers → services → repositories → db`

```
src/
├── app/
│   ├── controllers/    # Route handlers
│   ├── repositories/   # Data access (Kysely)
│   ├── services/       # Business logic
│   └── lib/            # Logger, authorization, AsyncLocalStorage context
├── config/
│   ├── auth.ts         # better-auth configuration
│   ├── accessControls.ts # RBAC policy
│   ├── mailer.ts       # Nodemailer
│   └── env.ts          # Typed environment variables
├── db/
│   ├── migrations/     # SQL migrations (timestamp-ordered)
│   └── migrator.ts     # Migration runner
└── express/
    ├── middleware/      # account, authorize, cors, error handling, etc.
    └── index.ts         # App setup and middleware order
```

## Authentication

Handled by [better-auth](https://better-auth.com) mounted at `/auth/*`.

| Endpoint | Method | Description |
|---|---|---|
| `/auth/sign-in/email` | POST | Sign in with email + password |
| `/auth/sign-up/email` | POST | Register |
| `/auth/sign-out` | POST | Sign out |
| `/auth/request-password-reset` | POST | Send password reset email |
| `/auth/reset-password` | POST | Submit new password (requires `token`) |

Auth routes are intercepted before the middleware chain — better-auth handles its own body parsing.

## Authorization

Custom role-based access control defined in `src/config/accessControls.ts`.

| Role | Selector | Access |
|---|---|---|
| `*` | always | `GET /account` |
| `not-authenticated` | `!req.authenticated` | all `/auth/*`, `POST /account` |
| `authenticated` | `req.authenticated` | `PUT/PATCH/DELETE /account`, all routes |
| `admin` | role label = `admin` | everything |

## Environment Variables

| Variable | Description |
|---|---|
| `BETTER_AUTH_SECRET` | Session signing secret |
| `APP_BASE_URL` | Base URL of this API |
| `APP_ORIGIN_URL` | Trusted origin for CORS |
| `GOOGLE_CLIENT_ID/SECRET` | Google OAuth credentials |
| `APPLE_CLIENT_ID/SECRET` | Apple OAuth credentials |
| `APPLE_APP_BUNDLE_IDENTIFIER` | Apple app bundle ID |
| `MAIL_HOST` | SMTP host |
| `MAIL_PORT` | SMTP port (default: 587) |
| `MAIL_USER` | SMTP username |
| `MAIL_PASSWORD` | SMTP password |
| `MAIL_FROM` | From address for outbound email |

## Tech Stack

- **Framework:** Express.js 4
- **Database:** PostgreSQL via Kysely
- **Auth:** better-auth (email/password, Google OAuth, Apple OAuth)
- **Email:** Nodemailer
- **Logging:** Winston
- **Validation:** Joi
- **Testing:** Mocha + Chai
- **Environment:** dotenvx
