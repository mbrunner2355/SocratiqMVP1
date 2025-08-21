import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Plus, FolderOpen, Search, Building, Users, Calendar, Target, Activity, CheckCircle, FileText } from 'lucide-react';

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

export function SimpleProjectManager() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProject, setSelectedProject] = useState<any>(null);

  const filteredProjects = MOCK_PROJECTS.filter(project =>
    project.projectTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.therapeuticArea.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Create New Project
        </Button>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Projects</p>
                <p className="text-2xl font-bold">{MOCK_PROJECTS.length}</p>
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
                <p className="text-2xl font-bold">{MOCK_PROJECTS.filter(p => p.status === 'active').length}</p>
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
                <p className="text-2xl font-bold">{MOCK_PROJECTS.filter(p => p.status === 'completed').length}</p>
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
                <p className="text-2xl font-bold">{MOCK_PROJECTS.filter(p => p.status === 'draft').length}</p>
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

      {/* Projects List */}
      <div className="grid gap-4">
        {filteredProjects.map((project) => (
          <Card key={project.id} className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{project.projectTitle}</h3>
                    <Badge className={getPriorityColor(project.priority)}>{project.priority}</Badge>
                    <Badge className={`${getStatusColor(project.status)} text-white`}>{project.status}</Badge>
                  </div>
                  
                  <p className="text-gray-600 mb-3">{project.description}</p>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Building className="w-4 h-4 text-gray-400" />
                      <span>{project.client}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-gray-400" />
                      <span>{project.team}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Target className="w-4 h-4 text-gray-400" />
                      <span>{project.therapeuticArea}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span>{project.endDate}</span>
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
                  <div className="mt-2">
                    <span className="text-sm text-gray-600">Progress: {project.progress}%</span>
                    <div className="w-24 bg-gray-200 rounded-full h-1.5 mt-1">
                      <div 
                        className="bg-purple-600 h-1.5 rounded-full transition-all duration-300"
                        style={{ width: `${project.progress}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}