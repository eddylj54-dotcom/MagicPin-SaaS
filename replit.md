# MagicPin Automation - Social Media Management Platform

## Overview

MagicPin Automation is a comprehensive SaaS platform that enables users to automate social media content creation, scheduling, and publishing across multiple platforms (Instagram, Facebook, X/Twitter, Pinterest, LinkedIn, YouTube, TikTok, and Etsy). The application leverages Google's Gemini AI to generate platform-optimized content with captions, hashtags, and calls-to-action. Users can manage multiple social accounts, schedule posts via a unified calendar, track analytics, use templates, and automate recurring content publishing.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Technology Stack:**
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized production builds
- **UI Components**: Radix UI primitives with shadcn/ui component system
- **Styling**: Tailwind CSS with custom design tokens following the "New York" style preset
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query (React Query) for server state
- **Forms**: React Hook Form with Zod resolvers for validation

**Design System:**
- Modern SaaS dashboard pattern inspired by Linear, Notion, and Asana
- Inter font family from Google Fonts for all typography
- Dual theme support (light/dark mode) with CSS variables
- Responsive layouts using Tailwind's grid and flexbox utilities
- Fixed sidebar navigation (w-64) with main content area (max-w-7xl)

**Page Structure:**
- Landing page for unauthenticated users
- Dashboard with overview metrics and quick actions
- Connected Accounts management
- AI Content Generator with multi-platform support
- Content Calendar for scheduling and viewing posts
- Analytics dashboard with charts and metrics
- Templates library for reusable content
- Settings for user preferences and account management

### Backend Architecture

**Technology Stack:**
- **Runtime**: Node.js with Express server
- **Language**: TypeScript with ES modules
- **Database ORM**: Drizzle ORM for type-safe database operations
- **Session Management**: express-session with PostgreSQL store (connect-pg-simple)
- **AI Integration**: Google Gemini AI SDK (@google/genai) for content generation

**API Design Pattern:**
- RESTful API endpoints under `/api` prefix
- Authentication-protected routes using middleware
- JSON request/response format
- Credential-based sessions with secure cookies
- Error handling with appropriate HTTP status codes

**Authentication Flow:**
- OAuth2 via Replit Auth (OpenID Connect)
- Session-based authentication with PostgreSQL-backed session store
- Passport.js strategy for OIDC integration
- Protected routes requiring authentication middleware
- Automatic token refresh handling

**Content Generation Logic:**
- Platform-specific content prompts tailored to each social network's character limits and best practices
- Tone customization (professional, casual, enthusiastic, educational, promotional, inspirational)
- Hashtag generation appropriate to each platform's conventions
- Multi-platform batch generation support

### Data Storage Solutions

**Database**: PostgreSQL via Neon serverless driver
- **ORM**: Drizzle with schema-first approach
- **Connection**: WebSocket-based connection pooling for serverless compatibility
- **Migrations**: Managed via drizzle-kit with schema definitions in `shared/schema.ts`

**Schema Architecture:**

1. **sessions** - Express session storage (required for authentication)
   - Session ID, session data (JSONB), expiration timestamp

2. **users** - User accounts
   - ID, email, name, profile image, timestamps
   - Created via upsert on first login

3. **connectedAccounts** - Social media account connections
   - User reference, platform identifier, account details
   - OAuth tokens (encrypted), connection status, follower counts
   - Supports multiple accounts per platform per user

4. **posts** - Content posts across all platforms
   - User reference, content, media URLs, platform targets
   - Status (draft, scheduled, published, failed)
   - Scheduling timestamps, publication tracking

5. **templates** - Reusable content templates
   - User reference (nullable for system templates)
   - Category, title, content, usage counter
   - Platform targeting metadata

6. **analytics** - Performance metrics
   - Post reference, engagement data (likes, shares, comments)
   - Reach, impressions, click-through rates
   - Timestamp for historical tracking

**Data Relations:**
- Users → Connected Accounts (one-to-many)
- Users → Posts (one-to-many)
- Users → Templates (one-to-many)
- Posts → Analytics (one-to-one)

### External Dependencies

**Authentication Service:**
- **Replit Auth**: OpenID Connect provider for user authentication
- Environment variables: `ISSUER_URL`, `REPL_ID`, `SESSION_SECRET`

**AI Service:**
- **Google Gemini AI**: Content generation for social media posts
- API Key: `GEMINI_API_KEY` environment variable
- Used for platform-specific caption, hashtag, and CTA generation

**Database Service:**
- **Neon PostgreSQL**: Serverless PostgreSQL database
- Connection string: `DATABASE_URL` environment variable
- WebSocket support for serverless environments

**Social Media APIs** (Planned Integration):
- Instagram Graph API - for posts, stories, and metrics
- Facebook for Developers API - for page management and publishing
- X (Twitter) API v2 - for tweets and engagement data
- Pinterest API v5 - for pin creation and board management
- TikTok for Developers API - for video publishing (requires business approval)
- LinkedIn API - for professional content sharing
- YouTube Data API v3 - for video uploads and descriptions
- Etsy API - for product listings and Pinterest integration

**Development Tools:**
- Replit-specific plugins for development banners and error overlays (dev environment only)
- Cartographer for code navigation (Replit environment)

**UI Libraries:**
- React Icons (simple-icons) for social platform logos
- Lucide React for general iconography
- Recharts for analytics visualization (bar charts, line charts)
- date-fns for date formatting and manipulation
- Vaul for mobile-friendly drawers

**Design Tokens:**
- Custom color system using HSL with alpha channel support
- Semantic color naming (primary, secondary, destructive, muted, accent)
- Separate colors for card, popover, and sidebar components
- Border color calculations using CSS custom properties