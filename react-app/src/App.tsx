// src/App.tsx
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Navigation Service
import { NavigationService } from './lib/navigation';

// Layout Components
import Layout from './components/Layout';
import { PostLoginLanding } from './components/PostLoginLanding';

// Landing Pages
import EMMEEngageLanding from './pages/emme-engage-landing';
import EMMEHealthLanding from './pages/emme-health-landing';

// Main App Components
import {SophieChat} from './components/SophieChat';
import {EMMEConnectEnhanced} from './components/EMMEConnectEnhanced';
import {EMMEEngageApp} from './components/EMMEEngageApp';

// Core Platform Components
import Transform from './pages/transform';
import Mesh from './pages/mesh';
import {SophieIntelligenceBrief} from './components/SophieIntelligenceBrief';
import {SophieIntelligenceDashboard} from './components/SophieIntelligenceDashboard';
import {SophieDashboard} from './components/SophieDashboard';
import {SophieAnalysis} from './components/SophieAnalysis';

// VMS Intelligence Hub
import { VMSIntelligenceHub } from './components/emme/VMSIntelligenceHub';

// Project Management
import { EMMEProjectManager } from './components/EMMEProjectManager';
import { ProjectDetails } from './components/ProjectDetails';

// Auth Components
import Login from './pages/login';

// Other Components
import LLMManager from './components/LLMManager';
import GraphNeuralNetworkManager from './components/GraphNeuralNetworkManager';
import { AdvancedNLPDashboard } from './components/AdvancedNLPDashboard';
import MultiParadigmReasoningDashboard from './components/MultiParadigmReasoningDashboard';
import { SocratIQPlatform } from './components/SocratIQPlatform';
import { PlatformDashboard } from './pages/PlatformDashboard';
import AgentsManager from './components/AgentsManager';
import AgenticRAGManager from './components/AgenticRAGManager';
import {BuildDashboard} from './components/BuildDashboard';
import TraceAudit from './components/TraceAudit';
import { TraceManager } from './components/TraceManager';
import Analytics from './components/Analytics';
import { FedScoutDashboard } from './components/FedScoutDashboard';
import {FedScoutManager} from './components/FedScoutManager';
import GraphVisualization from './components/GraphVisualization';
import GraphVisualizationManager from './components/GraphVisualizationManager';
import { TenantProvider } from './components/TenantProvider';
import { ProfileManager } from './components/ProfileManager';
import FileUpload from './components/FileUpload';
import { FileUploadComponent } from './components/FileUploadComponent';
import { CorpusManager } from './components/CorpusManager';
import { BlockchainDashboard } from './components/BlockchainDashboard';
import BayesianMonteCarloManager from './components/BayesianMonteCarloManager';
import { PartnerAppsManager } from './components/PartnerAppsManager';
import { PartnerBrandingDemo } from './components/PartnerBrandingDemo';
import { PipelineManager } from './components/PipelineManager';
import ProcessingQueue from './components/ProcessingQueue';
import TransformersManager from './components/TransformersManager';
import VectorDatabaseManager from './components/VectorDatabaseManager';
import { CognitoLogin } from './components/CognitoLogin';
import DocumentList from './components/DocumentList';
import { SophieModelsManager } from './components/SophieModelsManager';
import { SophieOrchestrator } from './components/SophieOrchestrator';
import { SophieTrustManager } from './components/SophieTrustManager';
import Sidebar from './components/Sidebar';

// Page Components
import Landing from './pages/Landing';
import Home from './pages/Home';
import NotFound from './pages/not-found';
import RiskAnalyzer from './pages/RiskAnalyzer';
import AuditTrail from './pages/ip/audit-trail';
import FedScout from './pages/fedscout';
import KnowledgeGraph from './pages/ip/knowledge-graph';
import ResearchHub from './pages/ip/research-hub';
import Upload from './pages/ip/upload';
import IP from './pages/ip';
import Labs from './pages/labs';
import Dashboard from './pages/dashboard';
import Trials from './pages/trials';
import SophieLanding from './pages/sophie-landing';
import SophieImpactLens from './pages/SophieImpactLens';
import Brief from './pages/sophie/brief';
import AdminDashboard from './pages/AdminDashboard';

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

// Public Route Component (redirect if already authenticated)
const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  return !isAuthenticated ? <>{children}</> : <Navigate to="/app/dashboard" replace />;
};

// Create a query client instance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          {/* Root path redirects to EMME Engage landing */}
          <Route path="/" element={<Navigate to="/emme-engage" replace />} />
          
          {/* Public Landing Pages */}
          <Route path="/emme-engage" element={<EMMEEngageLanding />} />
          <Route path="/emme-health" element={<EMMEHealthLanding />} />
          
          {/* Auth Routes */}
          <Route path="/login" element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          } />

          {/* Protected Routes with Layout - moved to /app/* */}
          <Route path="/app" element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }>
            {/* Dashboard/Landing */}
            <Route index element={<PostLoginLanding />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="home" element={<Home />} />
            
            {/* Sophie Routes */}
            <Route path="sophie" element={<SophieChat />} />
            <Route path="sophie/brief" element={<Brief />} />
            <Route path="sophie/dashboard" element={<SophieDashboard />} />
            <Route path="sophie/analysis" element={<SophieAnalysis />} />
            <Route path="sophie/intelligence-brief" element={<SophieIntelligenceBrief />} />
            <Route path="sophie/intelligence-dashboard" element={<SophieIntelligenceDashboard />} />
            <Route path="sophie/admin" element={<AdminDashboard />} />
            <Route path="sophie-landing" element={<SophieLanding />} />
            <Route path="sophie-impact-lens" element={<SophieImpactLens />} />
            
            {/* EMME Connect Routes */}
            <Route path="emme" element={<SophieChat />} />
            <Route path="emme-engage/app" element={
              <TenantProvider>
                <EMMEEngageApp />
              </TenantProvider>
            } />
            <Route path="emme/research-hub" element={<EMMEConnectEnhanced />} />
            <Route path="emme/competitive-intelligence" element={<EMMEConnectEnhanced />} />
            <Route path="emme/regulatory-strategy" element={<EMMEConnectEnhanced />} />
            <Route path="emme/market-access" element={<EMMEConnectEnhanced />} />
            <Route path="emme/content-library" element={<EMMEConnectEnhanced />} />
            <Route path="emme/partnerships" element={<EMMEConnectEnhanced />} />
            <Route path="emme/analytics-dashboard" element={<EMMEConnectEnhanced />} />
            <Route path="emme/projects" element={<EMMEProjectManager />} />
            <Route path="emme/questions" element={<EMMEConnectEnhanced />} />
            
            {/* VMS Intelligence Hub */}
            <Route path="vms" element={<VMSIntelligenceHub />} />
            <Route path="vms/*" element={<VMSIntelligenceHub />} />
            
            {/* Core Platform Routes */}
            <Route path="transform" element={<Transform />} />
            <Route path="mesh" element={<Mesh />} />
            <Route path="platform" element={<SocratIQPlatform />} />
            <Route path="platform-dashboard" element={<PlatformDashboard />} />
            
            {/* Trust & Risk Management */}
            <Route path="trust" element={<SophieTrustManager />} />
            <Route path="risk-analyzer" element={<RiskAnalyzer />} />
            <Route path="trace-audit" element={<TraceAudit />} />
            <Route path="trace-manager" element={<TraceManager />} />
            <Route path="audit-trail" element={<AuditTrail />} />
            
            {/* Agents & RAG */}
            <Route path="agents" element={<AgentsManager />} />
            <Route path="agentic-rag" element={<AgenticRAGManager />} />
            
            {/* Knowledge Graphs */}
            <Route path="graphs" element={<GraphVisualization />} />
            <Route path="knowledge-graph" element={<KnowledgeGraph />} />
            <Route path="graph-visualization" element={<GraphVisualizationManager />} />
            
            {/* Neural Networks & AI */}
            <Route path="gnn" element={<GraphNeuralNetworkManager />} />
            <Route path="llm-manager" element={<LLMManager />} />
            <Route path="nlp-dashboard" element={<AdvancedNLPDashboard />} />
            <Route path="multi-paradigm" element={<MultiParadigmReasoningDashboard />} />
            <Route path="sophie-models" element={<SophieModelsManager />} />
            <Route path="sophie-orchestrator" element={<SophieOrchestrator />} />
            
            {/* Data Management */}
            <Route path="upload" element={<Upload />} />
            <Route path="file-upload" element={<FileUpload />} />
            <Route path="documents" element={<DocumentList />} />
            <Route path="corpus-manager" element={<CorpusManager />} />
            <Route path="vector-database" element={<VectorDatabaseManager />} />
            <Route path="processing-queue" element={<ProcessingQueue />} />
            <Route path="transformers" element={<TransformersManager />} />
            
            {/* Analytics & Monitoring */}
            <Route path="analytics" element={<Analytics />} />
            <Route path="research-hub" element={<ResearchHub />} />
            
            {/* Federal & Compliance */}
            <Route path="fedscout" element={<FedScout />} />
            <Route path="fedscout-dashboard" element={<FedScoutDashboard />} />
            <Route path="fedscout-manager" element={<FedScoutManager />} />
            
            {/* Build & Pipeline */}
            <Route path="build" element={<BuildDashboard />} />
            <Route path="pipeline-manager" element={<PipelineManager />} />
            
            {/* Blockchain & Advanced Features */}
            <Route path="blockchain" element={<BlockchainDashboard />} />
            <Route path="bayesian-monte-carlo" element={<BayesianMonteCarloManager />} />
            
            {/* Partner Management */}
            <Route path="partners" element={<PartnerAppsManager />} />
            <Route path="partner-branding" element={<PartnerBrandingDemo />} />
            <Route path="tenant-provider" element={<TenantProvider />} />
            
            {/* User Management */}
            <Route path="profile" element={<ProfileManager />} />
            
            {/* IP & Labs */}
            <Route path="ip" element={<IP />} />
            <Route path="labs" element={<Labs />} />
            <Route path="trials" element={<Trials />} />
            
            {/* Project Management */}
            <Route path="projects/:id" element={<ProjectDetails />} />
            
            {/* Catch-all for undefined protected routes */}
            <Route path="*" element={<NotFound />} />
          </Route>

          {/* Default route - redirect to EMME Engage landing */}
          <Route path="*" element={<Navigate to="/emme-engage" replace />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;