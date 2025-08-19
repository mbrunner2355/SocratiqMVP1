import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  FolderOpen, Plus, Edit, Trash2, Eye, Calendar, 
  User, Building, FileText, Target, Activity,
  Clock, CheckCircle, AlertTriangle, Search,
  Filter, MoreHorizontal, BarChart3, Users, Globe
} from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { EMMEProjectIntegration } from './emme/EMMEProjectIntegration';
import { EMMECrossProjectAnalytics } from './emme/EMMECrossProjectAnalytics';
import { EMMEProjectDetailView } from './emme/EMMEProjectDetailView';

// Form validation schema
const projectFormSchema = z.object({
  projectTitle: z.string().min(1, "Project title is required"),
  client: z.string().min(1, "Client is required"),
  team: z.string().min(1, "Team is required"),
  summary: z.string().min(1, "Summary is required"),
  overview: z.string().min(1, "Project overview is required"),
  scope: z.string().min(1, "Project scope is required"),
  timelineText: z.string().optional(),
  type: z.enum(["campaign", "clinical_trial", "regulatory_submission", "market_access"]),
  status: z.enum(["draft", "active", "completed", "on_hold", "cancelled"]).default("draft"),
  priority: z.enum(["low", "medium", "high", "critical"]).default("medium"),
  phase: z.string().optional(),
  therapeuticArea: z.string().optional(),
  indication: z.string().optional(),
  assignedTo: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  targetMarkets: z.array(z.string()).optional(),
  budget: z.object({
    total: z.number().optional(),
    allocated: z.number().optional(),
    spent: z.number().optional(),
  }).optional(),
  stakeholders: z.array(z.object({
    name: z.string(),
    role: z.string(),
    contact: z.string().optional(),
  })).optional(),
});

// Client and Team data (this would typically come from a database/API)
const CLIENTS = [
  { value: "pharmax", label: "PharmaX" },
  { value: "biotech_solutions", label: "BioTech Solutions" },
  { value: "medical_innovations", label: "Medical Innovations Inc." },
  { value: "global_pharma", label: "Global Pharma Corp" },
  { value: "clinical_research", label: "Clinical Research Partners" },
  { value: "bayer", label: "Bayer" },
];

const TEAMS = [
  { value: "m5_alpha", label: "m5 alpha" },
  { value: "discovery_team", label: "Discovery Team" },
  { value: "clinical_ops", label: "Clinical Operations" },
  { value: "regulatory_affairs", label: "Regulatory Affairs" },
  { value: "market_access", label: "Market Access Team" },
];

const PROJECT_TYPES = [
  { value: "campaign", label: "Marketing Campaign" },
  { value: "clinical_trial", label: "Clinical Trial" },
  { value: "regulatory_submission", label: "Regulatory Submission" },
  { value: "market_access", label: "Market Access" },
];

const PRIORITIES = [
  { value: "low", label: "Low Priority" },
  { value: "medium", label: "Medium Priority" },
  { value: "high", label: "High Priority" },
  { value: "critical", label: "Critical Priority" },
];

const THERAPEUTIC_AREAS = [
  { value: "oncology", label: "Oncology" },
  { value: "cardiology", label: "Cardiology" },
  { value: "neurology", label: "Neurology" },
  { value: "endocrinology", label: "Endocrinology" },
  { value: "immunology", label: "Immunology" },
  { value: "infectious_disease", label: "Infectious Disease" },
  { value: "womens_health", label: "Women's Health" },
];

type ProjectFormData = z.infer<typeof projectFormSchema>;

interface Project {
  id: string;
  projectTitle: string;
  client: string;
  team: string;
  summary: string;
  overview?: string;
  scope?: string;
  timelineText?: string;
  status: string;
  priority: string;
  type: string;
  phase?: string;
  therapeuticArea?: string;
  indication?: string;
  assignedTo?: string;
  startDate?: string;
  endDate?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  lastUpdated: string;
}

export function EMMEProjectManager() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [view, setView] = useState<'list' | 'integration' | 'analytics' | 'project-detail'>('list');
  const [selectedProjectForDetail, setSelectedProjectForDetail] = useState<Project | null>(null);
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch projects
  const { data: projectsData, isLoading, error } = useQuery({
    queryKey: ['/api/emme/projects', { search: searchTerm, status: statusFilter, type: typeFilter }],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (searchTerm) params.set('search', searchTerm);
      if (statusFilter && statusFilter !== 'all') params.set('status', statusFilter);
      if (typeFilter && typeFilter !== 'all') params.set('type', typeFilter);
      return await apiRequest(`/api/emme/projects?${params.toString()}`);
    }
  });

  // Fetch project analytics
  const { data: analytics } = useQuery({
    queryKey: ['/api/emme/projects/analytics/overview'],
    queryFn: async () => {
      return await apiRequest('/api/emme/projects/analytics/overview');
    }
  });

  // Create project mutation
  const createProjectMutation = useMutation({
    mutationFn: (data: ProjectFormData) => apiRequest('/api/emme/projects', { method: 'POST', body: data }),
    onSuccess: () => {
      // Force refetch of the current query with its exact parameters
      queryClient.invalidateQueries({ 
        predicate: (query) => query.queryKey[0] === '/api/emme/projects'
      });
      queryClient.invalidateQueries({ queryKey: ['/api/emme/projects/analytics/overview'] });
      setIsCreateDialogOpen(false);
      toast({
        title: "Success",
        description: "Project created successfully!",
      });
    },
    onError: (error) => {
      console.error('Error creating project:', error);
      toast({
        title: "Error",
        description: "Failed to create project. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Update project mutation
  const updateProjectMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<ProjectFormData> }) => 
      apiRequest(`/api/emme/projects/${id}`, { method: 'PUT', body: data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ 
        predicate: (query) => query.queryKey[0] === '/api/emme/projects'
      });
      queryClient.invalidateQueries({ queryKey: ['/api/emme/projects/analytics/overview'] });
      setIsEditDialogOpen(false);
      setSelectedProject(null);
      toast({
        title: "Success",
        description: "Project updated successfully!",
      });
    },
    onError: (error) => {
      console.error('Error updating project:', error);
      toast({
        title: "Error",
        description: "Failed to update project. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Delete project mutation
  const deleteProjectMutation = useMutation({
    mutationFn: (id: string) => apiRequest(`/api/emme/projects/${id}`, { method: 'DELETE' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ 
        predicate: (query) => query.queryKey[0] === '/api/emme/projects'
      });
      queryClient.invalidateQueries({ queryKey: ['/api/emme/projects/analytics/overview'] });
      toast({
        title: "Success",
        description: "Project deleted successfully!",
      });
    },
    onError: (error) => {
      console.error('Error deleting project:', error);
      toast({
        title: "Error",
        description: "Failed to delete project. Please try again.",
        variant: "destructive",
      });
    },
  });

  const createForm = useForm<ProjectFormData>({
    resolver: zodResolver(projectFormSchema),
    defaultValues: {
      status: "draft",
      priority: "medium",
    },
  });

  const editForm = useForm<ProjectFormData>({
    resolver: zodResolver(projectFormSchema),
  });

  const handleCreateProject = (data: ProjectFormData) => {
    createProjectMutation.mutate(data);
  };

  const handleUpdateProject = (data: ProjectFormData) => {
    if (!selectedProject) return;
    updateProjectMutation.mutate({ id: selectedProject.id, data });
  };

  const handleEditProject = (project: Project) => {
    setSelectedProject(project);
    editForm.reset({
      projectTitle: project.projectTitle,
      client: project.client,
      team: project.team,
      summary: project.summary,
      overview: project.overview || '',
      scope: project.scope || '',
      timelineText: project.timelineText || '',
      type: project.type as any,
      status: project.status as any,
      priority: project.priority as any,
      phase: project.phase || '',
      therapeuticArea: project.therapeuticArea || '',
      indication: project.indication || '',
      assignedTo: project.assignedTo || '',
      startDate: project.startDate || '',
      endDate: project.endDate || '',
    });
    setIsEditDialogOpen(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'completed': return 'bg-blue-500';
      case 'on_hold': return 'bg-yellow-500';
      case 'cancelled': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-blue-100 text-blue-800';
      case 'low': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const projects = projectsData?.projects || [];

  // Render different views
  if (view === 'project-detail' && selectedProjectForDetail) {
    return (
      <EMMEProjectDetailView 
        project={selectedProjectForDetail} 
        onBackToProjects={() => {
          setView('list');
          setSelectedProjectForDetail(null);
        }}
      />
    );
  }

  if (view === 'analytics') {
    return <EMMECrossProjectAnalytics />;
  }

  if (view === 'integration') {
    if (selectedProject) {
      return (
        <EMMEProjectIntegration 
          project={selectedProject} 
          onUpdate={(projectId, data) => {
            updateProjectMutation.mutate({ id: projectId, data });
          }}
          onBackToProjects={() => setView('list')}
        />
      );
    } else {
      // Show message to select a project for integration view
      return (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-purple-600">emme</span>
                  <span className="text-sm bg-purple-100 text-purple-700 px-2 py-1 rounded">engage</span>
                </div>
                <span className="text-gray-400">•</span>
                <h1 className="text-xl font-bold text-gray-900">Project Integration</h1>
              </div>
              <p className="text-gray-600">Select a project to view its Strategic Intelligence, Stakeholder Engagement, and Content Orchestration details</p>
            </div>
            <Button onClick={() => setView('list')} variant="outline">
              <FolderOpen className="w-4 h-4 mr-2" />
              Back to Projects
            </Button>
          </div>
          <Card>
            <CardContent className="p-8 text-center">
              <Target className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Project Selected</h3>
              <p className="text-gray-600 mb-4">Go back to the projects list and click the target icon on any project to view its integration details</p>
              <Button onClick={() => setView('list')}>
                <FolderOpen className="w-4 h-4 mr-2" />
                View Projects
              </Button>
            </CardContent>
          </Card>
        </div>
      );
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Button 
              variant="ghost" 
              onClick={() => window.location.href = '/emme-engage'}
              className="text-purple-600 hover:text-purple-700"
            >
              ← Back to EMME Engage
            </Button>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Project Information Completion</h1>
          <p className="text-gray-600">Manage and track your EMME projects</p>
        </div>
        <div className="flex items-center gap-3">
          {/* View Toggle */}
          <div className="flex items-center gap-1 border rounded-lg p-1">
            <Button
              variant={view === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setView('list')}
              className="h-8"
            >
              <FolderOpen className="w-4 h-4 mr-1" />
              Projects
            </Button>
            <Button
              variant={view === 'integration' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setView('integration')}
              className="h-8"
            >
              <Target className="w-4 h-4 mr-1" />
              Integration
            </Button>
            <Button
              variant={view === 'analytics' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setView('analytics')}
              className="h-8"
            >
              <BarChart3 className="w-4 h-4 mr-1" />
              Analytics
            </Button>
          </div>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Create New Project
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Project</DialogTitle>
              <DialogDescription>
                Fill out the project information to get started
              </DialogDescription>
            </DialogHeader>
            <Form {...createForm}>
              <form onSubmit={createForm.handleSubmit(handleCreateProject)} className="space-y-4">
                <FormField
                  control={createForm.control}
                  name="projectTitle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Project Title</FormLabel>
                      <FormControl>
                        <Input placeholder="VMS Global Campaign" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={createForm.control}
                    name="client"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Client</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select client" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {CLIENTS.map((client) => (
                              <SelectItem key={client.value} value={client.value}>
                                {client.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={createForm.control}
                    name="team"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Team</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select team" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {TEAMS.map((team) => (
                              <SelectItem key={team.value} value={team.value}>
                                {team.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={createForm.control}
                  name="summary"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Summary</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Launch strategy investigation and strategic planning for non-hormonal VMS treatment..."
                          rows={3}
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={createForm.control}
                  name="overview"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Project Overview</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Enter detailed project overview including objectives, key stakeholders, and expected outcomes..."
                          rows={4}
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={createForm.control}
                  name="scope"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Project Scope</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Define project scope including deliverables, boundaries, assumptions, and constraints..."
                          rows={4}
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={createForm.control}
                  name="timelineText"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Timeline Details</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Specify key milestones, phases, and timeline requirements..."
                          rows={3}
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={createForm.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Project Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {PROJECT_TYPES.map((type) => (
                              <SelectItem key={type.value} value={type.value}>
                                {type.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={createForm.control}
                    name="priority"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Priority</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select priority" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {PRIORITIES.map((priority) => (
                              <SelectItem key={priority.value} value={priority.value}>
                                {priority.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={createForm.control}
                    name="therapeuticArea"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Therapeutic Area</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select therapeutic area" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {THERAPEUTIC_AREAS.map((area) => (
                              <SelectItem key={area.value} value={area.value}>
                                {area.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={createForm.control}
                    name="indication"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Indication</FormLabel>
                        <FormControl>
                          <Input placeholder="Vasomotor Symptoms" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={createForm.control}
                    name="phase"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phase</FormLabel>
                        <FormControl>
                          <Input placeholder="Phase III" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={createForm.control}
                    name="assignedTo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Assigned To</FormLabel>
                        <FormControl>
                          <Input placeholder="Project Manager" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={createForm.control}
                    name="startDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Start Date</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={createForm.control}
                    name="endDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>End Date</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={createProjectMutation.isPending}>
                    {createProjectMutation.isPending ? 'Creating...' : 'Create Project'}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Analytics Cards */}
      {analytics && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Projects</p>
                  <p className="text-2xl font-bold">{analytics.summary.totalProjects}</p>
                </div>
                <FolderOpen className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Active Projects</p>
                  <p className="text-2xl font-bold">{analytics.summary.activeProjects}</p>
                </div>
                <Activity className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Completed</p>
                  <p className="text-2xl font-bold">{analytics.summary.completedProjects}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Draft Projects</p>
                  <p className="text-2xl font-bold">{analytics.summary.draftProjects}</p>
                </div>
                <FileText className="w-8 h-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters */}
      <div className="flex space-x-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search projects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="on_hold">On Hold</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="campaign">Campaign</SelectItem>
            <SelectItem value="clinical_trial">Clinical Trial</SelectItem>
            <SelectItem value="regulatory_submission">Regulatory Submission</SelectItem>
            <SelectItem value="market_access">Market Access</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Projects List */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="text-center py-8">
            <Clock className="w-8 h-8 mx-auto mb-4 text-gray-400 animate-spin" />
            <p className="text-gray-600">Loading projects...</p>
          </div>
        ) : projects.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <FolderOpen className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No projects found</h3>
              <p className="text-gray-600 mb-4">Get started by creating your first project</p>
              <Button onClick={() => setIsCreateDialogOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Create Project
              </Button>
            </CardContent>
          </Card>
        ) : (
          projects.map((project: Project) => (
            <Card key={project.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 
                        className="text-lg font-semibold text-gray-900 cursor-pointer hover:text-purple-600 transition-colors"
                        onClick={() => {
                          setSelectedProjectForDetail(project);
                          setView('project-detail');
                        }}
                      >
                        {project.projectTitle}
                      </h3>
                      <div className={`w-3 h-3 rounded-full ${getStatusColor(project.status)}`} />
                      <Badge variant="outline" className={getPriorityColor(project.priority)}>
                        {project.priority}
                      </Badge>
                      <Badge variant="outline">
                        {project.type.replace('_', ' ')}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                      <div className="flex items-center text-sm text-gray-600">
                        <Building className="w-4 h-4 mr-2" />
                        {project.client}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <User className="w-4 h-4 mr-2" />
                        {project.team}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="w-4 h-4 mr-2" />
                        {new Date(project.lastUpdated).toLocaleDateString()}
                      </div>
                    </div>

                    <p className="text-gray-700 mb-3">{project.summary}</p>

                    {(project.therapeuticArea || project.indication) && (
                      <div className="flex space-x-4 text-sm text-gray-600">
                        {project.therapeuticArea && (
                          <span>Therapeutic Area: {project.therapeuticArea}</span>
                        )}
                        {project.indication && (
                          <span>Indication: {project.indication}</span>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center space-x-2 ml-4">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => {
                        setSelectedProjectForDetail(project);
                        setView('project-detail');
                      }}
                      title="View Project Details"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => {
                        setSelectedProject(project);
                        setView('integration');
                      }}
                      title="View Integration Details"
                    >
                      <Target className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleEditProject(project)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => deleteProjectMutation.mutate(project.id)}
                      disabled={deleteProjectMutation.isPending}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Edit Project Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Project</DialogTitle>
            <DialogDescription>
              Update project information
            </DialogDescription>
          </DialogHeader>
          {selectedProject && (
            <Form {...editForm}>
              <form onSubmit={editForm.handleSubmit(handleUpdateProject)} className="space-y-4">
                <FormField
                  control={editForm.control}
                  name="projectTitle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Project Title</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={editForm.control}
                    name="client"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Client</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={editForm.control}
                    name="team"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Team</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={editForm.control}
                  name="summary"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Summary</FormLabel>
                      <FormControl>
                        <Textarea rows={3} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-3 gap-4">
                  <FormField
                    control={editForm.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="draft">Draft</SelectItem>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                            <SelectItem value="on_hold">On Hold</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={editForm.control}
                    name="priority"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Priority</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="low">Low</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="high">High</SelectItem>
                            <SelectItem value="critical">Critical</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={editForm.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Type</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="campaign">Campaign</SelectItem>
                            <SelectItem value="clinical_trial">Clinical Trial</SelectItem>
                            <SelectItem value="regulatory_submission">Regulatory Submission</SelectItem>
                            <SelectItem value="market_access">Market Access</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={updateProjectMutation.isPending}>
                    {updateProjectMutation.isPending ? 'Updating...' : 'Update Project'}
                  </Button>
                </div>
              </form>
            </Form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}