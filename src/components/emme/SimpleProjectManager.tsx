import { useState, useEffect } from 'react';
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

  // Clean up localStorage on component mount to remove old VMS Global project
  useEffect(() => {
    const cleanupAndDeduplicateProjects = () => {
      const stored = localStorage.getItem('emme-projects');
      if (stored) {
        try {
          let projects = JSON.parse(stored);
          const originalLength = projects.length;
          
          // Remove duplicates and old projects, and update status for incomplete projects
          const uniqueProjects = projects.reduce((acc: any[], current: any) => {
            // Skip old VMS Global projects without proper client/team info
            if (current.name === "VMS Global" && (!current.client || current.client !== "PharmaX")) {
              return acc;
            }
            
            // Update status to draft if project is incomplete
            const updatedCurrent = {
              ...current,
              status: (!current.developmentStage || !current.patientPopulation) ? 'draft' : (current.status || 'active')
            };
            
            // Check for duplicates by name and client
            const existing = acc.find((p: any) => 
              p.name === updatedCurrent.name && 
              p.client === updatedCurrent.client
            );
            
            if (!existing) {
              acc.push(updatedCurrent);
            } else {
              // Keep the most recent version
              const currentDate = new Date(updatedCurrent.updatedAt || updatedCurrent.createdAt);
              const existingDate = new Date(existing.updatedAt || existing.createdAt);
              if (currentDate > existingDate) {
                const index = acc.indexOf(existing);
                acc[index] = updatedCurrent;
              }
            }
            return acc;
          }, []);
          
          if (projects.length !== originalLength || uniqueProjects.length !== projects.length) {
            localStorage.setItem('emme-projects', JSON.stringify(uniqueProjects));
            console.log(`Cleaned up projects: ${originalLength} → ${uniqueProjects.length}`);
            
            // Clear session storage to force fresh load with updated project data
            sessionStorage.removeItem('current-project');
            sessionStorage.removeItem('edit-mode');
          }
        } catch (error) {
          console.error('Failed to cleanup projects:', error);
        }
      }
    };
    
    cleanupAndDeduplicateProjects();
  }, []);

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
      default: return 'bg-yellow-500'; // Default to draft for new projects
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
              <FolderOpen className="w-8 h-8 text-purple-500" />
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
              <Activity className="w-8 h-8 text-red-500" />
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
              <CheckCircle className="w-8 h-8 text-green-500" />
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
              <FileText className="w-8 h-8 text-purple-400" />
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
                  
                  {/* Show summary if available from form */}
                  {project.summary && (
                    <p className="text-gray-600 mb-3 line-clamp-2">{project.summary}</p>
                  )}
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    {/* Show client from form if available */}
                    {project.client ? (
                      <div className="flex items-center gap-2">
                        <Building className="w-4 h-4 text-gray-400" />
                        <span>Client: {project.client}</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Building className="w-4 h-4 text-gray-400" />
                        <span>{project.organizationType || 'Not specified'}</span>
                      </div>
                    )}
                    
                    {/* Show team from form if available */}
                    {project.team ? (
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-gray-400" />
                        <span>Team: {project.team}</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Target className="w-4 h-4 text-gray-400" />
                        <span>{project.therapeuticArea || 'Unspecified area'}</span>
                      </div>
                    )}
                    
                    <div className="flex items-center gap-2">
                      <Target className="w-4 h-4 text-gray-400" />
                      <span>{project.therapeuticArea || 'Unspecified area'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span>{project.createdAt ? new Date(project.createdAt).toLocaleDateString() : 'No date'}</span>
                    </div>
                  </div>
                </div>
                
                <div className="ml-4 text-right">
                  <div className="flex flex-col gap-2">
                    <Button
                      onClick={() => {
                        // Navigate to project workspace - resume where user left off
                        setSelectedProject(project);
                        sessionStorage.setItem('current-project', JSON.stringify(project));
                        const lastSection = sessionStorage.getItem(`project-${project.id}-last-section`) || 'project-insights';
                        window.dispatchEvent(new CustomEvent('navigateToModule', { 
                          detail: { moduleId: lastSection, projectData: project }
                        }));
                      }}
                      className="bg-purple-600 hover:bg-purple-700 text-white"
                      size="sm"
                    >
                      Continue Work
                    </Button>
                    <Button
                      onClick={() => {
                        // Navigate to edit mode (project creation with existing data)
                        setSelectedProject(project);
                        sessionStorage.setItem('current-project', JSON.stringify(project));
                        sessionStorage.setItem('edit-mode', 'true');
                        window.dispatchEvent(new CustomEvent('navigateToModule', { 
                          detail: { moduleId: 'create-project', projectData: project }
                        }));
                      }}
                      variant="outline"
                      size="sm"
                    >
                      Edit Project
                    </Button>
                  </div>
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