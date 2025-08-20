import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import { EMMELayout } from './emme/EMMELayout'
import { EMMEHome } from './emme/EMMEHome'
import { EMMEProjects } from './emme/EMMEProjects'
import { ContentOrchestration } from './emme/ContentOrchestration'
import { StrategicIntelligence } from './emme/StrategicIntelligence'
import { StakeholderEngagement } from './emme/StakeholderEngagement'
import { EquityAccess } from './emme/EquityAccess'

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
      <Routes>
        <Route path="/" element={renderView()} />
        <Route path="/*" element={renderView()} />
      </Routes>
    </EMMELayout>
  )
}