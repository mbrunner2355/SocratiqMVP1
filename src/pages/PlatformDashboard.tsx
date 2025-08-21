import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Activity, 
  FileText, 
  Brain, 
  Shield, 
  Building, 
  Users, 
  TrendingUp, 
  Clock, 
  AlertTriangle,
  CheckCircle,
  Zap,
  Database
} from "lucide-react";

interface PlatformAnalytics {
  totalDocuments: number;
  totalEntities: number;
  activeAgents: number;
  totalTransformJobs: number;
  queuedJobs: number;
  processingJobs: number;
  completedJobs: number;
  failedJobs: number;
  avgProcessingTime: number;
  systemHealth: string;
  lastUpdated: string;
}

export function PlatformDashboard() {
  const [activeModule, setActiveModule] = useState<string>('overview');

  const { data: analytics, isLoading } = useQuery<PlatformAnalytics>({
    queryKey: ['/api/platform/analytics'],
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  const { data: agents } = useQuery({
    queryKey: ['/api/agents'],
  });

  const { data: transformJobs } = useQuery({
    queryKey: ['/api/transform/jobs', { status: 'processing' }],
  });

  const { data: auditEvents } = useQuery({
    queryKey: ['/api/trace/events', { limit: 10 }],
  });

  const coreModules = [
    {
      id: 'transform',
      name: 'Transform™',
      description: 'Document Processing & NLP Pipeline',
      icon: FileText,
      color: 'bg-blue-500',
      stats: {
        total: analytics?.totalTransformJobs || 0,
        active: analytics?.processingJobs || 0,
        queued: analytics?.queuedJobs || 0
      }
    },
    {
      id: 'mesh',
      name: 'Mesh™',
      description: 'Knowledge Graph & Semantic Network',
      icon: Brain,
      color: 'bg-purple-500',
      stats: {
        entities: analytics?.totalEntities || 0,
        documents: analytics?.totalDocuments || 0
      }
    },
    {
      id: 'trace',
      name: 'Trace™',
      description: 'Audit & Compliance System',
      icon: Shield,
      color: 'bg-green-500',
      stats: {
        recentEvents: auditEvents?.length || 0,
        compliance: '100%'
      }
    },
    {
      id: 'build',
      name: 'Build™',
      description: 'Construction Project Intelligence',
      icon: Building,
      color: 'bg-orange-500',
      stats: {
        projects: 0,
        riskAssessments: 0
      }
    },
    {
      id: 'profile',
      name: 'Profile™',
      description: 'Asset & User Profiling System',
      icon: Users,
      color: 'bg-teal-500',
      stats: {
        profiles: 0,
        verified: 0
      }
    },
    {
      id: 'sophie',
      name: 'Sophie™',
      description: 'AI Agent Orchestration Layer',
      icon: Zap,
      color: 'bg-yellow-500',
      stats: {
        activeAgents: analytics?.activeAgents || 0,
        tasks: 0
      }
    }
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
          <p className="mt-4 text-lg">Loading Platform Analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            SocratIQ Platform Core
          </h1>
          <p className="text-lg text-muted-foreground mt-2">
            AI-Powered Strategic Intelligence Infrastructure
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={analytics?.systemHealth === 'healthy' ? 'default' : 'destructive'}>
            {analytics?.systemHealth === 'healthy' ? (
              <CheckCircle className="w-4 h-4 mr-1" />
            ) : (
              <AlertTriangle className="w-4 h-4 mr-1" />
            )}
            {analytics?.systemHealth || 'Unknown'}
          </Badge>
        </div>
      </div>

      {/* System Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Documents</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics?.totalDocuments?.toLocaleString() || '0'}</div>
            <p className="text-xs text-muted-foreground">
              Processed through Transform™
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Knowledge Entities</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics?.totalEntities?.toLocaleString() || '0'}</div>
            <p className="text-xs text-muted-foreground">
              Stored in Mesh™ graph
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active AI Agents</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics?.activeAgents || '0'}</div>
            <p className="text-xs text-muted-foreground">
              Sophie™ agent instances
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Processing Pipeline</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics?.processingJobs || '0'}</div>
            <p className="text-xs text-muted-foreground">
              Transform™ jobs running
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Processing Pipeline Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Transform™ Processing Pipeline
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{analytics?.completedJobs || 0}</div>
                <div className="text-sm text-muted-foreground">Completed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">{analytics?.processingJobs || 0}</div>
                <div className="text-sm text-muted-foreground">Processing</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-600">{analytics?.queuedJobs || 0}</div>
                <div className="text-sm text-muted-foreground">Queued</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{analytics?.failedJobs || 0}</div>
                <div className="text-sm text-muted-foreground">Failed</div>
              </div>
            </div>
            
            {analytics?.totalTransformJobs && analytics.totalTransformJobs > 0 && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Pipeline Progress</span>
                  <span>{Math.round(((analytics.completedJobs || 0) / analytics.totalTransformJobs) * 100)}%</span>
                </div>
                <Progress 
                  value={((analytics.completedJobs || 0) / analytics.totalTransformJobs) * 100} 
                  className="w-full" 
                />
              </div>
            )}

            {analytics?.avgProcessingTime && (
              <div className="text-sm text-muted-foreground">
                Average processing time: {Math.round(analytics.avgProcessingTime / 1000)}s per job
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Core Platform Modules */}
      <div>
        <h2 className="text-2xl font-semibold mb-6">Core Platform Modules</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {coreModules.map((module) => {
            const Icon = module.icon;
            return (
              <Card key={module.id} className="cursor-pointer hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${module.color}`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{module.name}</CardTitle>
                        <p className="text-sm text-muted-foreground">{module.description}</p>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {module.id === 'transform' && (
                      <>
                        <div className="flex justify-between text-sm">
                          <span>Total Jobs</span>
                          <span className="font-medium">{module.stats.total}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Active</span>
                          <span className="font-medium">{module.stats.active}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Queued</span>
                          <span className="font-medium">{module.stats.queued}</span>
                        </div>
                      </>
                    )}
                    
                    {module.id === 'mesh' && (
                      <>
                        <div className="flex justify-between text-sm">
                          <span>Documents</span>
                          <span className="font-medium">{module.stats.documents}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Entities</span>
                          <span className="font-medium">{module.stats.entities}</span>
                        </div>
                      </>
                    )}
                    
                    {module.id === 'trace' && (
                      <>
                        <div className="flex justify-between text-sm">
                          <span>Recent Events</span>
                          <span className="font-medium">{module.stats.recentEvents}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Compliance</span>
                          <Badge variant="outline" className="text-xs">
                            {module.stats.compliance}
                          </Badge>
                        </div>
                      </>
                    )}
                    
                    {module.id === 'sophie' && (
                      <>
                        <div className="flex justify-between text-sm">
                          <span>Active Agents</span>
                          <span className="font-medium">{module.stats.activeAgents}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Tasks</span>
                          <span className="font-medium">{module.stats.tasks}</span>
                        </div>
                      </>
                    )}

                    {(module.id === 'build' || module.id === 'profile') && (
                      <div className="text-sm text-muted-foreground">
                        Ready for implementation
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Platform Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {auditEvents && auditEvents.length > 0 ? (
              auditEvents.slice(0, 5).map((event: any, index: number) => (
                <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Shield className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <div className="font-medium text-sm">{event.eventType}</div>
                      <div className="text-xs text-muted-foreground">
                        {event.action} on {event.entityType}
                      </div>
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {new Date(event.createdAt).toLocaleTimeString()}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Activity className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No recent activity to display</p>
                <p className="text-sm">Platform activity will appear here as it occurs</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Last Updated */}
      <div className="text-center text-sm text-muted-foreground">
        Last updated: {analytics?.lastUpdated ? new Date(analytics.lastUpdated).toLocaleString() : 'Never'}
      </div>
    </div>
  );
}