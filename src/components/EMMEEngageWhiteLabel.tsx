import { useState, useEffect } from "react";
import { useTenant, useFeature, useTenantStyling } from "@/components/TenantProvider";
import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import { SimpleProjectManager } from "@/components/emme/SimpleProjectManager";
import { EMMEComprehensiveProjectCreator } from "@/components/emme/EMMEComprehensiveProjectCreator";


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
  const [insightsTab, setInsightsTab] = useState('overview');
  
  // Always show Intelligence Brief as primary dashboard
  console.log("EMMEEngageWhiteLabel activeView:", activeView);
  const [projectContext, setProjectContext] = useState<any>(null);
  
  // Mock tenant data for development
  const tenant = { id: "mock5", name: "EMME Mock 5" };
  const tenantLoading = false;

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
  // Mock styling and features for development
  const primaryColor = "#1f2937";
  const secondaryColor = "#3b82f6";
  const logo = null;
  const brandName = "EMME Engage";
  
  // Feature flags - all enabled for demo
  const hasProjectManagement = true;
  const hasPartnershipAnalytics = true;
  const hasMarketIntelligence = true;
  const hasRegulatoryInsights = true;
  const hasCompetitiveAnalysis = true;

  // Mock usage and analytics data for development
  const usage = null;
  const usageLoading = false;
  const analytics = null;
  const analyticsLoading = false;

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
        return <EMMEComprehensiveProjectCreator />;
      case "smart-wizard":
        return <EMMEComprehensiveProjectCreator />;
      case "projects":
        return <SimpleProjectManager />;
      case "view-projects":
        return <SimpleProjectManager />;
      
      // Project Insights - new main section
      case "project-insights":
        const renderInsightsContent = () => {
          if (insightsTab === 'scope') {
            return (
              <div className="bg-white rounded-lg shadow-sm border p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center">
                    <span className="text-gray-600 text-sm">📋</span>
                  </div>
                  <h2 className="text-xl font-semibold text-red-500">Scope</h2>
                </div>
                
                <div className="space-y-8">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Competitive Analysis</h3>
                    <ul className="space-y-1 text-gray-700 ml-4">
                      <li>• Landscape review of non-hormonal, hormonal, OTC, and natural alternatives</li>
                      <li>• SWOT analyses for key competitors</li>
                      <li>• Assessment of clinical positioning, messaging, patient targeting, and promotional strategies</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Pricing Models</h3>
                    <ul className="space-y-1 text-gray-700 ml-4">
                      <li>• Evaluation of pricing strategies and structures across US, UK, and EU markets</li>
                      <li>• Competitive benchmarking and price sensitivity analysis</li>
                      <li>• Recommendations for pricing frameworks that support access and adoption</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Persona Development</h3>
                    <ul className="space-y-1 text-gray-700 ml-4">
                      <li>• Creation of patient personas reflecting demographics, psychographics, treatment preferences, and barriers</li>
                      <li>• Development of provider personas including specialty types, decision drivers, and prescribing behaviors</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Messaging Framework</h3>
                    <ul className="space-y-1 text-gray-700 ml-4">
                      <li>• Development of core messaging pillars for patients, providers, and payers</li>
                      <li>• Adaptation of messaging to reflect cultural and regulatory differences across markets</li>
                      <li>• Identification of potential areas for differentiated storytelling and education</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Market Access Strategy</h3>
                    <ul className="space-y-1 text-gray-700 ml-4">
                      <li>• Assessment of reimbursement pathways and access requirements by market</li>
                      <li>• Recommendations for evidence generation, HEOR (Health Economics and Outcomes Research) support, and stakeholder engagement</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Go-to-Market Models</h3>
                    <ul className="space-y-1 text-gray-700 ml-4">
                      <li>• Development of launch models tailored to the dynamics of each region</li>
                      <li>• Channel strategy recommendations (digital, in-person, hybrid)</li>
                      <li>• Tactical launch planning support aligned to market nuances</li>
                    </ul>
                  </div>
                </div>
              </div>
            );
          }
          
          // Overview tab content
          return (
            <div className="bg-white rounded-lg shadow-sm border p-8">
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center">
                    <span className="text-gray-600 text-sm">U</span>
                  </div>
                  <h2 className="text-xl font-semibold text-red-500">Non-Hormonal Treatment Launch Preparation</h2>
                </div>
              </div>
              
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Background</h3>
                <p className="text-gray-700 mb-4">
                  Global pharmaceutical company is preparing to launch new non-hormonal treatment for moderate to severe vasomotor 
                  symptoms (VMS) associated with menopause. Product will launch simultaneously across US, UK, and EU markets.
                </p>
                <p className="text-gray-700 mb-6">
                  Current landscape includes one direct non-hormonal competitor already in the market, alongside several hormonal 
                  therapies and a variety of over-the-counter and natural remedies. As patient and provider expectations evolve, there is 
                  an opportunity to position the new treatment strategically to address unmet needs, differentiate from existing options, 
                  and maximize market penetration at launch.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Project Objectives</h3>
                <p className="text-gray-700 mb-4">To support successful launch, we will conduct a comprehensive launch readiness initiative designed to:</p>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-gray-400 mt-1">•</span>
                    <span>Understand the competitive landscape across all target markets</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-gray-400 mt-1">•</span>
                    <span>Clarify the value proposition for patients, providers, and payers</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-gray-400 mt-1">•</span>
                    <span>Build compelling messaging that resonates across segments</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-gray-400 mt-1">•</span>
                    <span>Ensure optimal market access and uptake strategies are in place</span>
                  </li>
                </ul>
              </div>
            </div>
          );
        };
        
        return <div className="p-6">
          <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold text-gray-900">Project Insights</h1>
              <Button className="bg-red-500 hover:bg-red-600 text-white px-6">
                Activate
              </Button>
            </div>
            
            {/* Tab Navigation */}
            <div className="border-b border-gray-200 mb-8">
              <div className="flex space-x-8">
                <button 
                  onClick={() => setInsightsTab('overview')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                    insightsTab === 'overview'
                      ? 'border-red-500 text-red-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Overview
                </button>
                <button 
                  onClick={() => setInsightsTab('scope')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                    insightsTab === 'scope'
                      ? 'border-red-500 text-red-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Scope
                </button>
                <button 
                  onClick={() => setInsightsTab('timeline')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                    insightsTab === 'timeline'
                      ? 'border-red-500 text-red-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Timeline
                </button>
              </div>
            </div>
            
            {projectContext && renderInsightsContent()}
          </div>
        </div>;

      // Project Framework sections
      case "background":
        return <div className="p-6">
          <div className="max-w-6xl mx-auto">
            <div className="mb-6">
              <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                <span>Framework</span>
                <span>→</span>
                <span className="font-medium text-purple-600">Background</span>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Background</h1>
              <p className="text-gray-600">Comprehensive pharmaceutical intelligence and market analysis</p>
            </div>
            
            {projectContext && (
              <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
                <div className="flex items-center gap-4 mb-4">
                  <h2 className="text-2xl font-bold text-gray-900">{projectContext.name}</h2>
                  <Badge className="bg-purple-100 text-purple-700">
                    {projectContext.therapeuticArea}
                  </Badge>
                </div>
                <p className="text-gray-600 mb-4">{projectContext.patientPopulation}</p>
              </div>
            )}
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <span className="text-blue-600 font-semibold">CE</span>
                  </div>
                  Mechanism & CE
                </h3>
                <p className="text-gray-600 mb-4">
                  PRODUCT A is a dual neurokinin-1 (NK-1) and neurokinin-3 (NK-3) receptor antagonist, 
                  targeting key players in thermoregulation and reproductive hormonal signaling during menopause.
                </p>
                <div className="space-y-2">
                  <h4 className="font-medium text-gray-900">Phase 1 & 2 Trials:</h4>
                  <p className="text-sm text-gray-600">
                    Studies established safety, pharmacokinetics, and pharmacodynamics, 
                    confirming oral bioavailability and tolerability in healthy women.
                  </p>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <span className="text-green-600 font-semibold">TD</span>
                  </div>
                  Tolerability & Delivery
                </h3>
                <p className="text-gray-600 mb-4">
                  Mild, placebo-like side effect profile across all phases of clinical development, 
                  with consistently well-tolerated dosing.
                </p>
                <div className="space-y-2">
                  <h4 className="font-medium text-gray-900">Safety Profile:</h4>
                  <p className="text-sm text-gray-600">
                    Most frequently reported: Headache, Nausea, Fatigue, Nasopharyngitis. 
                    No hepatotoxicity or endometrial risk observed.
                  </p>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                    <span className="text-orange-600 font-semibold">UN</span>
                  </div>
                  Unmet Need
                </h3>
                <p className="text-gray-600 mb-4">
                  Significant proportion of women in both U.S. and U.K. opt out of hormone therapy (HT) 
                  for menopause symptoms due to associated risk concerns.
                </p>
                <div className="space-y-2">
                  <h4 className="font-medium text-gray-900">Market Statistics:</h4>
                  <p className="text-sm text-gray-600">
                    U.S.: 1.8% to 4.7% HT usage • U.K.: ~10% usage
                  </p>
                </div>
              </div>
            </div>
            
            <div className="mt-8 flex justify-between items-center">
              <Button variant="outline" disabled>
                ← Previous
              </Button>
              <div className="flex gap-2">
                <Button 
                  onClick={() => {
                    sessionStorage.setItem(`project-${projectContext?.id}-last-section`, 'exploration');
                    setActiveView('exploration');
                  }}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  Next: Exploration →
                </Button>
              </div>
            </div>
          </div>
        </div>;
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
        
      // Framework sections for project-specific navigation
      case "exploration":
      case "research-hub":
        return <div className="p-6">
          <div className="max-w-6xl mx-auto">
            <div className="mb-6">
              <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                <span>Framework</span>
                <span>→</span>
                <span className="font-medium text-purple-600">Exploration</span>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Exploration</h1>
              <p className="text-gray-600">Advanced research and competitive intelligence platform for in-depth market exploration and strategic analysis.</p>
            </div>
            
            {projectContext && (
              <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
                <div className="flex items-center gap-4 mb-4">
                  <h2 className="text-2xl font-bold text-gray-900">{projectContext.name}</h2>
                  <Badge className="bg-purple-100 text-purple-700">
                    {projectContext.therapeuticArea}
                  </Badge>
                </div>
                <p className="text-gray-600 mb-4">{projectContext.patientPopulation}</p>
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Market Research</h3>
                <p className="text-gray-600 mb-4">Deep dive into market dynamics and opportunities</p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Market size and growth projections</li>
                  <li>• Patient population analysis</li>
                  <li>• Treatment pathway mapping</li>
                  <li>• Regulatory landscape review</li>
                </ul>
              </div>
              <div className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Competitive Analysis</h3>
                <p className="text-gray-600 mb-4">Comprehensive competitive landscape mapping</p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Competitor product profiles</li>
                  <li>• Pipeline analysis</li>
                  <li>• Market positioning</li>
                  <li>• SWOT analysis</li>
                </ul>
              </div>
              <div className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Strategic Insights</h3>
                <p className="text-gray-600 mb-4">AI-powered strategic recommendations and forecasting</p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Market entry strategies</li>
                  <li>• Risk assessment</li>
                  <li>• Opportunity identification</li>
                  <li>• Scenario planning</li>
                </ul>
              </div>
            </div>
            
            <div className="mt-8 flex justify-between items-center">
              <Button 
                variant="outline"
                onClick={() => {
                  sessionStorage.setItem(`project-${projectContext?.id}-last-section`, 'background');
                  setActiveView('background');
                }}
              >
                ← Back: Background
              </Button>
              <div className="flex gap-2">
                <Button 
                  onClick={() => {
                    sessionStorage.setItem(`project-${projectContext?.id}-last-section`, 'human-insights');
                    setActiveView('human-insights');
                  }}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  Next: Human Insights →
                </Button>
              </div>
            </div>
          </div>
        </div>;
      
      case "human-insights":
        return <div className="p-6">
          <div className="max-w-6xl mx-auto">
            <div className="mb-6">
              <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                <span>Framework</span>
                <span>→</span>
                <span className="font-medium text-purple-600">Human Insights</span>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Human Insights</h1>
              <p className="text-gray-600">Human-centered intelligence combining behavioral analytics, stakeholder insights, and patient journey mapping.</p>
            </div>
            
            {projectContext && (
              <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
                <div className="flex items-center gap-4 mb-4">
                  <h2 className="text-2xl font-bold text-gray-900">{projectContext.name}</h2>
                  <Badge className="bg-purple-100 text-purple-700">
                    {projectContext.therapeuticArea}
                  </Badge>
                </div>
                <p className="text-gray-600 mb-4">{projectContext.patientPopulation}</p>
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Patient Journey Mapping</h3>
                <p className="text-gray-600 mb-4">Comprehensive patient experience and touchpoint analysis</p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Pre-diagnosis awareness</li>
                  <li>• Healthcare provider interactions</li>
                  <li>• Treatment decision factors</li>
                  <li>• Post-treatment outcomes</li>
                </ul>
              </div>
              <div className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Stakeholder Analysis</h3>
                <p className="text-gray-600 mb-4">Key stakeholder identification and engagement strategies</p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Healthcare professionals</li>
                  <li>• Patient advocacy groups</li>
                  <li>• Payers and regulators</li>
                  <li>• Key opinion leaders</li>
                </ul>
              </div>
              <div className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Behavioral Analytics</h3>
                <p className="text-gray-600 mb-4">Human behavior patterns and decision-making insights</p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Treatment adherence patterns</li>
                  <li>• Decision-making triggers</li>
                  <li>• Communication preferences</li>
                  <li>• Engagement optimization</li>
                </ul>
              </div>
            </div>
            
            <div className="mt-8 flex justify-between items-center">
              <Button 
                variant="outline"
                onClick={() => {
                  sessionStorage.setItem(`project-${projectContext?.id}-last-section`, 'exploration');
                  setActiveView('exploration');
                }}
              >
                ← Back: Exploration
              </Button>
              <div className="flex gap-2">
                <Button 
                  variant="outline"
                  disabled
                >
                  Complete Framework ✓
                </Button>
              </div>
            </div>
          </div>
        </div>;
      
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