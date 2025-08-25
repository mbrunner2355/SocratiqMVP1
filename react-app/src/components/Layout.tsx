// src/components/Layout.tsx
import React, { useState, useEffect } from 'react';
import { Outlet, useLocation, Link } from 'react-router-dom';
import { useNavigationSetup, NavigationService } from '@/lib/navigation';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Menu, 
  X, 
  Settings, 
  LogOut,
  Brain,
  Bot,
  Network,
  Shield,
  Users,
  BarChart3,
  Target,
  Zap,
  Building2,
  Search,
  FileText,
  Clock,
  Eye,
  CheckCircle,
  AlertTriangle,
  Activity,
  Database,
  Cpu
} from 'lucide-react';

// Navigation item type
interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  category: string;
  submenu?: NavItem[];
}

// Mock user type - replace with your actual user type
interface User {
  firstName?: string;
  lastName?: string;
  email?: string;
}

const navigationItems: NavItem[] = [
  { 
    href: "/transform", 
    label: "Transform™", 
    icon: Zap, 
    category: "core",
    submenu: [
      { href: "/transform", label: "Document Processing", icon: FileText, category: "core" },
      { href: "/transform/nlp", label: "NLP Pipeline", icon: Brain, category: "core" },
      { href: "/transform/extraction", label: "Data Extraction", icon: Database, category: "core" }
    ]
  },
  { 
    href: "/mesh", 
    label: "Mesh™", 
    icon: Network, 
    category: "core",
    submenu: [
      { href: "/mesh", label: "Knowledge Mesh", icon: Network, category: "core" },
      { href: "/mesh/connections", label: "Entity Connections", icon: Target, category: "core" },
      { href: "/mesh/ontology", label: "Ontology Manager", icon: Brain, category: "core" }
    ]
  },
  { 
    href: "/trust", 
    label: "Trust", 
    icon: Shield, 
    category: "core",
    submenu: [
      { href: "/trust", label: "Trust Manager", icon: Shield, category: "core" },
      { href: "/sophie-impact-lens", label: "Sophie Impact Lens™", icon: Target, category: "core" },
      { href: "/risk-analyzer", label: "Risk Analyzer", icon: AlertTriangle, category: "core" }
    ]
  },
  { 
    href: "/agents", 
    label: "Agents", 
    icon: Users, 
    category: "core",
    submenu: [
      { href: "/agents", label: "Agent Manager", icon: Users, category: "core" },
      { href: "/agents/orchestration", label: "Orchestration", icon: Network, category: "core" },
      { href: "/agents/monitoring", label: "Monitoring", icon: Activity, category: "core" }
    ]
  },
  { 
    href: "/agentic-rag", 
    label: "Agentic RAG", 
    icon: Bot, 
    category: "core"
  },
  { 
    href: "/graphs", 
    label: "Knowledge Graphs", 
    icon: Network, 
    category: "core"
  },
  { 
    href: "/gnn", 
    label: "Graph Neural Networks", 
    icon: Brain, 
    category: "core"
  },
  { 
    href: "/llm-manager", 
    label: "LLM Manager", 
    icon: Cpu, 
    category: "core"
  },
  // EMME specific routes
  { 
    href: "/emme", 
    label: "EMME Connect™", 
    icon: Target, 
    category: "emme",
    submenu: [
      { href: "/emme/research-hub", label: "Research Hub", icon: Search, category: "emme" },
      { href: "/emme/competitive-intelligence", label: "Competitive Intelligence", icon: BarChart3, category: "emme" },
      { href: "/emme/regulatory-strategy", label: "Regulatory Strategy", icon: Shield, category: "emme" },
      { href: "/emme/market-access", label: "Market Access", icon: Target, category: "emme" },
      { href: "/emme/projects", label: "Projects", icon: Building2, category: "emme" }
    ]
  },
  { 
    href: "/vms", 
    label: "VMS Intelligence", 
    icon: Activity, 
    category: "vms"
  },
  { 
    href: "/sophie", 
    label: "Sophie™", 
    icon: Bot, 
    category: "sophie"
  }
];

export default function Layout() {
  // Set up navigation service
  useNavigationSetup();
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [expandedItem, setExpandedItem] = useState<string | null>(null);
  const location = useLocation();
  
  // Mock user - replace with actual user state
  const user: User = {
    firstName: 'Demo',
    lastName: 'User',
    email: 'demo@socratiq.ai'
  };

  const handleLogout = () => {
    NavigationService.logout();
  };

  const isItemActive = (item: NavItem): boolean => {
    if (item.href === location.pathname) return true;
    if (item.submenu) {
      return item.submenu.some(subItem => subItem.href === location.pathname);
    }
    return location.pathname.startsWith(item.href + '/');
  };

  const shouldShowSidebar = () => {
    // Hide sidebar on certain routes
    const hideSidebarRoutes = ['/login', '/register', '/emme-engage', '/emme-health'];
    return !hideSidebarRoutes.includes(location.pathname);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar Navigation */}
      {shouldShowSidebar() && (
        <>
          {/* Mobile overlay */}
          {isSidebarOpen && (
            <div 
              className="fixed inset-0 bg-black bg-opacity-50 z-10 lg:hidden"
              onClick={() => setIsSidebarOpen(false)}
            />
          )}
          
          {/* Sidebar */}
          <div className={`
            fixed lg:static inset-y-0 left-0 z-20 w-64 bg-white border-r border-gray-200 
            transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
            lg:translate-x-0 transition-transform duration-300 ease-in-out
            flex flex-col
          `}>
            {/* Header */}
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
                    <Brain className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h1 className="font-bold text-gray-900">SocratIQ™</h1>
                    <p className="text-xs text-gray-600">Transform Platform</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsSidebarOpen(false)}
                  className="lg:hidden"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Navigation */}
            <ScrollArea className="flex-1">
              <nav className="p-4">
                <div className="space-y-2">
                  {navigationItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = isItemActive(item);
                    const isExpanded = expandedItem === item.href;
                    const hasSubmenu = item.submenu && item.submenu.length > 0;

                    return (
                      <div key={item.href}>
                        {hasSubmenu ? (
                          <div>
                            <Button
                              variant="ghost"
                              className={`w-full justify-start ${
                                isActive ? 'bg-primary/10 text-primary' : 'text-gray-700 hover:bg-gray-100'
                              }`}
                              onClick={() => setExpandedItem(isExpanded ? null : item.href)}
                            >
                              <Icon className="w-4 h-4 mr-3" />
                              {item.label}
                            </Button>
                            {isExpanded && item.submenu && (
                              <div className="ml-6 mt-2 space-y-1">
                                {item.submenu.map((subItem) => {
                                  const SubIcon = subItem.icon;
                                  const isSubActive = subItem.href === location.pathname;
                                  
                                  return (
                                    <Link key={subItem.href} to={subItem.href}>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        className={`w-full justify-start ${
                                          isSubActive 
                                            ? 'bg-primary text-primary-foreground' 
                                            : 'text-gray-600 hover:bg-gray-100'
                                        }`}
                                      >
                                        <SubIcon className="w-3 h-3 mr-2" />
                                        {subItem.label}
                                      </Button>
                                    </Link>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        ) : (
                          <Link to={item.href}>
                            <Button
                              variant={isActive ? "default" : "ghost"}
                              className={`w-full justify-start ${
                                isActive 
                                  ? "bg-primary text-primary-foreground" 
                                  : "text-gray-700 hover:bg-gray-100"
                              }`}
                            >
                              <Icon className="w-4 h-4 mr-3" />
                              {item.label}
                            </Button>
                          </Link>
                        )}
                      </div>
                    );
                  })}
                </div>
              </nav>
            </ScrollArea>

            {/* User Profile */}
            <div className="p-4 border-t border-gray-200">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <span className="text-white text-sm font-medium">
                    {user?.firstName?.[0] || user?.email?.[0] || 'U'}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {user?.firstName} {user?.lastName}
                  </p>
                  <p className="text-xs text-gray-600 truncate">{user?.email}</p>
                </div>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" className="flex-1">
                  <Settings className="w-3 h-3 mr-1" />
                  Settings
                </Button>
                <Button variant="outline" size="sm" onClick={handleLogout}>
                  <LogOut className="w-3 h-3" />
                </Button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Header (for mobile menu button) */}
        {shouldShowSidebar() && (
          <div className="lg:hidden p-4 border-b border-gray-200 bg-white">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu className="w-4 h-4" />
            </Button>
          </div>
        )}

        {/* Page Content */}
        <main className="flex-1 overflow-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
}