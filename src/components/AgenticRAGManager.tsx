import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { 
  Bot, 
  Brain, 
  Network, 
  Clock, 
  Zap, 
  Activity, 
  GitBranch, 
  Search, 
  MessageSquare,
  FileText,
  Database,
  TrendingUp,
  Target,
  Settings,
  Play,
  Pause,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  XCircle,
  Timer,
  Layers,
  Share2,
  BarChart3,
  Eye,
  Cpu
} from 'lucide-react';

interface TemporalAgent {
  id: string;
  name: string;
  type: 'retrieval' | 'reasoning' | 'generation' | 'validation' | 'temporal' | 'graph_neural';
  status: 'active' | 'inactive' | 'processing' | 'learning' | 'error';
  description: string;
  capabilities: string[];
  temporalWindow: string;
  graphConnections: number;
  knowledgeGraphs: string[];
  neuralArchitecture: string;
  memorySize: string;
  lastActive: string;
  performance: {
    accuracy: number;
    latency: number;
    throughput: number;
    reasoning_depth: number;
  };
  temporalPatterns: {
    seasonal_trends: boolean;
    temporal_causality: boolean;
    time_series_prediction: boolean;
    event_sequence_modeling: boolean;
  };
}

interface RAGSession {
  id: string;
  query: string;
  agents_involved: string[];
  status: 'processing' | 'completed' | 'failed';
  temporal_context: string;
  retrieved_knowledge: number;
  reasoning_steps: number;
  confidence: number;
  response_quality: number;
  processing_time: number;
  created_at: string;
}

interface KnowledgeGraph {
  id: string;
  name: string;
  type: 'temporal' | 'causal' | 'semantic' | 'hierarchical';
  nodes: number;
  edges: number;
  temporal_layers: number;
  last_updated: string;
  domains: string[];
  graph_neural_network: {
    architecture: string;
    layers: number;
    parameters: string;
    performance: number;
  };
}

export default function AgenticRAGManager() {
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [agentFilter, setAgentFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const { data: temporalAgents = [], isLoading: agentsLoading } = useQuery<TemporalAgent[]>({
    queryKey: ['/api/agentic-rag/temporal-agents'],
  });

  const { data: ragSessions = [], isLoading: sessionsLoading } = useQuery<RAGSession[]>({
    queryKey: ['/api/agentic-rag/sessions'],
  });

  const { data: knowledgeGraphs = [], isLoading: graphsLoading } = useQuery<KnowledgeGraph[]>({
    queryKey: ['/api/agentic-rag/knowledge-graphs'],
  });

  const { data: metrics } = useQuery<any>({
    queryKey: ['/api/agentic-rag/metrics'],
  });

  const filteredAgents = temporalAgents.filter(agent => {
    const matchesSearch = agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         agent.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = agentFilter === 'all' || agent.type === agentFilter;
    const matchesStatus = statusFilter === 'all' || agent.status === statusFilter;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'processing': return 'bg-blue-500';
      case 'learning': return 'bg-purple-500';
      case 'inactive': return 'bg-gray-500';
      case 'error': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="h-4 w-4" />;
      case 'processing': return <RefreshCw className="h-4 w-4 animate-spin" />;
      case 'learning': return <Brain className="h-4 w-4" />;
      case 'inactive': return <Pause className="h-4 w-4" />;
      case 'error': return <XCircle className="h-4 w-4" />;
      default: return <AlertCircle className="h-4 w-4" />;
    }
  };

  const getAgentTypeIcon = (type: string) => {
    switch (type) {
      case 'retrieval': return <Search className="h-5 w-5" />;
      case 'reasoning': return <Brain className="h-5 w-5" />;
      case 'generation': return <MessageSquare className="h-5 w-5" />;
      case 'validation': return <CheckCircle className="h-5 w-5" />;
      case 'temporal': return <Clock className="h-5 w-5" />;
      case 'graph_neural': return <Network className="h-5 w-5" />;
      default: return <Bot className="h-5 w-5" />;
    }
  };

  if (agentsLoading || sessionsLoading || graphsLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-2 mb-6">
          <Bot className="h-6 w-6 text-purple-600" />
          <h1 className="text-3xl font-bold">Agentic RAG & Temporal Knowledge</h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 bg-gray-200 animate-pulse rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bot className="h-6 w-6 text-purple-600" />
          <h1 className="text-3xl font-bold">Agentic RAG & Temporal Knowledge</h1>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Network className="h-4 w-4 mr-2" />
            Graph Neural Network
          </Button>
          <Button>
            <Brain className="h-4 w-4 mr-2" />
            Create Temporal Agent
          </Button>
        </div>
      </div>

      {/* Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Temporal Agents</p>
                <p className="text-2xl font-bold">{temporalAgents.length}</p>
              </div>
              <Clock className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Knowledge Graphs</p>
                <p className="text-2xl font-bold text-blue-600">{knowledgeGraphs.length}</p>
              </div>
              <Network className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Sessions</p>
                <p className="text-2xl font-bold text-green-600">{ragSessions.filter(s => s.status === 'processing').length}</p>
              </div>
              <Activity className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Reasoning Depth</p>
                <p className="text-2xl font-bold text-orange-600">{metrics?.avgReasoningDepth || 0}</p>
              </div>
              <Layers className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="agents" className="space-y-4">
        <TabsList>
          <TabsTrigger value="agents">Temporal Agents</TabsTrigger>
          <TabsTrigger value="graphs">Knowledge Graphs</TabsTrigger>
          <TabsTrigger value="sessions">RAG Sessions</TabsTrigger>
          <TabsTrigger value="neural">Graph Neural Networks</TabsTrigger>
        </TabsList>

        <TabsContent value="agents" className="space-y-4">
          {/* Filters */}
          <div className="flex gap-4 items-center flex-wrap">
            <Input
              placeholder="Search temporal agents..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
            <Select value={agentFilter} onValueChange={setAgentFilter}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="retrieval">Retrieval</SelectItem>
                <SelectItem value="reasoning">Reasoning</SelectItem>
                <SelectItem value="generation">Generation</SelectItem>
                <SelectItem value="validation">Validation</SelectItem>
                <SelectItem value="temporal">Temporal</SelectItem>
                <SelectItem value="graph_neural">Graph Neural</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="learning">Learning</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="error">Error</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Temporal Agents Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredAgents.map((agent) => (
              <Card key={agent.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getAgentTypeIcon(agent.type)}
                      <CardTitle className="text-lg">{agent.name}</CardTitle>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${getStatusColor(agent.status)}`} />
                      {getStatusIcon(agent.status)}
                    </div>
                  </div>
                  <CardDescription className="text-sm">
                    {agent.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Type:</span>
                    <Badge variant="outline">{agent.type}</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Temporal Window:</span>
                    <Badge variant="secondary">{agent.temporalWindow}</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Graph Connections:</span>
                    <span className="font-medium">{agent.graphConnections}</span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Neural Architecture:</span>
                    <span className="font-medium text-xs">{agent.neuralArchitecture}</span>
                  </div>

                  {/* Performance Metrics */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Accuracy</span>
                      <span>{agent.performance.accuracy}%</span>
                    </div>
                    <Progress value={agent.performance.accuracy} className="h-2" />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Reasoning Depth</span>
                      <span>{agent.performance.reasoning_depth}</span>
                    </div>
                    <Progress value={agent.performance.reasoning_depth * 10} className="h-2" />
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Latency:</span>
                    <span className="font-medium">{agent.performance.latency}ms</span>
                  </div>

                  {/* Temporal Patterns */}
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Temporal Capabilities:</p>
                    <div className="flex flex-wrap gap-1">
                      {agent.temporalPatterns.seasonal_trends && (
                        <Badge variant="outline" className="text-xs">Seasonal</Badge>
                      )}
                      {agent.temporalPatterns.temporal_causality && (
                        <Badge variant="outline" className="text-xs">Causality</Badge>
                      )}
                      {agent.temporalPatterns.time_series_prediction && (
                        <Badge variant="outline" className="text-xs">Prediction</Badge>
                      )}
                      {agent.temporalPatterns.event_sequence_modeling && (
                        <Badge variant="outline" className="text-xs">Sequences</Badge>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button size="sm" variant="outline" className="flex-1">
                      <Settings className="h-4 w-4 mr-1" />
                      Configure
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1">
                      {agent.status === 'active' ? (
                        <>
                          <Pause className="h-4 w-4 mr-1" />
                          Pause
                        </>
                      ) : (
                        <>
                          <Play className="h-4 w-4 mr-1" />
                          Activate
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="graphs" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {knowledgeGraphs.map((graph) => (
              <Card key={graph.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Network className="h-5 w-5" />
                      {graph.name}
                    </CardTitle>
                    <Badge>{graph.type}</Badge>
                  </div>
                  <CardDescription>
                    Temporal layers: {graph.temporal_layers} | Nodes: {graph.nodes} | Edges: {graph.edges}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">GNN Architecture:</span>
                      <p className="font-medium">{graph.graph_neural_network.architecture}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Performance:</span>
                      <p className="font-medium">{graph.graph_neural_network.performance}%</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Parameters:</span>
                      <p className="font-medium">{graph.graph_neural_network.parameters}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Layers:</span>
                      <p className="font-medium">{graph.graph_neural_network.layers}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <Eye className="h-4 w-4 mr-1" />
                      Visualize
                    </Button>
                    <Button size="sm" variant="outline">
                      <RefreshCw className="h-4 w-4 mr-1" />
                      Update
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="sessions" className="space-y-4">
          <div className="space-y-4">
            {ragSessions.map((session) => (
              <Card key={session.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">{session.query.substring(0, 80)}...</CardTitle>
                    <Badge className={session.status === 'completed' ? 'bg-green-100 text-green-800' : 
                                    session.status === 'processing' ? 'bg-blue-100 text-blue-800' : 
                                    'bg-red-100 text-red-800'}>
                      {session.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Agents:</span>
                      <p className="font-medium">{session.agents_involved.length}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Knowledge Retrieved:</span>
                      <p className="font-medium">{session.retrieved_knowledge}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Reasoning Steps:</span>
                      <p className="font-medium">{session.reasoning_steps}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Processing Time:</span>
                      <p className="font-medium">{session.processing_time}ms</p>
                    </div>
                  </div>
                  {session.status === 'completed' && (
                    <div className="mt-4 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Confidence</span>
                        <span>{session.confidence}%</span>
                      </div>
                      <Progress value={session.confidence} className="h-2" />
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="neural" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Graph Neural Network Performance</CardTitle>
              <CardDescription>
                Advanced GNN architectures for temporal knowledge reasoning
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <Cpu className="h-12 w-12 mx-auto mb-2" />
                  <p>Graph Neural Network Analytics</p>
                  <p className="text-sm">Architecture performance and temporal pattern analysis</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}