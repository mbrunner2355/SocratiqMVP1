import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus, FolderOpen, Search, Building, Users, Calendar, Target, Activity, CheckCircle, FileText } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { type Project } from '@shared/schema';

// Form validation schema
const projectFormSchema = z.object({
  projectTitle: z.string().min(1, "Project title is required"),
  client: z.string().min(1, "Client is required"),
  team: z.string().min(1, "Team is required"),
  description: z.string().min(1, "Description is required"),
  type: z.enum(["campaign", "clinical_trial", "regulatory_submission", "market_access"]),
  status: z.enum(["draft", "active", "completed", "on_hold"]).default("draft"),
  priority: z.enum(["low", "medium", "high", "critical"]).default("medium"),
  therapeuticArea: z.string().min(1, "Therapeutic area is required"),
  indication: z.string().min(1, "Indication is required"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
  budget: z.number().min(1, "Budget is required"),
});

type ProjectFormData = z.infer<typeof projectFormSchema>;

// Mock pharmaceutical project data
const MOCK_PROJECTS = [
  {
    id: '1',
    projectTitle: 'Oncology Launch Strategy - Phase III',
    client: 'BioPharma Solutions',
    team: 'Alpha Strategic Team',
    status: 'active',
    priority: 'high',
    type: 'campaign',
    therapeuticArea: 'Oncology',
    indication: 'Non-Small Cell Lung Cancer',
    startDate: '2024-08-01',
    endDate: '2025-02-28',
    progress: 78,
    budget: { total: 2500000, spent: 1950000 },
    description: 'Comprehensive launch strategy for novel NSCLC therapy targeting PDL-1 resistant tumors'
  },
  {
    id: '2',
    projectTitle: 'Regulatory Filing - Fast Track Designation',
    client: 'MedTech Innovations',
    team: 'Regulatory Affairs',
    status: 'completed',
    priority: 'critical',
    type: 'regulatory_submission',
    therapeuticArea: 'Cardiology',
    indication: 'Heart Failure with Preserved Ejection Fraction',
    startDate: '2024-06-15',
    endDate: '2024-12-15',
    progress: 100,
    budget: { total: 1800000, spent: 1750000 },
    description: 'FDA fast track designation submission for breakthrough HFpEF device therapy'
  },
  {
    id: '3',
    projectTitle: 'Market Access Strategy - Payer Engagement',
    client: 'Global Pharma Corp',
    team: 'Market Access Team',
    status: 'active',
    priority: 'medium',
    type: 'market_access',
    therapeuticArea: 'Neurology',
    indication: 'Alzheimer\'s Disease',
    startDate: '2024-09-01',
    endDate: '2025-06-30',
    progress: 45,
    budget: { total: 3200000, spent: 1440000 },
    description: 'Comprehensive payer strategy for novel amyloid-targeting therapy launch'
  },
  {
    id: '4',
    projectTitle: 'Clinical Trial Communication Plan',
    client: 'Clinical Research Partners',
    team: 'Clinical Operations',
    status: 'draft',
    priority: 'medium',
    type: 'clinical_trial',
    therapeuticArea: 'Immunology',
    indication: 'Rheumatoid Arthritis',
    startDate: '2025-01-15',
    endDate: '2025-08-30',
    progress: 15,
    budget: { total: 1600000, spent: 240000 },
    description: 'Phase III trial communication strategy for JAK inhibitor in moderate-to-severe RA'
  }
];

// Client and Team data
const CLIENTS = [
  { value: "biopharma_solutions", label: "BioPharma Solutions" },
  { value: "medtech_innovations", label: "MedTech Innovations" },
  { value: "global_pharma_corp", label: "Global Pharma Corp" },
  { value: "clinical_research_partners", label: "Clinical Research Partners" },
  { value: "emerging_biotech", label: "Emerging Biotech" },
];

const TEAMS = [
  { value: "alpha_strategic", label: "Alpha Strategic Team" },
  { value: "regulatory_affairs", label: "Regulatory Affairs" },
  { value: "market_access", label: "Market Access Team" },
  { value: "clinical_operations", label: "Clinical Operations" },
  { value: "discovery_team", label: "Discovery Team" },
];

const THERAPEUTIC_AREAS = [
  { value: "oncology", label: "Oncology" },
  { value: "cardiology", label: "Cardiology" },
  { value: "neurology", label: "Neurology" },
  { value: "immunology", label: "Immunology" },
  { value: "infectious_disease", label: "Infectious Disease" },
  { value: "endocrinology", label: "Endocrinology" },
];

export function SimpleProjectManager() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  // Fetch real project data from database
  const { data: projects = [], isLoading, error } = useQuery({
    queryKey: ['/api/projects'],
    queryFn: async (): Promise<Project[]> => {
      const response = await fetch('/api/projects');
      if (!response.ok) {
        throw new Error('Failed to fetch projects');
      }
      return response.json();
    }
  });

  const form = useForm<ProjectFormData>({
    resolver: zodResolver(projectFormSchema),
    defaultValues: {
      status: "draft",
      priority: "medium",
    },
  });

  const filteredProjects = projects.filter(project =>
    project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (project.therapeuticArea && project.therapeuticArea.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleCreateProject = (data: ProjectFormData) => {
    const newProject = {
      id: Date.now().toString(),
      projectTitle: data.projectTitle,
      client: CLIENTS.find(c => c.value === data.client)?.label || data.client,
      team: TEAMS.find(t => t.value === data.team)?.label || data.team,
      status: data.status,
      priority: data.priority,
      type: data.type,
      therapeuticArea: THERAPEUTIC_AREAS.find(t => t.value === data.therapeuticArea)?.label || data.therapeuticArea,
      indication: data.indication,
      startDate: data.startDate,
      endDate: data.endDate,
      progress: 0,
      budget: { total: data.budget, spent: 0 },
      description: data.description
    };
    
    setProjects(prev => [newProject, ...prev]);
    setIsCreateDialogOpen(false);
    form.reset();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'completed': return 'bg-blue-500';
      case 'draft': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (selectedProject) {
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
              <h1 className="text-xl font-bold text-gray-900">Project Details</h1>
            </div>
          </div>
          <Button onClick={() => setSelectedProject(null)} variant="outline">
            ← Back to Projects
          </Button>
        </div>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-xl">{selectedProject.projectTitle}</CardTitle>
                <CardDescription className="mt-2">{selectedProject.description}</CardDescription>
              </div>
              <div className="flex gap-2">
                <Badge className={getPriorityColor(selectedProject.priority)}>{selectedProject.priority}</Badge>
                <Badge className={`${getStatusColor(selectedProject.status)} text-white`}>{selectedProject.status}</Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-gray-600">Client</p>
                <p className="font-medium">{selectedProject.client}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Team</p>
                <p className="font-medium">{selectedProject.team}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Therapeutic Area</p>
                <p className="font-medium">{selectedProject.therapeuticArea}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Indication</p>
                <p className="font-medium">{selectedProject.indication}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Project Progress</span>
                  <span className="text-sm text-gray-600">{selectedProject.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${selectedProject.progress}%` }}
                  ></div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Budget</p>
                  <p className="font-medium">${selectedProject.budget.total.toLocaleString()}</p>
                  <p className="text-xs text-gray-500">Spent: ${selectedProject.budget.spent.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Timeline</p>
                  <p className="font-medium">{selectedProject.startDate} → {selectedProject.endDate}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-purple-600">emme</span>
              <span className="text-sm bg-purple-100 text-purple-700 px-2 py-1 rounded">engage</span>
            </div>
            <span className="text-gray-400">•</span>
            <h1 className="text-xl font-bold text-gray-900">Project Management</h1>
          </div>
          <p className="text-gray-600">Track and manage your pharmaceutical intelligence projects</p>
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
              <DialogTitle>Create New Pharmaceutical Project</DialogTitle>
              <DialogDescription>
                Set up a new pharmaceutical intelligence project for strategic planning and execution
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleCreateProject)} className="space-y-6">
                {/* Basic Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Project Information</h3>
                  
                  <FormField
                    control={form.control}
                    name="projectTitle"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Project Title</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Oncology Launch Strategy - Phase III" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
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
                      control={form.control}
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
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Project Description</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Comprehensive description of the project scope and objectives..."
                            className="min-h-[100px]"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Project Details */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Project Details</h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Project Type</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select project type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="campaign">Marketing Campaign</SelectItem>
                              <SelectItem value="clinical_trial">Clinical Trial</SelectItem>
                              <SelectItem value="regulatory_submission">Regulatory Submission</SelectItem>
                              <SelectItem value="market_access">Market Access</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
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
                              <SelectItem value="low">Low Priority</SelectItem>
                              <SelectItem value="medium">Medium Priority</SelectItem>
                              <SelectItem value="high">High Priority</SelectItem>
                              <SelectItem value="critical">Critical Priority</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
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
                      control={form.control}
                      name="indication"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Indication</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., Non-Small Cell Lung Cancer" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Timeline & Budget */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Timeline & Budget</h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
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
                      control={form.control}
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

                  <FormField
                    control={form.control}
                    name="budget"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Total Budget ($)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            placeholder="e.g., 2500000"
                            onChange={(e) => field.onChange(Number(e.target.value))}
                            value={field.value || ''}
                          />
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
                  <Button type="submit">
                    Create Project
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Projects</p>
                <p className="text-2xl font-bold">{projects.length}</p>
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
                <p className="text-2xl font-bold">{projects.filter(p => p.status === 'active').length}</p>
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
                <p className="text-2xl font-bold">{projects.filter(p => p.status === 'completed').length}</p>
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
                <p className="text-2xl font-bold">{projects.filter(p => p.status === 'draft').length}</p>
              </div>
              <FileText className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search projects, clients, or therapeutic areas..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Loading State */}
      {isLoading && (
        <Card>
          <CardContent className="p-6">
            <div className="animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Error State */}
      {error && (
        <Card>
          <CardContent className="p-6">
            <p className="text-red-600">Error loading projects: {error.message}</p>
          </CardContent>
        </Card>
      )}

      {/* Projects List */}
      <div className="grid gap-4">
        {!isLoading && !error && filteredProjects.map((project) => (
          <Card key={project.id} className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{project.name}</h3>
                    <Badge className={`${getStatusColor(project.status || 'draft')} text-white`}>
                      {(project.status || 'draft').replace('_', ' ').toUpperCase()}
                    </Badge>
                  </div>
                  
                  <p className="text-gray-600 mb-3">
                    {project.patientPopulation || 'Patient population and clinical insights not specified'}
                  </p>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Building className="w-4 h-4 text-gray-400" />
                      <span>{project.organizationType || 'Not specified'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Target className="w-4 h-4 text-gray-400" />
                      <span>{project.therapeuticArea || 'Unspecified area'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-gray-400" />
                      <span>{project.developmentStage || 'Not specified'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span>{project.createdAt ? new Date(project.createdAt).toLocaleDateString() : 'No date'}</span>
                    </div>
                  </div>
                </div>
                
                <div className="ml-4 text-right">
                  <Button
                    onClick={() => setSelectedProject(project)}
                    variant="outline"
                    size="sm"
                  >
                    View Details
                  </Button>
                  <div className="mt-2 text-xs text-gray-500">
                    Created: {project.createdAt ? new Date(project.createdAt).toLocaleDateString() : 'Unknown'}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        
        {/* Empty State */}
        {!isLoading && !error && filteredProjects.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <FolderOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No projects found</h3>
              <p className="text-gray-600 mb-4">
                {searchTerm ? 'No projects match your search criteria.' : 'Create your first project to get started.'}
              </p>
              <Button onClick={() => setIsCreateDialogOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Create New Project
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}