import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  ArrowLeft,
  Brain,
  MessageSquare,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  FileText,
  Search,
  Target,
  Users,
  BarChart3,
  TrendingUp,
  Shield,
  Activity,
  Calendar,
  Clock,
  DollarSign,
  Upload,
  Download,
  MoreHorizontal,
  Send
} from 'lucide-react';

interface ChatMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  sources?: string[];
}

export function VMSIntelligenceHub({ onBack }: { onBack: () => void }) {
  const [activeSection, setActiveSection] = useState("market-analysis");
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
    { id: "market-analysis", label: "Market Analysis", icon: BarChart3 },
    { id: "competitive-landscape", label: "Competitive Landscape", icon: Target },
    { id: "regulatory-pathway", label: "Regulatory Pathway", icon: Shield },
    { id: "clinical-evidence", label: "Clinical Evidence", icon: FileText },
    { id: "commercial-strategy", label: "Commercial Strategy", icon: TrendingUp }
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
    if (activeSection === "market-analysis") {
      return (
        <div className="space-y-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="market-analysis">Market Analysis</TabsTrigger>
              <TabsTrigger value="competitive-landscape">Competitive Landscape</TabsTrigger>
              <TabsTrigger value="regulatory-pathway">Regulatory Pathway</TabsTrigger>
              <TabsTrigger value="clinical-evidence">Clinical Evidence</TabsTrigger>
              <TabsTrigger value="commercial-strategy">Commercial Strategy</TabsTrigger>
            </TabsList>
            
            <TabsContent value="market-analysis">
              <div className="space-y-6">
                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
                  <div className="flex items-center justify-between cursor-pointer" onClick={() => toggleSection('tam')}>
                    <h3 className="text-lg font-semibold text-blue-900 flex items-center">
                      {expandedSections['tam'] ? <ChevronDown className="w-4 h-4 mr-2" /> : <ChevronRight className="w-4 h-4 mr-2" />}
                      Total Addressable Market (TAM): Pharmaceutical Intelligence
                    </h3>
                  </div>
                  {expandedSections['tam'] && (
                    <div className="mt-4 space-y-4">
                      <div className="bg-white p-4 rounded border">
                        <h4 className="font-medium text-gray-900 mb-3">Total Addressable Market (TAM): Women Entering Menopause</h4>
                        
                        <div className="overflow-x-auto">
                          <table className="w-full border-collapse border border-gray-200 text-sm">
                            <thead>
                              <tr className="bg-gray-50">
                                <th className="border border-gray-200 p-3 text-left font-medium">REGION</th>
                                <th className="border border-gray-200 p-3 text-left font-medium">WOMEN AGED 45-60</th>
                                <th className="border border-gray-200 p-3 text-left font-medium">ANNUAL ENTRY INTO MENOPAUSE</th>
                                <th className="border border-gray-200 p-3 text-left font-medium">NOTES</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <td className="border border-gray-200 p-3 font-medium">U.S.</td>
                                <td className="border border-gray-200 p-3">~50M (total)</td>
                                <td className="border border-gray-200 p-3">~2M/year</td>
                                <td className="border border-gray-200 p-3">6,000 women/day enter menopause in U.S.</td>
                              </tr>
                              <tr className="bg-gray-25">
                                <td className="border border-gray-200 p-3 font-medium">UK</td>
                                <td className="border border-gray-200 p-3">~7.4M</td>
                                <td className="border border-gray-200 p-3">~400K/year</td>
                                <td className="border border-gray-200 p-3">Average onset age: 51</td>
                              </tr>
                              <tr>
                                <td className="border border-gray-200 p-3 font-medium">EU5 (France, Germany, Italy, Spain, UK)</td>
                                <td className="border border-gray-200 p-3">~40M</td>
                                <td className="border border-gray-200 p-3">~3.4M/year</td>
                                <td className="border border-gray-200 p-3">High awareness in FR/DE, lower access in IT/ES</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>

                        <div className="mt-4 bg-blue-50 p-4 rounded-lg">
                          <p className="text-sm text-blue-800">
                            About <strong className="text-purple-600">75% of women</strong> experience vasomotor symptoms (VMS), and <strong className="text-purple-600">25-30%</strong> have moderate-to-severe symptoms
                          </p>
                        </div>

                        <div className="mt-6">
                          <h4 className="font-semibold text-gray-900 mb-3">Serviceable Available Market (SAM)</h4>
                          <p className="text-sm text-gray-600 mb-3">Conservative filters: moderate-to-severe VMS, awareness, access, diagnosed.</p>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="text-center p-4 bg-red-50 border border-red-200 rounded">
                              <div className="text-2xl font-bold text-red-600">~10M-15M</div>
                              <div className="text-sm text-red-700">U.S. Est. candidates for RX Product A</div>
                            </div>
                            <div className="text-center p-4 bg-blue-50 border border-blue-200 rounded">
                              <div className="text-2xl font-bold text-blue-600">~1.5M</div>
                              <div className="text-sm text-blue-700">UK Est. candidates for RX Product A</div>
                            </div>
                            <div className="text-center p-4 bg-green-50 border border-green-200 rounded">
                              <div className="text-2xl font-bold text-green-600">~6M-8M</div>
                              <div className="text-sm text-green-700">EU5 (w/o UK) Est. candidates for RX Product A</div>
                            </div>
                          </div>
                        </div>

                        <div className="mt-6">
                          <h4 className="font-semibold text-gray-900 mb-3">Patient Demographics & Segmentation</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <h5 className="font-medium text-gray-800 mb-2">Core Age Ranges</h5>
                              <div className="space-y-2">
                                <div className="flex justify-between">
                                  <span className="text-sm text-gray-600">Natural menopause onset:</span>
                                  <span className="text-sm font-medium">~51 years old (U.S.)</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-sm text-gray-600">Perimenopause:</span>
                                  <span className="text-sm font-medium">~45-55</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-sm text-gray-600">Postmenopause:</span>
                                  <span className="text-sm font-medium">55+ onwards</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-sm text-gray-600">Treatment-eligible:</span>
                                  <span className="text-sm font-medium">40-65 years old</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-sm text-gray-600">Primary age range:</span>
                                  <span className="text-sm font-medium text-blue-600">45-60 (seeking relief)</span>
                                </div>
                              </div>
                            </div>
                            
                            <div>
                              <h5 className="font-medium text-gray-800 mb-2">Key Patient Segments</h5>
                              <div className="space-y-3">
                                <div className="p-3 bg-red-50 border border-red-200 rounded">
                                  <div className="font-medium text-red-800">Risk-Averse, Non-Hormone Seekers</div>
                                  <div className="text-sm text-red-600">Avoiding estrogen due to medical history (breast cancer, clotting, stroke risk)</div>
                                </div>
                                <div className="p-3 bg-blue-50 border border-blue-200 rounded">
                                  <div className="font-medium text-blue-800">Lifestyle-Oriented, Quality-of-Life Seekers</div>
                                  <div className="text-sm text-blue-600">Disrupted sleep, work stress, relationship strain due to symptoms</div>
                                </div>
                                <div className="p-3 bg-green-50 border border-green-200 rounded">
                                  <div className="font-medium text-green-800">Silent Strugglers</div>
                                  <div className="text-sm text-green-600">Undiagnosed or undertreated, seeking alternatives</div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="competitive-landscape">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Competitive Positioning vs. Veozah</CardTitle>
                  </CardHeader>
                  <CardContent>
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
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="clinical-evidence">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Clinical Development & Evidence</CardTitle>
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
                          <p className="text-sm text-gray-600">Completed Clinical Trials</p>
                        </div>
                        <div className="text-center p-4 border rounded-lg">
                          <p className="text-2xl font-bold text-green-600">120mg</p>
                          <p className="text-sm text-gray-600">Optimal Dose Identified</p>
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
            </TabsContent>
          </Tabs>
        </div>
      );
    }

    return (
      <div className="text-center py-12">
        <div className="text-lg font-medium text-gray-900 mb-2">
          {navigationItems.find(item => item.id === activeSection)?.label}
        </div>
        <p className="text-gray-600">Content for this section coming soon</p>
      </div>
    );
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
            <span className="text-lg font-bold">EMME Connect™ v2.0</span>
            <span className="text-xs bg-purple-600 px-2 py-1 rounded">EMME Connect™ Intelligence Hub</span>
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
                <p className="text-xs text-gray-600 mt-1">Pharmaceutical Intelligence Assistant</p>
                <p className="text-xs text-gray-500">Hello! I'm EMME, your EMME Connect™ intelligence assistant.</p>
                <p className="text-xs text-gray-500 mt-1">I can help with:</p>
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