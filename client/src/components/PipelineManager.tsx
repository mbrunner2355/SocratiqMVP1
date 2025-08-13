import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { 
  Cpu, 
  Plus, 
  Settings,
  Zap,
  Brain,
  Activity,
  BarChart3,
  Users,
  CheckCircle,
  Clock,
  AlertTriangle,
  Target,
  TrendingUp,
  Database,
  Layers,
  Network,
  Link,
  Globe,
  Share2,
  Archive,
  User,
  Search
} from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';

interface TransformerModel {
  id: string;
  modelName: string;
  modelType: string;
  domain: string;
  version: string;
  performance: {
    f1Score: number;
    precision: number;
    recall: number;
    accuracy: number;
  };
  isActive: boolean;
  createdAt: string;
}

interface LoraAdapter {
  id: string;
  baseModelId: string;
  adapterName: string;
  taskType: string;
  domain: string;
  performance: Record<string, any>;
  isActive: boolean;
}

interface DataQuality {
  id: string;
  documentId: string;
  completenessScore: number;
  accuracyScore: number;
  consistencyScore: number;
  duplicateScore: number;
  qualityIssues: any[];
  assessedBy: string;
  assessedAt: string;
}

export function PipelineManager() {
  const [selectedTab, setSelectedTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const queryClient = useQueryClient();

  // Fetch data
  const { data: models, isLoading: modelsLoading } = useQuery<TransformerModel[]>({
    queryKey: ['/api/pipeline/models'],
  });

  const { data: analytics } = useQuery({
    queryKey: ['/api/pipeline/analytics/models'],
  });

  // Register model mutation
  const registerModelMutation = useMutation({
    mutationFn: (data: any) => apiRequest('/api/pipeline/models', 'POST', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/pipeline/models'] });
      queryClient.invalidateQueries({ queryKey: ['/api/pipeline/analytics/models'] });
    }
  });

  // Process document mutation
  const processDocumentMutation = useMutation({
    mutationFn: (data: any) => apiRequest('/api/pipeline/pipeline/process', 'POST', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/pipeline/analytics/models'] });
    }
  });

  // Quality assessment mutation
  const assessQualityMutation = useMutation({
    mutationFn: (data: any) => apiRequest('/api/pipeline/quality/assess', 'POST', data),
  });

  // GNN mutations
  const generateEmbeddingsMutation = useMutation({
    mutationFn: (data: any) => apiRequest('/api/pipeline/gnn/embeddings/generate', 'POST', data),
  });

  const linkPredictionMutation = useMutation({
    mutationFn: (data: any) => apiRequest('/api/pipeline/gnn/link-prediction', 'POST', data),
  });

  const nodeClassificationMutation = useMutation({
    mutationFn: (data: any) => apiRequest('/api/pipeline/gnn/node-classification', 'POST', data),
  });

  const clusteringMutation = useMutation({
    mutationFn: (data: any) => apiRequest('/api/pipeline/gnn/clustering', 'POST', data),
  });

  const anomalyDetectionMutation = useMutation({
    mutationFn: (data: any) => apiRequest('/api/pipeline/gnn/anomaly-detection', 'POST', data),
  });

  const crossDomainReasoningMutation = useMutation({
    mutationFn: (data: any) => apiRequest('/api/pipeline/gnn/cross-domain-reasoning', 'POST', data),
  });

  const getDomainColor = (domain: string) => {
    switch (domain) {
      case 'BIOMEDICAL': return 'bg-green-100 text-green-800';
      case 'CLINICAL': return 'bg-blue-100 text-blue-800';
      case 'LEGAL': return 'bg-purple-100 text-purple-800';
      case 'CONSTRUCTION': return 'bg-orange-100 text-orange-800';
      case 'GENERAL': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getModelTypeIcon = (modelType: string) => {
    switch (modelType) {
      case 'DOMAIN_SPECIFIC': return <Target className="h-4 w-4" />;
      case 'GENERAL_PURPOSE': return <Brain className="h-4 w-4" />;
      case 'FINE_TUNED': return <Settings className="h-4 w-4" />;
      default: return <Cpu className="h-4 w-4" />;
    }
  };

  const handleRegisterModel = () => {
    registerModelMutation.mutate({
      modelName: 'Legal-BERT',
      modelType: 'DOMAIN_SPECIFIC',
      domain: 'LEGAL',
      version: '1.0.0',
      modelPath: '/models/legal-bert-v1.0',
      configuration: {
        maxLength: 512,
        batchSize: 8,
        temperature: 0.1
      },
      performance: {
        f1Score: 0.91,
        precision: 0.89,
        recall: 0.93,
        accuracy: 0.90
      }
    });
  };

  const handleProcessDocument = () => {
    processDocumentMutation.mutate({
      documentId: 'doc_sample_123',
      stage: 'SEMANTIC_ENHANCEMENT',
      processorType: 'TRANSFORMER',
      modelId: models?.[0]?.id,
      inputData: {
        text: 'Sample document text for processing with advanced NLP pipeline...',
        metadata: { source: 'user_upload' }
      }
    });
  };

  const handleAssessQuality = () => {
    assessQualityMutation.mutate({
      documentId: 'doc_sample_123',
      assessedBy: 'MODEL'
    });
  };

  const handleGenerateEmbeddings = () => {
    generateEmbeddingsMutation.mutate({
      nodeIds: ['node_1', 'node_2', 'node_3'],
      gnnModelId: 'gnn_model_1',
      temporalVersion: 1
    });
  };

  const handleLinkPrediction = () => {
    linkPredictionMutation.mutate({
      sourceNodeIds: ['node_1', 'node_2'],
      targetNodeIds: ['node_3', 'node_4', 'node_5'],
      gnnModelId: 'gnn_model_1'
    });
  };

  const handleNodeClassification = () => {
    nodeClassificationMutation.mutate({
      nodeIds: ['node_1', 'node_2', 'node_3'],
      gnnModelId: 'gnn_model_1'
    });
  };

  const handleGraphClustering = () => {
    clusteringMutation.mutate({
      algorithm: 'LOUVAIN',
      nodeIds: ['node_1', 'node_2', 'node_3', 'node_4', 'node_5']
    });
  };

  const handleAnomalyDetection = () => {
    anomalyDetectionMutation.mutate({
      nodeIds: ['node_1', 'node_2', 'node_3'],
      relationshipIds: ['rel_1', 'rel_2'],
      detectionMethod: 'ISOLATION_FOREST'
    });
  };

  const handleCrossDomainReasoning = () => {
    crossDomainReasoningMutation.mutate({
      queryType: 'SEMANTIC_BRIDGING',
      sourceDomains: ['BIOMEDICAL'],
      targetDomains: ['CONSTRUCTION'],
      queryDescription: 'Find relationships between biomedical safety protocols and construction risk management'
    });
  };

  if (modelsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-sm text-muted-foreground">Loading AI/ML Processing Pipeline...</p>
        </div>
      </div>
    );
  }

  const filteredModels = models?.filter(model =>
    model.modelName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    model.domain.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Advanced AI/ML Processing Pipeline</h1>
          <p className="text-muted-foreground">
            Transformer ensemble, LoRA adapters, and federated learning for domain-specific processing
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Target className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search models..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 w-64"
            />
          </div>
          <Button onClick={handleRegisterModel} disabled={registerModelMutation.isPending}>
            <Plus className="h-4 w-4 mr-2" />
            Register Model
          </Button>
        </div>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="models">Models ({models?.length || 0})</TabsTrigger>
          <TabsTrigger value="pipeline">Pipeline</TabsTrigger>
          <TabsTrigger value="quality">Quality</TabsTrigger>
          <TabsTrigger value="federated">Federated Learning</TabsTrigger>
          <TabsTrigger value="gnn">Graph Neural Networks</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Analytics Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Models</CardTitle>
                <Brain className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{(analytics as any)?.activeModels || 0}</div>
                <p className="text-xs text-muted-foreground">
                  {(analytics as any)?.totalModels || 0} total registered
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Processing Speed</CardTitle>
                <Zap className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{((analytics as any)?.avgProcessingTime / 1000)?.toFixed(1) || 0}s</div>
                <p className="text-xs text-muted-foreground">
                  Average processing time
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Model Performance</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{((analytics as any)?.averagePerformance?.f1Score * 100)?.toFixed(1) || 0}%</div>
                <p className="text-xs text-muted-foreground">
                  Average F1-Score
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">LoRA Adapters</CardTitle>
                <Layers className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{(analytics as any)?.totalAdapters || 0}</div>
                <p className="text-xs text-muted-foreground">
                  Fine-tuned adapters
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Transformer Ensemble */}
          <Card>
            <CardHeader>
              <CardTitle>Transformer Ensemble</CardTitle>
              <CardDescription>Specialized BERT models for domain-specific processing</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="flex items-center space-x-3 p-3 border rounded-lg">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <Target className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium">BioBERT</p>
                    <p className="text-sm text-muted-foreground">Biomedical NER & Relation Extraction</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 border rounded-lg">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Database className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium">PubMedBERT</p>
                    <p className="text-sm text-muted-foreground">Scientific Literature Analysis</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 border rounded-lg">
                  <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                    <Activity className="h-5 w-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="font-medium">Construction-BERT</p>
                    <p className="text-sm text-muted-foreground">Project Management & Specs</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Processing Pipeline Stages */}
          <Card>
            <CardHeader>
              <CardTitle>Processing Pipeline Architecture</CardTitle>
              <CardDescription>3-stage pipeline: Ingestion → Preprocessing → Semantic Enhancement</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="text-center p-4 border rounded-lg">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-blue-600 font-bold">1</span>
                  </div>
                  <h3 className="font-medium mb-2">Ingestion</h3>
                  <p className="text-sm text-muted-foreground">Real-time streaming, batch processing, format support</p>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-purple-600 font-bold">2</span>
                  </div>
                  <h3 className="font-medium mb-2">Preprocessing</h3>
                  <p className="text-sm text-muted-foreground">Content extraction, quality assessment, deduplication</p>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-green-600 font-bold">3</span>
                  </div>
                  <h3 className="font-medium mb-2">Enhancement</h3>
                  <p className="text-sm text-muted-foreground">Entity extraction, ontology alignment, context enrichment</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="models">
          <Card>
            <CardHeader>
              <CardTitle>Transformer Model Registry</CardTitle>
              <CardDescription>Manage and monitor transformer models and LoRA adapters</CardDescription>
            </CardHeader>
            <CardContent>
              {filteredModels && filteredModels.length > 0 ? (
                <div className="space-y-4">
                  {filteredModels.map((model) => (
                    <Card key={model.id}>
                      <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                              {getModelTypeIcon(model.modelType)}
                            </div>
                            <div>
                              <h4 className="font-medium">{model.modelName}</h4>
                              <div className="flex items-center space-x-2 mt-1">
                                <Badge className={getDomainColor(model.domain)}>
                                  {model.domain}
                                </Badge>
                                <Badge variant="outline">{model.modelType}</Badge>
                                <Badge variant="outline">v{model.version}</Badge>
                                {model.isActive ? (
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
                          </div>
                          <div className="text-right">
                            <div className="grid grid-cols-2 gap-2 text-xs">
                              <div>
                                <p className="font-medium">F1: {(model.performance.f1Score * 100).toFixed(1)}%</p>
                                <p className="text-muted-foreground">Precision: {(model.performance.precision * 100).toFixed(1)}%</p>
                              </div>
                              <div>
                                <p className="font-medium">Acc: {(model.performance.accuracy * 100).toFixed(1)}%</p>
                                <p className="text-muted-foreground">Recall: {(model.performance.recall * 100).toFixed(1)}%</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Brain className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-medium mb-2">No models found</h3>
                  <p className="text-muted-foreground mb-4">
                    {searchTerm ? 'Try adjusting your search terms' : 'Register your first transformer model to get started'}
                  </p>
                  {!searchTerm && (
                    <Button onClick={handleRegisterModel}>
                      <Plus className="h-4 w-4 mr-2" />
                      Register Model
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pipeline">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Pipeline Processing</CardTitle>
                <CardDescription>Process documents through the AI/ML pipeline with transformer models</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2 mb-4">
                  <Button onClick={handleProcessDocument} disabled={processDocumentMutation.isPending}>
                    <Zap className="h-4 w-4 mr-2" />
                    {processDocumentMutation.isPending ? 'Processing...' : 'Process Document'}
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    Run semantic enhancement with transformer ensemble
                  </span>
                </div>

                {processDocumentMutation.data && (
                  <div className="p-4 border rounded-lg bg-green-50">
                    <div className="flex items-center space-x-2 mb-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="font-medium text-green-800">Processing Complete</span>
                    </div>
                    <div className="text-sm text-green-700">
                      <p>Stage: {(processDocumentMutation.data as any).stage.stage}</p>
                      <p>Processing Time: {(processDocumentMutation.data as any).stage.processingTime}ms</p>
                      <p>Confidence: {((processDocumentMutation.data as any).stage.confidenceScore * 100).toFixed(1)}%</p>
                      <p>Entities Extracted: {(processDocumentMutation.data as any).stage.outputData.processingMetrics.entitiesExtracted}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Custom Fine-tuning Framework</CardTitle>
                <CardDescription>LoRA adapters and federated learning capabilities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-3">
                    <h4 className="font-medium">LoRA Adapters</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-3 border rounded">
                        <span className="text-sm">Biomedical NER Adapter</span>
                        <Badge variant="outline">Rank 16</Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 border rounded">
                        <span className="text-sm">Legal Classification Adapter</span>
                        <Badge variant="outline">Rank 32</Badge>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <h4 className="font-medium">Human-in-the-Loop</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-3 border rounded">
                        <span className="text-sm">Expert Feedback Integration</span>
                        <Badge className="bg-blue-100 text-blue-800">Active</Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 border rounded">
                        <span className="text-sm">Active Learning Pipeline</span>
                        <Badge className="bg-green-100 text-green-800">Operational</Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="quality">
          <Card>
            <CardHeader>
              <CardTitle>Data Quality Assessment</CardTitle>
              <CardDescription>Automated quality scoring and enhancement suggestions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2 mb-6">
                <Button onClick={handleAssessQuality} disabled={assessQualityMutation.isPending}>
                  <BarChart3 className="h-4 w-4 mr-2" />
                  {assessQualityMutation.isPending ? 'Assessing...' : 'Assess Quality'}
                </Button>
                <span className="text-sm text-muted-foreground">
                  Run comprehensive quality assessment on sample document
                </span>
              </div>

              {assessQualityMutation.data && (
                <div className="space-y-4">
                  <h4 className="font-medium">Quality Assessment Results</h4>
                  <div className="grid gap-4 md:grid-cols-4">
                    <div className="text-center p-3 border rounded-lg">
                      <div className="text-2xl font-bold text-green-600">
                        {((assessQualityMutation.data as any).assessment.completenessScore * 100).toFixed(0)}%
                      </div>
                      <p className="text-sm text-muted-foreground">Completeness</p>
                    </div>
                    <div className="text-center p-3 border rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">
                        {((assessQualityMutation.data as any).assessment.accuracyScore * 100).toFixed(0)}%
                      </div>
                      <p className="text-sm text-muted-foreground">Accuracy</p>
                    </div>
                    <div className="text-center p-3 border rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">
                        {((assessQualityMutation.data as any).assessment.consistencyScore * 100).toFixed(0)}%
                      </div>
                      <p className="text-sm text-muted-foreground">Consistency</p>
                    </div>
                    <div className="text-center p-3 border rounded-lg">
                      <div className="text-2xl font-bold text-orange-600">
                        {((assessQualityMutation.data as any).assessment.duplicateScore * 100).toFixed(0)}%
                      </div>
                      <p className="text-sm text-muted-foreground">Duplicate Risk</p>
                    </div>
                  </div>

                  <div className="p-4 border rounded-lg bg-blue-50">
                    <h5 className="font-medium text-blue-800 mb-2">Enhancement Suggestions</h5>
                    <ul className="space-y-1 text-sm text-blue-700">
                      {(assessQualityMutation.data as any).assessment.enhancementSuggestions.map((suggestion: string, index: number) => (
                        <li key={index}>• {suggestion}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="federated">
          <Card>
            <CardHeader>
              <CardTitle>Federated Learning</CardTitle>
              <CardDescription>Multi-tenant model improvement without data sharing</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="text-center p-4 border rounded-lg">
                    <Users className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                    <div className="text-xl font-bold">3</div>
                    <p className="text-sm text-muted-foreground">Active Participants</p>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <Activity className="h-8 w-8 mx-auto mb-2 text-green-600" />
                    <div className="text-xl font-bold">98.5%</div>
                    <p className="text-sm text-muted-foreground">Privacy Preserved</p>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <TrendingUp className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                    <div className="text-xl font-bold">Round 5</div>
                    <p className="text-sm text-muted-foreground">Current Round</p>
                  </div>
                </div>

                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-3">Federated Learning Status</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Model Aggregation</span>
                      <Badge className="bg-green-100 text-green-800">Completed</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Privacy Budget</span>
                      <span className="text-sm font-medium">ε = 1.0</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Convergence Status</span>
                      <Badge variant="outline">Converging</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="gnn">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Graph Neural Network Pipeline</CardTitle>
                <CardDescription>Advanced graph learning with GCN, GAT, and multi-scale embeddings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  <div className="space-y-3">
                    <h4 className="font-medium">Node Embedding Generation</h4>
                    <div className="space-y-2">
                      <Button onClick={handleGenerateEmbeddings} disabled={generateEmbeddingsMutation.isPending} className="w-full">
                        <Network className="h-4 w-4 mr-2" />
                        {generateEmbeddingsMutation.isPending ? 'Generating...' : 'Generate Embeddings'}
                      </Button>
                      {generateEmbeddingsMutation.data && (
                        <div className="p-2 bg-green-50 rounded text-sm text-green-700">
                          Generated {(generateEmbeddingsMutation.data as any).count} embeddings
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-medium">Link Prediction</h4>
                    <div className="space-y-2">
                      <Button onClick={handleLinkPrediction} disabled={linkPredictionMutation.isPending} className="w-full">
                        <Link className="h-4 w-4 mr-2" />
                        {linkPredictionMutation.isPending ? 'Predicting...' : 'Predict Links'}
                      </Button>
                      {linkPredictionMutation.data && (
                        <div className="p-2 bg-blue-50 rounded text-sm text-blue-700">
                          Found {(linkPredictionMutation.data as any).count} potential relationships
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-medium">Node Classification</h4>
                    <div className="space-y-2">
                      <Button onClick={handleNodeClassification} disabled={nodeClassificationMutation.isPending} className="w-full">
                        <Target className="h-4 w-4 mr-2" />
                        {nodeClassificationMutation.isPending ? 'Classifying...' : 'Classify Nodes'}
                      </Button>
                      {nodeClassificationMutation.data && (
                        <div className="p-2 bg-purple-50 rounded text-sm text-purple-700">
                          Classified {(nodeClassificationMutation.data as any).count} nodes
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-medium">Graph Clustering</h4>
                    <div className="space-y-2">
                      <Button onClick={handleGraphClustering} disabled={clusteringMutation.isPending} className="w-full">
                        <Layers className="h-4 w-4 mr-2" />
                        {clusteringMutation.isPending ? 'Clustering...' : 'Detect Communities'}
                      </Button>
                      {clusteringMutation.data && (
                        <div className="p-2 bg-orange-50 rounded text-sm text-orange-700">
                          Found {(clusteringMutation.data as any).clusterCount} communities
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-medium">Anomaly Detection</h4>
                    <div className="space-y-2">
                      <Button onClick={handleAnomalyDetection} disabled={anomalyDetectionMutation.isPending} className="w-full">
                        <AlertTriangle className="h-4 w-4 mr-2" />
                        {anomalyDetectionMutation.isPending ? 'Detecting...' : 'Detect Anomalies'}
                      </Button>
                      {anomalyDetectionMutation.data && (
                        <div className="p-2 bg-red-50 rounded text-sm text-red-700">
                          Detected {(anomalyDetectionMutation.data as any).anomalyCount} anomalies
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-medium">Cross-Domain Reasoning</h4>
                    <div className="space-y-2">
                      <Button onClick={handleCrossDomainReasoning} disabled={crossDomainReasoningMutation.isPending} className="w-full">
                        <Globe className="h-4 w-4 mr-2" />
                        {crossDomainReasoningMutation.isPending ? 'Reasoning...' : 'Cross-Domain Analysis'}
                      </Button>
                      {crossDomainReasoningMutation.data && (
                        <div className="p-2 bg-teal-50 rounded text-sm text-teal-700">
                          Reasoning completed with {((crossDomainReasoningMutation.data as any).session.confidenceScore * 100).toFixed(0)}% confidence
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>GNN Architecture Overview</CardTitle>
                <CardDescription>Multi-layer graph convolution with attention mechanisms</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-4">
                    <h4 className="font-medium">Available Architectures</h4>
                    <div className="grid gap-2">
                      <div className="flex items-center justify-between p-3 border rounded">
                        <span className="text-sm font-medium">GCN (Graph Convolutional Network)</span>
                        <Badge className="bg-blue-100 text-blue-800">Active</Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 border rounded">
                        <span className="text-sm font-medium">GAT (Graph Attention Network)</span>
                        <Badge variant="outline">Available</Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 border rounded">
                        <span className="text-sm font-medium">GraphSAGE</span>
                        <Badge variant="outline">Available</Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 border rounded">
                        <span className="text-sm font-medium">Graph Transformer</span>
                        <Badge variant="outline">Available</Badge>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium">Scalability Features</h4>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3 p-3 border rounded">
                        <Database className="h-5 w-5 text-blue-600" />
                        <div>
                          <p className="font-medium text-sm">Distributed Storage</p>
                          <p className="text-xs text-muted-foreground">Sharded graph stores with incremental updates</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3 p-3 border rounded">
                        <Activity className="h-5 w-5 text-green-600" />
                        <div>
                          <p className="font-medium text-sm">High Availability</p>
                          <p className="text-xs text-muted-foreground">Multi-region failover and automated rebalancing</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3 p-3 border rounded">
                        <Zap className="h-5 w-5 text-yellow-600" />
                        <div>
                          <p className="font-medium text-sm">Sub-second Queries</p>
                          <p className="text-xs text-muted-foreground">Optimized indexing for millions of nodes</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Inference Capabilities</CardTitle>
                <CardDescription>Advanced graph learning tasks and cross-domain reasoning</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-4">
                  <div className="text-center p-4 border rounded-lg">
                    <Link className="h-8 w-8 mx-auto mb-3 text-blue-600" />
                    <h4 className="font-medium mb-2">Link Prediction</h4>
                    <p className="text-sm text-muted-foreground">Missing relationships between entities</p>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <Target className="h-8 w-8 mx-auto mb-3 text-purple-600" />
                    <h4 className="font-medium mb-2">Node Classification</h4>
                    <p className="text-sm text-muted-foreground">Entity type and attribute prediction</p>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <Layers className="h-8 w-8 mx-auto mb-3 text-orange-600" />
                    <h4 className="font-medium mb-2">Graph Clustering</h4>
                    <p className="text-sm text-muted-foreground">Community detection and modules</p>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <AlertTriangle className="h-8 w-8 mx-auto mb-3 text-red-600" />
                    <h4 className="font-medium mb-2">Anomaly Detection</h4>
                    <p className="text-sm text-muted-foreground">Unusual patterns and outliers</p>
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