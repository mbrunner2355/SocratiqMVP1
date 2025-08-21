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
import { 
  Eye,
  Activity,
  BarChart3,
  Brain,
  Bot,
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp,
  TrendingDown,
  Zap,
  Network,
  Target,
  Settings,
  RefreshCw,
  Filter,
  Search,
  Play,
  Pause,
  FileText,
  MessageSquare,
  Database,
  Server,
  Cpu,

  Gauge,
  Signal,
  Bug,
  ThumbsUp,
  ThumbsDown,
  RotateCcw,
  GitBranch
} from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';

interface AgentTelemetry {
  id: string;
  agent_id: string;
  agent_name: string;
  timestamp: string;
  event_type: 'execution' | 'error' | 'performance' | 'interaction' | 'reasoning';
  severity: 'info' | 'warning' | 'error' | 'critical';
  metrics: {
    response_time: number;
    memory_usage: number;
    cpu_usage: number;
    tokens_processed: number;
    accuracy_score: number;
    confidence_score: number;
  };
  context: {
    session_id: string;
    user_id?: string;
    task_type: string;
    input_data: any;
    output_data: any;
    reasoning_steps: string[];
    error_details?: string;
  };
  trace_id: string;
  span_id: string;
  parent_span_id?: string;
}

interface FeedbackLoop {
  id: string;
  agent_id: string;
  feedback_type: 'user_rating' | 'automated_evaluation' | 'performance_metric' | 'error_correction';
  rating: number;
  feedback_data: {
    user_rating?: number;
    accuracy_evaluation?: number;
    performance_score?: number;
    error_corrected?: boolean;
    improvement_suggestions?: string[];
  };
  timestamp: string;
  applied_improvements: string[];
  status: 'pending' | 'applied' | 'rejected';
}

interface AgentMetrics {
  agent_id: string;
  agent_name: string;
  performance_trends: {
    response_time: Array<{ timestamp: string; value: number }>;
    accuracy: Array<{ timestamp: string; value: number }>;
    error_rate: Array<{ timestamp: string; value: number }>;
    user_satisfaction: Array<{ timestamp: string; value: number }>;
  };
  health_status: 'healthy' | 'degraded' | 'unhealthy';
  current_metrics: {
    avg_response_time: number;
    accuracy_score: number;
    error_rate: number;
    throughput: number;
    uptime_percentage: number;
  };
  alerts: Array<{
    id: string;
    type: 'performance' | 'error' | 'availability';
    message: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    timestamp: string;
  }>;
}

interface DebugSession {
  id: string;
  agent_id: string;
  session_name: string;
  status: 'active' | 'paused' | 'completed';
  start_time: string;
  debug_points: Array<{
    id: string;
    step: string;
    timestamp: string;
    state_snapshot: any;
    variables: Record<string, any>;
    execution_time: number;
  }>;
  error_traces: Array<{
    error_type: string;
    message: string;
    stack_trace: string;
    timestamp: string;
  }>;
}

interface ContinuousImprovement {
  id: string;
  agent_id: string;
  improvement_type: 'model_retrain' | 'parameter_tune' | 'prompt_optimize' | 'architecture_update';
  trigger: 'performance_degradation' | 'user_feedback' | 'scheduled' | 'error_threshold';
  status: 'analyzing' | 'implementing' | 'testing' | 'deployed' | 'failed';
  metrics_before: any;
  metrics_after?: any;
  improvement_details: {
    changes_made: string[];
    expected_improvement: string;
    validation_results?: any;
  };
  created_at: string;
  completed_at?: string;
}

export default function AgentObservabilityManager() {
  const [selectedTab, setSelectedTab] = useState('overview');
  const [selectedAgent, setSelectedAgent] = useState<string>('');
  const [timeRange, setTimeRange] = useState('24h');
  const [filterSeverity, setFilterSeverity] = useState('all');
  const [debugSessionId, setDebugSessionId] = useState<string>('');
  const queryClient = useQueryClient();

  const { data: telemetryData = [], isLoading: telemetryLoading } = useQuery<AgentTelemetry[]>({
    queryKey: ['/api/observability/telemetry', timeRange, selectedAgent, filterSeverity],
  });

  const { data: feedbackLoops = [] } = useQuery<FeedbackLoop[]>({
    queryKey: ['/api/observability/feedback-loops', selectedAgent],
  });

  const { data: agentMetrics = [] } = useQuery<AgentMetrics[]>({
    queryKey: ['/api/observability/agent-metrics', timeRange],
  });

  const { data: debugSessions = [] } = useQuery<DebugSession[]>({
    queryKey: ['/api/observability/debug-sessions'],
  });

  const { data: improvements = [] } = useQuery<ContinuousImprovement[]>({
    queryKey: ['/api/observability/continuous-improvements'],
  });

  const { data: systemHealth } = useQuery({
    queryKey: ['/api/observability/system-health'],
  });

  const startDebugSessionMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch('/api/observability/debug-sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/observability/debug-sessions'] });
    }
  });

  const applyFeedbackMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch('/api/observability/feedback-loops/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/observability/feedback-loops'] });
    }
  });

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'info': return 'bg-blue-100 text-blue-800';
      case 'warning': return 'bg-yellow-100 text-yellow-800';
      case 'error': return 'bg-red-100 text-red-800';
      case 'critical': return 'bg-red-200 text-red-900';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getHealthStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'degraded': return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case 'unhealthy': return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default: return <Activity className="h-4 w-4 text-gray-600" />;
    }
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  if (telemetryLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-2 mb-6">
          <Eye className="h-6 w-6 text-blue-600" />
          <h1 className="text-3xl font-bold">Agent Observability</h1>
        </div>
        <div className="h-96 bg-gray-200 animate-pulse rounded-lg" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Eye className="h-6 w-6 text-blue-600" />
          <h1 className="text-3xl font-bold">Agent Observability & Telemetry</h1>
        </div>
        <div className="flex gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1h">Last Hour</SelectItem>
              <SelectItem value="24h">Last 24h</SelectItem>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* System Health Overview */}
      {systemHealth && (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Agents</CardTitle>
              <Bot className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{systemHealth?.activeAgents || 0}</div>
              <p className="text-xs text-muted-foreground">
                {systemHealth?.healthyAgents || 0} healthy
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Telemetry Events</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{telemetryData.length.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                Last {timeRange}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Error Rate</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{systemHealth?.errorRate || 0}%</div>
              <p className="text-xs text-muted-foreground">
                <TrendingDown className="inline h-3 w-3 mr-1 text-green-600" />
                Improving
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Response Time</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{systemHealth?.avgResponseTime || 0}ms</div>
              <p className="text-xs text-muted-foreground">
                P95 latency
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">User Satisfaction</CardTitle>
              <ThumbsUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{systemHealth?.userSatisfaction || 0}%</div>
              <p className="text-xs text-muted-foreground">
                <TrendingUp className="inline h-3 w-3 mr-1 text-green-600" />
                +2.3% vs last week
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="telemetry">Telemetry</TabsTrigger>
          <TabsTrigger value="metrics">Agent Metrics</TabsTrigger>
          <TabsTrigger value="feedback">Feedback Loops</TabsTrigger>
          <TabsTrigger value="debugging">Debug & Trace</TabsTrigger>
          <TabsTrigger value="improvements">Continuous Improvement</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Agent Health Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Gauge className="h-5 w-5" />
                  Agent Health Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {agentMetrics.slice(0, 6).map((agent) => (
                  <div key={agent.agent_id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      {getHealthStatusIcon(agent.health_status)}
                      <div>
                        <div className="font-medium">{agent.agent_name}</div>
                        <div className="text-sm text-gray-600">
                          {agent.current_metrics.uptime_percentage.toFixed(1)}% uptime • 
                          {agent.current_metrics.accuracy_score.toFixed(1)}% accuracy
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={
                        agent.health_status === 'healthy' ? 'bg-green-100 text-green-800' :
                        agent.health_status === 'degraded' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }>
                        {agent.health_status}
                      </Badge>
                      {agent.alerts.length > 0 && (
                        <Badge variant="outline">
                          {agent.alerts.length} alerts
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Recent Critical Events */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Critical Events
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-80">
                  <div className="space-y-3">
                    {telemetryData
                      .filter(event => event.severity === 'critical' || event.severity === 'error')
                      .slice(0, 10)
                      .map((event) => (
                      <div key={event.id} className="flex items-start gap-3 p-3 bg-red-50 rounded-lg">
                        <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5" />
                        <div className="flex-1">
                          <div className="font-medium text-sm">{event.agent_name}</div>
                          <div className="text-xs text-gray-600">{event.event_type}</div>
                          <div className="text-xs text-gray-500">{formatTimestamp(event.timestamp)}</div>
                          {event.context.error_details && (
                            <div className="text-xs text-red-700 mt-1 truncate">
                              {event.context.error_details}
                            </div>
                          )}
                        </div>
                        <Badge className={getSeverityColor(event.severity)}>
                          {event.severity}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          {/* Performance Trends */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Performance Trends
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {agentMetrics.reduce((sum, agent) => sum + agent.current_metrics.avg_response_time, 0) / agentMetrics.length || 0}ms
                  </div>
                  <div className="text-sm text-gray-600">Avg Response Time</div>
                  <div className="text-xs text-green-600">↓ 12% vs last week</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {((agentMetrics.reduce((sum, agent) => sum + agent.current_metrics.accuracy_score, 0) / agentMetrics.length) || 0).toFixed(1)}%
                  </div>
                  <div className="text-sm text-gray-600">Avg Accuracy</div>
                  <div className="text-xs text-green-600">↑ 3.2% vs last week</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">
                    {((agentMetrics.reduce((sum, agent) => sum + agent.current_metrics.error_rate, 0) / agentMetrics.length) || 0).toFixed(1)}%
                  </div>
                  <div className="text-sm text-gray-600">Error Rate</div>
                  <div className="text-xs text-green-600">↓ 1.8% vs last week</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {agentMetrics.reduce((sum, agent) => sum + agent.current_metrics.throughput, 0)}
                  </div>
                  <div className="text-sm text-gray-600">Total Throughput/min</div>
                  <div className="text-xs text-green-600">↑ 8.5% vs last week</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="telemetry" className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Select value={selectedAgent} onValueChange={setSelectedAgent}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="All Agents" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Agents</SelectItem>
                  {agentMetrics.map((agent) => (
                    <SelectItem key={agent.agent_id} value={agent.agent_id}>
                      {agent.agent_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={filterSeverity} onValueChange={setFilterSeverity}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Severity</SelectItem>
                  <SelectItem value="info">Info</SelectItem>
                  <SelectItem value="warning">Warning</SelectItem>
                  <SelectItem value="error">Error</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button variant="outline" size="sm">
              <FileText className="h-4 w-4 mr-2" />
              Export Logs
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Real-time Telemetry Stream</CardTitle>
              <CardDescription>Live agent execution logs and performance metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-96">
                <div className="space-y-2">
                  {telemetryData.map((event) => (
                    <div key={event.id} className="flex items-start gap-3 p-3 border-l-2 border-gray-200 hover:bg-gray-50">
                      <div className="flex-shrink-0 mt-1">
                        {event.event_type === 'error' ? 
                          <AlertTriangle className="h-4 w-4 text-red-600" /> :
                          event.event_type === 'performance' ?
                          <BarChart3 className="h-4 w-4 text-blue-600" /> :
                          <Activity className="h-4 w-4 text-green-600" />
                        }
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-sm">{event.agent_name}</span>
                            <Badge className={getSeverityColor(event.severity)} variant="outline">
                              {event.severity}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {event.event_type}
                            </Badge>
                          </div>
                          <span className="text-xs text-gray-500">{formatTimestamp(event.timestamp)}</span>
                        </div>
                        
                        <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                          <div>
                            <span className="text-gray-600">Response:</span>
                            <span className="ml-1 font-medium">{event.metrics.response_time}ms</span>
                          </div>
                          <div>
                            <span className="text-gray-600">Memory:</span>
                            <span className="ml-1 font-medium">{event.metrics.memory_usage}MB</span>
                          </div>
                          <div>
                            <span className="text-gray-600">Tokens:</span>
                            <span className="ml-1 font-medium">{event.metrics.tokens_processed}</span>
                          </div>
                          <div>
                            <span className="text-gray-600">Confidence:</span>
                            <span className="ml-1 font-medium">{(event.metrics.confidence_score * 100).toFixed(1)}%</span>
                          </div>
                        </div>

                        {event.context.reasoning_steps && event.context.reasoning_steps.length > 0 && (
                          <div className="mt-2 text-xs text-gray-700">
                            <span className="text-gray-600">Steps:</span>
                            <span className="ml-1">{event.context.reasoning_steps.join(' → ')}</span>
                          </div>
                        )}

                        {event.context.error_details && (
                          <div className="mt-2 p-2 bg-red-50 rounded text-xs text-red-700">
                            {event.context.error_details}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="metrics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {agentMetrics.map((agent) => (
              <Card key={agent.agent_id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{agent.agent_name}</CardTitle>
                    <div className="flex items-center gap-2">
                      {getHealthStatusIcon(agent.health_status)}
                      <Badge className={
                        agent.health_status === 'healthy' ? 'bg-green-100 text-green-800' :
                        agent.health_status === 'degraded' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }>
                        {agent.health_status}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Response Time:</span>
                      <div className="font-medium">{agent.current_metrics.avg_response_time}ms</div>
                    </div>
                    <div>
                      <span className="text-gray-600">Accuracy:</span>
                      <div className="font-medium">{agent.current_metrics.accuracy_score.toFixed(1)}%</div>
                    </div>
                    <div>
                      <span className="text-gray-600">Error Rate:</span>
                      <div className="font-medium">{agent.current_metrics.error_rate.toFixed(2)}%</div>
                    </div>
                    <div>
                      <span className="text-gray-600">Throughput:</span>
                      <div className="font-medium">{agent.current_metrics.throughput}/min</div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-600">Uptime</span>
                      <span className="text-sm font-medium">{agent.current_metrics.uptime_percentage.toFixed(1)}%</span>
                    </div>
                    <Progress value={agent.current_metrics.uptime_percentage} className="h-2" />
                  </div>

                  {agent.alerts.length > 0 && (
                    <div>
                      <span className="text-sm font-medium text-red-600">Active Alerts</span>
                      <div className="space-y-1 mt-2">
                        {agent.alerts.slice(0, 3).map((alert) => (
                          <div key={alert.id} className="flex items-center justify-between p-2 bg-red-50 rounded text-xs">
                            <span>{alert.message}</span>
                            <Badge className={getSeverityColor(alert.severity)}>
                              {alert.severity}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="feedback" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <RotateCcw className="h-5 w-5" />
                Feedback Loops & Learning Analytics
              </CardTitle>
              <CardDescription>
                Continuous feedback collection and automated improvement cycles
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {feedbackLoops.map((feedback) => (
                <div key={feedback.id} className="p-4 border rounded-lg space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="font-medium">
                        {agentMetrics.find(a => a.agent_id === feedback.agent_id)?.agent_name}
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {feedback.feedback_type.replace('_', ' ')}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        {feedback.rating >= 4 ? 
                          <ThumbsUp className="h-4 w-4 text-green-600" /> :
                          <ThumbsDown className="h-4 w-4 text-red-600" />
                        }
                        <span className="text-sm font-medium">{feedback.rating}/5</span>
                      </div>
                      <Badge className={
                        feedback.status === 'applied' ? 'bg-green-100 text-green-800' :
                        feedback.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }>
                        {feedback.status}
                      </Badge>
                    </div>
                  </div>

                  {feedback.feedback_data.improvement_suggestions && (
                    <div>
                      <span className="text-sm font-medium text-gray-700">Improvement Suggestions:</span>
                      <ul className="mt-1 space-y-1">
                        {feedback.feedback_data.improvement_suggestions.map((suggestion, index) => (
                          <li key={index} className="text-sm text-gray-600">• {suggestion}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {feedback.applied_improvements.length > 0 && (
                    <div>
                      <span className="text-sm font-medium text-green-700">Applied Improvements:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {feedback.applied_improvements.map((improvement, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {improvement}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2 pt-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => applyFeedbackMutation.mutate({ feedback_id: feedback.id })}
                      disabled={feedback.status === 'applied' || applyFeedbackMutation.isPending}
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Apply Feedback
                    </Button>
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="debugging" className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Select value={debugSessionId} onValueChange={setDebugSessionId}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Select debug session" />
                </SelectTrigger>
                <SelectContent>
                  {debugSessions.map((session) => (
                    <SelectItem key={session.id} value={session.id}>
                      {session.session_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button 
              onClick={() => startDebugSessionMutation.mutate({ 
                agent_id: selectedAgent, 
                session_name: `Debug Session ${new Date().toLocaleTimeString()}` 
              })}
              disabled={startDebugSessionMutation.isPending}
            >
              <Play className="h-4 w-4 mr-2" />
              Start Debug Session
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bug className="h-5 w-5" />
                  Debug Sessions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {debugSessions.map((session) => (
                    <div key={session.id} className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">{session.session_name}</div>
                          <div className="text-sm text-gray-600">
                            {agentMetrics.find(a => a.agent_id === session.agent_id)?.agent_name}
                          </div>
                        </div>
                        <Badge className={
                          session.status === 'active' ? 'bg-green-100 text-green-800' :
                          session.status === 'paused' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }>
                          {session.status}
                        </Badge>
                      </div>
                      <div className="mt-2 text-xs text-gray-600">
                        {session.debug_points.length} debug points • {session.error_traces.length} errors
                      </div>
                      <div className="flex gap-2 mt-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </Button>
                        {session.status === 'active' ? (
                          <Button variant="outline" size="sm">
                            <Pause className="h-4 w-4 mr-2" />
                            Pause
                          </Button>
                        ) : (
                          <Button variant="outline" size="sm">
                            <Play className="h-4 w-4 mr-2" />
                            Resume
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GitBranch className="h-5 w-5" />
                  Execution Traces
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-80">
                  <div className="space-y-2">
                    {telemetryData
                      .filter(event => event.trace_id)
                      .slice(0, 20)
                      .map((event) => (
                      <div key={event.id} className="p-2 border-l-2 border-blue-200 bg-blue-50 rounded text-xs">
                        <div className="flex justify-between">
                          <span className="font-medium">{event.agent_name}</span>
                          <span className="text-gray-600">{event.metrics.response_time}ms</span>
                        </div>
                        <div className="text-gray-700 mt-1">
                          Trace: {event.trace_id.substring(0, 8)}... | 
                          Span: {event.span_id.substring(0, 8)}...
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="improvements" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Continuous Improvement Pipeline
              </CardTitle>
              <CardDescription>
                Automated system improvements based on performance data and feedback
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {improvements.map((improvement) => (
                <div key={improvement.id} className="p-4 border rounded-lg space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">
                        {agentMetrics.find(a => a.agent_id === improvement.agent_id)?.agent_name}
                      </div>
                      <div className="text-sm text-gray-600">
                        {improvement.improvement_type.replace('_', ' ')} • 
                        Triggered by {improvement.trigger.replace('_', ' ')}
                      </div>
                    </div>
                    <Badge className={
                      improvement.status === 'deployed' ? 'bg-green-100 text-green-800' :
                      improvement.status === 'testing' ? 'bg-blue-100 text-blue-800' :
                      improvement.status === 'implementing' ? 'bg-yellow-100 text-yellow-800' :
                      improvement.status === 'failed' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }>
                      {improvement.status}
                    </Badge>
                  </div>

                  <div>
                    <span className="text-sm font-medium text-gray-700">Expected Improvement:</span>
                    <p className="text-sm text-gray-600 mt-1">{improvement.improvement_details.expected_improvement}</p>
                  </div>

                  <div>
                    <span className="text-sm font-medium text-gray-700">Changes Made:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {improvement.improvement_details.changes_made.map((change, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {change}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {improvement.metrics_after && (
                    <div className="grid grid-cols-2 gap-4 p-3 bg-green-50 rounded">
                      <div>
                        <span className="text-xs text-gray-600">Before → After</span>
                        <div className="text-sm font-medium">
                          Performance: {improvement.metrics_before.performance}% → {improvement.metrics_after.performance}%
                        </div>
                      </div>
                      <div>
                        <span className="text-xs text-gray-600">Improvement</span>
                        <div className="text-sm font-medium text-green-600">
                          +{(improvement.metrics_after.performance - improvement.metrics_before.performance).toFixed(1)}%
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="text-xs text-gray-500">
                    Started: {formatTimestamp(improvement.created_at)}
                    {improvement.completed_at && ` • Completed: ${formatTimestamp(improvement.completed_at)}`}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}