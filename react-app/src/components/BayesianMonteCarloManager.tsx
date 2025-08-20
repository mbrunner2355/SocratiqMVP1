import React, { useState, useEffect } from 'react';
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
  Target, 
  Zap, 
  Activity, 
  TrendingUp, 
  Settings, 
  Play, 
  Pause, 
  RotateCcw,
  Eye,
  BarChart3,
  Lightbulb,
  GitBranch,
  Layers,
  ArrowRight,
  ChevronRight
} from 'lucide-react';

interface BayesianParameter {
  name: string;
  value: number;
  uncertainty: number;
  prior_distribution: string;
  posterior_samples: number[];
}

interface MonteCarloSimulation {
  id: string;
  name: string;
  status: 'running' | 'completed' | 'paused' | 'failed';
  iterations: number;
  current_iteration: number;
  convergence_threshold: number;
  current_convergence: number;
  best_solution: any;
  hyperparameters: BayesianParameter[];
  thinking_orders: {
    first_order: {
      observations: string[];
      direct_inferences: string[];
      confidence: number;
    };
    second_order: {
      meta_reasoning: string[];
      uncertainty_analysis: string[];
      confidence_bounds: [number, number];
    };
  };
  acquisition_function: string;
  exploration_exploitation_ratio: number;
  created_at: string;
  estimated_completion: string;
}

interface OptimizationResult {
  iteration: number;
  objective_value: number;
  parameters: Record<string, number>;
  acquisition_score: number;
  improvement: number;
  thinking_trace: {
    first_order_reasoning: string;
    second_order_analysis: string;
    decision_confidence: number;
  };
  timestamp: string;
}

export default function BayesianMonteCarloManager() {
  const [selectedSimulation, setSelectedSimulation] = useState<string | null>(null);
  const [newSimulationConfig, setNewSimulationConfig] = useState({
    name: '',
    objective: '',
    parameters: '',
    iterations: 1000,
    acquisition_function: 'expected_improvement'
  });
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Fetch active simulations
  const { data: simulations = [], isLoading } = useQuery<MonteCarloSimulation[]>({
    queryKey: ['/api/bayesian-monte-carlo/simulations'],
  });

  // Fetch optimization results
  const { data: results = [] } = useQuery<OptimizationResult[]>({
    queryKey: ['/api/bayesian-monte-carlo/results', selectedSimulation],
    enabled: !!selectedSimulation
  });

  // Fetch system metrics
  const { data: metrics } = useQuery({
    queryKey: ['/api/bayesian-monte-carlo/metrics']
  });

  // Start new simulation
  const startSimulationMutation = useMutation({
    mutationFn: async (config: any) => {
      const response = await fetch('/api/bayesian-monte-carlo/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config)
      });
      if (!response.ok) throw new Error('Failed to start simulation');
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "Simulation Started", description: "Bayesian Monte Carlo optimization initiated" });
      queryClient.invalidateQueries({ queryKey: ['/api/bayesian-monte-carlo/simulations'] });
      setNewSimulationConfig({ name: '', objective: '', parameters: '', iterations: 1000, acquisition_function: 'expected_improvement' });
    },
    onError: (error: any) => {
      toast({ 
        title: "Start Failed", 
        description: error.message, 
        variant: "destructive" 
      });
    }
  });

  // Control simulation (pause/resume/stop)
  const controlSimulationMutation = useMutation({
    mutationFn: async ({ simulationId, action }: { simulationId: string, action: string }) => {
      const response = await fetch(`/api/bayesian-monte-carlo/control/${simulationId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action })
      });
      if (!response.ok) throw new Error('Failed to control simulation');
      return response.json();
    },
    onSuccess: (data, variables) => {
      toast({ 
        title: "Simulation Controlled", 
        description: `Successfully ${variables.action}ed simulation` 
      });
      queryClient.invalidateQueries({ queryKey: ['/api/bayesian-monte-carlo/simulations'] });
    },
    onError: (error: any) => {
      toast({ 
        title: "Control Failed", 
        description: error.message, 
        variant: "destructive" 
      });
    }
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running': return 'bg-blue-500';
      case 'completed': return 'bg-green-500';
      case 'paused': return 'bg-yellow-500';
      case 'failed': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getAcquisitionFunctionDescription = (func: string) => {
    const descriptions = {
      'expected_improvement': 'Balances exploration and exploitation by maximizing expected improvement',
      'probability_of_improvement': 'Focuses on probability that new sample improves current best',
      'upper_confidence_bound': 'Uses uncertainty to guide exploration with confidence bounds',
      'entropy_search': 'Minimizes entropy of posterior distribution over global optimum'
    };
    return descriptions[func as keyof typeof descriptions] || 'Custom acquisition function';
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Activity className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p>Loading Bayesian Monte Carlo systems...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Bayesian Monte Carlo Optimizer</h1>
          <p className="text-gray-600 mt-2">Advanced reasoning with first and second-order logic</p>
        </div>
        <div className="flex gap-2">
          <Badge variant="outline" className="text-xs">
            <Brain className="w-3 h-3 mr-1" />
            Multi-Order Reasoning
          </Badge>
          <Badge variant="outline" className="text-xs">
            <Target className="w-3 h-3 mr-1" />
            Bayesian Optimal
          </Badge>
        </div>
      </div>

      {/* System Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Simulations</p>
                <p className="text-2xl font-bold">{simulations.filter(s => s.status === 'running').length}</p>
              </div>
              <Activity className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Completed Runs</p>
                <p className="text-2xl font-bold">{simulations.filter(s => s.status === 'completed').length}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg Convergence</p>
                <p className="text-2xl font-bold">{(metrics as any)?.averageConvergence?.toFixed(3) || '0.000'}</p>
              </div>
              <Target className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Iterations</p>
                <p className="text-2xl font-bold">{(metrics as any)?.totalIterations?.toLocaleString() || '0'}</p>
              </div>
              <Zap className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="simulations" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="simulations">Active Simulations</TabsTrigger>
          <TabsTrigger value="results">Optimization Results</TabsTrigger>
          <TabsTrigger value="reasoning">Logic Analysis</TabsTrigger>
          <TabsTrigger value="new">New Simulation</TabsTrigger>
        </TabsList>

        {/* Active Simulations Tab */}
        <TabsContent value="simulations" className="space-y-4">
          <div className="grid gap-4">
            {simulations.map((simulation) => (
              <Card key={simulation.id} className={`cursor-pointer transition-all ${
                selectedSimulation === simulation.id ? 'ring-2 ring-blue-500' : ''
              }`} onClick={() => setSelectedSimulation(simulation.id)}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">{simulation.name}</CardTitle>
                      <CardDescription>
                        {simulation.acquisition_function} • {simulation.iterations.toLocaleString()} iterations
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(simulation.status)}>
                        {simulation.status}
                      </Badge>
                      <div className="flex gap-1">
                        {simulation.status === 'running' ? (
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={(e) => {
                              e.stopPropagation();
                              controlSimulationMutation.mutate({ simulationId: simulation.id, action: 'pause' });
                            }}
                          >
                            <Pause className="w-3 h-3" />
                          </Button>
                        ) : simulation.status === 'paused' ? (
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={(e) => {
                              e.stopPropagation();
                              controlSimulationMutation.mutate({ simulationId: simulation.id, action: 'resume' });
                            }}
                          >
                            <Play className="w-3 h-3" />
                          </Button>
                        ) : null}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Progress</span>
                        <span>{simulation.current_iteration}/{simulation.iterations}</span>
                      </div>
                      <Progress value={(simulation.current_iteration / simulation.iterations) * 100} />
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Convergence</span>
                        <span>{(simulation.current_convergence * 100).toFixed(2)}%</span>
                      </div>
                      <Progress value={simulation.current_convergence * 100} className="h-2" />
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Exploration/Exploitation:</span>
                        <span className="ml-2 font-mono">{simulation.exploration_exploitation_ratio.toFixed(3)}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Est. Completion:</span>
                        <span className="ml-2">{simulation.estimated_completion}</span>
                      </div>
                    </div>

                    {/* Thinking Orders Preview */}
                    <div className="grid grid-cols-2 gap-3 pt-2 border-t">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1 text-xs font-semibold text-blue-600">
                          <Eye className="w-3 h-3" />
                          1st Order Thinking
                        </div>
                        <div className="text-xs text-gray-600">
                          Confidence: {(simulation.thinking_orders.first_order.confidence * 100).toFixed(1)}%
                        </div>
                        <div className="text-xs">
                          {simulation.thinking_orders.first_order.observations.length} observations,
                          {simulation.thinking_orders.first_order.direct_inferences.length} inferences
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-1 text-xs font-semibold text-purple-600">
                          <Layers className="w-3 h-3" />
                          2nd Order Logic
                        </div>
                        <div className="text-xs text-gray-600">
                          Bounds: [{simulation.thinking_orders.second_order.confidence_bounds[0].toFixed(2)}, 
                          {simulation.thinking_orders.second_order.confidence_bounds[1].toFixed(2)}]
                        </div>
                        <div className="text-xs">
                          {simulation.thinking_orders.second_order.meta_reasoning.length} meta-analyses
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Results Tab */}
        <TabsContent value="results" className="space-y-4">
          {selectedSimulation ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Optimization Results</h3>
                <Badge variant="outline">{results.length} iterations analyzed</Badge>
              </div>
              
              <ScrollArea className="h-96">
                <div className="space-y-3">
                  {results.map((result) => (
                    <Card key={result.iteration}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <Badge variant="secondary">Iteration {result.iteration}</Badge>
                              <Badge variant="outline" className="text-xs">
                                Obj: {result.objective_value.toFixed(4)}
                              </Badge>
                              {result.improvement > 0 && (
                                <Badge className="bg-green-500 text-xs">
                                  +{result.improvement.toFixed(4)}
                                </Badge>
                              )}
                            </div>
                            <p className="text-xs text-gray-500">{result.timestamp}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-gray-600">Acquisition Score</p>
                            <p className="font-mono text-sm">{result.acquisition_score.toFixed(4)}</p>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm">
                            <Eye className="w-3 h-3 text-blue-500" />
                            <span className="font-semibold">1st Order:</span>
                            <span className="text-gray-600">{result.thinking_trace.first_order_reasoning}</span>
                          </div>
                          
                          <div className="flex items-center gap-2 text-sm">
                            <Layers className="w-3 h-3 text-purple-500" />
                            <span className="font-semibold">2nd Order:</span>
                            <span className="text-gray-600">{result.thinking_trace.second_order_analysis}</span>
                          </div>
                          
                          <div className="flex items-center gap-2 text-sm">
                            <Target className="w-3 h-3 text-green-500" />
                            <span className="font-semibold">Confidence:</span>
                            <span className="font-mono">{(result.thinking_trace.decision_confidence * 100).toFixed(1)}%</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <BarChart3 className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Select a simulation to view optimization results</p>
            </div>
          )}
        </TabsContent>

        {/* Logic Analysis Tab */}
        <TabsContent value="reasoning" className="space-y-4">
          {selectedSimulation ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {simulations.find(s => s.id === selectedSimulation)?.thinking_orders && (
                <>
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Eye className="w-5 h-5 text-blue-500" />
                        First-Order Thinking
                      </CardTitle>
                      <CardDescription>Direct observations and immediate inferences</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-semibold text-sm mb-2">Observations</h4>
                          <div className="space-y-1">
                            {simulations.find(s => s.id === selectedSimulation)?.thinking_orders.first_order.observations.map((obs, idx) => (
                              <div key={idx} className="flex items-start gap-2 text-sm">
                                <ChevronRight className="w-3 h-3 mt-0.5 text-blue-400" />
                                <span>{obs}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="font-semibold text-sm mb-2">Direct Inferences</h4>
                          <div className="space-y-1">
                            {simulations.find(s => s.id === selectedSimulation)?.thinking_orders.first_order.direct_inferences.map((inf, idx) => (
                              <div key={idx} className="flex items-start gap-2 text-sm">
                                <ArrowRight className="w-3 h-3 mt-0.5 text-blue-400" />
                                <span>{inf}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        <div className="pt-2 border-t">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Confidence Level</span>
                            <span className="font-mono">
                              {(simulations.find(s => s.id === selectedSimulation)?.thinking_orders.first_order.confidence * 100).toFixed(1)}%
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Layers className="w-5 h-5 text-purple-500" />
                        Second-Order Logic
                      </CardTitle>
                      <CardDescription>Meta-reasoning and uncertainty analysis</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-semibold text-sm mb-2">Meta-Reasoning</h4>
                          <div className="space-y-1">
                            {simulations.find(s => s.id === selectedSimulation)?.thinking_orders.second_order.meta_reasoning.map((meta, idx) => (
                              <div key={idx} className="flex items-start gap-2 text-sm">
                                <ChevronRight className="w-3 h-3 mt-0.5 text-purple-400" />
                                <span>{meta}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="font-semibold text-sm mb-2">Uncertainty Analysis</h4>
                          <div className="space-y-1">
                            {simulations.find(s => s.id === selectedSimulation)?.thinking_orders.second_order.uncertainty_analysis.map((unc, idx) => (
                              <div key={idx} className="flex items-start gap-2 text-sm">
                                <ArrowRight className="w-3 h-3 mt-0.5 text-purple-400" />
                                <span>{unc}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        <div className="pt-2 border-t">
                          <div className="flex items-center justify-between text-sm mb-2">
                            <span className="text-gray-600">Confidence Bounds</span>
                            <span className="font-mono">
                              [{simulations.find(s => s.id === selectedSimulation)?.thinking_orders.second_order.confidence_bounds[0]?.toFixed(3) || '0.000'}, 
                              {simulations.find(s => s.id === selectedSimulation)?.thinking_orders.second_order.confidence_bounds[1]?.toFixed(3) || '1.000'}]
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </>
              )}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <Lightbulb className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Select a simulation to analyze reasoning patterns</p>
            </div>
          )}
        </TabsContent>

        {/* New Simulation Tab */}
        <TabsContent value="new" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Create New Bayesian Monte Carlo Simulation</CardTitle>
              <CardDescription>
                Configure advanced optimization with multi-order reasoning
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="simulation-name">Simulation Name</Label>
                  <Input
                    id="simulation-name"
                    value={newSimulationConfig.name}
                    onChange={(e) => setNewSimulationConfig(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., Sophie Model Hyperparameter Optimization"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="iterations">Max Iterations</Label>
                  <Input
                    id="iterations"
                    type="number"
                    value={newSimulationConfig.iterations}
                    onChange={(e) => setNewSimulationConfig(prev => ({ ...prev, iterations: parseInt(e.target.value) }))}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="acquisition-function">Acquisition Function</Label>
                <Select 
                  value={newSimulationConfig.acquisition_function}
                  onValueChange={(value) => setNewSimulationConfig(prev => ({ ...prev, acquisition_function: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="expected_improvement">Expected Improvement</SelectItem>
                    <SelectItem value="probability_of_improvement">Probability of Improvement</SelectItem>
                    <SelectItem value="upper_confidence_bound">Upper Confidence Bound</SelectItem>
                    <SelectItem value="entropy_search">Entropy Search</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-500">
                  {getAcquisitionFunctionDescription(newSimulationConfig.acquisition_function)}
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="objective">Objective Function</Label>
                <Textarea
                  id="objective"
                  value={newSimulationConfig.objective}
                  onChange={(e) => setNewSimulationConfig(prev => ({ ...prev, objective: e.target.value }))}
                  placeholder="Define the objective function to optimize (e.g., minimize validation loss, maximize accuracy)"
                  rows={3}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="parameters">Parameter Space</Label>
                <Textarea
                  id="parameters"
                  value={newSimulationConfig.parameters}
                  onChange={(e) => setNewSimulationConfig(prev => ({ ...prev, parameters: e.target.value }))}
                  placeholder="JSON configuration of parameters to optimize (ranges, distributions, constraints)"
                  rows={4}
                />
              </div>
              
              <Button 
                onClick={() => startSimulationMutation.mutate(newSimulationConfig)}
                disabled={startSimulationMutation.isPending || !newSimulationConfig.name || !newSimulationConfig.objective}
                className="w-full"
              >
                {startSimulationMutation.isPending ? (
                  <>
                    <Activity className="w-4 h-4 mr-2 animate-spin" />
                    Starting Simulation...
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 mr-2" />
                    Start Bayesian Optimization
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