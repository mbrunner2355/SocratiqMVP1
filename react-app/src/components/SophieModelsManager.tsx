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
  Pause,
  CheckCircle,
  Clock,
  Zap,
  Eye,
  Target,
  Settings,
  Search,
  Users,
  Activity,
  BarChart3,
  TrendingUp,
  Database,
  Server,
  Cpu,
  Layers,
  GitBranch,
  Gauge,
  Code,
  Workflow
} from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';

interface AiModel {
  id: string;
  modelName: string;
  modelType: string;
  architecture: string;
  category: string;
  domain: string;
  isActive: boolean;
  isPublic: boolean;
  version: string;
  modelSize: string;
  createdAt: string;
}

interface TrainingJob {
  id: string;
  jobName: string;
  baseModelId: string;
  trainingType: string;
  status: string;
  progressPercentage: number;
  createdAt: string;
}

interface ModelDeployment {
  id: string;
  modelId: string;
  environment: string;
  deploymentType: string;
  status: string;
  endpoint: string;
  createdAt: string;
}

interface AgentFamily {
  id: string;
  familyName: string;
  familyType: string;
  description: string;
  domain: string;
  isActive: boolean;
  version: string;
  createdAt: string;
}

export function SophieModelsManager() {
  const [selectedTab, setSelectedTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const queryClient = useQueryClient();

  // Fetch data
  const { data: models, isLoading: modelsLoading } = useQuery<{models: AiModel[], total: number}>({
    queryKey: ['/api/sophiemodels/models'],
  });

  const { data: trainingJobs } = useQuery<TrainingJob[]>({
    queryKey: ['/api/sophiemodels/training-jobs'],
  });

  const { data: deployments } = useQuery<ModelDeployment[]>({
    queryKey: ['/api/sophiemodels/deployments'],
  });

  const { data: agentFamilies } = useQuery<AgentFamily[]>({
    queryKey: ['/api/sophiemodels/agent-families'],
  });

  const { data: repositories } = useQuery({
    queryKey: ['/api/sophiemodels/repositories'],
  });

  const { data: metrics } = useQuery({
    queryKey: ['/api/sophiemodels/metrics'],
  });

  const { data: architectures } = useQuery({
    queryKey: ['/api/sophiemodels/architectures'],
  });

  const { data: analytics } = useQuery({
    queryKey: ['/api/sophiemodels/analytics/overview'],
  });

  // Create model mutation
  const createModelMutation = useMutation({
    mutationFn: (data: any) => apiRequest('/api/sophiemodels/models', 'POST', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/sophiemodels/models'] });
      queryClient.invalidateQueries({ queryKey: ['/api/sophiemodels/analytics/overview'] });
    }
  });

  // Create training job mutation
  const createTrainingJobMutation = useMutation({
    mutationFn: (data: any) => apiRequest('/api/sophiemodels/training-jobs', 'POST', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/sophiemodels/training-jobs'] });
      queryClient.invalidateQueries({ queryKey: ['/api/sophiemodels/analytics/overview'] });
    }
  });

  // Create deployment mutation
  const createDeploymentMutation = useMutation({
    mutationFn: (data: any) => apiRequest('/api/sophiemodels/deployments', 'POST', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/sophiemodels/deployments'] });
      queryClient.invalidateQueries({ queryKey: ['/api/sophiemodels/analytics/overview'] });
    }
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': 
      case 'completed':
      case 'deployed': return 'bg-green-100 text-green-800';
      case 'running':
      case 'deploying': 
      case 'training': return 'bg-blue-100 text-blue-800';
      case 'queued':
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'failed':
      case 'error': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getModelTypeColor = (type: string) => {
    switch (type) {
      case 'NEURAL': return 'bg-blue-100 text-blue-800';
      case 'SYMBOLIC': return 'bg-purple-100 text-purple-800';
      case 'HYBRID': return 'bg-green-100 text-green-800';
      case 'EVOLUTIONARY': return 'bg-orange-100 text-orange-800';
      case 'QUANTUM': return 'bg-pink-100 text-pink-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleCreateModel = () => {
    createModelMutation.mutate({
      modelName: 'SophieCore-3B',
      modelType: 'NEURAL',
      architecture: 'TRANSFORMER',
      paradigm: 'SUPERVISED',
      category: 'FOUNDATION',
      domain: 'GENERAL',
      capabilities: {
        reasoning: true,
        codeGeneration: false,
        multilingualSupport: true,
        mathProblemSolving: false
      },
      parameters: {
        numParameters: '3B',
        hiddenSize: 2048,
        numLayers: 24,
        numAttentionHeads: 16
      },
      modelSize: '3B',
      contextLength: 4096,
      inputModalities: ['text'],
      outputModalities: ['text'],
      benchmarkScores: {
        mmlu: 0.45,
        hellaswag: 0.72,
        humaneval: 0.18
      },
      computeRequirements: {
        gpu: 'RTX 4090',
        memory: '24GB',
        storage: '8GB'
      },
      version: '1.0.0',
      isActive: true,
      isPublic: false,
      license: 'MIT',
      authorOrganization: 'SocratIQ Research'
    });
  };

  const handleCreateTrainingJob = () => {
    createTrainingJobMutation.mutate({
      jobName: 'SophieCore Fine-tuning',
      baseModelId: models?.models[0]?.id || 'model_001',
      trainingType: 'FINE_TUNING',
      trainingMethod: 'SUPERVISED',
      dataset: {
        name: 'domain_specific_qa',
        size: 50000,
        format: 'json'
      },
      trainingConfig: {
        batchSize: 16,
        learningRate: 0.0001,
        epochs: 3,
        optimizer: 'AdamW'
      },
      computeResources: {
        gpuType: 'A100',
        gpuCount: 4,
        memory: '160GB'
      }
    });
  };

  const handleCreateDeployment = () => {
    createDeploymentMutation.mutate({
      modelId: models?.models[0]?.id || 'model_001',
      deploymentName: 'SophieCore Production',
      environment: 'production',
      deploymentType: 'INFERENCE_SERVER',
      scalingConfig: {
        minInstances: 2,
        maxInstances: 10,
        targetCPU: 70
      },
      resourceAllocation: {
        cpu: '4 cores',
        memory: '16GB',
        gpu: 'T4'
      }
    });
  };

  if (modelsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-sm text-muted-foreground">Loading SophieModels™ AI Cognitive Toolkit...</p>
        </div>
      </div>
    );
  }

  const filteredModels = models?.models?.filter(model =>
    model.modelName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    model.modelType.toLowerCase().includes(searchTerm.toLowerCase()) ||
    model.architecture.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">SocratIQ SophieModels™ - AI Cognitive Toolkit</h1>
          <p className="text-muted-foreground">
            Multi-paradigm AI model portfolio with specialized agent families and cognitive architectures
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search models..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 w-64"
            />
          </div>
          <Button onClick={handleCreateModel} disabled={createModelMutation.isPending}>
            <Plus className="h-4 w-4 mr-2" />
            New Model
          </Button>
        </div>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="models">Models</TabsTrigger>
          <TabsTrigger value="training">Training</TabsTrigger>
          <TabsTrigger value="deployments">Deployments</TabsTrigger>
          <TabsTrigger value="families">Agent Families</TabsTrigger>
          <TabsTrigger value="repositories">Repositories</TabsTrigger>
          <TabsTrigger value="architectures">Architectures</TabsTrigger>
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
                  {(analytics as any)?.totalModels || 0} total models
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Training Jobs</CardTitle>
                <Zap className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{(analytics as any)?.trainingJobs?.running || 0}</div>
                <p className="text-xs text-muted-foreground">
                  {(analytics as any)?.trainingJobs?.total || 0} total jobs
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Deployments</CardTitle>
                <Server className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{(analytics as any)?.deployments?.active || 0}</div>
                <p className="text-xs text-muted-foreground">
                  {(analytics as any)?.deployments?.production || 0} in production
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Agent Families</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{(analytics as any)?.agentFamilies?.active || 0}</div>
                <p className="text-xs text-muted-foreground">
                  {(analytics as any)?.agentFamilies?.total || 0} total families
                </p>
              </CardContent>
            </Card>
          </div>

          {/* SophieModels™ Components */}
          <Card>
            <CardHeader>
              <CardTitle>SophieModels™ AI Cognitive Toolkit</CardTitle>
              <CardDescription>Multi-paradigm AI model portfolio with specialized capabilities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <div className="flex items-center space-x-3 p-3 border rounded-lg">
                  <Brain className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="font-medium">Foundation Models</p>
                    <p className="text-sm text-muted-foreground">
                      Large-scale pre-trained models
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 border rounded-lg">
                  <Users className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="font-medium">Agent Families</p>
                    <p className="text-sm text-muted-foreground">
                      Specialized agent collections
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 border rounded-lg">
                  <Layers className="h-5 w-5 text-purple-600" />
                  <div>
                    <p className="font-medium">Cognitive Architectures</p>
                    <p className="text-sm text-muted-foreground">
                      System-level designs
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 border rounded-lg">
                  <Database className="h-5 w-5 text-orange-600" />
                  <div>
                    <p className="font-medium">Model Repositories</p>
                    <p className="text-sm text-muted-foreground">
                      Centralized model storage
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Models */}
          {models?.models && models.models.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Recent AI Models</CardTitle>
                <CardDescription>Latest models in the cognitive toolkit</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {models.models.slice(0, 5).map((model) => (
                    <div key={model.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Badge className={getModelTypeColor(model.modelType)}>
                          {model.modelType}
                        </Badge>
                        <div>
                          <p className="font-medium text-sm">{model.modelName}</p>
                          <p className="text-xs text-muted-foreground">
                            {model.architecture} • {model.modelSize} • v{model.version}
                          </p>
                        </div>
                      </div>
                      <div className="text-right text-sm">
                        <Badge className={getStatusColor(model.isActive ? 'active' : 'inactive')}>
                          {model.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                        <p className="text-muted-foreground mt-1">{new Date(model.createdAt).toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="models">
          <Card>
            <CardHeader>
              <CardTitle>AI Model Portfolio</CardTitle>
              <CardDescription>Multi-paradigm AI models with specialized capabilities</CardDescription>
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
                              <Brain className="h-5 w-5" />
                            </div>
                            <div>
                              <h4 className="font-medium">{model.modelName}</h4>
                              <div className="flex items-center space-x-2 mt-1">
                                <Badge className={getModelTypeColor(model.modelType)}>
                                  {model.modelType}
                                </Badge>
                                <Badge variant="outline">{model.architecture}</Badge>
                                <Badge variant="outline">{model.category}</Badge>
                                <span className="text-sm text-muted-foreground">
                                  {model.modelSize}
                                </span>
                              </div>
                              <p className="text-sm text-muted-foreground mt-1">
                                Domain: {model.domain} • Version: {model.version}
                              </p>
                            </div>
                          </div>
                          <div className="text-right text-sm">
                            <Badge className={getStatusColor(model.isActive ? 'active' : 'inactive')}>
                              {model.isActive ? 'Active' : 'Inactive'}
                            </Badge>
                            <p className="text-muted-foreground mt-1">
                              {new Date(model.createdAt).toLocaleDateString()}
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
                  <h3 className="text-lg font-medium mb-2">No AI models found</h3>
                  <p className="text-muted-foreground mb-4">
                    {searchTerm ? 'Try adjusting your search terms' : 'Create your first AI model'}
                  </p>
                  {!searchTerm && (
                    <Button onClick={handleCreateModel}>
                      <Plus className="h-4 w-4 mr-2" />
                      Create Model
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="training">
          <Card>
            <CardHeader>
              <CardTitle>Training Infrastructure</CardTitle>
              <CardDescription>Model training and fine-tuning operations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-medium">Training Jobs</h3>
                  <p className="text-sm text-muted-foreground">Monitor model training progress</p>
                </div>
                <Button onClick={handleCreateTrainingJob} disabled={createTrainingJobMutation.isPending}>
                  <Play className="h-4 w-4 mr-2" />
                  Start Training
                </Button>
              </div>
              {trainingJobs && trainingJobs.length > 0 ? (
                <div className="space-y-4">
                  {trainingJobs.slice(0, 10).map((job) => (
                    <div key={job.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Zap className="h-4 w-4 text-blue-600" />
                        <div>
                          <p className="font-medium">{job.jobName}</p>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge variant="outline">{job.trainingType}</Badge>
                            <Badge className={getStatusColor(job.status)}>
                              {job.status}
                            </Badge>
                            <span className="text-sm text-muted-foreground">
                              {job.progressPercentage}% complete
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right text-sm">
                        <p className="text-muted-foreground">
                          {new Date(job.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Zap className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No training jobs found</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="deployments">
          <Card>
            <CardHeader>
              <CardTitle>Model Deployments</CardTitle>
              <CardDescription>Production model deployment and scaling</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-medium">Active Deployments</h3>
                  <p className="text-sm text-muted-foreground">Monitor model serving infrastructure</p>
                </div>
                <Button onClick={handleCreateDeployment} disabled={createDeploymentMutation.isPending}>
                  <Server className="h-4 w-4 mr-2" />
                  Deploy Model
                </Button>
              </div>
              {deployments && deployments.length > 0 ? (
                <div className="space-y-4">
                  {deployments.slice(0, 10).map((deployment) => (
                    <div key={deployment.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Server className="h-4 w-4 text-green-600" />
                        <div>
                          <p className="font-medium">Model: {deployment.modelId}</p>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge variant="outline">{deployment.environment}</Badge>
                            <Badge variant="outline">{deployment.deploymentType}</Badge>
                            <Badge className={getStatusColor(deployment.status)}>
                              {deployment.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            Endpoint: {deployment.endpoint}
                          </p>
                        </div>
                      </div>
                      <div className="text-right text-sm">
                        <p className="text-muted-foreground">
                          {new Date(deployment.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Server className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No deployments found</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="families">
          <Card>
            <CardHeader>
              <CardTitle>Agent Families</CardTitle>
              <CardDescription>Specialized agent collections for domain-specific tasks</CardDescription>
            </CardHeader>
            <CardContent>
              {agentFamilies && agentFamilies.length > 0 ? (
                <div className="space-y-4">
                  {agentFamilies.slice(0, 10).map((family) => (
                    <div key={family.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Users className="h-4 w-4 text-purple-600" />
                        <div>
                          <p className="font-medium">{family.familyName}</p>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge variant="outline">{family.familyType}</Badge>
                            <Badge variant="outline">{family.domain}</Badge>
                            <Badge variant="outline">v{family.version}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            {family.description}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {family.isActive ? (
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
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No agent families configured</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="repositories">
          <Card>
            <CardHeader>
              <CardTitle>Model Repositories</CardTitle>
              <CardDescription>Centralized model storage and version control</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <Database className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Model repositories will be displayed here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="architectures">
          <Card>
            <CardHeader>
              <CardTitle>Cognitive Architectures</CardTitle>
              <CardDescription>High-level system designs and reasoning frameworks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <Layers className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Cognitive architectures will be displayed here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}