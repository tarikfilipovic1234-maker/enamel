# Enamel — Dental Clinic (Sarajevo)

Premium, bilingual (🇧🇦 Bosnian / 🇬🇧 English) full-stack website for the Enamel dental clinic: marketing site, online appointment requests, and a secure staff admin dashboard.

## Stack

- **Next.js 16** (App Router, Server Components, Server Actions, View Transitions)
- **React 19**, **Tailwind CSS v4**, **Framer Motion**
- **Neon Postgres** + **Prisma 7** (Neon driver adapter)
- **Neon Auth** (Stack Auth) — staff/admin only
- **Resend** — transactional email
- Deploy target: **Vercel**

## Features

- Splash animation, aurora/glass design system, directional + shared-element page transitions
- Bilingual routing under `/[lang]` (`bs` default) with server-only dictionaries
- Pages: Home, About, Services (+ detail), Team, Appointment booking, Contact, Testimonials, Blog
- Appointment system: availability engine (working hours − time off − approved bookings), Zod validation, transactional overlap guard, email confirmations
- Admin: appointments (approve/reject/reschedule), services CRUD, dentists + working-hours/time-off, testimonial moderation, blog CMS, contact inquiries
- SEO: localized `sitemap.xml`, `robots.txt`, Dentist JSON-LD, OpenGraph

## Getting started

1. **Install**

   ```bash
   npm install
   ```

2. **Environment** — copy `.env.example` to `.env` and fill in real values:

   - `DATABASE_URL` (Neon **pooled** `-pooler` host) and `DIRECT_URL` (direct host)
   - `NEXT_PUBLIC_STACK_PROJECT_ID` (UUID), `NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY`, `STACK_SECRET_SERVER_KEY` (from Neon Auth)
   - `RESEND_API_KEY`, `EMAIL_FROM`, `CONTACT_TO_EMAIL`
   - `ADMIN_EMAILS` (comma-separated allowlist for dashboard access)
   - `NEXT_PUBLIC_SITE_URL`

3. **Database**

   ```bash
   npm run db:migrate     # create tables (prisma migrate dev)
   npm run db:seed        # sample services, dentists, hours, testimonials, post
   # optional hard anti-double-booking guard:
   #   psql "$DIRECT_URL" -f prisma/sql/001_appointment_overlap_exclusion.sql
   ```

4. **Run**

   ```bash
   npm run dev            # http://localhost:3000  (redirects to /bs)
   ```

   Admin dashboard: `/admin` (sign in via Neon Auth; your email must be in `ADMIN_EMAILS`).

## Scripts

| Script | Purpose |
| --- | --- |
| `npm run dev` / `build` / `start` | Next.js dev / build / serve |
| `npm run db:migrate` | Apply Prisma migrations (dev) |
| `npm run db:deploy` | Apply migrations (prod/CI) |
| `npm run db:seed` | Seed sample data |
| `npm run db:studio` | Prisma Studio |

## Notes

- Connection URLs live in `prisma.config.ts` (Prisma 7); the runtime client uses the Neon WebSocket adapter in `lib/prisma.ts`.
- Public pages degrade gracefully (empty states) when the DB is unreachable.
- `AGENTS.md` directs AI agents to the version-matched Next.js docs in `node_modules/next/dist/docs/`.
