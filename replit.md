# LoveZone

India's #1 trusted directory for verified male escort listings across all Indian states and major cities.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 8080)
- `pnpm --filter @workspace/lovezone run dev` — run the frontend (port 25421)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string, `SESSION_SECRET` — for cookie sessions

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React + Vite + Wouter + shadcn/ui + Tailwind CSS
- API: Express 5 + cookie-session
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `lib/api-spec/openapi.yaml` — API contract (source of truth)
- `lib/db/src/schema/` — DB schema: listings, states, cities, seo_pages, site_settings, admin_users
- `artifacts/api-server/src/routes/` — Express route handlers
- `artifacts/lovezone/src/pages/` — React pages (public + admin)
- `artifacts/lovezone/src/components/` — Layout, ListingCard, etc.

## Architecture decisions

- Contract-first OpenAPI: spec gates codegen which gates the frontend
- Session auth via cookie-session (stored in cookies, not JWTs) for admin panel
- Site settings (phone, WhatsApp, email) stored in DB — changing them updates the entire site
- SEO pages are dynamically generated from admin panel and served at `/:slug` (catch-all last route)
- Sitemap.xml and robots.txt served directly from the API at `/api/sitemap.xml` and `/api/robots.txt`

## Product

- **Public site**: Home, All States, All Cities, Listings, State pages, City pages, SEO keyword pages, About, Contact, Privacy, Terms
- **Admin panel** at `/admin`: Dashboard, Manage Listings, Manage States, Manage Cities, SEO Manager, Site Settings
- **Dynamic SEO pages**: Created via admin → automatically accessible at `/:slug`
- **Contact number**: +91 8929364337 — shown in header, footer, state/city pages, contact page

## Admin Access

- URL: `/admin`
- Username: `Admin`
- Password: `Admin@1360`

## User preferences

- Dark theme with red/crimson accents
- Contact number: +91 8929364337
- Mobile-friendly and SEO-optimized

## Gotchas

- After changing OpenAPI spec, always run codegen before touching frontend types
- The `/:seoSlug` route must remain LAST in the router (catch-all)
- DB push: `pnpm --filter @workspace/db run push` (or `push-force` if conflicts)
- Cookie session requires `SESSION_SECRET` env var (falls back to a default in dev)

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
