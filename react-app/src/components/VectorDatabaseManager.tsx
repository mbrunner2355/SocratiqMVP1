import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { 
  Database,
  Search,
  Layers,
  Activity,
  BarChart3,
  Settings,
  RefreshCw,
  Target,
  Zap,
  Brain,
  Network,
  Clock,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  FileText,
  Filter,
  Eye,
  Play,
  Pause,
  Server
} from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';

interface VectorCollection {
  id: string;
  name: string;
  description: string;
  embedding_model: string;
  dimension: number;
  vector_count: number;
  index_type: string;
  distance_metric: 'cosine' | 'euclidean' | 'dot_product';
  status: 'active' | 'indexing' | 'error';
  created_at: string;
  last_updated: string;
  metadata: {
    source_documents: number;
    avg_similarity_score: number;
    storage_size: string;
    query_performance: number;
  };
}

interface SemanticDatabase {
  id: string;
  name: string;
  type: 'knowledge_graph' | 'ontology' | 'taxonomy';
  schema_version: string;
  entity_count: number;
  relationship_count: number;
  reasoning_engine: string;
  status: 'active' | 'updating' | 'error';
  inference_capabilities: string[];
  last_reasoning_job: string;
  performance_metrics: {
    query_latency: number;
    inference_accuracy: number;
    memory_usage: string;
    throughput: number;
  };
}

interface EmbeddingModel {
  id: string;
  name: string;
  type: 'transformer' | 'sentence_transformer' | 'custom';
  provider: string;
  dimension: number;
  max_sequence_length: number;
  domain_specialization: string[];
  performance: {
    encoding_speed: number;
    accuracy_score: number;
    memory_footprint: string;
  };
  status: 'active' | 'loading' | 'error';
  usage_stats: {
    total_embeddings: number;
    daily_requests: number;
    avg_latency: number;
  };
}

interface SearchQuery {
  id: string;
  query_text: string;
  collection_id: string;
  query_type: 'semantic' | 'hybrid' | 'exact';
  results_count: number;
  latency: number;
  similarity_threshold: number;
  timestamp: string;
  performance_score: number;
}

export default function VectorDatabaseManager() {
  const [selectedTab, setSelectedTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCollection, setSelectedCollection] = useState<string>('');
  const [testQuery, setTestQuery] = useState('');
  const queryClient = useQueryClient();

  const { data: vectorCollections = [], isLoading: collectionsLoading } = useQuery<VectorCollection[]>({
    queryKey: ['/api/vector-db/collections'],
  });

  const { data: semanticDatabases = [] } = useQuery<SemanticDatabase[]>({
    queryKey: ['/api/semantic-db/databases'],
  });

  const { data: embeddingModels = [] } = useQuery<EmbeddingModel[]>({
    queryKey: ['/api/vector-db/embedding-models'],
  });

  const { data: recentQueries = [] } = useQuery<SearchQuery[]>({
    queryKey: ['/api/vector-db/recent-queries'],
  });

  const { data: systemMetrics } = useQuery({
    queryKey: ['/api/vector-db/metrics'],
  });

  const createCollectionMutation = useMutation({
    mutationFn: async (data: any) => apiRequest('/api/vector-db/collections', {
      method: 'POST',
      body: JSON.stringify(data)
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/vector-db/collections'] });
    }
  });

  const testSearchMutation = useMutation({
    mutationFn: async (data: any) => apiRequest('/api/vector-db/search', {
      method: 'POST',
      body: JSON.stringify(data)
    })
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'indexing': case 'updating': case 'loading': return 'bg-yellow-100 text-yellow-800';
      case 'error': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getMetricTrend = (value: number, baseline: number) => {
    if (value > baseline * 1.1) return { color: 'text-green-600', icon: TrendingUp };
    if (value < baseline * 0.9) return { color: 'text-red-600', icon: TrendingUp };
    return { color: 'text-gray-600', icon: TrendingUp };
  };

  if (collectionsLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-2 mb-6">
          <Database className="h-6 w-6 text-blue-600" />
          <h1 className="text-3xl font-bold">Vector & Semantic Databases</h1>
        </div>
        <div className="h-96 bg-gray-200 animate-pulse rounded-lg" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Database className="h-6 w-6 text-blue-600" />
          <h1 className="text-3xl font-bold">Vector & Semantic Databases</h1>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button size="sm">
            <Database className="h-4 w-4 mr-2" />
            New Collection
          </Button>
        </div>
      </div>

      {/* System Overview */}
      {systemMetrics && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Vector Collections</CardTitle>
              <Vector className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{vectorCollections.length}</div>
              <p className="text-xs text-muted-foreground">
                {vectorCollections.filter(c => c.status === 'active').length} active
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Vectors</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {vectorCollections.reduce((sum, c) => sum + c.vector_count, 0).toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                Across all collections
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Semantic Databases</CardTitle>
              <Brain className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{semanticDatabases.length}</div>
              <p className="text-xs text-muted-foreground">
                {semanticDatabases.filter(db => db.status === 'active').length} reasoning engines active
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Query Performance</CardTitle>
              <Zap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{systemMetrics.avgQueryLatency}ms</div>
              <p className="text-xs text-muted-foreground">
                Average response time
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="vector-collections">Vector Collections</TabsTrigger>
          <TabsTrigger value="semantic-db">Semantic Databases</TabsTrigger>
          <TabsTrigger value="embedding-models">Embedding Models</TabsTrigger>
          <TabsTrigger value="search-testing">Search Testing</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Vector Collections Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Vector className="h-5 w-5" />
                  Vector Collections
                </CardTitle>
                <CardDescription>High-dimensional vector storage and similarity search</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {vectorCollections.slice(0, 5).map((collection) => (
                  <div key={collection.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <div className="font-medium">{collection.name}</div>
                      <div className="text-sm text-gray-600">
                        {collection.dimension}D • {collection.vector_count.toLocaleString()} vectors
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(collection.status)}>
                        {collection.status}
                      </Badge>
                    </div>
                  </div>
                ))}
                <Button variant="outline" className="w-full">
                  View All Collections
                </Button>
              </CardContent>
            </Card>

            {/* Semantic Databases Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5" />
                  Semantic Databases
                </CardTitle>
                <CardDescription>Knowledge graphs and reasoning engines</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {semanticDatabases.slice(0, 5).map((database) => (
                  <div key={database.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <div className="font-medium">{database.name}</div>
                      <div className="text-sm text-gray-600">
                        {database.entity_count.toLocaleString()} entities • {database.relationship_count.toLocaleString()} relations
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(database.status)}>
                        {database.status}
                      </Badge>
                    </div>
                  </div>
                ))}
                <Button variant="outline" className="w-full">
                  View All Databases
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Recent Query Performance */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Recent Query Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentQueries.slice(0, 8).map((query) => (
                  <div key={query.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <div className="font-medium text-sm">{query.query_text}</div>
                      <div className="text-xs text-gray-600">
                        {query.query_type} search • {query.results_count} results
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="text-gray-600">{query.latency}ms</span>
                      <Badge variant={query.performance_score > 0.8 ? 'default' : 'secondary'}>
                        {(query.performance_score * 100).toFixed(0)}%
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="vector-collections" className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Input
                placeholder="Search collections..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64"
              />
              <Select>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="indexing">Indexing</SelectItem>
                  <SelectItem value="error">Error</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button>
              <Database className="h-4 w-4 mr-2" />
              Create Collection
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {vectorCollections.map((collection) => (
              <Card key={collection.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{collection.name}</CardTitle>
                    <Badge className={getStatusColor(collection.status)}>
                      {collection.status}
                    </Badge>
                  </div>
                  <CardDescription>{collection.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Model:</span>
                      <div className="font-medium">{collection.embedding_model}</div>
                    </div>
                    <div>
                      <span className="text-gray-600">Dimension:</span>
                      <div className="font-medium">{collection.dimension}D</div>
                    </div>
                    <div>
                      <span className="text-gray-600">Vectors:</span>
                      <div className="font-medium">{collection.vector_count.toLocaleString()}</div>
                    </div>
                    <div>
                      <span className="text-gray-600">Index:</span>
                      <div className="font-medium">{collection.index_type}</div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Storage Size:</span>
                      <span>{collection.metadata.storage_size}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Avg Similarity:</span>
                      <span>{(collection.metadata.avg_similarity_score * 100).toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Query Performance:</span>
                      <span>{collection.metadata.query_performance}ms</span>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-4">
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-2" />
                      View
                    </Button>
                    <Button variant="outline" size="sm">
                      <Search className="h-4 w-4 mr-2" />
                      Test Search
                    </Button>
                    <Button variant="outline" size="sm">
                      <Settings className="h-4 w-4 mr-2" />
                      Configure
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="semantic-db" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {semanticDatabases.map((database) => (
              <Card key={database.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{database.name}</CardTitle>
                    <Badge className={getStatusColor(database.status)}>
                      {database.status}
                    </Badge>
                  </div>
                  <CardDescription>
                    {database.type} • {database.reasoning_engine}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Entities:</span>
                      <div className="font-medium">{database.entity_count.toLocaleString()}</div>
                    </div>
                    <div>
                      <span className="text-gray-600">Relations:</span>
                      <div className="font-medium">{database.relationship_count.toLocaleString()}</div>
                    </div>
                    <div>
                      <span className="text-gray-600">Schema:</span>
                      <div className="font-medium">v{database.schema_version}</div>
                    </div>
                    <div>
                      <span className="text-gray-600">Last Reasoning:</span>
                      <div className="font-medium">{database.last_reasoning_job}</div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Query Latency:</span>
                      <span>{database.performance_metrics.query_latency}ms</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Inference Accuracy:</span>
                      <span>{(database.performance_metrics.inference_accuracy * 100).toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Memory Usage:</span>
                      <span>{database.performance_metrics.memory_usage}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Throughput:</span>
                      <span>{database.performance_metrics.throughput} q/s</span>
                    </div>
                  </div>

                  <div>
                    <span className="text-sm text-gray-600">Inference Capabilities:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {database.inference_capabilities.map((capability) => (
                        <Badge key={capability} variant="outline" className="text-xs">
                          {capability}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button variant="outline" size="sm">
                      <Brain className="h-4 w-4 mr-2" />
                      Query
                    </Button>
                    <Button variant="outline" size="sm">
                      <Network className="h-4 w-4 mr-2" />
                      Visualize
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="embedding-models" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {embeddingModels.map((model) => (
              <Card key={model.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{model.name}</CardTitle>
                    <Badge className={getStatusColor(model.status)}>
                      {model.status}
                    </Badge>
                  </div>
                  <CardDescription>
                    {model.provider} • {model.type}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Dimension:</span>
                      <div className="font-medium">{model.dimension}D</div>
                    </div>
                    <div>
                      <span className="text-gray-600">Max Length:</span>
                      <div className="font-medium">{model.max_sequence_length}</div>
                    </div>
                    <div>
                      <span className="text-gray-600">Speed:</span>
                      <div className="font-medium">{model.performance.encoding_speed} tok/s</div>
                    </div>
                    <div>
                      <span className="text-gray-600">Accuracy:</span>
                      <div className="font-medium">{(model.performance.accuracy_score * 100).toFixed(1)}%</div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Daily Requests:</span>
                      <span>{model.usage_stats.daily_requests.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Total Embeddings:</span>
                      <span>{model.usage_stats.total_embeddings.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Avg Latency:</span>
                      <span>{model.usage_stats.avg_latency}ms</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Memory:</span>
                      <span>{model.performance.memory_footprint}</span>
                    </div>
                  </div>

                  <div>
                    <span className="text-sm text-gray-600">Domain Specializations:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {model.domain_specialization.map((domain) => (
                        <Badge key={domain} variant="outline" className="text-xs">
                          {domain}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="search-testing" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Search Testing Interface</CardTitle>
              <CardDescription>Test vector similarity and semantic search capabilities</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Collection</label>
                  <Select value={selectedCollection} onValueChange={setSelectedCollection}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select collection" />
                    </SelectTrigger>
                    <SelectContent>
                      {vectorCollections.map((collection) => (
                        <SelectItem key={collection.id} value={collection.id}>
                          {collection.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium">Search Type</label>
                  <Select defaultValue="semantic">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="semantic">Semantic Search</SelectItem>
                      <SelectItem value="hybrid">Hybrid Search</SelectItem>
                      <SelectItem value="exact">Exact Match</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium">Query</label>
                <Input
                  placeholder="Enter your search query..."
                  value={testQuery}
                  onChange={(e) => setTestQuery(e.target.value)}
                />
              </div>
              
              <Button 
                onClick={() => testSearchMutation.mutate({ 
                  collection_id: selectedCollection, 
                  query: testQuery 
                })}
                disabled={!selectedCollection || !testQuery || testSearchMutation.isPending}
              >
                {testSearchMutation.isPending ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Searching...
                  </>
                ) : (
                  <>
                    <Search className="h-4 w-4 mr-2" />
                    Search
                  </>
                )}
              </Button>

              {testSearchMutation.data && (
                <div className="mt-4 p-4 border rounded-lg bg-gray-50">
                  <h4 className="font-medium mb-2">Search Results</h4>
                  <pre className="text-sm text-gray-700 whitespace-pre-wrap">
                    {JSON.stringify(testSearchMutation.data, null, 2)}
                  </pre>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}