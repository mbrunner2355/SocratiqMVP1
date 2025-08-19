import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { 
  Target,
  Search,
  Plus,
  Home,
  Lightbulb,
  Layout,
  Upload,
  Play,
  Map,
  BarChart3,
  FileText,
  Calendar,
  Users,
  Settings,
  MoreHorizontal,
  LogOut,
  MessageSquare,
  Send,
  Brain,
  TrendingUp,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  ArrowLeft
} from "lucide-react";
import { useDropzone } from "react-dropzone";

interface Project {
  id: string;
  projectTitle: string;
  client: string;
  team: string;
  summary: string;
  overview?: string;
  scope?: string;
  status: string;
  priority: string;
  type: string;
  phase?: string;
  therapeuticArea?: string;
  indication?: string;
}

interface EMMEProjectDetailViewProps {
  project: Project;
  onBackToProjects: () => void;
}

interface Document {
  id: string;
  name: string;
  type: string;
  dateUploaded: string;
  uploader: string;
  size?: string;
}

interface ChatMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  sources?: string[];
}

interface ResearchTab {
  id: string;
  label: string;
  isActive: boolean;
  isCompleted: boolean;
}

interface ContentSection {
  id: string;
  title: string;
  content: React.ReactNode;
  isExpanded?: boolean;
}

export function EMMEProjectDetailView({ project, onBackToProjects }: EMMEProjectDetailViewProps) {
  const [activeSection, setActiveSection] = useState("exploration");
  const [activeTab, setActiveTab] = useState("market-analysis");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    "tam": true, 
    "competitive-analysis": true, 
    "clinical-evidence": false, 
    "regulatory-pathway": false, 
    "commercial-strategy": false, 
    "unmet-need": true
  });

  const handleLogout = () => {
    localStorage.removeItem('partner-app');
    window.location.href = '/emme-engage';
  };

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  const handleSendMessage = () => {
    if (!chatInput.trim()) return;
    
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: chatInput,
      timestamp: new Date()
    };
    
    setChatMessages(prev => [...prev, userMessage]);
    
    // Simulate AI response based on context
    setTimeout(() => {
      const aiResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: getContextualResponse(chatInput, activeSection),
        timestamp: new Date(),
        sources: getRelevantSources(chatInput, activeSection)
      };
      setChatMessages(prev => [...prev, aiResponse]);
    }, 1000);
    
    setChatInput("");
  };

  const getContextualResponse = (input: string, section: string): string => {
    const lowerInput = input.toLowerCase();
    
    if (section === "exploration" && lowerInput.includes("market")) {
      return `For ${project.projectTitle} market analysis: The global ${project.indication} market is experiencing significant growth. Based on current data, the addressable market shows strong potential for ${project.client}'s position. Key competitive dynamics include established therapies and emerging alternatives.`;
    }
    
    if (lowerInput.includes("competition") || lowerInput.includes("competitive")) {
      return `Competitive landscape for ${project.projectTitle}: Current market leaders include established hormone therapy options and newer non-hormonal alternatives. Our positioning strategy focuses on differentiation through safety profile and efficacy in the target population.`;
    }
    
    if (lowerInput.includes("clinical") || lowerInput.includes("trial")) {
      return `Clinical evidence for ${project.projectTitle}: Phase 3 trials demonstrate statistically significant efficacy vs placebo. Safety profile shows favorable tolerability compared to existing options. Regulatory pathway is well-defined with clear endpoints.`;
    }
    
    return `Based on the ${project.projectTitle} project context, I can help analyze market dynamics, competitive positioning, regulatory requirements, or commercial strategy. What specific aspect would you like to explore?`;
  };

  const getRelevantSources = (input: string, section: string): string[] => {
    return [
      "https://clinicaltrials.gov",
      "https://fda.gov/guidance",
      "https://marketresearch.pharmaceutical.com"
    ];
  };

  const navigationItems = [
    { id: "exploration", label: "Exploration", icon: <Search className="w-4 h-4" /> },
    { id: "project-insights", label: "Project Insights", icon: <Lightbulb className="w-4 h-4" /> },
    { id: "framework", label: "Framework", icon: <Layout className="w-4 h-4" /> },
    { id: "background", label: "Background", icon: <FileText className="w-4 h-4" /> },
    { id: "human-insights", label: "Human Insights", icon: <Users className="w-4 h-4" /> },
    { id: "client-content", label: "Client Content", icon: <Upload className="w-4 h-4" /> },
    { id: "playground", label: "Playground", icon: <Play className="w-4 h-4" /> },
    { id: "strategy-map", label: "Strategy Map", icon: <Map className="w-4 h-4" /> },
    { id: "dashboard", label: "Dashboard", icon: <BarChart3 className="w-4 h-4" /> }
  ];

  const researchTabs: ResearchTab[] = [
    { id: "market-analysis", label: "Market Analysis", isActive: activeTab === "market-analysis", isCompleted: true },
    { id: "landscape", label: "Landscape", isActive: activeTab === "landscape", isCompleted: false },
    { id: "clinical-trials", label: "Clinical Trials", isActive: activeTab === "clinical-trials", isCompleted: false },
    { id: "regulatory", label: "Regulatory", isActive: activeTab === "regulatory", isCompleted: false },
    { id: "commercialization", label: "Commercialization", isActive: activeTab === "commercialization", isCompleted: false }
  ];

  const renderMainContent = () => {
    if (activeSection === "exploration") {
      return (
        <div className="space-y-6">
          {/* Research Tabs */}
          <div className="border-b">
            <div className="flex space-x-8">
              {researchTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap flex items-center space-x-2 ${
                    tab.isActive 
                      ? 'border-purple-500 text-purple-600' 
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <span>{tab.label}</span>
                  {tab.isCompleted && <div className="w-2 h-2 bg-green-500 rounded-full"></div>}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          {activeTab === "market-analysis" && (
            <div className="space-y-6">
              {/* Market Analysis Content */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader 
                    className="cursor-pointer"
                    onClick={() => toggleSection("tam")}
                  >
                    <CardTitle className="flex items-center justify-between">
                      <span>Total Addressable Market</span>
                      {expandedSections["tam"] ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                    </CardTitle>
                  </CardHeader>
                  {expandedSections["tam"] && (
                    <CardContent>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-gray-600">Global Market Size</p>
                            <p className="text-2xl font-bold text-gray-900">$2.1B</p>
                            <p className="text-xs text-green-600">↑ 8.3% CAGR</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">US Market</p>
                            <p className="text-2xl font-bold text-gray-900">$890M</p>
                            <p className="text-xs text-blue-600">42% of global</p>
                          </div>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 mb-2">Target Population</p>
                          <p className="text-sm">~1.3M women experiencing moderate to severe VMS in the US, with 64% seeking non-hormonal alternatives</p>
                        </div>
                      </div>
                    </CardContent>
                  )}
                </Card>

                <Card>
                  <CardHeader 
                    className="cursor-pointer"
                    onClick={() => toggleSection("competitive-analysis")}
                  >
                    <CardTitle className="flex items-center justify-between">
                      <span>Competitive Landscape</span>
                      {expandedSections["competitive-analysis"] ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                    </CardTitle>
                  </CardHeader>
                  {expandedSections["competitive-analysis"] && (
                    <CardContent>
                      <div className="space-y-4">
                        <div className="space-y-3">
                          <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                            <div>
                              <p className="font-medium">Hormone Therapy</p>
                              <p className="text-xs text-gray-600">Market Leader</p>
                            </div>
                            <Badge variant="outline" className="bg-red-100">58% share</Badge>
                          </div>
                          <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                            <div>
                              <p className="font-medium">Paroxetine</p>
                              <p className="text-xs text-gray-600">Non-hormonal</p>
                            </div>
                            <Badge variant="outline" className="bg-orange-100">12% share</Badge>
                          </div>
                          <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                            <div>
                              <p className="font-medium">Veozah Opportunity</p>
                              <p className="text-xs text-gray-600">Projected</p>
                            </div>
                            <Badge variant="outline" className="bg-blue-100">15% target</Badge>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  )}
                </Card>
              </div>
            </div>
          )}
        </div>
      );
    }

    return (
      <div className="text-center py-8">
        <p className="text-gray-600">Select a section from the sidebar to view content for {project.projectTitle}</p>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex h-screen">
        {/* Sidebar Navigation */}
        <div className="w-64 bg-white border-r border-gray-200">
          <div className="p-4 border-b">
            <Button 
              variant="ghost" 
              onClick={onBackToProjects}
              className="w-full justify-start mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Projects
            </Button>
            <div className="text-center">
              <h2 className="font-bold text-gray-900">{project.projectTitle}</h2>
              <p className="text-sm text-gray-600">{project.client} • {project.team}</p>
              <Badge variant="outline" className="mt-1">
                {project.status}
              </Badge>
            </div>
          </div>
          
          <nav className="p-4">
            <div className="space-y-2">
              {navigationItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                    activeSection === item.id 
                      ? 'bg-purple-100 text-purple-700' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {item.icon}
                  <span className="text-sm font-medium">{item.label}</span>
                </button>
              ))}
            </div>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex">
          <div className="flex-1 p-8">
            <div className="max-w-6xl">
              <div className="mb-6">
                <div className="flex items-center justify-between">
                  <h1 className="text-2xl font-bold text-gray-900">
                    {navigationItems.find(item => item.id === activeSection)?.label || 'Exploration'}
                  </h1>
                  {(activeSection === "exploration" || activeSection === "background") && (
                    <Button 
                      className="bg-gray-600 hover:bg-gray-700"
                      onClick={() => setActiveTab("market-analysis")}
                    >
                      Complete
                    </Button>
                  )}
                </div>
              </div>

              {renderMainContent()}
            </div>
          </div>
          
          {/* EMME Chat Panel */}
          <div className="w-80 border-l bg-gray-50">
            <div className="h-full flex flex-col">
              <div className="p-4 border-b bg-white">
                <h3 className="font-medium flex items-center">
                  <Brain className="w-5 h-5 mr-2 text-purple-600" />
                  EMME™ Research Assistant
                </h3>
                <p className="text-xs text-gray-600 mt-1">AI-powered pharmaceutical intelligence</p>
              </div>
              
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {chatMessages.length === 0 && (
                  <div className="text-center text-gray-500 mt-8">
                    <MessageSquare className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                    <p className="text-sm">Ask me about market data, competitive intelligence, or clinical research for {project.projectTitle}</p>
                  </div>
                )}
                
                {chatMessages.map((message) => (
                  <div key={message.id} className={`${message.type === 'user' ? 'ml-4' : 'mr-4'}`}>
                    <div className={`p-3 rounded-lg ${
                      message.type === 'user' 
                        ? 'bg-purple-600 text-white ml-auto' 
                        : 'bg-white border'
                    }`}>
                      <p className="text-sm">{message.content}</p>
                      {message.sources && (
                        <div className="mt-2 pt-2 border-t border-gray-200">
                          <p className="text-xs text-gray-500 mb-1">Sources:</p>
                          {message.sources.map((source, index) => (
                            <a 
                              key={index} 
                              href={source} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-xs text-blue-600 hover:underline flex items-center mb-1"
                            >
                              <ExternalLink className="w-3 h-3 mr-1" />
                              {source.replace('https://', '').split('/')[0]}
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {message.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                ))}
              </div>
              
              <div className="p-4 border-t bg-white">
                <div className="flex space-x-2">
                  <Input
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Ask about this project..."
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  />
                  <Button onClick={handleSendMessage}>
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}