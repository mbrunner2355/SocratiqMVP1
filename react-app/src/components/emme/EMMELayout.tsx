import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { 
  Home,
  FolderOpen,
  Users,
  Plus,
  Zap,
  TrendingUp,
  MessageSquare,
  FileText,
  Heart,
  BarChart3,
  Settings,
  HelpCircle,
  ChevronDown,
  ChevronRight,
  Menu,
  X
} from 'lucide-react'

interface EMMELayoutProps {
  children: React.ReactNode
  activeView: string
  onViewChange: (view: string) => void
}

export function EMMELayout({ children, activeView, onViewChange }: EMMELayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [strategicIntelligenceOpen, setStrategicIntelligenceOpen] = useState(false)
  const [stakeholderEngagementOpen, setStakeholderEngagementOpen] = useState(false)
  const [contentOrchestrationOpen, setContentOrchestrationOpen] = useState(false)

  const navigationItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'projects', label: 'Projects', icon: FolderOpen },
    { id: 'clients', label: 'Clients', icon: Users },
    { id: 'create-project', label: 'Create new project', icon: Plus },
    { id: 'smart-wizard', label: 'Smart Wizard', icon: Zap },
  ]

  const moduleItems = [
    {
      id: 'strategic-intelligence',
      label: 'Strategic Intelligence',
      icon: TrendingUp,
      isOpen: strategicIntelligenceOpen,
      setOpen: setStrategicIntelligenceOpen,
      children: [
        { id: 'market-intelligence', label: 'Market Intelligence' },
        { id: 'payer-landscape', label: 'Payer Landscape' },
        { id: 'competitive-analysis', label: 'Competitive Analysis' },
        { id: 'scenario-modeling', label: 'Strategic Scenario Modeling' },
      ]
    },
    {
      id: 'stakeholder-engagement',
      label: 'Stakeholder Engagement',
      icon: MessageSquare,
      isOpen: stakeholderEngagementOpen,
      setOpen: setStakeholderEngagementOpen,
      children: [
        { id: 'hcp-engagement', label: 'HCP Engagement' },
        { id: 'patient-programs', label: 'Patient Programs' },
        { id: 'payer-relations', label: 'Payer Relations' },
        { id: 'kol-management', label: 'KOL Management' },
      ]
    },
    {
      id: 'content-orchestration',
      label: 'Content Orchestration',
      icon: FileText,
      isOpen: contentOrchestrationOpen,
      setOpen: setContentOrchestrationOpen,
      children: [
        { id: 'mlr-workflow', label: 'MLR Workflow' },
        { id: 'content-optimization', label: 'Content Optimization' },
        { id: 'multilingual-campaigns', label: 'Multilingual Campaigns' },
        { id: 'compliance-monitoring', label: 'Compliance Monitoring' },
      ]
    },
    { id: 'equity-access', label: 'Equity & Access', icon: Heart },
  ]

  const adminItems = [
    { id: 'data-platform', label: 'Data Platform', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'support', label: 'Support', icon: HelpCircle },
  ]

  const handleItemClick = (itemId: string) => {
    onViewChange(itemId)
    setSidebarOpen(false)
  }

  const renderNavItem = (item: any, isChild = false) => {
    const isActive = activeView === item.id
    const Icon = item.icon
    
    return (
      <button
        key={item.id}
        onClick={() => handleItemClick(item.id)}
        className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
          isActive
            ? 'bg-purple-100 text-purple-700'
            : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
        } ${isChild ? 'ml-4 pl-6' : ''}`}
      >
        {Icon && <Icon className="mr-3 h-4 w-4" />}
        {item.label}
      </button>
    )
  }

  const renderModuleItem = (module: any) => {
    const isActive = activeView === module.id
    const Icon = module.icon
    
    return (
      <div key={module.id}>
        <div className="flex items-center">
          <button
            onClick={() => handleItemClick(module.id)}
            className={`flex-1 flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
              isActive
                ? 'bg-purple-100 text-purple-700'
                : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
            }`}
          >
            <Icon className="mr-3 h-4 w-4" />
            {module.label}
          </button>
          {module.children && (
            <button
              onClick={() => module.setOpen(!module.isOpen)}
              className="p-1 text-gray-400 hover:text-gray-600"
            >
              {module.isOpen ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </button>
          )}
        </div>
        {module.children && module.isOpen && (
          <div className="mt-1 space-y-1">
            {module.children.map((child: any) => renderNavItem(child, true))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 flex z-40 md:hidden">
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white">
            <div className="absolute top-0 right-0 -mr-12 pt-2">
              <button
                className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                onClick={() => setSidebarOpen(false)}
              >
                <X className="h-6 w-6 text-white" />
              </button>
            </div>
            {/* Mobile sidebar content */}
            <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
              <div className="flex-shrink-0 flex items-center px-4">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">E</span>
                  </div>
                  <div>
                    <h1 className="text-lg font-bold text-gray-900">EMME Engage</h1>
                    <p className="text-xs text-gray-600">powered by SocratIQ</p>
                  </div>
                </div>
              </div>
              <nav className="mt-5 px-2 space-y-1">
                {navigationItems.map(item => renderNavItem(item))}
                <div className="pt-4">
                  <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Modules
                  </h3>
                  <div className="mt-2 space-y-1">
                    {moduleItems.map(module => renderModuleItem(module))}
                  </div>
                </div>
                <div className="pt-4">
                  <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Admin
                  </h3>
                  <div className="mt-2 space-y-1">
                    {adminItems.map(item => renderNavItem(item))}
                  </div>
                </div>
              </nav>
            </div>
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <div className="hidden md:flex md:flex-shrink-0">
        <div className="flex flex-col w-64">
          <div className="flex flex-col h-0 flex-1 bg-white border-r border-gray-200">
            <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
              <div className="flex items-center flex-shrink-0 px-4">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">E</span>
                  </div>
                  <div>
                    <h1 className="text-lg font-bold text-gray-900">EMME Engage</h1>
                    <p className="text-xs text-gray-600">powered by SocratIQ</p>
                  </div>
                </div>
              </div>
              <nav className="mt-5 flex-1 px-2 space-y-1">
                {navigationItems.map(item => renderNavItem(item))}
                <div className="pt-4">
                  <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Modules
                  </h3>
                  <div className="mt-2 space-y-1">
                    {moduleItems.map(module => renderModuleItem(module))}
                  </div>
                </div>
                <div className="pt-4">
                  <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Admin
                  </h3>
                  <div className="mt-2 space-y-1">
                    {adminItems.map(item => renderNavItem(item))}
                  </div>
                </div>
              </nav>
            </div>
            <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
              <Link to="/" className="flex-shrink-0 w-full group block">
                <Button variant="outline" className="w-full justify-start">
                  ← Back to SocratIQ
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        {/* Mobile header */}
        <div className="md:hidden">
          <div className="relative z-10 flex-shrink-0 flex h-16 bg-white shadow">
            <button
              className="px-4 border-r border-gray-200 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-purple-500 md:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-6 w-6" />
            </button>
            <div className="flex-1 px-4 flex justify-between">
              <div className="flex-1 flex">
                <div className="w-full flex md:ml-0">
                  <div className="relative w-full text-gray-400 focus-within:text-gray-600">
                    <div className="absolute inset-y-0 left-0 flex items-center pointer-events-none">
                      <span className="text-lg font-bold text-gray-900">EMME Engage</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="ml-4 flex items-center md:ml-6">
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  Active
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Main content area */}
        <main className="flex-1 relative overflow-y-auto focus:outline-none">
          {children}
        </main>
      </div>
    </div>
  )
}