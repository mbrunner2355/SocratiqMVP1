import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft,
  Brain,
  Target,
  Shield,
  TrendingUp,
  FileText,
  Users,
  BarChart3,
  MessageSquare,
  Search,
  Send,
  ChevronDown,
  ChevronRight
} from "lucide-react";

interface ChatMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  sources?: string[];
}

export function VMSIntelligenceHub({ onBack }: { onBack: () => void }) {
  const [activeSection, setActiveSection] = useState("research-hub");
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
    { id: "research-hub", label: "Research Hub", icon: Brain },
    { id: "competitive-intelligence", label: "Competitive Intelligence", icon: Target },
    { id: "regulatory-strategy", label: "Regulatory Strategy", icon: Shield },
    { id: "market-access", label: "Market Access", icon: TrendingUp },
    { id: "content-library", label: "Content Library", icon: FileText },
    { id: "client-management", label: "Client Management", icon: Users },
    { id: "analytics-dashboard", label: "Analytics Dashboard", icon: BarChart3 },
    { id: "projects", label: "Projects", icon: Target },
    { id: "questions", label: "Questions", icon: MessageSquare }
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
        content: `Based on the VMS pharmaceutical intelligence for Bayer, I can provide insights on market analysis, competitive positioning, and clinical development strategies. What specific aspect would you like to explore further?`,
        timestamp: new Date(),
        sources: ['VMS Market Analysis', 'Competitive Intelligence Report', 'Clinical Development Data']
      };
      setChatMessages(prev => [...prev, aiResponse]);
    }, 1000);
    
    setChatInput("");
  };

  const renderMainContent = () => {
    if (activeSection === "research-hub") {
      return (
        <div className="space-y-6">
          {/* Research Progress Tabs */}
          <div className="flex space-x-8 border-b overflow-x-auto">
            <button
              onClick={() => setActiveTab("market-analysis")}
              className={`pb-3 px-1 border-b-2 transition-colors whitespace-nowrap ${
                activeTab === "market-analysis"
                  ? 'border-purple-600 text-purple-600 font-medium' 
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Market Analysis ✓
            </button>
            <button
              onClick={() => setActiveTab("competitive-landscape")}
              className={`pb-3 px-1 border-b-2 transition-colors whitespace-nowrap ${
                activeTab === "competitive-landscape"
                  ? 'border-purple-600 text-purple-600 font-medium' 
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Competitive Landscape ✓
            </button>
            <button
              onClick={() => setActiveTab("regulatory-pathway")}
              className={`pb-3 px-1 border-b-2 transition-colors whitespace-nowrap ${
                activeTab === "regulatory-pathway"
                  ? 'border-purple-600 text-purple-600 font-medium' 
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Regulatory Pathway
            </button>
            <button
              onClick={() => setActiveTab("clinical-evidence")}
              className={`pb-3 px-1 border-b-2 transition-colors whitespace-nowrap ${
                activeTab === "clinical-evidence"
                  ? 'border-purple-600 text-purple-600 font-medium' 
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Clinical Evidence
            </button>
            <button
              onClick={() => setActiveTab("commercial-strategy")}
              className={`pb-3 px-1 border-b-2 transition-colors whitespace-nowrap ${
                activeTab === "commercial-strategy"
                  ? 'border-purple-600 text-purple-600 font-medium' 
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Commercial Strategy
            </button>
          </div>

          {/* Tab Content */}
          {activeTab === "market-analysis" && (
            <div className="space-y-6">
              <div className="bg-purple-50 border-l-4 border-purple-500 p-4 rounded-r-lg">
                <div className="flex items-center justify-between cursor-pointer" onClick={() => toggleSection('tam')}>
                  <h3 className="text-lg font-semibold text-purple-900 flex items-center">
                    {expandedSections.tam ? <ChevronDown className="w-4 h-4 mr-2" /> : <ChevronRight className="w-4 h-4 mr-2" />}
                    Total Addressable Market (TAM): Pharmaceutical Intelligence
                  </h3>
                </div>
                {expandedSections.tam && (
                  <div className="mt-4 space-y-4">
                    <div className="bg-white p-4 rounded border">
                      <h4 className="font-medium text-gray-900 mb-3">Total Addressable Market (TAM): Women Entering Menopause</h4>
                      
                      <div className="overflow-x-auto mb-4">
                        <table className="w-full text-sm border-collapse border border-gray-200">
                          <thead>
                            <tr className="bg-gray-50">
                              <th className="border border-gray-200 p-2 text-left">REGION</th>
                              <th className="border border-gray-200 p-2 text-left">WOMEN AGED 45-60</th>
                              <th className="border border-gray-200 p-2 text-left">ANNUAL ENTRY INTO MENOPAUSE</th>
                              <th className="border border-gray-200 p-2 text-left">NOTES</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td className="border border-gray-200 p-2 font-medium">U.S.</td>
                              <td className="border border-gray-200 p-2">~50M (total)</td>
                              <td className="border border-gray-200 p-2">~2M/year</td>
                              <td className="border border-gray-200 p-2">6,000 women/day enter menopause in U.S.</td>
                            </tr>
                            <tr>
                              <td className="border border-gray-200 p-2 font-medium">UK</td>
                              <td className="border border-gray-200 p-2">~7.4M</td>
                              <td className="border border-gray-200 p-2">~400K/year</td>
                              <td className="border border-gray-200 p-2">Average onset age: 51</td>
                            </tr>
                            <tr>
                              <td className="border border-gray-200 p-2 font-medium">EU5 (France, Germany, Italy, Spain, UK)</td>
                              <td className="border border-gray-200 p-2">~40M</td>
                              <td className="border border-gray-200 p-2">~3-4M/year</td>
                              <td className="border border-gray-200 p-2">High awareness in FR/DE, lower access in IT/ES</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                      
                      <div className="p-3 bg-blue-50 border border-blue-200 rounded mb-4">
                        <p className="text-sm text-blue-800">
                          About <strong>75% of women</strong> experience vasomotor symptoms (VMS), and <strong>25-30%</strong> have moderate-to-severe symptoms
                        </p>
                      </div>
                      
                      <div>
                        <h5 className="font-medium text-purple-700 mb-2">Serviceable Available Market (SAM)</h5>
                        <p className="text-sm text-gray-600 mb-2">Conservative filters: moderate-to-severe VMS, awareness, access, diagnosed:</p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="p-3 bg-gray-50 rounded border">
                            <div className="font-medium">U.S.</div>
                            <div className="text-lg font-bold text-purple-600">~10M-15M</div>
                            <div className="text-xs text-gray-600">Est. candidates for RX Product A</div>
                          </div>
                          <div className="p-3 bg-gray-50 rounded border">
                            <div className="font-medium">UK</div>
                            <div className="text-lg font-bold text-purple-600">~1.5M</div>
                            <div className="text-xs text-gray-600">Est. candidates for RX Product A</div>
                          </div>
                          <div className="p-3 bg-gray-50 rounded border">
                            <div className="font-medium">EU5 (w/o UK)</div>
                            <div className="text-lg font-bold text-purple-600">~6M-8M</div>
                            <div className="text-xs text-gray-600">Est. candidates for RX Product A</div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Patient Demographics Section */}
                    <div className="bg-white p-4 rounded border">
                      <h4 className="font-medium text-gray-900 mb-3">Patient Demographics & Segmentation</h4>
                      
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div>
                          <h5 className="font-medium text-purple-700 mb-2">Core Age Ranges</h5>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span>Natural menopause onset:</span>
                              <span className="font-medium">~51 years old (U.S.)</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Perimenopause:</span>
                              <span className="font-medium">~45-55</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Postmenopause:</span>
                              <span className="font-medium">55+ onwards</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Treatment-eligible:</span>
                              <span className="font-medium">40-65 years old</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Primary age range:</span>
                              <span className="font-medium text-blue-600">45-60 (seeking relief)</span>
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <h5 className="font-medium text-purple-700 mb-2">Key Patient Segments</h5>
                          <div className="space-y-2 text-xs">
                            <div className="p-2 bg-red-50 border-l-4 border-red-400 rounded">
                              <strong>Risk-Averse, Non-Hormone Seekers</strong>
                              <p>Avoiding estrogen due to medical history (breast cancer, clotting, stroke risk)</p>
                            </div>
                            <div className="p-2 bg-blue-50 border-l-4 border-blue-400 rounded">
                              <strong>Lifestyle-Oriented, Quality-of-Life Seekers</strong>
                              <p>Disrupted sleep, work stress, relationship strain due to symptoms</p>
                            </div>
                            <div className="p-2 bg-green-50 border-l-4 border-green-400 rounded">
                              <strong>Silent Strugglers</strong>
                              <p>Underdiagnosed, don't talk to HCPs, think symptoms are "just aging"</p>
                            </div>
                            <div className="p-2 bg-purple-50 border-l-4 border-purple-400 rounded">
                              <strong>Highly Proactive Health Managers</strong>
                              <p>Health-literate, digitally engaged, exploring new treatments</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === "competitive-landscape" && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Competitive Intelligence</CardTitle>
                  <CardDescription>Comprehensive competitor analysis and market positioning</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">Advanced competitive intelligence for pharmaceutical market positioning.</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-medium mb-2">Competitor Analysis</h4>
                      <p className="text-sm text-gray-600">Real-time monitoring of competitor activities</p>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-medium mb-2">Market Positioning</h4>
                      <p className="text-sm text-gray-600">Strategic positioning recommendations</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "regulatory-pathway" && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Regulatory Strategy</CardTitle>
                  <CardDescription>FDA pathway planning and regulatory compliance</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">Strategic regulatory planning for pharmaceutical development.</p>
                  <div className="space-y-3">
                    <div className="p-3 bg-blue-50 border border-blue-200 rounded">
                      <h4 className="font-medium text-blue-800">FDA Pathway Analysis</h4>
                      <p className="text-sm text-blue-600">Optimal regulatory submission strategy</p>
                    </div>
                    <div className="p-3 bg-green-50 border border-green-200 rounded">
                      <h4 className="font-medium text-green-800">Compliance Monitoring</h4>
                      <p className="text-sm text-green-600">Real-time regulatory updates and requirements</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "clinical-evidence" && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Clinical Evidence</CardTitle>
                  <CardDescription>Trial data and clinical efficacy results</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">Comprehensive analysis of clinical trial data and therapeutic efficacy.</p>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "commercial-strategy" && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Commercial Strategy</CardTitle>
                  <CardDescription>Go-to-market strategy and commercial planning</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">Strategic commercial approach and market positioning analysis.</p>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      );
    }

    // Handle other navigation sections
    switch (activeSection) {
      case "competitive-intelligence":
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Competitive Intelligence</CardTitle>
                <CardDescription>Comprehensive competitor analysis and market positioning</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">Advanced competitive intelligence for pharmaceutical market positioning.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">Competitor Analysis</h4>
                    <p className="text-sm text-gray-600">Real-time monitoring of competitor activities</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">Market Positioning</h4>
                    <p className="text-sm text-gray-600">Strategic positioning recommendations</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );
        
      case "regulatory-strategy":
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Regulatory Strategy</CardTitle>
                <CardDescription>FDA pathway planning and regulatory compliance</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">Strategic regulatory planning for pharmaceutical development.</p>
                <div className="space-y-3">
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded">
                    <h4 className="font-medium text-blue-800">FDA Pathway Analysis</h4>
                    <p className="text-sm text-blue-600">Optimal regulatory submission strategy</p>
                  </div>
                  <div className="p-3 bg-green-50 border border-green-200 rounded">
                    <h4 className="font-medium text-green-800">Compliance Monitoring</h4>
                    <p className="text-sm text-green-600">Real-time regulatory updates and requirements</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );
        
      case "market-access":
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Market Access</CardTitle>
                <CardDescription>Payer strategy and reimbursement planning</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">Strategic market access planning for pharmaceutical products.</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-lg font-bold text-purple-600">85%</div>
                    <div className="text-sm text-gray-600">Payer Coverage</div>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-lg font-bold text-green-600">$240</div>
                    <div className="text-sm text-gray-600">Avg. Patient Cost</div>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-lg font-bold text-blue-600">92%</div>
                    <div className="text-sm text-gray-600">Access Rate</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );
        
      case "content-library":
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Content Library</CardTitle>
                <CardDescription>Document management and MLR workflows</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">Centralized content management for pharmaceutical materials.</p>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border rounded">
                    <div className="flex items-center space-x-3">
                      <FileText className="w-5 h-5 text-blue-600" />
                      <span className="font-medium">Market Analysis Report Q4 2024</span>
                    </div>
                    <Badge className="bg-green-100 text-green-800">Approved</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded">
                    <div className="flex items-center space-x-3">
                      <FileText className="w-5 h-5 text-orange-600" />
                      <span className="font-medium">Clinical Trial Summary</span>
                    </div>
                    <Badge className="bg-yellow-100 text-yellow-800">Under Review</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );
        
      case "client-management":
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Client Management</CardTitle>
                <CardDescription>Bayer partnership and collaboration tools</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">Strategic client relationship management for Bayer pharmaceutical projects.</p>
                <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                  <h4 className="font-semibold text-purple-900 mb-2">Active Client: Bayer HealthCare</h4>
                  <p className="text-sm text-purple-700">VMS Global pharmaceutical development project</p>
                  <div className="mt-3 grid grid-cols-2 gap-4">
                    <div className="text-sm">
                      <span className="text-gray-600">Project Status:</span>
                      <span className="ml-2 font-medium text-green-600">Active</span>
                    </div>
                    <div className="text-sm">
                      <span className="text-gray-600">Team Size:</span>
                      <span className="ml-2 font-medium">15 members</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );
        
      case "analytics-dashboard":
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Analytics Dashboard</CardTitle>
                <CardDescription>Performance metrics and ROI tracking</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">2,847</div>
                    <div className="text-sm text-gray-600">Total Engagement</div>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-green-600">12.4%</div>
                    <div className="text-sm text-gray-600">Conversion Rate</div>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">$24.50</div>
                    <div className="text-sm text-gray-600">Cost per Lead</div>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">340%</div>
                    <div className="text-sm text-gray-600">ROI</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );
        
      case "projects":
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Projects</CardTitle>
                <CardDescription>Active pharmaceutical development projects</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-4 border rounded-lg bg-purple-50">
                    <h4 className="font-medium text-purple-900">VMS Global - Bayer</h4>
                    <p className="text-sm text-purple-700">Pharmaceutical development for menopause treatment</p>
                    <div className="mt-2 flex items-center space-x-4">
                      <Badge className="bg-green-100 text-green-800">Phase 3</Badge>
                      <span className="text-sm text-gray-600">78% Complete</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );
        
      case "questions":
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Questions</CardTitle>
                <CardDescription>Frequently asked questions and support</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">Common questions about pharmaceutical intelligence and analysis.</p>
                <div className="space-y-3">
                  <div className="p-3 border rounded">
                    <h4 className="font-medium mb-1">How do I access market analysis data?</h4>
                    <p className="text-sm text-gray-600">Navigate to Research Hub → Market Analysis for comprehensive market data.</p>
                  </div>
                  <div className="p-3 border rounded">
                    <h4 className="font-medium mb-1">What is the TAM analysis methodology?</h4>
                    <p className="text-sm text-gray-600">Our TAM analysis uses proprietary algorithms combining market data, demographics, and clinical evidence.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
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
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-white hover:bg-purple-700"
              onClick={onBack}
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <Brain className="w-6 h-6" />
            <span className="text-lg font-bold">EMME Engage™ v2.0</span>
            <span className="text-xs bg-purple-600 px-2 py-1 rounded">EMME Engage™ Intelligence Hub</span>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input 
                placeholder="Search intelligence..."
                className="pl-10 bg-white/10 border-white/20 text-white placeholder-white/60 w-64"
              />
            </div>
            <div className="bg-orange-500 px-3 py-1 rounded text-sm">
              <span>EMME AI</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white border-r border-gray-200 min-h-screen">
          <div className="p-4">
            <div className="mb-6 text-sm text-purple-600">
              EMME v2.0 - Navigation 9 items loaded
            </div>

            {/* Navigation Menu */}
            <nav className="space-y-1">
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
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">Research Intelligence Hub</h1>
                    <p className="text-gray-600">Advanced market analysis and competitive intelligence</p>
                  </div>
                  <Badge variant="outline">Document was last saved: Just now</Badge>
                </div>
              </div>

              {renderMainContent()}
            </div>
          </div>
          
          {/* EMME AI Chat Panel */}
          <div className="w-80 border-l bg-gray-50">
            <div className="h-full flex flex-col">
              <div className="p-4 border-b bg-white">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium flex items-center">
                    <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center mr-2">
                      <span className="text-white text-xs font-bold">0</span>
                    </div>
                    EMME AI
                  </h3>
                </div>
                <p className="text-sm text-gray-600 mt-1">Pharmaceutical Intelligence Assistant</p>
                <p className="text-xs text-gray-500 mt-1">Hello! I'm EMME, your EMME Engage™ intelligence assistant.</p>
                <p className="text-xs text-gray-500 mt-2">I can help with:</p>
                <ul className="text-xs text-gray-500 mt-1 space-y-1">
                  <li>• Competitive analysis</li>
                  <li>• Regulatory strategy</li>
                  <li>• Market access planning</li>
                  <li>• Partnership structuring</li>
                </ul>
                <p className="text-xs text-gray-500 mt-2">Ask EMME about biomarkers, drug interactions, clinical trials...</p>
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
                            <p key={index} className="text-xs text-blue-600">{source}</p>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="p-4 bg-white border-t">
                <div className="flex space-x-2">
                  <Input
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Ask me about VMS market data, competitive analysis, or clinical insights"
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    className="text-sm"
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={!chatInput.trim()}
                    size="icon"
                    className="bg-purple-600 hover:bg-purple-700"
                  >
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