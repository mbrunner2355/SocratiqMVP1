import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { 
  Database, 
  Plus, 
  Search,
  Network,
  Brain,
  Link,
  Activity,
  Archive,
  Layers,
  Share2,
  Zap,
  Globe,
  User
} from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';

interface Corpus {
  id: string;
  name: string;
  type: string;
  module: string;
  domain: string;
  description?: string;
  documentCount: number;
  isActive: boolean;
  createdAt: string;
}

interface ContextMemory {
  id: string;
  sessionId: string;
  memoryType: string;
  contextData: any;
  relevanceScore: number;
  accessCount: number;
  createdAt: string;
}

interface SemanticLink {
  id: string;
  sourceType: string;
  sourceId: string;
  targetType: string;
  targetId: string;
  linkType: string;
  strength: number;
  confidence: number;
  createdAt: string;
}

export function CorpusManager() {
  const [selectedTab, setSelectedTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const queryClient = useQueryClient();

  // Fetch data
  const { data: corpora, isLoading: corporaLoading } = useQuery<Corpus[]>({
    queryKey: ['/api/corpus/corpora'],
  });

  const { data: analytics } = useQuery({
    queryKey: ['/api/corpus/analytics/overview'],
  });

  const { data: contextMemories } = useQuery<ContextMemory[]>({
    queryKey: ['/api/corpus/context-memory'],
  });

  const { data: semanticLinks } = useQuery<SemanticLink[]>({
    queryKey: ['/api/corpus/semantic-links'],
  });

  // Create corpus mutation
  const createCorpusMutation = useMutation({
    mutationFn: (data: any) => apiRequest('/api/corpus/corpora', 'POST', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/corpus/corpora'] });
      queryClient.invalidateQueries({ queryKey: ['/api/corpus/analytics/overview'] });
    }
  });

  // Federated query mutation
  const federatedQueryMutation = useMutation({
    mutationFn: (queryData: any) => apiRequest('/api/corpus/query/federated', 'POST', queryData)
  });

  // Discovery mutation
  const discoverLinksMutation = useMutation({
    mutationFn: (discoveryData: any) => apiRequest('/api/corpus/semantic-links/discover', 'POST', discoveryData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/corpus/semantic-links'] });
    }
  });

  const getModuleColor = (module: string) => {
    switch (module) {
      case 'TRANSFORM': return 'bg-blue-100 text-blue-800';
      case 'MESH': return 'bg-purple-100 text-purple-800';
      case 'TRACE': return 'bg-orange-100 text-orange-800';
      case 'SOPHIE': return 'bg-green-100 text-green-800';
      case 'BUILD': return 'bg-yellow-100 text-yellow-800';
      case 'PROFILE': return 'bg-pink-100 text-pink-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getMemoryTypeIcon = (type: string) => {
    switch (type) {
      case 'SHORT_TERM': return <Zap className="h-3 w-3" />;
      case 'WORKING': return <Activity className="h-3 w-3" />;
      case 'EPISODIC': return <User className="h-3 w-3" />;
      default: return <Brain className="h-3 w-3" />;
    }
  };

  const getLinkTypeColor = (linkType: string) => {
    switch (linkType) {
      case 'SEMANTIC_SIMILARITY': return 'bg-blue-100 text-blue-800';
      case 'CAUSAL': return 'bg-red-100 text-red-800';
      case 'TEMPORAL': return 'bg-yellow-100 text-yellow-800';
      case 'SPATIAL': return 'bg-green-100 text-green-800';
      case 'ONTOLOGICAL': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleCreateCorpus = () => {
    createCorpusMutation.mutate({
      name: `New Corpus ${(corpora?.length || 0) + 1}`,
      type: 'DOCUMENTS',
      module: 'TRANSFORM',
      domain: 'TECHNICAL',
      description: 'A new corpus for document processing and analysis',
      ontologyVersion: '1.0.0',
      configuration: {
        semanticTagging: true,
        autoClassification: true,
        qualityThreshold: 0.7
      }
    });
  };

  const handleFederatedQuery = () => {
    federatedQueryMutation.mutate({
      query: searchTerm || 'construction project management',
      targetModules: ['TRANSFORM', 'BUILD', 'PROFILE'],
      limitPerModule: 5
    });
  };

  const handleDiscoverLinks = () => {
    const sourceCorpus = corpora?.find(c => c.module === 'TRANSFORM');
    const targetCorpus = corpora?.find(c => c.module === 'BUILD');
    
    if (sourceCorpus && targetCorpus) {
      discoverLinksMutation.mutate({
        sourceCorpusId: sourceCorpus.id,
        targetCorpusId: targetCorpus.id,
        similarityThreshold: 0.7
      });
    }
  };

  if (corporaLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-sm text-muted-foreground">Loading Corpus Construction & Federation...</p>
        </div>
      </div>
    );
  }

  const filteredCorpora = corpora?.filter(corpus =>
    corpus.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    corpus.module.toLowerCase().includes(searchTerm.toLowerCase()) ||
    corpus.domain.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">SocratIQ Corpus Construction & Federation</h1>
          <p className="text-muted-foreground">
            Modular, domain-specific corpora with cross-module semantic linking and context memory
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search corpora..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 w-64"
            />
          </div>
          <Button onClick={handleCreateCorpus} disabled={createCorpusMutation.isPending}>
            <Plus className="h-4 w-4 mr-2" />
            New Corpus
          </Button>
        </div>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="corpora">Corpora ({corpora?.length || 0})</TabsTrigger>
          <TabsTrigger value="federation">Federation</TabsTrigger>
          <TabsTrigger value="memory">Context Memory</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Analytics Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Corpora</CardTitle>
                <Database className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{(analytics as any)?.activeCorpora || 0}</div>
                <p className="text-xs text-muted-foreground">
                  {(analytics as any)?.totalCorpora || 0} total corpora
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Semantic Links</CardTitle>
                <Network className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{(analytics as any)?.totalSemanticLinks || 0}</div>
                <p className="text-xs text-muted-foreground">
                  Cross-module connections
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Federations</CardTitle>
                <Share2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{(analytics as any)?.totalFederations || 0}</div>
                <p className="text-xs text-muted-foreground">
                  Active corpus federations
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Documents</CardTitle>
                <Archive className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{(analytics as any)?.totalDocuments || 0}</div>
                <p className="text-xs text-muted-foreground">
                  Across all corpora
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Memory Utilization */}
          {(analytics as any)?.memoryUtilization && (
            <Card>
              <CardHeader>
                <CardTitle>Context Memory Architecture</CardTitle>
                <CardDescription>Short-term reasoning cycles and long-term semantic links</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="flex items-center space-x-3 p-3 border rounded-lg">
                    <Zap className="h-5 w-5 text-yellow-600" />
                    <div>
                      <p className="font-medium">Short-Term</p>
                      <p className="text-sm text-muted-foreground">{(analytics as any).memoryUtilization.shortTerm} active memories</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 border rounded-lg">
                    <Activity className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="font-medium">Working</p>
                      <p className="text-sm text-muted-foreground">{(analytics as any).memoryUtilization.working} working memories</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 border rounded-lg">
                    <User className="h-5 w-5 text-purple-600" />
                    <div>
                      <p className="font-medium">Episodic</p>
                      <p className="text-sm text-muted-foreground">{(analytics as any).memoryUtilization.episodic} episodic memories</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Corpus Distribution */}
          {(analytics as any)?.corporaByModule && (
            <Card>
              <CardHeader>
                <CardTitle>Corpus Distribution by Module</CardTitle>
                <CardDescription>Specialized corpora across SocratIQ modules</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-3">
                  {Object.entries((analytics as any).corporaByModule).map(([module, count]: [string, any]) => (
                    <div key={module} className="flex items-center space-x-3 p-3 border rounded-lg">
                      <Layers className="h-4 w-4" />
                      <div>
                        <p className="font-medium">{module}</p>
                        <p className="text-sm text-muted-foreground">{count as number} corpora</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="corpora">
          <Card>
            <CardHeader>
              <CardTitle>Corpus Management</CardTitle>
              <CardDescription>Modular, domain-specific corpora with semantic tagging and versioning</CardDescription>
            </CardHeader>
            <CardContent>
              {filteredCorpora && filteredCorpora.length > 0 ? (
                <div className="space-y-4">
                  {filteredCorpora.map((corpus) => (
                    <Card key={corpus.id}>
                      <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                              <Database className="h-5 w-5" />
                            </div>
                            <div>
                              <h4 className="font-medium">{corpus.name}</h4>
                              <div className="flex items-center space-x-2 mt-1">
                                <Badge className={getModuleColor(corpus.module)}>
                                  {corpus.module}
                                </Badge>
                                <Badge variant="outline">{corpus.type}</Badge>
                                <Badge variant="outline">{corpus.domain}</Badge>
                                {corpus.isActive ? (
                                  <Badge variant="outline" className="bg-green-50 text-green-700">
                                    Active
                                  </Badge>
                                ) : (
                                  <Badge variant="outline" className="bg-gray-50 text-gray-700">
                                    Inactive
                                  </Badge>
                                )}
                              </div>
                              {corpus.description && (
                                <p className="text-sm text-muted-foreground mt-1">{corpus.description}</p>
                              )}
                            </div>
                          </div>
                          <div className="text-right text-sm text-muted-foreground">
                            <p className="font-medium">{corpus.documentCount} documents</p>
                            <p>Created: {new Date(corpus.createdAt).toLocaleDateString()}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Database className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-medium mb-2">No corpora found</h3>
                  <p className="text-muted-foreground mb-4">
                    {searchTerm ? 'Try adjusting your search terms' : 'Create your first corpus to get started'}
                  </p>
                  {!searchTerm && (
                    <Button onClick={handleCreateCorpus}>
                      <Plus className="h-4 w-4 mr-2" />
                      Create Corpus
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="federation">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Federated Query Engine</CardTitle>
                <CardDescription>Cross-corpus semantic search and unified query interface</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2 mb-4">
                  <Input
                    placeholder="Enter your federated query..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-1"
                  />
                  <Button onClick={handleFederatedQuery} disabled={federatedQueryMutation.isPending}>
                    <Search className="h-4 w-4 mr-2" />
                    Query
                  </Button>
                </div>
                
                {federatedQueryMutation.data && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">Query Results</h4>
                      <Badge variant="outline">
                        {(federatedQueryMutation.data as any).totalResults} results in {(federatedQueryMutation.data as any).processingTime}
                      </Badge>
                    </div>
                    {Object.entries((federatedQueryMutation.data as any).resultsByModule).map(([module, results]: [string, any]) => (
                      <div key={module}>
                        <h5 className="font-medium text-sm mb-2">{module} Module</h5>
                        <div className="space-y-2">
                          {results.map((result: any, index: number) => (
                            <div key={index} className="p-3 border rounded-lg">
                              <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">{result.type}</span>
                                <Badge variant="outline">{(result.relevance * 100).toFixed(0)}% relevance</Badge>
                              </div>
                              <p className="text-sm text-muted-foreground mt-1">{result.snippet}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Semantic Link Discovery</CardTitle>
                <CardDescription>Automated discovery of relationships between corpora</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2 mb-4">
                  <Button onClick={handleDiscoverLinks} disabled={discoverLinksMutation.isPending}>
                    <Network className="h-4 w-4 mr-2" />
                    Discover Links
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    Find semantic connections between Transform™ and Build™ corpora
                  </span>
                </div>

                {semanticLinks && semanticLinks.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-medium">Recent Semantic Links</h4>
                    {semanticLinks.slice(0, 5).map((link) => (
                      <div key={link.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <Link className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="text-sm font-medium">
                              {link.sourceType} → {link.targetType}
                            </p>
                            <Badge className={getLinkTypeColor(link.linkType)} variant="outline">
                              {link.linkType}
                            </Badge>
                          </div>
                        </div>
                        <div className="text-right text-sm">
                          <p className="font-medium">{(link.strength * 100).toFixed(0)}% strength</p>
                          <p className="text-muted-foreground">{(link.confidence * 100).toFixed(0)}% confidence</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="memory">
          <Card>
            <CardHeader>
              <CardTitle>Context Memory Architecture</CardTitle>
              <CardDescription>Short-term reasoning cycles and persistent semantic links</CardDescription>
            </CardHeader>
            <CardContent>
              {contextMemories && contextMemories.length > 0 ? (
                <div className="space-y-4">
                  {contextMemories.slice(0, 10).map((memory) => (
                    <div key={memory.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                          {getMemoryTypeIcon(memory.memoryType)}
                        </div>
                        <div>
                          <p className="text-sm font-medium">Session {memory.sessionId.slice(0, 8)}...</p>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge variant="outline">{memory.memoryType}</Badge>
                            <span className="text-xs text-muted-foreground">
                              {memory.accessCount} accesses
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right text-sm">
                        <p className="font-medium">{(memory.relevanceScore * 100).toFixed(0)}% relevance</p>
                        <p className="text-muted-foreground">{new Date(memory.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Brain className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No context memories available</p>
                  <p className="text-sm">Context memories will appear here during reasoning sessions</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Federation Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Cross-module Links</span>
                    <span className="font-medium">{(analytics as any)?.totalSemanticLinks || 0}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Active Federations</span>
                    <span className="font-medium">{(analytics as any)?.totalFederations || 0}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Sync Success Rate</span>
                    <span className="font-medium">98.5%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>System Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Query Response Time</span>
                    <span className="font-medium">145ms avg</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Memory Utilization</span>
                    <span className="font-medium">67%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Indexing Health</span>
                    <span className="font-medium text-green-600">Optimal</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}