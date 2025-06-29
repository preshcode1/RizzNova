# RizzGPT - AI Dating Assistant

## Overview

RizzGPT is a modern full-stack web application that provides AI-powered dating and relationship advice. Built with a React frontend and Express backend, it features real-time chat functionality powered by OpenAI's GPT-4o model, user authentication via Replit Auth, and a clean, responsive UI using shadcn/ui components.

## System Architecture

### Technology Stack
- **Frontend**: React 18 with TypeScript, Vite for build tooling
- **Backend**: Express.js with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Replit Auth with OpenID Connect
- **AI Integration**: OpenAI GPT-4o API
- **UI Framework**: shadcn/ui with Tailwind CSS
- **State Management**: TanStack Query for server state
- **Routing**: Wouter for client-side routing

### Architecture Pattern
The application follows a monorepo structure with clear separation between client, server, and shared code:
- **Client**: React SPA served from `/client` directory
- **Server**: Express API server in `/server` directory  
- **Shared**: Common schemas and types in `/shared` directory

## Key Components

### Frontend Architecture
- **Component-based architecture** using React functional components with hooks
- **Atomic design principles** with reusable UI components from shadcn/ui
- **Type-safe API communication** using TanStack Query with custom query functions
- **Mobile-responsive design** with Tailwind CSS breakpoints
- **Client-side routing** with wouter for SPA navigation

### Backend Architecture
- **RESTful API design** with Express.js routes
- **Middleware-based request handling** for authentication, logging, and error handling
- **Type-safe database operations** using Drizzle ORM with PostgreSQL
- **Session management** using PostgreSQL-backed sessions
- **Structured error handling** with consistent API responses

### Database Design
- **Users table**: Stores user profile information with Replit Auth integration
- **Chats table**: Stores conversation history with JSON message arrays
- **Redeem codes table**: Manages promotional codes for premium features
- **Sessions table**: Handles user session persistence (required for Replit Auth)

### Authentication System
- **Replit Auth integration** using OpenID Connect protocol
- **Session-based authentication** with PostgreSQL session storage
- **Automatic user provisioning** on first login
- **Protected API routes** with authentication middleware

## Data Flow

### Chat Conversation Flow
1. User submits message via ChatInput component
2. Frontend sends POST request to `/api/chats/:id/messages`
3. Backend validates user authentication and chat ownership
4. OpenAI API called with conversation context and system prompt
5. AI response generated and stored in database
6. Frontend receives response and updates UI via TanStack Query

### User Authentication Flow
1. User accesses protected route
2. Authentication middleware checks session
3. If unauthenticated, redirects to `/api/login`
4. Replit Auth handles OAuth flow
5. User profile created/updated in database
6. Session established and user redirected to application

### Real-time Updates
- TanStack Query provides optimistic updates and cache management
- Automatic query invalidation on mutations
- Error boundary handling for failed requests

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: Serverless PostgreSQL connection pooling
- **drizzle-orm**: Type-safe SQL query builder and ORM
- **openai**: Official OpenAI API client for GPT-4o integration
- **@tanstack/react-query**: Server state management and caching
- **passport**: Authentication middleware for Express

### UI Dependencies
- **@radix-ui/***: Headless UI primitives for accessibility
- **tailwindcss**: Utility-first CSS framework
- **lucide-react**: Icon library
- **class-variance-authority**: CSS-in-JS utility for component variants

### Development Dependencies
- **vite**: Fast build tool and dev server
- **typescript**: Type safety across the stack
- **tsx**: TypeScript execution for server development

## Deployment Strategy

### Build Process
1. **Frontend build**: Vite compiles React app to static assets in `dist/public`  
2. **Backend build**: esbuild bundles Express server to `dist/index.js`
3. **Database migration**: Drizzle Kit handles schema changes via `db:push`

### Environment Configuration
- **DATABASE_URL**: PostgreSQL connection string (required)
- **OPENAI_API_KEY**: OpenAI API authentication
- **SESSION_SECRET**: Session encryption key
- **REPLIT_DOMAINS**: Allowed domains for OIDC (Replit specific)

### Production Deployment
- Server serves static frontend assets from `dist/public`
- API routes handled by Express server
- Database migrations applied automatically
- Session storage persisted in PostgreSQL

### Development Setup
- Hot module replacement via Vite dev server
- API proxy for development requests
- TypeScript compilation checking
- Environment variable validation

## Troubleshooting

### OpenAI API Issues
If you encounter chat errors with messages like "Failed to send message" or "OpenAI quota exceeded":

1. **Check your OpenAI account billing**: Visit https://platform.openai.com/account/billing
2. **Add credits**: The API requires active billing with available credits
3. **Verify API key**: Ensure your OPENAI_API_KEY is valid and has sufficient quota
4. **Monitor usage**: Check https://platform.openai.com/account/usage for current usage

The application is configured to provide helpful error messages when quota limits are reached.

## Changelog

```
Changelog:
- June 29, 2025. Initial setup and OpenAI integration
- June 29, 2025. Added error handling for OpenAI quota limits
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```