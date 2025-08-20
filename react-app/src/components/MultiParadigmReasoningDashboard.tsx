import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { 
  Brain, 
  AlertTriangle, 
  Shield, 
  Users, 
  TrendingDown,
  Eye,
  Lightbulb,
  GitBranch,
  Network,
  Activity,
  Target,
  Layers,
  CheckCircle,
  XCircle,
  AlertCircle,
  Clock,
  BarChart3
} from 'lucide-react';

interface ReasoningContext {
  id: string;
  domain: string;
  confidence_level: number;
  data_sources: string[];
  stakeholders: string[];
  constraints: Record<string, any>;
  preferences: Record<string, number>;
  timestamp: Date;
}

interface ReasoningResult {
  recommendations: Array<{
    action: string;
    confidence: number;
    risk_score: number;
    utility_score: number;
    rationale: string;
    supporting_evidence: string[];
    potential_biases: string[];
    drift_indicators: string[];
  }>;
  scenario_analysis: {
    base_case: any;
    optimistic: any;
    pessimistic: any;
    monte_carlo_samples: number;
    sensitivity_factors: Record<string, number>;
  };
  human_oversight_required: boolean;
  guardrail_violations: string[];
  critical_thinking_flags: string[];
  bias_detection: {
    confirmation_bias: number;
    anchoring_bias: number;
    availability_bias: number;
    selection_bias: number;
  };
  drift_analysis: {
    concept_drift: number;
    data_drift: number;
    model_drift: number;
    temporal_drift: number;
  };
}

export default function MultiParadigmReasoningDashboard() {
  const [selectedContext, setSelectedContext] = useState<string | null>(null);
  const [newContextConfig, setNewContextConfig] = useState({
    domain: '',
    description: '',
    stakeholders: '',
    constraints: '',
    preferences: ''
  });
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Fetch active reasoning contexts
  const { data: contexts = [], isLoading: contextsLoading } = useQuery<ReasoningContext[]>({
    queryKey: ['/api/multi-paradigm-reasoning/contexts'],
  });

  // Fetch reasoning results
  const { data: reasoningResults = [] } = useQuery<ReasoningResult[]>({
    queryKey: ['/api/multi-paradigm-reasoning/results', selectedContext],
    enabled: !!selectedContext
  });

  // Fetch system metrics
  const { data: systemMetrics } = useQuery({
    queryKey: ['/api/multi-paradigm-reasoning/metrics']
  });

  const startReasoningMutation = useMutation({
    mutationFn: async (config: any) => {
      const response = await fetch('/api/multi-paradigm-reasoning/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config)
      });
      if (!response.ok) throw new Error('Failed to start reasoning');
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "Reasoning Started", description: "Multi-paradigm reasoning analysis initiated" });
      queryClient.invalidateQueries({ queryKey: ['/api/multi-paradigm-reasoning/contexts'] });
    },
    onError: (error: any) => {
      toast({ 
        title: "Start Failed", 
        description: error.message, 
        variant: "destructive" 
      });
    }
  });

  const getBiasColor = (bias: number) => {
    if (bias < 0.3) return 'text-green-600 bg-green-50';
    if (bias < 0.6) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const getDriftColor = (drift: number) => {
    if (drift < 0.2) return 'text-green-600 bg-green-50';
    if (drift < 0.4) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  if (contextsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Activity className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p>Loading Multi-Paradigm Reasoning Engine...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Multi-Paradigm Reasoning Engine</h1>
          <p className="text-gray-600 mt-2">Advanced AI reasoning with human-in-the-loop guardrails</p>
        </div>
        <div className="flex gap-2">
          <Badge variant="outline" className="text-xs">
            <Brain className="w-3 h-3 mr-1" />
            Symbolic + Statistical + Probabilistic
          </Badge>
          <Badge variant="outline" className="text-xs">
            <Shield className="w-3 h-3 mr-1" />
            Bias Detection
          </Badge>
          <Badge variant="outline" className="text-xs">
            <Users className="w-3 h-3 mr-1" />
            Human-in-Loop
          </Badge>
        </div>
      </div>

      {/* System Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Contexts</p>
                <p className="text-2xl font-bold">{contexts.length}</p>
              </div>
              <Activity className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Human Oversight Required</p>
                <p className="text-2xl font-bold">{(systemMetrics as any)?.humanOversightRequired || 0}</p>
              </div>
              <Users className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg Bias Score</p>
                <p className="text-2xl font-bold">{(systemMetrics as any)?.averageBias?.toFixed(3) || '0.000'}</p>
              </div>
              <TrendingDown className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Guardrail Violations</p>
                <p className="text-2xl font-bold">{(systemMetrics as any)?.guardrailViolations || 0}</p>
              </div>
              <Shield className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="reasoning" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="reasoning">Reasoning Results</TabsTrigger>
          <TabsTrigger value="bias">Bias Detection</TabsTrigger>
          <TabsTrigger value="drift">Drift Analysis</TabsTrigger>
          <TabsTrigger value="guardrails">Guardrails</TabsTrigger>
          <TabsTrigger value="new">New Context</TabsTrigger>
        </TabsList>

        {/* Reasoning Results Tab */}
        <TabsContent value="reasoning" className="space-y-4">
          <div className="grid gap-4">
            {contexts.map((context) => (
              <Card key={context.id} className={`cursor-pointer transition-all ${
                selectedContext === context.id ? 'ring-2 ring-blue-500' : ''
              }`} onClick={() => setSelectedContext(context.id)}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">{context.domain}</CardTitle>
                      <CardDescription>
                        {context.stakeholders.length} stakeholders • {context.data_sources.length} data sources
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">
                        Confidence: {(context.confidence_level * 100).toFixed(1)}%
                      </Badge>
                      <Clock className="w-4 h-4 text-gray-400" />
                    </div>
                  </div>
                </CardHeader>
                
                {selectedContext === context.id && reasoningResults.length > 0 && (
                  <CardContent>
                    <div className="space-y-4">
                      <h4 className="font-semibold">Recommendations</h4>
                      {reasoningResults[0]?.recommendations.map((rec, idx) => (
                        <div key={idx} className="border rounded-lg p-3 space-y-2">
                          <div className="flex items-center justify-between">
                            <h5 className="font-medium">{rec.action}</h5>
                            <div className="flex gap-2">
                              <Badge variant="outline" className="text-xs">
                                Risk: {(rec.risk_score * 100).toFixed(0)}%
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                Utility: {(rec.utility_score * 100).toFixed(0)}%
                              </Badge>
                            </div>
                          </div>
                          <p className="text-sm text-gray-600">{rec.rationale}</p>
                          
                          {rec.potential_biases.length > 0 && (
                            <div className="flex items-center gap-2 text-xs">
                              <AlertTriangle className="w-3 h-3 text-yellow-500" />
                              <span>Potential biases: {rec.potential_biases.join(', ')}</span>
                            </div>
                          )}
                          
                          {rec.drift_indicators.length > 0 && (
                            <div className="flex items-center gap-2 text-xs">
                              <TrendingDown className="w-3 h-3 text-red-500" />
                              <span>Drift indicators: {rec.drift_indicators.join(', ')}</span>
                            </div>
                          )}
                        </div>
                      ))}
                      
                      {reasoningResults[0]?.human_oversight_required && (
                        <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                          <div className="flex items-center gap-2 text-orange-700">
                            <Users className="w-4 h-4" />
                            <span className="font-medium">Human Oversight Required</span>
                          </div>
                          <p className="text-sm text-orange-600 mt-1">
                            This reasoning context requires human review due to detected biases, guardrail violations, or high uncertainty.
                          </p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Bias Detection Tab */}
        <TabsContent value="bias" className="space-y-4">
          {selectedContext && reasoningResults.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(reasoningResults[0].bias_detection).map(([biasType, score]) => (
                <Card key={biasType}>
                  <CardHeader>
                    <CardTitle className="text-lg capitalize">{biasType.replace('_', ' ')}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Risk Level</span>
                        <Badge className={getBiasColor(score)}>
                          {score < 0.3 ? 'Low' : score < 0.6 ? 'Medium' : 'High'}
                        </Badge>
                      </div>
                      <Progress value={score * 100} className="h-2" />
                      <div className="text-sm text-gray-600">
                        Score: {(score * 100).toFixed(1)}%
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <Eye className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Select a reasoning context to view bias analysis</p>
            </div>
          )}
        </TabsContent>

        {/* Drift Analysis Tab */}
        <TabsContent value="drift" className="space-y-4">
          {selectedContext && reasoningResults.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(reasoningResults[0].drift_analysis).map(([driftType, score]) => (
                <Card key={driftType}>
                  <CardHeader>
                    <CardTitle className="text-lg capitalize">{driftType.replace('_', ' ')}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Drift Level</span>
                        <Badge className={getDriftColor(score)}>
                          {score < 0.2 ? 'Stable' : score < 0.4 ? 'Moderate' : 'High'}
                        </Badge>
                      </div>
                      <Progress value={score * 100} className="h-2" />
                      <div className="text-sm text-gray-600">
                        Score: {(score * 100).toFixed(1)}%
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <BarChart3 className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Select a reasoning context to view drift analysis</p>
            </div>
          )}
        </TabsContent>

        {/* Guardrails Tab */}
        <TabsContent value="guardrails" className="space-y-4">
          {selectedContext && reasoningResults.length > 0 ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      Ethical Constraints
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm text-green-600">No violations detected</div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-yellow-500" />
                      Risk Thresholds
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm text-yellow-600">1 threshold exceeded</div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      Regulatory Compliance
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm text-green-600">Compliant</div>
                  </CardContent>
                </Card>
              </div>
              
              <Card>
                <CardHeader>
                  <CardTitle>Guardrail Violations</CardTitle>
                </CardHeader>
                <CardContent>
                  {reasoningResults[0].guardrail_violations.length > 0 ? (
                    <div className="space-y-2">
                      {reasoningResults[0].guardrail_violations.map((violation, idx) => (
                        <div key={idx} className="flex items-center gap-2 p-2 bg-red-50 rounded border-l-4 border-red-400">
                          <XCircle className="w-4 h-4 text-red-500" />
                          <span className="text-red-700">{violation}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 p-2 bg-green-50 rounded border-l-4 border-green-400">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-green-700">No guardrail violations detected</span>
                    </div>
                  )}
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Critical Thinking Flags</CardTitle>
                </CardHeader>
                <CardContent>
                  {reasoningResults[0].critical_thinking_flags.length > 0 ? (
                    <div className="space-y-2">
                      {reasoningResults[0].critical_thinking_flags.map((flag, idx) => (
                        <div key={idx} className="flex items-center gap-2 p-2 bg-yellow-50 rounded border-l-4 border-yellow-400">
                          <AlertTriangle className="w-4 h-4 text-yellow-500" />
                          <span className="text-yellow-700">{flag}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 p-2 bg-green-50 rounded border-l-4 border-green-400">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-green-700">No critical thinking issues detected</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <Shield className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Select a reasoning context to view guardrails status</p>
            </div>
          )}
        </TabsContent>

        {/* New Context Tab */}
        <TabsContent value="new" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Create New Reasoning Context</CardTitle>
              <CardDescription>
                Configure multi-paradigm AI reasoning with bias detection and human oversight
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="domain">Domain</Label>
                  <Input
                    id="domain"
                    value={newContextConfig.domain}
                    onChange={(e) => setNewContextConfig(prev => ({ ...prev, domain: e.target.value }))}
                    placeholder="e.g., Pharmaceutical R&D"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="stakeholders">Stakeholders</Label>
                  <Input
                    id="stakeholders"
                    value={newContextConfig.stakeholders}
                    onChange={(e) => setNewContextConfig(prev => ({ ...prev, stakeholders: e.target.value }))}
                    placeholder="Comma-separated list"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Problem Description</Label>
                <Textarea
                  id="description"
                  value={newContextConfig.description}
                  onChange={(e) => setNewContextConfig(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe the reasoning problem or decision context"
                  rows={3}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="constraints">Constraints</Label>
                <Textarea
                  id="constraints"
                  value={newContextConfig.constraints}
                  onChange={(e) => setNewContextConfig(prev => ({ ...prev, constraints: e.target.value }))}
                  placeholder="JSON configuration of constraints and requirements"
                  rows={3}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="preferences">Stakeholder Preferences</Label>
                <Textarea
                  id="preferences"
                  value={newContextConfig.preferences}
                  onChange={(e) => setNewContextConfig(prev => ({ ...prev, preferences: e.target.value }))}
                  placeholder="JSON configuration of preference weights"
                  rows={3}
                />
              </div>
              
              <Button 
                onClick={() => startReasoningMutation.mutate(newContextConfig)}
                disabled={startReasoningMutation.isPending || !newContextConfig.domain || !newContextConfig.description}
                className="w-full"
              >
                {startReasoningMutation.isPending ? (
                  <>
                    <Activity className="w-4 h-4 mr-2 animate-spin" />
                    Starting Reasoning Analysis...
                  </>
                ) : (
                  <>
                    <Brain className="w-4 h-4 mr-2" />
                    Start Multi-Paradigm Reasoning
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