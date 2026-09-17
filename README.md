# Enamel - Dental Clinic (Sarajevo)

Portfolio project. Enamel is a fictional clinic built to exercise a real booking flow; the staff, services and contact details are placeholders.

Bilingual (Bosnian / English) full-stack website for the Enamel dental clinic: marketing site, online appointment requests, and a secure staff admin dashboard.

## Stack

- **Next.js 16** (App Router, Server Components, Server Actions, View Transitions)
- **React 19**, **Tailwind CSS v4**, **Framer Motion**
- **Neon Postgres** + **Prisma 7** (Neon driver adapter)
- **Neon Auth** (Stack Auth) — staff/admin only
- **Resend** — transactional email
- Deploy target: **Vercel**

## Features

- Design system in `app/globals.css`: solid surfaces, one card radius, no gradients or blur
- Directional page transitions and a shared-element transition on service names
- Bilingual routing under `/[lang]` (`bs` default) with server-only dictionaries
- Pages: Home, About, Services (+ detail), Team, Appointment booking, Contact, Testimonials, Blog, Privacy policy, Terms of use
- Appointment system: availability engine (working hours − time off − approved bookings), Zod validation, transactional overlap guard, email confirmations
- Admin: appointments (approve/reject/reschedule), services CRUD, dentists + working-hours/time-off, testimonial moderation, blog CMS, contact inquiries
- SEO: per-locale metadata with canonical + hreflang, localized `sitemap.xml`, `robots.txt`, Dentist JSON-LD, generated OpenGraph image

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

- **`lib/clinic.ts` holds the clinic's contact details** (address, phone, email, opening
  hours, registered company name) and ships empty. Every surface that displays them - contact
  page, footer, Dentist structured data, the Google Maps embed, the legal pages - checks for a
  value first and omits the row when it is blank, so the site never publishes a guessed address
  or an unreachable number. Fill this in before launch.
- Set `NEXT_PUBLIC_SITE_URL` to the production domain; canonical URLs, hreflang, the sitemap and
  the OpenGraph image all derive from it.
- Prices and staff profiles are managed in the admin dashboard. The seed ships only the services
themselves (with no prices, so they show as "on request") and a single example dentist.
- Connection URLs live in `prisma.config.ts` (Prisma 7); the runtime client uses the Neon
  WebSocket adapter in `lib/prisma.ts`. Note that `prisma generate` (and therefore
  `npm install`) fails unless `DIRECT_URL` is set.
- Public pages degrade gracefully (empty states) when the DB is unreachable.
- `AGENTS.md` directs AI agents to the version-matched Next.js docs in `node_modules/next/dist/docs/`.
