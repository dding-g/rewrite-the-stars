# Rewrite Stars 🌟

Transform your GitHub starred repositories into a beautiful, organized dashboard with custom tags and public sharing.

## 🚀 Features

- **GitHub Integration**: Seamless OAuth login and repository sync
- **Custom Tags**: Organize repositories with personalized tags and colors
- **Public Dashboards**: Share your curated repository collections
- **Beautiful UI**: Modern, responsive design with dark/light mode
- **Multilingual**: Support for English and Korean
- **Real-time Sync**: Keep your starred repositories up to date

## 🛠 Tech Stack

- **Framework**: Next.js 14 with App Router
- **Database**: Supabase (PostgreSQL)
- **Language**: TypeScript 5
- **Package Manager**: Bun
- **Styling**: Tailwind CSS 4.0, Magic UI, shadcn/ui
- **Authentication**: NextAuth.js with GitHub OAuth
- **Internationalization**: next-intl 4.0

## 📁 Project Structure

```
src/
├── app/                     # Next.js App Router
│   ├── [locale]/           # Internationalization routes
│   └── api/                # API endpoints
├── entities/               # Database entity types
├── features/               # Feature-specific components
├── shared/                 # Shared utilities and components
└── middleware.ts           # Next.js middleware
```

## ⚡ Quick Start

### 1. Clone and Install

```bash
git clone https://github.com/your-username/rewrite-the-star2.git
cd rewrite-the-star2
bun install
```

### 2. Database Setup

1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Copy the SQL from `database-schema.sql` and execute it in your Supabase SQL Editor
3. This will create all necessary tables, indexes, RLS policies, and views

### 3. Environment Variables

Create a `.env.local` file in the root directory:

```bash
# GitHub OAuth Configuration
GITHUB_CLIENT_ID=your_github_client_id_here
GITHUB_CLIENT_SECRET=your_github_client_secret_here
GITHUB_CALLBACK_URL=http://localhost:3000/api/auth/github/callback

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here

# NextAuth Configuration
NEXTAUTH_SECRET=your_nextauth_secret_here
NEXTAUTH_URL=http://localhost:3000

# Encryption for sensitive data
ENCRYPTION_KEY=your_32_character_encryption_key_here

# App Configuration
NEXT_PUBLIC_APP_NAME="Rewrite Stars"
NEXT_PUBLIC_APP_DESCRIPTION="Transform your GitHub starred repositories into a beautiful, organized dashboard"
```

### 4. GitHub OAuth Setup

1. Go to GitHub Settings > Developer settings > OAuth Apps
2. Create a new OAuth App with:
   - **Application name**: Rewrite Stars
   - **Homepage URL**: `http://localhost:3000`
   - **Authorization callback URL**: `http://localhost:3000/api/auth/github/callback`
3. Copy the Client ID and Client Secret to your `.env.local`

### 5. Run Development Server

```bash
bun dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📊 Database Schema

The application uses the following main tables:

- **users**: GitHub user information
- **repositories**: GitHub repository data
- **user_starred_repos**: User-repository relationships
- **tags**: Custom user-defined tags
- **repository_tags**: Repository-tag relationships

## 🎨 UI Components

This project uses a combination of:

- **Magic UI**: Beautiful animated components
- **shadcn/ui**: Accessible component library
- **Tailwind CSS**: Utility-first CSS framework
- **Radix UI**: Primitive components

## 🌍 Internationalization

The app supports multiple languages using next-intl:

- English (`/en`)
- Korean (`/ko`)

Translation files are located in the `messages/` directory.

## 🔒 Security Features

- **Row Level Security (RLS)**: Database-level access control
- **Encrypted Tokens**: GitHub access tokens are encrypted
- **HTTP-only Cookies**: Secure session management
- **CORS Protection**: API endpoint security

## 📱 API Endpoints

### Authentication
- `POST /api/auth/github` - GitHub OAuth
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Current user info

### Repositories
- `GET /api/repositories` - User's starred repositories
- `POST /api/repositories/sync` - Sync with GitHub
- `GET /api/repositories/public/[username]` - Public dashboard

### Tags
- `GET /api/tags` - User's tags
- `POST /api/tags` - Create tag
- `PUT /api/tags/[id]` - Update tag
- `DELETE /api/tags/[id]` - Delete tag
- `POST /api/tags/assign` - Assign tag to repository

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically on push

### Environment Variables for Production

Update your environment variables for production:

```bash
GITHUB_CALLBACK_URL=https://your-domain.com/api/auth/github/callback
NEXTAUTH_URL=https://your-domain.com
```

## 📝 Development

### Available Scripts

```bash
bun dev          # Start development server
bun build        # Build for production
bun start        # Start production server
bun lint         # Run Biome linter
bun type-check   # TypeScript type checking
```

### Code Standards

- **TypeScript**: Strict mode enabled
- **Biome**: For linting and formatting
- **Absolute Imports**: Using path mapping
- **Type-first**: Prefer `type` over `interface`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- GitHub API for repository data
- Supabase for database and authentication
- Vercel for hosting
- Next.js team for the amazing framework