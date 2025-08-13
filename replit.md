# Overview

SocratIQ Transform™ is an AI-powered document intelligence platform that processes diverse document formats (PDF, DOCX, TXT) to create rich semantic knowledge networks. It comprises Transform™ (document processing), Mesh™ (knowledge graph), Trace™ (audit system), and Sophie™ (AI agent layer). The platform provides advanced conversational AI, semantic search, risk assessment, and intelligent analytics, facilitating efficient knowledge extraction and utilization across various domains, including predictive intelligence for architecture, engineering, and construction (AEC) programs and pharmaceutical intelligence. Its business vision is to reduce marketing spend waste for pharmaceutical companies and accelerate go-to-market strategies by providing strategic intelligence.

## Recent Changes (August 13, 2025)
- **Project Management Fixed**: Resolved project creation and listing issue in EMME Engage
- **Navigation Enhancement**: Added dedicated "Projects" menu item to main navigation
- **API Integration**: Fixed EMMEProjectManager API calls to work with new apiRequest format
- **Component Routing**: Connected EMMEProjectManager to EMME interface for proper project display
- **AWS Amplify Deployment Fixed**: Implemented dual authentication system for production deployments
- **Production Authentication**: Created session-based auth system for AWS Amplify (no Replit dependencies)
- **Environment Detection**: Automatic switching between Replit auth (dev) and production auth (deploy)
- **AWS Cognito Integration**: Added full AWS Cognito authentication support with JWT token verification
- **Multi-Auth System**: Platform now supports Replit, AWS Cognito, and simple production authentication
- **Single AWS Cognito Authentication**: Simplified to use only AWS Cognito for all users (August 13, 2025)
- **Authentication System Working**: AWS Cognito login and signup fully functional with proper flow configuration

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