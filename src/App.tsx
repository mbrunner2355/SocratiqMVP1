import { Route, Switch } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toast/toaster";

// Import all page components
import Home from "@/pages/dashboard";
import Dashboard from "@/pages/dashboard";
import Transform from "@/pages/transform";
import Mesh from "@/pages/mesh";
import IP from "@/pages/ip";
import Trials from "@/pages/trials";
import Labs from "@/pages/labs";
import Login from "@/pages/login";
import NotFound from "@/pages/not-found";
import Landing from "@/pages/Landing";
import EMMEEngageLanding from "@/pages/emme-engage-landing";
import FedScout from "@/pages/fedscout";
import SophieLanding from "@/pages/sophie-landing";

// Create QueryClient instance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-gray-50">
        <Switch>
          {/* Main landing pages */}
          <Route path="/" component={Home} />
          <Route path="/landing" component={Landing} />
          <Route path="/login" component={Login} />
          
          {/* EMME Engage Routes */}
          <Route path="/emme" component={EMMEEngageLanding} />
          <Route path="/emme-engage" component={EMMEEngageLanding} />
          
          {/* Sophie Routes */}
          <Route path="/sophie" component={SophieLanding} />
          
          {/* FedScout Routes */}
          <Route path="/fedscout" component={FedScout} />
          
          {/* Core Platform Routes */}
          <Route path="/dashboard" component={Dashboard} />
          <Route path="/transform" component={Transform} />
          <Route path="/mesh" component={Mesh} />
          
          {/* Intelligence Routes */}
          <Route path="/ip" component={IP} />
          <Route path="/trials" component={Trials} />
          <Route path="/labs" component={Labs} />
          
          {/* 404 Route */}
          <Route component={NotFound} />
        </Switch>
        
        <Toaster />
      </div>
    </QueryClientProvider>
  );
}

export default App