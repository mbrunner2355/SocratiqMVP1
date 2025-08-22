import { useState } from 'react'
import { EMMELayout } from './emme/EMMELayout'
import { EMMEHome } from './emme/EMMEHome'

// Import all existing component files
import { MarketIntelligence } from './emme/MarketIntelligence'
import { StrategicIntelligence } from './emme/StrategicIntelligence'
import { EMMEProjects } from './emme/EMMEProjects'
import { ClientManager } from './emme/ClientManager'
import { ContentOrchestration } from './emme/ContentOrchestration'
import { StakeholderEngagement } from './emme/StakeholderEngagement'
import { EquityAccess } from './emme/EquityAccess'
import { CompetitiveIntelligence } from './emme/CompetitiveIntelligence'
import { ContentOptimization } from './emme/ContentOptimization'
import { ContentOrchestrationModule } from './emme/ContentOrchestrationModule'
import { CorpusPipelineModule } from './emme/CorpusPipelineModule'
import { DataIngestionHub } from './emme/DataIngestionHub'
import { DataPlatformModule } from './emme/DataPlatformModule'
import { EMMECreateProject } from './emme/EMMECreateProject'
import { EMMECrossProjectAnalytics } from './emme/EMMECrossProjectAnalytics'
import { EMMEDataSourcesDashboard } from './emme/EMMEDataSourcesDashboard'
import { EMMEHomeChat } from './emme/EMMEHomeChat'
import { EMMEIntelligenceBrief } from './emme/EMMEIntelligenceBrief'
import { EMMELayout as Layout } from './emme/EMMELayout'
import { EMMEProductionDashboard } from './emme/EMMEProductionDashboard'
import { EMMEProjectDetailView } from './emme/EMMEProjectDetailView'
import { EMMEProjectIntegration } from './emme/EMMEProjectIntegration'
import { EngagementStudio } from './emme/EngagementStudio'
import { EquityAccessModule } from './emme/EquityAccessModule'
import { EquityInfrastructure } from './emme/EquityInfrastructure'
import { HCPEngagement } from './emme/HCPEngagement'
import { InsightEngine } from './emme/InsightEngine'
import { LearningHub } from './emme/LearningHub'
import { MLRSubmissions } from './emme/MLRSubmissions'
import { MLRVisualization } from './emme/MLRVisualization'
import { PatientPrograms } from './emme/PatientPrograms'
import { PayerLandscape } from './emme/PayerLandscape'
import { ProjectDetails } from './emme/ProjectDetails'
import { ProjectManager } from './emme/ProjectManager'
import { ProjectWizard } from './emme/ProjectWizard'
import { StakeholderEngagementList } from './emme/StakeholderEngagementList'
import { StakeholderEngagementModule } from './emme/StakeholderEngagementModule'
import { StrategicIntelligenceModule } from './emme/StrategicIntelligenceModule'
import { StrategicIntelligenceOverview } from './emme/StrategicIntelligenceOverview'
import { VMSIntelligenceHub } from './emme/VMSIntelligenceHub'
import { VMSProjectPlatform } from './emme/VMSProjectPlatform'
import { WorkflowVisualization } from './emme/WorkflowVisualization'

export function EMMEEngageApp() {
  const [activeView, setActiveView] = useState('home')

  const renderView = () => {
    switch (activeView) {
      // Main Navigation Items
      case 'home':
        return <EMMEHome />
      case 'projects':
        return <EMMEProjects />
      case 'clients':
        return <ClientManager />
      case 'chat':
        return <EMMEHomeChat />
      case 'create-project':
        return <EMMECreateProject />
      case 'smart-wizard':
        return <ProjectWizard />
      
      // Strategic Intelligence (parent and submenu items)
      case 'strategic-intelligence':
        return <StrategicIntelligence />
      case 'market-intelligence':
        return <MarketIntelligence />
      case 'payer-landscape':
        return <PayerLandscape />
      case 'competitive-analysis':
        return <CompetitiveIntelligence />
      case 'scenario-modeling':
        return <StrategicIntelligenceOverview />
      
      // Stakeholder Engagement (parent and submenu items)
      case 'stakeholder-engagement':
        return <StakeholderEngagement />
      case 'hcp-engagement':
        return <HCPEngagement />
      case 'patient-programs':
        return <PatientPrograms />
      case 'payer-relations':
        return <PayerLandscape />
      case 'kol-management':
        return <StakeholderEngagementModule />
      
      // Content Orchestration (parent and submenu items)
      case 'content-orchestration':
        return <ContentOrchestration />
      case 'mlr-workflow':
        return <MLRVisualization />
      case 'content-optimization':
        return <ContentOptimization />
      case 'multilingual-campaigns':
        return <ContentOrchestrationModule />
      case 'compliance-monitoring':
        return <MLRSubmissions />
      
      // Equity & Access (parent and submenu items)
      case 'equity-access':
        return <EquityAccess />
      case 'disparity-mapping':
        return <EquityAccessModule />
      case 'access-barriers':
        return <EquityInfrastructure />
      case 'localized-strategies':
        return <EngagementStudio />
      case 'equity-metrics':
        return <EMMECrossProjectAnalytics />
      
      // Data Platform (parent and submenu items)
      case 'corpus':
        return <CorpusPipelineModule />
      case 'data-platform':
        return <DataPlatformModule />
      case 'data-ingestion':
        return <DataIngestionHub />
      case 'pipeline':
        return <WorkflowVisualization />
      case 'api-management':
        return <EMMEProjectIntegration />
      case 'tenant-management':
        return <ProjectManager />
      case 'trace-units':
        return <EMMEDataSourcesDashboard />
      
      // Other Navigation Items
      case 'models':
        return <StrategicIntelligenceModule />
      case 'trust':
        return <InsightEngine />
      case 'alerts':
        return <EMMEIntelligenceBrief />
      case 'support':
        return <LearningHub />
      case 'settings':
        return <EMMEProductionDashboard />
      
      // Additional project views
      case 'project-details':
        return <ProjectDetails />
      case 'vms-intelligence':
        return <VMSIntelligenceHub />
      case 'vms-platform':
        return <VMSProjectPlatform />
      
      default:
        console.log('Unknown view:', activeView); // Debug log
        return <EMMEHome />
    }
  }

  return (
    <EMMELayout activeView={activeView} onViewChange={setActiveView}>
      {renderView()}
    </EMMELayout>
  )
}