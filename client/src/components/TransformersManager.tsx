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
  Cpu, 
  Zap, 
  Brain, 
  Activity, 
  Settings, 
  Download, 
  Upload, 
  Play, 
  Pause, 
  RefreshCw,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  Database,
  BarChart3,
  FileText,
  Target
} from 'lucide-react';

interface TransformerModel {
  id: string;
  name: string;
  type: 'BERT' | 'RoBERTa' | 'DistilBERT' | 'ELECTRA' | 'DeBERTa' | 'Custom';
  size: string;
  status: 'active' | 'inactive' | 'training' | 'loading' | 'error';
  description: string;
  parameters: string;
  accuracy: number;
  inferenceTime: number;
  memoryUsage: string;
  domain: string;
  lastTrained: string;
  version: string;
  downloadUrl?: string;
  capabilities: string[];
}

interface TransformerMetrics {
  totalModels: number;
  activeModels: number;
  trainingJobs: number;
  totalInferences: number;
  averageAccuracy: number;
  averageInferenceTime: number;
}

export default function TransformersManager() {
  const [selectedModel, setSelectedModel] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [domainFilter, setDomainFilter] = useState('all');

  const { data: models = [], isLoading: modelsLoading } = useQuery<TransformerModel[]>({
    queryKey: ['/api/transformers/models'],
  });

  const { data: metrics, isLoading: metricsLoading } = useQuery<TransformerMetrics>({
    queryKey: ['/api/transformers/metrics'],
  });

  const { data: trainingJobs = [] } = useQuery<any[]>({
    queryKey: ['/api/transformers/training-jobs'],
  });

  const { data: benchmarks = [] } = useQuery<any[]>({
    queryKey: ['/api/transformers/benchmarks'],
  });

  const filteredModels = models.filter(model => {
    const matchesSearch = model.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         model.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || model.type === typeFilter;
    const matchesStatus = statusFilter === 'all' || model.status === statusFilter;
    const matchesDomain = domainFilter === 'all' || model.domain === domainFilter;
    
    return matchesSearch && matchesType && matchesStatus && matchesDomain;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'inactive': return 'bg-gray-500';
      case 'training': return 'bg-blue-500';
      case 'loading': return 'bg-yellow-500';
      case 'error': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="h-4 w-4" />;
      case 'inactive': return <Pause className="h-4 w-4" />;
      case 'training': return <Activity className="h-4 w-4" />;
      case 'loading': return <RefreshCw className="h-4 w-4 animate-spin" />;
      case 'error': return <XCircle className="h-4 w-4" />;
      default: return <AlertCircle className="h-4 w-4" />;
    }
  };

  const getModelTypeColor = (type: string) => {
    switch (type) {
      case 'BERT': return 'bg-blue-100 text-blue-800';
      case 'RoBERTa': return 'bg-green-100 text-green-800';
      case 'DistilBERT': return 'bg-purple-100 text-purple-800';
      case 'ELECTRA': return 'bg-orange-100 text-orange-800';
      case 'DeBERTa': return 'bg-red-100 text-red-800';
      case 'Custom': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (modelsLoading || metricsLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-2 mb-6">
          <Cpu className="h-6 w-6 text-blue-600" />
          <h1 className="text-3xl font-bold">Transformers & BERT Models</h1>
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
          <Cpu className="h-6 w-6 text-blue-600" />
          <h1 className="text-3xl font-bold">Transformers & BERT Models</h1>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Import Model
          </Button>
          <Button>
            <Brain className="h-4 w-4 mr-2" />
            Train New Model
          </Button>
        </div>
      </div>

      {/* Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Models</p>
                <p className="text-2xl font-bold">{metrics?.totalModels || 0}</p>
              </div>
              <Database className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Models</p>
                <p className="text-2xl font-bold text-green-600">{metrics?.activeModels || 0}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Training Jobs</p>
                <p className="text-2xl font-bold text-blue-600">{metrics?.trainingJobs || 0}</p>
              </div>
              <Activity className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Accuracy</p>
                <p className="text-2xl font-bold text-purple-600">{metrics?.averageAccuracy || 0}%</p>
              </div>
              <Target className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="models" className="space-y-4">
        <TabsList>
          <TabsTrigger value="models">Models</TabsTrigger>
          <TabsTrigger value="training">Training</TabsTrigger>
          <TabsTrigger value="benchmarks">Benchmarks</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="models" className="space-y-4">
          {/* Filters */}
          <div className="flex gap-4 items-center flex-wrap">
            <Input
              placeholder="Search models..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="BERT">BERT</SelectItem>
                <SelectItem value="RoBERTa">RoBERTa</SelectItem>
                <SelectItem value="DistilBERT">DistilBERT</SelectItem>
                <SelectItem value="ELECTRA">ELECTRA</SelectItem>
                <SelectItem value="DeBERTa">DeBERTa</SelectItem>
                <SelectItem value="Custom">Custom</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="training">Training</SelectItem>
                <SelectItem value="loading">Loading</SelectItem>
                <SelectItem value="error">Error</SelectItem>
              </SelectContent>
            </Select>
            <Select value={domainFilter} onValueChange={setDomainFilter}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Domains</SelectItem>
                <SelectItem value="pharmaceutical">Pharmaceutical</SelectItem>
                <SelectItem value="biomedical">Biomedical</SelectItem>
                <SelectItem value="clinical">Clinical</SelectItem>
                <SelectItem value="regulatory">Regulatory</SelectItem>
                <SelectItem value="general">General NLP</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Models Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredModels.map((model) => (
              <Card key={model.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${getStatusColor(model.status)}`} />
                      <CardTitle className="text-lg">{model.name}</CardTitle>
                    </div>
                    <Badge className={getModelTypeColor(model.type)}>
                      {model.type}
                    </Badge>
                  </div>
                  <CardDescription className="text-sm">
                    {model.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Parameters:</span>
                    <Badge variant="outline">{model.parameters}</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Domain:</span>
                    <Badge variant="secondary">{model.domain}</Badge>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Accuracy</span>
                      <span>{model.accuracy}%</span>
                    </div>
                    <Progress value={model.accuracy} className="h-2" />
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Inference Time:</span>
                    <span className="font-medium">{model.inferenceTime}ms</span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Memory Usage:</span>
                    <span className="font-medium">{model.memoryUsage}</span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Model Size:</span>
                    <span className="font-medium">{model.size}</span>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button size="sm" variant="outline" className="flex-1">
                      <Settings className="h-4 w-4 mr-1" />
                      Configure
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1">
                      {model.status === 'active' ? (
                        <>
                          <Pause className="h-4 w-4 mr-1" />
                          Stop
                        </>
                      ) : (
                        <>
                          <Play className="h-4 w-4 mr-1" />
                          Deploy
                        </>
                      )}
                    </Button>
                  </div>

                  {/* Capabilities Tags */}
                  <div className="flex flex-wrap gap-1 pt-2">
                    {model.capabilities.slice(0, 3).map((capability) => (
                      <Badge key={capability} variant="outline" className="text-xs">
                        {capability}
                      </Badge>
                    ))}
                    {model.capabilities.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{model.capabilities.length - 3} more
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="training" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Active Training Jobs</CardTitle>
              <CardDescription>
                Monitor ongoing transformer model training and fine-tuning
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {trainingJobs.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Activity className="h-12 w-12 mx-auto mb-2" />
                    <p>No active training jobs</p>
                    <p className="text-sm">Start training a new transformer model</p>
                  </div>
                ) : (
                  trainingJobs.map((job, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <Activity className="h-5 w-5 text-blue-500" />
                      <div className="flex-1">
                        <p className="font-medium">{job.modelName}</p>
                        <p className="text-sm text-gray-600">{job.status}</p>
                        <Progress value={job.progress} className="h-2 mt-2" />
                      </div>
                      <div className="text-right text-sm">
                        <p className="font-medium">{job.progress}%</p>
                        <p className="text-gray-500">{job.eta}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="benchmarks" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Performance Benchmarks</CardTitle>
              <CardDescription>
                Compare transformer model performance across different tasks
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <BarChart3 className="h-12 w-12 mx-auto mb-2" />
                  <p>Performance benchmarks</p>
                  <p className="text-sm">Model accuracy and speed comparisons</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Transformer Settings</CardTitle>
              <CardDescription>
                Global configuration for transformer models and training
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Auto Model Updates</h4>
                    <p className="text-sm text-gray-600">Automatically update models with new versions</p>
                  </div>
                  <Button variant="outline" size="sm">Configure</Button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Resource Allocation</h4>
                    <p className="text-sm text-gray-600">Manage GPU/CPU resources for training and inference</p>
                  </div>
                  <Button variant="outline" size="sm">Configure</Button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Model Registry</h4>
                    <p className="text-sm text-gray-600">Configure model storage and versioning</p>
                  </div>
                  <Button variant="outline" size="sm">Configure</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}