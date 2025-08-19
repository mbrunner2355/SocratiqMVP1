import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Home, 
  Users, 
  Plus, 
  FolderOpen, 
  MessageCircle, 
  Bell, 
  Search,
  Settings,
  HelpCircle,
  ChevronDown,
  ChevronRight,
  Brain,
  Target,
  BookOpen,
  Shield,
  BarChart3,
  User,
  Calendar,
  FileText,
  Lightbulb,
  TrendingUp,
  Heart,
  Zap,
  Activity,
  Database,
  Network,
  Cpu,
  GitBranch,
  Bot,
  Send,
  Loader2
} from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useTenantStyling } from "@/components/TenantProvider";
import { useAuth } from "@/hooks/useAuth";
import emmeEngageLogo from "@/assets/emme-engage-logo.png";
import { detectPartnerContext, getPartnerBrand } from "@shared/partner-branding";

interface EMMELayoutProps {
  children: React.ReactNode;
  activeView?: string;
  onViewChange?: (view: string) => void;
}

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  hasSubmenu?: boolean;
  submenuItems?: NavItem[];
}

interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'emme';
  timestamp: Date;
  isTyping?: boolean;
}

export function EMMELayout({ children, activeView = "home", onViewChange }: EMMELayoutProps) {
  const [activeNav, setActiveNav] = useState(activeView);
  const [expandedMenus, setExpandedMenus] = useState<string[]>(["projects"]);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      content: "Hi! I'm EMME, your pharmaceutical marketing intelligence assistant. How can I help you optimize your campaigns today?",
      sender: 'emme',
      timestamp: new Date(),
    }
  ]);
  const [currentMessage, setCurrentMessage] = useState('');
  const { primaryColor, brandName } = useTenantStyling();
  const { user } = useAuth();
  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Get EMME Connect branding configuration
  const partnerId = detectPartnerContext();
  const brand = getPartnerBrand(partnerId);
  const isEMMEEngage = partnerId === 'emme-engage';

  // Check if user is admin - only admins should see Corpus, Pipeline, Models, Trust
  const isAdmin = user?.email === 'vinnyc2306@gmail.com' || user?.role === 'admin';

  // Chat functionality
  const chatMutation = useMutation({
    mutationFn: async (message: string) => {
      return apiRequest('/api/public/emme-question', {
        method: 'POST',
        body: {
          question: message,
          context: `EMME Engage pharmaceutical marketing platform - Current view: ${activeView}`,
          agentId: 'emme-engage'
        }
      });
    },
    onSuccess: (response) => {
      // Remove typing indicator
      setChatMessages(prev => prev.filter(msg => !msg.isTyping));
      
      // Add EMME's response
      const emmeResponse: ChatMessage = {
        id: Date.now().toString(),
        content: response.result || response.message || "I'm here to help with your pharmaceutical marketing needs.",
        sender: 'emme',
        timestamp: new Date(),
      };
      setChatMessages(prev => [...prev, emmeResponse]);
    },
    onError: (error) => {
      // Remove typing indicator
      setChatMessages(prev => prev.filter(msg => !msg.isTyping));
      
      // Add error message
      const errorResponse: ChatMessage = {
        id: Date.now().toString(),
        content: "I'm experiencing some technical difficulties. Please try again or contact support if the issue persists.",
        sender: 'emme',
        timestamp: new Date(),
      };
      setChatMessages(prev => [...prev, errorResponse]);
    }
  });

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  // Focus input when chat opens
  useEffect(() => {
    if (isChatOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isChatOpen]);

  const handleSendMessage = () => {
    if (!currentMessage.trim() || chatMutation.isPending) return;

    // Add user message
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: currentMessage.trim(),
      sender: 'user',
      timestamp: new Date(),
    };
    setChatMessages(prev => [...prev, userMessage]);

    // Add typing indicator
    const typingIndicator: ChatMessage = {
      id: 'typing',
      content: 'EMME is thinking...',
      sender: 'emme',
      timestamp: new Date(),
      isTyping: true,
    };
    setChatMessages(prev => [...prev, typingIndicator]);

    // Send to API
    chatMutation.mutate(currentMessage.trim());
    setCurrentMessage('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSuggestedAction = (action: string) => {
    setCurrentMessage(action);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const allNavigationItems: NavItem[] = [
    {
      id: "home",
      label: "Home",
      icon: <Home className="w-5 h-5" />
    },
    {
      id: "projects",
      label: "Projects",
      icon: <FolderOpen className="w-5 h-5" />
    },

    {
      id: "clients",
      label: "Clients", 
      icon: <Users className="w-5 h-5" />
    },
    {
      id: "create-project",
      label: "Create new project",
      icon: <Plus className="w-5 h-5" />
    },
    {
      id: "smart-wizard",
      label: "Smart Wizard",
      icon: <Zap className="w-5 h-5" />
    },
    {
      id: "strategic-intelligence",
      label: "Strategic Intelligence",
      icon: <Brain className="w-5 h-5" />,
      hasSubmenu: true,
      submenuItems: [
        { id: "market-intelligence", label: "Market Intelligence", icon: <TrendingUp className="w-4 h-4" /> },
        { id: "payer-landscape", label: "Payer & Regulatory Monitor", icon: <Shield className="w-4 h-4" /> },
        { id: "competitive-analysis", label: "Competitive Intelligence", icon: <Target className="w-4 h-4" /> },
        { id: "scenario-modeling", label: "Strategic Scenario Modeling", icon: <BarChart3 className="w-4 h-4" /> }
      ]
    },
    {
      id: "stakeholder-engagement",
      label: "Stakeholder Engagement",
      icon: <Users className="w-5 h-5" />,
      hasSubmenu: true,
      submenuItems: [
        { id: "hcp-engagement", label: "HCP Engagement", icon: <User className="w-4 h-4" /> },
        { id: "patient-programs", label: "Patient Programs", icon: <Heart className="w-4 h-4" /> },
        { id: "payer-relations", label: "Payer Relations", icon: <Shield className="w-4 h-4" /> },
        { id: "kol-management", label: "KOL Management", icon: <Users className="w-4 h-4" /> }
      ]
    },
    {
      id: "content-orchestration",
      label: "Content Orchestration",
      icon: <FileText className="w-5 h-5" />,
      hasSubmenu: true,
      submenuItems: [
        { id: "mlr-workflow", label: "MLR Workflow", icon: <Activity className="w-4 h-4" /> },
        { id: "content-optimization", label: "Content Optimization", icon: <Zap className="w-4 h-4" /> },
        { id: "multilingual-campaigns", label: "Multilingual Campaigns", icon: <Target className="w-4 h-4" /> },
        { id: "compliance-monitoring", label: "Compliance Monitoring", icon: <FileText className="w-4 h-4" /> }
      ]
    },
    {
      id: "equity-access",
      label: "Equity & Access",
      icon: <Shield className="w-5 h-5" />,
      hasSubmenu: true,
      submenuItems: [
        { id: "disparity-mapping", label: "Health Disparity Mapping", icon: <BarChart3 className="w-4 h-4" /> },
        { id: "access-barriers", label: "Access Barrier Analysis", icon: <Shield className="w-4 h-4" /> },
        { id: "localized-strategies", label: "Localized Strategies", icon: <Target className="w-4 h-4" /> },
        { id: "equity-metrics", label: "Equity Performance Metrics", icon: <TrendingUp className="w-4 h-4" /> }
      ]
    },
    {
      id: "corpus",
      label: "Corpus",
      icon: <Database className="w-5 h-5" />
    },
    {
      id: "data-platform",
      label: "Data Platform", 
      icon: <Database className="w-5 h-5" />,
      hasSubmenu: true,
      submenuItems: [
        { id: "data-ingestion", label: "Data Ingestion Hub", icon: <Activity className="w-4 h-4" /> },
        { id: "pipeline", label: "Data Pipeline", icon: <GitBranch className="w-4 h-4" /> },
        { id: "api-management", label: "API Management", icon: <Zap className="w-4 h-4" /> },
        { id: "tenant-management", label: "Tenant Management", icon: <Users className="w-4 h-4" /> },
        { id: "trace-units", label: "TraceUnits™ Audit", icon: <Shield className="w-4 h-4" /> }
      ]
    },
    {
      id: "models",
      label: "Models",
      icon: <Bot className="w-5 h-5" />
    },
    {
      id: "trust",
      label: "Trust",
      icon: <Shield className="w-5 h-5" />
    },

    {
      id: "chat",
      label: "Chat with emme",
      icon: <MessageCircle className="w-5 h-5" />
    },
    {
      id: "alerts",
      label: "Alerts",
      icon: <Bell className="w-5 h-5" />
    }
  ];

  // Filter navigation items based on user role
  const navigationItems = allNavigationItems.filter(item => {
    // Hide admin-only items from non-admin users
    const adminOnlyItems = ['corpus', 'data-platform', 'models', 'trust'];
    if (adminOnlyItems.includes(item.id) && !isAdmin) {
      return false;
    }
    return true;
  });

  const bottomNavItems: NavItem[] = [
    {
      id: "support",
      label: "Support",
      icon: <HelpCircle className="w-5 h-5" />
    },
    {
      id: "settings",
      label: "Settings",
      icon: <Settings className="w-5 h-5" />
    }
  ];

  const toggleSubmenu = (menuId: string) => {
    setExpandedMenus(prev => 
      prev.includes(menuId) 
        ? prev.filter(id => id !== menuId)
        : [...prev, menuId]
    );
  };

  const renderNavItem = (item: NavItem, isSubmenu = false) => {
    const isActive = activeNav === item.id;
    const isExpanded = expandedMenus.includes(item.id);

    return (
      <div key={item.id} className={`${isSubmenu ? "ml-4" : ""}`}>
        <button
          onClick={() => {
            if (item.id === "chat") {
              setIsChatOpen(!isChatOpen);
              return;
            }
            
            setActiveNav(item.id);
            onViewChange?.(item.id);
            
            if (item.hasSubmenu) {
              toggleSubmenu(item.id);
            } else if (item.id === "chat") {
              setIsChatOpen(true);
            } else if (onViewChange) {
              onViewChange(item.id);
            }
          }}
          className={`w-full flex items-center justify-between px-3 py-2.5 text-sm rounded-lg transition-colors ${
            isActive 
              ? "bg-gray-100 text-gray-900 font-medium" 
              : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
          }`}
        >
          <div className="flex items-center space-x-3">
            {item.icon}
            <span>{item.label}</span>
          </div>
          {item.hasSubmenu && (
            isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />
          )}
        </button>
        
        {item.hasSubmenu && isExpanded && item.submenuItems && (
          <div className="mt-1 space-y-1">
            {item.submenuItems.map(subItem => renderNavItem(subItem, true))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Left Sidebar */}
      <div className={`w-64 ${isEMMEEngage ? 'bg-stone-200' : 'bg-white'} border-r ${isEMMEEngage ? 'border-stone-300' : 'border-gray-200'} flex flex-col`}>
        {/* Logo */}
        <div className={`p-6 border-b ${isEMMEEngage ? 'border-stone-300' : 'border-gray-200'}`}>
          <div className="flex items-center justify-center mb-2">
            <img 
              src={emmeEngageLogo} 
              alt="EMME Engage - Pharmaceutical Marketing Intelligence"
              className="h-10 w-auto object-contain"
            />
          </div>
          <p className={`text-xs ${isEMMEEngage ? 'text-purple-500' : 'text-gray-500'} text-center`}>powered by SocratIQ</p>
        </div>

        {/* Navigation */}
        <ScrollArea className="flex-1 px-3 py-4">
          <nav className="space-y-1">
            {navigationItems.map(item => renderNavItem(item))}
          </nav>
        </ScrollArea>

        {/* Bottom Navigation */}
        <div className={`border-t ${isEMMEEngage ? 'border-stone-300' : 'border-gray-200'} p-3`}>
          <nav className="space-y-1">
            {bottomNavItems.map(item => renderNavItem(item))}
          </nav>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Top Header */}
        <header className={`${isEMMEEngage ? 'bg-stone-100' : 'bg-white'} border-b ${isEMMEEngage ? 'border-stone-300' : 'border-gray-200'} px-6 py-4`}>
          <div className="flex items-center justify-between">
            {/* Search Bar */}
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search"
                  className="pl-10 bg-gray-50 border-gray-200"
                />
              </div>
            </div>

            {/* Right Actions */}
            <div className="flex items-center space-x-3">
              <Button 
                className={isEMMEEngage ? "bg-purple-600 hover:bg-purple-700 text-white" : ""}
                style={!isEMMEEngage ? { backgroundColor: '#9B7FB8' } : {}}
                size="sm"
                onClick={() => {
                  setActiveNav("create-project");
                  onViewChange?.("create-project");
                }}
              >
                New Project
              </Button>
              <Button variant="outline" size="sm">
                <HelpCircle className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>

      {/* Right Chat Panel */}
      {isChatOpen && (
        <div className="w-80 bg-white border-l border-gray-200 flex flex-col">
          {/* Chat Header */}
          <div className="px-4 py-3 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className={`w-8 h-8 ${isEMMEEngage ? 'bg-gradient-to-br from-purple-400 to-amber-500' : 'bg-gradient-to-br from-blue-500 to-purple-600'} rounded-full flex items-center justify-center`}>
                  <MessageCircle className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">EMME Assistant</h3>
                  <p className="text-xs text-gray-500">Pharmaceutical Intelligence Agent</p>
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setIsChatOpen(false)}
              >
                ×
              </Button>
            </div>
          </div>

          {/* Chat Messages */}
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {chatMessages.map((message) => (
                <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] rounded-lg p-3 ${
                    message.sender === 'user' 
                      ? `${isEMMEEngage ? 'bg-purple-600' : 'bg-blue-600'} text-white` 
                      : 'bg-gray-100 text-gray-700'
                  }`}>
                    {message.isTyping ? (
                      <div className="flex items-center space-x-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span className="text-sm">{message.content}</span>
                      </div>
                    ) : (
                      <p className="text-sm">{message.content}</p>
                    )}
                    <div className={`text-xs mt-1 opacity-70 ${
                      message.sender === 'user' ? 'text-white' : 'text-gray-500'
                    }`}>
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              ))}
              
              {chatMessages.length === 1 && (
                <div className="space-y-2">
                  <p className="text-xs text-gray-500">Suggested actions:</p>
                  <div className="space-y-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full justify-start text-xs"
                      onClick={() => handleSuggestedAction("Analyze our current HCP engagement metrics and provide insights")}
                    >
                      <Brain className="w-3 h-3 mr-2" />
                      Analyze lived experience data
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full justify-start text-xs"
                      onClick={() => handleSuggestedAction("How can we optimize our HCP engagement strategy?")}
                    >
                      <Target className="w-3 h-3 mr-2" />
                      Optimize HCP engagement
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full justify-start text-xs"
                      onClick={() => handleSuggestedAction("Show me the latest equity and access metrics for our campaigns")}
                    >
                      <Heart className="w-3 h-3 mr-2" />
                      Review equity metrics
                    </Button>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>
          </ScrollArea>

          {/* Chat Input */}
          <div className="border-t border-gray-200 p-4">
            <div className="flex space-x-2">
              <Input
                ref={inputRef}
                value={currentMessage}
                onChange={(e) => setCurrentMessage(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Ask EMME anything..."
                className="text-sm"
                disabled={chatMutation.isPending}
              />
              <Button 
                size="sm" 
                onClick={handleSendMessage}
                disabled={!currentMessage.trim() || chatMutation.isPending}
                className={isEMMEEngage ? "bg-purple-600 hover:bg-purple-700 text-white" : ""}
                style={!isEMMEEngage ? { backgroundColor: '#9B7FB8' } : {}}
              >
                {chatMutation.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}