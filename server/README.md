# Server (Express + TypeScript + Prisma)

API for the TaskFlow template. Generic infrastructure lives in `src/{config,
lib,middleware,routes}`; business features live in `src/modules/`.

## Layout

```
src/
├── app.ts                # createApp(): CORS, JSON body, /api/health, error handler
├── index.ts              # bootstrap: DB connectivity check, listen, SIGTERM handling
├── config/env.ts         # loads & validates environment variables
├── lib/prisma.ts         # singleton PrismaClient
├── middleware/
│   ├── auth.ts           # authenticate: verifies JWT, sets req.user
│   ├── validate.ts       # validate(schema, source): Zod middleware (body/params)
│   ├── http-error.ts     # HttpError(status, message) — service-layer errors
│   └── error-handler.ts  # one JSON error contract for all errors
├── routes/index.ts       # mounts every module's router under /api
└── modules/
    ├── auth/             # /api/auth: register, login (JWT)
    └── tasks/            # /api/tasks: CRUD + toggle, per-user scoping
```

Each module follows the same shape:
`routes` (attach middleware, delegate) → `controller` (HTTP only) →
`service` (business rules, Prisma access) → `validator` (Zod schemas) →
`*.serializer` (entity → public JSON shape).

## API

Auth (JWT returned as `{ user, token }`):
- `POST /api/auth/register` — `{ name, email, password }`
- `POST /api/auth/login` — `{ email, password }`

Tasks (require `Authorization: Bearer <token>`; users see only their own):
- `GET /api/tasks` — list, newest first
- `GET /api/tasks/:id`
- `POST /api/tasks` — `{ title, description?, priority?, dueDate? }`
- `PATCH /api/tasks/:id` — any of `{ title, description, priority, status, dueDate }`
- `PATCH /api/tasks/:id/toggle` — flips pending ↔ completed
- `DELETE /api/tasks/:id` — 204

`dueDate` must be a valid date string or `null` (never `""`). Unknown ids for
another user's task return 404 — ownership is enforced in the service layer.

## Error contract

All errors return `{ message, errors? }`:
- 401 unauthenticated / bad token · 404 not found · 409 duplicate unique field
- 422 validation failure (`errors` maps field → message)
- 503 database unreachable · 500 unexpected

## Environment

Copy `.env.example` to `.env`: `PORT`, `DATABASE_URL`, `JWT_SECRET`,
`JWT_EXPIRES_IN`, `CORS_ORIGIN`. Run `npx prisma migrate dev` once, then
`npm run dev`.

## Adding a feature module

1. `src/modules/<feature>/` — copy the file pattern from `modules/tasks/`.
2. Write a Zod `validator`, a `service` scoped to `req.user.id` where relevant,
   and a `serializer` matching the frontend type exactly.
3. Export a `Router` from `routes.ts`, mount it in `src/routes/index.ts`.
   Nothing else changes.
