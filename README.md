# Nirapod Kontho Frontend

Production-ready web frontend for Nirapod Kontho, built with Next.js App Router.

This application provides:

- A public awareness and information portal
- A secure authentication flow (email/password + Google)
- Role-based dashboards for users, moderators, NGO admins, and super admins
- Incident reporting workflow with status tracking
- Donation flow and payment history views

## Project Overview

Nirapod Kontho is a safety reporting and coordinated response platform. The frontend is designed to support two core goals:

1. Make reporting accessible and fast for end users
2. Enable structured follow-up through moderator review, NGO assignment, and case tracking

The UI is split between:

- Public experience: home, about, safety, resources, contact, and donation pages
- Auth experience: login, register, forgot password
- Dashboard experience: role-specific tools and analytics

## UI and UX Highlights

- Responsive layout for mobile, tablet, and desktop
- Structured dashboard shell with sidebar + top navbar
- Role-aware navigation and protected routes
- Clear status-driven cards and tables for operational pages
- Theme support via next-themes
- Motion and transitions with framer-motion

## Role-Based Features

### USER

- Submit and track reports
- View notifications
- View donation history

### MODERATOR

- Review pending reports
- Approve/reject reports with decisions
- View reviewed report history and overview metrics

### NGO_ADMIN

- View assigned cases
- Update case progress
- Access NGO analytics and case resources

### SUPER_ADMIN

- Manage NGO operations
- Review verified reports and assign NGOs
- Access audit logs and payment analytics
- View platform-level configuration pages

## Public Features

- Home page with platform mission and entry points
- About page with context and trust positioning
- How It Works flow section
- Safety and resource pages
- Contact and partnership information
- Donation flow pages (including success/cancel outcomes)

## Tech Stack

- Framework: Next.js 16 (App Router)
- Language: TypeScript
- UI: Tailwind CSS v4 + custom/shadcn UI components
- Data fetching/state: TanStack React Query
- Forms/validation: React Hook Form + Zod
- HTTP client: Axios
- Maps: Leaflet + react-leaflet
- Animation: Framer Motion
- Icons: lucide-react
- Theming: next-themes
- Notifications: Sonner

## Project Architecture

- app/: route definitions and page composition (public, auth, dashboard)
- components/: shared and UI components
- src/modules/: domain-driven feature modules (report, verification, payment, ngo, super-admin)
- src/providers/: app-level providers (auth, query, theme)
- src/services/: API client abstractions

API calls are proxied through Next.js rewrites:

- Frontend calls /api/*
- Next.js forwards to configured backend API target

## Demo Accounts

For security reasons, hardcoded production/demo credentials are not stored in this repository.

Use one of these approaches:

1. Create accounts via register page and update role in database/admin panel
2. Use backend-seeded local accounts in your private environment

Recommended demo role set:

- User account
- Moderator account
- NGO admin account
- Super admin account

You can document your local demo credentials in a private file that is not committed.

## Folder Structure

```text
nirapod-kontho-frontend/
|-- app/
|   |-- (public)/                     # Public pages (home, about, contact, resources, safety)
|   |-- (auth)/                       # Login/register/forgot-password pages
|   |-- (dashboardLayout)/dashboard/  # Role-based dashboard routes
|   |-- globals.css
|   |-- layout.tsx
|
|-- components/
|   |-- shared/                       # Navbar, footer, sidebar, route guards
|   |-- ui/                           # Reusable UI primitives
|
|-- hooks/                            # Shared utility hooks
|-- lib/                              # Utilities, cloudinary helpers, query helpers
|
|-- src/
|   |-- hooks/                        # Domain hooks (auth)
|   |-- modules/                      # Feature modules (auth, report, ngo, payment, etc.)
|   |-- providers/                    # Auth/query/theme providers
|   |-- services/                     # API base client
|   |-- types/                        # Shared frontend types
|
|-- public/                           # Static assets
|-- next.config.ts                    # API rewrite proxy config
|-- package.json
```

## Environment Variables

Create a local .env.local file for frontend runtime values.

```env
# Backend API target for Next.js rewrite
API_PROXY_TARGET=http://localhost:5000/api

# Optional public fallback for client-side usage
NEXT_PUBLIC_API_URL=http://localhost:5000/api

# Cloudinary (for file uploads)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=nirapod-kontho
```

Notes:

- API_PROXY_TARGET is preferred for server-side rewrite behavior
- If both are missing, frontend falls back to http://localhost:5000/api

## Local Development

### Prerequisites

- Node.js 20+
- npm 10+
- Running backend API (nirapod-kontho-backend)

### Install

```bash
npm install
```

### Run development server

```bash
npm run dev
```

Open http://localhost:3000

### Production build

```bash
npm run build
npm run start
```

### Lint

```bash
npm run lint
```

## Deployment Notes

- Recommended host: Vercel
- Ensure frontend and backend domains are both configured in backend CORS and auth trusted origins
- Confirm rewrite target points to your deployed backend API

## Related Services

- Frontend repo: nirapod-kontho-frontend
- Backend repo/service: nirapod-kontho-backend

The backend provides auth, report lifecycle, NGO assignment, notifications, and payments. This frontend consumes those APIs and renders role-based experiences.

## Contribution Guidelines

1. Create a feature branch
2. Keep modules role-aware and type-safe
3. Run lint and build before PR
4. Add/update docs for any route or behavior change

## License

Proprietary/Internal project unless otherwise specified by repository owner.
