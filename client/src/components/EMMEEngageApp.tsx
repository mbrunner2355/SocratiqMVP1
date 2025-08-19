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
  ExternalLink
} from "lucide-react";
import { useDropzone } from "react-dropzone";

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

export function EMMEEngageApp() {
  const [activeSection, setActiveSection] = useState("exploration");
  const [currentProject] = useState("VMS Global");
  const [activeTab, setActiveTab] = useState("market-analysis");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({"tam": true, "competitive-analysis": true, "clinical-evidence": false, "regulatory-pathway": false, "commercial-strategy": false, "unmet-need": true});
  
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
        content: getContextualResponse(chatInput, activeSection, activeTab),
        timestamp: new Date(),
        sources: getRelevantSources(chatInput, activeSection)
      };
      setChatMessages(prev => [...prev, aiResponse]);
    }, 1000);
    
    setChatInput("");
  };
  
  const getContextualResponse = (input: string, section: string, tab: string): string => {
    if (input.toLowerCase().includes('revenue') || input.toLowerCase().includes('sales')) {
      return "Based on available financial data, Astellas reported global sales of approximately ¥14.8 billion (~$100 million USD) for Veozah in fiscal year 2023. However, FY 2024 projections have been revised downward to ¥7.1 billion (~$50 million USD), citing slower-than-expected market uptake and challenges in provider adoption.";
    }
    if (input.toLowerCase().includes('pricing') || input.toLowerCase().includes('cost')) {
      return "Current competitive pricing shows Veozah launched at ~$550/month list price without insurance. Production costs for elinzanetant are expected to be moderate due to standard chemical synthesis processes, but final pricing will depend on market positioning, R&D cost recovery, and competitive landscape considerations.";
    }
    if (input.toLowerCase().includes('storage') || input.toLowerCase().includes('stability')) {
      return "For research-grade elinzanetant, storage guidelines specify: -20°C stable for up to 3 years, 4°C stable for up to 2 years, and room temperature shipping possible for transit under 2 weeks. Commercial formulation requirements are expected to target room temperature stability for improved patient convenience and distribution logistics.";
    }
    return "I can help you analyze market data, competitive intelligence, clinical trial information, and regulatory landscapes. What specific aspect of the pharmaceutical development or market access strategy would you like to explore?";
  };
  
  const getRelevantSources = (input: string, section: string): string[] => {
    if (input.toLowerCase().includes('revenue')) {
      return ['https://pharmaphorum.com/news/astellas-raises-padcev-forecasts', 'https://fiercepharma.com/pharma/astellas-sales-expectations'];
    }
    return ['https://pharmaphorum.com', 'https://clinicaltrials.gov', 'https://pubmed.ncbi.nlm.nih.gov'];
  };
  const [documents] = useState<Document[]>([
    {
      id: "1",
      name: "Tech requirements.pdf",
      type: "pdf",
      dateUploaded: "Jan 4, 2025",
      uploader: "Olivia Rhys"
    },
    {
      id: "2", 
      name: "Dashboard screenshot.jpg",
      type: "image",
      dateUploaded: "Jan 4, 2025",
      uploader: "Phoenix Baker"
    },
    {
      id: "3",
      name: "Dashboard prototype recording.mp4", 
      type: "video",
      dateUploaded: "Jan 2, 2025",
      uploader: "Lana Steiner"
    },
    {
      id: "4",
      name: "Dashboard prototype FINAL.fig",
      type: "design",
      dateUploaded: "Jan 6, 2025", 
      uploader: "Demi Wilkinson"
    }
  ]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles) => {
      console.log('Files dropped:', acceptedFiles);
      // Handle file upload here
    },
    maxSize: 50 * 1024 * 1024, // 50MB
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt'],
      'image/*': ['.png', '.jpg', '.jpeg'],
      'video/*': ['.mp4', '.mov'],
      'application/figma': ['.fig']
    }
  });

  const navigationItems = [
    { id: "project-insights", label: "Project Insights", icon: Lightbulb },
    { id: "framework", label: "Framework", icon: Layout },
    { id: "background", label: "Background", icon: FileText },
    { id: "exploration", label: "Exploration", icon: Search },
    { id: "human-insights", label: "Human Insights", icon: Users },
    { id: "client-content", label: "Client Content", icon: Upload },
    { id: "playground", label: "Playground", icon: Play },
    { id: "strategy-map", label: "Strategy Map", icon: Map },
    { id: "dashboard", label: "Dashboard", icon: BarChart3 }
  ];
  
  const researchTabs: ResearchTab[] = [
    { id: "market-analysis", label: "Market Analysis", isActive: activeTab === "market-analysis", isCompleted: true },
    { id: "landscape", label: "Landscape", isActive: activeTab === "landscape", isCompleted: false },
    { id: "clinical-trials", label: "Clinical Trials", isActive: activeTab === "clinical-trials", isCompleted: false },
    { id: "regulatory", label: "Regulatory", isActive: activeTab === "regulatory", isCompleted: false },
    { id: "commercialization", label: "Commercialization", isActive: activeTab === "commercialization", isCompleted: false }
  ];

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'pdf': return <FileText className="w-4 h-4 text-red-500" />;
      case 'image': return <div className="w-4 h-4 bg-purple-500 rounded"></div>;
      case 'video': return <div className="w-4 h-4 bg-pink-500 rounded"></div>;
      case 'design': return <div className="w-4 h-4 bg-green-500 rounded"></div>;
      default: return <FileText className="w-4 h-4 text-gray-500" />;
    }
  };

  const renderMainContent = () => {
    if (activeSection === "exploration") {
      return (
        <div className="space-y-6">
          {/* Research Progress Tabs */}
          <div className="flex space-x-8 border-b overflow-x-auto">
            {researchTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`pb-3 px-1 border-b-2 transition-colors whitespace-nowrap ${
                  tab.isActive 
                    ? 'border-purple-600 text-purple-600 font-medium' 
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.label}
                {tab.isCompleted && <span className="ml-2 text-green-500">✓</span>}
              </button>
            ))}
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
                    
                    {/* Cultural Considerations Section */}
                    <div className="bg-white p-4 rounded border">
                      <h4 className="font-medium text-gray-900 mb-3">Cultural Considerations for Patient Engagement</h4>
                      
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="space-y-3">
                          <div className="p-3 bg-orange-50 border-l-4 border-orange-400 rounded">
                            <h5 className="font-medium text-orange-800">East Asian Cultural Context</h5>
                            <div className="text-xs text-orange-700 mt-1 space-y-1">
                              <p>• Emphasis on family harmony and collective decision-making</p>
                              <p>• Traditional medicine integration considerations</p>
                              <p>• Language accessibility for first-generation immigrants</p>
                              <p>• Respect for healthcare provider authority</p>
                              <p>• Preference for same-gender physicians when available</p>
                            </div>
                          </div>
                          
                          <div className="p-3 bg-teal-50 border-l-4 border-teal-400 rounded">
                            <h5 className="font-medium text-teal-800">South Asian Cultural Context</h5>
                            <div className="text-xs text-teal-700 mt-1 space-y-1">
                              <p>• Extended family involvement in health decisions</p>
                              <p>• Ayurvedic and holistic treatment preferences</p>
                              <p>• Religious considerations for treatment timing</p>
                              <p>• Strong preference for female healthcare providers</p>
                              <p>• Multilingual communication needs (Hindi, Urdu, Bengali)</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="space-y-3">
                          <div className="p-3 bg-blue-50 border-l-4 border-blue-400 rounded">
                            <h5 className="font-medium text-blue-800">Conservative Christian Context</h5>
                            <div className="text-xs text-blue-700 mt-1 space-y-1">
                              <p>• Focus on natural and God-honoring treatment options</p>
                              <p>• Emphasis on supporting family and marital relationships</p>
                              <p>• Prayer and faith integration in healthcare decisions</p>
                              <p>• Community support system utilization</p>
                              <p>• Values-based medicine approach</p>
                            </div>
                          </div>
                          
                          <div className="p-3 bg-green-50 border-l-4 border-green-400 rounded">
                            <h5 className="font-medium text-green-800">African/African-American Context</h5>
                            <div className="text-xs text-green-700 mt-1 space-y-1">
                              <p>• Historical medical mistrust considerations</p>
                              <p>• Community-based health education approaches</p>
                              <p>• Integration with traditional healing practices</p>
                              <p>• Economic accessibility and insurance considerations</p>
                              <p>• Culturally competent provider matching</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-4 p-3 bg-gray-50 border border-gray-200 rounded">
                        <h5 className="font-medium text-gray-800 mb-2">Cross-Cultural Engagement Strategies</h5>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                          <div>
                            <p className="font-medium text-purple-700">Educational Materials</p>
                            <p className="text-gray-600">Culturally adapted content, multilingual resources, family-centered information</p>
                          </div>
                          <div>
                            <p className="font-medium text-purple-700">Provider Training</p>
                            <p className="text-gray-600">Cultural competency education, bias awareness, communication style adaptation</p>
                          </div>
                          <div>
                            <p className="font-medium text-purple-700">Community Partnerships</p>
                            <p className="text-gray-600">Religious leaders, community health workers, cultural organization collaboration</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
          
          {activeTab === "landscape" && (
            <div className="space-y-6">
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
                <div className="flex items-center justify-between cursor-pointer" onClick={() => toggleSection('competitive-analysis')}>
                  <h3 className="text-lg font-semibold text-blue-900 flex items-center">
                    {expandedSections['competitive-analysis'] ? <ChevronDown className="w-4 h-4 mr-2" /> : <ChevronRight className="w-4 h-4 mr-2" />}
                    Competitive Landscape Analysis
                  </h3>
                </div>
                {expandedSections['competitive-analysis'] && (
                  <div className="mt-4 space-y-4">
                    <div className="bg-white p-4 rounded border">
                      <h4 className="font-medium text-gray-900 mb-3">Current Market Dynamics - Veozah Performance</h4>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h5 className="font-medium text-blue-700 mb-2">Revenue Performance</h5>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span>FY 2023 Global Sales:</span>
                              <span className="font-medium text-green-600">¥14.8B (~$100M USD)</span>
                            </div>
                            <div className="flex justify-between">
                              <span>FY 2024 Revised Forecast:</span>
                              <span className="font-medium text-red-600">¥7.1B (~$50M USD)</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Forecast Reduction:</span>
                              <span className="font-medium text-red-600">-52% revision</span>
                            </div>
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
                    
                    <div className="bg-white p-4 rounded border">
                      <h4 className="font-medium text-gray-900 mb-3">Market Opportunity Analysis</h4>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h5 className="font-medium text-blue-700 mb-2">Unmet Medical Need</h5>
                          <div className="space-y-2 text-sm">
                            <div className="p-2 bg-red-50 border border-red-200 rounded">
                              <strong>US HT Usage:</strong> Only 1.8% to 4.7% (down from 26.9% in 1999)
                            </div>
                            <div className="p-2 bg-orange-50 border border-orange-200 rounded">
                              <strong>UK HT Usage:</strong> Approximately 10% of menopausal women
                            </div>
                            <div className="p-2 bg-yellow-50 border border-yellow-200 rounded">
                              <strong>Gap:</strong> 90%+ of women not using hormone therapy
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <h5 className="font-medium text-blue-700 mb-2">Market Size Indicators</h5>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span>US Supplement Market:</span>
                              <span className="font-medium text-green-600">$290M+ annually</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Women seeking alternatives:</span>
                              <span className="font-medium text-purple-600">15M+ in US</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Veozah underperformance:</span>
                              <span className="font-medium text-red-600">50% below forecast</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Market readiness:</span>
                              <span className="font-medium text-blue-600">High demand, low satisfaction</span>
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
          
          {activeTab === "clinical-trials" && (
            <div className="space-y-6">
              <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-r-lg">
                <div className="flex items-center justify-between cursor-pointer" onClick={() => toggleSection('clinical-evidence')}>
                  <h3 className="text-lg font-semibold text-green-900 flex items-center">
                    {expandedSections['clinical-evidence'] ? <ChevronDown className="w-4 h-4 mr-2" /> : <ChevronRight className="w-4 h-4 mr-2" />}
                    Clinical Evidence & Trial Design
                  </h3>
                </div>
                {expandedSections['clinical-evidence'] && (
                  <div className="mt-4 space-y-4">
                    <div className="bg-white p-4 rounded border">
                      <h4 className="font-medium text-gray-900 mb-3">Phase 3 Clinical Trial Considerations</h4>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h5 className="font-medium text-green-700 mb-2">Primary Endpoints</h5>
                          <div className="space-y-2 text-sm">
                            <div className="p-2 bg-blue-50 border border-blue-200 rounded">
                              <strong>VMS Frequency:</strong> Reduction in moderate-to-severe hot flash frequency
                            </div>
                            <div className="p-2 bg-purple-50 border border-purple-200 rounded">
                              <strong>VMS Severity:</strong> Decrease in vasomotor symptom intensity scores
                            </div>
                            <div className="p-2 bg-teal-50 border border-teal-200 rounded">
                              <strong>Sleep Quality:</strong> Improvement in menopause-related sleep disruption
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <h5 className="font-medium text-green-700 mb-2">Secondary Endpoints</h5>
                          <div className="space-y-2 text-sm">
                            <p>• Quality of life measures (MENQOL scale)</p>
                            <p>• Work productivity impact assessment</p>
                            <p>• Mood and cognitive function scales</p>
                            <p>• Patient global impression of change</p>
                            <p>• Healthcare resource utilization</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-white p-4 rounded border">
                      <h4 className="font-medium text-gray-900 mb-3">Safety Profile Advantages</h4>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="p-3 bg-green-50 border border-green-200 rounded">
                          <h5 className="font-medium text-green-800 mb-2">Liver Safety</h5>
                          <p className="text-sm text-green-700">No boxed warning expected vs. Veozah's liver injury warning</p>
                        </div>
                        <div className="p-3 bg-blue-50 border border-blue-200 rounded">
                          <h5 className="font-medium text-blue-800 mb-2">Cardiovascular</h5>
                          <p className="text-sm text-blue-700">Non-hormonal mechanism reduces CV risk concerns</p>
                        </div>
                        <div className="p-3 bg-purple-50 border border-purple-200 rounded">
                          <h5 className="font-medium text-purple-800 mb-2">Cancer Risk</h5>
                          <p className="text-sm text-purple-700">No estrogen-related breast cancer risk increase</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
          
          {activeTab === "regulatory" && (
            <div className="space-y-6">
              <div className="bg-orange-50 border-l-4 border-orange-500 p-4 rounded-r-lg">
                <div className="flex items-center justify-between cursor-pointer" onClick={() => toggleSection('regulatory-pathway')}>
                  <h3 className="text-lg font-semibold text-orange-900 flex items-center">
                    {expandedSections['regulatory-pathway'] ? <ChevronDown className="w-4 h-4 mr-2" /> : <ChevronRight className="w-4 h-4 mr-2" />}
                    Regulatory Strategy & 505(b)(2) Pathway
                  </h3>
                </div>
                {expandedSections['regulatory-pathway'] && (
                  <div className="mt-4 space-y-4">
                    <div className="bg-white p-4 rounded border">
                      <h4 className="font-medium text-gray-900 mb-3">505(b)(2) Regulatory Pathway Analysis</h4>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h5 className="font-medium text-orange-700 mb-2">Pathway Advantages</h5>
                          <div className="space-y-2 text-sm">
                            <div className="flex items-start space-x-2">
                              <div className="w-2 h-2 rounded-full bg-green-500 mt-1.5 flex-shrink-0"></div>
                              <p>Reduced clinical development timeline vs. NDA</p>
                            </div>
                            <div className="flex items-start space-x-2">
                              <div className="w-2 h-2 rounded-full bg-green-500 mt-1.5 flex-shrink-0"></div>
                              <p>Reliance on FDA's prior findings of safety and efficacy</p>
                            </div>
                            <div className="flex items-start space-x-2">
                              <div className="w-2 h-2 rounded-full bg-green-500 mt-1.5 flex-shrink-0"></div>
                              <p>Lower overall development costs</p>
                            </div>
                            <div className="flex items-start space-x-2">
                              <div className="w-2 h-2 rounded-full bg-green-500 mt-1.5 flex-shrink-0"></div>
                              <p>Faster time to market opportunity</p>
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <h5 className="font-medium text-orange-700 mb-2">Key Requirements</h5>
                          <div className="space-y-2 text-sm text-gray-600">
                            <p>• Reference Listed Drug (RLD) identification</p>
                            <p>• Bridging studies to establish bioequivalence</p>
                            <p>• Additional safety and efficacy data as needed</p>
                            <p>• Risk Evaluation and Mitigation Strategy (REMS)</p>
                            <p>• Post-market surveillance requirements</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-white p-4 rounded border">
                      <h4 className="font-medium text-gray-900 mb-3">Regulatory Timeline & Milestones</h4>
                      
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm border-collapse border border-gray-200">
                          <thead>
                            <tr className="bg-gray-50">
                              <th className="border border-gray-200 p-2 text-left">Phase</th>
                              <th className="border border-gray-200 p-2 text-left">Timeline</th>
                              <th className="border border-gray-200 p-2 text-left">Key Activities</th>
                              <th className="border border-gray-200 p-2 text-left">FDA Interaction</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td className="border border-gray-200 p-2 font-medium">Pre-IND</td>
                              <td className="border border-gray-200 p-2">6-9 months</td>
                              <td className="border border-gray-200 p-2">CMC development, toxicology studies</td>
                              <td className="border border-gray-200 p-2">Pre-IND meeting</td>
                            </tr>
                            <tr>
                              <td className="border border-gray-200 p-2 font-medium">IND to NDA</td>
                              <td className="border border-gray-200 p-2">18-24 months</td>
                              <td className="border border-gray-200 p-2">Phase 1, Phase 2/3 studies</td>
                              <td className="border border-gray-200 p-2">End-of-Phase 2 meeting</td>
                            </tr>
                            <tr>
                              <td className="border border-gray-200 p-2 font-medium">NDA Review</td>
                              <td className="border border-gray-200 p-2">6-12 months</td>
                              <td className="border border-gray-200 p-2">FDA review, inspections</td>
                              <td className="border border-gray-200 p-2">PDUFA date, AdComm (if needed)</td>
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
          
          {activeTab === "commercialization" && (
            <div className="space-y-6">
              <div className="bg-purple-50 border-l-4 border-purple-500 p-4 rounded-r-lg">
                <div className="flex items-center justify-between cursor-pointer" onClick={() => toggleSection('commercial-strategy')}>
                  <h3 className="text-lg font-semibold text-purple-900 flex items-center">
                    {expandedSections['commercial-strategy'] ? <ChevronDown className="w-4 h-4 mr-2" /> : <ChevronRight className="w-4 h-4 mr-2" />}
                    Commercialization Strategy & Go-to-Market
                  </h3>
                </div>
                {expandedSections['commercial-strategy'] && (
                  <div className="mt-4 space-y-4">
                    <div className="bg-white p-4 rounded border">
                      <h4 className="font-medium text-gray-900 mb-3">Launch Strategy Framework</h4>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                          <h5 className="font-medium text-purple-700 mb-2">Phase 1: Foundation (Months 1-6)</h5>
                          <div className="space-y-1 text-sm text-gray-600">
                            <p>• KOL engagement and education</p>
                            <p>• Payer evidence development</p>
                            <p>• Market access preparation</p>
                            <p>• Provider training programs</p>
                            <p>• Patient awareness campaigns</p>
                          </div>
                        </div>
                        
                        <div>
                          <h5 className="font-medium text-purple-700 mb-2">Phase 2: Expansion (Months 7-18)</h5>
                          <div className="space-y-1 text-sm text-gray-600">
                            <p>• Broad physician outreach</p>
                            <p>• Formulary inclusion</p>
                            <p>• Patient support services</p>
                            <p>• Digital engagement platform</p>
                            <p>• Real-world evidence generation</p>
                          </div>
                        </div>
                        
                        <div>
                          <h5 className="font-medium text-purple-700 mb-2">Phase 3: Optimization (Months 19+)</h5>
                          <div className="space-y-1 text-sm text-gray-600">
                            <p>• Market share growth</p>
                            <p>• Lifecycle management</p>
                            <p>• International expansion</p>
                            <p>• Additional indications</p>
                            <p>• Partnership opportunities</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-white p-4 rounded border">
                      <h4 className="font-medium text-gray-900 mb-3">Revenue Forecasting Model</h4>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h5 className="font-medium text-purple-700 mb-2">Base Case Scenario</h5>
                          <div className="space-y-2">
                            <div className="p-3 bg-blue-50 border border-blue-200 rounded">
                              <div className="flex justify-between">
                                <span className="text-sm font-medium">Year 1 Revenue:</span>
                                <span className="text-lg font-bold text-blue-600">$75M</span>
                              </div>
                              <p className="text-xs text-blue-700">Conservative market penetration</p>
                            </div>
                            <div className="p-3 bg-green-50 border border-green-200 rounded">
                              <div className="flex justify-between">
                                <span className="text-sm font-medium">Year 3 Revenue:</span>
                                <span className="text-lg font-bold text-green-600">$350M</span>
                              </div>
                              <p className="text-xs text-green-700">Steady adoption and market share growth</p>
                            </div>
                            <div className="p-3 bg-purple-50 border border-purple-200 rounded">
                              <div className="flex justify-between">
                                <span className="text-sm font-medium">Peak Revenue:</span>
                                <span className="text-lg font-bold text-purple-600">$800M</span>
                              </div>
                              <p className="text-xs text-purple-700">Year 5-7 peak market performance</p>
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <h5 className="font-medium text-purple-700 mb-2">Key Success Factors</h5>
                          <div className="space-y-2 text-sm">
                            <div className="flex items-center space-x-2">
                              <div className="w-2 h-2 rounded-full bg-green-500"></div>
                              <span>Superior safety profile vs. Veozah</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                              <span>Broader symptom relief (VMS + sleep + mood)</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                              <span>Competitive pricing strategy</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                              <span>Strong payer value proposition</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <div className="w-2 h-2 rounded-full bg-teal-500"></div>
                              <span>Effective physician and patient education</span>
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
        </div>
      );
    }
    
    if (activeSection === "background") {
      return (
        <div className="space-y-6">
          <div className="flex space-x-8 border-b">
            <button className="pb-2 text-gray-500 hover:text-gray-700">Organization Overview</button>
            <button className="pb-2 border-b-2 border-purple-600 text-purple-600 font-medium">Initiative Overview</button>
            <button className="pb-2 text-gray-500 hover:text-gray-700">Clinical Trials</button>
          </div>
          
          <div className="bg-orange-50 border-l-4 border-orange-500 p-4 rounded-r-lg">
            <div className="flex items-center justify-between cursor-pointer" onClick={() => toggleSection('unmet-need')}>
              <h3 className="text-lg font-semibold text-orange-900 flex items-center">
                {expandedSections['unmet-need'] ? <ChevronDown className="w-4 h-4 mr-2" /> : <ChevronRight className="w-4 h-4 mr-2" />}
                Unmet Need
              </h3>
            </div>
            {expandedSections['unmet-need'] && (
              <div className="mt-4">
                <p className="text-gray-700 mb-4">
                  A significant proportion of women in both the U.S. and U.K. opt out of hormone therapy (HT) for menopause symptoms, 
                  often due to concerns about associated risks.
                </p>
                
                <div className="bg-white p-4 rounded border">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2">Region</th>
                        <th className="text-left p-2">Estimated HT Usage Among Menopausal Women</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b">
                        <td className="p-2">U.S.</td>
                        <td className="p-2">1.8% to 4.7%</td>
                      </tr>
                      <tr>
                        <td className="p-2">U.K.</td>
                        <td className="p-2">Approximately 10%</td>
                      </tr>
                    </tbody>
                  </table>
                  
                  <div className="mt-4">
                    <h5 className="font-medium mb-2">Implications</h5>
                    <p className="text-sm text-gray-600 mb-2">
                      <strong>Unmet Need:</strong> The low uptake of HT highlights a significant unmet need for alternative, 
                      non-hormonal treatments for menopausal symptoms.
                    </p>
                    <p className="text-sm text-gray-600">
                      <strong>Educational Efforts:</strong> There's a need for improved education and communication to address 
                      misconceptions about HT and inform women about available treatment options.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      );
    }
    
    if (activeSection === "client-content") {
      return (
        <div className="space-y-6">
          {/* Tabs */}
          <div className="flex space-x-8 border-b">
            <button className="pb-2 border-b-2 border-purple-600 text-purple-600 font-medium">
              Upload documents
            </button>
            <button className="pb-2 text-gray-500 hover:text-gray-700">
              Ask emme
            </button>
          </div>

          {/* Upload Area */}
          <div className="space-y-6">
            <div 
              {...getRootProps()} 
              className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors ${
                isDragActive ? 'border-purple-400 bg-purple-50' : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <input {...getInputProps()} />
              <div className="space-y-4">
                <div className="flex justify-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                    <Upload className="w-8 h-8 text-gray-400" />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">
                    Drag and drop or click here
                  </h3>
                  <p className="text-sm text-gray-500">
                    to upload your image (max 2 MB)
                  </p>
                </div>
              </div>
            </div>

            {/* Link from web option */}
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Link from the web</span>
              <Input 
                placeholder="http://imgur.com/GnKTWLg.png"
                className="flex-1"
              />
              <Button variant="outline" size="sm">Cancel</Button>
            </div>

            {/* Document List */}
            <div className="space-y-4">
              <div className="grid grid-cols-4 gap-4 text-sm font-medium text-gray-500 border-b pb-2">
                <div>File name</div>
                <div>Date uploaded</div>
                <div>Uploader</div>
                <div></div>
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
            <span className="text-xl font-bold">emme</span>
            <span className="text-xs bg-purple-600 px-2 py-1 rounded">powered by mock5</span>
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
              New Project
            </Button>
            <Button variant="ghost" size="icon" className="text-white">
              <Settings className="w-4 h-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-white" 
              onClick={handleLogout}
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
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
                    <p className="text-sm">Ask me about market data, competitive intelligence, or clinical research</p>
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
                  </div>
                ))}
              </div>
              
              <div className="p-4 border-t bg-white">
                <div className="flex space-x-2">
                  <Textarea
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Ask about pricing, market data, clinical trials..."
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