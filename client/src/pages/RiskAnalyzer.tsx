import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { 
  AlertTriangle, 
  Shield, 
  TrendingUp, 
  Target, 
  Brain,
  Activity,
  BarChart3,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  FileText,
  Users,
  Building2,
  Zap
} from "lucide-react";

interface RiskAssessment {
  id: string;
  title: string;
  type: 'financial' | 'operational' | 'regulatory' | 'strategic' | 'technical' | 'clinical';
  severity: 'low' | 'medium' | 'high' | 'critical';
  probability: number;
  impact: number;
  riskScore: number;
  status: 'identified' | 'analyzing' | 'mitigating' | 'resolved';
  description: string;
  mitigation?: string;
  assignedTo?: string;
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
}

interface RiskMetrics {
  totalRisks: number;
  criticalRisks: number;
  highRisks: number;
  mediumRisks: number;
  lowRisks: number;
  resolvedRisks: number;
  avgRiskScore: number;
  trendsLastWeek: number;
}

const riskTypeColors = {
  financial: "bg-green-100 text-green-800 border-green-200",
  operational: "bg-blue-100 text-blue-800 border-blue-200", 
  regulatory: "bg-purple-100 text-purple-800 border-purple-200",
  strategic: "bg-orange-100 text-orange-800 border-orange-200",
  technical: "bg-cyan-100 text-cyan-800 border-cyan-200",
  clinical: "bg-pink-100 text-pink-800 border-pink-200"
};

const severityColors = {
  low: "bg-gray-100 text-gray-700 border-gray-200",
  medium: "bg-yellow-100 text-yellow-800 border-yellow-200",
  high: "bg-orange-100 text-orange-800 border-orange-200", 
  critical: "bg-red-100 text-red-800 border-red-200"
};

const statusColors = {
  identified: "bg-blue-100 text-blue-800 border-blue-200",
  analyzing: "bg-purple-100 text-purple-800 border-purple-200",
  mitigating: "bg-orange-100 text-orange-800 border-orange-200",
  resolved: "bg-green-100 text-green-800 border-green-200"
};

export default function RiskAnalyzer() {
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedSeverity, setSelectedSeverity] = useState<string>("all");
  const [newRisk, setNewRisk] = useState({
    title: "",
    type: "operational" as const,
    description: "",
    probability: 50,
    impact: 50
  });

  const queryClient = useQueryClient();

  // Fetch risk assessments
  const { data: risks = [], isLoading: risksLoading } = useQuery({
    queryKey: ['/api/risk-analyzer/assessments'],
  });

  // Fetch risk metrics
  const { data: metrics = {}, isLoading: metricsLoading } = useQuery({
    queryKey: ['/api/risk-analyzer/metrics'],
  });

  // Create new risk assessment
  const createRiskMutation = useMutation({
    mutationFn: async (riskData: any) => {
      const response = await fetch('/api/risk-analyzer/assessments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(riskData)
      });
      if (!response.ok) throw new Error('Failed to create risk assessment');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/risk-analyzer/assessments'] });
      queryClient.invalidateQueries({ queryKey: ['/api/risk-analyzer/metrics'] });
      setNewRisk({
        title: "",
        type: "operational",
        description: "",
        probability: 50,
        impact: 50
      });
    }
  });

  // Update risk status
  const updateRiskMutation = useMutation({
    mutationFn: async ({ riskId, updates }: { riskId: string; updates: any }) => {
      const response = await fetch(`/api/risk-analyzer/assessments/${riskId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates)
      });
      if (!response.ok) throw new Error('Failed to update risk assessment');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/risk-analyzer/assessments'] });
      queryClient.invalidateQueries({ queryKey: ['/api/risk-analyzer/metrics'] });
    }
  });

  // Filter risks based on selected criteria
  const filteredRisks = (risks as RiskAssessment[]).filter((risk: RiskAssessment) => {
    const typeMatch = selectedType === "all" || risk.type === selectedType;
    const severityMatch = selectedSeverity === "all" || risk.severity === selectedSeverity;
    return typeMatch && severityMatch;
  });

  const handleCreateRisk = () => {
    if (!newRisk.title || !newRisk.description) return;
    
    const riskScore = (newRisk.probability * newRisk.impact) / 100;
    let severity: 'low' | 'medium' | 'high' | 'critical' = 'low';
    
    if (riskScore >= 80) severity = 'critical';
    else if (riskScore >= 60) severity = 'high'; 
    else if (riskScore >= 30) severity = 'medium';

    createRiskMutation.mutate({
      ...newRisk,
      severity,
      riskScore,
      status: 'identified'
    });
  };

  const handleUpdateStatus = (riskId: string, status: string) => {
    updateRiskMutation.mutate({
      riskId,
      updates: { status }
    });
  };

  if (risksLoading || metricsLoading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex items-center space-x-3">
          <Brain className="w-8 h-8 text-blue-600" />
          <div>
            <h1 className="text-2xl font-bold">Risk Analyzer</h1>
            <p className="text-gray-600">Loading risk assessment data...</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-red-100 rounded-lg">
            <AlertTriangle className="w-6 h-6 text-red-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Risk Analyzer</h1>
            <p className="text-gray-600">Comprehensive risk assessment and management</p>
          </div>
        </div>
        <Badge variant="outline" className="px-3 py-1">
          <Activity className="w-3 h-3 mr-1" />
          Live Analysis
        </Badge>
      </div>

      {/* Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Risks</p>
                <p className="text-2xl font-bold">{metrics?.totalRisks || 0}</p>
              </div>
              <Shield className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Critical Risks</p>
                <p className="text-2xl font-bold text-red-600">{metrics?.criticalRisks || 0}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg Risk Score</p>
                <p className="text-2xl font-bold">{metrics?.avgRiskScore?.toFixed(1) || '0.0'}</p>
              </div>
              <BarChart3 className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Resolved This Week</p>
                <p className="text-2xl font-bold text-green-600">{metrics?.resolvedRisks || 0}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="assessments" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="assessments">Risk Assessments</TabsTrigger>
          <TabsTrigger value="create">Create Assessment</TabsTrigger>
          <TabsTrigger value="analytics">Risk Analytics</TabsTrigger>
        </TabsList>

        {/* Risk Assessments Tab */}
        <TabsContent value="assessments" className="space-y-4">
          <div className="flex flex-wrap gap-4">
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="financial">Financial</SelectItem>
                <SelectItem value="operational">Operational</SelectItem>
                <SelectItem value="regulatory">Regulatory</SelectItem>
                <SelectItem value="strategic">Strategic</SelectItem>
                <SelectItem value="technical">Technical</SelectItem>
                <SelectItem value="clinical">Clinical</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedSeverity} onValueChange={setSelectedSeverity}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by severity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Severities</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filteredRisks.map((risk: RiskAssessment) => (
              <Card key={risk.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-lg">{risk.title}</CardTitle>
                      <div className="flex items-center space-x-2">
                        <Badge className={`text-xs ${riskTypeColors[risk.type]}`}>
                          {risk.type.charAt(0).toUpperCase() + risk.type.slice(1)}
                        </Badge>
                        <Badge className={`text-xs ${severityColors[risk.severity]}`}>
                          {risk.severity.charAt(0).toUpperCase() + risk.severity.slice(1)}
                        </Badge>
                        <Badge className={`text-xs ${statusColors[risk.status]}`}>
                          {risk.status.charAt(0).toUpperCase() + risk.status.slice(1)}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-red-600">{risk.riskScore}</div>
                      <div className="text-xs text-gray-500">Risk Score</div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">{risk.description}</p>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Probability</div>
                      <Progress value={risk.probability} className="h-2" />
                      <div className="text-xs text-gray-500 mt-1">{risk.probability}%</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Impact</div>
                      <Progress value={risk.impact} className="h-2" />
                      <div className="text-xs text-gray-500 mt-1">{risk.impact}%</div>
                    </div>
                  </div>

                  {risk.mitigation && (
                    <Alert className="mb-4">
                      <Shield className="h-4 w-4" />
                      <AlertDescription className="text-xs">
                        <strong>Mitigation:</strong> {risk.mitigation}
                      </AlertDescription>
                    </Alert>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="text-xs text-gray-500">
                      Created: {new Date(risk.createdAt).toLocaleDateString()}
                    </div>
                    <div className="flex space-x-1">
                      {risk.status !== 'resolved' && (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleUpdateStatus(risk.id, 'analyzing')}
                            disabled={updateRiskMutation.isPending}
                          >
                            <Eye className="w-3 h-3 mr-1" />
                            Analyze
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleUpdateStatus(risk.id, 'resolved')}
                            disabled={updateRiskMutation.isPending}
                          >
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Resolve
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredRisks.length === 0 && (
            <Card>
              <CardContent className="p-8 text-center">
                <AlertTriangle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No risks found</h3>
                <p className="text-gray-600">No risk assessments match your current filters.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Create Assessment Tab */}
        <TabsContent value="create" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Create New Risk Assessment</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Risk Title</label>
                <Input
                  value={newRisk.title}
                  onChange={(e) => setNewRisk(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter risk title..."
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Risk Type</label>
                <Select value={newRisk.type} onValueChange={(value: any) => setNewRisk(prev => ({ ...prev, type: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="financial">Financial</SelectItem>
                    <SelectItem value="operational">Operational</SelectItem>
                    <SelectItem value="regulatory">Regulatory</SelectItem>
                    <SelectItem value="strategic">Strategic</SelectItem>
                    <SelectItem value="technical">Technical</SelectItem>
                    <SelectItem value="clinical">Clinical</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <Textarea
                  value={newRisk.description}
                  onChange={(e) => setNewRisk(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe the risk in detail..."
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Probability (%)</label>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={newRisk.probability}
                    onChange={(e) => setNewRisk(prev => ({ ...prev, probability: parseInt(e.target.value) || 0 }))}
                  />
                  <Progress value={newRisk.probability} className="h-2" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Impact (%)</label>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={newRisk.impact}
                    onChange={(e) => setNewRisk(prev => ({ ...prev, impact: parseInt(e.target.value) || 0 }))}
                  />
                  <Progress value={newRisk.impact} className="h-2" />
                </div>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Calculated Risk Score:</span>
                  <span className="text-2xl font-bold text-red-600">
                    {((newRisk.probability * newRisk.impact) / 100).toFixed(1)}
                  </span>
                </div>
              </div>

              <Button 
                onClick={handleCreateRisk}
                disabled={createRiskMutation.isPending || !newRisk.title || !newRisk.description}
                className="w-full"
              >
                {createRiskMutation.isPending ? (
                  <>
                    <Zap className="w-4 h-4 mr-2 animate-spin" />
                    Creating Assessment...
                  </>
                ) : (
                  <>
                    <Target className="w-4 h-4 mr-2" />
                    Create Risk Assessment
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="w-5 h-5 mr-2" />
                  Risk Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Critical</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-24 h-2 bg-gray-200 rounded">
                        <div 
                          className="h-full bg-red-500 rounded" 
                          style={{ width: `${((metrics?.criticalRisks || 0) / (metrics?.totalRisks || 1)) * 100}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-600">{metrics?.criticalRisks || 0}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">High</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-24 h-2 bg-gray-200 rounded">
                        <div 
                          className="h-full bg-orange-500 rounded" 
                          style={{ width: `${((metrics?.highRisks || 0) / (metrics?.totalRisks || 1)) * 100}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-600">{metrics?.highRisks || 0}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Medium</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-24 h-2 bg-gray-200 rounded">
                        <div 
                          className="h-full bg-yellow-500 rounded" 
                          style={{ width: `${((metrics?.mediumRisks || 0) / (metrics?.totalRisks || 1)) * 100}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-600">{metrics?.mediumRisks || 0}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Low</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-24 h-2 bg-gray-200 rounded">
                        <div 
                          className="h-full bg-gray-500 rounded" 
                          style={{ width: `${((metrics?.lowRisks || 0) / (metrics?.totalRisks || 1)) * 100}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-600">{metrics?.lowRisks || 0}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2" />
                  Risk Trends
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <div className="text-3xl font-bold mb-2">
                    {metrics?.trendsLastWeek > 0 ? '+' : ''}{metrics?.trendsLastWeek || 0}
                  </div>
                  <div className="text-sm text-gray-600 mb-4">New risks this week</div>
                  <Badge 
                    variant={metrics?.trendsLastWeek > 0 ? "destructive" : "default"}
                    className="px-3 py-1"
                  >
                    {metrics?.trendsLastWeek > 0 ? "Trending Up" : "Stable"}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Risk Analysis Insights</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>High Priority:</strong> {metrics?.criticalRisks || 0} critical risks require immediate attention
                  </AlertDescription>
                </Alert>
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Progress:</strong> {metrics?.resolvedRisks || 0} risks resolved this week
                  </AlertDescription>
                </Alert>
                <Alert>
                  <BarChart3 className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Score:</strong> Average risk score of {metrics?.avgRiskScore?.toFixed(1) || '0.0'}
                  </AlertDescription>
                </Alert>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}