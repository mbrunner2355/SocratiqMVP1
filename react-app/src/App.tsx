import { Switch, Route } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import React from "react";

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

// Import all major platform components
import { SocratIQPlatform } from "@/components/SocratIQPlatform";
import { EMMEEngageApp } from "@/components/EMMEEngageApp";
import { EMMELayout } from "@/components/emme/EMMELayout";
import { EMMEHome } from "@/components/emme/EMMEHome";
import { ClientManager } from "@/components/emme/ClientManager";
import { ProjectManager } from "@/components/emme/ProjectManager";
import { ProjectDetails } from "@/components/ProjectDetails";
import { ContentOrchestrationModule } from "@/components/emme/ContentOrchestrationModule";
import { StrategicIntelligenceModule } from "@/components/emme/StrategicIntelligenceModule";
import { StakeholderEngagementModule } from "@/components/emme/StakeholderEngagementModule";
import { EquityAccessModule } from "@/components/emme/EquityAccessModule";

// Import Sophie components
import { SophieDashboard } from "@/components/SophieDashboard";
import { SophieIntelligenceDashboard } from "@/components/SophieIntelligenceDashboard";
import { SophieChat } from "@/components/SophieChat";

// Import admin components
import { CorpusManager } from "@/components/CorpusManager";
import { PipelineManager } from "@/components/PipelineManager";
import ProcessingQueue from "@/components/ProcessingQueue";
import Analytics from "@/components/Analytics";
import { TraceManager } from "@/components/TraceManager";

// Import additional specialized components
import { BuildDashboard } from "@/components/BuildDashboard";
import { FedScoutDashboard } from "@/components/FedScoutDashboard";
import { BlockchainDashboard } from "@/components/BlockchainDashboard";

// Import pages
import NotFound from "@/pages/not-found";
import Landing from "@/pages/Landing";
import Home from "@/pages/Home";
import Dashboard from "@/pages/dashboard";

// Import tenant provider for multi-tenant support
import { TenantProvider } from "@/components/TenantProvider";
import { useState } from "react";

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
        </div>
      );
    }

    return this.props.children;
  }
}

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
        return <ErrorBoundary componentName="EMMEHome"><EMMEHome /></ErrorBoundary>;
      case "clients":
        return <ErrorBoundary componentName="ClientManager"><ClientManager /></ErrorBoundary>;
      case "projects":
        return <ErrorBoundary componentName="ProjectManager"><ProjectManager mode="list" /></ErrorBoundary>;
      case "create-project":
        return <ErrorBoundary componentName="ProjectManager-Create"><ProjectManager mode="create" /></ErrorBoundary>;
      case "smart-wizard":
        return <div className="p-6"><h1 className="text-2xl font-bold">Smart Wizard</h1><p>Advanced project creation wizard with AI guidance.</p></div>;
      case "strategic-intelligence":
        return <ErrorBoundary componentName="StrategicIntelligenceModule"><StrategicIntelligenceModule /></ErrorBoundary>;
      case "stakeholder-engagement":
        return <ErrorBoundary componentName="StakeholderEngagementModule"><StakeholderEngagementModule /></ErrorBoundary>;
      case "content-orchestration":
        return <ErrorBoundary componentName="ContentOrchestrationModule"><ContentOrchestrationModule /></ErrorBoundary>;
      case "equity-access":
        return <ErrorBoundary componentName="EquityAccessModule"><EquityAccessModule /></ErrorBoundary>;
      case "corpus":
        return <ErrorBoundary componentName="CorpusManager"><CorpusManager /></ErrorBoundary>;
      case "data-pipeline":
        return <ErrorBoundary componentName="PipelineManager"><PipelineManager /></ErrorBoundary>;
      case "data-ingestion":
        return <ErrorBoundary componentName="ProcessingQueue"><ProcessingQueue /></ErrorBoundary>;
      case "api-management":
        return <ErrorBoundary componentName="Analytics"><Analytics /></ErrorBoundary>;
      case "trace":
        return <ErrorBoundary componentName="TraceManager"><TraceManager /></ErrorBoundary>;
      case "sophie":
        return <ErrorBoundary componentName="SophieDashboard"><SophieDashboard /></ErrorBoundary>;
      case "sophie-intelligence":
        return <ErrorBoundary componentName="SophieIntelligenceDashboard"><SophieIntelligenceDashboard /></ErrorBoundary>;
      case "sophie-chat":
        return <ErrorBoundary componentName="SophieChat"><SophieChat /></ErrorBoundary>;
      case "build":
        return <ErrorBoundary componentName="BuildDashboard"><BuildDashboard /></ErrorBoundary>;
      case "fedscout":
        return <ErrorBoundary componentName="FedScoutDashboard"><FedScoutDashboard /></ErrorBoundary>;
      case "blockchain":
        return <ErrorBoundary componentName="BlockchainDashboard"><BlockchainDashboard /></ErrorBoundary>;
      default:
        return <ErrorBoundary componentName="EMMEHome-Default"><EMMEHome /></ErrorBoundary>;
    }
  };
  
  return (
    <ErrorBoundary componentName="EMMELayout">
      <EMMELayout activeView={currentView} onViewChange={handleViewChange}>
        {renderCurrentView()}
      </EMMELayout>
    </ErrorBoundary>
  );
}

function Router() {
  const { isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <Switch>
      <Route path="/" component={() => <ErrorBoundary componentName="SocratIQPlatform"><SocratIQPlatform /></ErrorBoundary>} />
      <Route path="/landing" component={() => <ErrorBoundary componentName="Landing"><Landing /></ErrorBoundary>} />
      <Route path="/home" component={() => <ErrorBoundary componentName="Home"><Home /></ErrorBoundary>} />
      <Route path="/dashboard" component={() => <ErrorBoundary componentName="Dashboard"><Dashboard /></ErrorBoundary>} />
      <Route path="/emme-engage" component={() => <ErrorBoundary componentName="EMMEEngageApp"><EMMEEngageApp /></ErrorBoundary>} />
      <Route path="/emme-engage/app" component={EMMEEngageAppContainer} />
      <Route path="/emme-engage/projects/:id">
        {(params) => <ErrorBoundary componentName="ProjectDetails"><ProjectDetails projectId={params.id} onBack={() => window.history.back()} /></ErrorBoundary>}
      </Route>
      <Route path="/sophie" component={() => <ErrorBoundary componentName="SophieDashboard-Route"><SophieDashboard /></ErrorBoundary>} />
      <Route path="/sophie/intelligence" component={() => <ErrorBoundary componentName="SophieIntelligenceDashboard-Route"><SophieIntelligenceDashboard /></ErrorBoundary>} />
      <Route path="/sophie/chat" component={() => <ErrorBoundary componentName="SophieChat-Route"><SophieChat /></ErrorBoundary>} />
      <Route path="/corpus" component={() => <ErrorBoundary componentName="CorpusManager-Route"><CorpusManager /></ErrorBoundary>} />
      <Route path="/pipeline" component={() => <ErrorBoundary componentName="PipelineManager-Route"><PipelineManager /></ErrorBoundary>} />
      <Route path="/analytics">
        {() => <ErrorBoundary componentName="Analytics-Route"><Analytics analytics={{}} /></ErrorBoundary>}
      </Route>
      <Route path="/trace" component={() => <ErrorBoundary componentName="TraceManager-Route"><TraceManager /></ErrorBoundary>} />
      <Route path="/build" component={() => <ErrorBoundary componentName="BuildDashboard-Route"><BuildDashboard /></ErrorBoundary>} />
      <Route path="/fedscout" component={() => <ErrorBoundary componentName="FedScoutDashboard-Route"><FedScoutDashboard /></ErrorBoundary>} />
      <Route path="/blockchain" component={() => <ErrorBoundary componentName="BlockchainDashboard-Route"><BlockchainDashboard /></ErrorBoundary>} />
      <Route component={() => <ErrorBoundary componentName="NotFound"><NotFound /></ErrorBoundary>} />
    </Switch>
  );
}

function App() {
  console.log("App component rendering, creating QueryClient...");
  
  return (
    <ErrorBoundary componentName="App">
      <TenantProvider>
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            <div className="min-h-screen bg-background">
              <Router />
            </div>
            <Toaster />
          </TooltipProvider>
        </QueryClientProvider>
      </TenantProvider>
    </ErrorBoundary>
  );
}

export default App;