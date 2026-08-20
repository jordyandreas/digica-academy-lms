# Digica Academy LMS

Public-facing web app for **Digica Academy**: marketing landing, live program catalog, public registration and check-in, alumni stories, and (behind feature flags) recorded courses with lesson playback.

Built with the Next.js App Router. Shared **Supabase** project powers auth, profiles, programs, registration, and LMS course data. Static TypeScript modules still drive articles, testimonials, curriculum previews, and some marketing copy.

## Tech stack

| Layer | Choice |
| --- | --- |
| Framework | [Next.js](https://nextjs.org/) 16 (App Router) |
| UI | [React](https://react.dev/) 19, [Tailwind CSS](https://tailwindcss.com/) 4 |
| Components | [Radix UI](https://www.radix-ui.com/) primitives, custom UI in `src/components/ui` |
| Forms | [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/) |
| Auth / data | [Supabase](https://supabase.com/) (`@supabase/ssr`, `@supabase/supabase-js`) |
| Motion | [Framer Motion](https://www.framer.com/motion/) |
| Icons | [Lucide React](https://lucide.dev/) and custom 2D brand icons |
| Language | TypeScript (strict) |

Path alias: `@/*` → `./src/*` (see `tsconfig.json`).

## Prerequisites

- **Node.js** (LTS recommended)
- **pnpm** — pinned via `packageManager` in `package.json`
- A **Supabase** project with LMS + programs schema applied (see [`supabase/README.md`](supabase/README.md))

## Getting started

1. Install dependencies:

```bash
pnpm install
```

2. Copy env and fill values:

```bash
cp .env.example .env.local
```

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public anon key (browser + server) |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-only admin client (registration, check-in, etc.) |
| `NEXT_PUBLIC_ADMIN_WHATSAPP` | Digica WhatsApp number for CTAs / support links |
| `NEXT_PUBLIC_SITE_URL` | Optional canonical origin for OG/metadata (defaults to `https://digica-academy.web.id`) |

3. Run the app (port **8000**):

```bash
pnpm dev
```

Open [http://localhost:8000](http://localhost:8000).

| Script | Purpose |
| --- | --- |
| `pnpm build` | Production build |
| `pnpm start` | Run production server (after `build`) |
| `pnpm lint` | ESLint |
| `pnpm type-check` | TypeScript `--noEmit` |

## Feature flags

Controlled in [`src/constants/features.ts`](src/constants/features.ts):

| Flag | Default | Effect |
| --- | --- | --- |
| `COURSES_ENABLED` | `false` | Catalog / courses nav / recorded LMS surfaces on the public marketing site |
| `ARTICLES_ENABLED` | `false` | Blog sections and routes in the public marketing shell |
| `PUBLIC_AUTH_ENABLED` | `false` | Signup / login UI (enable only when auth email SMTP is production-ready) |

## Main routes

| Path | Description |
| --- | --- |
| `/` | Home — guest landing or authenticated shell |
| `/programs` | Upcoming / public programs catalog |
| `/r/{identifier}` | **Canonical** program registration |
| `/programs/{id}` | Legacy registration → redirects to `/r/...` |
| `/c/{identifier}` | **Canonical** session check-in |
| `/check-in/{id}` | Legacy check-in → redirects to `/c/...` |
| `/testimonials` | Alumni stories |
| `/courses`… | Recorded courses + lessons (gated by data + `COURSES_ENABLED`) |
| `/articles`… | Articles (gated by `ARTICLES_ENABLED`) |
| `/account/profile` | Student profile |
| `/account/change-password` | Change password |
| `/account/reset-password` | Password reset landing |
| `/auth/callback` | Supabase auth callback |
| `/privacy`, `/terms` | Legal pages |

### APIs

| Route | Description |
| --- | --- |
| `GET` / `POST` `/api/registration/[programId]` | Public registration read + submit |
| `GET` / `POST` `/api/check-in/[programId]` | Public check-in read + submit |
| `GET` `/api/programs/[programId]` | Public program lookup |
| `GET` `/api/health` | Health check |

## Project layout

```
src/
├── app/                      # App Router pages + API routes
│   ├── page.tsx              # Home
│   ├── programs/             # Catalog + legacy registration alias
│   ├── r/[identifier]/       # Registration
│   ├── c/[identifier]/       # Check-in
│   ├── courses/              # Catalog, course, lesson
│   ├── account/              # Profile, password flows
│   ├── auth/callback/        # Supabase OAuth / email callback
│   └── api/                  # registration, check-in, programs, health
├── components/
│   ├── landing/              # Marketing sections (hero, programs, curriculum, …)
│   ├── program/              # Registration UI
│   ├── check-in/             # Check-in UI
│   ├── course/ + lesson/     # Recorded LMS UI
│   ├── auth/ + profile/      # Auth modal, header, account forms
│   ├── testimonials/         # Cards + story pages
│   ├── layout/               # Footer, HashLink
│   └── ui/                   # Shared primitives
├── features/                 # Domain logic, schemas, data loaders
│   ├── auth/                 # Supabase session hooks, profile ensure, schemas
│   ├── programs/             # Public program fetch + content
│   ├── registration/         # Registration public data
│   ├── check-in/             # Check-in public data + schema
│   ├── courses/              # Published courses from Supabase + mapping
│   ├── profile/              # Student profile read/update
│   ├── skills/               # Program curricula for landing / registration
│   ├── testimonials/         # Static alumni data
│   ├── articles/             # Static article data
│   └── legal/ + seo/         # Legal copy, site metadata
├── lib/
│   └── supabase/             # Browser, server, admin, middleware clients
├── constants/                # Feature flags, shared copy
├── constants/                # Feature flags, shared copy
├── schemas/                  # Shared Zod schemas (e.g. registration)
└── utils/                    # Phone, WhatsApp, program links, …

middleware.ts                 # Supabase session refresh
supabase/                     # LMS migrations + seed notes
public/                       # Logos, instructor/alumni images, program art
```

## Behavior notes

- **Auth** uses Supabase Auth (cookies via middleware). Student `profiles` are ensured after signup. Public marketing auth UI is behind `PUBLIC_AUTH_ENABLED`.
- **Programs / registration / check-in** read and write live Supabase tables (shared with the Digica admin / finance dashboard). See [`supabase/README.md`](supabase/README.md) for schema apply, entitlements, SMTP, and redirect URLs.
- **Recorded courses** live in `lms_*` tables. Lesson **progress** is still client-side (`localStorage`) until DB progress ships.
- **Curriculum** on the landing page is section `#curriculum` (Skills / program curricula), not the older `#experience` id. Experience pillar detail pages remain under `/experience/[id]`.
- **Testimonials and articles** remain static TypeScript data under `src/features/**/data`.
- **Fonts**: Geist and Geist Mono via `next/font` in `src/app/layout.tsx`.

## Deploy

1. Set the env vars above on the host (never commit `.env.local` or service-role keys).
2. Confirm Supabase: migrations applied, auth redirect URL includes `https://<your-domain>/auth/callback`, and **custom SMTP** is configured for production auth email (see [`supabase/README.md`](supabase/README.md)).
3. Point admin `NEXT_PUBLIC_PUBLIC_APP_URL` at this LMS origin so copied registration / check-in links open here.
4. Build and run (or use a Next.js-aware host such as [Vercel](https://vercel.com)):

```bash
pnpm build
pnpm start
```

Default marketing site: [https://digica-academy.web.id](https://digica-academy.web.id).
