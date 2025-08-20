import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import { EMMEEngageApp } from "@/components/EMMEEngageApp";
import { EMMELayout } from "@/components/emme/EMMELayout";
import { EMMEHome } from "@/components/emme/EMMEHome";
import { ClientManager } from "@/components/emme/ClientManager";
import { ProjectManager } from "@/components/emme/ProjectManager";
import { ContentOrchestrationModule } from "@/components/emme/ContentOrchestrationModule";
import NotFound from "@/pages/not-found";
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
        return <div className="p-6"><h1 className="text-2xl font-bold">Smart Wizard</h1><p>Smart project wizard coming soon.</p></div>;
      case "strategic-intelligence":
        return <div className="p-6"><h1 className="text-2xl font-bold">Strategic Intelligence</h1><p>Strategic intelligence dashboard coming soon.</p></div>;
      case "stakeholder-engagement":
        return <div className="p-6"><h1 className="text-2xl font-bold">Stakeholder Engagement</h1><p>Stakeholder engagement tools coming soon.</p></div>;
      case "content-orchestration":
        return <ContentOrchestrationModule />;
      case "equity-access":
        return <div className="p-6"><h1 className="text-2xl font-bold">Equity & Access</h1><p>Equity and access tools coming soon.</p></div>;
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
  const { user, isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Simple routing - since auth hook returns authenticated admin user, go to EMME Engage
  return (
    <Switch>
      <Route path="/" component={EMMEEngageAppContainer} />
      <Route path="/emme-engage/app" component={EMMEEngageAppContainer} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <TenantProvider>
          <Router />
          <Toaster />
        </TenantProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;