import { Switch, Route } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import React from "react";
import { useState } from "react";

// Create queryClient directly here to avoid import issues
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 3,
    },
    mutations: {
      retry: false,
    },
  },
});

// Import all major platform components - use direct imports
import { SocratIQPlatform } from "@/components/SocratIQPlatform";
import { EMMEEngageApp } from "@/components/EMMEEngageApp";
import { EMMELayout } from "@/components/emme/EMMELayout";
import { EMMEHome } from "@/components/emme/EMMEHome";

// Conditional imports for components that exist
let ClientManager, ProjectManager, ProjectDetails;
let ContentOrchestrationModule, StrategicIntelligenceModule, StakeholderEngagementModule, EquityAccessModule;
let SophieDashboard, SophieIntelligenceDashboard, SophieChat;
let CorpusManager, PipelineManager, ProcessingQueue, Analytics, TraceManager;
let BuildDashboard, FedScoutDashboard, BlockchainDashboard;
let NotFound, Landing, Home, Dashboard;

try {
  ClientManager = require("@/components/emme/ClientManager").ClientManager;
  ProjectManager = require("@/components/emme/ProjectManager").ProjectManager;
  ProjectDetails = require("@/components/ProjectDetails").ProjectDetails;
} catch {
  // Fallback components
  ClientManager = () => <div className="p-6"><h1 className="text-2xl font-bold">Client Manager</h1></div>;
  ProjectManager = () => <div className="p-6"><h1 className="text-2xl font-bold">Project Manager</h1></div>;
  ProjectDetails = () => <div className="p-6"><h1 className="text-2xl font-bold">Project Details</h1></div>;
}

try {
  ContentOrchestrationModule = require("@/components/emme/ContentOrchestrationModule").ContentOrchestrationModule;
  StrategicIntelligenceModule = require("@/components/emme/StrategicIntelligenceModule").StrategicIntelligenceModule;
  StakeholderEngagementModule = require("@/components/emme/StakeholderEngagementModule").StakeholderEngagementModule;
  EquityAccessModule = require("@/components/emme/EquityAccessModule").EquityAccessModule;
} catch {
  ContentOrchestrationModule = () => <div className="p-6"><h1 className="text-2xl font-bold">Content Orchestration</h1></div>;
  StrategicIntelligenceModule = () => <div className="p-6"><h1 className="text-2xl font-bold">Strategic Intelligence</h1></div>;
  StakeholderEngagementModule = () => <div className="p-6"><h1 className="text-2xl font-bold">Stakeholder Engagement</h1></div>;
  EquityAccessModule = () => <div className="p-6"><h1 className="text-2xl font-bold">Equity Access</h1></div>;
}

try {
  SophieDashboard = require("@/components/SophieDashboard").SophieDashboard;
  SophieIntelligenceDashboard = require("@/components/SophieIntelligenceDashboard").SophieIntelligenceDashboard;
  SophieChat = require("@/components/SophieChat").SophieChat;
} catch {
  SophieDashboard = () => <div className="p-6"><h1 className="text-2xl font-bold">Sophie Dashboard</h1></div>;
  SophieIntelligenceDashboard = () => <div className="p-6"><h1 className="text-2xl font-bold">Sophie Intelligence</h1></div>;
  SophieChat = () => <div className="p-6"><h1 className="text-2xl font-bold">Sophie Chat</h1></div>;
}

try {
  CorpusManager = require("@/components/CorpusManager").CorpusManager;
  PipelineManager = require("@/components/PipelineManager").PipelineManager;
  ProcessingQueue = require("@/components/ProcessingQueue").default;
  Analytics = require("@/components/Analytics").default;
  TraceManager = require("@/components/TraceManager").TraceManager;
} catch {
  CorpusManager = () => <div className="p-6"><h1 className="text-2xl font-bold">Corpus Manager</h1></div>;
  PipelineManager = () => <div className="p-6"><h1 className="text-2xl font-bold">Pipeline Manager</h1></div>;
  ProcessingQueue = () => <div className="p-6"><h1 className="text-2xl font-bold">Processing Queue</h1></div>;
  Analytics = () => <div className="p-6"><h1 className="text-2xl font-bold">Analytics</h1></div>;
  TraceManager = () => <div className="p-6"><h1 className="text-2xl font-bold">Trace Manager</h1></div>;
}

try {
  BuildDashboard = require("@/components/BuildDashboard").BuildDashboard;
  FedScoutDashboard = require("@/components/FedScoutDashboard").FedScoutDashboard;
  BlockchainDashboard = require("@/components/BlockchainDashboard").BlockchainDashboard;
} catch {
  BuildDashboard = () => <div className="p-6"><h1 className="text-2xl font-bold">Build Dashboard</h1></div>;
  FedScoutDashboard = () => <div className="p-6"><h1 className="text-2xl font-bold">FedScout Dashboard</h1></div>;
  BlockchainDashboard = () => <div className="p-6"><h1 className="text-2xl font-bold">Blockchain Dashboard</h1></div>;
}

try {
  NotFound = require("@/pages/not-found").default;
  Landing = require("@/pages/Landing").default;
  Home = require("@/pages/Home").default;
  Dashboard = require("@/pages/dashboard").default;
} catch {
  NotFound = () => <div className="p-6"><h1 className="text-2xl font-bold">404 - Page Not Found</h1></div>;
  Landing = () => <div className="p-6"><h1 className="text-2xl font-bold">Landing Page</h1></div>;
  Home = () => <div className="p-6"><h1 className="text-2xl font-bold">Home Page</h1></div>;
  Dashboard = () => <div className="p-6"><h1 className="text-2xl font-bold">Dashboard</h1></div>;
}

// Import tenant provider for multi-tenant support
import { TenantProvider } from "@/components/TenantProvider";

// Error Boundary Component
class ErrorBoundary extends React.Component<
  { children: React.ReactNode; componentName: string },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: React.ReactNode; componentName: string }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error(`Error in ${this.props.componentName}:`, error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 bg-red-50 border border-red-200 rounded">
          <h3 className="text-red-800 font-semibold">Error in {this.props.componentName}</h3>
          <p className="text-red-600 text-sm">{this.state.error?.message}</p>
          <button 
            onClick={() => this.setState({ hasError: false })}
            className="mt-2 px-4 py-2 bg-red-600 text-white rounded text-sm"
          >
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

// Loading component
const LoadingSpinner = () => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
  </div>
);

// Safe wrapper for components that might not exist
const SafeComponent = ({ children, fallback, componentName }: { 
  children: React.ReactNode; 
  fallback?: React.ReactNode;
  componentName: string;
}) => {
  try {
    return <>{children}</>;
  } catch (error) {
    console.error(`Failed to render ${componentName}:`, error);
    return fallback || (
      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded">
        <h3 className="text-yellow-800 font-semibold">Component temporarily unavailable</h3>
        <p className="text-yellow-600 text-sm">{componentName} is being loaded...</p>
      </div>
    );
  }
};

// Container component to handle EMME Engage app navigation state
function EMMEEngageAppContainer() {
  const [currentView, setCurrentView] = useState("home");
  
  const handleViewChange = (viewId: string) => {
    console.log(`Navigation clicked: ${viewId}`);
    setCurrentView(viewId);
  };
  
  const renderCurrentView = () => {
    switch(currentView) {
      case "home":
        return (
          <SafeComponent componentName="EMMEHome">
            <ErrorBoundary componentName="EMMEHome">
              <EMMEHome />
            </ErrorBoundary>
          </SafeComponent>
        );
      case "clients":
        return (
          <SafeComponent componentName="ClientManager">
            <ErrorBoundary componentName="ClientManager">
              <ClientManager />
            </ErrorBoundary>
          </SafeComponent>
        );
      case "projects":
        return (
          <SafeComponent componentName="ProjectManager">
            <ErrorBoundary componentName="ProjectManager">
              <ProjectManager mode="list" />
            </ErrorBoundary>
          </SafeComponent>
        );
      case "create-project":
        return (
          <SafeComponent componentName="ProjectManager-Create">
            <ErrorBoundary componentName="ProjectManager-Create">
              <ProjectManager mode="create" />
            </ErrorBoundary>
          </SafeComponent>
        );
      case "smart-wizard":
        return <div className="p-6"><h1 className="text-2xl font-bold">Smart Wizard</h1><p>Advanced project creation wizard with AI guidance.</p></div>;
      case "strategic-intelligence":
        return (
          <SafeComponent componentName="StrategicIntelligenceModule">
            <ErrorBoundary componentName="StrategicIntelligenceModule">
              <StrategicIntelligenceModule />
            </ErrorBoundary>
          </SafeComponent>
        );
      case "stakeholder-engagement":
        return (
          <SafeComponent componentName="StakeholderEngagementModule">
            <ErrorBoundary componentName="StakeholderEngagementModule">
              <StakeholderEngagementModule />
            </ErrorBoundary>
          </SafeComponent>
        );
      case "content-orchestration":
        return (
          <SafeComponent componentName="ContentOrchestrationModule">
            <ErrorBoundary componentName="ContentOrchestrationModule">
              <ContentOrchestrationModule />
            </ErrorBoundary>
          </SafeComponent>
        );
      case "equity-access":
        return (
          <SafeComponent componentName="EquityAccessModule">
            <ErrorBoundary componentName="EquityAccessModule">
              <EquityAccessModule />
            </ErrorBoundary>
          </SafeComponent>
        );
      case "corpus":
        return (
          <SafeComponent componentName="CorpusManager">
            <ErrorBoundary componentName="CorpusManager">
              <CorpusManager />
            </ErrorBoundary>
          </SafeComponent>
        );
      case "data-pipeline":
        return (
          <SafeComponent componentName="PipelineManager">
            <ErrorBoundary componentName="PipelineManager">
              <PipelineManager />
            </ErrorBoundary>
          </SafeComponent>
        );
      case "data-ingestion":
        return (
          <SafeComponent componentName="ProcessingQueue">
            <ErrorBoundary componentName="ProcessingQueue">
              <ProcessingQueue />
            </ErrorBoundary>
          </SafeComponent>
        );
      case "api-management":
        return (
          <SafeComponent componentName="Analytics">
            <ErrorBoundary componentName="Analytics">
              <Analytics />
            </ErrorBoundary>
          </SafeComponent>
        );
      case "trace":
        return (
          <SafeComponent componentName="TraceManager">
            <ErrorBoundary componentName="TraceManager">
              <TraceManager />
            </ErrorBoundary>
          </SafeComponent>
        );
      case "sophie":
        return (
          <SafeComponent componentName="SophieDashboard">
            <ErrorBoundary componentName="SophieDashboard">
              <SophieDashboard />
            </ErrorBoundary>
          </SafeComponent>
        );
      case "sophie-intelligence":
        return (
          <SafeComponent componentName="SophieIntelligenceDashboard">
            <ErrorBoundary componentName="SophieIntelligenceDashboard">
              <SophieIntelligenceDashboard />
            </ErrorBoundary>
          </SafeComponent>
        );
      case "sophie-chat":
        return (
          <SafeComponent componentName="SophieChat">
            <ErrorBoundary componentName="SophieChat">
              <SophieChat />
            </ErrorBoundary>
          </SafeComponent>
        );
      case "build":
        return (
          <SafeComponent componentName="BuildDashboard">
            <ErrorBoundary componentName="BuildDashboard">
              <BuildDashboard />
            </ErrorBoundary>
          </SafeComponent>
        );
      case "fedscout":
        return (
          <SafeComponent componentName="FedScoutDashboard">
            <ErrorBoundary componentName="FedScoutDashboard">
              <FedScoutDashboard />
            </ErrorBoundary>
          </SafeComponent>
        );
      case "blockchain":
        return (
          <SafeComponent componentName="BlockchainDashboard">
            <ErrorBoundary componentName="BlockchainDashboard">
              <BlockchainDashboard />
            </ErrorBoundary>
          </SafeComponent>
        );
      default:
        return (
          <SafeComponent componentName="EMMEHome-Default">
            <ErrorBoundary componentName="EMMEHome-Default">
              <EMMEHome />
            </ErrorBoundary>
          </SafeComponent>
        );
    }
  };
  
  return (
    <SafeComponent componentName="EMMELayout">
      <ErrorBoundary componentName="EMMELayout">
        <EMMELayout activeView={currentView} onViewChange={handleViewChange}>
          {renderCurrentView()}
        </EMMELayout>
      </ErrorBoundary>
    </SafeComponent>
  );
}

function Router() {
  const { isLoading } = useAuth();
  
  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <Switch>
      <Route path="/" component={() => (
        <SafeComponent componentName="SocratIQPlatform">
          <ErrorBoundary componentName="SocratIQPlatform">
            <SocratIQPlatform />
          </ErrorBoundary>
        </SafeComponent>
      )} />
      <Route path="/landing" component={() => (
        <SafeComponent componentName="Landing">
          <ErrorBoundary componentName="Landing">
            <Landing />
          </ErrorBoundary>
        </SafeComponent>
      )} />
      <Route path="/home" component={() => (
        <SafeComponent componentName="Home">
          <ErrorBoundary componentName="Home">
            <Home />
          </ErrorBoundary>
        </SafeComponent>
      )} />
      <Route path="/dashboard" component={() => (
        <SafeComponent componentName="Dashboard">
          <ErrorBoundary componentName="Dashboard">
            <Dashboard />
          </ErrorBoundary>
        </SafeComponent>
      )} />
      <Route path="/emme-engage" component={() => (
        <SafeComponent componentName="EMMEEngageApp">
          <ErrorBoundary componentName="EMMEEngageApp">
            <EMMEEngageApp />
          </ErrorBoundary>
        </SafeComponent>
      )} />
      <Route path="/emme-engage/app" component={EMMEEngageAppContainer} />
      <Route path="/emme-engage/projects/:id">
        {(params) => (
          <SafeComponent componentName="ProjectDetails">
            <ErrorBoundary componentName="ProjectDetails">
              <ProjectDetails projectId={params.id} onBack={() => window.history.back()} />
            </ErrorBoundary>
          </SafeComponent>
        )}
      </Route>
      <Route path="/sophie" component={() => (
        <SafeComponent componentName="SophieDashboard-Route">
          <ErrorBoundary componentName="SophieDashboard-Route">
            <SophieDashboard />
          </ErrorBoundary>
        </SafeComponent>
      )} />
      <Route path="/sophie/intelligence" component={() => (
        <SafeComponent componentName="SophieIntelligenceDashboard-Route">
          <ErrorBoundary componentName="SophieIntelligenceDashboard-Route">
            <SophieIntelligenceDashboard />
          </ErrorBoundary>
        </SafeComponent>
      )} />
      <Route path="/sophie/chat" component={() => (
        <SafeComponent componentName="SophieChat-Route">
          <ErrorBoundary componentName="SophieChat-Route">
            <SophieChat />
          </ErrorBoundary>
        </SafeComponent>
      )} />
      <Route path="/corpus" component={() => (
        <SafeComponent componentName="CorpusManager-Route">
          <ErrorBoundary componentName="CorpusManager-Route">
            <CorpusManager />
          </ErrorBoundary>
        </SafeComponent>
      )} />
      <Route path="/pipeline" component={() => (
        <SafeComponent componentName="PipelineManager-Route">
          <ErrorBoundary componentName="PipelineManager-Route">
            <PipelineManager />
          </ErrorBoundary>
        </SafeComponent>
      )} />
      <Route path="/analytics">
        {() => (
          <SafeComponent componentName="Analytics-Route">
            <ErrorBoundary componentName="Analytics-Route">
              <Analytics analytics={{}} />
            </ErrorBoundary>
          </SafeComponent>
        )}
      </Route>
      <Route path="/trace" component={() => (
        <SafeComponent componentName="TraceManager-Route">
          <ErrorBoundary componentName="TraceManager-Route">
            <TraceManager />
          </ErrorBoundary>
        </SafeComponent>
      )} />
      <Route path="/build" component={() => (
        <SafeComponent componentName="BuildDashboard-Route">
          <ErrorBoundary componentName="BuildDashboard-Route">
            <BuildDashboard />
          </ErrorBoundary>
        </SafeComponent>
      )} />
      <Route path="/fedscout" component={() => (
        <SafeComponent componentName="FedScoutDashboard-Route">
          <ErrorBoundary componentName="FedScoutDashboard-Route">
            <FedScoutDashboard />
          </ErrorBoundary>
        </SafeComponent>
      )} />
      <Route path="/blockchain" component={() => (
        <SafeComponent componentName="BlockchainDashboard-Route">
          <ErrorBoundary componentName="BlockchainDashboard-Route">
            <BlockchainDashboard />
          </ErrorBoundary>
        </SafeComponent>
      )} />
      <Route component={() => (
        <SafeComponent componentName="NotFound">
          <ErrorBoundary componentName="NotFound">
            <NotFound />
          </ErrorBoundary>
        </SafeComponent>
      )} />
    </Switch>
  );
}

function App() {
  console.log("App component rendering, creating QueryClient...");
  
  return (
    <ErrorBoundary componentName="App">
      <QueryClientProvider client={queryClient}>
        <TenantProvider>
          <TooltipProvider>
            <div className="min-h-screen bg-background">
              <Router />
            </div>
            <Toaster />
          </TooltipProvider>
        </TenantProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;