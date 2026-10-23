# Full-Stack TypeScript Starter (TaskFlow)

A production-shaped monorepo template: **React + TypeScript (Vite)** frontend and
**Node.js + Express + TypeScript (Prisma/PostgreSQL)** backend, with clean
separation between reusable infrastructure and feature code.

## Structure

```
/
├── server/                 # Backend API (Express + Prisma)
│   ├── src/
│   │   ├── app.ts          # Express app factory (generic)
│   │   ├── index.ts        # Server bootstrap, DB check, graceful shutdown
│   │   ├── config/         # Env loading & validation (generic)
│   │   ├── lib/            # Infrastructure clients (prisma)
│   │   ├── middleware/     # Cross-cutting: auth, validation, errors
│   │   ├── routes/         # index.ts mounts all feature routers
│   │   └── modules/        # FEATURE CODE (auth, tasks)
│   │       └── <feature>/  # routes, controller, service, validator, serializers
│   ├── prisma/             # Schema & migrations (TaskFlow-specific)
│   └── tests/
└── taskflow/               # Frontend (React + Vite)
    └── src/
        ├── app/            # App shell: providers, routes, router config
        ├── components/     # Shared UI kit (Button, Input, Modal)
        ├── shared/         # Generic: api client, config, constants, utils, types
        ├── features/       # FEATURE CODE (auth, tasks, profile, products)
        │   └── <feature>/  # components, hooks, services, types, store
        ├── pages/          # Route-level pages (thin wrappers)
        └── styles/         # CSS
```

## Principles

1. **Infrastructure vs. features.** Anything not tied to a business concept
   lives in `server/src/{config,lib,middleware}` and `taskflow/src/shared`.
   Business logic lives only in `modules/` / `features/`.
2. **Adding a feature = one folder + one line.** Backend: create
   `modules/<feature>/` with `routes/controller/service/validator`, then mount
   it in `routes/index.ts`. Frontend: create `features/<feature>/` and a page.
3. **Layer flow (backend):** `routes` (validate + delegate) → `controller`
   (HTTP concerns only) → `service` (business rules, ownership scoping) →
   Prisma. No layer skips.
4. **One error contract.** Services throw `HttpError`; the central
   `errorHandler` maps it (and Zod/Prisma errors) to a consistent JSON body:
   `{ message, errors? }`.
5. **Frontend data flow:** page → feature hook (`useX`) → feature service →
   shared `apiClient` (attaches JWT, normalizes errors to `ApiError`).

## Getting started

```bash
# Backend
cd server
cp .env.example .env        # set DATABASE_URL, JWT_SECRET
npm install
npx prisma migrate deploy   # or: migrate dev
npm run dev                 # http://localhost:4000

# Frontend (new terminal)
cd taskflow
npm install                 # .env.development already points to :4000/api
npm run dev                 # http://localhost:5173
```

## Reusing this template for a new project

1. Copy `server/` and `taskflow/` (or the whole repo) into your new project.
2. Keep all generic infrastructure as-is: `server/src/{app,index,config,lib,
   middleware,routes/index}` and `taskflow/src/{app,components,shared,styles}`.
3. Replace feature code: delete `modules/*` and `features/*` contents, drop in
   your own domain modules/features following the same file pattern.
4. Replace `prisma/schema.prisma` with your domain model, run migrations.
5. Rename `taskflow` and update branding strings (page titles, storage keys).
6. Register your first module:
   - Backend: `modules/<feature>/` → mount router in `src/routes/index.ts`.
   - Frontend: `features/<feature>/` → add a page + route in `src/app/routes`.

See `server/README.md` and `taskflow/README.md` for layer-by-layer details.

## Environment variables

| Var | Where | Purpose |
|---|---|---|
| `PORT` | server | API port (default 4000) |
| `DATABASE_URL` | server | PostgreSQL connection string |
| `JWT_SECRET` | server | Token signing secret |
| `JWT_EXPIRES_IN` | server | Token TTL (default `2d`) |
| `CORS_ORIGIN` | server | Allowed origins (default `http://localhost:5173`) |
| `VITE_API_URL` | taskflow | Frontend → API base URL (include `/api`) |
