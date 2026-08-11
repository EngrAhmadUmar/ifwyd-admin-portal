# IFWYD Admin Portal

Admin portal for the [IFWYD website](https://github.com/EngrAhmadUmar/ifwyd-website) (Ikra Foundation for Women & Youth Development). Lets staff manage news, projects, classrooms, careers, and form submissions without touching code.

Built with the same stack and coding conventions as [alpha-rides-admin-portal](https://github.com/EngrAhmadUmar/alpha-rides-admin-portal): Next.js App Router, TypeScript, Tailwind, and a thin API layer that gracefully falls back to mock data whenever the backend isn't reachable.

## Setup

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). There's no backend yet, so:

- Every `lib/api/*` module tries the real API first, then falls back to mock data in `lib/*-data.ts` (an "API error" note shows up next to the page title when this happens).
- Login has no backend to call yet either. In development, `AuthProvider` fakes a valid session for **any** email/password so you can click through the whole portal. This fallback is skipped once `NEXT_PUBLIC_API_URL` points at a real backend, and it's a no-op in production builds.

## Routes

| Path | Page |
|------|------|
| `/` | Dashboard |
| `/news` | News posts |
| `/projects` | Projects |
| `/classrooms` | Classrooms |
| `/career` | Career postings |
| `/volunteer` | Volunteer applications |
| `/register` | Registrations |
| `/contact` | Contact messages |
| `/donate` | Donate page settings |
| `/content` | Site content (Home/About copy) |
| `/settings` | Organization settings |
| `/login` | Login |

## Project structure

```
src/
  app/
    (auth)/login/          # Public login route
    (dashboard)/           # Everything behind middleware auth, wrapped in DashboardShell
  components/
    auth/                  # SignInForm
    layout/                # Sidebar, Header, DashboardShell
    dashboard/              # StatCard, RecentSubmissions
    content/                # Rich-text ContentEditor for site copy
    settings/               # Shared form field/toggle primitives
    ui/                     # ActionMenu, ConfirmModal, ProfileAvatar
  config/
    navigation.ts           # Sidebar nav items
  lib/
    api/                    # One module per domain; each tries the backend, falls back to mock data
    *-data.ts                # Mock data + types per domain
    auth.ts, utils.ts, media-url.ts
  providers/                # AuthProvider, QueryProvider
  middleware.ts              # Redirects to /login when there's no valid session cookie
```

## Next steps

- Point `NEXT_PUBLIC_API_URL` at a real backend and implement the `/api/admin/*` routes referenced in `lib/api/*` (mirrors the shape used by alpha-rides-admin-portal's `ADMIN_API.md`).
- Add create/edit forms for News, Projects, Classrooms, and Career (currently list + status + delete only).

## Assets

Static images live in **`public/Asset/`** and are referenced via `src/config/assets.ts`.

| Asset | File |
|-------|------|
| Logo | `logo.png` |

Usage:

```ts
import { assets, assetPath } from "@/config/assets";

assets.logo
assetPath("my-new-icon.png")
```
