# Overview

SocratIQ Transform™ is an AI-powered document intelligence platform designed to process diverse document formats (PDF, DOCX, TXT) and create rich semantic knowledge networks. The platform comprises Transform™ (document processing), Mesh™ (knowledge graph), Trace™ (audit system), and Sophie™ (AI agent layer). It offers advanced conversational AI, semantic search, risk assessment, and intelligent analytics, facilitating efficient knowledge extraction and utilization across various domains. The business vision is to reduce marketing spend waste for pharmaceutical companies and accelerate go-to-market strategies by providing strategic intelligence, including predictive intelligence for architecture, engineering, and construction (AEC) programs and pharmaceutical intelligence.

## Recent Changes (August 2025)

**Complete Project Management System**: Successfully built comprehensive pharmaceutical intelligence platform with:
- **Project Creation**: Multi-stage project setup wizard with client details, therapeutic areas, and team assignments
- **Project Management**: Full CRUD operations with "Continue Work" and "Edit Project" functionality
- **Navigation System**: Left sidebar navigation with Project Insights, Framework, Client Content sections
- **Data Persistence**: localStorage fallback system ensuring all project data persists across sessions
- **UI Consistency**: Purple/red color scheme maintained throughout with professional pharmaceutical theming
- **Session Management**: Smart navigation tracking remembers user's last visited section per project
- **Responsive Interface**: Clean, single-purpose interfaces optimized for pharmaceutical workflows

**Framework Background Accordion System (August 22, 2025)**:
- **Interactive Accordion Menu**: Implemented collapsible accordion system for Framework Background section
- **Pharmaceutical Categories**: Six key sections - Mission/Vision, Unmet Need, Tolerability, Patient Population, Positioning, Access & Affordability
- **Collapsible Behavior**: Only selected section expands while others automatically collapse for clean interface
- **Dynamic Content**: Each section displays comprehensive pharmaceutical intelligence and market data
- **Visual Design**: Professional styling with dropdown arrows, active states, and smooth transitions
- **Enhanced Mission/Vision Content**: Added comprehensive organizational commitments, strategic initiatives, DEI goals, equitable pricing strategies, and environmental health considerations from user-provided pharmaceutical intelligence documents
- **Interactive Data Entry Forms**: Converted Mission/Vision section to 15 editable form fields for complete pharmaceutical intelligence customization
- **EMME Chat Integration**: Added interactive chat interface within Framework sections for real-time pharmaceutical intelligence assistance with suggested questions and contextual responses

**Collapsible Navigation System (August 22, 2025)**:
- **Dual Sidebar Optimization**: Implemented smart collapsible behavior for both EMME Engage main navigation and SocratIQ project navigation
- **Hover Expansion**: Both sidebars start collapsed at 16px width, expand on hover to show full labels
- **Pin/Unpin Functionality**: Users can pin sidebars open when needed with toggle button
- **Space Maximization**: Reclaims 400+ pixels of screen width for pharmaceutical content display
- **Smooth Animations**: 300ms transitions for professional user experience

**Complete Client Content Management System (August 22, 2025)**:
- **File Upload Interface**: Full drag-and-drop functionality supporting .pdf, .doc, .docx, .txt, .jpg, .jpeg, .png, .mp4, .mov formats
- **Web Link Integration**: URL input system for adding web-based content with Add/Cancel controls
- **File Management Table**: Professional grid layout displaying file name, upload date, uploader, and file size with checkboxes and delete functionality
- **Two-Tab Architecture**: "Upload documents" for file management and "Ask emme" for AI assistance
- **Visual File Types**: Emoji-based file type indicators (📄 PDF, 🖼️ Image, 🎥 Video, 🌐 Web, 📁 Default)
- **Real-time Feedback**: Toast notifications for all file operations (upload, add web content, remove files)
- **EMME Chat Integration**: Dedicated tab with lowercase "e" branding and blue-purple gradient styling for pharmaceutical intelligence assistance
- **State Management**: Proper React hooks implementation with TypeScript support for production reliability

# User Preferences

Preferred communication style: Simple, everyday language.
Landing Page Preference: Always start with the main landing page for all users (SocratIQ, EMME Engage, and partner applications).
Interface Preferences: Clean, single-purpose interfaces without duplicate navigation elements or redundant buttons.

# System Architecture

## Frontend Architecture
- **Framework**: React 18 with TypeScript using Vite
- **UI Components**: shadcn/ui (Radix UI, Tailwind CSS)
- **State Management**: TanStack Query
- **Routing**: Wouter
- **File Handling**: React Dropzone
- **UI/UX Decisions**: Dynamic color schemes and branding framework for partners, consistent theming across UI elements, refined color palettes for specific partner applications, sophisticated gradient systems for cohesive brand aesthetics. Emphasis on clear, actionable interfaces with visual analytics and simplified navigation.

## Backend Architecture
- **Framework**: Express.js with TypeScript on Node.js
- **File Processing**: Multer for PDF, DOCX, TXT
- **NLP Services**: Natural.js, Compromise.js, node-nlp
- **API Design**: RESTful with JSON responses
- **Processing Pipeline**: File validation, content extraction, NLP processing (entity extraction, sentiment, semantic tagging), knowledge graph construction, AI analysis layer with real-time status updates and error handling.
- **Authentication and Security**: Upload directory isolation, file type validation, Zod schema validation, error boundaries, CORS, and comprehensive Role-Based Access Control (RBAC) with multi-tier user hierarchies.

## Data Storage
- **Database**: PostgreSQL via Neon Database serverless driver
- **ORM**: Drizzle ORM (type-safe schema, migrations)
- **Schema Design**: Tables for documents, entities, knowledge graph (nodes, relationships), audit events, construction projects, user, document, entity, and system profiles.

## SocratIQ Platform Components
- **Transform™**: Multi-format document ingestion and NLP entity extraction.
- **Mesh™**: Automatic knowledge graph construction, visualization, and analytics.
- **Trace™**: Comprehensive audit trail and compliance monitoring (GxP).
- **Sophie™ (AI Agent Layer)**: Conversational AI, semantic search, intelligent analysis, risk assessment, and proactive insights. Features include equity-trained and adaptive AI agents, Agentic RAG system with temporal agents, Model Context Protocol (MCP), Agent-to-Agent (A2A) communication, Agora Platform for multi-agent orchestration, Graph Neural Networks for temporal knowledge reasoning, and advanced AI Reasoning (Bayesian Monte Carlo Optimizer, Multi-Paradigm AI, Human-in-the-Loop system).
- **Build™**: Predictive intelligence for AEC programs including schedule optimization, cost management, risk monitoring, and quality assurance.
- **Profile™**: Comprehensive profiling system for users, documents, entities, and system performance.
- **EMME Engage™**: White-label SaaS for pharmaceutical strategic intelligence with flexible tenant configuration, custom branding, multi-audience support (HCP, Patient, Payer), and multi-language health equity. Includes modules for Strategic Intelligence, Stakeholder Engagement, Content Orchestration, and Equity & Access with live market data integration.
- **Emme Connect**: A separate Python FastAPI service for pharmaceutical Medical Legal Regulatory (MLR) workflow automation.

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
```