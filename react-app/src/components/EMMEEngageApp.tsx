import { useState } from 'react'
import { EMMELayout } from './emme/EMMELayout'
import { EMMEHome } from './emme/EMMEHome'

// Simple component imports - replace with your actual components when available
const EMMEProjects = () => (
  <div className="p-6">
    <h1 className="text-2xl font-bold mb-4">EMME Projects</h1>
    <p className="text-gray-600">Project management interface</p>
  </div>
);

const ContentOrchestration = () => (
  <div className="p-6">
    <h1 className="text-2xl font-bold mb-4">Content Orchestration</h1>
    <p className="text-gray-600">MLR workflow and content management</p>
  </div>
);

const StrategicIntelligence = () => (
  <div className="p-6">
    <h1 className="text-2xl font-bold mb-4">Strategic Intelligence</h1>
    <p className="text-gray-600">Market analysis and competitive intelligence</p>
  </div>
);

const StakeholderEngagement = () => (
  <div className="p-6">
    <h1 className="text-2xl font-bold mb-4">Stakeholder Engagement</h1>
    <p className="text-gray-600">HCP, patient, and payer relationship management</p>
  </div>
);

const EquityAccess = () => (
  <div className="p-6">
    <h1 className="text-2xl font-bold mb-4">Equity & Access</h1>
    <p className="text-gray-600">Health equity analysis and access optimization</p>
  </div>
);

export function EMMEEngageApp() {
  const [activeView, setActiveView] = useState('home')

  const renderView = () => {
    switch (activeView) {
      case 'home':
        return <EMMEHome />
      case 'projects':
        return <EMMEProjects />
      case 'content-orchestration':
        return <ContentOrchestration />
      case 'strategic-intelligence':
        return <StrategicIntelligence />
      case 'stakeholder-engagement':
        return <StakeholderEngagement />
      case 'equity-access':
        return <EquityAccess />
      default:
        return <EMMEHome />
    }
  }

  return (
    <EMMELayout activeView={activeView} onViewChange={setActiveView}>
      {renderView()}
    </EMMELayout>
  )
}