import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Slider } from '@/components/ui/slider';
import { 
  Brain,
  Zap,
  Server,
  Cpu,
  BarChart3,
  Settings,
  Play,
  Pause,
  RefreshCw,
  Download,
  Upload,
  Activity,
  Clock,
  Target,
  Scale,
  Database,
  Network,
  Layers,
  Code,
  MessageSquare,
  FileText,
  Eye,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Gauge
} from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';

interface LLMModel {
  id: string;
  name: string;
  type: 'large_language_model' | 'small_language_model';
  architecture: 'GPT' | 'MoE' | 'LRM' | 'VLM' | 'LAM' | 'Custom';
  provider: string;
  model_family: string;
  parameters: string;
  context_length: number;
  status: 'active' | 'loading' | 'inactive' | 'fine_tuning' | 'error';
  capabilities: string[];
  specializations: string[];
  multimodal_support?: {
    text: boolean;
    vision: boolean;
    audio: boolean;
    video: boolean;
    code: boolean;
    actions: boolean;
  };
  expert_routing?: {
    num_experts: number;
    experts_per_token: number;
    routing_strategy: string;
    specialization_domains: string[];
  };
  performance_metrics: {
    tokens_per_second: number;
    latency_p95: number;
    memory_usage: string;
    cost_per_1k_tokens: number;
    accuracy_benchmark: number;
    multimodal_accuracy?: Record<string, number>;
  };
  usage_stats: {
    total_requests: number;
    daily_requests: number;
    total_tokens_processed: number;
    avg_response_length: number;
    error_rate: number;
  };
  fine_tuning?: {
    base_model: string;
    training_data_size: string;
    epochs_completed: number;
    validation_loss: number;
    status: 'training' | 'completed' | 'failed';
  };
}

interface ModelInference {
  id: string;
  model_id: string;
  request_id: string;
  prompt: string;
  response: string;
  tokens_input: number;
  tokens_output: number;
  latency: number;
  timestamp: string;
  cost: number;
  quality_score: number;
}

interface ModelComparison {
  models: string[];
  prompt: string;
  responses: Array<{
    model_id: string;
    response: string;
    metrics: {
      latency: number;
      cost: number;
      quality: number;
      creativity: number;
      accuracy: number;
    };
  }>;
}

interface FineTuningJob {
  id: string;
  model_name: string;
  base_model: string;
  status: 'preparing' | 'training' | 'validating' | 'completed' | 'failed';
  progress: number;
  training_data_size: number;
  epochs_total: number;
  epochs_completed: number;
  current_loss: number;
  validation_loss: number;
  estimated_completion: string;
  created_at: string;
}

export default function LLMManager() {
  const [selectedTab, setSelectedTab] = useState('overview');
  const [testPrompt, setTestPrompt] = useState('');
  const [selectedModel, setSelectedModel] = useState<string>('');
  const [comparisonPrompt, setComparisonPrompt] = useState('');
  const [selectedModelsForComparison, setSelectedModelsForComparison] = useState<string[]>([]);
  const queryClient = useQueryClient();

  const { data: llmModels = [], isLoading: modelsLoading } = useQuery<LLMModel[]>({
    queryKey: ['/api/llm/models'],
  });

  const { data: recentInferences = [] } = useQuery<ModelInference[]>({
    queryKey: ['/api/llm/recent-inferences'],
  });

  const { data: fineTuningJobs = [] } = useQuery<FineTuningJob[]>({
    queryKey: ['/api/llm/fine-tuning-jobs'],
  });

  const { data: systemMetrics } = useQuery({
    queryKey: ['/api/llm/system-metrics'],
  });

  const testInferenceMutation = useMutation({
    mutationFn: async (data: any) => apiRequest('/api/llm/inference', {
      method: 'POST',
      body: JSON.stringify(data)
    })
  });

  const compareModelsMutation = useMutation({
    mutationFn: async (data: any) => apiRequest('/api/llm/compare', {
      method: 'POST',
      body: JSON.stringify(data)
    })
  });

  const startFineTuningMutation = useMutation({
    mutationFn: async (data: any) => apiRequest('/api/llm/fine-tuning', {
      method: 'POST',
      body: JSON.stringify(data)
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/llm/fine-tuning-jobs'] });
    }
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'loading': case 'fine_tuning': case 'training': return 'bg-yellow-100 text-yellow-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'error': case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  const getModelTypeIcon = (type: string) => {
    return type === 'large_language_model' ? Brain : Zap;
  };

  const getArchitectureIcon = (architecture: string) => {
    switch (architecture) {
      case 'GPT': return Brain;
      case 'MoE': return Network;
      case 'LRM': return Layers;
      case 'VLM': return Eye;
      case 'LAM': return Target;
      default: return Cpu;
    }
  };

  const getArchitectureColor = (architecture: string) => {
    switch (architecture) {
      case 'GPT': return 'text-blue-600';
      case 'MoE': return 'text-green-600';
      case 'LRM': return 'text-purple-600';
      case 'VLM': return 'text-orange-600';
      case 'LAM': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1e9) return (num / 1e9).toFixed(1) + 'B';
    if (num >= 1e6) return (num / 1e6).toFixed(1) + 'M';
    if (num >= 1e3) return (num / 1e3).toFixed(1) + 'K';
    return num.toString();
  };

  if (modelsLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-2 mb-6">
          <Brain className="h-6 w-6 text-blue-600" />
          <h1 className="text-3xl font-bold">Large & Small Language Models</h1>
        </div>
        <div className="h-96 bg-gray-200 animate-pulse rounded-lg" />
      </div>
    );
  }

  const largeModels = llmModels.filter(m => m.type === 'large_language_model');
  const smallModels = llmModels.filter(m => m.type === 'small_language_model');

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Brain className="h-6 w-6 text-blue-600" />
          <h1 className="text-3xl font-bold">Language Model Management</h1>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button size="sm">
            <Download className="h-4 w-4 mr-2" />
            Deploy Model
          </Button>
        </div>
      </div>

      {/* System Overview */}
      {systemMetrics && (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Large Models</CardTitle>
              <Brain className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{largeModels.length}</div>
              <p className="text-xs text-muted-foreground">
                {largeModels.filter(m => m.status === 'active').length} active
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Small Models</CardTitle>
              <Zap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{smallModels.length}</div>
              <p className="text-xs text-muted-foreground">
                {smallModels.filter(m => m.status === 'active').length} active
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatNumber(llmModels.reduce((sum, m) => sum + m.usage_stats.daily_requests, 0))}
              </div>
              <p className="text-xs text-muted-foreground">
                Today
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Latency</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{systemMetrics.avgLatency}ms</div>
              <p className="text-xs text-muted-foreground">
                P95 response time
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Fine-tuning Jobs</CardTitle>
              <Settings className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{fineTuningJobs.length}</div>
              <p className="text-xs text-muted-foreground">
                {fineTuningJobs.filter(j => j.status === 'training').length} running
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="large-models">Large Models</TabsTrigger>
          <TabsTrigger value="small-models">Small Models</TabsTrigger>
          <TabsTrigger value="architectures">Architectures</TabsTrigger>
          <TabsTrigger value="testing">Model Testing</TabsTrigger>
          <TabsTrigger value="comparison">Model Comparison</TabsTrigger>
          <TabsTrigger value="fine-tuning">Fine-tuning</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Active Models Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Active Models Performance
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {llmModels.filter(m => m.status === 'active').slice(0, 6).map((model) => {
                  const IconComponent = getModelTypeIcon(model.type);
                  return (
                    <div key={model.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <IconComponent className="h-5 w-5 text-blue-600" />
                        <div>
                          <div className="font-medium">{model.name}</div>
                          <div className="text-sm text-gray-600">
                            {model.parameters} • {model.performance_metrics.tokens_per_second} tok/s
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">
                          {model.usage_stats.daily_requests.toLocaleString()} req/day
                        </div>
                        <div className="text-xs text-gray-600">
                          {model.performance_metrics.latency_p95}ms latency
                        </div>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            {/* Recent Inferences */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Recent Inferences
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {recentInferences.slice(0, 6).map((inference) => (
                  <div key={inference.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <div className="text-sm font-medium truncate">
                        {inference.prompt.length > 50 ? inference.prompt.substring(0, 50) + '...' : inference.prompt}
                      </div>
                      <div className="text-xs text-gray-600">
                        {inference.tokens_input + inference.tokens_output} tokens • ${inference.cost.toFixed(4)}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {inference.latency}ms
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {(inference.quality_score * 100).toFixed(0)}%
                      </Badge>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* System Health */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gauge className="h-5 w-5" />
                System Health & Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">99.2%</div>
                  <div className="text-sm text-gray-600">Uptime</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {formatNumber(llmModels.reduce((sum, m) => sum + m.usage_stats.total_requests, 0))}
                  </div>
                  <div className="text-sm text-gray-600">Total Requests</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {formatNumber(llmModels.reduce((sum, m) => sum + m.usage_stats.total_tokens_processed, 0))}
                  </div>
                  <div className="text-sm text-gray-600">Tokens Processed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">0.05%</div>
                  <div className="text-sm text-gray-600">Error Rate</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="large-models" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {largeModels.map((model) => (
              <Card key={model.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Brain className="h-5 w-5 text-blue-600" />
                      <CardTitle className="text-lg">{model.name}</CardTitle>
                    </div>
                    <Badge className={getStatusColor(model.status)}>
                      {model.status}
                    </Badge>
                  </div>
                  <CardDescription>
                    {model.provider} • {model.model_family} • {model.parameters}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Context Length:</span>
                      <div className="font-medium">{model.context_length.toLocaleString()}</div>
                    </div>
                    <div>
                      <span className="text-gray-600">Speed:</span>
                      <div className="font-medium">{model.performance_metrics.tokens_per_second} tok/s</div>
                    </div>
                    <div>
                      <span className="text-gray-600">Cost:</span>
                      <div className="font-medium">${model.performance_metrics.cost_per_1k_tokens}/1K</div>
                    </div>
                    <div>
                      <span className="text-gray-600">Accuracy:</span>
                      <div className="font-medium">{model.performance_metrics.accuracy_benchmark}%</div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Daily Requests:</span>
                      <span>{model.usage_stats.daily_requests.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Latency (P95):</span>
                      <span>{model.performance_metrics.latency_p95}ms</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Memory Usage:</span>
                      <span>{model.performance_metrics.memory_usage}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Error Rate:</span>
                      <span>{(model.usage_stats.error_rate * 100).toFixed(2)}%</span>
                    </div>
                  </div>

                  <div>
                    <span className="text-sm text-gray-600">Capabilities:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {model.capabilities.slice(0, 4).map((capability) => (
                        <Badge key={capability} variant="outline" className="text-xs">
                          {capability}
                        </Badge>
                      ))}
                      {model.capabilities.length > 4 && (
                        <Badge variant="outline" className="text-xs">
                          +{model.capabilities.length - 4} more
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button variant="outline" size="sm">
                      <Play className="h-4 w-4 mr-2" />
                      Test
                    </Button>
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-2" />
                      Monitor
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

        <TabsContent value="small-models" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {smallModels.map((model) => (
              <Card key={model.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Zap className="h-5 w-5 text-green-600" />
                      <CardTitle className="text-lg">{model.name}</CardTitle>
                      <Badge variant="outline" className="text-xs">
                        {model.architecture}
                      </Badge>
                    </div>
                    <Badge className={getStatusColor(model.status)}>
                      {model.status}
                    </Badge>
                  </div>
                  <CardDescription>
                    {model.provider} • {model.model_family} • {model.parameters}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Context Length:</span>
                      <div className="font-medium">{model.context_length.toLocaleString()}</div>
                    </div>
                    <div>
                      <span className="text-gray-600">Speed:</span>
                      <div className="font-medium">{model.performance_metrics.tokens_per_second} tok/s</div>
                    </div>
                    <div>
                      <span className="text-gray-600">Cost:</span>
                      <div className="font-medium">${model.performance_metrics.cost_per_1k_tokens}/1K</div>
                    </div>
                    <div>
                      <span className="text-gray-600">Accuracy:</span>
                      <div className="font-medium">{model.performance_metrics.accuracy_benchmark}%</div>
                    </div>
                  </div>

                  <div>
                    <span className="text-sm text-gray-600">Specializations:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {model.specializations.map((spec) => (
                        <Badge key={spec} variant="outline" className="text-xs">
                          {spec}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button variant="outline" size="sm">
                      <Play className="h-4 w-4 mr-2" />
                      Test
                    </Button>
                    <Button variant="outline" size="sm">
                      <Scale className="h-4 w-4 mr-2" />
                      Compare
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="architectures" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* GPT Models */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-blue-600" />
                  GPT Models
                </CardTitle>
                <CardDescription>Generative Pre-trained Transformers</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {llmModels.filter(m => m.architecture === 'GPT').map((model) => (
                  <div key={model.id} className="p-3 border rounded-lg">
                    <div className="font-medium text-sm">{model.name}</div>
                    <div className="text-xs text-gray-600">{model.parameters} parameters</div>
                    <div className="flex justify-between mt-2 text-xs">
                      <span>Speed: {model.performance_metrics.tokens_per_second} tok/s</span>
                      <Badge className={getStatusColor(model.status)} variant="outline">
                        {model.status}
                      </Badge>
                    </div>
                  </div>
                ))}
                {llmModels.filter(m => m.architecture === 'GPT').length === 0 && (
                  <div className="text-center py-4 text-gray-500 text-sm">
                    No GPT models deployed
                  </div>
                )}
              </CardContent>
            </Card>

            {/* MoE Models */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Network className="h-5 w-5 text-green-600" />
                  MoE Models
                </CardTitle>
                <CardDescription>Mixture of Experts Architecture</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {llmModels.filter(m => m.architecture === 'MoE').map((model) => (
                  <div key={model.id} className="p-3 border rounded-lg">
                    <div className="font-medium text-sm">{model.name}</div>
                    <div className="text-xs text-gray-600">
                      {model.expert_routing?.num_experts} experts • {model.parameters} parameters
                    </div>
                    <div className="flex justify-between mt-2 text-xs">
                      <span>{model.expert_routing?.experts_per_token} experts/token</span>
                      <Badge className={getStatusColor(model.status)} variant="outline">
                        {model.status}
                      </Badge>
                    </div>
                  </div>
                ))}
                {llmModels.filter(m => m.architecture === 'MoE').length === 0 && (
                  <div className="text-center py-4 text-gray-500 text-sm">
                    No MoE models deployed
                  </div>
                )}
              </CardContent>
            </Card>

            {/* LRM Models */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Layers className="h-5 w-5 text-purple-600" />
                  LRM Models
                </CardTitle>
                <CardDescription>Large Reasoning Models</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {llmModels.filter(m => m.architecture === 'LRM').map((model) => (
                  <div key={model.id} className="p-3 border rounded-lg">
                    <div className="font-medium text-sm">{model.name}</div>
                    <div className="text-xs text-gray-600">{model.parameters} parameters</div>
                    <div className="flex justify-between mt-2 text-xs">
                      <span>Reasoning: {model.performance_metrics.accuracy_benchmark}%</span>
                      <Badge className={getStatusColor(model.status)} variant="outline">
                        {model.status}
                      </Badge>
                    </div>
                  </div>
                ))}
                {llmModels.filter(m => m.architecture === 'LRM').length === 0 && (
                  <div className="text-center py-4 text-gray-500 text-sm">
                    No LRM models deployed
                  </div>
                )}
              </CardContent>
            </Card>

            {/* VLM Models */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5 text-orange-600" />
                  VLM Models
                </CardTitle>
                <CardDescription>Vision Language Models</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {llmModels.filter(m => m.architecture === 'VLM').map((model) => (
                  <div key={model.id} className="p-3 border rounded-lg">
                    <div className="font-medium text-sm">{model.name}</div>
                    <div className="text-xs text-gray-600">{model.parameters} parameters</div>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {model.multimodal_support?.vision && <Badge variant="outline" className="text-xs">Vision</Badge>}
                      {model.multimodal_support?.text && <Badge variant="outline" className="text-xs">Text</Badge>}
                    </div>
                    <Badge className={getStatusColor(model.status)} variant="outline" className="mt-2">
                      {model.status}
                    </Badge>
                  </div>
                ))}
                {llmModels.filter(m => m.architecture === 'VLM').length === 0 && (
                  <div className="text-center py-4 text-gray-500 text-sm">
                    No VLM models deployed
                  </div>
                )}
              </CardContent>
            </Card>

            {/* LAM Models */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-red-600" />
                  LAM Models
                </CardTitle>
                <CardDescription>Large Action Models</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {llmModels.filter(m => m.architecture === 'LAM').map((model) => (
                  <div key={model.id} className="p-3 border rounded-lg">
                    <div className="font-medium text-sm">{model.name}</div>
                    <div className="text-xs text-gray-600">{model.parameters} parameters</div>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {model.multimodal_support?.actions && <Badge variant="outline" className="text-xs">Actions</Badge>}
                      {model.multimodal_support?.code && <Badge variant="outline" className="text-xs">Code</Badge>}
                    </div>
                    <Badge className={getStatusColor(model.status)} variant="outline" className="mt-2">
                      {model.status}
                    </Badge>
                  </div>
                ))}
                {llmModels.filter(m => m.architecture === 'LAM').length === 0 && (
                  <div className="text-center py-4 text-gray-500 text-sm">
                    No LAM models deployed
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Architecture Comparison */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-gray-600" />
                  Architecture Performance
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-3">
                  {['GPT', 'MoE', 'LRM', 'VLM', 'LAM'].map((arch) => {
                    const archModels = llmModels.filter(m => m.architecture === arch);
                    const avgPerformance = archModels.length > 0 ? 
                      archModels.reduce((sum, m) => sum + m.performance_metrics.accuracy_benchmark, 0) / archModels.length : 0;
                    
                    return (
                      <div key={arch} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded ${
                            arch === 'GPT' ? 'bg-blue-600' :
                            arch === 'MoE' ? 'bg-green-600' :
                            arch === 'LRM' ? 'bg-purple-600' :
                            arch === 'VLM' ? 'bg-orange-600' :
                            'bg-red-600'
                          }`} />
                          <span className="text-sm">{arch}</span>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium">{avgPerformance.toFixed(1)}%</div>
                          <div className="text-xs text-gray-600">{archModels.length} models</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="testing" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Model Testing Interface</CardTitle>
              <CardDescription>Test individual models with custom prompts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Select Model</label>
                <Select value={selectedModel} onValueChange={setSelectedModel}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a model to test" />
                  </SelectTrigger>
                  <SelectContent>
                    {llmModels.map((model) => (
                      <SelectItem key={model.id} value={model.id}>
                        {model.name} ({model.type})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium">Test Prompt</label>
                <Textarea
                  placeholder="Enter your test prompt here..."
                  value={testPrompt}
                  onChange={(e) => setTestPrompt(e.target.value)}
                  rows={4}
                />
              </div>
              
              <Button 
                onClick={() => testInferenceMutation.mutate({ 
                  model_id: selectedModel, 
                  prompt: testPrompt 
                })}
                disabled={!selectedModel || !testPrompt || testInferenceMutation.isPending}
                className="w-full"
              >
                {testInferenceMutation.isPending ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Testing Model...
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 mr-2" />
                    Test Model
                  </>
                )}
              </Button>

              {testInferenceMutation.data && (
                <div className="mt-4 p-4 border rounded-lg bg-gray-50">
                  <h4 className="font-medium mb-2">Model Response</h4>
                  <div className="space-y-2">
                    <div className="text-sm text-gray-700 whitespace-pre-wrap">
                      {testInferenceMutation.data.response}
                    </div>
                    <div className="flex gap-4 text-xs text-gray-600 border-t pt-2">
                      <span>Tokens: {testInferenceMutation.data.tokens_input + testInferenceMutation.data.tokens_output}</span>
                      <span>Latency: {testInferenceMutation.data.latency}ms</span>
                      <span>Cost: ${testInferenceMutation.data.cost.toFixed(4)}</span>
                      <span>Quality: {(testInferenceMutation.data.quality_score * 100).toFixed(0)}%</span>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="comparison" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Model Comparison</CardTitle>
              <CardDescription>Compare multiple models side by side</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Select Models to Compare</label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {llmModels.slice(0, 6).map((model) => (
                    <label key={model.id} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={selectedModelsForComparison.includes(model.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedModelsForComparison([...selectedModelsForComparison, model.id]);
                          } else {
                            setSelectedModelsForComparison(selectedModelsForComparison.filter(id => id !== model.id));
                          }
                        }}
                        className="rounded"
                      />
                      <span className="text-sm">{model.name}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium">Comparison Prompt</label>
                <Textarea
                  placeholder="Enter a prompt to test across selected models..."
                  value={comparisonPrompt}
                  onChange={(e) => setComparisonPrompt(e.target.value)}
                  rows={4}
                />
              </div>
              
              <Button 
                onClick={() => compareModelsMutation.mutate({ 
                  models: selectedModelsForComparison, 
                  prompt: comparisonPrompt 
                })}
                disabled={selectedModelsForComparison.length < 2 || !comparisonPrompt || compareModelsMutation.isPending}
                className="w-full"
              >
                {compareModelsMutation.isPending ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Comparing Models...
                  </>
                ) : (
                  <>
                    <Scale className="h-4 w-4 mr-2" />
                    Compare Models
                  </>
                )}
              </Button>

              {compareModelsMutation.data && (
                <div className="mt-4 space-y-4">
                  <h4 className="font-medium">Comparison Results</h4>
                  {compareModelsMutation.data.responses.map((response: any, index: number) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h5 className="font-medium">
                          {llmModels.find(m => m.id === response.model_id)?.name}
                        </h5>
                        <div className="flex gap-2 text-xs">
                          <Badge variant="outline">
                            {response.metrics.latency}ms
                          </Badge>
                          <Badge variant="outline">
                            ${response.metrics.cost.toFixed(4)}
                          </Badge>
                        </div>
                      </div>
                      <div className="text-sm text-gray-700 mb-2 whitespace-pre-wrap">
                        {response.response}
                      </div>
                      <div className="flex gap-4 text-xs text-gray-600">
                        <span>Quality: {(response.metrics.quality * 100).toFixed(0)}%</span>
                        <span>Creativity: {(response.metrics.creativity * 100).toFixed(0)}%</span>
                        <span>Accuracy: {(response.metrics.accuracy * 100).toFixed(0)}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="fine-tuning" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Fine-tuning Jobs</CardTitle>
                <CardDescription>Monitor and manage model fine-tuning processes</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {fineTuningJobs.map((job) => (
                  <div key={job.id} className="p-4 border rounded-lg space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">{job.model_name}</div>
                        <div className="text-sm text-gray-600">
                          Based on {job.base_model} • {job.training_data_size.toLocaleString()} samples
                        </div>
                      </div>
                      <Badge className={getStatusColor(job.status)}>
                        {job.status}
                      </Badge>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progress:</span>
                        <span>{job.epochs_completed}/{job.epochs_total} epochs</span>
                      </div>
                      <Progress value={job.progress} className="w-full" />
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="flex justify-between">
                          <span>Current Loss:</span>
                          <span>{job.current_loss.toFixed(4)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Validation Loss:</span>
                          <span>{job.validation_loss.toFixed(4)}</span>
                        </div>
                      </div>
                      
                      <div className="text-xs text-gray-600">
                        Estimated completion: {job.estimated_completion}
                      </div>
                    </div>
                  </div>
                ))}
                
                {fineTuningJobs.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <Settings className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No fine-tuning jobs running</p>
                    <p className="text-sm">Start a new fine-tuning job to customize models</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Start Fine-tuning</CardTitle>
                <CardDescription>Create a new fine-tuning job</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Base Model</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select base model" />
                    </SelectTrigger>
                    <SelectContent>
                      {llmModels.filter(m => m.type === 'large_language_model').map((model) => (
                        <SelectItem key={model.id} value={model.id}>
                          {model.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-sm font-medium">Model Name</label>
                  <Input placeholder="my-custom-model" />
                </div>
                
                <div>
                  <label className="text-sm font-medium">Training Data</label>
                  <Input type="file" accept=".jsonl,.csv" />
                  <div className="text-xs text-gray-600 mt-1">
                    Upload JSONL or CSV format training data
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium">Epochs</label>
                  <Slider defaultValue={[3]} max={10} min={1} step={1} />
                  <div className="text-xs text-gray-600">
                    3 epochs (recommended)
                  </div>
                </div>
                
                <Button 
                  onClick={() => startFineTuningMutation.mutate({})}
                  disabled={startFineTuningMutation.isPending}
                  className="w-full"
                >
                  {startFineTuningMutation.isPending ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Starting...
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4 mr-2" />
                      Start Fine-tuning
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}