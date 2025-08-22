import { Route, Switch } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toast/toaster";
// Temporarily remove auth provider to get app working
// import { AuthProvider } from "@/hooks/useAuth";

// Import all page components
import Layout from "@/components/Layout";
// import Dashboard from "@/pages/dashboard";
import PlatformDashboard from "@/pages/PlatformDashboard";
import PipelineManager from "@/components/PipelineManager";
import Analytics from "@/components/Analytics";
import TransformersManager from "@/components/TransformersManager";
import LLMManager from "@/components/LLMManager";
import AdvancedNLPDashboard from "@/components/AdvancedNLPDashboard";
import BayesianMonteCarloManager from "@/components/BayesianMonteCarloManager";
import MultiParadigmReasoningDashboard from "@/components/MultiParadigmReasoningDashboard";
import SophieTrustManager from "@/components/SophieTrustManager";
import AgentsManager from "@/components/AgentsManager";
import GraphVisualization from "@/components/GraphVisualization";
import EMMEEngageWhiteLabel from "@/components/EMMEEngageWhiteLabel";
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
import BackupPage from "@/pages/backup";

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
          <Route path="/" component={() => <Layout><div /></Layout>} />
          <Route path="/dashboard" component={() => <Layout><PlatformDashboard /></Layout>} />
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
          <Route path="/pipeline" component={() => <Layout><PipelineManager /></Layout>} />
          <Route path="/pipeline/analytics" component={() => <Layout><Analytics /></Layout>} />
          <Route path="/models/transformers" component={() => <Layout><TransformersManager /></Layout>} />
          <Route path="/models/llm" component={() => <Layout><LLMManager /></Layout>} />
          <Route path="/models/advanced-nlp" component={() => <Layout><AdvancedNLPDashboard /></Layout>} />
          <Route path="/models/bayesian-mc" component={() => <Layout><BayesianMonteCarloManager /></Layout>} />
          <Route path="/models/multi-paradigm" component={() => <Layout><MultiParadigmReasoningDashboard /></Layout>} />
          <Route path="/trust" component={() => <Layout><SophieTrustManager /></Layout>} />
          <Route path="/trust/monitoring" component={() => <Layout><SophieTrustManager /></Layout>} />
          <Route path="/agents" component={() => <Layout><AgentsManager /></Layout>} />
          <Route path="/graphs" component={() => <Layout><GraphVisualization /></Layout>} />
          <Route path="/transform" component={() => <Layout><Transform /></Layout>} />
          <Route path="/mesh" component={() => <Layout><Mesh /></Layout>} />
          
          {/* Intelligence Routes */}
          <Route path="/ip" component={() => <Layout><IP /></Layout>} />
          <Route path="/trials" component={() => <Layout><Trials /></Layout>} />
          <Route path="/labs" component={() => <Layout><Labs /></Layout>} />
          
          {/* EMME Engage Application Routes with proper URLs */}
          <Route path="/projects" component={() => <Layout><EMMEEngageWhiteLabel /></Layout>} />
          <Route path="/projects/home" component={() => <Layout><EMMEEngageWhiteLabel /></Layout>} />
          <Route path="/projects/create" component={() => <Layout><EMMEEngageWhiteLabel /></Layout>} />
          <Route path="/projects/view" component={() => <Layout><EMMEEngageWhiteLabel /></Layout>} />
          <Route path="/projects/:projectId" component={() => <Layout><EMMEEngageWhiteLabel /></Layout>} />
          <Route path="/projects/:projectId/insights" component={() => <Layout><EMMEEngageWhiteLabel /></Layout>} />
          <Route path="/projects/:projectId/insights/overview" component={() => <Layout><EMMEEngageWhiteLabel /></Layout>} />
          <Route path="/projects/:projectId/insights/scope" component={() => <Layout><EMMEEngageWhiteLabel /></Layout>} />
          <Route path="/projects/:projectId/insights/timeline" component={() => <Layout><EMMEEngageWhiteLabel /></Layout>} />
          <Route path="/projects/:projectId/framework" component={() => <Layout><EMMEEngageWhiteLabel /></Layout>} />
          <Route path="/projects/:projectId/framework/:section" component={() => <Layout><EMMEEngageWhiteLabel /></Layout>} />
          <Route path="/projects/:projectId/client-content" component={() => <Layout><EMMEEngageWhiteLabel /></Layout>} />
          <Route path="/projects/:projectId/playground" component={() => <Layout><EMMEEngageWhiteLabel /></Layout>} />
          <Route path="/projects/:projectId/strategy-map" component={() => <Layout><EMMEEngageWhiteLabel /></Layout>} />
          <Route path="/projects/:projectId/dashboard" component={() => <Layout><EMMEEngageWhiteLabel /></Layout>} />
          
          {/* Legacy route for compatibility */}
          <Route path="/mock5-client" component={() => <Layout><EMMEEngageWhiteLabel /></Layout>} />
          
          {/* Backup & Export Routes */}
          <Route path="/backup" component={() => <Layout><BackupPage /></Layout>} />
          
          {/* 404 Route */}
          <Route component={NotFound} />
        </Switch>
        
          <Toaster />
        </div>
      </QueryClientProvider>
  );
}

export default App