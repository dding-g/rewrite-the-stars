# System Patterns: rewrite-stars

## System Architecture
- **Frontend:** Next.js App Router (TypeScript, Tailwind CSS, magic-ui, shadcn/ui)
- **Backend:** Next.js API routes, Supabase (PostgreSQL)
- **Authentication:** GitHub SSO (OAuth)
- **Data Sync:** GitHub Octokit API

## Key Technical Decisions
- Use Supabase for managed Postgres and authentication
- Store GitHub tokens as HTTP-only cookies, encrypt sensitive data
- Use absolute imports with path mapping
- Organize code by feature (FSD-inspired)
- Use next-intl for i18n

## Design Patterns
- Feature-based folder structure
- Custom hooks for data fetching and state
- Error boundaries for robust error handling
- Context providers for auth and theme

## Component Relationships
- Dashboard aggregates repository cards
- Tag management interacts with repositories and user data
- Public dashboard is a read-only view of user data 