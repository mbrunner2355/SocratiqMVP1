import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  Target, Users, FileText, BarChart3, Lightbulb, 
  CheckCircle2, AlertTriangle, Clock, TrendingUp,
  Globe, Shield, Workflow, MessageSquare, Bot,
  Sparkles, ArrowRight, Info
} from 'lucide-react';

interface ProjectIntegrationProps {
  project: any;
  onUpdate: (projectId: string, data: any) => void;
  onBackToProjects?: () => void;
}

export function EMMEProjectIntegration({ project, onUpdate, onBackToProjects }: ProjectIntegrationProps) {
  const [activeTab, setActiveTab] = useState("strategic");

  const strategicIntelligence = project.strategicIntelligence || {
    marketAnalysis: {},
    competitorMapping: {},
    payerInsights: {},
    scenarioModeling: {},
    riskAssessment: {},
    launchReadiness: 0
  };

  const stakeholderEngagement = project.stakeholderEngagement || {
    hcpTargets: [],
    patientPrograms: [],
    payerRelations: [],
    kolNetwork: [],
    engagementMetrics: {},
    touchpoints: []
  };

  const contentOrchestration = project.contentOrchestration || {
    workflows: [],
    assets: [],
    mlrStatus: {},
    complianceTracking: {},
    multilingualContent: {},
    approvalQueue: []
  };

  return (
    <div className="space-y-6">
      {/* EMME Header */}
      <div className="flex justify-between items-center">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-purple-600">emme</span>
              <span className="text-sm bg-purple-100 text-purple-700 px-2 py-1 rounded">engage</span>
            </div>
            <span className="text-gray-400">•</span>
            <h2 className="text-xl font-bold text-gray-900">{project.projectTitle}</h2>
          </div>
          <p className="text-gray-600">Strategic Intelligence • Stakeholder Engagement • Content Orchestration</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="text-sm">
            {project.status?.replace('_', ' ').toUpperCase()}
          </Badge>
          <Button variant="outline" size="sm" onClick={onBackToProjects}>
            Back to Projects
          </Button>
        </div>
      </div>

      {/* EMME Conversational Guide */}
      <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-900 to-indigo-950 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg italic">e</span>
              </div>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="font-semibold text-purple-700">EMME AI Agent</span>
                <Sparkles className="w-4 h-4 text-purple-500" />
              </div>
              <p className="text-gray-700 mb-3">
                Hi! I'm analyzing your <strong>{project.projectTitle}</strong> project across three key dimensions. 
                Let me guide you through the strategic intelligence, stakeholder engagement, and content orchestration insights.
              </p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary" className="text-xs">
                  <Target className="w-3 h-3 mr-1" />
                  Strategic Analysis Ready
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  <Users className="w-3 h-3 mr-1" />
                  Stakeholder Data Loaded
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  <FileText className="w-3 h-3 mr-1" />
                  Content Pipeline Active
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid grid-cols-3 w-full">
          <TabsTrigger value="strategic" className="flex items-center gap-2">
            <Target className="w-4 h-4" />
            Strategic Intelligence
          </TabsTrigger>
          <TabsTrigger value="stakeholders" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            Stakeholder Engagement
          </TabsTrigger>
          <TabsTrigger value="content" className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Content Orchestration
          </TabsTrigger>
        </TabsList>

        <TabsContent value="strategic" className="space-y-6">
          {/* EMME Strategic Guidance */}
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-gradient-to-br from-purple-900 to-indigo-950 rounded-full flex items-center justify-center shadow-sm mt-1">
                  <span className="text-white font-bold text-xs italic">e</span>
                </div>
                <div>
                  <p className="text-sm text-blue-800 font-medium mb-1">Strategic Intelligence Insights</p>
                  <p className="text-sm text-blue-700">
                    I've analyzed market conditions, competitive landscape, and payer dynamics for your {project.therapeuticArea} project. 
                    Your launch readiness score suggests focusing on regulatory compliance and stakeholder alignment.
                  </p>
                  <Button variant="outline" size="sm" className="mt-2 text-blue-700 border-blue-200">
                    <ArrowRight className="w-3 h-3 mr-1" />
                    View Recommendations
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-blue-500" />
                  Market Analysis
                </CardTitle>
                <CardDescription>Market size, trends, and opportunities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Market Size</span>
                    <span className="font-medium">$2.4B</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Growth Rate</span>
                    <span className="font-medium text-green-600">+12.3%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Penetration</span>
                    <span className="font-medium">34%</span>
                  </div>
                  <Progress value={34} className="h-2" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-purple-500" />
                  Competitor Mapping
                </CardTitle>
                <CardDescription>Competitive landscape analysis</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Direct Competitors</span>
                    <Badge variant="secondary">4</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Indirect Competitors</span>
                    <Badge variant="secondary">7</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Threat Level</span>
                    <Badge variant="destructive">High</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-green-500" />
                  Launch Readiness
                </CardTitle>
                <CardDescription>Overall readiness assessment</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold">{strategicIntelligence.launchReadiness || 73}%</span>
                    <Badge variant="outline" className="text-green-600">On Track</Badge>
                  </div>
                  <Progress value={strategicIntelligence.launchReadiness || 73} className="h-3" />
                  <p className="text-sm text-gray-600">Ready for Phase II implementation</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="stakeholders" className="space-y-6">
          {/* EMME Stakeholder Guidance */}
          <Card className="bg-green-50 border-green-200">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-gradient-to-br from-purple-900 to-indigo-950 rounded-full flex items-center justify-center shadow-sm mt-1">
                  <span className="text-white font-bold text-xs italic">e</span>
                </div>
                <div>
                  <p className="text-sm text-green-800 font-medium mb-1">Stakeholder Engagement Strategy</p>
                  <p className="text-sm text-green-700">
                    Based on your {project.therapeuticArea} focus, I recommend prioritizing HCP education and KOL partnerships. 
                    Your current engagement metrics show strong potential for expanding your professional network.
                  </p>
                  <Button variant="outline" size="sm" className="mt-2 text-green-700 border-green-200">
                    <Users className="w-3 h-3 mr-1" />
                    Optimize Engagement
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-blue-500" />
                  HCP Engagement
                </CardTitle>
                <CardDescription>Healthcare professional targeting and engagement</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Target HCPs</span>
                    <span className="font-medium">2,847</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Engaged</span>
                    <span className="font-medium text-green-600">1,923 (67%)</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Conversion Rate</span>
                    <span className="font-medium">24.3%</span>
                  </div>
                  <Progress value={67} className="h-2" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-purple-500" />
                  KOL Network
                </CardTitle>
                <CardDescription>Key Opinion Leader engagement tracking</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Active KOLs</span>
                    <span className="font-medium">127</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Advisory Boards</span>
                    <span className="font-medium">8</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Publications</span>
                    <span className="font-medium text-green-600">23</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Recent Touchpoints</CardTitle>
                <CardDescription>Latest stakeholder interactions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { type: "HCP Meeting", stakeholder: "Dr. Sarah Johnson", date: "2 days ago", status: "completed" },
                    { type: "Advisory Board", stakeholder: "Oncology Panel", date: "5 days ago", status: "completed" },
                    { type: "Payer Meeting", stakeholder: "Anthem BCBS", date: "1 week ago", status: "follow-up" },
                  ].map((touchpoint, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{touchpoint.type}</p>
                        <p className="text-sm text-gray-600">{touchpoint.stakeholder}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">{touchpoint.date}</p>
                        <Badge variant={touchpoint.status === 'completed' ? 'default' : 'secondary'}>
                          {touchpoint.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="content" className="space-y-6">
          {/* EMME Content Guidance */}
          <Card className="bg-orange-50 border-orange-200">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-gradient-to-br from-purple-900 to-indigo-950 rounded-full flex items-center justify-center shadow-sm mt-1">
                  <span className="text-white font-bold text-xs italic">e</span>
                </div>
                <div>
                  <p className="text-sm text-orange-800 font-medium mb-1">Content Orchestration Status</p>
                  <p className="text-sm text-orange-700">
                    Your content workflow is performing well with a 97.3% compliance rate. I notice some bottlenecks in legal review - 
                    I can help optimize your MLR process and multilingual content distribution.
                  </p>
                  <Button variant="outline" size="sm" className="mt-2 text-orange-700 border-orange-200">
                    <Workflow className="w-3 h-3 mr-1" />
                    Streamline Workflow
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Workflow className="w-5 h-5 text-blue-500" />
                  Active Workflows
                </CardTitle>
                <CardDescription>Content creation and approval workflows</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Total Assets</span>
                    <span className="font-medium">15,429</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">In Progress</span>
                    <span className="font-medium text-blue-600">234</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Pending Review</span>
                    <span className="font-medium text-yellow-600">67</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-green-500" />
                  MLR Status
                </CardTitle>
                <CardDescription>Medical Legal Regulatory compliance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Compliance Rate</span>
                    <span className="font-medium text-green-600">97.3%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Avg Review Time</span>
                    <span className="font-medium">2.4 days</span>
                  </div>
                  <Progress value={97} className="h-2" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="w-5 h-5 text-purple-500" />
                  Global Campaigns
                </CardTitle>
                <CardDescription>Multi-lingual content distribution</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Languages</span>
                    <span className="font-medium">12</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Regions</span>
                    <span className="font-medium">8</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Localized Assets</span>
                    <span className="font-medium text-green-600">4,567</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Content Creation Pipeline</CardTitle>
              <CardDescription>Current content development status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { stage: "Content Creation", count: 45, status: "active" },
                  { stage: "Medical Review", count: 23, status: "active" },
                  { stage: "Legal Review", count: 12, status: "bottleneck" },
                  { stage: "Regulatory Review", count: 8, status: "normal" },
                  { stage: "Final Approval", count: 15, status: "normal" },
                ].map((stage, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${
                        stage.status === 'bottleneck' ? 'bg-red-500' : 
                        stage.status === 'active' ? 'bg-blue-500' : 'bg-green-500'
                      }`} />
                      <span className="font-medium">{stage.stage}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{stage.count}</span>
                      {stage.status === 'bottleneck' && <AlertTriangle className="w-4 h-4 text-red-500" />}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}