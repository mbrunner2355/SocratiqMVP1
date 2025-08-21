import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Search, Building, Users, Calendar, Target, Activity, CheckCircle, FileText, FolderOpen } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { type Project } from '@shared/schema';

export function SimpleProjectManager() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  // Fetch project data - with fallback for API routing issues
  const { data: projects = [], isLoading, error } = useQuery({
    queryKey: ['/api/projects'],
    queryFn: async (): Promise<Project[]> => {
      try {
        const response = await fetch('/api/projects');
        
        // Check if we got HTML instead of JSON (API routing issue)
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('text/html')) {
          console.warn('API routing issue detected - using local storage fallback');
          // Return projects from localStorage if available
          const savedProjects = localStorage.getItem('emme-projects');
          return savedProjects ? JSON.parse(savedProjects) : [];
        }
        
        if (!response.ok) {
          throw new Error('Failed to fetch projects');
        }
        return response.json();
      } catch (error) {
        console.warn('API error, using local storage fallback:', error);
        // Fallback to localStorage
        const savedProjects = localStorage.getItem('emme-projects');
        return savedProjects ? JSON.parse(savedProjects) : [];
      }
    }
  });

  const filteredProjects = projects.filter(project =>
    project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (project.therapeuticArea && project.therapeuticArea.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'completed': return 'bg-blue-500';
      case 'draft': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  // Show selected project details
  if (selectedProject) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Button
            onClick={() => setSelectedProject(null)}
            variant="outline"
          >
            ← Back to Projects
          </Button>
        </div>
        
        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-xl">{selectedProject.name}</CardTitle>
                <CardDescription>
                  {selectedProject.organizationType} • {selectedProject.therapeuticArea}
                </CardDescription>
              </div>
              <Badge className={`${getStatusColor(selectedProject.status || 'draft')} text-white`}>
                {(selectedProject.status || 'draft').toUpperCase()}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Project Details</h4>
                <p className="text-gray-600">{selectedProject.patientPopulation || 'No description available'}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Development Stage</p>
                  <p className="font-medium">{selectedProject.developmentStage || 'Not specified'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Created</p>
                  <p className="font-medium">
                    {selectedProject.createdAt ? new Date(selectedProject.createdAt).toLocaleDateString() : 'Unknown'}
                  </p>
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
      </div>

      {/* Stats Cards */}
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
          placeholder="Search projects, therapeutic areas..."
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
                    onClick={() => {
                      // Navigate to project workspace starting with Project Insights
                      setSelectedProject(project);
                      // Store project context and navigate to Project Insights by default
                      sessionStorage.setItem('current-project', JSON.stringify(project));
                      const lastSection = sessionStorage.getItem(`project-${project.id}-last-section`) || 'project-insights';
                      window.dispatchEvent(new CustomEvent('navigateToModule', { 
                        detail: { moduleId: lastSection, projectData: project }
                      }));
                    }}
                    variant="outline"
                    size="sm"
                  >
                    Open Project
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
                {searchTerm ? 'No projects match your search criteria.' : 'Create your first project using the navigation menu.'}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}