import { Switch, Route, useLocation } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { queryClient } from "@/lib/queryClient";
import { useAuth } from "@/hooks/useAuth";

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
        return <EMMEHome />;
      case "clients":
        return <ClientManager />;
      case "projects":
        return <ProjectManager mode="list" />;
      case "create-project":
        return <ProjectManager mode="create" />;
      case "smart-wizard":
        return <div className="p-6"><h1 className="text-2xl font-bold">Smart Wizard</h1><p>Advanced project creation wizard with AI guidance.</p></div>;
      case "strategic-intelligence":
        return <StrategicIntelligenceModule />;
      case "stakeholder-engagement":
        return <StakeholderEngagementModule />;
      case "content-orchestration":
        return <ContentOrchestrationModule />;
      case "equity-access":
        return <EquityAccessModule />;
      case "corpus":
        return <CorpusManager />;
      case "data-pipeline":
        return <PipelineManager />;
      case "data-ingestion":
        return <ProcessingQueue />;
      case "api-management":
        return <Analytics />;
      case "trace":
        return <TraceManager />;
      case "sophie":
        return <SophieDashboard />;
      case "sophie-intelligence":
        return <SophieIntelligenceDashboard />;
      case "sophie-chat":
        return <SophieChat />;
      case "build":
        return <BuildDashboard />;
      case "fedscout":
        return <FedScoutDashboard />;
      case "blockchain":
        return <BlockchainDashboard />;
      default:
        return <EMMEHome />;
    }
  };
  
  return (
    <EMMELayout activeView={currentView} onViewChange={handleViewChange}>
      {renderCurrentView()}
    </EMMELayout>
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
      <Route path="/" component={SocratIQPlatform} />
      <Route path="/landing" component={Landing} />
      <Route path="/home" component={Home} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/emme-engage" component={EMMEEngageApp} />
      <Route path="/emme-engage/app" component={EMMEEngageAppContainer} />
      <Route path="/emme-engage/projects/:id">
        {(params) => <ProjectDetails projectId={params.id} onBack={() => window.history.back()} />}
      </Route>
      <Route path="/sophie" component={SophieDashboard} />
      <Route path="/sophie/intelligence" component={SophieIntelligenceDashboard} />
      <Route path="/sophie/chat" component={SophieChat} />
      <Route path="/corpus" component={CorpusManager} />
      <Route path="/pipeline" component={PipelineManager} />
      <Route path="/analytics" component={Analytics} />
      <Route path="/trace" component={TraceManager} />
      <Route path="/build" component={BuildDashboard} />
      <Route path="/fedscout" component={FedScoutDashboard} />
      <Route path="/blockchain" component={BlockchainDashboard} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
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
  );
}

export default App;