# SocratIQ Transform™ - Pure React Application

A complete conversion of the SocratIQ EMME Engage pharmaceutical intelligence platform to a pure React application.

## Features

### Platform Components
- **Transform™**: Document processing and NLP analysis
- **Mesh™**: Knowledge graph construction and visualization  
- **Trace™**: Audit trails and compliance monitoring
- **Sophie™**: AI agent layer with conversational intelligence
- **EMME Engage™**: Pharmaceutical strategic intelligence platform

### EMME Engage Modules
- **Strategic Intelligence**: Market analysis and competitive intelligence
- **Stakeholder Engagement**: HCP, patient, and payer relationship management
- **Content Orchestration**: MLR workflow and content management
- **Equity & Access**: Health equity analysis and access optimization
- **Project Management**: Complete project lifecycle management
- **Document Management**: File upload, processing, and organization

## Technology Stack

- **React 18** with TypeScript
- **React Router** for navigation
- **TanStack Query** for state management
- **Zustand** for client-side data persistence
- **Tailwind CSS** with shadcn/ui components
- **React Dropzone** for file uploads
- **Lucide React** for icons
- **Framer Motion** for animations

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Architecture

### Client-Side Data Management
- **Zustand Store**: Persistent state management with localStorage
- **React Query**: Server state management and caching
- **Local Storage**: Document and project data persistence

### Component Structure
```
src/
├── components/
│   ├── ui/           # Reusable UI components
│   ├── emme/         # EMME-specific components
│   └── ...           # Feature components
├── stores/           # Zustand state stores
├── lib/              # Utility functions
└── types/            # TypeScript type definitions
```

### Key Features
- **Project Management**: Create, manage, and track pharmaceutical projects
- **Document Upload**: Drag-and-drop file upload with processing simulation
- **Real-time Analytics**: Live metrics and performance dashboards
- **Responsive Design**: Mobile-first responsive interface
- **Type Safety**: Full TypeScript support throughout

## Data Persistence

All data is stored client-side using:
- **LocalStorage**: For persistent data between sessions
- **Memory**: For runtime state management
- **Simulated Processing**: Mock NLP and document analysis

## Development

### Adding New Components
1. Create component in appropriate directory
2. Export from index file
3. Add to routing if needed
4. Update store if state is required

### State Management
- Use Zustand store for global state
- React Query for server-like state simulation
- Local component state for UI-only state

### Styling
- Tailwind CSS for utility-first styling
- shadcn/ui for consistent component library
- Custom CSS variables for theming

## Deployment

This is a pure client-side React application that can be deployed to:
- Vercel
- Netlify
- GitHub Pages
- Any static hosting service

Build the application with `npm run build` and deploy the `dist` folder.

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

Proprietary - SocratIQ Transform™ Platform