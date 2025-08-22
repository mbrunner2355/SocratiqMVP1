import { useState } from 'react'
import { EMMELayout } from './emme/EMMELayout'
import { EMMEHome } from './emme/EMMEHome'

// Component for Market Intelligence
const MarketIntelligence = () => (
  <div className="p-6">
    <h1 className="text-2xl font-bold mb-4">Market Intelligence</h1>
    <p className="text-gray-600 mb-6">Advanced market analysis and competitive intelligence for pharmaceutical marketing</p>
    
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="font-semibold mb-2">Market Analysis</h3>
        <p className="text-sm text-gray-600">Real-time market trends and opportunities</p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="font-semibold mb-2">Competitor Tracking</h3>
        <p className="text-sm text-gray-600">Monitor competitor activities and strategies</p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="font-semibold mb-2">Performance Metrics</h3>
        <p className="text-sm text-gray-600">Track campaign performance and ROI</p>
      </div>
    </div>
  </div>
);

// Component for Strategic Intelligence 
const StrategicIntelligence = () => (
  <div className="p-6">
    <h1 className="text-2xl font-bold mb-4">Strategic Intelligence</h1>
    <p className="text-gray-600 mb-6">Strategic insights and intelligence for pharmaceutical marketing campaigns</p>
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="font-semibold mb-2">Campaign Strategy</h3>
        <p className="text-sm text-gray-600">Develop data-driven campaign strategies</p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="font-semibold mb-2">Market Positioning</h3>
        <p className="text-sm text-gray-600">Optimize your market positioning</p>
      </div>
    </div>
  </div>
);

// Component for Projects
const EMMEProjects = () => (
  <div className="p-6">
    <h1 className="text-2xl font-bold mb-4">Projects</h1>
    <p className="text-gray-600 mb-6">Manage your pharmaceutical marketing projects and campaigns</p>
    
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="font-semibold mb-2">Active Projects</h3>
      <p className="text-sm text-gray-600">View and manage your current marketing projects</p>
    </div>
  </div>
);

// Component for Clients
const ClientsComponent = () => (
  <div className="p-6">
    <h1 className="text-2xl font-bold mb-4">Clients</h1>
    <p className="text-gray-600 mb-6">Manage client relationships and accounts</p>
    
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="font-semibold mb-2">Client Dashboard</h3>
      <p className="text-sm text-gray-600">Overview of all client accounts and relationships</p>
    </div>
  </div>
);

// Component for Chat with EMME
const ChatWithEMME = () => (
  <div className="p-6">
    <h1 className="text-2xl font-bold mb-4">Chat with EMME</h1>
    <p className="text-gray-600 mb-6">Interactive AI assistant for pharmaceutical marketing intelligence</p>
    
    <div className="bg-white p-6 rounded-lg shadow min-h-96">
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500">EMME AI Chat Interface - Coming Soon</p>
      </div>
    </div>
  </div>
);

// Component for Content Orchestration
const ContentOrchestration = () => (
  <div className="p-6">
    <h1 className="text-2xl font-bold mb-4">Content Orchestration</h1>
    <p className="text-gray-600 mb-6">MLR workflow and content management for pharmaceutical marketing</p>
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="font-semibold mb-2">MLR Workflow</h3>
        <p className="text-sm text-gray-600">Streamlined medical, legal, regulatory review process</p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="font-semibold mb-2">Content Library</h3>
        <p className="text-sm text-gray-600">Centralized content management and approval tracking</p>
      </div>
    </div>
  </div>
);

// Component for Stakeholder Engagement
const StakeholderEngagement = () => (
  <div className="p-6">
    <h1 className="text-2xl font-bold mb-4">Stakeholder Engagement</h1>
    <p className="text-gray-600 mb-6">HCP, patient, and payer relationship management and engagement strategies</p>
    
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="font-semibold mb-2">HCP Engagement</h3>
        <p className="text-sm text-gray-600">Healthcare professional outreach and education</p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="font-semibold mb-2">Patient Programs</h3>
        <p className="text-sm text-gray-600">Patient support and education initiatives</p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="font-semibold mb-2">Payer Relations</h3>
        <p className="text-sm text-gray-600">Payer engagement and market access strategies</p>
      </div>
    </div>
  </div>
);

// Component for Equity & Access
const EquityAccess = () => (
  <div className="p-6">
    <h1 className="text-2xl font-bold mb-4">Equity & Access</h1>
    <p className="text-gray-600 mb-6">Health equity analysis and access optimization for pharmaceutical products</p>
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="font-semibold mb-2">Health Equity Analysis</h3>
        <p className="text-sm text-gray-600">Analyze disparities in healthcare access and outcomes</p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="font-semibold mb-2">Access Optimization</h3>
        <p className="text-sm text-gray-600">Improve patient access to treatments and therapies</p>
      </div>
    </div>
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
      case 'clients':
        return <ClientsComponent />
      case 'chat':
        return <ChatWithEMME />
      case 'content-orchestration':
        return <ContentOrchestration />
      case 'strategic-intelligence':
        return <StrategicIntelligence />
      case 'stakeholder-engagement':
        return <StakeholderEngagement />
      case 'equity-access':
        return <EquityAccess />
      // Handle the Market Intelligence navigation
      case 'market-intelligence':
        return <MarketIntelligence />
      // Add any other navigation IDs that might be coming from the sidebar
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