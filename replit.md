# KAVARA - Telegram Sports Fashion Bot

## Overview

KAVARA is a Telegram-based sports fashion styling service that provides personalized athletic wear recommendations. The application consists of a web interface built for Telegram WebApp integration, where users can either take a personalized quiz to receive custom box recommendations or browse pre-curated ready-made boxes. The system handles the complete purchase flow from selection to order completion with integrated notification systems.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side navigation
- **UI Components**: Radix UI with shadcn/ui design system
- **Styling**: Tailwind CSS with custom design tokens
- **State Management**: TanStack Query for server state, React hooks for local state
- **Build Tool**: Vite with custom configuration for development and production

### Backend Architecture
- **Runtime**: Node.js with Express.js server
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **API Design**: RESTful API with JSON responses
- **Development**: Hot module replacement with Vite middleware integration
- **Storage Layer**: Abstracted storage interface with in-memory fallback for development

### Data Storage Solutions
- **Primary Database**: PostgreSQL via Neon Database
- **ORM**: Drizzle ORM with TypeScript schema definitions
- **Schema Management**: Drizzle Kit for migrations and schema updates
- **Session Storage**: Browser sessionStorage for temporary data persistence
- **Development Storage**: In-memory storage implementation for offline development

### Authentication and Authorization
- **Primary Auth**: Telegram WebApp authentication via initDataUnsafe
- **User Identification**: Telegram user ID as primary identifier
- **Development Mode**: Mock user data for testing without Telegram integration
- **Session Management**: Stateless approach using Telegram's built-in security

### External Dependencies
- **Database**: Neon Database (PostgreSQL-compatible serverless database)
- **Telegram Platform**: Telegram WebApp API for user authentication and native integration
- **UI Framework**: Radix UI primitives for accessible component foundation
- **Payment Processing**: Planned integration (infrastructure ready via order system)
- **Image Hosting**: External image URLs (Unsplash for placeholders)
- **Development Tools**: Replit-specific plugins for development environment integration

### Key Architectural Decisions

**Database Design**: Uses UUID primary keys with foreign key relationships between users, quiz responses, boxes, orders, and notifications. JSON columns store array data for flexible content management.

**API Structure**: RESTful endpoints organized by resource type (users, quiz-responses, boxes, orders, notifications) with proper HTTP status codes and error handling.

**Component Architecture**: Separation of concerns with reusable UI components, custom hooks for business logic, and page-level components for routing.

**Development vs Production**: Dual-mode configuration supporting both local development with mock data and production Telegram WebApp integration.

**State Management**: Server state managed by TanStack Query for caching and synchronization, local state handled by React hooks, temporary data stored in sessionStorage for cross-page persistence.

**Error Handling**: Comprehensive error boundaries with user-friendly error messages and proper HTTP status code handling throughout the application stack.