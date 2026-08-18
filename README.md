# IFWYD Admin Portal

Admin portal for the [IFWYD website](https://github.com/EngrAhmadUmar/ifwyd-website) (Ikra Foundation for Women & Youth Development). Lets staff manage news, projects, classrooms, careers, and form submissions without touching code.

Backend: [ifwyd-api](https://github.com/EngrAhmadUmar/ifwyd-api) — built specifically to match this portal's types field-for-field, so no response mapping is needed on this side.

## Setup

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

- **With the backend running** (see [ifwyd-api](https://github.com/EngrAhmadUmar/ifwyd-api)'s README — `python run.py`, defaults to `http://127.0.0.1:5000`): set `NEXT_PUBLIC_API_URL=http://127.0.0.1:5000` in `.env.local` and log in with the seeded admin (`admin@ifwyd.org` / `AdminDev123!`, unless overridden).
- **Without a backend**: leave `NEXT_PUBLIC_API_URL` unset. Every `lib/api/*` module tries the real API first, then falls back to mock data in `lib/*-data.ts` (an "API error" note shows up next to the page title when this happens). `AuthProvider` also fakes a valid session for **any** email/password in this case, so you can click through the whole portal — that fallback is skipped once `NEXT_PUBLIC_API_URL` is set, and it's a no-op in production builds regardless.

## Routes

| Path | Page | In sidebar? |
|------|------|-------------|
| `/` | All Content (dashboard: merged News + Projects feed) | Yes |
| `/posts/new` | New Post (create News or Project, with live preview) | Yes |
| `/media` | Media library | Yes |
| `/classrooms` | Classrooms | Yes |
| `/career` | Career postings | Yes |
| `/volunteer` | Volunteer applications | Yes |
| `/register` | Registrations | Yes |
| `/contact` | Contact messages | Yes |
| `/donate` | Donate page settings | Yes |
| `/settings` | Organization settings | Yes |
| `/news` | Full News list (publish/unpublish/delete) | No — reached via "All Content" edit / "New Post" |
| `/projects` | Full Projects list (publish/unpublish/delete) | No — reached via "All Content" edit / "New Post" |
| `/content` | Site content (Home/About copy) | No — not currently linked |
| `/login` | Login | — |

## Project structure

```
src/
  app/
    (auth)/login/          # Public login route
    (dashboard)/           # Everything behind middleware auth, wrapped in DashboardShell
  components/
    auth/                  # SignInForm
    layout/                # Sidebar, DashboardShell
    dashboard/              # StatCard, the All Content feed (DashboardContent.tsx)
    posts/                  # New Post form + live preview
    icons/                  # Logo (next/image wrapper around public/Asset assets)
    content/                # Rich-text ContentEditor for site copy
    settings/               # Shared form field/toggle primitives
    ui/                     # ActionMenu, ConfirmModal, ProfileAvatar
  config/
    navigation.ts           # Sidebar nav items
    assets.ts               # Static asset paths (public/Asset/*)
  lib/
    api/                    # One module per domain; each tries the backend, falls back to mock data
    *-data.ts                # Mock data + types per domain
    auth.ts, utils.ts, media-url.ts
  providers/                # AuthProvider, QueryProvider
  middleware.ts              # Redirects to /login when there's no valid session cookie
```

## Next steps

- Add create/edit forms for Classrooms and Career (currently list + status + delete only — News/Projects already have the New Post flow).
- Wire up `/content` (site copy editor) and `/news`, `/projects` somewhere reachable from the sidebar, or fold them into "All Content" properly.

## Assets

Static images live in **`public/Asset/`** and are referenced via `src/config/assets.ts`.

| Asset | File |
|-------|------|
| Icon mark | `logo.png` |
| Sidebar lockup (icon + wordmark + tagline) | `logo1.png` |

Usage:

```ts
import { assets, assetPath } from "@/config/assets";

assets.logo
assets.logoHorizontal
assetPath("my-new-icon.png")
```
