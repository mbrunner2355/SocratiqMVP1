import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { 
  Shield, 
  Plus, 
  AlertTriangle,
  CheckCircle,
  Clock,
  Brain,
  Zap,
  Eye,
  Target,
  Settings,
  Search,
  Users,
  Activity,
  BarChart3,
  TrendingUp,
  Scale,
  Lock,
  Gauge,
  Waves
} from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';

interface RiskAssessment {
  id: string;
  riskCategory: string;
  riskLevel: string;
  riskScore: number;
  targetEntity: string;
  status: string;
  createdAt: string;
}

interface CompliancePolicy {
  id: string;
  policyName: string;
  policyType: string;
  enforcementLevel: string;
  isActive: boolean;
  version: string;
}

interface PolicyViolation {
  id: string;
  violationType: string;
  severity: string;
  resolutionStatus: string;
  reportedAt: string;
}

export default function SophieTrustManager() {
  const [selectedTab, setSelectedTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const queryClient = useQueryClient();

  // Fetch data
  const { data: riskAssessments, isLoading: risksLoading } = useQuery<RiskAssessment[]>({
    queryKey: ['/api/sophietrust/risk-assessments'],
  });

  const { data: policies } = useQuery<CompliancePolicy[]>({
    queryKey: ['/api/sophietrust/policies'],
  });

  const { data: violations } = useQuery<PolicyViolation[]>({
    queryKey: ['/api/sophietrust/violations'],
  });

  const { data: analytics } = useQuery({
    queryKey: ['/api/sophietrust/analytics/overview'],
  });

  const { data: guardrails } = useQuery({
    queryKey: ['/api/sophietrust/guardrails'],
  });

  const { data: ascendData } = useQuery({
    queryKey: ['/api/sophietrust/ascend'],
  });

  const { data: rippleData } = useQuery({
    queryKey: ['/api/sophietrust/ripple'],
  });

  const { data: riskLensData } = useQuery({
    queryKey: ['/api/sophietrust/risk-lens'],
  });

  // Create risk assessment mutation
  const createRiskAssessmentMutation = useMutation({
    mutationFn: (data: any) => apiRequest('/api/sophietrust/risk-assessments', 'POST', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/sophietrust/risk-assessments'] });
      queryClient.invalidateQueries({ queryKey: ['/api/sophietrust/analytics/overview'] });
    }
  });

  // Create impact simulation mutation
  const createRippleSimulationMutation = useMutation({
    mutationFn: (data: any) => apiRequest('/api/sophietrust/ripple', 'POST', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/sophietrust/ripple'] });
    }
  });

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'critical': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': 
      case 'enforced': return 'bg-blue-100 text-blue-800';
      case 'resolved': 
      case 'mitigated': return 'bg-green-100 text-green-800';
      case 'open': 
      case 'investigating': return 'bg-yellow-100 text-yellow-800';
      case 'critical': 
      case 'escalated': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleCreateRiskAssessment = () => {
    createRiskAssessmentMutation.mutate({
      riskCategory: 'COMPLIANCE_VIOLATION',
      detectionMethod: 'RULE_BASED_VALIDATION',
      riskLevel: 'medium',
      riskScore: 0.6,
      probabilityScore: 0.4,
      impactScore: 0.8,
      targetEntity: 'project_alpha',
      targetEntityType: 'PROJECT',
      assessmentContext: {
        description: 'Budget threshold compliance assessment',
        framework: 'SOX'
      },
      detectedIssues: ['Budget variance exceeding threshold'],
      recommendedActions: ['Implement budget monitoring', 'Review approval workflow'],
      complianceFrameworks: ['SOX', 'GDPR']
    });
  };

  const handleCreateRippleSimulation = () => {
    createRippleSimulationMutation.mutate({
      simulationName: 'Budget Override Impact Analysis',
      simulationType: 'AGENT_BASED_CASCADE',
      triggerAction: {
        actionType: 'BUDGET_OVERRIDE',
        amount: 50000,
        project: 'project_alpha'
      },
      stakeholders: ['finance_team', 'project_managers', 'compliance'],
      impactDomains: ['budget', 'timeline', 'compliance'],
      timeHorizon: 30,
      propagationRules: [
        { type: 'cascade_delay', multiplier: 1.2 },
        { type: 'resource_constraint', threshold: 0.8 }
      ]
    });
  };

  if (risksLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-sm text-muted-foreground">Loading SophieTrust™ Governance Framework...</p>
        </div>
      </div>
    );
  }

  const filteredRisks = riskAssessments?.filter(risk =>
    risk.riskCategory.toLowerCase().includes(searchTerm.toLowerCase()) ||
    risk.targetEntity?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    risk.riskLevel.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">SocratIQ SophieTrust™ - Governance & Safety Framework</h1>
          <p className="text-muted-foreground">
            Real-time compliance enforcement with probabilistic risk assessment and intelligent guardrails
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search governance..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 w-64"
            />
          </div>
          <Button onClick={handleCreateRiskAssessment} disabled={createRiskAssessmentMutation.isPending}>
            <Plus className="h-4 w-4 mr-2" />
            New Assessment
          </Button>
        </div>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="risks">Risk Assessment</TabsTrigger>
          <TabsTrigger value="policies">Policies</TabsTrigger>
          <TabsTrigger value="guardrails">Guardrails™</TabsTrigger>
          <TabsTrigger value="ascend">Ascend™</TabsTrigger>
          <TabsTrigger value="ripple">Ripple™</TabsTrigger>
          <TabsTrigger value="risklens">Risk Lens™</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Analytics Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Risks</CardTitle>
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{(analytics as any)?.activeRiskAssessments || 0}</div>
                <p className="text-xs text-muted-foreground">
                  {(analytics as any)?.highRiskItems || 0} high/critical
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Policies</CardTitle>
                <Scale className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{(analytics as any)?.activePolicies || 0}</div>
                <p className="text-xs text-muted-foreground">
                  {(analytics as any)?.totalPolicies || 0} total policies
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Guardrails</CardTitle>
                <Shield className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{(analytics as any)?.activeGuardrails || 0}</div>
                <p className="text-xs text-muted-foreground">
                  Real-time enforcement
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Open Violations</CardTitle>
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{(analytics as any)?.violations?.openViolations || 0}</div>
                <p className="text-xs text-muted-foreground">
                  {(analytics as any)?.violations?.resolvedViolations || 0} resolved
                </p>
              </CardContent>
            </Card>
          </div>

          {/* SophieTrust™ Components */}
          <Card>
            <CardHeader>
              <CardTitle>SophieTrust™ Governance Components</CardTitle>
              <CardDescription>Integrated governance framework with AI-powered compliance enforcement</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <div className="flex items-center space-x-3 p-3 border rounded-lg">
                  <Scale className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="font-medium">Sophie Guardrails™</p>
                    <p className="text-sm text-muted-foreground">
                      Real-time constraint enforcement
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 border rounded-lg">
                  <Gauge className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="font-medium">Sophie Ascend™</p>
                    <p className="text-sm text-muted-foreground">
                      Autonomy calibration
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 border rounded-lg">
                  <Waves className="h-5 w-5 text-purple-600" />
                  <div>
                    <p className="font-medium">Sophie Ripple™</p>
                    <p className="text-sm text-muted-foreground">
                      Impact simulation
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 border rounded-lg">
                  <Eye className="h-5 w-5 text-orange-600" />
                  <div>
                    <p className="font-medium">Sophie Risk Lens™</p>
                    <p className="text-sm text-muted-foreground">
                      Probabilistic risk analysis
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Risk Assessments */}
          {riskAssessments && riskAssessments.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Recent Risk Assessments</CardTitle>
                <CardDescription>Latest risk evaluations and compliance checks</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {riskAssessments.slice(0, 5).map((risk) => (
                    <div key={risk.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Badge className={getRiskLevelColor(risk.riskLevel)}>
                          {risk.riskLevel}
                        </Badge>
                        <div>
                          <p className="font-medium text-sm">{risk.riskCategory}</p>
                          <p className="text-xs text-muted-foreground">
                            Target: {risk.targetEntity} • Score: {(risk.riskScore * 100).toFixed(0)}%
                          </p>
                        </div>
                      </div>
                      <div className="text-right text-sm">
                        <Badge className={getStatusColor(risk.status)}>
                          {risk.status}
                        </Badge>
                        <p className="text-muted-foreground mt-1">{new Date(risk.createdAt).toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="risks">
          <Card>
            <CardHeader>
              <CardTitle>Risk Assessment Engine</CardTitle>
              <CardDescription>Probabilistic risk analysis with real-time compliance monitoring</CardDescription>
            </CardHeader>
            <CardContent>
              {filteredRisks && filteredRisks.length > 0 ? (
                <div className="space-y-4">
                  {filteredRisks.map((risk) => (
                    <Card key={risk.id}>
                      <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                              <AlertTriangle className="h-5 w-5" />
                            </div>
                            <div>
                              <h4 className="font-medium">{risk.riskCategory}</h4>
                              <div className="flex items-center space-x-2 mt-1">
                                <Badge className={getRiskLevelColor(risk.riskLevel)}>
                                  {risk.riskLevel}
                                </Badge>
                                <Badge className={getStatusColor(risk.status)}>
                                  {risk.status}
                                </Badge>
                                <span className="text-sm text-muted-foreground">
                                  Score: {(risk.riskScore * 100).toFixed(0)}%
                                </span>
                              </div>
                              <p className="text-sm text-muted-foreground mt-1">
                                Target: {risk.targetEntity || 'General'}
                              </p>
                            </div>
                          </div>
                          <div className="text-right text-sm">
                            <p className="text-muted-foreground">
                              {new Date(risk.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Shield className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-medium mb-2">No risk assessments found</h3>
                  <p className="text-muted-foreground mb-4">
                    {searchTerm ? 'Try adjusting your search terms' : 'Create your first risk assessment'}
                  </p>
                  {!searchTerm && (
                    <Button onClick={handleCreateRiskAssessment}>
                      <Plus className="h-4 w-4 mr-2" />
                      Create Assessment
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="policies">
          <Card>
            <CardHeader>
              <CardTitle>Compliance Policies</CardTitle>
              <CardDescription>Governance rules and policy enforcement configuration</CardDescription>
            </CardHeader>
            <CardContent>
              {policies && policies.length > 0 ? (
                <div className="space-y-4">
                  {policies.slice(0, 10).map((policy) => (
                    <div key={policy.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Scale className="h-4 w-4 text-blue-600" />
                        <div>
                          <p className="font-medium">{policy.policyName}</p>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge variant="outline">{policy.policyType}</Badge>
                            <Badge variant="outline">{policy.enforcementLevel}</Badge>
                            <Badge variant="outline">v{policy.version}</Badge>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {policy.isActive ? (
                          <Badge variant="outline" className="bg-green-50 text-green-700">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Active
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-gray-50 text-gray-700">
                            Inactive
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Scale className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No compliance policies configured</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="guardrails">
          <Card>
            <CardHeader>
              <CardTitle>Sophie Guardrails™</CardTitle>
              <CardDescription>Real-time constraint enforcement and policy validation</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <Shield className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Guardrails configuration will be displayed here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ascend">
          <Card>
            <CardHeader>
              <CardTitle>Sophie Ascend™</CardTitle>
              <CardDescription>Reinforcement learning-based autonomy calibration</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <Gauge className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Autonomy calibration data will be displayed here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ripple">
          <Card>
            <CardHeader>
              <CardTitle>Sophie Ripple™</CardTitle>
              <CardDescription>Simulation-driven impact modeling and cascade analysis</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-medium">Impact Simulations</h3>
                  <p className="text-sm text-muted-foreground">Model cascading effects of governance actions</p>
                </div>
                <Button onClick={handleCreateRippleSimulation} disabled={createRippleSimulationMutation.isPending}>
                  <Waves className="h-4 w-4 mr-2" />
                  Run Simulation
                </Button>
              </div>
              <div className="text-center py-8 text-muted-foreground">
                <Waves className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Impact simulation results will be displayed here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="risklens">
          <Card>
            <CardHeader>
              <CardTitle>Sophie Risk Lens™</CardTitle>
              <CardDescription>Probabilistic risk quantification with Bayesian analysis</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <Eye className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Risk lens analysis results will be displayed here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}