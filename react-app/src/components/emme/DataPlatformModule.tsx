import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  Database,
  Activity,
  Zap,
  Shield,
  Users,
  Globe,
  CheckCircle,
  AlertTriangle,
  BarChart3,
  Clock,
  TrendingUp,
  Workflow,
  Key,
  Server
} from "lucide-react";

export function DataPlatformModule() {
  const platformMetrics = {
    totalDataSources: 847,
    apiCalls: "2.4M",
    dataVolume: "156TB",
    activeIntegrations: 67,
    processingSpeed: "18ms",
    uptimePercentage: 99.97
  };

  const dataIngestionSources = [
    {
      category: "Clinical Data Systems",
      sources: [
        {
          name: "Epic MyChart",
          type: "Electronic Health Records",
          status: "active",
          volume: "847K records/day",
          latency: "12ms",
          reliability: 99.8,
          dataTypes: ["Patient demographics", "Clinical notes", "Lab results", "Medication history"],
          complianceFlags: ["HIPAA", "GDPR", "21 CFR Part 11"]
        },
        {
          name: "Cerner PowerChart",
          type: "Clinical Data Platform",
          status: "active", 
          volume: "623K records/day",
          latency: "15ms",
          reliability: 99.5,
          dataTypes: ["Clinical workflows", "Provider notes", "Diagnostic imaging", "Treatment protocols"],
          complianceFlags: ["HIPAA", "HITECH", "GDPR"]
        }
      ]
    },
    {
      category: "Commercial Systems",
      sources: [
        {
          name: "Salesforce Health Cloud",
          type: "Customer Relationship Management",
          status: "active",
          volume: "234K records/day", 
          latency: "8ms",
          reliability: 99.9,
          dataTypes: ["HCP interactions", "Account management", "Sales activities", "Territory planning"],
          complianceFlags: ["SOC 2", "GDPR", "CCPA"]
        },
        {
          name: "Veeva Vault",
          type: "Content Management",
          status: "active",
          volume: "156K documents/day",
          latency: "22ms", 
          reliability: 99.6,
          dataTypes: ["Promotional materials", "Medical content", "Regulatory submissions", "Audit trails"],
          complianceFlags: ["21 CFR Part 11", "GxP", "ALCOA+"]
        }
      ]
    },
    {
      category: "Regulatory & Payer Data",
      sources: [
        {
          name: "FDA FAERS Database",
          type: "Regulatory Intelligence",
          status: "active",
          volume: "89K reports/day",
          latency: "45ms",
          reliability: 98.7,
          dataTypes: ["Adverse events", "Safety signals", "Regulatory actions", "Product labeling"],
          complianceFlags: ["21 CFR Part 803", "ICH E2B", "FDA Guidance"]
        },
        {
          name: "CMS Innovation Center",
          type: "Payer Policy Intelligence", 
          status: "active",
          volume: "23K updates/day",
          latency: "67ms",
          reliability: 97.9,
          dataTypes: ["Coverage policies", "Reimbursement rates", "Quality measures", "Value-based contracts"],
          complianceFlags: ["CMS Guidance", "MACRA", "MIPS"]
        }
      ]
    }
  ];

  const apiManagement = {
    totalAPIs: 234,
    dailyRequests: "2.4M",
    avgResponseTime: "18ms",
    errorRate: 0.02,
    topEndpoints: [
      {
        endpoint: "/api/v1/patient-insights",
        requests: "847K/day",
        avgLatency: "12ms",
        errorRate: 0.001,
        usage: "Real-time patient analytics and segmentation"
      },
      {
        endpoint: "/api/v1/hcp-engagement",
        requests: "623K/day", 
        avgLatency: "15ms",
        errorRate: 0.003,
        usage: "Healthcare provider interaction tracking"
      },
      {
        endpoint: "/api/v1/content-optimization",
        requests: "456K/day",
        avgLatency: "23ms", 
        errorRate: 0.002,
        usage: "AI-powered content performance analysis"
      },
      {
        endpoint: "/api/v1/regulatory-monitor",
        requests: "234K/day",
        avgLatency: "45ms",
        errorRate: 0.005, 
        usage: "Real-time regulatory intelligence updates"
      }
    ],
    securityFeatures: [
      "OAuth 2.0 / OpenID Connect authentication",
      "Role-based access control (RBAC)",
      "API rate limiting and throttling",
      "Request/response encryption (TLS 1.3)",
      "Comprehensive audit logging",
      "API key management and rotation"
    ]
  };

  const tenantManagement = [
    {
      tenant: "AstraZeneca Oncology",
      region: "Global",
      users: 2847,
      apiQuota: "500K/day",
      dataVolume: "23TB",
      complianceProfiles: ["FDA", "EMA", "PMDA", "Health Canada"],
      customizations: [
        "Oncology-specific data models",
        "Clinical trial integration",
        "Regulatory pathway optimization"
      ],
      status: "active",
      lastActivity: "2 minutes ago"
    },
    {
      tenant: "Pfizer Rare Disease",
      region: "US/EU",
      users: 1456,
      apiQuota: "250K/day", 
      dataVolume: "12TB",
      complianceProfiles: ["FDA Orphan Drug", "EMA PRIME", "Breakthrough Therapy"],
      customizations: [
        "Rare disease patient registries",
        "Accelerated approval pathways",
        "Patient advocacy integration"
      ],
      status: "active",
      lastActivity: "5 minutes ago"
    },
    {
      tenant: "Novartis Immunology",
      region: "Global",
      users: 3234,
      apiQuota: "750K/day",
      dataVolume: "34TB", 
      complianceProfiles: ["FDA", "EMA", "TGA", "PMDA", "NMPA"],
      customizations: [
        "Immunology biomarker analysis",
        "Precision medicine integration",
        "Real-world evidence platforms"
      ],
      status: "active",
      lastActivity: "1 minute ago"
    }
  ];

  const traceUnitsAudit = {
    totalTraceUnits: "847K",
    auditableEvents: "2.3M", 
    retentionPeriod: "25 years",
    complianceScore: 99.97,
    recentAuditActivity: [
      {
        timestamp: "2025-01-11T14:30:22Z",
        event: "AI Decision - Content Approval",
        user: "system.ai.content-reviewer",
        tenantId: "astrazeneca-oncology",
        traceUnitId: "TU-2025-0111-847291",
        decision: "Approved with conditions",
        rationale: "Clinical data validated, minor compliance adjustments required",
        evidence: ["FDA guidance 2024-draft-0234", "Clinical study CSR-ONC-2024-156"],
        immutableHash: "sha256:7d865e959b2466918c9863afca942d0fb89d7c9ac0c99bafc3749504ded97730"
      },
      {
        timestamp: "2025-01-11T14:29:18Z", 
        event: "Data Access - Patient Demographics",
        user: "jane.smith@astrazeneca.com",
        tenantId: "astrazeneca-oncology",
        traceUnitId: "TU-2025-0111-847290",
        decision: "Access granted",
        rationale: "RBAC permissions verified, legitimate business need confirmed",
        evidence: ["User role: Senior Medical Writer", "Project authorization: PROJ-ONC-2024-089"],
        immutableHash: "sha256:9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08"
      }
    ]
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-800";
      case "warning": return "bg-yellow-100 text-yellow-800";
      case "error": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getReliabilityColor = (reliability: number) => {
    if (reliability >= 99.5) return "text-green-600";
    if (reliability >= 99.0) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Data Platform</h1>
          <p className="text-gray-600 mt-2">
            Enterprise data integration, API management, and multi-tenant architecture with comprehensive audit trails
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button size="sm">
            <Database className="w-4 h-4 mr-2" />
            Platform Health
          </Button>
          <Button variant="outline" size="sm">
            <Activity className="w-4 h-4 mr-2" />
            System Monitor
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <Database className="w-6 h-6 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">{platformMetrics.totalDataSources}</div>
            <p className="text-sm text-gray-600">Data Sources</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Activity className="w-6 h-6 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">{platformMetrics.apiCalls}</div>
            <p className="text-sm text-gray-600">Daily API Calls</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Server className="w-6 h-6 text-purple-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">{platformMetrics.dataVolume}</div>
            <p className="text-sm text-gray-600">Data Volume</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Workflow className="w-6 h-6 text-orange-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">{platformMetrics.activeIntegrations}</div>
            <p className="text-sm text-gray-600">Active Integrations</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Clock className="w-6 h-6 text-red-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">{platformMetrics.processingSpeed}</div>
            <p className="text-sm text-gray-600">Avg Response</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <TrendingUp className="w-6 h-6 text-indigo-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">{platformMetrics.uptimePercentage}%</div>
            <p className="text-sm text-gray-600">Uptime</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="ingestion" className="space-y-6">
        <TabsList>
          <TabsTrigger value="ingestion">Data Ingestion</TabsTrigger>
          <TabsTrigger value="apis">API Management</TabsTrigger>
          <TabsTrigger value="tenants">Multi-Tenant</TabsTrigger>
          <TabsTrigger value="audit">TraceUnits™</TabsTrigger>
        </TabsList>

        <TabsContent value="ingestion" className="space-y-4">
          {dataIngestionSources.map((category, categoryIndex) => (
            <Card key={categoryIndex}>
              <CardHeader>
                <CardTitle className="text-lg flex items-center space-x-2">
                  <Database className="w-5 h-5 text-blue-600" />
                  <span>{category.category}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {category.sources.map((source, sourceIndex) => (
                    <div key={sourceIndex} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h4 className="font-semibold text-gray-900">{source.name}</h4>
                          <p className="text-sm text-gray-600">{source.type}</p>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Badge className={getStatusColor(source.status)}>
                            {source.status}
                          </Badge>
                          <div className="text-right">
                            <div className={`text-lg font-bold ${getReliabilityColor(source.reliability)}`}>
                              {source.reliability}%
                            </div>
                            <div className="text-sm text-gray-500">Reliability</div>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
                        <div>
                          <span className="text-gray-600">Volume:</span>
                          <div className="font-medium">{source.volume}</div>
                        </div>
                        <div>
                          <span className="text-gray-600">Latency:</span>
                          <div className="font-medium">{source.latency}</div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h5 className="font-semibold text-gray-900 mb-2">Data Types</h5>
                          <div className="space-y-1">
                            {source.dataTypes.map((dataType, dataTypeIndex) => (
                              <div key={dataTypeIndex} className="flex items-center space-x-2 text-sm">
                                <CheckCircle className="w-3 h-3 text-green-500" />
                                <span className="text-gray-600">{dataType}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div>
                          <h5 className="font-semibold text-gray-900 mb-2">Compliance</h5>
                          <div className="flex flex-wrap gap-1">
                            {source.complianceFlags.map((flag, flagIndex) => (
                              <Badge key={flagIndex} variant="outline" className="text-xs">
                                {flag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="apis" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center space-x-2">
                <Zap className="w-5 h-5 text-blue-600" />
                <span>API Performance Overview</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 text-sm">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{apiManagement.totalAPIs}</div>
                  <div className="text-gray-600">Total APIs</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{apiManagement.dailyRequests}</div>
                  <div className="text-gray-600">Daily Requests</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{apiManagement.avgResponseTime}</div>
                  <div className="text-gray-600">Avg Response</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">{apiManagement.errorRate}%</div>
                  <div className="text-gray-600">Error Rate</div>
                </div>
              </div>

              <h4 className="font-semibold text-gray-900 mb-3">Top API Endpoints</h4>
              <div className="space-y-3">
                {apiManagement.topEndpoints.map((endpoint, endpointIndex) => (
                  <div key={endpointIndex} className="border rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <code className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">
                        {endpoint.endpoint}
                      </code>
                      <Badge className={endpoint.errorRate < 0.002 ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                        {endpoint.errorRate}% error
                      </Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Requests:</span>
                        <span className="ml-1 font-medium">{endpoint.requests}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Latency:</span>
                        <span className="ml-1 font-medium">{endpoint.avgLatency}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Usage:</span>
                        <span className="ml-1 font-medium">{endpoint.usage}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <h4 className="font-semibold text-gray-900 mb-3 mt-6">Security Features</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {apiManagement.securityFeatures.map((feature, featureIndex) => (
                  <div key={featureIndex} className="flex items-center space-x-2 text-sm">
                    <Shield className="w-3 h-3 text-green-500" />
                    <span className="text-gray-600">{feature}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tenants" className="space-y-4">
          {tenantManagement.map((tenant, tenantIndex) => (
            <Card key={tenantIndex}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">{tenant.tenant}</CardTitle>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Globe className="w-4 h-4" />
                      <span>{tenant.region}</span>
                      <span>•</span>
                      <span>{tenant.users.toLocaleString()} users</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Badge className={getStatusColor(tenant.status)}>
                      {tenant.status}
                    </Badge>
                    <div className="text-right text-sm">
                      <div className="text-gray-600">Last Activity</div>
                      <div className="font-medium">{tenant.lastActivity}</div>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Resource Usage</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">API Quota:</span>
                        <span className="font-medium">{tenant.apiQuota}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Data Volume:</span>
                        <span className="font-medium">{tenant.dataVolume}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Compliance Profiles</h4>
                    <div className="flex flex-wrap gap-1">
                      {tenant.complianceProfiles.map((profile, profileIndex) => (
                        <Badge key={profileIndex} variant="outline" className="text-xs">
                          {profile}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Customizations</h4>
                    <div className="space-y-1">
                      {tenant.customizations.map((customization, customizationIndex) => (
                        <div key={customizationIndex} className="flex items-start space-x-2 text-sm">
                          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-gray-600">{customization}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="audit" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center space-x-2">
                <Shield className="w-5 h-5 text-blue-600" />
                <span>TraceUnits™ Audit Overview</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 text-sm">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{traceUnitsAudit.totalTraceUnits}</div>
                  <div className="text-gray-600">Total TraceUnits</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{traceUnitsAudit.auditableEvents}</div>
                  <div className="text-gray-600">Auditable Events</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{traceUnitsAudit.retentionPeriod}</div>
                  <div className="text-gray-600">Retention Period</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">{traceUnitsAudit.complianceScore}%</div>
                  <div className="text-gray-600">Compliance Score</div>
                </div>
              </div>

              <h4 className="font-semibold text-gray-900 mb-3">Recent Audit Activity</h4>
              <div className="space-y-4">
                {traceUnitsAudit.recentAuditActivity.map((activity, activityIndex) => (
                  <div key={activityIndex} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h5 className="font-medium text-gray-900">{activity.event}</h5>
                        <p className="text-sm text-gray-600">{new Date(activity.timestamp).toLocaleString()}</p>
                      </div>
                      <Badge className="bg-green-100 text-green-800">
                        {activity.decision}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium text-gray-700">User:</span>
                        <span className="ml-1">{activity.user}</span>
                        <br />
                        <span className="font-medium text-gray-700">Tenant:</span>
                        <span className="ml-1">{activity.tenantId}</span>
                        <br />
                        <span className="font-medium text-gray-700">TraceUnit ID:</span>
                        <code className="ml-1 text-xs bg-gray-100 px-1 rounded">{activity.traceUnitId}</code>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Rationale:</span>
                        <p className="text-gray-600 text-xs mt-1">{activity.rationale}</p>
                      </div>
                    </div>

                    <div className="mt-3 pt-3 border-t">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                        <div>
                          <span className="font-medium text-gray-700">Evidence:</span>
                          <ul className="mt-1 space-y-1">
                            {activity.evidence.map((evidence, evidenceIndex) => (
                              <li key={evidenceIndex} className="text-gray-600">• {evidence}</li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">Immutable Hash:</span>
                          <code className="block mt-1 text-gray-600 break-all">{activity.immutableHash}</code>
                        </div>
                      </div>
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