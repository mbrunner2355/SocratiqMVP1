import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import Layout from "@/components/Layout";
import Home from "@/pages/Home";
import Transform from "@/pages/transform";
import Mesh from "@/pages/mesh";
import IP from "@/pages/ip";
import FedScout from "@/pages/ip/fedscout";
import SophieBrief from "@/pages/sophie/brief";
import ResearchHub from "@/pages/ip/research-hub";
import UploadDocuments from "@/pages/ip/upload";
import KnowledgeGraph from "@/pages/ip/knowledge-graph";
import AuditTrail from "@/pages/ip/audit-trail";
import Trials from "@/pages/trials";
import Labs from "@/pages/labs";
import Landing from "@/pages/Landing";
import Login from "@/pages/login";
import NotFound from "@/pages/not-found";
import { TraceManager } from "@/components/TraceManager";
import { BuildDashboard } from "@/components/BuildDashboard";
import { ProfileManager } from "@/components/ProfileManager";

import { PipelineManager } from "@/components/PipelineManager";
import { SophieTrustManager } from "@/components/SophieTrustManager";
import { SophieModelsManager } from "@/components/SophieModelsManager";
import AgentsManager from "@/components/AgentsManager";
import TransformersManager from "@/components/TransformersManager";
import AgenticRAGManager from "@/components/AgenticRAGManager";
import GraphVisualizationManager from "@/components/GraphVisualizationManager";
import GraphNeuralNetworkManager from "@/components/GraphNeuralNetworkManager";
import { EMMEManager } from "@/components/EMMEManager";
import { EMMEConnectEnhanced } from "@/components/EMMEConnectEnhanced";
import { PartnerAppsManager } from "@/components/PartnerAppsManager";
import { EMMEEngageApp } from "@/components/EMMEEngageApp";
import { AdvancedNLPDashboard } from "@/components/AdvancedNLPDashboard";
import LLMManager from "@/components/LLMManager";
import BayesianMonteCarloManager from "@/components/BayesianMonteCarloManager";
import MultiParadigmReasoningDashboard from "@/components/MultiParadigmReasoningDashboard";
import RiskAnalyzer from "@/pages/RiskAnalyzer";
import SophieImpactLens from "@/pages/SophieImpactLens";
import SophieLanding from "@/pages/sophie-landing";
import EMMEEngageLanding from "@/pages/emme-engage-landing";
import EMMEHealthLanding from "@/pages/emme-health-landing";
import { TenantProvider } from "@/components/TenantProvider";
import EMMEEngageWhiteLabel from "@/components/EMMEEngageWhiteLabel";
import { PlatformDashboard } from "@/pages/PlatformDashboard";
import { BlockchainDashboard } from "@/components/BlockchainDashboard";
import { PostLoginLanding } from "@/components/PostLoginLanding";
import { ProductionLogin } from "@/components/ProductionLogin";
import { CognitoLogin } from "@/components/CognitoLogin";
import { useState, useEffect } from "react";

function Router() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [location] = useLocation();
  const [isProductionDeploy, setIsProductionDeploy] = useState(false);
  const [isCognitoEnabled, setIsCognitoEnabled] = useState(false);

  // Detect environment and authentication mode
  useEffect(() => {
    const checkEnvironment = () => {
      // Check if Cognito is configured (via meta tags or environment detection)
      const cognitoEnabled = document.querySelector('meta[name="auth-type"]')?.getAttribute('content') === 'cognito';
      setIsCognitoEnabled(cognitoEnabled);
      
      // If we're not on a replit.co domain and have certain indicators, this is likely production
      const hostname = window.location.hostname;
      const isReplit = hostname.includes('replit.co') || hostname.includes('repl.co');
      const isAmplify = hostname.includes('amplifyapp.com') || hostname.includes('cloudfront.net');
      setIsProductionDeploy(!isReplit || isAmplify);
    };
    checkEnvironment();
  }, []);
  
  // White-label routes work for both authenticated and unauthenticated users
  if (location === '/engage' || location === '/mock5-client') {
    return <EMMEEngageWhiteLabel />;
  }
  
  // Check if user is accessing via partner app
  const isEMMEEngageUser = window.location.pathname.startsWith('/emme-engage') || 
                          localStorage.getItem('partner-app') === 'emme-engage';
  const isEMMEHealthUser = window.location.pathname.startsWith('/emme-health') || 
                          localStorage.getItem('partner-app') === 'emme-health';

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // For Cognito authentication, show the Cognito login for end users
    if (isCognitoEnabled) {
      return (
        <div>
          <CognitoLogin onLoginSuccess={() => window.location.reload()} />
          {/* Admin access link */}
          <div className="fixed bottom-4 right-4">
            <a 
              href="/login" 
              className="text-xs text-gray-500 hover:text-gray-700 underline"
            >
              Admin Access
            </a>
          </div>
        </div>
      );
    }
    
    // For production deployments, show the production login
    if (isProductionDeploy) {
      return <ProductionLogin onLoginSuccess={() => window.location.reload()} />;
    }
    
    // For development (Replit), use the original landing pages
    return (
      <Switch>
        <Route path="/" component={Landing} />
        <Route path="/emme-engage" component={EMMEEngageLanding} />
        <Route path="/emme-health" component={EMMEHealthLanding} />
        <Route path="/login" component={Login} />
        <Route component={NotFound} />
      </Switch>
    );
  }

  // Partner app routing for authenticated users
  if (isEMMEEngageUser) {
    return (
      <Switch>
        <Route path="/emme-engage/app" component={EMMEEngageApp} />
        <Route path="/emme-engage/*" component={EMMEEngageApp} />
        <Route component={NotFound} />
      </Switch>
    );
  }

  if (isEMMEHealthUser) {
    return (
      <div className="p-6 text-center">
        <h1 className="text-2xl font-bold text-blue-600 mb-4">EMME Health Application</h1>
        <p className="text-gray-600">EMME Health application interface coming soon</p>
      </div>
    );
  }

  // Route based on user role
  const userRole = user?.role;
  
  // Admin users get full SocratIQ platform access
  if (userRole === 'admin' || user?.email === 'vinnyc2306@gmail.com') {
    return (
      <Layout>
        <Switch>
          <Route path="/" component={PostLoginLanding} />
          <Route path="/platform" component={PlatformDashboard} />
          <Route path="/home" component={Home} />
          <Route path="/transform" component={Transform} />
          <Route path="/mesh" component={Mesh} />
          <Route path="/ip" component={IP} />
          <Route path="/ip/fedscout" component={FedScout} />
          <Route path="/ip/research-hub" component={() => <div className="p-6"><ResearchHub /></div>} />
          <Route path="/ip/upload" component={() => <div className="p-6"><UploadDocuments /></div>} />
          <Route path="/ip/knowledge-graph" component={() => <div className="p-6"><KnowledgeGraph /></div>} />
          <Route path="/ip/audit-trail" component={() => <div className="p-6"><AuditTrail /></div>} />
          <Route path="/sophie/brief" component={SophieBrief} />
          <Route path="/emme" component={EMMEConnectEnhanced} />
          <Route path="/emme/:section" component={EMMEConnectEnhanced} />
          <Route path="/emme-legacy" component={() => <div className="p-6"><EMMEManager /></div>} />
          <Route path="/trials" component={Trials} />
          <Route path="/profile" component={() => <div className="p-6"><ProfileManager /></div>} />
          <Route path="/labs" component={Labs} />
          <Route path="/build" component={() => <div className="p-6"><BuildDashboard /></div>} />
          <Route path="/trace" component={() => <div className="p-6"><TraceManager /></div>} />

          <Route path="/pipeline" component={() => <div className="p-6"><PipelineManager /></div>} />
          <Route path="/models" component={() => <div className="p-6"><SophieModelsManager /></div>} />
          <Route path="/models/sophie" component={() => <div className="p-6"><SophieModelsManager /></div>} />
          <Route path="/models/transformers" component={() => <div className="p-6"><TransformersManager /></div>} />
          <Route path="/models/llm" component={() => <div className="p-6"><LLMManager /></div>} />
          <Route path="/models/advanced-nlp" component={() => <div className="p-6"><AdvancedNLPDashboard /></div>} />
          <Route path="/models/bayesian-mc" component={() => <div className="p-6"><BayesianMonteCarloManager /></div>} />
          <Route path="/models/multi-paradigm" component={() => <div className="p-6"><MultiParadigmReasoningDashboard /></div>} />
          <Route path="/risk-analyzer" component={RiskAnalyzer} />
          <Route path="/sophie-impact-lens" component={SophieImpactLens} />
          <Route path="/trust" component={() => <div className="p-6"><SophieTrustManager /></div>} />
          <Route path="/agents" component={() => <div className="p-6"><AgentsManager /></div>} />
          <Route path="/transformers" component={() => <div className="p-6"><TransformersManager /></div>} />
          <Route path="/agentic-rag" component={() => <div className="p-6"><AgenticRAGManager /></div>} />
          <Route path="/graphs" component={() => <div className="p-6"><GraphVisualizationManager /></div>} />
          <Route path="/gnn" component={() => <div className="p-6"><GraphNeuralNetworkManager /></div>} />
          
          {/* Analytics and Monitoring routes */}
          <Route path="/pipeline/analytics" component={() => <div className="p-6"><PipelineManager /></div>} />
          <Route path="/pipeline/monitoring" component={() => <div className="p-6"><PipelineManager /></div>} />
          <Route path="/agents/analytics" component={() => <div className="p-6"><AgentsManager /></div>} />
          <Route path="/agents/monitoring" component={() => <div className="p-6"><AgentsManager /></div>} />
          <Route path="/agents/orchestration" component={() => <div className="p-6"><AgentsManager /></div>} />
          <Route path="/trust/monitoring" component={() => <div className="p-6"><SophieTrustManager /></div>} />
          <Route path="/trust/validation" component={() => <div className="p-6"><SophieTrustManager /></div>} />
          <Route path="/trust/reports" component={() => <div className="p-6"><SophieTrustManager /></div>} />
          <Route path="/trace/events" component={() => <div className="p-6"><TraceManager /></div>} />
          <Route path="/trace/analytics" component={() => <div className="p-6"><TraceManager /></div>} />
          <Route path="/gnn/training" component={() => <div className="p-6"><GraphNeuralNetworkManager /></div>} />
          <Route path="/gnn/inference" component={() => <div className="p-6"><GraphNeuralNetworkManager /></div>} />
          <Route path="/gnn/monitoring" component={() => <div className="p-6"><GraphNeuralNetworkManager /></div>} />
          <Route path="/graphs/visualization" component={() => <div className="p-6"><GraphVisualizationManager /></div>} />
          <Route path="/graphs/temporal" component={() => <div className="p-6"><GraphVisualizationManager /></div>} />
          <Route path="/agentic-rag/temporal" component={() => <div className="p-6"><AgenticRAGManager /></div>} />
          <Route path="/agentic-rag/context" component={() => <div className="p-6"><AgenticRAGManager /></div>} />
          <Route path="/agentic-rag/agora" component={() => <div className="p-6"><AgenticRAGManager /></div>} />
          
          {/* Blockchain Dashboard */}
          <Route path="/blockchain" component={() => <div className="p-6"><BlockchainDashboard /></div>} />

          <Route path="/admin/pipeline" component={() => <div className="p-6"><PipelineManager /></div>} />
          <Route path="/admin/sophie-models" component={() => <div className="p-6"><SophieModelsManager /></div>} />
          <Route path="/admin/sophie-trust" component={() => <div className="p-6"><SophieTrustManager /></div>} />
          <Route path="/admin/partner-apps" component={() => <div className="p-6"><PartnerAppsManager /></div>} />
          <Route path="/admin/advanced-nlp" component={() => <div className="p-6"><AdvancedNLPDashboard /></div>} />
          <Route component={NotFound} />
        </Switch>
      </Layout>
    );
  }
  
  // Partner users get partner dashboard to manage their customers
  if (userRole === 'partner') {
    return (
      <Layout>
        <Switch>
          <Route path="/" component={() => <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Partner Dashboard</h1>
            <p className="text-gray-600">Manage your white-label customers and configurations</p>
          </div>} />
          <Route path="/customers" component={() => <div className="p-6">Customer Management</div>} />
          <Route path="/configuration" component={() => <div className="p-6">White-Label Configuration</div>} />
          <Route path="/analytics" component={() => <div className="p-6">Partner Analytics</div>} />
          <Route component={NotFound} />
        </Switch>
      </Layout>
    );
  }
  
  // Partner customers get white-label interface only
  if (userRole === 'partner_customer') {
    return <EMMEEngageWhiteLabel />;
  }
  
  // Direct SocratIQ customers get main platform (limited access)
  return (
    <Layout>
      <Switch>
        <Route path="/" component={PostLoginLanding} />
        <Route path="/home" component={Home} />
        <Route path="/transform" component={Transform} />
        <Route path="/mesh" component={Mesh} />
        <Route path="/ip" component={IP} />
        <Route path="/emme" component={EMMEConnectEnhanced} />
        <Route path="/emme/:section" component={EMMEConnectEnhanced} />
        <Route path="/trials" component={Trials} />
        <Route path="/profile" component={() => <div className="p-6"><ProfileManager /></div>} />
        <Route path="/labs" component={Labs} />

        <Route path="/pipeline" component={() => <div className="p-6"><PipelineManager /></div>} />
        <Route path="/models" component={() => <div className="p-6"><SophieModelsManager /></div>} />
        <Route path="/models/sophie" component={() => <div className="p-6"><SophieModelsManager /></div>} />
        <Route path="/models/transformers" component={() => <div className="p-6"><TransformersManager /></div>} />
        <Route path="/models/llm" component={() => <div className="p-6"><LLMManager /></div>} />
        <Route path="/models/advanced-nlp" component={() => <div className="p-6"><AdvancedNLPDashboard /></div>} />
        <Route path="/models/bayesian-mc" component={() => <div className="p-6"><BayesianMonteCarloManager /></div>} />
        <Route path="/models/multi-paradigm" component={() => <div className="p-6"><MultiParadigmReasoningDashboard /></div>} />
        <Route path="/trust" component={() => <div className="p-6"><SophieTrustManager /></div>} />
        <Route path="/agents" component={() => <div className="p-6"><AgentsManager /></div>} />
        <Route path="/transformers" component={() => <div className="p-6"><TransformersManager /></div>} />
        <Route path="/agentic-rag" component={() => <div className="p-6"><AgenticRAGManager /></div>} />
        <Route path="/graphs" component={() => <div className="p-6"><GraphVisualizationManager /></div>} />
        
        {/* Analytics and Monitoring routes for direct customers */}
        <Route path="/pipeline/analytics" component={() => <div className="p-6"><PipelineManager /></div>} />
        <Route path="/pipeline/monitoring" component={() => <div className="p-6"><PipelineManager /></div>} />
        <Route path="/agents/analytics" component={() => <div className="p-6"><AgentsManager /></div>} />
        <Route path="/agents/monitoring" component={() => <div className="p-6"><AgentsManager /></div>} />
        <Route path="/agents/orchestration" component={() => <div className="p-6"><AgentsManager /></div>} />
        <Route path="/trust/monitoring" component={() => <div className="p-6"><SophieTrustManager /></div>} />
        <Route path="/trust/validation" component={() => <div className="p-6"><SophieTrustManager /></div>} />
        <Route path="/trust/reports" component={() => <div className="p-6"><SophieTrustManager /></div>} />
        
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TenantProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </TenantProvider>
    </QueryClientProvider>
  );
}

export default App;
