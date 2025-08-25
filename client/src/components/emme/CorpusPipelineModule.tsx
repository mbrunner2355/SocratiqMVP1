import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Database, 
  Zap, 
  Network, 
  GitBranch, 
  Bot, 
  FileText, 
  BarChart3, 
  Activity, 
  Shield, 
  Brain,
  Upload,
  Download,
  Settings
} from "lucide-react";

export function CorpusPipelineModule() {
  const [activeTab, setActiveTab] = useState("corpus");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">EMME Pharmaceutical Intelligence Corpus</h1>
        <p className="text-lg text-gray-600 mt-2">
          Comprehensive pharmaceutical data processing pipeline with specialized AI models for drug commercialization
        </p>
      </div>

      {/* Horizontal Tabs Navigation */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="corpus" className="flex items-center gap-2">
            <Database className="w-4 h-4" />
            Corpus
          </TabsTrigger>
          <TabsTrigger value="pipeline" className="flex items-center gap-2">
            <Activity className="w-4 h-4" />
            Pipeline
          </TabsTrigger>
          <TabsTrigger value="models" className="flex items-center gap-2">
            <Brain className="w-4 h-4" />
            Models
          </TabsTrigger>
          <TabsTrigger value="trust" className="flex items-center gap-2">
            <Shield className="w-4 h-4" />
            Trust
          </TabsTrigger>
        </TabsList>

        {/* Corpus Tab - Corpus Construction & Federation */}
        <TabsContent value="corpus" className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Pharmaceutical Data Corpus & Intelligence</h2>
            <p className="text-lg text-gray-600 mb-6">
              Specialized pharmaceutical knowledge bases with real-world evidence, clinical data, market intelligence, and regulatory insights for strategic commercialization
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Domain Corpora */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="w-5 h-5" />
                  Domain-Specific Corpora
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Drug Launch Intelligence</span>
                    <Badge variant="secondary" className="bg-purple-100 text-purple-800">15,247 docs</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Clinical Trial Data</span>
                    <Badge variant="outline" className="border-purple-200 text-purple-700">8,934 docs</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Regulatory Submissions</span>
                    <Badge variant="outline" className="border-purple-200 text-purple-700">4,521 docs</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Market Access Data</span>
                    <Badge variant="outline" className="border-purple-200 text-purple-700">6,832 docs</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Real-World Evidence</span>
                    <Badge variant="outline" className="border-purple-200 text-purple-700">3,156 docs</Badge>
                  </div>
                  <Button className="w-full mt-4 bg-purple-600 hover:bg-purple-700">
                    <Database className="w-4 h-4 mr-2" />
                    Create Therapeutic Area Corpus
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Semantic Tagging */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="w-5 h-5 text-purple-600" />
                  Pharmaceutical AI Tagging
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Drug Names & Mechanisms</span>
                    <div className="flex items-center gap-2">
                      <Progress value={94} className="w-16 h-2" />
                      <span className="text-xs text-purple-600 font-medium">847K</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Clinical Indications</span>
                    <div className="flex items-center gap-2">
                      <Progress value={89} className="w-16 h-2" />
                      <span className="text-xs text-purple-600 font-medium">623K</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Therapeutic Areas</span>
                    <div className="flex items-center gap-2">
                      <Progress value={92} className="w-16 h-2" />
                      <span className="text-xs text-purple-600 font-medium">456K</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Market Access Terms</span>
                    <div className="flex items-center gap-2">
                      <Progress value={87} className="w-16 h-2" />
                      <span className="text-xs text-purple-600 font-medium">234K</span>
                    </div>
                  </div>
                  <Button className="w-full mt-4 bg-purple-600 hover:bg-purple-700 text-white">
                    <Brain className="w-4 h-4 mr-2" />
                    Run AI Entity Extraction
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Real-Time Data Sources */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-purple-600" />
                  Live Data Connections
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">FDA Orange Book</span>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">Live</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">ClinicalTrials.gov</span>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">Live</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Medicare Coverage</span>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">Live</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">EMA Database</span>
                    <Badge variant="outline" className="border-yellow-200 text-yellow-700">Sync</Badge>
                  </div>
                  <Button className="w-full mt-4 bg-purple-600 hover:bg-purple-700 text-white">
                    <Network className="w-4 h-4 mr-2" />
                    Configure Data Sources
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Context Memory */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="w-5 h-5" />
                  Context Memory Architecture
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Short-term Memory</span>
                      <Badge variant="secondary">Active</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Working Memory</span>
                      <Badge variant="secondary">847 contexts</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Episodic Memory</span>
                      <Badge variant="outline">23.4K episodes</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Semantic Memory</span>
                      <Badge variant="outline">2.1M concepts</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Versioning System */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GitBranch className="w-5 h-5" />
                  Corpus Versioning
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Active Versions</span>
                      <Badge variant="outline">v3.2.1</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Version History</span>
                      <Badge variant="outline">47 versions</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Rollback Capability</span>
                      <Badge variant="secondary">Enabled</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Change Tracking</span>
                      <Badge variant="secondary">Real-time</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Federated Query Engine */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Federated Query Engine
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Query Performance</span>
                      <Badge variant="secondary">0.3s avg</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Cross-Corpus Queries</span>
                      <Badge variant="outline">12,847</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Result Accuracy</span>
                      <Badge variant="secondary">96.8%</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Real-time Analytics</span>
                      <Badge variant="secondary">Active</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Pipeline Tab - Pharmaceutical Intelligence Pipeline */}
        <TabsContent value="pipeline" className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">EMME Pharmaceutical Intelligence Pipeline</h2>
            <p className="text-lg text-gray-600 mb-6">
              End-to-end pharmaceutical data processing with real-time market intelligence, regulatory monitoring, and commercial insights
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Pharmaceutical Data Ingestion */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="w-5 h-5 text-purple-600" />
                  Pharmaceutical Data Ingestion
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Clinical Study Reports</span>
                      <Badge variant="secondary" className="bg-purple-100 text-purple-800">12,847 docs</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Regulatory Submissions</span>
                      <Badge variant="outline" className="border-purple-200 text-purple-700">6,234 docs</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Market Research</span>
                      <Badge variant="outline" className="border-purple-200 text-purple-700">4,521 docs</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Processing Rate</span>
                      <Badge variant="secondary" className="bg-green-100 text-green-800">2.3K/hour</Badge>
                    </div>
                  </div>
                  <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white">
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Pharmaceutical Data
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* AI Intelligence Processing */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-purple-600" />
                  AI Intelligence Processing
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Market Signal Detection</span>
                      <Badge variant="secondary" className="bg-green-100 text-green-800">99.8%</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Competitive Intelligence</span>
                      <Badge variant="secondary" className="bg-green-100 text-green-800">98.7%</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Risk Assessment</span>
                      <Badge variant="secondary" className="bg-green-100 text-green-800">96.4%</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Therapeutic Analysis</span>
                      <Badge variant="secondary" className="bg-green-100 text-green-800">94.2%</Badge>
                    </div>
                  </div>
                  <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white">
                    <Zap className="w-4 h-4 mr-2" />
                    Run Intelligence Analysis
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Commercial Intelligence */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="w-5 h-5 text-purple-600" />
                  Commercial Intelligence Output
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Launch Success Predictions</span>
                    <div className="flex items-center gap-2">
                      <Progress value={94} className="w-16 h-2" />
                      <span className="text-xs text-purple-600 font-medium">94%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Market Access Insights</span>
                    <div className="flex items-center gap-2">
                      <Progress value={89} className="w-16 h-2" />
                      <span className="text-xs text-purple-600 font-medium">89%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Competitive Analysis</span>
                    <div className="flex items-center gap-2">
                      <Progress value={92} className="w-16 h-2" />
                      <span className="text-xs text-purple-600 font-medium">92%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Revenue Forecasting</span>
                    <div className="flex items-center gap-2">
                      <Progress value={87} className="w-16 h-2" />
                      <span className="text-xs text-purple-600 font-medium">87%</span>
                    </div>
                  </div>
                  <Button className="w-full mt-4 bg-purple-600 hover:bg-purple-700 text-white">
                    <Brain className="w-4 h-4 mr-2" />
                    Generate Commercial Report
                  </Button>
                </div>
              </CardContent>
            </Card>

          </div>

          {/* Pipeline Workflow Visualization */}
          <div className="mt-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4">EMME Intelligence Pipeline Workflow</h3>
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0 md:space-x-4">
                  {/* Stage 1 */}
                  <div className="flex flex-col items-center space-y-2 flex-1">
                    <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
                      <Upload className="w-8 h-8 text-purple-600" />
                    </div>
                    <div className="text-center">
                      <div className="font-semibold text-gray-900">Data Ingestion</div>
                      <div className="text-sm text-gray-600">Clinical trials, regulatory docs, market reports</div>
                    </div>
                  </div>
                  
                  {/* Arrow 1 */}
                  <div className="flex-shrink-0">
                    <div className="w-8 h-0.5 bg-purple-300"></div>
                  </div>
                  
                  {/* Stage 2 */}
                  <div className="flex flex-col items-center space-y-2 flex-1">
                    <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
                      <Zap className="w-8 h-8 text-purple-600" />
                    </div>
                    <div className="text-center">
                      <div className="font-semibold text-gray-900">AI Processing</div>
                      <div className="text-sm text-gray-600">Signal detection, risk assessment, entity extraction</div>
                    </div>
                  </div>
                  
                  {/* Arrow 2 */}
                  <div className="flex-shrink-0">
                    <div className="w-8 h-0.5 bg-purple-300"></div>
                  </div>
                  
                  {/* Stage 3 */}
                  <div className="flex flex-col items-center space-y-2 flex-1">
                    <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
                      <Brain className="w-8 h-8 text-purple-600" />
                    </div>
                    <div className="text-center">
                      <div className="font-semibold text-gray-900">Intelligence Generation</div>
                      <div className="text-sm text-gray-600">Commercial insights, launch predictions, competitive analysis</div>
                    </div>
                  </div>
                  
                  {/* Arrow 3 */}
                  <div className="flex-shrink-0">
                    <div className="w-8 h-0.5 bg-purple-300"></div>
                  </div>
                  
                  {/* Stage 4 */}
                  <div className="flex flex-col items-center space-y-2 flex-1">
                    <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
                      <BarChart3 className="w-8 h-8 text-purple-600" />
                    </div>
                    <div className="text-center">
                      <div className="font-semibold text-gray-900">Strategic Output</div>
                      <div className="text-sm text-gray-600">Actionable reports, dashboards, recommendations</div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 flex justify-center">
                  <Button className="bg-purple-600 hover:bg-purple-700 text-white px-8">
                    <Activity className="w-4 h-4 mr-2" />
                    View Pipeline Status
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>



        {/* Models Tab - Sophie™ AI Agent Content */}
        <TabsContent value="models" className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Sophie™ AI Agent Layer</h2>
            <p className="text-lg text-gray-600 mb-6">
              Conversational AI, semantic search, intelligent document analysis, and proactive pharmaceutical insights with advanced reasoning capabilities
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* AI Model Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bot className="w-5 h-5" />
                  Sophie™ Core Models
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">PharmaGPT-4</span>
                    <Badge variant="secondary">Active</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">BioBERT Clinical</span>
                    <Badge variant="secondary">Active</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">ClinicalT5</span>
                    <Badge variant="secondary">Active</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">DrugBERT</span>
                    <Badge variant="secondary">Active</Badge>
                  </div>
                  <Button className="w-full mt-4">
                    <Bot className="w-4 h-4 mr-2" />
                    Launch Sophie™
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Conversational AI */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="w-5 h-5" />
                  Conversational Intelligence
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Active Sessions</span>
                      <Badge variant="outline">234</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Query Response Time</span>
                      <Badge variant="secondary">1.2s</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Accuracy Score</span>
                      <Badge variant="secondary">97.3%</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Language Support</span>
                      <Badge variant="outline">100+</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Semantic Search */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="w-5 h-5" />
                  Semantic Search Engine
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Search Queries Today</span>
                      <Badge variant="outline">12,847</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Average Response Time</span>
                      <Badge variant="secondary">0.3s</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Search Accuracy</span>
                      <Badge variant="secondary">96.8%</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Context Understanding</span>
                      <Badge variant="secondary">94.5%</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Proactive Insights */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  Proactive Intelligence
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Daily Insights Generated</span>
                      <Badge variant="outline">847</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Risk Alerts</span>
                      <Badge variant="outline">23</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Market Opportunities</span>
                      <Badge variant="secondary">156</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Regulatory Updates</span>
                      <Badge variant="outline">34</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Document Analysis */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Intelligent Document Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Documents Analyzed</span>
                      <Badge variant="outline">3,245</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Key Insights Extracted</span>
                      <Badge variant="secondary">8,967</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Sentiment Analysis</span>
                      <Badge variant="secondary">92.1%</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Risk Assessment</span>
                      <Badge variant="secondary">95.7%</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Performance Metrics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Performance Metrics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">97.3%</div>
                    <div className="text-sm text-gray-600">Overall Accuracy</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">1.2s</div>
                    <div className="text-sm text-gray-600">Avg Response Time</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">99.8%</div>
                    <div className="text-sm text-gray-600">Uptime</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Trust Tab - Trace™ Audit System Content */}
        <TabsContent value="trust" className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Trace™ Audit and Compliance System</h2>
            <p className="text-lg text-gray-600 mb-6">
              Comprehensive audit trail, real-time compliance monitoring, immutable event logging, and TraceUnits™ for pharmaceutical regulatory compliance
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* TraceUnits™ Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GitBranch className="w-5 h-5" />
                  TraceUnits™ System
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">TraceUnits™ Created</span>
                      <Badge variant="outline">1.2M</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Immutable Records</span>
                      <Badge variant="secondary">100%</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Integrity Checks</span>
                      <Badge variant="secondary">Verified</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Retention Period</span>
                      <Badge variant="outline">25 years</Badge>
                    </div>
                  </div>
                  <Button className="w-full">
                    <GitBranch className="w-4 h-4 mr-2" />
                    View Audit Trail
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Compliance Monitoring */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Regulatory Compliance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">99.8%</div>
                    <div className="text-sm text-gray-600">Compliance Score</div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">FDA 21 CFR Part 11</span>
                      <Badge variant="secondary">Compliant</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">GDPR</span>
                      <Badge variant="secondary">Compliant</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">HIPAA</span>
                      <Badge variant="secondary">Compliant</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">GxP Validated</span>
                      <Badge variant="secondary">Validated</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Event Logging */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  Event Monitoring
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Audit Events Today</span>
                      <Badge variant="outline">8,547</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Total Audit Events</span>
                      <Badge variant="outline">1.2M</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Critical Alerts</span>
                      <Badge variant="outline">3</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">System Integrity</span>
                      <Badge variant="secondary">100%</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Digital Signatures */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Digital Signatures
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Documents Signed</span>
                      <Badge variant="outline">24,587</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Signature Validity</span>
                      <Badge variant="secondary">100%</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Certificate Status</span>
                      <Badge variant="secondary">Valid</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Tamper Detection</span>
                      <Badge variant="secondary">Active</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Data Integrity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="w-5 h-5" />
                  Data Integrity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Hash Verification</span>
                      <Badge variant="secondary">100%</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Blockchain Anchors</span>
                      <Badge variant="outline">2,341</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Data Corruption</span>
                      <Badge variant="outline">0 events</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Backup Status</span>
                      <Badge variant="secondary">Current</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Audit Reporting */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Audit Reporting
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Generated Reports</span>
                      <Badge variant="outline">847</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Scheduled Reports</span>
                      <Badge variant="outline">23</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Export Formats</span>
                      <Badge variant="secondary">PDF/XML</Badge>
                    </div>
                  </div>
                  <Button className="w-full mt-4">
                    <Download className="w-4 h-4 mr-2" />
                    Export Compliance Report
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}