# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Start development server (http://localhost:3000)
npm run build        # Production build
npm run lint         # ESLint check
npm run setup        # Create required directories (content/, public/audio/, public/pdf/, temp/)
npm run env-check    # Validate environment variables
npm run generate-jwt # Generate JWT secret
npm run test-api     # Test API endpoints
npm run security-audit  # npm audit + env validation
```

No test framework is configured — tests run via `npm run test-api` against live endpoints.

## Environment Setup

Copy `.env.example` to `.env.local`. Required variables:
- `JWT_SECRET` — 32+ characters, mixed types (validated at startup; build fails without it)
- `NODE_ENV`
- `NEXT_PUBLIC_SITE_URL`

The app validates environment at startup in `next.config.js` — weak or missing `JWT_SECRET` blocks the server from starting.

## Architecture

**Stack:** Next.js 14 (Pages Router) + React 18 + Tailwind CSS + custom JWT auth
**Data storage:** File-based JSON at `data/users.json` (not a database — synchronous fs read/write, full file loaded per operation)
**No ORM, no external database** — PostgreSQL/Prisma is planned but not implemented

### Directory Layout

```
src/
  pages/           # Next.js Pages Router (not App Router)
    api/           # API routes
      auth/        # login, register, logout, me
      content/     # subjects, units, search
      user/        # profile, progress
    subjects/[subjectId]/  # Dynamic subject pages
  features/        # Domain logic grouped by feature
    auth/
      context/AuthContext.js     # useAuth(), withAuth(), withPremium() HOCs
      server/auth.js             # JWT generateToken/verifyToken + withAuth middleware
      server/userManager.js      # User CRUD against data/users.json
    content/lib/subjects.js      # Static definitions: 8 subjects, 80+ units
    marketing/components/        # Landing page sections
    admin/components/            # Admin UI (mock, not fully API-integrated)
  shared/layout/   # Header.js, Footer.js
  security/        # Rate limiting, Zod schemas, XSS/CSRF utils, Winston logger
  components/      # Reusable UI components
content/units/     # Markdown lesson content files
data/users.json    # File-based user database
```

### Authentication Flow

Custom JWT — **not** NextAuth. Token is stored in localStorage + HttpOnly cookie.

- `AuthContext` (`src/features/auth/context/AuthContext.js`) provides `useAuth()` hook globally via `_app.js`
- Protect pages with `withAuth(Component)` or `withPremium(Component)` HOCs
- Server-side: import `withAuth` from `src/features/auth/server/auth.js` to guard API routes
- JWT expires in 7 days; payload contains `userId`, `email`, `name`, `isPremium`

### API Route Pattern

```js
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  // withAuth wraps the handler for protected routes
}
```

### Content System

Subject/unit definitions are static data in `src/features/content/lib/subjects.js`. Actual lesson content is Markdown files in `content/units/`. The `contentManager.js` loads and caches Markdown content.

### Security Middleware

Located in `src/security/middleware/`. Rate limiting (`apiRateLimit.js`, `loginRateLimit.js`) and Zod validation schemas (`src/security/schemas/`) exist but are **not consistently applied** to all API routes — check each endpoint before assuming protection is in place.

## Known Issues

- **README states App Router; implementation uses Pages Router** — trust the code, not the README
- Admin panel has mock implementations, not fully wired to real APIs
- File-based `data/users.json` is not production-ready; PostgreSQL migration is planned
- Security middleware exists but is inconsistently applied across API routes
