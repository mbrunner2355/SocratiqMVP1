import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Database,
  GitBranch,
  Bot,
  Shield,
  Users,
  Cpu,
  Network,
  Activity,
  TrendingUp,
  FileText,
  Brain,
  Zap,
  Target,
  Clock,
  CheckCircle,
  AlertTriangle,
  ArrowRight,
  BarChart3,
  Layers
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import Analytics from '@/components/Analytics';
import { SophieIntelligenceDashboard } from '@/components/SophieIntelligenceDashboard';

interface SystemOverview {
  platformStatus: 'healthy' | 'warning' | 'error';
  totalDocuments: number;
  totalEntities: number;
  activeModels: number;
  activeAgents: number;
  knowledgeGraphs: number;
  recentActivities: Array<{
    id: string;
    type: string;
    description: string;
    timestamp: string;
    status: 'success' | 'warning' | 'error';
  }>;
  systemMetrics: {
    cpuUsage: number;
    memoryUsage: number;
    storage: number;
    uptime: string;
  };
  moduleHealth: {
    [key: string]: 'healthy' | 'warning' | 'error';
  };
}

interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: any;
  href: string;
  category: 'core' | 'module' | 'admin';
  priority: 'high' | 'medium' | 'low';
}

export default function Home() {
  const { user } = useAuth();
  
  const { data: systemOverview, isLoading } = useQuery<SystemOverview>({
    queryKey: ['/api/system/overview'],
  });

  const { data: analytics } = useQuery({
    queryKey: ['/api/analytics'],
  });

  const quickActions: QuickAction[] = [
    {
      id: 'upload_docs',
      title: 'Process Documents',
      description: 'Upload and analyze new documents with Transform™',
      icon: FileText,
      href: '/transform',
      category: 'core',
      priority: 'high'
    },
    {
      id: 'explore_graph',
      title: 'Explore Knowledge Graphs',
      description: 'Navigate relationships in your knowledge networks',
      icon: Network,
      href: '/graphs',
      category: 'core',
      priority: 'high'
    },
    {
      id: 'chat_sophie',
      title: 'Chat with Sophie™',
      description: 'Get AI-powered insights from your knowledge base',
      icon: Bot,
      href: '/agents',
      category: 'core',
      priority: 'medium'
    },
    {
      id: 'agentic_rag',
      title: 'Temporal RAG Analysis',
      description: 'Run advanced multi-agent reasoning workflows',
      icon: Brain,
      href: '/agentic-rag',
      category: 'core',
      priority: 'medium'
    },
    {
      id: 'build_projects',
      title: 'Construction Intelligence',
      description: 'Manage AEC projects with predictive analytics',
      icon: Layers,
      href: '/build',
      category: 'module',
      priority: 'low'
    },
    {
      id: 'emme_platform',
      title: 'EMME Pharmaceutical Intelligence',
      description: 'Strategic pharma insights and market intelligence',
      icon: Target,
      href: '/emme',
      category: 'module',
      priority: 'medium'
    }
  ];

  const getStatusColor = (status: 'healthy' | 'warning' | 'error') => {
    switch (status) {
      case 'healthy': return 'text-green-600 bg-green-50';
      case 'warning': return 'text-yellow-600 bg-yellow-50';
      case 'error': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusIcon = (status: 'healthy' | 'warning' | 'error') => {
    switch (status) {
      case 'healthy': return CheckCircle;
      case 'warning': return AlertTriangle;
      case 'error': return AlertTriangle;
      default: return Activity;
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="h-8 bg-gray-200 animate-pulse rounded w-1/3"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 bg-gray-200 animate-pulse rounded-lg"></div>
          ))}
        </div>
        <div className="h-64 bg-gray-200 animate-pulse rounded-lg"></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8">
      {/* Welcome Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.firstName || 'User'}
          </h1>
          <p className="text-gray-600 mt-1">
            Your SocratIQ Transform™ platform overview and quick actions
          </p>
        </div>
        <div className="flex items-center gap-2">
          {systemOverview && (
            <Badge className={getStatusColor(systemOverview.platformStatus)}>
              {systemOverview.platformStatus.charAt(0).toUpperCase() + systemOverview.platformStatus.slice(1)}
            </Badge>
          )}
        </div>
      </div>

      {/* System Overview Cards */}
      {systemOverview && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Documents Processed</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{systemOverview.totalDocuments.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                <TrendingUp className="inline h-3 w-3 mr-1" />
                Active processing pipeline
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Entities Extracted</CardTitle>
              <Database className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{systemOverview.totalEntities.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                Knowledge graph nodes
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active AI Agents</CardTitle>
              <Bot className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{systemOverview.activeAgents}</div>
              <p className="text-xs text-muted-foreground">
                Sophie™ AI agents online
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Knowledge Graphs</CardTitle>
              <Network className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{systemOverview.knowledgeGraphs}</div>
              <p className="text-xs text-muted-foreground">
                Temporal graph networks
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Quick Actions
          </CardTitle>
          <CardDescription>
            Common tasks and platform features you can access quickly
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {quickActions.map((action) => {
              const IconComponent = action.icon;
              return (
                <Button
                  key={action.id}
                  variant="outline"
                  className="h-auto p-4 flex flex-col items-start space-y-2 hover:bg-gray-50"
                  asChild
                >
                  <a href={action.href}>
                    <div className="flex items-center gap-2 w-full">
                      <IconComponent className="h-5 w-5 text-blue-600" />
                      <Badge variant="outline" className="ml-auto">
                        {action.priority}
                      </Badge>
                    </div>
                    <div className="text-left">
                      <div className="font-medium">{action.title}</div>
                      <div className="text-sm text-gray-600">{action.description}</div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-gray-400 ml-auto" />
                  </a>
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* System Health & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* System Health */}
        {systemOverview && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                System Health
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                {Object.entries(systemOverview.moduleHealth).map(([module, status]) => {
                  const StatusIcon = getStatusIcon(status);
                  return (
                    <div key={module} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <StatusIcon className={`h-4 w-4 ${getStatusColor(status).split(' ')[0]}`} />
                        <span className="font-medium">{module}</span>
                      </div>
                      <Badge className={getStatusColor(status)}>
                        {status}
                      </Badge>
                    </div>
                  );
                })}
              </div>
              
              <div className="pt-4 border-t space-y-2">
                <div className="flex justify-between text-sm">
                  <span>CPU Usage</span>
                  <span>{systemOverview.systemMetrics.cpuUsage}%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Memory</span>
                  <span>{systemOverview.systemMetrics.memoryUsage}%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Uptime</span>
                  <span>{systemOverview.systemMetrics.uptime}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Recent Activity */}
        {systemOverview && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {systemOverview.recentActivities.slice(0, 6).map((activity) => (
                  <div key={activity.id} className="flex items-center gap-3">
                    <div className={`h-2 w-2 rounded-full ${
                      activity.status === 'success' ? 'bg-green-500' :
                      activity.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
                    }`} />
                    <div className="flex-1">
                      <div className="text-sm font-medium">{activity.description}</div>
                      <div className="text-xs text-gray-500">{activity.timestamp}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Analytics Section */}
      {analytics && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Platform Analytics
            </CardTitle>
            <CardDescription>
              Document processing and entity extraction insights
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Analytics analytics={analytics} />
          </CardContent>
        </Card>
      )}

      {/* Sophie Intelligence Dashboard - Working While You Were Away */}
      <div className="mt-8 border-2 border-teal-500 rounded-lg p-4 bg-teal-50">
        <h2 className="text-xl font-bold mb-4 text-teal-600">🤖 Sophie Intelligence Dashboard - I've Been Working While You Were Away!</h2>
        <div className="bg-white p-4 rounded border">
          <p className="text-gray-700 mb-4">Sophie has been monitoring your clinical trials and analyzing 147 data points while you were away.</p>
          <SophieIntelligenceDashboard />
        </div>
      </div>
    </div>
  );
}