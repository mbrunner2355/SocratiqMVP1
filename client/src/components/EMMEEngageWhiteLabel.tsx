import { useState, useEffect } from "react";
import { useTenant, useFeature, useTenantStyling } from "@/components/TenantProvider";
import { useQuery } from "@tanstack/react-query";
import { EMMELayout } from "@/components/emme/EMMELayout";
import { EMMEHome } from "@/components/emme/EMMEHome";
import { InsightEngine } from "@/components/emme/InsightEngine";
import { EngagementStudio } from "@/components/emme/EngagementStudio";
import { LearningHub } from "@/components/emme/LearningHub";
import { EquityInfrastructure } from "@/components/emme/EquityInfrastructure";
import { ProjectManager } from "@/components/emme/ProjectManager";
import { ClientManager } from "@/components/emme/ClientManager";
import { WorkflowVisualization } from "@/components/emme/WorkflowVisualization";
import { MLRSubmissions } from "@/components/emme/MLRSubmissions";
import { MLRVisualization } from "@/components/emme/MLRVisualization";
import { MarketIntelligence } from "@/components/emme/MarketIntelligence";
import { PayerLandscape } from "@/components/emme/PayerLandscape";
import { StrategicIntelligenceOverview } from "@/components/emme/StrategicIntelligenceOverview";
import { DataIngestionHub } from "@/components/emme/DataIngestionHub";
import { ContentOptimization } from "@/components/emme/ContentOptimization";
import { CompetitiveIntelligence } from "@/components/emme/CompetitiveIntelligence";
import { HCPEngagement } from "@/components/emme/HCPEngagement";
import { PatientPrograms } from "@/components/emme/PatientPrograms";
import { StrategicIntelligenceModule } from "@/components/emme/StrategicIntelligenceModule";
import { StakeholderEngagementModule } from "@/components/emme/StakeholderEngagementModule";
import { ContentOrchestrationModule } from "@/components/emme/ContentOrchestrationModule";
import { EquityAccessModule } from "@/components/emme/EquityAccessModule";
import { DataPlatformModule } from "@/components/emme/DataPlatformModule";
import { CorpusPipelineModule } from "@/components/emme/CorpusPipelineModule";
import { SophieDashboard } from "@/components/SophieDashboard";
import { EMMEIntelligenceBrief } from "@/components/emme/EMMEIntelligenceBrief";
import { EMMECreateProject } from "@/components/emme/EMMECreateProject";
import { EMMEDataSourcesDashboard } from "@/components/emme/EMMEDataSourcesDashboard";
import { EMMEProductionDashboard } from "@/components/emme/EMMEProductionDashboard";
import { EMMEProjectManager } from "@/components/EMMEProjectManager";

interface TenantUsage {
  users: { current: number; limit: number; percentage: number };
  projects: { current: number; limit: number; percentage: number };
  documents: { current: number; limit: number; percentage: number };
  storage: { currentGB: number; limitGB: number; percentage: number };
}

interface TenantAnalytics {
  overview: {
    totalProjects: number;
    activeProjects: number;
    completedProjects: number;
    totalUsers: number;
    avgProjectDuration: number;
    successRate: number;
  };
  trends: {
    projectsLastMonth: number;
    projectsThisMonth: number;
    growthRate: number;
    userEngagement: number;
  };
  topPerformers: Array<{
    metric: string;
    value: string;
    count: number;
  }>;
}

function EMMEEngageWhiteLabel() {
  const [activeView, setActiveView] = useState("home");
  
  // Always show Intelligence Brief as primary dashboard
  console.log("EMMEEngageWhiteLabel activeView:", activeView);
  const [projectContext, setProjectContext] = useState<any>(null);
  const { tenant, isLoading: tenantLoading } = useTenant();

  // Listen for navigation events from project wizard and load saved context
  useEffect(() => {
    const handleNavigateToModule = (event: any) => {
      const { moduleId, projectData } = event.detail;
      console.log("Navigation event received:", moduleId, projectData);
      setProjectContext(projectData);
      setActiveView(moduleId);
      
      // Store project context in sessionStorage for persistence
      if (projectData) {
        sessionStorage.setItem('emme-project-context', JSON.stringify(projectData));
        console.log("Project context saved to session storage");
      }
    };

    window.addEventListener('navigateToModule', handleNavigateToModule);
    
    // Load project context from sessionStorage on component mount
    const savedContext = sessionStorage.getItem('emme-project-context');
    if (savedContext) {
      try {
        const parsedContext = JSON.parse(savedContext);
        setProjectContext(parsedContext);
        console.log("Project context loaded from session storage:", parsedContext);
      } catch (e) {
        console.warn("Failed to parse saved project context");
        sessionStorage.removeItem('emme-project-context');
      }
    }
    
    return () => window.removeEventListener('navigateToModule', handleNavigateToModule);
  }, []);
  const { primaryColor, secondaryColor, logo, brandName } = useTenantStyling();
  
  // Feature flags
  const hasProjectManagement = useFeature("project_management");
  const hasPartnershipAnalytics = useFeature("partnership_analytics");
  const hasMarketIntelligence = useFeature("market_intelligence");
  const hasRegulatoryInsights = useFeature("regulatory_insights");
  const hasCompetitiveAnalysis = useFeature("competitive_analysis");

  // Fetch tenant usage data
  const { data: usage, isLoading: usageLoading } = useQuery<TenantUsage>({
    queryKey: ["/api/tenant/usage"],
    enabled: !!tenant
  });

  // Fetch tenant analytics
  const { data: analytics, isLoading: analyticsLoading } = useQuery<TenantAnalytics>({
    queryKey: ["/api/tenant/analytics"],
    enabled: !!tenant
  });

  if (tenantLoading) {
    return (
      <EMMELayout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </EMMELayout>
    );
  }

  // Skip tenant check in development - proceed with default dashboard
  if (!tenant) {
    // In development mode, proceed without tenant validation
    console.log("Development mode: proceeding without tenant configuration");
  }

  const renderActiveView = () => {
    switch (activeView) {
      case "home":
        return <EMMEHome />;
      case "intelligence-brief":
        return <EMMEIntelligenceBrief />;
      case "clients":
        return <ClientManager />;
      case "create-project":
        return <EMMEProjectManager />;
      case "smart-wizard":
        return <EMMECreateProject />;
      case "projects":
        return <EMMEProjectManager />;
      // Strategic Intelligence
      case "strategic-intelligence":
        return <StrategicIntelligenceModule />;
      case "market-intelligence":
        return <MarketIntelligence />;
      case "payer-landscape":
        return <PayerLandscape />;
      case "competitive-analysis":
        return <CompetitiveIntelligence />;
      case "scenario-modeling":
        return <div className="p-6"><h1 className="text-2xl font-bold">Strategic Scenario Modeling</h1><p>AI-powered strategic scenario planning and outcomes modeling</p></div>;
      
      // Stakeholder Engagement
      case "stakeholder-engagement":
        return <StakeholderEngagementModule />;
      case "hcp-engagement":
        return <HCPEngagement />;
      case "patient-programs":
        return <PatientPrograms />;
      case "payer-relations":
        return <div className="p-6"><h1 className="text-2xl font-bold">Payer Relations</h1><p>Payer relationship management and market access strategy</p></div>;
      case "kol-management":
        return <div className="p-6"><h1 className="text-2xl font-bold">KOL Management</h1><p>Key opinion leader identification, engagement, and collaboration tracking</p></div>;
      
      // Content Orchestration  
      case "content-orchestration":
        return <ContentOrchestrationModule />;
      case "mlr-workflow":
        return <MLRVisualization />;
      case "content-optimization":
        return <ContentOptimization />;
      case "multilingual-campaigns":
        return <div className="p-6"><h1 className="text-2xl font-bold">Multilingual Campaigns</h1><p>Global campaign management with cultural adaptation and localization</p></div>;
      case "compliance-monitoring":
        return <MLRSubmissions />;
      
      // Equity & Access
      case "equity-access":
        return <EquityAccessModule />;
      case "disparity-mapping":
        return <div className="p-6"><h1 className="text-2xl font-bold">Health Disparity Mapping</h1><p>Geographic and demographic health equity analysis</p></div>;
      case "access-barriers":
        return <div className="p-6"><h1 className="text-2xl font-bold">Access Barrier Analysis</h1><p>Systematic identification and mitigation of patient access barriers</p></div>;
      case "localized-strategies":
        return <div className="p-6"><h1 className="text-2xl font-bold">Localized Strategies</h1><p>Community-specific engagement strategies and cultural competency frameworks</p></div>;
      case "equity-metrics":
        return <div className="p-6"><h1 className="text-2xl font-bold">Equity Performance Metrics</h1><p>Health equity KPI tracking and disparity trend analysis</p></div>;
      
      // Data Platform
      case "data-platform":
        return <DataPlatformModule />;
      case "data-ingestion":
        return <DataIngestionHub />;
      case "data-sources":
        return <EMMEDataSourcesDashboard />;
      case "api-management":
        return <div className="p-6"><h1 className="text-2xl font-bold">API Management</h1><p>REST/GraphQL API gateway, rate limiting, authentication, and monitoring</p></div>;
      case "tenant-management":
        return <div className="p-6"><h1 className="text-2xl font-bold">Tenant Management</h1><p>Multi-tenant isolation, custom workflows, localization, and compliance controls</p></div>;
      case "trace-units":
        return <div className="p-6"><h1 className="text-2xl font-bold">TraceUnits™ Audit System</h1><p>Immutable audit trails for every AI decision with complete compliance documentation</p></div>;
      
      // Corpus Pipeline & Models
      case "corpus":
        return <CorpusPipelineModule />;
      case "corpus-pipeline":
        return <CorpusPipelineModule />;
      
      // Legacy project modules (to be deprecated)
      case "insight-engine":
        return <InsightEngine projectData={projectContext} />;
      case "engagement-studio":
        return <EngagementStudio projectData={projectContext} />;
      case "learning-hub":
        return <LearningHub projectData={projectContext} />;
      case "equity-infrastructure":
        return <EquityInfrastructure projectData={projectContext} />;
      case "mlr-submissions":
        return <MLRSubmissions />;
      case "mlr-visualization":
        return <MLRVisualization />;
      case "pipeline":
        return <CorpusPipelineModule />;
      case "models":
        return <CorpusPipelineModule />;
      case "trust":
        return <CorpusPipelineModule />;
      case "workflow":
        return <WorkflowVisualization />;
      default:
        return <EMMEHome />;
    }
  };

  return (
    <EMMELayout activeView={activeView} onViewChange={setActiveView}>
      {renderActiveView()}
    </EMMELayout>
  );
}

export default EMMEEngageWhiteLabel;