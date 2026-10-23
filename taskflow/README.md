# TaskFlow Frontend (React + TypeScript + Vite)

Generic app shell lives in `src/{app,components,shared,styles}`; business
features live in `src/features/`.

## Layout

```
src/
├── main.tsx               # React root
├── app/
│   ├── App.tsx            # Router setup
│   ├── routes/index.tsx   # Route table (pages)
│   └── providers/app-providers.tsx
├── components/ui/         # Design system: Button, Input, Modal (plain CSS classes)
├── shared/
│   ├── api/api-client.ts  # fetch wrapper: base URL, JWT header, ApiError
│   ├── config/app-config.ts
│   ├── constants/app.ts
│   ├── types/ · utils/    # generic helpers
├── features/
│   ├── auth/              # context + storage (user, JWT), login form/service
│   ├── tasks/             # TaskList, DashboardTasks, form modal, hooks, service
│   ├── profile/ · products/   # other features, same shape
├── pages/                 # thin page wrappers per route
└── styles/                # CSS
```

Each feature follows the same shape:
`components` (UI) → `hooks` (`useX` for loading, `useX-mutations` for writes) →
`service` (calls shared `apiClient`) → `types`.

## Data flow

Pages call feature hooks; hooks call feature services; services call
`apiClient(path, { method, body })`. The client prepends `VITE_API_URL` and
attaches `Authorization: Bearer <token>` from the auth feature's stored JWT.
Every failure surfaces as an `ApiError` whose message comes from the server's
`{ message }` body — hooks render it directly.

## Tasks feature

- `useTasks()` — loads tasks, exposes `{ tasks, isLoading, error, reload }`.
- `useTaskMutations(onDone)` — create / update / toggle / delete, then triggers
  `onDone` (usually `reload`) so the UI refetches.
- `TaskList` (full list + status filters) and `DashboardTasks` (summary cards +
  first 5 tasks) share `TaskItem` and `TaskFormModal` (create & edit modes).
- Status filters (`all/pending/completed`) are client-side via
  `filterTasksByStatus`.

## Environment

`.env.development` sets `VITE_API_URL=http://localhost:4000/api` — must point
at the server including the `/api` prefix. Start with `npm run dev`.

## Adding a feature

1. `src/features/<feature>/` — components, hooks, service, types.
2. Service functions call `apiClient` with feature-relative endpoints.
3. Add a page in `src/pages/<feature>/index.tsx` and register the route in
   `src/app/routes/index.tsx`.

---

<details>
<summary>Original Vite template notes</summary>

This project was bootstrapped from the official React + Vite TypeScript
template; ESLint configuration notes from that template are below.

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

</details>
