import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Target,
  Brain,
  MessageSquare,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  FileText,
  Search,
  Plus,
  Settings,
  Home,
  MoreHorizontal,
  Upload,
  Download,
  Users,
  BarChart3,
  TrendingUp,
  Shield,
  Activity,
  Calendar,
  Clock,
  DollarSign
} from 'lucide-react';

interface ChatMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  sources?: string[];
}

interface Document {
  id: string;
  name: string;
  type: string;
  dateUploaded: string;
  uploader: string;
  size?: string;
}

export function VMSProjectPlatform() {
  const [activeSection, setActiveSection] = useState("project-insights");
  const [currentProject] = useState("VMS Global (Bayer)");
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

  const navigationItems = [
    { id: "project-insights", label: "Project Insights", icon: BarChart3 },
    { id: "framework", label: "Framework", icon: Target },
    { id: "background", label: "Background", icon: FileText },
    { id: "exploration", label: "Exploration", icon: Search },
    { id: "human-insights", label: "Human Insights", icon: Users },
    { id: "client-content", label: "Client Content", icon: Upload },
    { id: "playground", label: "Playground", icon: Brain },
    { id: "strategy-map", label: "Strategy Map", icon: TrendingUp },
    { id: "dashboard", label: "Dashboard", icon: Activity }
  ];

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
    
    // Simulate AI response
    setTimeout(() => {
      const aiResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: `Based on the VMS project data for Bayer, I can help you with market analysis, competitive intelligence, and strategic recommendations. What specific aspect would you like to explore?`,
        timestamp: new Date(),
        sources: ['VMS Market Analysis', 'Competitive Intelligence Report']
      };
      setChatMessages(prev => [...prev, aiResponse]);
    }, 1000);
    
    setChatInput("");
  };

  const documents: Document[] = [
    { id: "1", name: "VMS Market Analysis Q3 2024.pdf", type: "pdf", dateUploaded: "2024-10-15", uploader: "Sarah Chen", size: "2.4 MB" },
    { id: "2", name: "Competitive Landscape Report.docx", type: "docx", dateUploaded: "2024-10-12", uploader: "Mike Rodriguez", size: "1.8 MB" },
    { id: "3", name: "Clinical Trial Data Summary.xlsx", type: "xlsx", dateUploaded: "2024-10-10", uploader: "Dr. Lisa Kim", size: "945 KB" },
    { id: "4", name: "Regulatory Strategy Overview.pdf", type: "pdf", dateUploaded: "2024-10-08", uploader: "James Wilson", size: "3.2 MB" }
  ];

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'pdf': return <FileText className="w-4 h-4 text-red-500" />;
      case 'docx': return <FileText className="w-4 h-4 text-blue-500" />;
      case 'xlsx': return <FileText className="w-4 h-4 text-green-500" />;
      default: return <FileText className="w-4 h-4 text-gray-500" />;
    }
  };

  const renderMainContent = () => {
    // Exploration section with detailed content
    if (activeSection === "exploration") {
      return (
        <div className="space-y-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="market-analysis">Market Analysis</TabsTrigger>
              <TabsTrigger value="clinical-trials">Clinical Trials</TabsTrigger>
              <TabsTrigger value="regulatory">Regulatory</TabsTrigger>
              <TabsTrigger value="commercialization">Commercialization</TabsTrigger>
            </TabsList>
            
            {activeTab === "market-analysis" && (
              <div className="space-y-6">
                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
                  <div className="flex items-center justify-between cursor-pointer" onClick={() => toggleSection('tam')}>
                    <h3 className="text-lg font-semibold text-blue-900 flex items-center">
                      {expandedSections['tam'] ? <ChevronDown className="w-4 h-4 mr-2" /> : <ChevronRight className="w-4 h-4 mr-2" />}
                      Total Addressable Market (TAM) Analysis
                    </h3>
                  </div>
                  {expandedSections['tam'] && (
                    <div className="mt-4 space-y-4">
                      <div className="bg-white p-4 rounded border">
                        <h4 className="font-medium text-gray-900 mb-3">Global Market Sizing</h4>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                          <div className="text-center p-4 bg-purple-50 border border-purple-200 rounded">
                            <div className="text-2xl font-bold text-purple-600">$15B+</div>
                            <div className="text-sm text-purple-700">Global Menopause Market</div>
                          </div>
                          <div className="text-center p-4 bg-blue-50 border border-blue-200 rounded">
                            <div className="text-2xl font-bold text-blue-600">6M+</div>
                            <div className="text-sm text-blue-700">US Women with VMS</div>
                          </div>
                          <div className="text-center p-4 bg-green-50 border border-green-200 rounded">
                            <div className="text-2xl font-bold text-green-600">$4.2B</div>
                            <div className="text-sm text-green-700">US TAM Opportunity</div>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <h5 className="font-medium text-blue-700 mb-2">Market Opportunity</h5>
                            <div className="text-sm text-gray-600 space-y-1">
                              <p>• 15+ million menopausal women in US seeking treatment</p>
                              <p>• Only 1.8-4.7% currently using hormone therapy</p>
                              <p>• 90%+ unmet need for effective alternatives</p>
                              <p>• $290M+ annual supplement market indicates demand</p>
                              <p>• Growing awareness and destigmatization of menopause</p>
                            </div>
                          </div>
                          
                          <div>
                            <h5 className="font-medium text-blue-700 mb-2">Market Challenges</h5>
                            <div className="text-sm text-gray-600 space-y-1">
                              <p>• Slower than expected market uptake</p>
                              <p>• Provider hesitancy and adoption barriers</p>
                              <p>• Patient access and reimbursement challenges</p>
                              <p>• Education and awareness gaps</p>
                              <p>• Competition from hormone therapy alternatives</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-white p-4 rounded border">
                        <h4 className="font-medium text-gray-900 mb-3">Competitive Positioning vs. Veozah</h4>
                        
                        <div className="overflow-x-auto">
                          <table className="w-full text-sm border-collapse border border-gray-200">
                            <thead>
                              <tr className="bg-gray-50">
                                <th className="border border-gray-200 p-3 text-left font-medium">Aspect</th>
                                <th className="border border-gray-200 p-3 text-left font-medium">Veozah (Current Leader)</th>
                                <th className="border border-gray-200 p-3 text-left font-medium">Product A (Opportunity)</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <td className="border border-gray-200 p-3 font-medium text-purple-700">Mechanism</td>
                                <td className="border border-gray-200 p-3">NK3 receptor antagonist only</td>
                                <td className="border border-gray-200 p-3 text-green-600">Dual NK1/NK3 receptor antagonism</td>
                              </tr>
                              <tr className="bg-gray-25">
                                <td className="border border-gray-200 p-3 font-medium text-purple-700">Safety Profile</td>
                                <td className="border border-gray-200 p-3 text-red-600">Boxed Warning for liver injury, requires monitoring</td>
                                <td className="border border-gray-200 p-3 text-green-600">No boxed warning, improved safety profile</td>
                              </tr>
                              <tr>
                                <td className="border border-gray-200 p-3 font-medium text-purple-700">Efficacy Scope</td>
                                <td className="border border-gray-200 p-3">Primarily VMS (hot flashes)</td>
                                <td className="border border-gray-200 p-3 text-green-600">VMS + sleep + mood symptoms</td>
                              </tr>
                              <tr className="bg-gray-25">
                                <td className="border border-gray-200 p-3 font-medium text-purple-700">Market Performance</td>
                                <td className="border border-gray-200 p-3 text-red-600">Below expectations, revised down 52%</td>
                                <td className="border border-gray-200 p-3 text-blue-600">Opportunity for better market penetration</td>
                              </tr>
                              <tr>
                                <td className="border border-gray-200 p-3 font-medium text-purple-700">Pricing</td>
                                <td className="border border-gray-200 p-3">~$550/month list price</td>
                                <td className="border border-gray-200 p-3 text-blue-600">Competitive pricing opportunity</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </Tabs>
        </div>
      );
    }

    // Background section
    if (activeSection === "background") {
      return (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Initiative Overview - Product Background</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Mechanism & Clinical Evidence</h4>
                  <p className="text-sm text-gray-700 mb-3">
                    PRODUCT A is a dual neurokinin-1 (NK-1) and neurokinin-3 (NK-3) receptor antagonist, 
                    a novel, non-hormonal mechanism of action targeting KNDy neurons in the hypothalamus.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h5 className="font-medium text-gray-800 mb-2">Phase 1 & 2 Trials:</h5>
                      <p className="text-sm text-gray-600">
                        Established safety, pharmacokinetics, and pharmacodynamics, confirming oral 
                        bioavailability and tolerability in healthy women.
                      </p>
                    </div>
                    <div>
                      <h5 className="font-medium text-gray-800 mb-2">Phase 2b Results:</h5>
                      <p className="text-sm text-gray-600">
                        SWITCH-1 trial identified optimal 120 mg dose, showing statistically significant 
                        reduction in hot flash frequency and severity by week 4.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 border rounded-lg">
                    <p className="text-2xl font-bold text-blue-600">2</p>
                    <p className="text-sm text-gray-600">Clinical Trials</p>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <p className="text-2xl font-bold text-green-600">120mg</p>
                    <p className="text-sm text-gray-600">Optimal Dose</p>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <p className="text-2xl font-bold text-purple-600">Week 4</p>
                    <p className="text-sm text-gray-600">Efficacy Timeline</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    // Client Content section
    if (activeSection === "client-content") {
      return (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">Document Library</h2>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Upload className="w-4 h-4 mr-2" />
              Upload Document
            </Button>
          </div>
          
          <div className="bg-white rounded-lg border">
            <div className="p-4 border-b">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">Project Documents</h3>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Export All
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="p-4">
              <div className="grid grid-cols-4 gap-4 text-sm font-medium text-gray-600 mb-4">
                <div>Document Name</div>
                <div>Date Uploaded</div>
                <div>Uploaded By</div>
                <div>Actions</div>
              </div>
              
              {documents.map((doc) => (
                <div key={doc.id} className="grid grid-cols-4 gap-4 items-center py-3 border-b border-gray-100 last:border-b-0">
                  <div className="flex items-center space-x-3">
                    {getFileIcon(doc.type)}
                    <span className="text-sm font-medium">{doc.name}</span>
                  </div>
                  <div className="text-sm text-gray-600">{doc.dateUploaded}</div>
                  <div className="text-sm text-gray-600">{doc.uploader}</div>
                  <div className="flex justify-end">
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }

    // Other sections content
    switch (activeSection) {
      case "project-insights":
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Market Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-purple-600 mb-2">85%</div>
                  <p className="text-sm text-gray-600">Market readiness score</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Competitive Position</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600 mb-2">Strong</div>
                  <p className="text-sm text-gray-600">Vs. top 3 competitors</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">ROI Forecast</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600 mb-2">245%</div>
                  <p className="text-sm text-gray-600">3-year projection</p>
                </CardContent>
              </Card>
            </div>
          </div>
        );
        
      case "framework":
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Strategic Framework</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-medium">Go-to-Market Strategy</h4>
                    <ul className="text-sm text-gray-600 space-y-2">
                      <li>• Target patient segmentation</li>
                      <li>• HCP engagement strategy</li>
                      <li>• Payer value proposition</li>
                      <li>• Market access planning</li>
                    </ul>
                  </div>
                  <div className="space-y-4">
                    <h4 className="font-medium">Competitive Differentiation</h4>
                    <ul className="text-sm text-gray-600 space-y-2">
                      <li>• Safety profile advantages</li>
                      <li>• Efficacy positioning</li>
                      <li>• Convenience factors</li>
                      <li>• Cost-effectiveness</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );
        
      case "human-insights":
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Patient & Provider Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h4 className="font-medium mb-3">Patient Journey Analysis</h4>
                    <div className="bg-blue-50 p-4 rounded">
                      <p className="text-sm text-gray-700">
                        Understanding patient experience from symptom onset through treatment decision-making, 
                        including barriers to care and unmet needs.
                      </p>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium mb-3">Healthcare Provider Perspectives</h4>
                    <div className="bg-green-50 p-4 rounded">
                      <p className="text-sm text-gray-700">
                        Provider comfort levels, prescribing patterns, and educational needs around 
                        non-hormonal menopause treatments.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );
      
      case "dashboard":
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">Total Engagement</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">2,847</div>
                  <p className="text-xs text-green-600">+18% from last month</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">12.4%</div>
                  <p className="text-xs text-blue-600">+2.1% improvement</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">Cost per Lead</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">$24.50</div>
                  <p className="text-xs text-purple-600">-15% reduction</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">Campaign ROI</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">340%</div>
                  <p className="text-xs text-green-600">Above target</p>
                </CardContent>
              </Card>
            </div>
          </div>
        );
        
      default:
        return (
          <div className="text-center py-12">
            <div className="text-lg font-medium text-gray-900 mb-2">
              {navigationItems.find(item => item.id === activeSection)?.label}
            </div>
            <p className="text-gray-600">Content for this section coming soon</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-purple-800 text-white">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center space-x-3">
            <Target className="w-8 h-8" />
            <span className="text-xl font-bold">VMS Global Platform</span>
            <span className="text-xs bg-purple-600 px-2 py-1 rounded">Bayer Project</span>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input 
                placeholder="Search"
                className="pl-10 bg-white/10 border-white/20 text-white placeholder-white/60 w-64"
              />
            </div>
            <Button className="bg-orange-500 hover:bg-orange-600">
              <Plus className="w-4 h-4 mr-2" />
              New Analysis
            </Button>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white border-r border-gray-200 min-h-screen">
          <div className="p-4">
            {/* Project Selector */}
            <div className="mb-6">
              <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                <Home className="w-4 h-4 text-gray-600" />
                <span className="font-medium text-gray-900">{currentProject}</span>
              </div>
            </div>

            {/* Navigation Menu */}
            <nav className="space-y-2">
              {navigationItems.map((item) => {
                const IconComponent = item.icon;
                const isActive = activeSection === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveSection(item.id)}
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                      isActive 
                        ? 'bg-purple-100 text-purple-700' 
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    <IconComponent className="w-4 h-4" />
                    <span className="text-sm font-medium">{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex">
          <div className="flex-1 p-8">
            <div className="max-w-6xl">
              <div className="mb-6">
                <div className="flex items-center justify-between">
                  <h1 className="text-2xl font-bold text-gray-900">
                    {navigationItems.find(item => item.id === activeSection)?.label || 'Overview'}
                  </h1>
                  <Badge className="bg-green-100 text-green-800">Active Project</Badge>
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
                  EMME™ VMS Assistant
                </h3>
                <p className="text-xs text-gray-600 mt-1">AI-powered Bayer project intelligence</p>
              </div>
              
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {chatMessages.length === 0 && (
                  <div className="text-center text-gray-500 mt-8">
                    <MessageSquare className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                    <p className="text-sm">Ask me about VMS market data, competitive analysis, or clinical insights</p>
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
                            <div key={index} className="text-xs text-blue-600 mb-1">
                              {source}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="p-4 border-t bg-white">
                <div className="flex space-x-2">
                  <Textarea
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Ask about VMS market data, clinical trials, competitive analysis..."
                    className="flex-1 min-h-[40px] max-h-[120px]"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                  />
                  <Button 
                    onClick={handleSendMessage}
                    disabled={!chatInput.trim()}
                    size="icon"
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    <MessageSquare className="w-4 h-4" />
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