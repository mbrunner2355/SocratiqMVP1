import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Building2, 
  Plus, 
  Calendar, 
  DollarSign, 
  Users, 
  AlertTriangle,
  TrendingUp,
  Clock,
  CheckCircle2,
  Settings,
  BarChart3,
  Target,
  Hammer,
  Wrench,
  HardHat
} from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';

interface ConstructionProject {
  id: string;
  name: string;
  description?: string;
  type: string;
  status: string;
  phase: string;
  client: string;
  location: string;
  startDate?: string;
  endDate?: string;
  plannedBudget: number;
  currentCost: number;
  percentComplete: number;
  projectManager: string;
  riskLevel: string;
  createdAt: string;
}

interface ProjectTask {
  id: string;
  projectId: string;
  name: string;
  type: string;
  status: string;
  priority: string;
  isCriticalPath: boolean;
  plannedStartDate?: string;
  plannedEndDate?: string;
  actualStartDate?: string;
  actualEndDate?: string;
  percentComplete: number;
}

interface RiskAssessment {
  id: string;
  projectId: string;
  riskType: string;
  title: string;
  description: string;
  probability: number;
  impact: number;
  riskScore: number;
  status: string;
  identifiedBy: string;
}

export function BuildDashboard() {
  const [selectedTab, setSelectedTab] = useState('overview');
  const queryClient = useQueryClient();

  // Fetch construction projects
  const { data: projects, isLoading: projectsLoading } = useQuery<ConstructionProject[]>({
    queryKey: ['/api/build/projects'],
  });

  // Fetch analytics
  const { data: analytics } = useQuery({
    queryKey: ['/api/build/analytics'],
  });

  // Create project mutation
  const createProjectMutation = useMutation({
    mutationFn: (data: any) => apiRequest('/api/build/projects', {
      method: 'POST',
      body: data
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/build/projects'] });
      queryClient.invalidateQueries({ queryKey: ['/api/build/analytics'] });
    }
  });

  const handleCreateProject = () => {
    createProjectMutation.mutate({
      name: `New Construction Project ${(projects?.length || 0) + 1}`,
      description: 'A new construction project for development',
      type: 'COMMERCIAL',
      phase: 'design',
      client: 'Sample Client',
      location: 'Downtown District',
      plannedBudget: 2500000,
      projectManager: 'current-user'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'planning': return 'bg-blue-100 text-blue-800';
      case 'on_hold': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'critical': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'COMMERCIAL': return <Building2 className="h-4 w-4" />;
      case 'RESIDENTIAL': return <Users className="h-4 w-4" />;
      case 'INFRASTRUCTURE': return <Settings className="h-4 w-4" />;
      case 'INDUSTRIAL': return <Hammer className="h-4 w-4" />;
      default: return <Building2 className="h-4 w-4" />;
    }
  };

  if (projectsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-sm text-muted-foreground">Loading Build™ Construction Intelligence...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">SocratIQ Build™</h1>
          <p className="text-muted-foreground">
            Construction Project Intelligence - Predictive analytics and optimization for AEC programs
          </p>
        </div>
        <Button onClick={handleCreateProject} disabled={createProjectMutation.isPending}>
          <Plus className="h-4 w-4 mr-2" />
          {createProjectMutation.isPending ? 'Creating...' : 'New Project'}
        </Button>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="projects">Projects ({projects?.length || 0})</TabsTrigger>
          <TabsTrigger value="schedule">Schedule</TabsTrigger>
          <TabsTrigger value="cost">Cost</TabsTrigger>
          <TabsTrigger value="risk">Risk</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Analytics Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
                <Building2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics?.activeProjects || 0}</div>
                <p className="text-xs text-muted-foreground">
                  {analytics?.totalProjects || 0} total projects
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Schedule Performance</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics?.schedulePerformance?.avgCompletion?.toFixed(0) || 0}%</div>
                <p className="text-xs text-muted-foreground">
                  {analytics?.schedulePerformance?.onTimeProjects || 0} projects on time
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Budget Performance</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${(analytics?.totalBudget / 1000000 || 0).toFixed(1)}M</div>
                <p className="text-xs text-muted-foreground">
                  {analytics?.costPerformance?.avgCostVariance?.toFixed(1) || 0}% avg variance
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Risk Monitoring</CardTitle>
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics?.highRisks || 0}</div>
                <p className="text-xs text-muted-foreground">
                  {analytics?.activeRisks || 0} active risks
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Project Type Distribution */}
          {analytics?.projectsByType && (
            <Card>
              <CardHeader>
                <CardTitle>Project Portfolio</CardTitle>
                <CardDescription>Distribution of projects by type and performance metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-4">
                  {Object.entries(analytics.projectsByType).map(([type, count]) => (
                    <div key={type} className="flex items-center space-x-3 p-3 border rounded-lg">
                      {getTypeIcon(type)}
                      <div>
                        <p className="font-medium">{type}</p>
                        <p className="text-sm text-muted-foreground">{count} projects</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Recent Projects */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Projects</CardTitle>
              <CardDescription>Your most recently created or updated construction projects</CardDescription>
            </CardHeader>
            <CardContent>
              {projects && projects.length > 0 ? (
                <div className="space-y-4">
                  {projects.slice(0, 5).map((project) => (
                    <div key={project.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        {getTypeIcon(project.type)}
                        <div>
                          <h4 className="font-medium">{project.name}</h4>
                          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                            <Badge className={getStatusColor(project.status)}>
                              {project.status}
                            </Badge>
                            <Badge className={getRiskColor(project.riskLevel)}>
                              {project.riskLevel} risk
                            </Badge>
                            <span>•</span>
                            <span>{project.percentComplete}% complete</span>
                            <span>•</span>
                            <span>{project.client}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right text-sm text-muted-foreground">
                        <p className="font-medium">${(project.plannedBudget / 1000000).toFixed(1)}M budget</p>
                        <p>{project.location}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Building2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No construction projects yet</p>
                  <p className="text-sm">Create your first project to get started</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="projects">
          <Card>
            <CardHeader>
              <CardTitle>Construction Project Management</CardTitle>
              <CardDescription>Monitor and manage your construction project portfolio</CardDescription>
            </CardHeader>
            <CardContent>
              {projects && projects.length > 0 ? (
                <div className="grid gap-4">
                  {projects.map((project) => (
                    <Card key={project.id}>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            {getTypeIcon(project.type)}
                            <CardTitle className="text-lg">{project.name}</CardTitle>
                            <Badge className={getStatusColor(project.status)}>
                              {project.status}
                            </Badge>
                            <Badge className={getRiskColor(project.riskLevel)}>
                              {project.riskLevel} risk
                            </Badge>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button size="sm" variant="outline">
                              <Calendar className="h-3 w-3 mr-1" />
                              Schedule
                            </Button>
                            <Button size="sm" variant="outline">
                              <DollarSign className="h-3 w-3 mr-1" />
                              Budget
                            </Button>
                          </div>
                        </div>
                        {project.description && (
                          <CardDescription>{project.description}</CardDescription>
                        )}
                      </CardHeader>
                      <CardContent>
                        <div className="grid gap-4 md:grid-cols-3">
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">Client & Location</p>
                            <p className="font-medium">{project.client}</p>
                            <p className="text-sm text-muted-foreground">{project.location}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">Budget & Progress</p>
                            <p className="font-medium">${(project.plannedBudget / 1000000).toFixed(1)}M planned</p>
                            <p className="text-sm text-muted-foreground">{project.percentComplete}% complete</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">Project Manager</p>
                            <p className="font-medium">{project.projectManager}</p>
                            <p className="text-sm text-muted-foreground">{project.phase} phase</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Building2 className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-medium mb-2">No construction projects yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Create your first construction project to get started with Build™
                  </p>
                  <Button onClick={handleCreateProject}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Construction Project
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="schedule">
          <Card>
            <CardHeader>
              <CardTitle>Schedule Optimization</CardTitle>
              <CardDescription>Critical path analysis, resource leveling, and timeline forecasting</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Critical Path Analysis</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-3 border rounded">
                      <span className="text-sm">Foundation Work</span>
                      <Badge variant="outline" className="bg-red-50 text-red-700">Critical</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded">
                      <span className="text-sm">Structural Steel</span>
                      <Badge variant="outline" className="bg-red-50 text-red-700">Critical</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded">
                      <span className="text-sm">Site Preparation</span>
                      <Badge variant="outline">5 days slack</Badge>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Resource Optimization</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-3 border rounded">
                      <span className="text-sm">Skilled Labor</span>
                      <span className="text-sm text-muted-foreground">85% utilized</span>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded">
                      <span className="text-sm">Heavy Equipment</span>
                      <span className="text-sm text-muted-foreground">72% utilized</span>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded">
                      <span className="text-sm">Materials</span>
                      <span className="text-sm text-muted-foreground">On schedule</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cost">
          <Card>
            <CardHeader>
              <CardTitle>Cost Management</CardTitle>
              <CardDescription>Real-time budget tracking, change orders, and cost variance analysis</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Budget Categories</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-3 border rounded">
                      <span className="text-sm">Labor</span>
                      <div className="text-right">
                        <p className="text-sm font-medium">$1.2M / $1.1M</p>
                        <p className="text-xs text-red-600">+8% over</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded">
                      <span className="text-sm">Materials</span>
                      <div className="text-right">
                        <p className="text-sm font-medium">$800K / $850K</p>
                        <p className="text-xs text-green-600">-6% under</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded">
                      <span className="text-sm">Equipment</span>
                      <div className="text-right">
                        <p className="text-sm font-medium">$300K / $320K</p>
                        <p className="text-xs text-green-600">-6% under</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Change Orders</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-3 border rounded">
                      <div>
                        <p className="text-sm font-medium">CO-001: Site Drainage</p>
                        <p className="text-xs text-muted-foreground">Pending approval</p>
                      </div>
                      <span className="text-sm">+$15K</span>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded">
                      <div>
                        <p className="text-sm font-medium">CO-002: Design Revision</p>
                        <p className="text-xs text-muted-foreground">Approved</p>
                      </div>
                      <span className="text-sm">+$8K</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="risk">
          <Card>
            <CardHeader>
              <CardTitle>Risk Monitoring</CardTitle>
              <CardDescription>Supply chain, weather, safety, and compliance risk assessment</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-3">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">High Risk</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-red-600">{analytics?.highRisks || 0}</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Active Risks</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{analytics?.activeRisks || 0}</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Total Risks</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{analytics?.riskCount || 0}</div>
                    </CardContent>
                  </Card>
                </div>

                <div className="space-y-3">
                  <h3 className="text-lg font-medium">Active Risk Assessments</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-3 border rounded">
                      <div className="flex items-center space-x-3">
                        <AlertTriangle className="h-4 w-4 text-orange-500" />
                        <div>
                          <p className="text-sm font-medium">Weather Delays</p>
                          <p className="text-xs text-muted-foreground">30% probability, moderate impact</p>
                        </div>
                      </div>
                      <Badge className="bg-orange-100 text-orange-800">Medium</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded">
                      <div className="flex items-center space-x-3">
                        <AlertTriangle className="h-4 w-4 text-yellow-500" />
                        <div>
                          <p className="text-sm font-medium">Material Supply Chain</p>
                          <p className="text-xs text-muted-foreground">20% probability, low impact</p>
                        </div>
                      </div>
                      <Badge className="bg-yellow-100 text-yellow-800">Low</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded">
                      <div className="flex items-center space-x-3">
                        <AlertTriangle className="h-4 w-4 text-red-500" />
                        <div>
                          <p className="text-sm font-medium">Labor Shortage</p>
                          <p className="text-xs text-muted-foreground">40% probability, high impact</p>
                        </div>
                      </div>
                      <Badge className="bg-red-100 text-red-800">High</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}