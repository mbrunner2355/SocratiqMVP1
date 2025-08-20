import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Slider } from '@/components/ui/slider';
import { 
  Network,
  Brain,
  Layers,
  Target,
  Activity,
  BarChart3,
  Settings,
  Play,
  Pause,
  RefreshCw,
  Search,
  Filter,
  Eye,
  Zap,
  Clock,
  TrendingUp,
  GitBranch,
  Database,
  Server,
  Cpu,
  Memory,
  Globe,
  Link,
  Share2,
  Workflow,
  AlertCircle,
  CheckCircle,
  MapPin,
  Microscope,
  Gauge,
  Users,
  FileText,
  Code,
  Shuffle,
  Route,
  Compass
} from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';

interface GraphNeuralNetwork {
  id: string;
  name: string;
  architecture: 'GCN' | 'GAT' | 'GraphSAGE' | 'GIN' | 'Custom';
  status: 'active' | 'training' | 'inactive' | 'error';
  domain: string;
  node_count: number;
  edge_count: number;
  embedding_dimension: number;
  layers: number;
  attention_heads?: number;
  temporal_support: boolean;
  multi_scale: boolean;
  performance_metrics: {
    training_accuracy: number;
    validation_accuracy: number;
    inference_latency: number;
    memory_usage: string;
    throughput: number;
  };
  capabilities: {
    link_prediction: boolean;
    node_classification: boolean;
    graph_clustering: boolean;
    anomaly_detection: boolean;
    cross_domain_reasoning: boolean;
    causal_inference: boolean;
    counterfactual_simulation: boolean;
  };
  created_at: string;
  last_trained: string;
}

interface NodeEmbedding {
  node_id: string;
  entity_type: string;
  embedding_vector: number[];
  initial_features: {
    attributes: Record<string, any>;
    text_embeddings: number[];
    domain_metadata: Record<string, any>;
  };
  temporal_embeddings: Array<{
    timestamp: string;
    embedding: number[];
    relationship_changes: number;
  }>;
  local_neighborhood: {
    size: number;
    density: number;
    clustering_coefficient: number;
  };
  global_position: {
    centrality_score: number;
    community_id: string;
    influence_score: number;
  };
}

interface InferenceTask {
  id: string;
  task_type: 'link_prediction' | 'node_classification' | 'graph_clustering' | 'anomaly_detection';
  gnn_id: string;
  input_data: any;
  results: {
    predictions: any[];
    confidence_scores: number[];
    explanation: string;
    processing_time: number;
  };
  status: 'running' | 'completed' | 'failed';
  created_at: string;
  completed_at?: string;
}

interface CrossDomainQuery {
  id: string;
  query_description: string;
  source_domains: string[];
  target_domains: string[];
  traversal_path: Array<{
    domain: string;
    node_type: string;
    relationship_type: string;
  }>;
  semantic_bridges: Array<{
    source_concept: string;
    target_concept: string;
    alignment_score: number;
    bridge_type: 'synonym' | 'hypernym' | 'related';
  }>;
  results: {
    matched_entities: number;
    confidence_score: number;
    reasoning_steps: string[];
    causal_relationships: Array<{
      cause: string;
      effect: string;
      strength: number;
      temporal_lag: number;
    }>;
  };
  execution_time: number;
  timestamp: string;
}

interface ScalabilityMetrics {
  distributed_storage: {
    shard_count: number;
    total_nodes: number;
    storage_efficiency: number;
    replication_factor: number;
    query_latency_p95: number;
  };
  high_availability: {
    uptime_percentage: number;
    failover_time: number;
    snapshot_frequency: string;
    regions: string[];
    auto_rebalancing: boolean;
  };
  performance: {
    queries_per_second: number;
    concurrent_users: number;
    cache_hit_rate: number;
    memory_utilization: number;
    cpu_utilization: number;
  };
}

export default function GraphNeuralNetworkManager() {
  const [selectedTab, setSelectedTab] = useState('overview');
  const [selectedGNN, setSelectedGNN] = useState<string>('');
  const [embeddingDimension, setEmbeddingDimension] = useState([128]);
  const [inferenceTask, setInferenceTask] = useState('link_prediction');
  const [queryDomains, setQueryDomains] = useState<string[]>([]);
  const queryClient = useQueryClient();

  const { data: gnns = [], isLoading: gnnsLoading } = useQuery<GraphNeuralNetwork[]>({
    queryKey: ['/api/gnn/networks'],
  });

  const { data: nodeEmbeddings = [] } = useQuery<NodeEmbedding[]>({
    queryKey: ['/api/gnn/node-embeddings', selectedGNN],
  });

  const { data: inferenceTasks = [] } = useQuery<InferenceTask[]>({
    queryKey: ['/api/gnn/inference-tasks'],
  });

  const { data: crossDomainQueries = [] } = useQuery<CrossDomainQuery[]>({
    queryKey: ['/api/gnn/cross-domain-queries'],
  });

  const { data: scalabilityMetrics } = useQuery<ScalabilityMetrics>({
    queryKey: ['/api/gnn/scalability-metrics'],
  });

  const { data: systemHealth } = useQuery({
    queryKey: ['/api/gnn/system-health'],
  });

  const trainGNNMutation = useMutation({
    mutationFn: async (data: any) => apiRequest('/api/gnn/train', {
      method: 'POST',
      body: JSON.stringify(data)
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/gnn/networks'] });
    }
  });

  const runInferenceMutation = useMutation({
    mutationFn: async (data: any) => apiRequest('/api/gnn/inference', {
      method: 'POST',
      body: JSON.stringify(data)
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/gnn/inference-tasks'] });
    }
  });

  const executeCrossDomainQueryMutation = useMutation({
    mutationFn: async (data: any) => apiRequest('/api/gnn/cross-domain-query', {
      method: 'POST',
      body: JSON.stringify(data)
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/gnn/cross-domain-queries'] });
    }
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'training': return 'bg-yellow-100 text-yellow-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'error': case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  const getArchitectureIcon = (architecture: string) => {
    switch (architecture) {
      case 'GCN': return Network;
      case 'GAT': return Brain;
      case 'GraphSAGE': return Layers;
      case 'GIN': return Target;
      default: return Cpu;
    }
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  if (gnnsLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-2 mb-6">
          <Network className="h-6 w-6 text-blue-600" />
          <h1 className="text-3xl font-bold">Graph Neural Network Pipeline</h1>
        </div>
        <div className="h-96 bg-gray-200 animate-pulse rounded-lg" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Network className="h-6 w-6 text-blue-600" />
          <h1 className="text-3xl font-bold">Graph Neural Network Pipeline</h1>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button size="sm">
            <Play className="h-4 w-4 mr-2" />
            Train GNN
          </Button>
        </div>
      </div>

      {/* System Overview */}
      {systemHealth && (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active GNNs</CardTitle>
              <Network className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{gnns.filter(g => g.status === 'active').length}</div>
              <p className="text-xs text-muted-foreground">
                {gnns.length} total networks
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Nodes</CardTitle>
              <MapPin className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {gnns.reduce((sum, g) => sum + g.node_count, 0).toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                Across all graphs
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Inference Tasks</CardTitle>
              <Brain className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{inferenceTasks.length}</div>
              <p className="text-xs text-muted-foreground">
                {inferenceTasks.filter(t => t.status === 'running').length} running
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Query Latency</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{scalabilityMetrics?.distributed_storage.query_latency_p95}ms</div>
              <p className="text-xs text-muted-foreground">
                P95 response time
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Cross-Domain Queries</CardTitle>
              <Share2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{crossDomainQueries.length}</div>
              <p className="text-xs text-muted-foreground">
                Multi-graph reasoning
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="embeddings">Node Embeddings</TabsTrigger>
          <TabsTrigger value="inference">Inference</TabsTrigger>
          <TabsTrigger value="cross-domain">Cross-Domain</TabsTrigger>
          <TabsTrigger value="scalability">Scalability</TabsTrigger>
          <TabsTrigger value="training">Training</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {gnns.map((gnn) => {
              const ArchIcon = getArchitectureIcon(gnn.architecture);
              return (
                <Card key={gnn.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <ArchIcon className="h-5 w-5 text-blue-600" />
                        <CardTitle className="text-lg">{gnn.name}</CardTitle>
                        <Badge variant="outline" className="text-xs">
                          {gnn.architecture}
                        </Badge>
                      </div>
                      <Badge className={getStatusColor(gnn.status)}>
                        {gnn.status}
                      </Badge>
                    </div>
                    <CardDescription>
                      {gnn.domain} • {gnn.node_count.toLocaleString()} nodes • {gnn.edge_count.toLocaleString()} edges
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Embedding Dim:</span>
                        <div className="font-medium">{gnn.embedding_dimension}D</div>
                      </div>
                      <div>
                        <span className="text-gray-600">Layers:</span>
                        <div className="font-medium">{gnn.layers}</div>
                      </div>
                      <div>
                        <span className="text-gray-600">Training Acc:</span>
                        <div className="font-medium">{gnn.performance_metrics.training_accuracy.toFixed(1)}%</div>
                      </div>
                      <div>
                        <span className="text-gray-600">Inference:</span>
                        <div className="font-medium">{gnn.performance_metrics.inference_latency}ms</div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-3 w-3 text-green-600" />
                        <span className="text-xs">Temporal Support: {gnn.temporal_support ? 'Yes' : 'No'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-3 w-3 text-green-600" />
                        <span className="text-xs">Multi-Scale: {gnn.multi_scale ? 'Yes' : 'No'}</span>
                      </div>
                    </div>

                    <div>
                      <span className="text-sm font-medium text-gray-700">Capabilities:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {Object.entries(gnn.capabilities)
                          .filter(([_, enabled]) => enabled)
                          .map(([capability]) => (
                            <Badge key={capability} variant="outline" className="text-xs">
                              {capability.replace('_', ' ')}
                            </Badge>
                          ))}
                      </div>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Button variant="outline" size="sm">
                        <Play className="h-4 w-4 mr-2" />
                        Run Inference
                      </Button>
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-2" />
                        Visualize
                      </Button>
                      <Button variant="outline" size="sm">
                        <Settings className="h-4 w-4 mr-2" />
                        Configure
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Performance Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                GNN Performance Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {((gnns.reduce((sum, g) => sum + g.performance_metrics.training_accuracy, 0) / gnns.length) || 0).toFixed(1)}%
                  </div>
                  <div className="text-sm text-gray-600">Avg Training Accuracy</div>
                  <div className="text-xs text-green-600">↑ 2.3% vs last week</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {((gnns.reduce((sum, g) => sum + g.performance_metrics.validation_accuracy, 0) / gnns.length) || 0).toFixed(1)}%
                  </div>
                  <div className="text-sm text-gray-600">Avg Validation Accuracy</div>
                  <div className="text-xs text-green-600">↑ 1.8% vs last week</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">
                    {((gnns.reduce((sum, g) => sum + g.performance_metrics.inference_latency, 0) / gnns.length) || 0).toFixed(0)}ms
                  </div>
                  <div className="text-sm text-gray-600">Avg Inference Latency</div>
                  <div className="text-xs text-green-600">↓ 15ms vs last week</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {gnns.reduce((sum, g) => sum + g.performance_metrics.throughput, 0).toFixed(0)}
                  </div>
                  <div className="text-sm text-gray-600">Total Throughput/sec</div>
                  <div className="text-xs text-green-600">↑ 12% vs last week</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="embeddings" className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Select value={selectedGNN} onValueChange={setSelectedGNN}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Select GNN" />
                </SelectTrigger>
                <SelectContent>
                  {gnns.map((gnn) => (
                    <SelectItem key={gnn.id} value={gnn.id}>
                      {gnn.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <div className="flex items-center gap-2">
                <span className="text-sm">Embedding Dimension:</span>
                <div className="w-32">
                  <Slider
                    value={embeddingDimension}
                    onValueChange={setEmbeddingDimension}
                    max={512}
                    min={64}
                    step={32}
                  />
                </div>
                <span className="text-sm font-medium">{embeddingDimension[0]}D</span>
              </div>
            </div>
            <Button variant="outline" size="sm">
              <Zap className="h-4 w-4 mr-2" />
              Generate Embeddings
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Node Embedding Pipeline */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Layers className="h-5 w-5" />
                  Node Embedding Pipeline
                </CardTitle>
                <CardDescription>Multi-layer processing with temporal dynamics</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 border rounded-lg">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <FileText className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <div className="font-medium text-sm">Initial Features</div>
                      <div className="text-xs text-gray-600">Entity attributes, text embeddings, domain metadata</div>
                    </div>
                    <Badge variant="outline" className="ml-auto">Active</Badge>
                  </div>

                  <div className="flex items-center gap-3 p-3 border rounded-lg">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <Network className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <div className="font-medium text-sm">Graph Convolution</div>
                      <div className="text-xs text-gray-600">Multi-layer GCN with attention mechanisms</div>
                    </div>
                    <Badge variant="outline" className="ml-auto">Active</Badge>
                  </div>

                  <div className="flex items-center gap-3 p-3 border rounded-lg">
                    <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                      <Clock className="h-4 w-4 text-orange-600" />
                    </div>
                    <div>
                      <div className="font-medium text-sm">Temporal Dynamics</div>
                      <div className="text-xs text-gray-600">Time-aware embeddings for evolving relationships</div>
                    </div>
                    <Badge variant="outline" className="ml-auto">Active</Badge>
                  </div>

                  <div className="flex items-center gap-3 p-3 border rounded-lg">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                      <Compass className="h-4 w-4 text-purple-600" />
                    </div>
                    <div>
                      <div className="font-medium text-sm">Multi-Scale</div>
                      <div className="text-xs text-gray-600">Local neighborhood and global graph structure</div>
                    </div>
                    <Badge variant="outline" className="ml-auto">Active</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Embedding Analysis */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Microscope className="h-5 w-5" />
                  Embedding Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-80">
                  <div className="space-y-3">
                    {nodeEmbeddings.slice(0, 10).map((embedding) => (
                      <div key={embedding.node_id} className="p-3 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <div className="font-medium text-sm">Node {embedding.node_id}</div>
                            <div className="text-xs text-gray-600">{embedding.entity_type}</div>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {embedding.embedding_vector.length}D
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 text-xs">
                          <div>
                            <span className="text-gray-600">Centrality:</span>
                            <span className="ml-1 font-medium">{embedding.global_position.centrality_score.toFixed(3)}</span>
                          </div>
                          <div>
                            <span className="text-gray-600">Influence:</span>
                            <span className="ml-1 font-medium">{embedding.global_position.influence_score.toFixed(3)}</span>
                          </div>
                          <div>
                            <span className="text-gray-600">Neighbors:</span>
                            <span className="ml-1 font-medium">{embedding.local_neighborhood.size}</span>
                          </div>
                          <div>
                            <span className="text-gray-600">Clustering:</span>
                            <span className="ml-1 font-medium">{embedding.local_neighborhood.clustering_coefficient.toFixed(3)}</span>
                          </div>
                        </div>

                        {embedding.temporal_embeddings && embedding.temporal_embeddings.length > 0 && (
                          <div className="mt-2 pt-2 border-t">
                            <div className="text-xs text-gray-600">
                              Temporal changes: {embedding.temporal_embeddings.length} snapshots
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="inference" className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Select value={inferenceTask} onValueChange={setInferenceTask}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="link_prediction">Link Prediction</SelectItem>
                  <SelectItem value="node_classification">Node Classification</SelectItem>
                  <SelectItem value="graph_clustering">Graph Clustering</SelectItem>
                  <SelectItem value="anomaly_detection">Anomaly Detection</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button 
              onClick={() => runInferenceMutation.mutate({ 
                task_type: inferenceTask, 
                gnn_id: selectedGNN 
              })}
              disabled={runInferenceMutation.isPending || !selectedGNN}
            >
              <Play className="h-4 w-4 mr-2" />
              Run Inference
            </Button>
          </div>

          {/* Inference Capabilities */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Link className="h-4 w-4 text-blue-600" />
                  Link Prediction
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-gray-600 mb-2">
                  Predict missing relationships between entities based on graph structure and node features.
                </div>
                <div className="flex justify-between text-xs">
                  <span>Accuracy:</span>
                  <span className="font-medium">94.2%</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span>Precision:</span>
                  <span className="font-medium">91.8%</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Target className="h-4 w-4 text-green-600" />
                  Node Classification
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-gray-600 mb-2">
                  Classify entity types and predict node attributes using neighborhood information.
                </div>
                <div className="flex justify-between text-xs">
                  <span>Accuracy:</span>
                  <span className="font-medium">89.7%</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span>F1 Score:</span>
                  <span className="font-medium">87.3%</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Users className="h-4 w-4 text-purple-600" />
                  Graph Clustering
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-gray-600 mb-2">
                  Identify communities and modules through unsupervised learning approaches.
                </div>
                <div className="flex justify-between text-xs">
                  <span>Modularity:</span>
                  <span className="font-medium">0.847</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span>Communities:</span>
                  <span className="font-medium">23</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                  Anomaly Detection
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-gray-600 mb-2">
                  Detect unusual patterns and outliers in graph structure and node behavior.
                </div>
                <div className="flex justify-between text-xs">
                  <span>Detection Rate:</span>
                  <span className="font-medium">96.1%</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span>False Positives:</span>
                  <span className="font-medium">2.3%</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Inference Tasks */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Recent Inference Tasks
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {inferenceTasks.slice(0, 8).map((task) => (
                  <div key={task.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <div className="font-medium text-sm">
                        {task.task_type.replace('_', ' ').toUpperCase()}
                      </div>
                      <div className="text-xs text-gray-600">
                        {gnns.find(g => g.id === task.gnn_id)?.name} • {formatTimestamp(task.created_at)}
                      </div>
                      {task.results && (
                        <div className="text-xs text-gray-700 mt-1">
                          {task.results.predictions.length} predictions • {task.results.processing_time}ms
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {task.results && (
                        <Badge variant="outline" className="text-xs">
                          Conf: {(task.results.confidence_scores.reduce((a, b) => a + b, 0) / task.results.confidence_scores.length * 100).toFixed(0)}%
                        </Badge>
                      )}
                      <Badge className={getStatusColor(task.status)}>
                        {task.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cross-domain" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Share2 className="h-5 w-5" />
                Cross-Domain Reasoning Engine
              </CardTitle>
              <CardDescription>
                Meta-graph traversal and semantic bridging across domain vocabularies
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Route className="h-4 w-4 text-blue-600" />
                    <span className="font-medium text-sm">Meta-Graph Traversal</span>
                  </div>
                  <div className="text-xs text-gray-600">
                    Execute queries spanning multiple domain graphs with intelligent path planning.
                  </div>
                  <div className="mt-2 flex justify-between text-xs">
                    <span>Avg Hops:</span>
                    <span className="font-medium">3.2</span>
                  </div>
                </div>

                <div className="p-4 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <GitBranch className="h-4 w-4 text-green-600" />
                    <span className="font-medium text-sm">Semantic Bridging</span>
                  </div>
                  <div className="text-xs text-gray-600">
                    Align concepts across different vocabularies and ontologies.
                  </div>
                  <div className="mt-2 flex justify-between text-xs">
                    <span>Alignment Score:</span>
                    <span className="font-medium">0.89</span>
                  </div>
                </div>

                <div className="p-4 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="h-4 w-4 text-purple-600" />
                    <span className="font-medium text-sm">Causal Inference</span>
                  </div>
                  <div className="text-xs text-gray-600">
                    Analyze temporal relationships and causal patterns across domains.
                  </div>
                  <div className="mt-2 flex justify-between text-xs">
                    <span>Causal Links:</span>
                    <span className="font-medium">1,247</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Cross-Domain Query Results */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Cross-Domain Queries</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {crossDomainQueries.slice(0, 6).map((query) => (
                  <div key={query.id} className="p-4 border rounded-lg space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="font-medium text-sm">{query.query_description}</div>
                        <div className="text-xs text-gray-600 mt-1">
                          {query.source_domains.join(' → ')} to {query.target_domains.join(', ')}
                        </div>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {query.execution_time}ms
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-xs">
                      <div>
                        <span className="text-gray-600">Matched Entities:</span>
                        <span className="ml-2 font-medium">{query.results.matched_entities}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Confidence:</span>
                        <span className="ml-2 font-medium">{(query.results.confidence_score * 100).toFixed(1)}%</span>
                      </div>
                    </div>

                    {query.semantic_bridges.length > 0 && (
                      <div>
                        <span className="text-xs font-medium text-gray-700">Semantic Bridges:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {query.semantic_bridges.slice(0, 3).map((bridge, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {bridge.source_concept} → {bridge.target_concept}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {query.results.causal_relationships.length > 0 && (
                      <div>
                        <span className="text-xs font-medium text-gray-700">Causal Relationships:</span>
                        <div className="space-y-1 mt-1">
                          {query.results.causal_relationships.slice(0, 2).map((rel, index) => (
                            <div key={index} className="text-xs text-gray-600">
                              {rel.cause} → {rel.effect} (strength: {rel.strength.toFixed(2)})
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="scalability" className="space-y-6">
          {scalabilityMetrics && (
            <>
              {/* Distributed Storage */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="h-5 w-5" />
                    Distributed Storage & Indexing
                  </CardTitle>
                  <CardDescription>
                    Sharded graph stores with incremental-update pipelines
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {scalabilityMetrics.distributed_storage.shard_count}
                      </div>
                      <div className="text-sm text-gray-600">Active Shards</div>
                      <div className="text-xs text-gray-500">Distributed across regions</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {(scalabilityMetrics.distributed_storage.total_nodes / 1000000).toFixed(1)}M
                      </div>
                      <div className="text-sm text-gray-600">Total Nodes</div>
                      <div className="text-xs text-gray-500">Across all shards</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600">
                        {scalabilityMetrics.distributed_storage.query_latency_p95}ms
                      </div>
                      <div className="text-sm text-gray-600">Query Latency P95</div>
                      <div className="text-xs text-gray-500">Sub-second response</div>
                    </div>
                  </div>

                  <div className="mt-6 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Storage Efficiency</span>
                      <span className="text-sm font-medium">{scalabilityMetrics.distributed_storage.storage_efficiency}%</span>
                    </div>
                    <Progress value={scalabilityMetrics.distributed_storage.storage_efficiency} className="h-2" />

                    <div className="flex justify-between items-center">
                      <span className="text-sm">Replication Factor</span>
                      <span className="text-sm font-medium">{scalabilityMetrics.distributed_storage.replication_factor}x</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* High Availability */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="h-5 w-5" />
                    High Availability & Resilience
                  </CardTitle>
                  <CardDescription>
                    Multi-region failover with automated rebalancing
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <div className="text-2xl font-bold text-green-600 mb-2">
                        {scalabilityMetrics.high_availability.uptime_percentage.toFixed(2)}%
                      </div>
                      <div className="text-sm text-gray-600">System Uptime</div>
                      <div className="text-xs text-gray-500">
                        Last 30 days • Target: 99.99%
                      </div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-blue-600 mb-2">
                        {scalabilityMetrics.high_availability.failover_time}ms
                      </div>
                      <div className="text-sm text-gray-600">Failover Time</div>
                      <div className="text-xs text-gray-500">
                        Automatic recovery
                      </div>
                    </div>
                  </div>

                  <div className="mt-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm">Active Regions</span>
                      <span className="text-sm font-medium">{scalabilityMetrics.high_availability.regions.length}</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {scalabilityMetrics.high_availability.regions.map((region) => (
                        <Badge key={region} variant="outline" className="text-xs">
                          {region}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="mt-4">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Auto-rebalancing: {scalabilityMetrics.high_availability.auto_rebalancing ? 'Enabled' : 'Disabled'}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Snapshot Frequency: {scalabilityMetrics.high_availability.snapshot_frequency}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Performance Metrics */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Gauge className="h-5 w-5" />
                    Performance Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">
                        {scalabilityMetrics.performance.queries_per_second.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-600">Queries/Second</div>
                      <div className="text-xs text-green-600">Peak throughput</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {scalabilityMetrics.performance.concurrent_users.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-600">Concurrent Users</div>
                      <div className="text-xs text-gray-500">Active connections</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600">
                        {scalabilityMetrics.performance.cache_hit_rate.toFixed(1)}%
                      </div>
                      <div className="text-sm text-gray-600">Cache Hit Rate</div>
                      <div className="text-xs text-gray-500">Query acceleration</div>
                    </div>
                  </div>

                  <div className="mt-6 space-y-4">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm">Memory Utilization</span>
                        <span className="text-sm font-medium">{scalabilityMetrics.performance.memory_utilization}%</span>
                      </div>
                      <Progress value={scalabilityMetrics.performance.memory_utilization} className="h-2" />
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm">CPU Utilization</span>
                        <span className="text-sm font-medium">{scalabilityMetrics.performance.cpu_utilization}%</span>
                      </div>
                      <Progress value={scalabilityMetrics.performance.cpu_utilization} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>

        <TabsContent value="training" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Train New Graph Neural Network</CardTitle>
              <CardDescription>Configure and train custom GNN architectures</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Network Name</label>
                  <Input placeholder="My Custom GNN" />
                </div>
                <div>
                  <label className="text-sm font-medium">Architecture</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select architecture" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="GCN">Graph Convolutional Network</SelectItem>
                      <SelectItem value="GAT">Graph Attention Network</SelectItem>
                      <SelectItem value="GraphSAGE">GraphSAGE</SelectItem>
                      <SelectItem value="GIN">Graph Isomorphism Network</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium">Embedding Dimension</label>
                  <Slider defaultValue={[128]} max={512} min={32} step={32} />
                  <div className="text-xs text-gray-600 mt-1">128D</div>
                </div>
                <div>
                  <label className="text-sm font-medium">Number of Layers</label>
                  <Slider defaultValue={[3]} max={8} min={1} step={1} />
                  <div className="text-xs text-gray-600 mt-1">3 layers</div>
                </div>
                <div>
                  <label className="text-sm font-medium">Attention Heads</label>
                  <Slider defaultValue={[8]} max={16} min={1} step={1} />
                  <div className="text-xs text-gray-600 mt-1">8 heads</div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <span className="text-sm font-medium">Capabilities</span>
                  <div className="space-y-2">
                    {[
                      'Link Prediction',
                      'Node Classification', 
                      'Graph Clustering',
                      'Anomaly Detection',
                      'Temporal Support',
                      'Multi-Scale'
                    ].map((capability) => (
                      <label key={capability} className="flex items-center space-x-2">
                        <input type="checkbox" defaultChecked className="rounded" />
                        <span className="text-sm">{capability}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <span className="text-sm font-medium">Training Configuration</span>
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs">Learning Rate</label>
                      <Input defaultValue="0.001" type="number" step="0.0001" />
                    </div>
                    <div>
                      <label className="text-xs">Epochs</label>
                      <Input defaultValue="100" type="number" />
                    </div>
                    <div>
                      <label className="text-xs">Batch Size</label>
                      <Input defaultValue="32" type="number" />
                    </div>
                  </div>
                </div>
              </div>

              <Button 
                onClick={() => trainGNNMutation.mutate({})}
                disabled={trainGNNMutation.isPending}
                className="w-full"
              >
                {trainGNNMutation.isPending ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Training...
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 mr-2" />
                    Start Training
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