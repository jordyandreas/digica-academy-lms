# Digica Academy LMS

A learning-management-style web app for **Digica Academy**, built with the Next.js App Router. It combines a marketing landing for guests, a course catalog, lesson playback with curriculum navigation, articles, testimonials, and an “experience” journey—backed by typed in-app data (courses, lessons, articles) rather than a live CMS or database.

## Tech stack

| Layer | Choice |
| --- | --- |
| Framework | [Next.js](https://nextjs.org/) 16 (App Router) |
| UI | [React](https://react.dev/) 19, [Tailwind CSS](https://tailwindcss.com/) 4 |
| Components | [Radix UI](https://www.radix-ui.com/) primitives, custom UI in `src/components/ui` |
| Motion | [Framer Motion](https://www.framer.com/motion/) |
| Icons | [Lucide React](https://lucide.dev/) and custom 2D brand icons |
| Language | TypeScript (strict) |

Path alias: `@/*` → `./src/*` (see `tsconfig.json`).

## Prerequisites

- **Node.js** (LTS recommended)
- **pnpm** — the repo pins `packageManager` in `package.json`; use `pnpm install` for a consistent lockfile experience. npm/yarn also work if you prefer.

## Getting started

Install dependencies:

```bash
pnpm install
```

Run the dev server (default port **8000**):

```bash
pnpm dev
```

Open [http://localhost:8000](http://localhost:8000).

Other scripts:

| Script | Purpose |
| --- | --- |
| `pnpm build` | Production build |
| `pnpm start` | Run production server (after `build`) |
| `pnpm lint` | ESLint |
| `pnpm type-check` | TypeScript `--noEmit` |

## Project layout

```
src/
├── app/                    # Routes (App Router)
│   ├── page.tsx            # Home (guest landing vs authenticated shell)
│   ├── courses/            # Catalog + course detail + lessons
│   ├── articles/           # Article list + detail
│   ├── testimonials/       # Testimonials list + detail
│   └── experience/         # Experience point pages
├── components/             # Feature UI (landing, course, lesson, layout, auth, …)
│   └── ui/                 # Shared primitives (button, card, dialog, …)
├── features/               # Domain hooks + static data
│   ├── auth/               # Session helpers + useAuth
│   ├── courses/            # Course data, access hooks
│   ├── articles/           # Article content
│   ├── testimonials/     # Testimonial data
│   ├── experience/       # Experience timeline data
│   ├── progress/         # Lesson progress hook
│   └── skills/           # Skill stack data for landing sections
└── lib/                    # Shared types, footer config, utilities
```

## Behavior notes

- **Authentication** is implemented on the client (`localStorage` + a small session shape in `features/auth`). It drives UI such as the header, “My courses,” and logout—there is no server session or OAuth in this codebase.
- **Courses, lessons, articles, and testimonials** are defined as TypeScript modules under `src/features/**/data` (and related types in `src/lib/types`). Editing content means changing those files and redeploying.
- **Fonts**: Geist and Geist Mono via `next/font` in `src/app/layout.tsx`.

## Deploy

Any host that supports Next.js works (e.g. [Vercel](https://vercel.com)). Build with `pnpm build` and run with `pnpm start`, or use the platform’s Next.js integration.
