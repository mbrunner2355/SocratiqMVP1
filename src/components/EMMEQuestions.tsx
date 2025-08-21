import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  MessageSquare,
  Plus,
  Search,
  Filter,
  Play,
  BarChart3,
  Brain,
  Clock,
  CheckCircle,
  AlertTriangle,
  Eye,
  Edit,
  Trash2,
  Zap,
  Target,
  Activity,
  FileText,
  Users,
  TrendingUp,
  Settings,
  RefreshCw,
  Download
} from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';

interface EmmeQuestion {
  id: string;
  questionText: string;
  questionType: string;
  domain: string;
  priority: string;
  context?: string;
  expectedResponseType?: string;
  tags: string[];
  riskLevel: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  processingHistory?: any[];
}

interface QuestionResult {
  id: string;
  questionId: string;
  agentId: string;
  processingTime: number;
  confidence: number;
  responseStrategy: string;
  extractedEntities: any[];
  qualityMetrics: any[];
  processedAt: string;
}

const questionTypes = [
  'CLINICAL', 'REGULATORY', 'STRATEGIC', 'OPERATIONAL', 'RESEARCH'
];

const domains = [
  'BIOMEDICAL', 'PHARMACEUTICAL', 'CLINICAL_TRIAL', 'MARKET_ACCESS', 
  'REGULATORY_AFFAIRS', 'HEALTH_ECONOMICS', 'REAL_WORLD_EVIDENCE', 'DRUG_DEVELOPMENT'
];

const priorities = ['low', 'medium', 'high', 'urgent'];
const riskLevels = ['low', 'medium', 'high', 'critical'];

const questionSchema = z.object({
  questionText: z.string().min(10, 'Question must be at least 10 characters'),
  questionType: z.string().min(1, 'Question type is required'),
  domain: z.string().min(1, 'Domain is required'),
  priority: z.string().default('medium'),
  context: z.string().optional(),
  expectedResponseType: z.string().optional(),
  tags: z.array(z.string()).default([]),
  riskLevel: z.string().default('low'),
});

type QuestionFormData = z.infer<typeof questionSchema>;

export function EMMEQuestions() {
  const [selectedTab, setSelectedTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    questionType: '',
    domain: '',
    priority: '',
    riskLevel: '',
    isActive: 'true'
  });
  const [selectedQuestion, setSelectedQuestion] = useState<EmmeQuestion | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [processingQuestions, setProcessingQuestions] = useState<Set<string>>(new Set());

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<QuestionFormData>({
    resolver: zodResolver(questionSchema),
    defaultValues: {
      questionText: '',
      questionType: '',
      domain: '',
      priority: 'medium',
      context: '',
      expectedResponseType: '',
      tags: [],
      riskLevel: 'low',
    },
  });

  // Fetch questions with filters
  const { data: questionsData, isLoading: questionsLoading } = useQuery({
    queryKey: ['/api/emme/questions', searchTerm, filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (searchTerm) params.set('search', searchTerm);
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.set(key, value);
      });
      
      const response = await apiRequest(`/api/emme/questions?${params.toString()}`);
      return response;
    },
  });

  // Fetch statistics
  const { data: statsData } = useQuery({
    queryKey: ['/api/emme/questions/stats'],
  });

  // Create question mutation
  const createQuestionMutation = useMutation({
    mutationFn: async (data: QuestionFormData) => {
      return apiRequest('/api/emme/questions', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/emme/questions'] });
      queryClient.invalidateQueries({ queryKey: ['/api/emme/questions/stats'] });
      setIsCreateDialogOpen(false);
      form.reset();
      toast({
        title: "Success",
        description: "Question created successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create question",
        variant: "destructive",
      });
    },
  });

  // Process question mutation
  const processQuestionMutation = useMutation({
    mutationFn: async ({ questionId, agentId }: { questionId: string; agentId?: string }) => {
      return apiRequest(`/api/emme/questions/${questionId}/process`, {
        method: 'POST',
        body: JSON.stringify({ agentId: agentId || 'emme_dashboard_user' }),
      });
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['/api/emme/questions'] });
      setProcessingQuestions(prev => {
        const newSet = new Set(prev);
        newSet.delete(variables.questionId);
        return newSet;
      });
      toast({
        title: "Processing Complete",
        description: `Question processed with ${Math.round(data.analysis.confidenceMetrics.overall * 100)}% confidence`,
      });
    },
    onError: (error: any, variables) => {
      setProcessingQuestions(prev => {
        const newSet = new Set(prev);
        newSet.delete(variables.questionId);
        return newSet;
      });
      toast({
        title: "Processing Failed",
        description: error.message || "Failed to process question",
        variant: "destructive",
      });
    },
  });

  const handleProcessQuestion = (questionId: string) => {
    setProcessingQuestions(prev => new Set(prev).add(questionId));
    processQuestionMutation.mutate({ questionId });
  };

  const onSubmit = (data: QuestionFormData) => {
    createQuestionMutation.mutate(data);
  };

  const questions = questionsData?.questions || [];
  const stats = statsData?.stats || {};

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'critical': return 'destructive';
      case 'high': return 'destructive';
      case 'medium': return 'secondary';
      case 'low': return 'outline';
      default: return 'outline';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">EMME Questions</h1>
          <p className="text-muted-foreground">
            Manage questions for agent processing with advanced NLP analysis
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Question
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New EMME Question</DialogTitle>
              <DialogDescription>
                Add a new question for agent processing and analysis
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="questionText"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Question Text</FormLabel>
                      <FormControl>
                        <Textarea 
                          {...field}
                          placeholder="Enter the question that agents will process..."
                          className="min-h-[100px]"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="questionType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Question Type</FormLabel>
                        <FormControl>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                              {questionTypes.map(type => (
                                <SelectItem key={type} value={type}>{type}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="domain"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Domain</FormLabel>
                        <FormControl>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select domain" />
                            </SelectTrigger>
                            <SelectContent>
                              {domains.map(domain => (
                                <SelectItem key={domain} value={domain}>{domain}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="priority"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Priority</FormLabel>
                        <FormControl>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select priority" />
                            </SelectTrigger>
                            <SelectContent>
                              {priorities.map(priority => (
                                <SelectItem key={priority} value={priority}>
                                  {priority.charAt(0).toUpperCase() + priority.slice(1)}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="riskLevel"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Risk Level</FormLabel>
                        <FormControl>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select risk level" />
                            </SelectTrigger>
                            <SelectContent>
                              {riskLevels.map(risk => (
                                <SelectItem key={risk} value={risk}>
                                  {risk.charAt(0).toUpperCase() + risk.slice(1)}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="context"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Context (Optional)</FormLabel>
                      <FormControl>
                        <Textarea 
                          {...field}
                          placeholder="Additional context for the question..."
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end space-x-2">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setIsCreateDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={createQuestionMutation.isPending}
                  >
                    {createQuestionMutation.isPending ? 'Creating...' : 'Create Question'}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <MessageSquare className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Total Questions</p>
                <p className="text-2xl font-bold">{stats.total || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Activity className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Active Questions</p>
                <p className="text-2xl font-bold">{stats.active || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Brain className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Processed</p>
                <p className="text-2xl font-bold">{stats.processed || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Success Rate</p>
                <p className="text-2xl font-bold">
                  {stats.processed > 0 ? Math.round((stats.processed / stats.total) * 100) : 0}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[300px]">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search questions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select
              value={filters.questionType}
              onValueChange={(value) => setFilters(prev => ({ ...prev, questionType: value }))}
            >
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Types</SelectItem>
                {questionTypes.map(type => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={filters.domain}
              onValueChange={(value) => setFilters(prev => ({ ...prev, domain: value }))}
            >
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Domain" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Domains</SelectItem>
                {domains.map(domain => (
                  <SelectItem key={domain} value={domain}>{domain}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={filters.priority}
              onValueChange={(value) => setFilters(prev => ({ ...prev, priority: value }))}
            >
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Priorities</SelectItem>
                {priorities.map(priority => (
                  <SelectItem key={priority} value={priority}>
                    {priority.charAt(0).toUpperCase() + priority.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Questions List */}
      <Card>
        <CardHeader>
          <CardTitle>Questions</CardTitle>
          <CardDescription>
            Manage and process EMME questions for agent analysis
          </CardDescription>
        </CardHeader>
        <CardContent>
          {questionsLoading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : questions.length === 0 ? (
            <div className="text-center py-8">
              <MessageSquare className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-semibold text-gray-900">No questions found</h3>
              <p className="mt-1 text-sm text-gray-500">
                Create your first EMME question to get started.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {questions.map((question: EmmeQuestion) => (
                <div
                  key={question.id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline">{question.questionType}</Badge>
                        <Badge variant="secondary">{question.domain}</Badge>
                        <div className={`w-2 h-2 rounded-full ${getPriorityColor(question.priority)}`} />
                        <span className="text-sm text-muted-foreground">{question.priority}</span>
                        <Badge variant={getRiskColor(question.riskLevel)}>{question.riskLevel} risk</Badge>
                      </div>
                      
                      <h3 className="font-medium text-gray-900 mb-2">
                        {question.questionText}
                      </h3>
                      
                      {question.context && (
                        <p className="text-sm text-gray-600 mb-2">
                          <span className="font-medium">Context:</span> {question.context}
                        </p>
                      )}
                      
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>Created {new Date(question.createdAt).toLocaleDateString()}</span>
                        {question.processingHistory && question.processingHistory.length > 0 && (
                          <span>Processed {question.processingHistory.length} times</span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 ml-4">
                      {processingQuestions.has(question.id) ? (
                        <Button disabled size="sm">
                          <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                          Processing...
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          onClick={() => handleProcessQuestion(question.id)}
                          disabled={!question.isActive}
                        >
                          <Play className="w-4 h-4 mr-2" />
                          Process
                        </Button>
                      )}
                      
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}