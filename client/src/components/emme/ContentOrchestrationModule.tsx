import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import FileUpload from "@/components/FileUpload";
import { 
  FileText,
  Globe,
  Zap,
  CheckCircle,
  Clock,
  Users,
  AlertTriangle,
  Workflow,
  Languages,
  Target,
  BarChart3,
  Shield,
  Upload
} from "lucide-react";

export function ContentOrchestrationModule() {
  console.log("ContentOrchestrationModule component loaded");
  const orchestrationMetrics = {
    totalAssets: 15429,
    activeWorkflows: 89,
    multilingualAssets: 4567,
    complianceRate: 97.3,
    avgApprovalTime: "2.4 days",
    globalCampaigns: 34
  };

  const workflowStages = [
    {
      stage: "Content Creation",
      status: "active",
      description: "Medical writers, agencies, and internal teams create initial content",
      metrics: {
        "Assets in Progress": 234,
        "Avg Creation Time": "5.2 days",
        "Quality Score": "89%"
      },
      bottlenecks: [
        "Medical writer capacity constraints",
        "Source material availability",
        "Creative review cycles"
      ],
      automationOpportunities: [
        "Template-based content generation",
        "AI-assisted medical writing",
        "Automated compliance checking"
      ]
    },
    {
      stage: "Medical Review",
      status: "active", 
      description: "Medical affairs team reviews content for accuracy and clinical appropriateness",
      metrics: {
        "Assets Under Review": 156,
        "Avg Review Time": "3.1 days",
        "First-Pass Approval": "78%"
      },
      bottlenecks: [
        "Medical affairs bandwidth",
        "Complex clinical data review",
        "External expert consultation needs"
      ],
      automationOpportunities: [
        "AI-powered fact checking",
        "Automated reference validation",
        "Clinical data visualization"
      ]
    },
    {
      stage: "Legal Review",
      status: "active",
      description: "Legal team ensures regulatory compliance and risk mitigation",
      metrics: {
        "Assets Under Review": 89,
        "Avg Review Time": "4.2 days", 
        "Compliance Rate": "96%"
      },
      bottlenecks: [
        "Regulatory complexity",
        "Cross-jurisdiction requirements",
        "Risk assessment depth"
      ],
      automationOpportunities: [
        "Regulatory database integration",
        "Automated compliance scoring",
        "Risk assessment algorithms"
      ]
    },
    {
      stage: "Regulatory Approval",
      status: "active",
      description: "Final MLR approval process with complete documentation",
      metrics: {
        "Assets Pending": 67,
        "Avg Approval Time": "2.8 days",
        "Approval Rate": "92%"
      },
      bottlenecks: [
        "Cross-functional coordination",
        "Documentation requirements",
        "Approval committee scheduling"
      ],
      automationOpportunities: [
        "Automated workflow routing",
        "Digital signature integration", 
        "Audit trail automation"
      ]
    }
  ];

  const globalCampaigns = [
    {
      name: "Global Diabetes Education Initiative",
      regions: ["North America", "Europe", "Asia-Pacific", "Latin America"],
      languages: 23,
      assets: 1847,
      localizations: 4129,
      compliance: 98.2,
      launch: "Q2 2025",
      status: "In Progress",
      culturalAdaptations: [
        "Visual representation diversity",
        "Dietary recommendation localization",
        "Healthcare system navigation guides"
      ]
    },
    {
      name: "Oncology Patient Journey Campaign",
      regions: ["US", "EU5", "Japan", "Australia"],
      languages: 12,
      assets: 892,
      localizations: 2847,
      compliance: 96.7,
      launch: "Q1 2025",
      status: "Active",
      culturalAdaptations: [
        "Family involvement preferences",
        "Treatment decision-making styles",
        "Support system variations"
      ]
    },
    {
      name: "HCP Education: Precision Medicine",
      regions: ["Global"],
      languages: 18,
      assets: 567,
      localizations: 1923,
      compliance: 99.1,
      launch: "Q3 2025", 
      status: "Planning",
      culturalAdaptations: [
        "Medical practice variations",
        "Technology adoption patterns",
        "Professional education preferences"
      ]
    }
  ];

  const complianceMonitoring = [
    {
      category: "Content Accuracy",
      score: 97.8,
      issues: 23,
      trend: "+2.1%",
      riskLevel: "low",
      recentFindings: [
        "Clinical data updates needed in 12 assets",
        "Reference citation formatting inconsistencies", 
        "Dosing information verification required"
      ]
    },
    {
      category: "Regulatory Compliance",
      score: 96.4,
      issues: 34,
      trend: "+1.8%",
      riskLevel: "medium",
      recentFindings: [
        "FDA guidance updates require content revision",
        "EMA labeling changes impact promotional materials",
        "Country-specific regulatory requirements validation"
      ]
    },
    {
      category: "Cultural Appropriateness",
      score: 94.2,
      issues: 45,
      trend: "+3.2%", 
      riskLevel: "medium",
      recentFindings: [
        "Cultural sensitivity review for APAC content",
        "Imagery updates for demographic representation",
        "Language localization quality improvements"
      ]
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active": return "bg-green-100 text-green-800";
      case "In Progress": return "bg-blue-100 text-blue-800";
      case "Planning": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "low": return "bg-green-100 text-green-800";
      case "medium": return "bg-yellow-100 text-yellow-800";
      case "high": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Content Orchestration</h1>
          <p className="text-gray-600 mt-2">
            Global content workflow management with multilingual localization and compliance monitoring
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button size="sm" className="bg-purple-600 hover:bg-purple-700 text-white">
            <Workflow className="w-4 h-4 mr-2" />
            Optimize Workflows
          </Button>
          <Button variant="outline" size="sm">
            <Languages className="w-4 h-4 mr-2" />
            Localization Hub
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <FileText className="w-6 h-6 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">{orchestrationMetrics.totalAssets.toLocaleString()}</div>
            <p className="text-sm text-gray-600">Total Assets</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Workflow className="w-6 h-6 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">{orchestrationMetrics.activeWorkflows}</div>
            <p className="text-sm text-gray-600">Active Workflows</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Languages className="w-6 h-6 text-purple-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">{orchestrationMetrics.multilingualAssets.toLocaleString()}</div>
            <p className="text-sm text-gray-600">Multilingual Assets</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Shield className="w-6 h-6 text-orange-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">{orchestrationMetrics.complianceRate}%</div>
            <p className="text-sm text-gray-600">Compliance Rate</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Clock className="w-6 h-6 text-red-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">{orchestrationMetrics.avgApprovalTime}</div>
            <p className="text-sm text-gray-600">Avg Approval Time</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Globe className="w-6 h-6 text-indigo-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">{orchestrationMetrics.globalCampaigns}</div>
            <p className="text-sm text-gray-600">Global Campaigns</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="upload" className="space-y-6">
        <TabsList>
          <TabsTrigger value="upload">Upload Content</TabsTrigger>
          <TabsTrigger value="workflows">Content Workflows</TabsTrigger>
          <TabsTrigger value="campaigns">Global Campaigns</TabsTrigger>
          <TabsTrigger value="compliance">Compliance Monitor</TabsTrigger>
        </TabsList>

        <TabsContent value="upload" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Upload className="w-5 h-5" />
                  <span>Upload Content Assets</span>
                </CardTitle>
                <p className="text-gray-600">
                  Upload pharmaceutical content for MLR review and global distribution
                </p>
              </CardHeader>
              <CardContent>
                <FileUpload />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Content Processing Pipeline</CardTitle>
                <p className="text-gray-600">
                  Track content through automated workflows
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                        <FileText className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <p className="font-medium">Content Extraction</p>
                        <p className="text-sm text-gray-600">AI-powered text and metadata extraction</p>
                      </div>
                    </div>
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>

                  <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
                        <Shield className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <p className="font-medium">Compliance Check</p>
                        <p className="text-sm text-gray-600">Automated regulatory compliance scanning</p>
                      </div>
                    </div>
                    <Clock className="w-5 h-5 text-blue-600" />
                  </div>

                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                        <Globe className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <p className="font-medium">Global Distribution</p>
                        <p className="text-sm text-gray-600">Multi-region content orchestration</p>
                      </div>
                    </div>
                    <AlertTriangle className="w-5 h-5 text-gray-400" />
                  </div>
                </div>

                <div className="mt-6">
                  <h4 className="font-semibold mb-3">Recent Uploads</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <span className="text-sm">Clinical_Study_Report_VMS.pdf</span>
                      <Badge className="bg-green-100 text-green-800">Processed</Badge>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <span className="text-sm">Patient_Education_Materials.docx</span>
                      <Badge className="bg-blue-100 text-blue-800">Processing</Badge>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <span className="text-sm">Regulatory_Submission_Draft.pdf</span>
                      <Badge className="bg-yellow-100 text-yellow-800">MLR Review</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="workflows" className="space-y-4">
          {workflowStages.map((stage, index) => (
            <Card key={index}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-100 rounded-full">
                      <Workflow className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{stage.stage}</CardTitle>
                      <p className="text-gray-600">{stage.description}</p>
                    </div>
                  </div>
                  <Badge className={stage.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                    {stage.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Current Metrics</h4>
                    <div className="space-y-2">
                      {Object.entries(stage.metrics).map(([metric, value], metricIndex) => (
                        <div key={metricIndex} className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">{metric}</span>
                          <span className="font-medium">{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Current Bottlenecks</h4>
                    <div className="space-y-2">
                      {stage.bottlenecks.map((bottleneck, bottleneckIndex) => (
                        <div key={bottleneckIndex} className="flex items-start space-x-2 text-sm">
                          <AlertTriangle className="w-3 h-3 text-red-500 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-600">{bottleneck}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Automation Opportunities</h4>
                    <div className="space-y-2">
                      {stage.automationOpportunities.map((opportunity, opportunityIndex) => (
                        <div key={opportunityIndex} className="flex items-start space-x-2 text-sm">
                          <Zap className="w-3 h-3 text-blue-500 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-600">{opportunity}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="campaigns" className="space-y-4">
          {globalCampaigns.map((campaign, index) => (
            <Card key={index}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">{campaign.name}</CardTitle>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <span>Launch: {campaign.launch}</span>
                      <span>•</span>
                      <Badge className={getStatusColor(campaign.status)}>
                        {campaign.status}
                      </Badge>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold">{campaign.compliance}%</div>
                    <div className="text-sm text-gray-500">Compliance Rate</div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="text-center">
                    <div className="text-lg font-bold text-blue-600">{campaign.regions.length}</div>
                    <div className="text-sm text-gray-600">Regions</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-green-600">{campaign.languages}</div>
                    <div className="text-sm text-gray-600">Languages</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-purple-600">{campaign.assets.toLocaleString()}</div>
                    <div className="text-sm text-gray-600">Assets</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-orange-600">{campaign.localizations.toLocaleString()}</div>
                    <div className="text-sm text-gray-600">Localizations</div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Regional Coverage</h4>
                    <div className="flex flex-wrap gap-2">
                      {campaign.regions.map((region, regionIndex) => (
                        <Badge key={regionIndex} variant="outline">
                          {region}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Cultural Adaptations</h4>
                    <div className="space-y-1">
                      {campaign.culturalAdaptations.map((adaptation, adaptationIndex) => (
                        <div key={adaptationIndex} className="flex items-start space-x-2 text-sm">
                          <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-gray-600">{adaptation}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="compliance" className="space-y-4">
          {complianceMonitoring.map((compliance, index) => (
            <Card key={index}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Shield className="w-5 h-5 text-blue-600" />
                    <div>
                      <CardTitle className="text-lg">{compliance.category}</CardTitle>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <span>{compliance.issues} active issues</span>
                        <span>•</span>
                        <span className="text-green-600">{compliance.trend} improvement</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Badge className={getRiskColor(compliance.riskLevel)}>
                      {compliance.riskLevel} risk
                    </Badge>
                    <div className="text-right">
                      <div className="text-lg font-bold">{compliance.score}%</div>
                      <div className="text-sm text-gray-500">Compliance Score</div>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-gray-600">Compliance Progress</span>
                    <span className="font-medium">{compliance.score}%</span>
                  </div>
                  <Progress value={compliance.score} className="h-2 progress-gradient-blue-purple [&>div]:bg-gradient-blue-purple" />
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Recent Findings</h4>
                  <div className="space-y-2">
                    {compliance.recentFindings.map((finding, findingIndex) => (
                      <div key={findingIndex} className="flex items-start space-x-2 text-sm">
                        <AlertTriangle className="w-3 h-3 text-orange-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-600">{finding}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-4 flex justify-end space-x-2">
                  <Button size="sm" variant="outline">
                    View Details
                  </Button>
                  <Button size="sm">
                    Remediation Plan
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}