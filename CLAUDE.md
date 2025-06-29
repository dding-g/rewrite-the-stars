# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**rewrite-stars** is a GitHub starred repositories dashboard application that transforms starred repos into a visually appealing, organized interface. Users can authenticate via GitHub SSO, sync their starred repositories, add custom tags, filter/search, and share public dashboards.

## Technology Stack

- **Frontend**: Next.js (App Router), TypeScript, Tailwind CSS, magic-ui, shadcn/ui, Radix UI
- **Backend**: Next.js API routes, Supabase (PostgreSQL) 
- **APIs**: GitHub Octokit, ky
- **Internationalization**: next-intl 4.0
- **Development**: Bun (package manager), Biome (linting), TypeScript
- **Deployment**: Vercel

## Development Commands

Since this is a Next.js project that uses pnpm as the package manager, common commands are:

```bash
# Install dependencies
pnpm install

# Development server
pnpm dev

# Build for production
pnpm build

# Linting (Biome)
pnpm lint

# Type checking
pnpm type-check
```

## Architecture

The project follows a feature-based folder structure inspired by FSD (Feature-Sliced Design):

- **Authentication**: GitHub SSO with HTTP-only cookies for tokens
- **Data Management**: Supabase for PostgreSQL database and user management
- **State Management**: React Context and custom hooks
- **Internationalization**: Supports English and Korean via next-intl
- **Security**: Encrypted sensitive data, secure token storage

## Key Features

1. **GitHub Integration**: Sync starred repositories using GitHub API
2. **Tag Management**: Custom tags for organizing repositories
3. **Search & Filter**: Filter repositories by tags and keywords
4. **Public Dashboards**: Shareable read-only views of curated repositories
5. **Responsive Design**: Mobile-first, dark/light mode support

## Development Guidelines

- Use absolute imports with path mapping
- Follow TypeScript best practices with strict typing
- Implement error boundaries for robust error handling
- Use Context providers for auth and theme state
- Follow mobile-first responsive design principles
- Support both English and Korean languages

## Constraints

- GitHub API rate limits
- Supabase free tier limitations
- Must maintain responsive design across all devices
- Internationalization requirements for English/Korean

## Current Status

Project is in initialization phase with memory bank documentation completed. Next steps include project scaffolding, Next.js/Supabase setup, and core feature implementation.