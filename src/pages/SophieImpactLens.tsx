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
import { 
  Crosshair, 
  Brain,
  Activity,
  BarChart3,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  Users,
  Building2,
  Zap,
  TrendingUp,
  Network,
  AlertTriangle,
  DollarSign,
  Calendar,
  Shield,
  Lightbulb,
  Target,
  Layers
} from "lucide-react";

interface SophiePattern {
  id: string;
  patternType: string;
  description: string;
  confidence: number;
  detectedAt: string;
}

interface PatternHypothesis {
  id: string;
  hypothesis: string;
  reasoning: string;
  supportingEvidence: any[];
  confidenceLevel: number;
}

interface RecommendedAction {
  id: string;
  action: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  expectedOutcome: string;
  riskLevel: 'low' | 'medium' | 'high';
  effort: string;
  timeline: string;
}

interface BlastZoneAnalysis {
  id: string;
  impactRadius: 'localized' | 'departmental' | 'organizational' | 'ecosystem';
  affectedEntities: string[];
  impactSeverity: 'minimal' | 'moderate' | 'significant' | 'critical';
  cascadeEffects: any[];
  timeToFullImpact: string;
  reversibilityScore: number;
}

interface SophieImpactLens {
  id: string;
  title: string;
  sophiePattern: SophiePattern;
  hypothesis: PatternHypothesis;
  recommendedActions: RecommendedAction[];
  blastZoneAnalysis: BlastZoneAnalysis;
  overallRiskScore: number;
  confidenceLevel: number;
  status: 'analyzing' | 'ready' | 'implemented' | 'monitoring';
  createdAt: string;
  updatedAt: string;
}

const statusColors = {
  pending: "bg-gray-100 text-gray-700 border-gray-200",
  running: "bg-blue-100 text-blue-800 border-blue-200",
  completed: "bg-green-100 text-green-800 border-green-200",
  failed: "bg-red-100 text-red-800 border-red-200"
};

export default function SophieImpactLens() {
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [newAnalysis, setNewAnalysis] = useState({
    simulationName: "",
    simulationType: "AGENT_BASED_CASCADE" as const,
    triggerAction: "",
    timeHorizon: 30
  });

  const queryClient = useQueryClient();

  // Fetch Sophie Impact Lens analyses
  const { data: impactAnalyses = [], isLoading: analysesLoading } = useQuery({
    queryKey: ['/api/sophie-impact-lens/simulations'],
  });

  // Fetch Sophie patterns
  const { data: patterns = [], isLoading: patternsLoading } = useQuery({
    queryKey: ['/api/sophie-impact-lens/patterns'],
  });

  // Fetch blast zone analytics
  const { data: analytics = {}, isLoading: analyticsLoading } = useQuery({
    queryKey: ['/api/sophie-impact-lens/analytics'],
  });

  // Create new Sophie Impact Lens analysis
  const createAnalysisMutation = useMutation({
    mutationFn: async (analysisData: any) => {
      const response = await fetch('/api/sophie-impact-lens/simulations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(analysisData)
      });
      if (!response.ok) throw new Error('Failed to create Sophie Impact Lens analysis');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/sophie-impact-lens/simulations'] });
      setNewAnalysis({
        simulationName: "",
        simulationType: "AGENT_BASED_CASCADE",
        triggerAction: "",
        timeHorizon: 30
      });
    }
  });

  // Run blast zone analysis
  const runBlastZoneMutation = useMutation({
    mutationFn: async (analysisId: string) => {
      const response = await fetch(`/api/sophie-impact-lens/simulations/${analysisId}/run`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      if (!response.ok) throw new Error('Failed to run blast zone analysis');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/sophie-impact-lens/simulations'] });
    }
  });

  // Filter impact analyses
  const filteredAnalyses = (impactAnalyses as any[]).filter((analysis: any) => {
    const typeMatch = selectedType === "all" || analysis.simulationType?.toLowerCase().includes(selectedType);
    const statusMatch = selectedStatus === "all" || analysis.status === selectedStatus;
    return typeMatch && statusMatch;
  });

  const handleCreateAnalysis = () => {
    if (!newAnalysis.simulationName || !newAnalysis.triggerAction) return;
    
    createAnalysisMutation.mutate({
      ...newAnalysis,
      stakeholders: ['team_lead', 'project_manager', 'stakeholders'],
      impactDomains: ['timeline', 'budget', 'quality', 'resources']
    });
  };

  if (analysesLoading || patternsLoading || analyticsLoading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex items-center space-x-3">
          <Crosshair className="w-8 h-8 text-purple-600" />
          <div>
            <h1 className="text-2xl font-bold">Sophie Impact Lens™</h1>
            <p className="text-gray-600">Loading pattern impact analysis...</p>
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
          <div className="p-2 bg-purple-100 rounded-lg">
            <Crosshair className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Sophie Impact Lens™</h1>
            <p className="text-gray-600">Pattern-based decision impact assessment with blast zone analysis</p>
          </div>
        </div>
        <Badge variant="outline" className="px-3 py-1 bg-purple-50 text-purple-700 border-purple-200">
          <Brain className="w-3 h-3 mr-1" />
          SophieTrust™ Governance
        </Badge>
      </div>

      {/* Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Sophie Patterns</p>
                <p className="text-2xl font-bold">{patterns.length || 8}</p>
              </div>
              <Lightbulb className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Analyses</p>
                <p className="text-2xl font-bold">{filteredAnalyses.length}</p>
              </div>
              <Crosshair className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Blast Zone Sims</p>
                <p className="text-2xl font-bold">{analytics.completedSimulations || 0}</p>
              </div>
              <Layers className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg Confidence</p>
                <p className="text-2xl font-bold">{Math.round((analytics.avgConfidence || 0.85) * 100)}%</p>
              </div>
              <Target className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="patterns" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="patterns">Sophie Patterns</TabsTrigger>
          <TabsTrigger value="analyses">Impact Analyses</TabsTrigger>
          <TabsTrigger value="blast-zone">Blast Zone Viewer</TabsTrigger>
          <TabsTrigger value="create">Create Analysis</TabsTrigger>
        </TabsList>

        {/* Sophie Patterns Tab */}
        <TabsContent value="patterns" className="space-y-4">
          <Alert>
            <Brain className="h-4 w-4" />
            <AlertDescription>
              Sophie has identified patterns in your data. Review patterns to generate hypotheses and assess decision impact.
            </AlertDescription>
          </Alert>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Mock Sophie Pattern Cards */}
            {[
              {
                id: "pattern_001",
                type: "Clinical Trial Delay Pattern",
                confidence: 0.89,
                description: "Regulatory submission delays correlate with incomplete CMC data packages",
                urgency: "high",
                affectedProjects: 3
              },
              {
                id: "pattern_002", 
                type: "Market Access Risk Pattern",
                confidence: 0.76,
                description: "Payer negotiations extending beyond 6 months when health economics data is limited",
                urgency: "medium",
                affectedProjects: 2
              },
              {
                id: "pattern_003",
                type: "Resource Allocation Pattern",
                confidence: 0.82,
                description: "Cross-functional team conflicts increase when project timelines overlap >60%",
                urgency: "medium",
                affectedProjects: 5
              }
            ].map((pattern, index) => (
              <Card key={pattern.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Lightbulb className="w-5 h-5 text-yellow-500" />
                        <CardTitle className="text-lg">{pattern.type}</CardTitle>
                      </div>
                      <Badge className={`text-xs ${pattern.urgency === 'high' ? 'bg-red-100 text-red-800' : 'bg-orange-100 text-orange-800'}`}>
                        {pattern.urgency.toUpperCase()} PRIORITY
                      </Badge>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-purple-600">
                        {Math.round(pattern.confidence * 100)}%
                      </div>
                      <div className="text-xs text-gray-500">Confidence</div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-sm text-gray-600">{pattern.description}</p>
                    
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-500">
                        Affects {pattern.affectedProjects} project{pattern.affectedProjects !== 1 ? 's' : ''}
                      </div>
                      <Button size="sm" variant="outline">
                        <Crosshair className="w-3 h-3 mr-1" />
                        Analyze Impact
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Impact Analyses Tab */}
        <TabsContent value="analyses" className="space-y-4">
          <div className="flex flex-wrap gap-4">
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="agent">Agent-Based</SelectItem>
                <SelectItem value="graph">Graph Neural</SelectItem>
                <SelectItem value="monte">Monte Carlo</SelectItem>
                <SelectItem value="multi">Multi-Stakeholder</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="running">Running</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filteredAnalyses.map((analysis: any) => (
              <Card key={analysis.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-lg">{analysis.simulationName}</CardTitle>
                      <div className="flex items-center space-x-2">
                        <Badge className="text-xs bg-purple-100 text-purple-800 border-purple-200">
                          {analysis.simulationType?.replace('_', ' ')}
                        </Badge>
                        <Badge className={`text-xs ${statusColors[analysis.status] || 'bg-gray-100 text-gray-700'}`}>
                          {analysis.status?.charAt(0).toUpperCase() + analysis.status?.slice(1)}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-purple-600">
                        {analysis.timeHorizon || 30}d
                      </div>
                      <div className="text-xs text-gray-500">Horizon</div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analysis.triggerAction && (
                      <div>
                        <div className="text-sm font-medium mb-2">Trigger Action</div>
                        <p className="text-sm text-gray-600">{analysis.triggerAction.details || analysis.triggerAction}</p>
                      </div>
                    )}

                    <div>
                      <div className="text-sm font-medium mb-2">Impact Domains</div>
                      <div className="flex flex-wrap gap-1">
                        {analysis.impactDomains?.map((domain: string, index: number) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {domain}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {analysis.riskMetrics && (
                      <div className="space-y-2">
                        <div className="text-sm font-medium">Risk Score</div>
                        <Progress value={(analysis.riskMetrics.overallRiskScore || 5) * 10} className="h-2" />
                        <div className="text-xs text-gray-500">{(analysis.riskMetrics.overallRiskScore || 5).toFixed(1)}/10</div>
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <div className="text-xs text-gray-500">
                        Created: {new Date(analysis.createdAt).toLocaleDateString()}
                      </div>
                      <div className="flex space-x-1">
                        {analysis.status === 'pending' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => runBlastZoneMutation.mutate(analysis.id)}
                            disabled={runBlastZoneMutation.isPending}
                          >
                            <Layers className="w-3 h-3 mr-1" />
                            Run Blast Zone
                          </Button>
                        )}
                        {analysis.status === 'completed' && (
                          <Button
                            size="sm"
                            variant="outline"
                          >
                            <Eye className="w-3 h-3 mr-1" />
                            View Blast Zone
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredAnalyses.length === 0 && (
            <Card>
              <CardContent className="p-8 text-center">
                <Crosshair className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No impact analyses found</h3>
                <p className="text-gray-600">No Sophie Impact Lens analyses match your current filters.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Blast Zone Viewer Tab */}
        <TabsContent value="blast-zone" className="space-y-4">
          <Alert>
            <Layers className="h-4 w-4" />
            <AlertDescription>
              Blast Zone Analysis shows the impact radius of recommended actions across organizational layers.
            </AlertDescription>
          </Alert>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Mock Blast Zone Visualizations */}
            {[
              {
                id: "blast_001",
                title: "Clinical Trial Protocol Change",
                impactRadius: "organizational",
                severity: "significant",
                affectedEntities: ["Clinical Team", "Regulatory Affairs", "Data Management", "Biostatistics"],
                reversibilityScore: 0.4,
                timeToFullImpact: "3-6 months"
              },
              {
                id: "blast_002",
                title: "Market Access Strategy Shift",
                impactRadius: "ecosystem",
                severity: "critical",
                affectedEntities: ["Commercial Team", "Medical Affairs", "Payer Relations", "External Partners"],
                reversibilityScore: 0.2,
                timeToFullImpact: "12-18 months"
              }
            ].map((blastZone) => (
              <Card key={blastZone.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{blastZone.title}</CardTitle>
                      <div className="flex items-center space-x-2 mt-2">
                        <Badge className={`text-xs ${
                          blastZone.impactRadius === 'ecosystem' ? 'bg-red-100 text-red-800' :
                          blastZone.impactRadius === 'organizational' ? 'bg-orange-100 text-orange-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {blastZone.impactRadius.toUpperCase()}
                        </Badge>
                        <Badge className={`text-xs ${
                          blastZone.severity === 'critical' ? 'bg-red-100 text-red-800' :
                          blastZone.severity === 'significant' ? 'bg-orange-100 text-orange-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {blastZone.severity.toUpperCase()}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-red-600">
                        {Math.round(blastZone.reversibilityScore * 100)}%
                      </div>
                      <div className="text-xs text-gray-500">Reversible</div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="text-sm font-medium mb-2">Affected Entities</div>
                      <div className="flex flex-wrap gap-1">
                        {blastZone.affectedEntities.map((entity, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {entity}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <div className="text-sm font-medium mb-1">Time to Full Impact</div>
                      <p className="text-sm text-gray-600">{blastZone.timeToFullImpact}</p>
                    </div>

                    <div className="space-y-2">
                      <div className="text-sm font-medium">Reversibility Score</div>
                      <Progress value={blastZone.reversibilityScore * 100} className="h-2" />
                      <div className="text-xs text-gray-500">
                        {blastZone.reversibilityScore < 0.3 ? 'Difficult to reverse' : 
                         blastZone.reversibilityScore < 0.7 ? 'Moderately reversible' : 
                         'Easily reversible'}
                      </div>
                    </div>

                    <Button size="sm" variant="outline" className="w-full">
                      <Eye className="w-3 h-3 mr-1" />
                      View Detailed Blast Zone
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Create Analysis Tab */}
        <TabsContent value="create" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Create New Sophie Impact Analysis</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Simulation Name</label>
                <Input
                  value={newAnalysis.simulationName}
                  onChange={(e) => setNewAnalysis(prev => ({ ...prev, simulationName: e.target.value }))}
                  placeholder="Enter simulation name..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Simulation Type</label>
                  <Select value={newAnalysis.simulationType} onValueChange={(value: any) => setNewAnalysis(prev => ({ ...prev, simulationType: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="AGENT_BASED_CASCADE">Agent-Based Cascade</SelectItem>
                      <SelectItem value="GRAPH_NEURAL_PROPAGATION">Graph Neural Propagation</SelectItem>
                      <SelectItem value="MONTE_CARLO">Monte Carlo</SelectItem>
                      <SelectItem value="MULTI_STAKEHOLDER">Multi-Stakeholder</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Time Horizon (days)</label>
                  <Input
                    type="number"
                    min="1"
                    max="365"
                    value={newAnalysis.timeHorizon}
                    onChange={(e) => setNewAnalysis(prev => ({ ...prev, timeHorizon: parseInt(e.target.value) || 30 }))}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Trigger Action</label>
                <Textarea
                  value={newAnalysis.triggerAction}
                  onChange={(e) => setNewAnalysis(prev => ({ ...prev, triggerAction: e.target.value }))}
                  placeholder="Describe the action or decision to analyze..."
                  rows={3}
                />
              </div>

              <Button 
                onClick={handleCreateAnalysis}
                disabled={createAnalysisMutation.isPending || !newAnalysis.simulationName || !newAnalysis.triggerAction}
                className="w-full"
              >
                {createAnalysisMutation.isPending ? (
                  <>
                    <Zap className="w-4 h-4 mr-2 animate-spin" />
                    Creating Analysis...
                  </>
                ) : (
                  <>
                    <Crosshair className="w-4 h-4 mr-2" />
                    Create Impact Analysis
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}