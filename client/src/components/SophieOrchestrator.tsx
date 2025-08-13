import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { 
  Brain, 
  Plus, 
  Play,
  Network,
  Users,
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  Zap,
  Target,
  BarChart3,
  Settings,
  MessageSquare,
  Cpu,
  Database,
  Eye,
  Lightbulb,
  TrendingUp,
  Send,
  GitBranch,
  Timer
} from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';

interface AgentDefinition {
  id: string;
  agentName: string;
  agentType: string;
  category: string;
  capabilities: any;
  resourceRequirements: any;
  domainSpecialization: string;
  priority: number;
  isActive: boolean;
  version: string;
  createdAt: string;
}

interface ReasoningSession {
  id: string;
  sessionType: string;
  triggerSource: string;
  status: string;
  agentOrchestration: any[];
  currentStep: number;
  totalSteps: number;
  startTime: string;
  endTime?: string;
  processingTime?: number;
  confidenceScore?: number;
  correlationId: string;
}

interface AgentExecution {
  id: string;
  sessionId: string;
  agentId: string;
  executionOrder: number;
  status: string;
  processingTime?: number;
  confidenceScore?: number;
  startTime: string;
  endTime?: string;
}

interface PatternDetectionResult {
  id: string;
  patternType: string;
  detectionMethod: string;
  dataSource: string;
  patternDescription: string;
  anomalyScore?: number;
  statisticalSignificance?: number;
  createdAt: string;
}

export function SophieOrchestrator() {
  const [selectedTab, setSelectedTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const queryClient = useQueryClient();

  // Fetch data
  const { data: agents, isLoading: agentsLoading } = useQuery<AgentDefinition[]>({
    queryKey: ['/api/sophie/agents'],
  });

  const { data: analytics } = useQuery({
    queryKey: ['/api/sophie/analytics/overview'],
  });

  const { data: sessions } = useQuery<ReasoningSession[]>({
    queryKey: ['/api/sophie/sessions'],
  });

  const { data: patterns } = useQuery<PatternDetectionResult[]>({
    queryKey: ['/api/sophie/patterns'],
  });

  // Create reasoning session mutation
  const createSessionMutation = useMutation({
    mutationFn: (data: any) => apiRequest('/api/sophie/sessions', 'POST', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/sophie/sessions'] });
      queryClient.invalidateQueries({ queryKey: ['/api/sophie/analytics/overview'] });
    }
  });

  // Create agent definition mutation
  const createAgentMutation = useMutation({
    mutationFn: (data: any) => apiRequest('/api/sophie/agents', 'POST', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/sophie/agents'] });
      queryClient.invalidateQueries({ queryKey: ['/api/sophie/analytics/overview'] });
    }
  });

  const getAgentTypeColor = (agentType: string) => {
    switch (agentType) {
      case 'PATTERN_DETECTION': return 'bg-blue-100 text-blue-800';
      case 'HYPOTHESIS': return 'bg-purple-100 text-purple-800';
      case 'DECISION_ENGINE': return 'bg-green-100 text-green-800';
      case 'ACTION_DISPATCH': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': 
      case 'COMPLETED': 
      case 'RUNNING': return 'bg-green-100 text-green-800';
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'FAILED': 
      case 'TIMEOUT': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getAgentIcon = (agentType: string) => {
    switch (agentType) {
      case 'PATTERN_DETECTION': return <Eye className="h-4 w-4" />;
      case 'HYPOTHESIS': return <Lightbulb className="h-4 w-4" />;
      case 'DECISION_ENGINE': return <Target className="h-4 w-4" />;
      case 'ACTION_DISPATCH': return <Send className="h-4 w-4" />;
      default: return <Brain className="h-4 w-4" />;
    }
  };

  const handleCreateSession = () => {
    createSessionMutation.mutate({
      sessionType: 'USER_PROMPT',
      triggerSource: 'manual_trigger',
      triggerPayload: {
        query: 'Analyze recent data patterns and provide optimization recommendations',
        domain: 'GENERAL',
        priority: 'HIGH'
      },
      sessionContext: {
        userContext: { userId: 'current_user', role: 'analyst' },
        systemContext: { timestamp: new Date().toISOString() },
        processingPreferences: { confidenceThreshold: 0.8, timeoutMs: 300000 }
      }
    });
  };

  const handleCreateAgent = () => {
    createAgentMutation.mutate({
      agentName: `CustomAgent_${Date.now()}`,
      agentType: 'PATTERN_DETECTION',
      category: 'TEMPORAL_PATTERN',
      capabilities: {
        algorithms: ['time_series_analysis', 'trend_detection'],
        dataTypes: ['numerical', 'temporal'],
        realTimeProcessing: true
      },
      modelReferences: ['temporal_model_v1.0'],
      resourceRequirements: { cpu: 2, memory: '4GB', timeout: 30000 },
      communicationProtocols: ['EVENT_DRIVEN', 'REQUEST_RESPONSE'],
      domainSpecialization: 'GENERAL',
      confidenceThresholds: { minimum: 0.7, recommended: 0.85 },
      timeoutSettings: { execution: 30000, communication: 5000 },
      priority: 5,
      version: '1.0.0'
    });
  };

  if (agentsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-sm text-muted-foreground">Loading Sophie™ Orchestrator...</p>
        </div>
      </div>
    );
  }

  const filteredAgents = agents?.filter(agent =>
    agent.agentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    agent.agentType.toLowerCase().includes(searchTerm.toLowerCase()) ||
    agent.domainSpecialization.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">SocratIQ Sophie™ - Multi-Agent Orchestrator</h1>
          <p className="text-muted-foreground">
            Autonomous decision orchestration with multi-agent coordination and SophieLogic™ reasoning cycles
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Network className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search agents..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 w-64"
            />
          </div>
          <Button onClick={handleCreateSession} disabled={createSessionMutation.isPending}>
            <Play className="h-4 w-4 mr-2" />
            Start Session
          </Button>
          <Button onClick={handleCreateAgent} disabled={createAgentMutation.isPending} variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            Create Agent
          </Button>
        </div>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="agents">Agents ({agents?.length || 0})</TabsTrigger>
          <TabsTrigger value="sessions">Sessions ({sessions?.length || 0})</TabsTrigger>
          <TabsTrigger value="patterns">Patterns</TabsTrigger>
          <TabsTrigger value="communication">Communication</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Analytics Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Agents</CardTitle>
                <Brain className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{(analytics as any)?.activeAgents || 0}</div>
                <p className="text-xs text-muted-foreground">
                  {(analytics as any)?.totalAgents || 0} total registered
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Sessions</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{(analytics as any)?.activeSessions || 0}</div>
                <p className="text-xs text-muted-foreground">
                  {(analytics as any)?.totalSessions || 0} total sessions
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg Session Time</CardTitle>
                <Timer className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{((analytics as any)?.averageSessionTime / 1000)?.toFixed(1) || 0}s</div>
                <p className="text-xs text-muted-foreground">
                  Processing efficiency
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Resource Efficiency</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{((analytics as any)?.resourceUtilization?.averageEfficiency * 100)?.toFixed(0) || 0}%</div>
                <p className="text-xs text-muted-foreground">
                  Utilization efficiency
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Agent Type Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Agent Orchestration Architecture</CardTitle>
              <CardDescription>Multi-agent coordination with specialized capabilities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <div className="flex items-center space-x-3 p-3 border rounded-lg">
                  <Eye className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="font-medium">Pattern Detection</p>
                    <p className="text-sm text-muted-foreground">
                      {(analytics as any)?.agentsByType?.PATTERN_DETECTION || 0} agents
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 border rounded-lg">
                  <Lightbulb className="h-5 w-5 text-purple-600" />
                  <div>
                    <p className="font-medium">Hypothesis</p>
                    <p className="text-sm text-muted-foreground">
                      {(analytics as any)?.agentsByType?.HYPOTHESIS || 0} agents
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 border rounded-lg">
                  <Target className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="font-medium">Decision Engine</p>
                    <p className="text-sm text-muted-foreground">
                      {(analytics as any)?.agentsByType?.DECISION_ENGINE || 0} agents
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 border rounded-lg">
                  <Send className="h-5 w-5 text-orange-600" />
                  <div>
                    <p className="font-medium">Action Dispatch</p>
                    <p className="text-sm text-muted-foreground">
                      {(analytics as any)?.agentsByType?.ACTION_DISPATCH || 0} agents
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* SophieLogic™ Reasoning Cycle */}
          <Card>
            <CardHeader>
              <CardTitle>SophieLogic™ Reasoning Cycle</CardTitle>
              <CardDescription>Pattern → Scenario → Recommendation workflow with TraceUnit™ capture</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="text-center p-4 border rounded-lg">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Eye className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="font-medium mb-2">Pattern Detection</h3>
                  <p className="text-sm text-muted-foreground">
                    Statistical anomaly detection, temporal patterns, cross-domain correlation analysis
                  </p>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Lightbulb className="h-6 w-6 text-purple-600" />
                  </div>
                  <h3 className="font-medium mb-2">Scenario Modeling</h3>
                  <p className="text-sm text-muted-foreground">
                    Causal relationship modeling, counterfactual generation, predictive simulation
                  </p>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Target className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="font-medium mb-2">Recommendation</h3>
                  <p className="text-sm text-muted-foreground">
                    Multi-criteria optimization, risk-benefit analysis, action planning
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Patterns and Results */}
          {patterns && patterns.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Recent Pattern Detection Results</CardTitle>
                <CardDescription>Latest patterns identified by detection agents</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {patterns.slice(0, 5).map((pattern) => (
                    <div key={pattern.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Badge className={getAgentTypeColor('PATTERN_DETECTION')}>
                          {pattern.patternType}
                        </Badge>
                        <div>
                          <p className="font-medium text-sm">{pattern.patternDescription}</p>
                          <p className="text-xs text-muted-foreground">
                            Method: {pattern.detectionMethod} • Source: {pattern.dataSource}
                          </p>
                        </div>
                      </div>
                      <div className="text-right text-sm">
                        {pattern.anomalyScore && (
                          <p className="font-medium">Score: {(pattern.anomalyScore * 100).toFixed(0)}%</p>
                        )}
                        <p className="text-muted-foreground">{new Date(pattern.createdAt).toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="agents">
          <Card>
            <CardHeader>
              <CardTitle>Agent Registry</CardTitle>
              <CardDescription>Multi-agent definitions with specialized capabilities and coordination protocols</CardDescription>
            </CardHeader>
            <CardContent>
              {filteredAgents && filteredAgents.length > 0 ? (
                <div className="space-y-4">
                  {filteredAgents.map((agent) => (
                    <Card key={agent.id}>
                      <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                              {getAgentIcon(agent.agentType)}
                            </div>
                            <div>
                              <h4 className="font-medium">{agent.agentName}</h4>
                              <div className="flex items-center space-x-2 mt-1">
                                <Badge className={getAgentTypeColor(agent.agentType)}>
                                  {agent.agentType}
                                </Badge>
                                <Badge variant="outline">{agent.category}</Badge>
                                <Badge variant="outline">{agent.domainSpecialization}</Badge>
                                <Badge variant="outline">v{agent.version}</Badge>
                                {agent.isActive ? (
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
                              <p className="text-sm text-muted-foreground mt-1">
                                Priority: {agent.priority}/10 • CPU: {agent.resourceRequirements.cpu} cores • Memory: {agent.resourceRequirements.memory}
                              </p>
                            </div>
                          </div>
                          <div className="text-right text-sm">
                            <div className="flex items-center space-x-1 mb-1">
                              <Cpu className="h-3 w-3 text-muted-foreground" />
                              <span className="text-muted-foreground">
                                {Object.keys(agent.capabilities).length} capabilities
                              </span>
                            </div>
                            <p className="text-muted-foreground">
                              Created: {new Date(agent.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Brain className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-medium mb-2">No agents found</h3>
                  <p className="text-muted-foreground mb-4">
                    {searchTerm ? 'Try adjusting your search terms' : 'Create your first agent to get started'}
                  </p>
                  {!searchTerm && (
                    <Button onClick={handleCreateAgent}>
                      <Plus className="h-4 w-4 mr-2" />
                      Create Agent
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sessions">
          <Card>
            <CardHeader>
              <CardTitle>Reasoning Sessions</CardTitle>
              <CardDescription>SophieLogic™ reasoning cycles with agent orchestration and execution tracking</CardDescription>
            </CardHeader>
            <CardContent>
              {sessions && sessions.length > 0 ? (
                <div className="space-y-4">
                  {sessions.slice(0, 10).map((session) => (
                    <Card key={session.id}>
                      <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                              <GitBranch className="h-5 w-5" />
                            </div>
                            <div>
                              <div className="flex items-center space-x-2 mb-1">
                                <Badge variant="outline">{session.sessionType}</Badge>
                                <Badge className={getStatusColor(session.status)}>
                                  {session.status}
                                </Badge>
                                <span className="text-sm text-muted-foreground">
                                  Step {session.currentStep}/{session.totalSteps}
                                </span>
                              </div>
                              <h4 className="font-medium">Session {session.id.slice(0, 8)}</h4>
                              <p className="text-sm text-muted-foreground">
                                Triggered by: {session.triggerSource} • Agents: {session.agentOrchestration.length}
                              </p>
                              {session.confidenceScore && (
                                <p className="text-xs text-muted-foreground">
                                  Confidence: {(session.confidenceScore * 100).toFixed(1)}%
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="text-right text-sm">
                            <p className="font-medium">
                              {session.processingTime ? `${session.processingTime}ms` : 'Running...'}
                            </p>
                            <p className="text-muted-foreground">
                              Started: {new Date(session.startTime).toLocaleString()}
                            </p>
                            {session.endTime && (
                              <p className="text-muted-foreground">
                                Ended: {new Date(session.endTime).toLocaleString()}
                              </p>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Activity className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-medium mb-2">No reasoning sessions</h3>
                  <p className="text-muted-foreground mb-4">
                    Start a reasoning session to see SophieLogic™ in action
                  </p>
                  <Button onClick={handleCreateSession}>
                    <Play className="h-4 w-4 mr-2" />
                    Start Session
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="patterns">
          <Card>
            <CardHeader>
              <CardTitle>Pattern Detection Results</CardTitle>
              <CardDescription>Statistical anomalies, temporal patterns, and emerging signals identified by agents</CardDescription>
            </CardHeader>
            <CardContent>
              {patterns && patterns.length > 0 ? (
                <div className="space-y-4">
                  {patterns.map((pattern) => (
                    <div key={pattern.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <Badge className={getAgentTypeColor('PATTERN_DETECTION')}>
                            {pattern.patternType}
                          </Badge>
                          <Badge variant="outline">{pattern.detectionMethod}</Badge>
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {new Date(pattern.createdAt).toLocaleString()}
                        </span>
                      </div>
                      <p className="font-medium mb-1">{pattern.patternDescription}</p>
                      <p className="text-sm text-muted-foreground mb-2">
                        Data Source: {pattern.dataSource}
                      </p>
                      <div className="flex items-center space-x-4 text-xs">
                        {pattern.anomalyScore && (
                          <span>Anomaly Score: {(pattern.anomalyScore * 100).toFixed(1)}%</span>
                        )}
                        {pattern.statisticalSignificance && (
                          <span>Significance: {pattern.statisticalSignificance.toFixed(4)}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Eye className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No pattern detection results available</p>
                  <p className="text-sm">Patterns will appear here when agents detect anomalies or signals</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="communication">
          <Card>
            <CardHeader>
              <CardTitle>Agent Communication</CardTitle>
              <CardDescription>Inter-agent messaging, coordination protocols, and data exchange</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <div className="flex items-center space-x-3 p-3 border rounded-lg">
                  <MessageSquare className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="font-medium">Event-Driven</p>
                    <p className="text-sm text-muted-foreground">Asynchronous pub/sub</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 border rounded-lg">
                  <GitBranch className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="font-medium">Request-Response</p>
                    <p className="text-sm text-muted-foreground">Synchronous API calls</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 border rounded-lg">
                  <Network className="h-5 w-5 text-purple-600" />
                  <div>
                    <p className="font-medium">Broadcast</p>
                    <p className="text-sm text-muted-foreground">System-wide updates</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 border rounded-lg">
                  <Users className="h-5 w-5 text-orange-600" />
                  <div>
                    <p className="font-medium">Negotiation</p>
                    <p className="text-sm text-muted-foreground">Multi-agent consensus</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 text-center text-muted-foreground">
                <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Communication events: {(analytics as any)?.communicationEvents || 0}</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="resources">
          <Card>
            <CardHeader>
              <CardTitle>Resource Management</CardTitle>
              <CardDescription>Dynamic resource allocation and utilization monitoring</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <div className="p-3 border rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Total Allocations</span>
                    <Cpu className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <p className="text-2xl font-bold">{(analytics as any)?.resourceUtilization?.totalAllocations || 0}</p>
                </div>
                <div className="p-3 border rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Avg Efficiency</span>
                    <BarChart3 className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <p className="text-2xl font-bold">
                    {((analytics as any)?.resourceUtilization?.averageEfficiency * 100)?.toFixed(0) || 0}%
                  </p>
                </div>
                <div className="p-3 border rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Peak Utilization</span>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <p className="text-2xl font-bold">
                    {((analytics as any)?.resourceUtilization?.peakUtilization * 100)?.toFixed(0) || 0}%
                  </p>
                </div>
              </div>

              <div className="mt-6">
                <h4 className="font-medium mb-3">Resource Types</h4>
                <div className="grid gap-2 md:grid-cols-5">
                  {['CPU', 'MEMORY', 'GPU', 'NETWORK', 'STORAGE'].map((resource) => (
                    <div key={resource} className="text-center p-2 border rounded">
                      <Database className="h-4 w-4 mx-auto mb-1 text-muted-foreground" />
                      <span className="text-sm font-medium">{resource}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}