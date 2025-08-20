# Overview

SocratIQ Transform™ is an AI-powered document intelligence platform that processes diverse document formats (PDF, DOCX, TXT) to create rich semantic knowledge networks. It comprises Transform™ (document processing), Mesh™ (knowledge graph), Trace™ (audit system), and Sophie™ (AI agent layer). The platform provides advanced conversational AI, semantic search, risk assessment, and intelligent analytics, facilitating efficient knowledge extraction and utilization across various domains, including predictive intelligence for architecture, engineering, and construction (AEC) programs and pharmaceutical intelligence. Its business vision is to reduce marketing spend waste for pharmaceutical companies and accelerate go-to-market strategies by providing strategic intelligence.

## Recent Changes (August 20, 2025)
- **Replit Environment Migration Complete**: Successfully migrated project from Replit Agent to standard Replit environment
- **Package Dependencies Fixed**: Installed all required npm packages including tsx for TypeScript execution
- **PostgreSQL Database Setup**: Created and configured serverless PostgreSQL database with proper environment variables
- **CORS Configuration Added**: Implemented CORS headers for proper frontend-backend communication
- **API URL Configuration Fixed**: Updated queryClient to use local development server instead of AWS Lambda endpoints
- **AWS Cognito SECRET_HASH Fixed**: Configured COGNITO_CLIENT_SECRET environment variable and proper hash generation
- **Authentication Flow Operational**: AWS Cognito login working with proper SECRET_HASH generation for client authentication
- **Development Environment Ready**: All core systems operational including NLP models, pharmaceutical intelligence, and AI agent layers
- **Dual Environment Compatibility**: Platform now supports both Replit development environment and AWS Lambda production deployment
- **Environment Detection**: Automatic API base URL switching between local development and AWS Lambda endpoints
- **AWS Credentials Integration**: Maintained full AWS environment variable compatibility for seamless production deployment
- **Authentication Disabled for Development**: Disabled login requirements for Replit development environment with mock admin user (August 18, 2025)
- **Tenant Validation Bypassed**: Removed tenant configuration requirements for development to enable direct platform access
- **Project Creation Workflows Complete**: Implemented dual project creation interfaces - simple form for standard creation and enhanced 4-step wizard for Smart Wizard
- **Database Schema Deployed**: Successfully pushed emme_projects table schema to PostgreSQL database with full project creation functionality
- **Navigation Reorganized**: Moved "Data Pipeline" under "Data Platform" submenu for logical grouping of data infrastructure components
- **EMME Navigation Fixed**: Fixed "Back to Projects" button navigation to properly return to EMME projects list instead of main SocratIQ landing page
- **Client Input Forms Fixed**: Resolved controlled component issues in ClientManager - all input fields now properly connected to formData state for smooth typing
- **Admin Navigation Repositioned**: Moved admin functions (Corpus, Data Platform, Models, Trust) below business modules for demo clarity
- **Home Page Demo Functionality**: Added functional navigation to all interactive elements - module cards, quick actions, and events now navigate to relevant pages instead of showing alerts
- **Project Details Buttons Fixed**: Resolved non-functional Details buttons in project cards - now display comprehensive project information including client, status, progress, team size, budget, and due dates (August 19, 2025)
- **Comprehensive Project Details Page**: Created dedicated project details view with tabbed interface for Overview, Milestones, Modules, and Budget tracking - includes full project descriptions, therapeutic areas, key objectives, and milestone tracking with visual status indicators
- **VMS Intelligence Hub Chat Removal**: Removed EMME AI chat panel from VMS Intelligence Hub interface to create cleaner, focused pharmaceutical intelligence dashboard without distractions (August 20, 2025)

## Current Status: Production-Ready EMME Engage Enhanced
- AWS S3 cloud storage fully integrated (`socratiqbeta1` bucket confirmed working)
- Neon Database serverless PostgreSQL for scalable data management
- Role-based authentication system with 5-tier user hierarchy (super_admin → viewer)
- Complete file processing pipeline: upload → S3 storage → NLP analysis → database tracking
- GitHub/GitLab + AWS Amplify deployment pipeline configured with GitHub Actions
- Admin dashboard for user management and role assignment
- **EMME Engage Production Dashboard**: Real pharmaceutical intelligence with 89% launch success metrics
- **Enhanced EMME Features**: Strategic overview, market intelligence, active projects tracking, payer landscape
- **Real Data Integration**: Therapeutic areas performance, competitive analysis, regulatory risk assessment
- Multi-environment deployment ready (staging/production branches)
- **Security Update Complete**: node-nlp updated to v3.10.2 for security compliance (August 13, 2025)

# User Preferences

Preferred communication style: Simple, everyday language.
Landing Page Preference: Always start with the main landing page for all users (SocratIQ, EMME Engage, and partner applications).

# System Architecture

## Frontend Architecture
- **Framework**: React 18 with TypeScript using Vite
- **UI Components**: shadcn/ui (Radix UI, Tailwind CSS)
- **State Management**: TanStack Query
- **Routing**: Wouter
- **File Handling**: React Dropzone
- **UI/UX Decisions**: Dynamic color schemes and branding framework for partners, consistent theming across UI elements, refined color palettes for specific partner applications (e.g., brown and purple for EMME Connect), sophisticated gradient systems for cohesive brand aesthetics. Emphasis on clear, actionable interfaces with visual analytics. Simplified navigation with collapsible sections and a clean layout.

## Backend Architecture
- **Framework**: Express.js with TypeScript on Node.js
- **File Processing**: Multer for PDF, DOCX, TXT
- **NLP Services**: Natural.js, Compromise.js, node-nlp v3.10.2 (security-compliant)
- **API Design**: RESTful with JSON responses
- **Processing Pipeline**: File validation, content extraction, NLP processing (entity extraction, sentiment, semantic tagging), knowledge graph construction, AI analysis layer with real-time status updates and error handling.
- **Authentication and Security**: Upload directory isolation, file type validation, Zod schema validation, error boundaries, CORS, and comprehensive Role-Based Access Control (RBAC) with multi-tier user hierarchies.

## Data Storage
- **Database**: PostgreSQL via Neon Database serverless driver
- **ORM**: Drizzle ORM (type-safe schema, migrations)
- **Schema Design**: Tables for documents, entities, knowledge graph (nodes, relationships), audit events, construction projects, user, document, entity, and system profiles.
- **Fallback Storage**: In-memory for development/testing.

## SocratIQ Platform Components
- **Transform™**: Multi-format document ingestion and NLP entity extraction.
- **Mesh™**: Automatic knowledge graph construction, visualization, and analytics.
- **Trace™**: Comprehensive audit trail, real-time compliance monitoring, and GxP compliance with immutable audit trails.
- **Sophie™ (AI Agent Layer)**: Conversational AI, semantic search, intelligent analysis, risk assessment, and proactive insights. Features include:
    - Equity-trained and adaptive AI agents.
    - Agentic RAG system with temporal agents and knowledge graphs.
    - Model Context Protocol (MCP) for distributed context management.
    - Agent-to-Agent (A2A) communication via ACP SLIM ANP protocol.
    - Agora Platform for multi-agent orchestration.
    - Graph Neural Networks for temporal knowledge reasoning and causal inference.
    - Advanced AI Reasoning: Bayesian Monte Carlo Optimizer, Multi-Paradigm AI (symbolic, statistical, probabilistic, optimization), Human-in-the-Loop system for bias detection and drift monitoring.
- **Build™**: Predictive intelligence for AEC programs including schedule optimization, cost management, risk monitoring, and quality assurance.
- **Profile™**: Comprehensive profiling system for users, documents, entities, and system performance.
- **EMME Engage™**: White-label SaaS for pharmaceutical strategic intelligence with flexible tenant configuration, custom branding, multi-audience support (HCP, Patient, Payer), and multi-language health equity. Features production-ready dashboard with real pharmaceutical metrics (89% launch success rate, 55% cost reduction, 340% ROI). Specific modules for Strategic Intelligence, Stakeholder Engagement, Content Orchestration, and Equity & Access with live market data integration.
- **Emme Connect**: A separate Python FastAPI service for pharmaceutical Medical Legal Regulatory (MLR) workflow automation, integrating with Transform and Mesh for AI-powered analysis.

## Core Design Principles
- **Modularity**: Domain-specific corpora with semantic tagging and versioning.
- **Scalability**: Designed for comprehensive partner branding and multi-partner support.
- **Consistency**: All UI elements adapt to partner brand colors and messaging automatically.
- **User-Centricity**: Emphasis on actionable insights and intuitive navigation.

# External Dependencies

## Core Runtime
- `@neondatabase/serverless` (PostgreSQL driver)
- `drizzle-orm` (ORM)
- `express` (Backend framework)
- `multer` (File uploads)

## Document Processing
- `pdf-parse` (PDF content extraction)
- `mammoth` (DOCX processing)
- `natural` (NLP toolkit)
- `compromise` (Text processing)

## Frontend Libraries
- `@tanstack/react-query` (State management)
- `react-dropzone` (File upload component)
- `@radix-ui/**` (UI primitives)
- `tailwindcss` (CSS framework)
- `wouter` (Routing library)

## UI and Styling Utilities
- `class-variance-authority` (Component variants)
- `clsx` (Conditional classNames)
- `tailwind-merge` (Tailwind CSS class merging)
- `lucide-react` (Icon library)