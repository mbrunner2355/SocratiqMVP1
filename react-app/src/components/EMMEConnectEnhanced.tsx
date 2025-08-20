import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'wouter';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Handshake,
  Plus, 
  Building2,
  FileText,
  TrendingUp,
  Search,
  Users,
  Globe,
  DollarSign,
  Target,
  Calendar,
  CheckCircle,
  Clock,
  AlertTriangle,
  Activity,
  BarChart3,
  Zap,
  Package,
  Settings,
  Code,
  Brain,
  Lightbulb,
  Upload,
  Play,
  Map,
  MessageSquare,
  Send,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  Home,
  Layout,
  Eye,
  MoreHorizontal,
  Stethoscope,
  Heart,
  Shield,
  FolderOpen
} from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { apiRequest } from '@/lib/queryClient';
import { EMMEProjectManager } from './EMMEProjectManager';
import { EMMEQuestions } from './EMMEQuestions';

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
  metadata?: {
    confidence?: number;
    entities?: any[];
    processingTime?: number;
  };
}

interface ResearchTab {
  id: string;
  label: string;
  isActive: boolean;
  isCompleted: boolean;
}

export function EMMEConnectEnhanced() {
  const { section } = useParams<{ section?: string }>();
  const [activeSection, setActiveSection] = useState('research-hub');
  const [activeResearchTab, setActiveResearchTab] = useState('market-analysis');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({"tam": true});
  const [searchTerm, setSearchTerm] = useState('');
  const [currentProject] = useState('EMME Connect™ Intelligence Hub');
  const queryClient = useQueryClient();

  // Force component refresh with new navigation structure
  const allNavigationItems = [
    { id: "research-hub", label: "Research Hub", icon: Brain },
    { id: "competitive-intelligence", label: "Competitive Intelligence", icon: Target },
    { id: "regulatory-strategy", label: "Regulatory Strategy", icon: Shield },
    { id: "market-access", label: "Market Access", icon: BarChart3 },
    { id: "content-library", label: "Content Library", icon: Upload },
    { id: "partnerships", label: "Client Management", icon: Users },
    { id: "analytics-dashboard", label: "Analytics Dashboard", icon: BarChart3 },
    { id: "projects", label: "Projects", icon: FolderOpen },
    { id: "questions", label: "Questions", icon: MessageSquare }
  ];
  
  const navigationItems = allNavigationItems;

  // Map URL section to activeSection
  useEffect(() => {
    if (section) {
      const sectionMapping: Record<string, string> = {
        'research-hub': 'research-hub',
        'competitive-intelligence': 'competitive-intelligence',
        'regulatory-strategy': 'regulatory-strategy',
        'market-access': 'market-access',
        'projects': 'projects',
        'questions': 'questions',
        'content-library': 'content-library',
        'partnerships': 'partnerships',
        'analytics-dashboard': 'analytics-dashboard'
      };
      setActiveSection(sectionMapping[section] || 'research-hub');
    } else {
      setActiveSection('research-hub');
    }
  }, [section]);

  // Fetch partnership data
  const { data: partnerships } = useQuery({
    queryKey: ['/api/emme/partnerships'],
  });

  const { data: analytics } = useQuery({
    queryKey: ['/api/emme/analytics/overview'],
  });

  // Research functionality
  const [documents] = useState<Document[]>([
    {
      id: "1",
      name: "FDA Guidance - 505(b)(2) Applications.pdf",
      type: "pdf",
      dateUploaded: "Jan 4, 2025",
      uploader: "Regulatory Team"
    },
    {
      id: "2", 
      name: "Competitor Analysis - Veozah Market.xlsx",
      type: "spreadsheet",
      dateUploaded: "Jan 4, 2025",
      uploader: "Market Intelligence"
    },
    {
      id: "3",
      name: "Clinical Trial Data Summary.docx", 
      type: "document",
      dateUploaded: "Jan 2, 2025",
      uploader: "Clinical Affairs"
    },
    {
      id: "4",
      name: "Market Access Strategy Framework.pptx",
      type: "presentation",
      dateUploaded: "Jan 6, 2025", 
      uploader: "Commercial Strategy"
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
      'application/vnd.ms-excel': ['.xls'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx']
    }
  });

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };
  
  const handleSendMessage = async () => {
    if (!chatInput.trim()) return;
    
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: chatInput,
      timestamp: new Date()
    };
    
    setChatMessages(prev => [...prev, userMessage]);
    
    // Show typing indicator
    const typingMessage: ChatMessage = {
      id: 'typing',
      type: 'assistant',
      content: 'EMME is analyzing your question...',
      timestamp: new Date()
    };
    setChatMessages(prev => [...prev, typingMessage]);
    
    try {
      // Process the question through the Advanced NLP system
      const res = await apiRequest('POST', '/api/public/emme-question', {
        question: chatInput,
        context: `Current section: ${activeSection}, Research tab: ${activeResearchTab}`,
        agentId: 'emme_chat_agent'
      });

      const response = await res.json();

      // Remove typing indicator and add AI response
      setChatMessages(prev => prev.filter(msg => msg.id !== 'typing'));
      
      const aiResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: response.agentResponse || getContextualResponse(chatInput, activeSection, activeResearchTab),
        timestamp: new Date(),
        sources: response.sources || getRelevantSources(chatInput, activeSection),
        metadata: {
          confidence: response.analysis?.confidenceMetrics?.overall,
          entities: response.analysis?.questionAnalysis?.entities?.slice(0, 3),
          processingTime: response.processingTime
        }
      };
      setChatMessages(prev => [...prev, aiResponse]);
      
    } catch (error) {
      // Remove typing indicator and show fallback response
      setChatMessages(prev => prev.filter(msg => msg.id !== 'typing'));
      
      const fallbackResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: getContextualResponse(chatInput, activeSection, activeResearchTab),
        timestamp: new Date(),
        sources: getRelevantSources(chatInput, activeSection)
      };
      setChatMessages(prev => [...prev, fallbackResponse]);
    }
    
    setChatInput("");
  };
  
  const getContextualResponse = (input: string, section: string, tab: string): string => {
    if (input.toLowerCase().includes('revenue') || input.toLowerCase().includes('sales')) {
      return "Based on EMME Connect™ market intelligence, I can provide comprehensive revenue analysis including competitive positioning, market sizing, and commercial forecasting. Our platform integrates real-time sales data, LOE impact assessments, and go-to-market optimization insights.";
    }
    if (input.toLowerCase().includes('505b2') || input.toLowerCase().includes('regulatory')) {
      return "EMME Connect™ offers specialized 505(b)(2) pathway analysis including: regulatory precedent mapping, bridging study requirements, reference listed drug analysis, and FDA guidance interpretation. I can help identify optimal regulatory strategies and filing timelines.";
    }
    if (input.toLowerCase().includes('competitor') || input.toLowerCase().includes('landscape')) {
      return "Our competitive intelligence engine provides real-time monitoring of: pipeline developments, pricing strategies, market access tactics, and LOE preparations. I can analyze competitive positioning and identify market opportunities across therapeutic areas.";
    }
    if (input.toLowerCase().includes('partnership') || input.toLowerCase().includes('licensing')) {
      return "EMME Connect™ partnership analytics include: deal structuring optimization, co-development frameworks, licensing valuation models, and strategic alliance management. Our platform tracks 1000+ active pharmaceutical partnerships globally.";
    }
    return "I'm EMME, your EMME Connect™ intelligence assistant. I can help with: competitive analysis, regulatory strategy, market access planning, partnership structuring, IP analysis, and commercial forecasting. What specific pharmaceutical intelligence do you need?";
  };
  
  const getRelevantSources = (input: string, section: string): string[] => {
    if (input.toLowerCase().includes('revenue')) {
      return ['https://pharmaphorum.com/news/pharmaceutical-revenue-analytics', 'https://fiercepharma.com/pharma/market-forecasting'];
    }
    if (input.toLowerCase().includes('505b2')) {
      return ['https://fda.gov/guidance/505b2-applications', 'https://regulatory-focus.org/505b2-pathway'];
    }
    return ['https://pharmaphorum.com', 'https://clinicaltrials.gov', 'https://pubmed.ncbi.nlm.nih.gov', 'https://fda.gov'];
  };

  
  const researchTabs: ResearchTab[] = [
    { id: "market-analysis", label: "Market Analysis", isActive: activeResearchTab === "market-analysis", isCompleted: true },
    { id: "competitive-landscape", label: "Competitive Landscape", isActive: activeResearchTab === "competitive-landscape", isCompleted: true },
    { id: "regulatory-pathway", label: "Regulatory Pathway", isActive: activeResearchTab === "regulatory-pathway", isCompleted: false },
    { id: "clinical-evidence", label: "Clinical Evidence", isActive: activeResearchTab === "clinical-evidence", isCompleted: false },
    { id: "commercial-strategy", label: "Commercial Strategy", isActive: activeResearchTab === "commercial-strategy", isCompleted: false }
  ];

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'pdf': return <FileText className="w-4 h-4 text-red-500" />;
      case 'spreadsheet': return <div className="w-4 h-4 bg-green-500 rounded"></div>;
      case 'document': return <FileText className="w-4 h-4 text-blue-500" />;
      case 'presentation': return <div className="w-4 h-4 bg-orange-500 rounded"></div>;
      default: return <FileText className="w-4 h-4 text-gray-500" />;
    }
  };

  // Main content renderer
  const renderMainContent = () => {
    if (activeSection === "research-hub") {
      return (
        <div className="space-y-6">
          {/* Research Progress Tabs */}
          <div className="flex space-x-8 border-b overflow-x-auto">
            {researchTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveResearchTab(tab.id)}
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
          {activeResearchTab === "market-analysis" && (
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
                    
                    {/* Strategic Action Plan Section */}
                    <div className="bg-white p-4 rounded border">
                      <div className="flex items-center justify-between cursor-pointer mb-4" onClick={() => toggleSection('strategic-action-plan')}>
                        <h4 className="font-medium text-gray-900 flex items-center">
                          {expandedSections['strategic-action-plan'] ? <ChevronDown className="w-4 h-4 mr-2" /> : <ChevronRight className="w-4 h-4 mr-2" />}
                          Strategic Action Plan: Closing the Gap in Menopause Treatment Utilization
                        </h4>
                      </div>
                      {expandedSections['strategic-action-plan'] && (
                        <div className="space-y-6">
                          {/* Four Core Pillars */}
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Pillar 1: Provider & Health System Engagement */}
                            <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 border-l-4 border-blue-500 rounded">
                              <h5 className="font-semibold text-blue-900 mb-3 flex items-center">
                                <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">1</div>
                                Provider & Health System Engagement
                              </h5>
                              <div className="space-y-3">
                                <div>
                                  <h6 className="font-medium text-blue-800">Education & Training</h6>
                                  <ul className="text-xs text-blue-700 space-y-1 ml-2">
                                    <li>• CME programs on menopause management and non-hormonal therapies</li>
                                    <li>• Digital training modules for identification and treatment of VMS</li>
                                    <li>• Peer-to-peer education networks for best practice sharing</li>
                                  </ul>
                                </div>
                                <div>
                                  <h6 className="font-medium text-blue-800">Clinical Decision Support</h6>
                                  <ul className="text-xs text-blue-700 space-y-1 ml-2">
                                    <li>• EHR-integrated clinical pathway tools</li>
                                    <li>• Patient screening and assessment questionnaires</li>
                                    <li>• Treatment algorithm decision trees</li>
                                  </ul>
                                </div>
                                <div>
                                  <h6 className="font-medium text-blue-800">Implementation Support</h6>
                                  <ul className="text-xs text-blue-700 space-y-1 ml-2">
                                    <li>• Workflow optimization consulting</li>
                                    <li>• Quality improvement program partnerships</li>
                                    <li>• Outcome measurement and reporting tools</li>
                                  </ul>
                                </div>
                              </div>
                            </div>

                            {/* Pillar 2: Payer & Policy Strategy */}
                            <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 border-l-4 border-green-500 rounded">
                              <h5 className="font-semibold text-green-900 mb-3 flex items-center">
                                <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">2</div>
                                Payer & Policy Strategy
                              </h5>
                              <div className="space-y-3">
                                <div>
                                  <h6 className="font-medium text-green-800">Value-Based Contracting</h6>
                                  <ul className="text-xs text-green-700 space-y-1 ml-2">
                                    <li>• Outcomes-based payment models</li>
                                    <li>• Risk-sharing agreements with health systems</li>
                                    <li>• Quality-adjusted life-year (QALY) demonstrations</li>
                                  </ul>
                                </div>
                                <div>
                                  <h6 className="font-medium text-green-800">Coverage Expansion</h6>
                                  <ul className="text-xs text-green-700 space-y-1 ml-2">
                                    <li>• Formulary inclusion and preferred status negotiations</li>
                                    <li>• Prior authorization criteria optimization</li>
                                    <li>• Step therapy requirement minimization</li>
                                  </ul>
                                </div>
                                <div>
                                  <h6 className="font-medium text-green-800">Economic Evidence Generation</h6>
                                  <ul className="text-xs text-green-700 space-y-1 ml-2">
                                    <li>• Real-world cost-effectiveness studies</li>
                                    <li>• Budget impact modeling</li>
                                    <li>• Healthcare utilization analysis</li>
                                  </ul>
                                </div>
                              </div>
                            </div>

                            {/* Pillar 3: Patient & Community Education */}
                            <div className="p-4 bg-gradient-to-br from-purple-50 to-violet-50 border-l-4 border-purple-500 rounded">
                              <h5 className="font-semibold text-purple-900 mb-3 flex items-center">
                                <div className="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">3</div>
                                Patient & Community Education
                              </h5>
                              <div className="space-y-3">
                                <div>
                                  <h6 className="font-medium text-purple-800">Awareness Campaigns</h6>
                                  <ul className="text-xs text-purple-700 space-y-1 ml-2">
                                    <li>• Multi-channel digital education programs</li>
                                    <li>• Community workshop series</li>
                                    <li>• Influencer and advocacy partnerships</li>
                                  </ul>
                                </div>
                                <div>
                                  <h6 className="font-medium text-purple-800">Patient Resources</h6>
                                  <ul className="text-xs text-purple-700 space-y-1 ml-2">
                                    <li>• Interactive symptom assessment tools</li>
                                    <li>• Treatment option comparison guides</li>
                                    <li>• Shared decision-making resources</li>
                                  </ul>
                                </div>
                                <div>
                                  <h6 className="font-medium text-purple-800">Support Networks</h6>
                                  <ul className="text-xs text-purple-700 space-y-1 ml-2">
                                    <li>• Peer support group facilitation</li>
                                    <li>• Online community platforms</li>
                                    <li>• Navigator programs for treatment access</li>
                                  </ul>
                                </div>
                              </div>
                            </div>

                            {/* Pillar 4: Equity and Inclusion */}
                            <div className="p-4 bg-gradient-to-br from-orange-50 to-red-50 border-l-4 border-orange-500 rounded">
                              <h5 className="font-semibold text-orange-900 mb-3 flex items-center">
                                <div className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">4</div>
                                Equity and Inclusion
                              </h5>
                              <div className="space-y-3">
                                <div>
                                  <h6 className="font-medium text-orange-800">Access Barriers Removal</h6>
                                  <ul className="text-xs text-orange-700 space-y-1 ml-2">
                                    <li>• Patient assistance program expansion</li>
                                    <li>• Geographic access improvement initiatives</li>
                                    <li>• Telemedicine integration for rural populations</li>
                                  </ul>
                                </div>
                                <div>
                                  <h6 className="font-medium text-orange-800">Cultural Competency</h6>
                                  <ul className="text-xs text-orange-700 space-y-1 ml-2">
                                    <li>• Multilingual educational materials</li>
                                    <li>• Culturally adapted communication strategies</li>
                                    <li>• Community health worker partnerships</li>
                                  </ul>
                                </div>
                                <div>
                                  <h6 className="font-medium text-orange-800">Representation & Research</h6>
                                  <ul className="text-xs text-orange-700 space-y-1 ml-2">
                                    <li>• Diverse clinical trial participation</li>
                                    <li>• Health disparity research funding</li>
                                    <li>• Minority-serving institution partnerships</li>
                                  </ul>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Implementation Timeline & Metrics */}
                          <div className="bg-gray-50 p-4 rounded border">
                            <h5 className="font-semibold text-gray-900 mb-4">Implementation Timeline & Success Metrics</h5>
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                              <div>
                                <h6 className="font-medium text-gray-800 mb-2">Phase 1 (Months 1-6): Foundation</h6>
                                <ul className="text-xs text-gray-700 space-y-1">
                                  <li>• Provider education program launch</li>
                                  <li>• Payer engagement and formulary discussions</li>
                                  <li>• Patient awareness campaign initiation</li>
                                  <li>• Baseline metrics establishment</li>
                                </ul>
                              </div>
                              <div>
                                <h6 className="font-medium text-gray-800 mb-2">Phase 2 (Months 7-18): Scale & Optimize</h6>
                                <ul className="text-xs text-gray-700 space-y-1">
                                  <li>• Clinical decision support tool deployment</li>
                                  <li>• Value-based contract negotiations</li>
                                  <li>• Community education expansion</li>
                                  <li>• Equity program implementation</li>
                                </ul>
                              </div>
                            </div>
                            
                            <div className="mt-4 pt-4 border-t border-gray-200">
                              <h6 className="font-medium text-gray-800 mb-2">Key Performance Indicators</h6>
                              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <div className="text-center p-2 bg-white rounded">
                                  <div className="text-lg font-bold text-blue-600">25%</div>
                                  <div className="text-xs text-gray-600">Provider Training Adoption</div>
                                </div>
                                <div className="text-center p-2 bg-white rounded">
                                  <div className="text-lg font-bold text-green-600">15%</div>
                                  <div className="text-xs text-gray-600">Patient Diagnosis Rate Increase</div>
                                </div>
                                <div className="text-center p-2 bg-white rounded">
                                  <div className="text-lg font-bold text-purple-600">30%</div>
                                  <div className="text-xs text-gray-600">Treatment Uptake Improvement</div>
                                </div>
                                <div className="text-center p-2 bg-white rounded">
                                  <div className="text-lg font-bold text-orange-600">40%</div>
                                  <div className="text-xs text-gray-600">Health Equity Gap Reduction</div>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Strategic Priorities Summary */}
                          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-4 rounded border border-indigo-200">
                            <h5 className="font-semibold text-indigo-900 mb-3">Strategic Priorities Summary</h5>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <h6 className="font-medium text-indigo-800 mb-2">Short-term Wins (0-6 months)</h6>
                                <ul className="text-xs text-indigo-700 space-y-1">
                                  <li>• Launch comprehensive provider education program</li>
                                  <li>• Initiate payer value demonstration studies</li>
                                  <li>• Deploy patient awareness digital campaigns</li>
                                  <li>• Establish health equity baseline measurements</li>
                                </ul>
                              </div>
                              <div>
                                <h6 className="font-medium text-indigo-800 mb-2">Long-term Impact (12+ months)</h6>
                                <ul className="text-xs text-indigo-700 space-y-1">
                                  <li>• Achieve 30% increase in treatment utilization</li>
                                  <li>• Establish value-based contracting precedent</li>
                                  <li>• Create sustainable patient support ecosystem</li>
                                  <li>• Reduce health disparities in menopause care</li>
                                </ul>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
          
          {activeResearchTab === "competitive-landscape" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Competitive Intelligence Overview</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium">Market Leaders</h4>
                        <div className="text-sm text-gray-600 space-y-1">
                          <p><strong>IQVIA:</strong> $14B+ revenue, traditional consulting model</p>
                          <p><strong>Evaluate Pharma:</strong> $200M+ revenue, database licensing</p>
                          <p><strong>Parexel:</strong> $2.5B+ revenue, regulatory consulting</p>
                          <p><strong>EMME Connect™:</strong> AI-native platform advantage</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Provider Demographics & Targeting</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <h4 className="font-medium mb-3">Potential Prescribers for Elinzanetant</h4>
                      
                      <div className="overflow-x-auto">
                        <table className="w-full text-xs border-collapse border border-gray-200">
                          <thead>
                            <tr className="bg-gray-50">
                              <th className="border border-gray-200 p-2 text-left">Specialty</th>
                              <th className="border border-gray-200 p-2 text-center">US</th>
                              <th className="border border-gray-200 p-2 text-center">UK</th>
                              <th className="border border-gray-200 p-2 text-center">EU</th>
                              <th className="border border-gray-200 p-2 text-center">Likelihood to Prescribe</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td className="border border-gray-200 p-2 font-medium">OB/GYNs</td>
                              <td className="border border-gray-200 p-2 text-center"><span className="inline-block w-3 h-3 bg-green-500 rounded"></span> High</td>
                              <td className="border border-gray-200 p-2 text-center"><span className="inline-block w-3 h-3 bg-yellow-500 rounded"></span> Moderate</td>
                              <td className="border border-gray-200 p-2 text-center"><span className="inline-block w-3 h-3 bg-green-500 rounded"></span> High</td>
                              <td className="border border-gray-200 p-2 text-center">⭐⭐⭐⭐</td>
                            </tr>
                            <tr>
                              <td className="border border-gray-200 p-2 font-medium">General Practitioners</td>
                              <td className="border border-gray-200 p-2 text-center"><span className="inline-block w-3 h-3 bg-green-500 rounded"></span> High</td>
                              <td className="border border-gray-200 p-2 text-center"><span className="inline-block w-3 h-3 bg-green-500 rounded"></span> Very High</td>
                              <td className="border border-gray-200 p-2 text-center"><span className="inline-block w-3 h-3 bg-green-500 rounded"></span> Very High</td>
                              <td className="border border-gray-200 p-2 text-center">⭐⭐⭐⭐</td>
                            </tr>
                            <tr>
                              <td className="border border-gray-200 p-2 font-medium">Nurse Practitioners/PAs</td>
                              <td className="border border-gray-200 p-2 text-center"><span className="inline-block w-3 h-3 bg-yellow-500 rounded"></span> Moderate to High</td>
                              <td className="border border-gray-200 p-2 text-center"><span className="inline-block w-3 h-3 bg-yellow-500 rounded"></span> Moderate</td>
                              <td className="border border-gray-200 p-2 text-center"><span className="inline-block w-3 h-3 bg-orange-500 rounded"></span> Limited</td>
                              <td className="border border-gray-200 p-2 text-center">⭐⭐⭐</td>
                            </tr>
                            <tr>
                              <td className="border border-gray-200 p-2 font-medium">Endocrinologists</td>
                              <td className="border border-gray-200 p-2 text-center"><span className="inline-block w-3 h-3 bg-blue-500 rounded"></span> Niche</td>
                              <td className="border border-gray-200 p-2 text-center"><span className="inline-block w-3 h-3 bg-red-500 rounded"></span> Rare</td>
                              <td className="border border-gray-200 p-2 text-center"><span className="inline-block w-3 h-3 bg-red-500 rounded"></span> Rare</td>
                              <td className="border border-gray-200 p-2 text-center">⭐⭐</td>
                            </tr>
                            <tr>
                              <td className="border border-gray-200 p-2 font-medium">Menopause Specialists</td>
                              <td className="border border-gray-200 p-2 text-center"><span className="inline-block w-3 h-3 bg-green-500 rounded"></span> Growing</td>
                              <td className="border border-gray-200 p-2 text-center"><span className="inline-block w-3 h-3 bg-green-500 rounded"></span> NHS & Private</td>
                              <td className="border border-gray-200 p-2 text-center"><span className="inline-block w-3 h-3 bg-green-500 rounded"></span> Patchy access</td>
                              <td className="border border-gray-200 p-2 text-center">⭐⭐⭐⭐</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                      
                      <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="p-3 bg-blue-50 border border-blue-200 rounded">
                          <h5 className="font-medium text-blue-800">United States</h5>
                          <div className="text-xs text-blue-700 mt-1">
                            <p>• ~22,000 board-certified OB/GYNs</p>
                            <p>• PCPs manage menopause in under-resourced areas</p>
                            <p>• NPs/PAs: first point of care in outpatient settings</p>
                          </div>
                        </div>
                        <div className="p-3 bg-green-50 border border-green-200 rounded">
                          <h5 className="font-medium text-green-800">United Kingdom</h5>
                          <div className="text-xs text-green-700 mt-1">
                            <p>• GPs: ~90% of HRT prescriptions</p>
                            <p>• Specialist nurses with prescribing rights</p>
                            <p>• Growing private sector clinics</p>
                          </div>
                        </div>
                        <div className="p-3 bg-purple-50 border border-purple-200 rounded">
                          <h5 className="font-medium text-purple-800">European Union</h5>
                          <div className="text-xs text-purple-700 mt-1">
                            <p>• GPs often initial contact</p>
                            <p>• Gynecologists dominant in DE, IT, ES</p>
                            <p>• Limited pharmacist role in FR/ES</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {activeResearchTab === "regulatory-pathway" && (
            <div className="space-y-6">
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
                <div className="flex items-center justify-between cursor-pointer" onClick={() => toggleSection('505b2')}>
                  <h3 className="text-lg font-semibold text-blue-900 flex items-center">
                    {expandedSections['505b2'] ? <ChevronDown className="w-4 h-4 mr-2" /> : <ChevronRight className="w-4 h-4 mr-2" />}
                    505(b)(2) Pathway Analysis
                  </h3>
                </div>
                {expandedSections['505b2'] && (
                  <div className="mt-4">
                    <p className="text-gray-700 mb-4">
                      EMME Connect™ provides comprehensive 505(b)(2) pathway analysis including regulatory precedent mapping, 
                      bridging study requirements, and FDA guidance interpretation for accelerated market entry.
                    </p>
                    
                    <div className="bg-white p-4 rounded border">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left p-2">Regulatory Component</th>
                            <th className="text-left p-2">EMME Connect™ Analysis</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-b">
                            <td className="p-2">Reference Listed Drug (RLD)</td>
                            <td className="p-2">Automated identification and comparability assessment</td>
                          </tr>
                          <tr className="border-b">
                            <td className="p-2">Bridging Studies</td>
                            <td className="p-2">Study design optimization and requirement mapping</td>
                          </tr>
                          <tr>
                            <td className="p-2">FDA Precedents</td>
                            <td className="p-2">Historical approval pathway analysis and timeline prediction</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
          
          {activeResearchTab === "commercial-strategy" && (
            <div className="space-y-6">
              {/* Go-to-Market Strategy Overview */}
              <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-r-lg">
                <div className="flex items-center justify-between cursor-pointer" onClick={() => toggleSection('gtm-strategy')}>
                  <h3 className="text-lg font-semibold text-green-900 flex items-center">
                    {expandedSections['gtm-strategy'] ? <ChevronDown className="w-4 h-4 mr-2" /> : <ChevronRight className="w-4 h-4 mr-2" />}
                    Go-to-Market Strategy & Commercial Execution
                  </h3>
                </div>
                {expandedSections['gtm-strategy'] && (
                  <div className="mt-4 space-y-6">
                    
                    {/* Pre-Launch Phase */}
                    <div className="bg-white p-4 rounded border">
                      <h4 className="font-medium text-gray-900 mb-3">Pre-Launch Phase Strategy</h4>
                      
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div className="p-3 bg-blue-50 border border-blue-200 rounded">
                            <h5 className="font-medium text-blue-800 mb-2">1. Market and Opportunity Assessment</h5>
                            <div className="text-xs text-blue-700 space-y-1">
                              <p>• <strong>Epidemiological analysis:</strong> prevalence, incidence, disease burden</p>
                              <p>• <strong>Unmet need analysis:</strong> current standard of care, treatment gaps</p>
                              <p>• <strong>Market sizing and segmentation:</strong> potential patient population, geography, therapeutic line</p>
                              <p>• <strong>Competitive landscape:</strong> current and pipeline products, patents, exclusivity status</p>
                              <p>• <strong>Health economic impact:</strong> cost-effectiveness models, budget impact analysis</p>
                            </div>
                          </div>
                          
                          <div className="p-3 bg-purple-50 border border-purple-200 rounded">
                            <h5 className="font-medium text-purple-800 mb-2">2. Target Product Profile (TPP) Development</h5>
                            <div className="text-xs text-purple-700 space-y-1">
                              <p>• <strong>Define optimal product attributes:</strong> efficacy, safety, dosing, route of administration</p>
                              <p>• <strong>Align with regulatory strategy</strong> and future labeling</p>
                              <p>• <strong>Benchmark against competitors' TPPs</strong></p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="space-y-4">
                          <div className="p-3 bg-indigo-50 border border-indigo-200 rounded">
                            <h5 className="font-medium text-indigo-800 mb-2">3. Regulatory Planning</h5>
                            <div className="text-xs text-indigo-700 space-y-1">
                              <p>• <strong>Pre-IND meetings</strong> and FDA/EMA consultations</p>
                              <p>• <strong>Fast track or orphan drug designation</strong> applications (if applicable)</p>
                              <p>• <strong>Global regulatory strategy:</strong> U.S., EU5, Japan, China, etc.</p>
                            </div>
                          </div>
                          
                          <div className="p-3 bg-teal-50 border border-teal-200 rounded">
                            <h5 className="font-medium text-teal-800 mb-2">4. Clinical Development Strategy</h5>
                            <div className="text-xs text-teal-700 space-y-1">
                              <p>• <strong>Phase I-III trial designs</strong> to support regulatory approval and market access</p>
                              <p>• <strong>Real-world evidence (RWE)</strong> and Phase IV planning</p>
                              <p>• <strong>KOL and investigator engagement</strong></p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Brand Strategy and Positioning */}
                    <div className="bg-white p-4 rounded border">
                      <h4 className="font-medium text-gray-900 mb-3">Brand Strategy and Positioning</h4>
                      
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="space-y-3">
                          <h5 className="font-medium text-green-700">1. Brand Platform Development</h5>
                          <div className="text-xs text-gray-600 space-y-1">
                            <p>• Product name development (brand and generic)</p>
                            <p>• Brand identity and messaging pillars</p>
                            <p>• Differentiation narrative and value proposition</p>
                            <p>• Visual and verbal brand systems</p>
                          </div>
                        </div>
                        
                        <div className="space-y-3">
                          <h5 className="font-medium text-green-700">2. Scientific Communications and Education</h5>
                          <div className="text-xs text-gray-600 space-y-1">
                            <p>• Publication strategy and congress planning</p>
                            <p>• Advisory boards and steering committees</p>
                            <p>• Medical affairs planning and field medical deployment</p>
                          </div>
                        </div>
                        
                        <div className="space-y-3">
                          <h5 className="font-medium text-green-700">3. Advocacy and Stakeholder Mapping</h5>
                          <div className="text-xs text-gray-600 space-y-1">
                            <p>• Patient advocacy group partnerships</p>
                            <p>• Provider and HCP advisory roles</p>
                            <p>• Policy and public health engagement</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Commercial Strategy and Field Readiness */}
                    <div className="bg-white p-4 rounded border">
                      <h4 className="font-medium text-gray-900 mb-3">Commercial Strategy and Field Readiness</h4>
                      
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div className="p-3 bg-orange-50 border border-orange-200 rounded">
                            <h5 className="font-medium text-orange-800 mb-2">1. Sales Force Strategy</h5>
                            <div className="text-xs text-orange-700 space-y-1">
                              <p>• <strong>Sales model design:</strong> primary care vs. specialty; contract vs. in-house</p>
                              <p>• <strong>Targeting and segmentation:</strong> HCPs, IDNs, ACOs, academic centers</p>
                              <p>• <strong>Sales force sizing,</strong> territory alignment, training and certification</p>
                            </div>
                          </div>
                          
                          <div className="p-3 bg-cyan-50 border border-cyan-200 rounded">
                            <h5 className="font-medium text-cyan-800 mb-2">2. Customer Engagement Planning</h5>
                            <div className="text-xs text-cyan-700 space-y-1">
                              <p>• <strong>Omnichannel strategies:</strong> in-person, email, digital detailing</p>
                              <p>• <strong>Rep-triggered content</strong> vs. self-service HCP portals</p>
                              <p>• <strong>CRM deployment</strong> and enablement</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="space-y-4">
                          <div className="p-3 bg-pink-50 border border-pink-200 rounded">
                            <h5 className="font-medium text-pink-800 mb-2">3. Field Medical and Access Teams</h5>
                            <div className="text-xs text-pink-700 space-y-1">
                              <p>• <strong>MSL deployment strategy</strong></p>
                              <p>• <strong>Account manager</strong> and payer liaison planning</p>
                              <p>• <strong>Pull-through strategy</strong> and co-pay assistance</p>
                            </div>
                          </div>
                          
                          <div className="p-3 bg-lime-50 border border-lime-200 rounded">
                            <h5 className="font-medium text-lime-800 mb-2">Marketing and Demand Generation</h5>
                            <div className="text-xs text-lime-700 space-y-1">
                              <p>• <strong>HCP Marketing:</strong> Disease state awareness campaigns, MOA education</p>
                              <p>• <strong>DTC/DTP Marketing:</strong> Patient awareness and activation campaigns</p>
                              <p>• <strong>Peer-to-Peer and KOL Activation:</strong> Speaker bureau programs</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Pricing and Market Access */}
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
                <div className="flex items-center justify-between cursor-pointer" onClick={() => toggleSection('pricing-strategy')}>
                  <h3 className="text-lg font-semibold text-blue-900 flex items-center">
                    {expandedSections['pricing-strategy'] ? <ChevronDown className="w-4 h-4 mr-2" /> : <ChevronRight className="w-4 h-4 mr-2" />}
                    Market Access and Pricing Strategy
                  </h3>
                </div>
                {expandedSections['pricing-strategy'] && (
                  <div className="mt-4 space-y-4">
                    
                    {/* U.S. 3-Year Pricing Model */}
                    <div className="bg-white p-4 rounded border">
                      <h4 className="font-medium text-gray-900 mb-3">U.S. 3-Year Pricing Model 2026-2028</h4>
                      
                      <div className="overflow-x-auto mb-4">
                        <table className="w-full text-sm border-collapse border border-gray-200">
                          <thead>
                            <tr className="bg-gray-50">
                              <th className="border border-gray-200 p-2 text-left">YEAR</th>
                              <th className="border border-gray-200 p-2 text-center">TREATED POPULATION</th>
                              <th className="border border-gray-200 p-2 text-center">ANNUAL COST PER PATIENT</th>
                              <th className="border border-gray-200 p-2 text-center">TOTAL REVENUE</th>
                              <th className="border border-gray-200 p-2 text-center">GROWTH RATE</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td className="border border-gray-200 p-2 font-medium">2026</td>
                              <td className="border border-gray-200 p-2 text-center">~2.15M</td>
                              <td className="border border-gray-200 p-2 text-center">$4,800</td>
                              <td className="border border-gray-200 p-2 text-center font-bold text-green-600">$1.74B</td>
                              <td className="border border-gray-200 p-2 text-center">+10% over 2025</td>
                            </tr>
                            <tr>
                              <td className="border border-gray-200 p-2 font-medium">2027</td>
                              <td className="border border-gray-200 p-2 text-center">~2.69M</td>
                              <td className="border border-gray-200 p-2 text-center">$4,800</td>
                              <td className="border border-gray-200 p-2 text-center font-bold text-green-600">$2.15B</td>
                              <td className="border border-gray-200 p-2 text-center">+25% over 2026</td>
                            </tr>
                            <tr>
                              <td className="border border-gray-200 p-2 font-medium">2028</td>
                              <td className="border border-gray-200 p-2 text-center">~3.76M</td>
                              <td className="border border-gray-200 p-2 text-center">$4,800</td>
                              <td className="border border-gray-200 p-2 text-center font-bold text-green-600">$3.01B</td>
                              <td className="border border-gray-200 p-2 text-center">+40% over 2027</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="p-3 bg-green-50 border border-green-200 rounded">
                          <h5 className="font-medium text-green-800">Fixed Operating Benchmark</h5>
                          <div className="text-lg font-bold text-green-700">30%</div>
                          <div className="text-xs text-green-600">Estimated annual COGS</div>
                        </div>
                        <div className="p-3 bg-blue-50 border border-blue-200 rounded">
                          <h5 className="font-medium text-blue-800">Market Penetration</h5>
                          <div className="text-lg font-bold text-blue-700">+10%</div>
                          <div className="text-xs text-blue-600">Expected annual growth</div>
                        </div>
                        <div className="p-3 bg-purple-50 border border-purple-200 rounded">
                          <h5 className="font-medium text-purple-800">Peak Revenue Potential</h5>
                          <div className="text-lg font-bold text-purple-700">+2%</div>
                          <div className="text-xs text-purple-600">Annual price increase</div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Market Target Metrics */}
                    <div className="bg-white p-4 rounded border">
                      <h4 className="font-medium text-gray-900 mb-3">Market Target Metrics & Segments</h4>
                      
                      <div className="space-y-4">
                        <div>
                          <h5 className="font-medium text-purple-700 mb-2">Primary Target Cohort</h5>
                          <div className="overflow-x-auto">
                            <table className="w-full text-sm border-collapse border border-gray-200">
                              <thead>
                                <tr className="bg-gray-50">
                                  <th className="border border-gray-200 p-2 text-left">Metric</th>
                                  <th className="border border-gray-200 p-2 text-left">Value (Example)</th>
                                  <th className="border border-gray-200 p-2 text-left">Notes</th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr>
                                  <td className="border border-gray-200 p-2 font-medium">Women aged 40-64</td>
                                  <td className="border border-gray-200 p-2">~64M (U.S.)</td>
                                  <td className="border border-gray-200 p-2">Primary target cohort</td>
                                </tr>
                                <tr>
                                  <td className="border border-gray-200 p-2 font-medium">Annual entering menopause</td>
                                  <td className="border border-gray-200 p-2">~1.3M</td>
                                  <td className="border border-gray-200 p-2">New onset population</td>
                                </tr>
                                <tr>
                                  <td className="border border-gray-200 p-2 font-medium">Vasomotor symptoms prevalence</td>
                                  <td className="border border-gray-200 p-2">~75%</td>
                                  <td className="border border-gray-200 p-2">25% experience severe symptoms</td>
                                </tr>
                                <tr>
                                  <td className="border border-gray-200 p-2 font-medium">Duration of symptoms</td>
                                  <td className="border border-gray-200 p-2">Avg. 7.4 years</td>
                                  <td className="border border-gray-200 p-2">Underscores chronicity</td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                        
                        <div>
                          <h5 className="font-medium text-purple-700 mb-2">Treatment Landscape & Targeting</h5>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <div className="overflow-x-auto">
                                <table className="w-full text-xs border-collapse border border-gray-200">
                                  <thead>
                                    <tr className="bg-gray-50">
                                      <th className="border border-gray-200 p-2 text-left">Therapy</th>
                                      <th className="border border-gray-200 p-2 text-left">Use Rate</th>
                                      <th className="border border-gray-200 p-2 text-left">Limitations</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    <tr>
                                      <td className="border border-gray-200 p-2 font-medium">HRT (estrogen-based)</td>
                                      <td className="border border-gray-200 p-2">~20% eligible women</td>
                                      <td className="border border-gray-200 p-2">Safety concerns (cancer, clot risk)</td>
                                    </tr>
                                    <tr>
                                      <td className="border border-gray-200 p-2 font-medium">Off-label (SSRIs, gabapentin)</td>
                                      <td className="border border-gray-200 p-2">Growing</td>
                                      <td className="border border-gray-200 p-2">Not designed for menopause; limited relief</td>
                                    </tr>
                                    <tr>
                                      <td className="border border-gray-200 p-2 font-medium">Lifestyle interventions</td>
                                      <td className="border border-gray-200 p-2">Common</td>
                                      <td className="border border-gray-200 p-2">Low efficacy in severe VMS</td>
                                    </tr>
                                  </tbody>
                                </table>
                              </div>
                            </div>
                            
                            <div>
                              <div className="overflow-x-auto">
                                <table className="w-full text-xs border-collapse border border-gray-200">
                                  <thead>
                                    <tr className="bg-gray-50">
                                      <th className="border border-gray-200 p-2 text-left">Segment</th>
                                      <th className="border border-gray-200 p-2 text-left">Size</th>
                                      <th className="border border-gray-200 p-2 text-left">Target Potential</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    <tr>
                                      <td className="border border-gray-200 p-2 font-medium">Women experiencing VMS</td>
                                      <td className="border border-gray-200 p-2">~45M</td>
                                      <td className="border border-gray-200 p-2">Primary target</td>
                                    </tr>
                                    <tr>
                                      <td className="border border-gray-200 p-2 font-medium">Avoiding HRT</td>
                                      <td className="border border-gray-200 p-2">~70% of VMS group</td>
                                      <td className="border border-gray-200 p-2">Elinzanetant sweet spot</td>
                                    </tr>
                                    <tr>
                                      <td className="border border-gray-200 p-2 font-medium">Previously failed other therapies</td>
                                      <td className="border border-gray-200 p-2">~30%</td>
                                      <td className="border border-gray-200 p-2">Secondary target</td>
                                    </tr>
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Competitive Brand Analysis */}
                    <div className="bg-white p-4 rounded border">
                      <h4 className="font-medium text-gray-900 mb-3">Competitive Brand Analysis</h4>
                      
                      <div className="overflow-x-auto mb-4">
                        <table className="w-full text-sm border-collapse border border-gray-200">
                          <thead>
                            <tr className="bg-gray-50">
                              <th className="border border-gray-200 p-2 text-left">Brand</th>
                              <th className="border border-gray-200 p-2 text-left">MOA</th>
                              <th className="border border-gray-200 p-2 text-left">Status</th>
                              <th className="border border-gray-200 p-2 text-left">Differentiation</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td className="border border-gray-200 p-2 font-medium">Fezolinetant (Astellas)</td>
                              <td className="border border-gray-200 p-2">NK3R antagonist</td>
                              <td className="border border-gray-200 p-2"><span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">Approved (2023)</span></td>
                              <td className="border border-gray-200 p-2">First-to-market</td>
                            </tr>
                            <tr>
                              <td className="border border-gray-200 p-2 font-medium">MLE4901 (Millendo)</td>
                              <td className="border border-gray-200 p-2">NK3R antagonist</td>
                              <td className="border border-gray-200 p-2"><span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs">Discontinued</span></td>
                              <td className="border border-gray-200 p-2">Liver safety issues</td>
                            </tr>
                            <tr>
                              <td className="border border-gray-200 p-2 font-medium">HRT</td>
                              <td className="border border-gray-200 p-2">Estrogen-based</td>
                              <td className="border border-gray-200 p-2"><span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">Longstanding</span></td>
                              <td className="border border-gray-200 p-2">Not suitable for many</td>
                            </tr>
                            <tr>
                              <td className="border border-gray-200 p-2 font-medium">SSRI/SNRI</td>
                              <td className="border border-gray-200 p-2">Neurotransmitter-based</td>
                              <td className="border border-gray-200 p-2"><span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs">Off-label</span></td>
                              <td className="border border-gray-200 p-2">Efficacy varies</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                      
                      <div className="p-3 bg-gray-50 border border-gray-200 rounded">
                        <h5 className="font-medium text-gray-800 mb-2">Key Success Factors</h5>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
                          <div>
                            <p className="font-medium text-green-700">Reduced work absenteeism</p>
                            <p className="text-gray-600">Higher QoL, economic productivity</p>
                          </div>
                          <div>
                            <p className="font-medium text-blue-700">Fewer ER visits for unmanaged VMS</p>
                            <p className="text-gray-600">Lower burden on healthcare</p>
                          </div>
                          <div>
                            <p className="font-medium text-purple-700">Non-hormonal positioning</p>
                            <p className="text-gray-600">Reduced long-term adverse event cost</p>
                          </div>
                          <div>
                            <p className="font-medium text-indigo-700">Oral dosing advantage</p>
                            <p className="text-gray-600">Better adherence, sustained outcomes</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Launch Execution Framework */}
              <div className="bg-orange-50 border-l-4 border-orange-500 p-4 rounded-r-lg">
                <div className="flex items-center justify-between cursor-pointer" onClick={() => toggleSection('launch-execution')}>
                  <h3 className="text-lg font-semibold text-orange-900 flex items-center">
                    {expandedSections['launch-execution'] ? <ChevronDown className="w-4 h-4 mr-2" /> : <ChevronRight className="w-4 h-4 mr-2" />}
                    Launch Execution & Lifecycle Management
                  </h3>
                </div>
                {expandedSections['launch-execution'] && (
                  <div className="mt-4 space-y-4">
                    
                    {/* Launch Readiness */}
                    <div className="bg-white p-4 rounded border">
                      <h4 className="font-medium text-gray-900 mb-3">Launch Readiness and Operations</h4>
                      
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="space-y-3">
                          <h5 className="font-medium text-orange-700">1. Launch Readiness and Operations</h5>
                          <div className="text-xs text-gray-600 space-y-1">
                            <p>• Launch excellence frameworks (e.g., McKinsey's "Launch Readiness Index")</p>
                            <p>• War rooms and KPI dashboards</p>
                            <p>• Cross-functional launch teams (medical, commercial, regulatory, supply)</p>
                          </div>
                        </div>
                        
                        <div className="space-y-3">
                          <h5 className="font-medium text-orange-700">2. Supply Chain and Distribution Readiness</h5>
                          <div className="text-xs text-gray-600 space-y-1">
                            <p>• Inventory management</p>
                            <p>• Cold chain / specialty requirements</p>
                            <p>• Pharmacovigilance systems and reporting</p>
                          </div>
                        </div>
                        
                        <div className="space-y-3">
                          <h5 className="font-medium text-orange-700">3. Regulatory and Legal Compliance</h5>
                          <div className="text-xs text-gray-600 space-y-1">
                            <p>• Promotional material review processes (MLR committees)</p>
                            <p>• Sunshine Act, FDA OPDP requirements</p>
                            <p>• Labeling, packaging, and risk evaluation and mitigation strategy (REMS)</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Post-Launch Management */}
                    <div className="bg-white p-4 rounded border">
                      <h4 className="font-medium text-gray-900 mb-3">Post-Launch and Lifecycle Management</h4>
                      
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="space-y-3">
                          <h5 className="font-medium text-orange-700">1. Performance Tracking and Analytics</h5>
                          <div className="text-xs text-gray-600 space-y-1">
                            <p>• Launch KPIs: NBRx/TRx, market share, brand awareness</p>
                            <p>• Sales force effectiveness and engagement analytics</p>
                            <p>• Digital metrics (web, social, CRM)</p>
                          </div>
                        </div>
                        
                        <div className="space-y-3">
                          <h5 className="font-medium text-orange-700">2. Label Expansion and LCM Strategy</h5>
                          <div className="text-xs text-gray-600 space-y-1">
                            <p>• New indications or lines of therapy</p>
                            <p>• Geographic expansion planning</p>
                            <p>• Formulation changes (e.g., oral to injectable)</p>
                          </div>
                        </div>
                        
                        <div className="space-y-3">
                          <h5 className="font-medium text-orange-700">3. Competitive Defense and Brand Evolution</h5>
                          <div className="text-xs text-gray-600 space-y-1">
                            <p>• Patent and exclusivity protection strategy</p>
                            <p>• Response to biosimilars or generics</p>
                            <p>• Rebranding or repositioning if necessary</p>
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
    
    if (activeSection === "questions") {
      return <EMMEQuestions />;
    }
    
    if (activeSection === "content-library") {
      return (
        <div className="space-y-6">
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
                    to upload documents, reports, or research files (max 50 MB)
                  </p>
                </div>
              </div>
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

    // Competitive Intelligence Section
    if (activeSection === "competitive-intelligence") {
      return (
        <div className="space-y-6">
          {/* Real-time Intelligence Feed */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Target className="w-5 h-5 mr-2 text-red-600" />
                  Live Competitive Alerts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 bg-red-50 border-l-4 border-red-500 rounded">
                    <p className="text-sm font-medium">FDA Approval Update</p>
                    <p className="text-xs text-gray-600">Competitor XYZ received FDA approval for new indication</p>
                    <Badge variant="destructive" className="mt-1">Critical</Badge>
                  </div>
                  <div className="p-3 bg-yellow-50 border-l-4 border-yellow-500 rounded">
                    <p className="text-sm font-medium">Patent Filing</p>
                    <p className="text-xs text-gray-600">New composition patents filed by Competitor ABC</p>
                    <Badge variant="secondary" className="mt-1">Medium</Badge>
                  </div>
                  <div className="p-3 bg-blue-50 border-l-4 border-blue-500 rounded">
                    <p className="text-sm font-medium">Partnership Announcement</p>
                    <p className="text-xs text-gray-600">Strategic alliance formed in APAC region</p>
                    <Badge variant="outline" className="mt-1">Info</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Competitive Landscape Map</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-purple-50 rounded">
                      <div className="text-xl font-bold text-purple-600">24</div>
                      <div className="text-xs text-gray-600">Direct Competitors</div>
                    </div>
                    <div className="text-center p-3 bg-blue-50 rounded">
                      <div className="text-xl font-bold text-blue-600">67</div>
                      <div className="text-xs text-gray-600">Indirect Competitors</div>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded">
                      <div className="text-xl font-bold text-green-600">156</div>
                      <div className="text-xs text-gray-600">Monitored Products</div>
                    </div>
                    <div className="text-center p-3 bg-orange-50 rounded">
                      <div className="text-xl font-bold text-orange-600">89</div>
                      <div className="text-xs text-gray-600">Active Pipelines</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Market Share Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Competitor A</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-600 h-2 rounded-full" style={{width: '42%'}}></div>
                      </div>
                      <span className="text-xs font-medium">42%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Competitor B</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div className="bg-purple-600 h-2 rounded-full" style={{width: '28%'}}></div>
                      </div>
                      <span className="text-xs font-medium">28%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Our Position</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div className="bg-green-600 h-2 rounded-full" style={{width: '18%'}}></div>
                      </div>
                      <span className="text-xs font-medium">18%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Competitive Intelligence Dashboard */}
          <Card>
            <CardHeader>
              <CardTitle>Competitive Intelligence Dashboard</CardTitle>
              <CardDescription>Real-time monitoring and analysis of competitive landscape</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <h4 className="font-medium mb-3">Pipeline Activity</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Phase I Trials</span>
                      <span className="font-medium">34 active</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Phase II Trials</span>
                      <span className="font-medium">22 active</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Phase III Trials</span>
                      <span className="font-medium">12 active</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>FDA Submissions</span>
                      <span className="font-medium text-orange-600">8 pending</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-3">LOE Tracking</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Expiring 2025</span>
                      <span className="font-medium text-red-600">23 products</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Expiring 2026</span>
                      <span className="font-medium text-orange-600">31 products</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Expiring 2027</span>
                      <span className="font-medium text-yellow-600">28 products</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Generic Filings</span>
                      <span className="font-medium">67 pending</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    // Regulatory Strategy Section
    if (activeSection === "regulatory-strategy") {
      return (
        <div className="space-y-6">
          {/* 505(b)(2) Pathway Analysis */}
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Shield className="w-5 h-5 mr-2 text-blue-600" />
                  505(b)(2) Pathway Optimizer
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded">
                    <h4 className="font-medium text-blue-900 mb-2">Pathway Eligibility Score</h4>
                    <div className="text-3xl font-bold text-blue-600 mb-1">87%</div>
                    <p className="text-sm text-blue-700">High probability of successful 505(b)(2) approval</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="text-center p-3 bg-white border rounded">
                      <div className="text-lg font-bold text-green-600">12-18</div>
                      <div className="text-xs text-gray-600">Months to Approval</div>
                    </div>
                    <div className="text-center p-3 bg-white border rounded">
                      <div className="text-lg font-bold text-purple-600">$15M</div>
                      <div className="text-xs text-gray-600">Est. Dev Cost</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Regulatory Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <div>
                      <p className="text-sm font-medium">IND Filing</p>
                      <p className="text-xs text-gray-600">Completed - Q2 2024</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <div>
                      <p className="text-sm font-medium">Phase I/II Studies</p>
                      <p className="text-xs text-gray-600">Completed - Q4 2024</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Clock className="w-5 h-5 text-orange-500" />
                    <div>
                      <p className="text-sm font-medium">Pre-NDA Meeting</p>
                      <p className="text-xs text-gray-600">Scheduled - Q2 2025</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <AlertTriangle className="w-5 h-5 text-blue-500" />
                    <div>
                      <p className="text-sm font-medium">NDA Submission</p>
                      <p className="text-xs text-gray-600">Planned - Q3 2025</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Regulatory Intelligence */}
          <Card>
            <CardHeader>
              <CardTitle>Regulatory Intelligence Center</CardTitle>
              <CardDescription>FDA guidance tracking and regulatory precedent analysis</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">Recent FDA Guidance</h4>
                    <div className="space-y-2 text-sm">
                      <div className="p-2 bg-gray-50 rounded">
                        <p className="font-medium">505(b)(2) Applications</p>
                        <p className="text-xs text-gray-600">Updated January 2025</p>
                      </div>
                      <div className="p-2 bg-gray-50 rounded">
                        <p className="font-medium">Bioequivalence Studies</p>
                        <p className="text-xs text-gray-600">Draft guidance issued</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">Precedent Analysis</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Similar Approvals</span>
                        <span className="font-medium">23 precedents</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Avg Review Time</span>
                        <span className="font-medium">14.2 months</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Success Rate</span>
                        <span className="font-medium text-green-600">78%</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">Risk Assessment</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Regulatory Risk</span>
                        <Badge variant="secondary">Low</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">CMC Complexity</span>
                        <Badge variant="outline">Medium</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Clinical Risk</span>
                        <Badge variant="secondary">Low</Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    // Market Access Section
    if (activeSection === "market-access") {
      return (
        <div className="space-y-6">
          {/* Market Access Overview */}
          <div className="grid gap-6 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Payer Coverage Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Commercial Plans</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div className="bg-green-600 h-2 rounded-full" style={{width: '85%'}}></div>
                      </div>
                      <span className="text-xs font-medium">85%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Medicare</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-600 h-2 rounded-full" style={{width: '72%'}}></div>
                      </div>
                      <span className="text-xs font-medium">72%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Medicaid</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div className="bg-purple-600 h-2 rounded-full" style={{width: '68%'}}></div>
                      </div>
                      <span className="text-xs font-medium">68%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Pricing Strategy</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="text-center p-3 bg-green-50 border border-green-200 rounded">
                    <div className="text-2xl font-bold text-green-600">$485</div>
                    <div className="text-xs text-green-700">Optimal WAC Price/Month</div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="text-center p-2 bg-gray-50 rounded">
                      <div className="font-medium">$425-$545</div>
                      <div className="text-gray-600">Price Range</div>
                    </div>
                    <div className="text-center p-2 bg-gray-50 rounded">
                      <div className="font-medium">$195</div>
                      <div className="text-gray-600">Est. Patient Cost</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Value Proposition</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded">
                    <div className="text-lg font-bold text-blue-600">$12,400</div>
                    <div className="text-xs text-blue-700">Annual Healthcare Savings</div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Quality of Life</span>
                      <span className="font-medium text-green-600">+45%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Hospitalization</span>
                      <span className="font-medium text-green-600">-32%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>ER Visits</span>
                      <span className="font-medium text-green-600">-28%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Market Access Strategy */}
          <Card>
            <CardHeader>
              <CardTitle>Market Access Strategy Dashboard</CardTitle>
              <CardDescription>Comprehensive payer engagement and coverage optimization</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <h4 className="font-medium mb-4">Payer Engagement Status</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 border rounded">
                      <div>
                        <p className="font-medium">Tier 1 Payers</p>
                        <p className="text-sm text-gray-600">Major commercial plans</p>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-green-600">8/10</div>
                        <div className="text-xs text-gray-500">Engaged</div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded">
                      <div>
                        <p className="font-medium">Regional Plans</p>
                        <p className="text-sm text-gray-600">State & regional payers</p>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-blue-600">15/18</div>
                        <div className="text-xs text-gray-500">Engaged</div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded">
                      <div>
                        <p className="font-medium">Medicare Plans</p>
                        <p className="text-sm text-gray-600">Part D coverage</p>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-purple-600">12/15</div>
                        <div className="text-xs text-gray-500">Engaged</div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-4">Coverage Milestones</h4>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <div>
                        <p className="text-sm font-medium">P&T Committee Presentations</p>
                        <p className="text-xs text-gray-600">Completed for top 5 payers</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <div>
                        <p className="text-sm font-medium">HEOR Dossier</p>
                        <p className="text-xs text-gray-600">Submitted to all major payers</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Clock className="w-5 h-5 text-orange-500" />
                      <div>
                        <p className="text-sm font-medium">Formulary Placements</p>
                        <p className="text-xs text-gray-600">In negotiation with 8 payers</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <AlertTriangle className="w-5 h-5 text-blue-500" />
                      <div>
                        <p className="text-sm font-medium">Prior Auth Criteria</p>
                        <p className="text-xs text-gray-600">Finalizing with regional plans</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    // Partnerships Section
    if (activeSection === "partnerships") {
      return (
        <div className="space-y-6">
          {/* Partnership Overview */}
          <div className="grid gap-6 md:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Partnerships</CardTitle>
                <Handshake className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">47</div>
                <p className="text-xs text-muted-foreground">Strategic alliances</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pipeline Value</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$2.8B</div>
                <p className="text-xs text-muted-foreground">Combined NPV</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">LOE Preparations</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">23</div>
                <p className="text-xs text-muted-foreground">Active programs</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">87%</div>
                <p className="text-xs text-muted-foreground">Deal completion</p>
              </CardContent>
            </Card>
          </div>

          {/* Active Partnerships */}
          <Card>
            <CardHeader>
              <CardTitle>Active Partnership Portfolio</CardTitle>
              <CardDescription>Strategic alliances and licensing agreements</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-1">
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Building2 className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold">BioPharma Global Inc.</h4>
                          <p className="text-sm text-gray-600">Exclusive licensing - Oncology portfolio</p>
                        </div>
                      </div>
                      <Badge variant="default">Active</Badge>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Deal Value</p>
                        <p className="font-medium">$450M</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Territory</p>
                        <p className="font-medium">North America</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Status</p>
                        <p className="font-medium text-green-600">Phase II</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Next Milestone</p>
                        <p className="font-medium">Q3 2025</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                          <Building2 className="w-5 h-5 text-purple-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold">European Therapeutics Ltd.</h4>
                          <p className="text-sm text-gray-600">Co-development agreement - CNS portfolio</p>
                        </div>
                      </div>
                      <Badge variant="secondary">Negotiating</Badge>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Deal Value</p>
                        <p className="font-medium">$320M</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Territory</p>
                        <p className="font-medium">EU & APAC</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Status</p>
                        <p className="font-medium text-orange-600">Term Sheet</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Next Milestone</p>
                        <p className="font-medium">Q2 2025</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                          <Building2 className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold">Asia Pacific Pharma</h4>
                          <p className="text-sm text-gray-600">Distribution rights - Generic portfolio</p>
                        </div>
                      </div>
                      <Badge variant="outline">LOE Prep</Badge>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Deal Value</p>
                        <p className="font-medium">$125M</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Territory</p>
                        <p className="font-medium">APAC</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Status</p>
                        <p className="font-medium text-blue-600">Due Diligence</p>
                      </div>
                      <div>
                        <p className="text-gray-600">LOE Date</p>
                        <p className="font-medium">Q4 2025</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Partnership Analytics */}
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Deal Flow Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Deals in Pipeline</span>
                    <span className="font-medium">34 opportunities</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Average Deal Size</span>
                    <span className="font-medium">$285M</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Time to Close</span>
                    <span className="font-medium">8.5 months</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Partnership ROI</span>
                    <span className="font-medium text-green-600">245%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Geographic Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">North America</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-600 h-2 rounded-full" style={{width: '45%'}}></div>
                      </div>
                      <span className="text-xs font-medium">45%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Europe</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div className="bg-purple-600 h-2 rounded-full" style={{width: '32%'}}></div>
                      </div>
                      <span className="text-xs font-medium">32%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Asia Pacific</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div className="bg-green-600 h-2 rounded-full" style={{width: '23%'}}></div>
                      </div>
                      <span className="text-xs font-medium">23%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      );
    }

    // Analytics Dashboard Section
    if (activeSection === "analytics-dashboard") {
      return (
        <div className="space-y-6">
          {/* Key Performance Indicators */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Platform Usage</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">2,847</div>
                <p className="text-xs text-muted-foreground">Active monthly users</p>
                <div className="flex items-center pt-1">
                  <TrendingUp className="h-3 w-3 text-green-600 mr-1" />
                  <span className="text-xs text-green-600">+12.5% from last month</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Intelligence Alerts</CardTitle>
                <Zap className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1,234</div>
                <p className="text-xs text-muted-foreground">Generated this month</p>
                <div className="flex items-center pt-1">
                  <TrendingUp className="h-3 w-3 text-green-600 mr-1" />
                  <span className="text-xs text-green-600">+8.3% accuracy improved</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Time Saved</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">847</div>
                <p className="text-xs text-muted-foreground">Hours per month</p>
                <div className="flex items-center pt-1">
                  <TrendingUp className="h-3 w-3 text-blue-600 mr-1" />
                  <span className="text-xs text-blue-600">Equivalent to $127K savings</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">ROI Generated</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">487%</div>
                <p className="text-xs text-muted-foreground">Annual return on investment</p>
                <div className="flex items-center pt-1">
                  <TrendingUp className="h-3 w-3 text-green-600 mr-1" />
                  <span className="text-xs text-green-600">Above industry avg (312%)</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Intelligence Performance */}
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Intelligence Module Performance</CardTitle>
                <CardDescription>Usage and effectiveness metrics across EMME Connect™ modules</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Brain className="w-4 h-4 text-purple-600" />
                      <span className="text-sm">Research Hub</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div className="bg-purple-600 h-2 rounded-full" style={{width: '94%'}}></div>
                      </div>
                      <span className="text-sm font-medium">94%</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Target className="w-4 h-4 text-red-600" />
                      <span className="text-sm">Competitive Intel</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div className="bg-red-600 h-2 rounded-full" style={{width: '89%'}}></div>
                      </div>
                      <span className="text-sm font-medium">89%</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Shield className="w-4 h-4 text-blue-600" />
                      <span className="text-sm">Regulatory Strategy</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-600 h-2 rounded-full" style={{width: '92%'}}></div>
                      </div>
                      <span className="text-sm font-medium">92%</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="w-4 h-4 text-green-600" />
                      <span className="text-sm">Market Access</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div className="bg-green-600 h-2 rounded-full" style={{width: '87%'}}></div>
                      </div>
                      <span className="text-sm font-medium">87%</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Handshake className="w-4 h-4 text-orange-600" />
                      <span className="text-sm">Partnerships</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div className="bg-orange-600 h-2 rounded-full" style={{width: '91%'}}></div>
                      </div>
                      <span className="text-sm font-medium">91%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>User Engagement Trends</CardTitle>
                <CardDescription>Platform adoption and feature utilization over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center p-4 bg-blue-50 border border-blue-200 rounded">
                    <div className="text-2xl font-bold text-blue-600">156%</div>
                    <div className="text-sm text-blue-700">Growth in Active Users</div>
                    <div className="text-xs text-blue-600">vs. previous quarter</div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-gray-50 rounded">
                      <div className="text-lg font-bold">3.2hrs</div>
                      <div className="text-xs text-gray-600">Avg Session Duration</div>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded">
                      <div className="text-lg font-bold">12.8</div>
                      <div className="text-xs text-gray-600">Sessions per User/Month</div>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded">
                      <div className="text-lg font-bold">97%</div>
                      <div className="text-xs text-gray-600">User Satisfaction</div>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded">
                      <div className="text-lg font-bold">4.2K</div>
                      <div className="text-xs text-gray-600">Queries Processed/Day</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity Feed */}
          <Card>
            <CardHeader>
              <CardTitle>Real-Time Intelligence Feed</CardTitle>
              <CardDescription>Latest updates from across the pharmaceutical intelligence network</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 p-3 bg-red-50 border-l-4 border-red-500 rounded">
                  <div className="w-2 h-2 rounded-full bg-red-500"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Critical Competitive Alert</p>
                    <p className="text-xs text-gray-600">Major competitor received breakthrough therapy designation</p>
                  </div>
                  <span className="text-xs text-gray-500">2 min ago</span>
                </div>
                
                <div className="flex items-center space-x-3 p-3 bg-blue-50 border-l-4 border-blue-500 rounded">
                  <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Regulatory Update</p>
                    <p className="text-xs text-gray-600">FDA issued new guidance on 505(b)(2) applications</p>
                  </div>
                  <span className="text-xs text-gray-500">15 min ago</span>
                </div>
                
                <div className="flex items-center space-x-3 p-3 bg-green-50 border-l-4 border-green-500 rounded">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Partnership Opportunity</p>
                    <p className="text-xs text-gray-600">New licensing opportunity identified in CNS space</p>
                  </div>
                  <span className="text-xs text-gray-500">1 hr ago</span>
                </div>
                
                <div className="flex items-center space-x-3 p-3 bg-purple-50 border-l-4 border-purple-500 rounded">
                  <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Market Access Insight</p>
                    <p className="text-xs text-gray-600">Payer coverage decision released for competing therapy</p>
                  </div>
                  <span className="text-xs text-gray-500">2 hrs ago</span>
                </div>
                
                <div className="flex items-center space-x-3 p-3 bg-orange-50 border-l-4 border-orange-500 rounded">
                  <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">LOE Alert</p>
                    <p className="text-xs text-gray-600">Patent expiration confirmed for blockbuster drug in Q4 2025</p>
                  </div>
                  <span className="text-xs text-gray-500">3 hrs ago</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    if (activeSection === "projects") {
      console.log("Rendering Projects section");
      return <EMMEProjectManager />;
    }

    // Return null for other sections to show default content
    return null;
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Left Sidebar Navigation */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-purple-600 flex items-center justify-center">
              <Brain className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-gray-900">EMME Connect™ v2.0</h1>
              <p className="text-xs text-gray-600">{currentProject}</p>
            </div>
          </div>
        </div>
        
        <nav className="flex-1 p-4">
          <div className="bg-blue-100 p-2 mb-4 rounded text-xs text-blue-800">
            EMME v2.0 - Navigation: {navigationItems.length} items loaded
          </div>
          <div className="space-y-2">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                    activeSection === item.id
                      ? 'bg-purple-100 text-purple-700 font-medium'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm">{item.label}</span>
                </button>
              );
            })}
          </div>
        </nav>
      </div>
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">
                {activeSection === 'research-hub' && 'Research Intelligence Hub'}
                {activeSection === 'competitive-intelligence' && 'Competitive Intelligence'}
                {activeSection === 'regulatory-strategy' && 'Regulatory Strategy'}
                {activeSection === 'market-access' && 'Market Access Planning'}
                {activeSection === 'projects' && 'Project Information Completion'}
                {activeSection === 'questions' && 'Questions Management'}
                {activeSection === 'content-library' && 'Content Library'}
                {activeSection === 'partnerships' && 'Client Management'}
                {activeSection === 'analytics-dashboard' && 'Analytics Dashboard'}
              </h1>
              <p className="text-gray-600">
                {activeSection === 'research-hub' && 'Advanced market analysis and competitive intelligence'}
                {activeSection === 'competitive-intelligence' && 'Real-time competitive monitoring and analysis'}
                {activeSection === 'regulatory-strategy' && '505(b)(2) pathway optimization and regulatory intelligence'}
                {activeSection === 'market-access' && 'Commercial strategy and market access planning'}
                {activeSection === 'projects' && 'Create and manage pharmaceutical project information'}
                {activeSection === 'questions' && 'Advanced NLP-powered question processing and management'}
                {activeSection === 'content-library' && 'Document management and research repository'}
                {activeSection === 'partnerships' && 'Client relationship and account management'}
                {activeSection === 'analytics-dashboard' && 'Performance metrics and business intelligence'}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search intelligence..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 w-64"
                />
              </div>
            </div>
          </div>
        </div>
        
        {/* Content Area with Chat */}
        <div className="flex-1 flex">
          {/* Main Content */}
          <div className="flex-1 p-6 overflow-auto">
            
            {renderMainContent()}
          </div>
          
          {/* EMME AI Chat Assistant */}
          <div className="w-80 bg-white border-l border-gray-200 flex flex-col">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
                  <Brain className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">EMME AI</h3>
                  <p className="text-xs text-gray-600">Pharmaceutical Intelligence Assistant</p>
                </div>
              </div>
            </div>
            
            {/* Chat Input - Positioned right after intro */}
            <div className="p-4 border-b border-gray-200">
              {chatMessages.length === 0 && (
                <div className="text-center text-gray-500 text-sm mb-4">
                  <p className="mb-4">Hello! I'm EMME, your EMME Connect™ intelligence assistant.</p>
                  <p className="mb-4">I can help with:</p>
                  <div className="space-y-2 text-xs">
                    <div className="bg-gray-50 p-2 rounded">• Competitive analysis</div>
                    <div className="bg-gray-50 p-2 rounded">• Regulatory strategy</div>
                    <div className="bg-gray-50 p-2 rounded">• Market access planning</div>
                    <div className="bg-gray-50 p-2 rounded">• Partnership structuring</div>
                  </div>
                </div>
              )}
              
              {/* Chat Input Box */}
              <div className="flex space-x-2">
                <Textarea
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Ask EMME about biomarkers, drug interactions, clinical trials..."
                  className="flex-1 min-h-[60px] max-h-[120px] text-sm"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                />
                <Button 
                  onClick={handleSendMessage}
                  disabled={!chatInput.trim()}
                  size="sm"
                  className="self-end"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="flex-1 p-4 overflow-auto">
              <div className="space-y-4">
                
                {chatMessages.map((message) => (
                  <div key={message.id} className={`flex ${
                    message.type === 'user' ? 'justify-end' : 'justify-start'
                  }`}>
                    <div className={`max-w-xs p-3 rounded-lg ${
                      message.type === 'user' 
                        ? 'bg-purple-600 text-white' 
                        : 'bg-gray-100 text-gray-900'
                    }`}>
                      <p className="text-sm">{message.content}</p>
                      
                      {/* Show NLP Analysis Metadata for AI responses */}
                      {message.type === 'assistant' && message.metadata && (
                        <div className="mt-2 space-y-1">
                          {message.metadata.confidence && (
                            <div className="flex items-center text-xs">
                              <Brain className="w-3 h-3 mr-1" />
                              <span>Confidence: {Math.round(message.metadata.confidence * 100)}%</span>
                            </div>
                          )}
                          {message.metadata.entities && message.metadata.entities.length > 0 && (
                            <div className="text-xs">
                              <span className="opacity-75">Entities: </span>
                              {message.metadata.entities.map((entity, idx) => (
                                <Badge key={idx} variant="outline" className="text-xs mr-1">
                                  {entity.text}
                                </Badge>
                              ))}
                            </div>
                          )}
                          {message.metadata.processingTime && (
                            <div className="text-xs opacity-75">
                              <Clock className="w-3 h-3 inline mr-1" />
                              Processed in {message.metadata.processingTime}ms
                            </div>
                          )}
                        </div>
                      )}
                      
                      {message.sources && (
                        <div className="mt-2 text-xs opacity-75">
                          Sources: {message.sources.slice(0, 2).map(source => (
                            <a key={source} href={source} target="_blank" rel="noopener noreferrer" className="underline mr-2">
                              {source.split('/')[2]}
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}