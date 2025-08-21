import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ProjectWizard } from "./ProjectWizard";
import { 
  FolderOpen,
  Plus, 
  Calendar,
  Users,
  Target,
  TrendingUp,
  Brain,
  BookOpen,
  Shield,
  MoreVertical,
  Edit,
  Trash,
  FileText,
  Zap
} from "lucide-react";

interface ProjectManagerProps {
  mode: "list" | "create" | "edit";
  projectId?: string;
  showWizard?: boolean;
}

export function ProjectManager({ mode, projectId, showWizard: initialShowWizard }: ProjectManagerProps) {
  const [showCreateForm, setShowCreateForm] = useState(mode === "create" || mode === "edit");
  const [showWizard, setShowWizard] = useState(initialShowWizard || false);
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    client: "",
    description: "",
    startDate: new Date().toISOString().split('T')[0], // Default to today
    endDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Default to 6 months from today
    modules: ["insight-engine", "engagement-studio"] // Default modules
  });

  // Mock project data
  const projects = [
    {
      id: "proj-001",
      name: "Oncology Campaign Q3",
      client: "PharmaCorp Global",
      status: "active",
      progress: 78,
      startDate: "2024-01-15",
      endDate: "2024-06-30",
      teamMembers: 8,
      modules: ["Insight Engine", "Engagement Studio", "Learning Hub"],
      budget: 450000,
      spent: 312000
    },
    {
      id: "proj-002", 
      name: "Diabetes Education Series",
      client: "MediHealth Solutions",
      status: "planning",
      progress: 25,
      startDate: "2024-02-01",
      endDate: "2024-08-31",
      teamMembers: 5,
      modules: ["Engagement Studio", "Learning Hub", "Equity Infrastructure"],
      budget: 275000,
      spent: 65000
    },
    {
      id: "proj-003",
      name: "Rare Disease Awareness",
      client: "BioTech Innovations",
      status: "completed",
      progress: 100,
      startDate: "2023-09-01",
      endDate: "2024-01-31",
      teamMembers: 12,
      modules: ["Insight Engine", "Engagement Studio", "Learning Hub", "Equity Infrastructure"],
      budget: 680000,
      spent: 652000
    }
  ];

  const handleModuleToggle = (moduleId: string) => {
    setFormData(prev => ({
      ...prev,
      modules: prev.modules.includes(moduleId)
        ? prev.modules.filter(id => id !== moduleId)
        : [...prev.modules, moduleId]
    }));
  };

  const handleCreateProject = () => {
    // Validate form
    if (!formData.name || !formData.client || !formData.startDate || !formData.endDate) {
      alert("Please fill in all required fields");
      return;
    }

    // In a real app, this would make an API call
    console.log("Creating project:", formData);
    
    // Show success message and go back to list
    alert("Project created successfully!");
    setShowCreateForm(false);
    setEditingProjectId(null);
    
    // Reset form after creation
    setFormData({
      name: "",
      client: "",
      description: "",
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      modules: ["insight-engine", "engagement-studio"]
    });
  };

  // Clear success message after some time
  useEffect(() => {
    if (lastUpdated) {
      const timer = setTimeout(() => {
        setLastUpdated(null);
      }, 5000); // Clear after 5 seconds
      
      return () => clearTimeout(timer);
    }
  }, [lastUpdated]);

  const handleUpdateProject = async () => {
    // Validate form
    if (!formData.name || !formData.client || !formData.startDate || !formData.endDate) {
      alert("Please fill in all required fields");
      return;
    }

    setIsUpdating(true);
    
    try {
      // In a real app, this would make an API call to update the project
      console.log("Updating project:", editingProjectId || projectId, formData);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Record the update time and project name
      const timestamp = new Date().toLocaleTimeString();
      setLastUpdated(`"${formData.name}" updated at ${timestamp}`);
      
      // Show success message and go back to list
      alert(`✓ Project "${formData.name}" updated successfully!`);
      setShowCreateForm(false);
      setEditingProjectId(null);
      
      // Reset form after update
      setFormData({
        name: "",
        client: "",
        description: "",
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        modules: ["insight-engine", "engagement-studio"]
      });
    } catch (error) {
      alert("Failed to update project. Please try again.");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleWizardComplete = (wizardData: any) => {
    console.log("Wizard completed with data:", wizardData);
    setShowWizard(false);
    setShowCreateForm(false);
    
    // Provide user feedback
    const projectName = wizardData.name || "New Project";
    console.log(`✓ Project "${projectName}" created successfully`);
  };

  const handleWizardNavigateToModule = (moduleId: string, projectData: any) => {
    console.log("Navigating to module:", moduleId, "with project data:", projectData);
    setShowWizard(false);
    setShowCreateForm(false);
    
    // Trigger navigation to the specific module
    window.dispatchEvent(new CustomEvent('navigateToModule', { 
      detail: { moduleId, projectData } 
    }));
    
    // Provide user feedback
    const moduleName = moduleId.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());
    console.log(`✓ Project created! Opening ${moduleName}...`);
  };

  const handleWizardCancel = () => {
    setShowWizard(false);
  };

  const handleEditProject = (project: any) => {
    console.log("Editing project:", project);
    
    // Set the editing project ID
    setEditingProjectId(project.id);
    
    // Load project data into form
    setFormData({
      name: project.name || "",
      client: project.client || "",
      description: project.description || "",
      startDate: project.startDate || "",
      endDate: project.endDate || "",
      modules: project.modules ? project.modules.map((m: string) => 
        m.toLowerCase().replace(/ /g, '-')) : ["insight-engine", "engagement-studio"]
    });
    
    // Show the form in edit mode
    setShowCreateForm(true);
    console.log("Project loaded for editing with ID:", project.id);
  };

  const CreateProjectForm = () => (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">
            {editingProjectId ? "Edit Pharmaceutical Project" : "Create New Pharmaceutical Project"}
          </h2>
          <Button variant="outline" onClick={() => {
            setShowCreateForm(false);
            setEditingProjectId(null);
          }}>
            Cancel
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="project-name">Project Name *</Label>
            <Input 
              id="project-name" 
              placeholder="e.g., Oncology Campaign Q4"
              value={formData.name}
              onChange={(e) => {
                console.log("Input changed:", e.target.value);
                setFormData(prev => ({ ...prev, name: e.target.value }));
              }}
              autoComplete="off"
              autoFocus
              className="w-full"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="client">Client *</Label>
            <Select value={formData.client} onValueChange={(value) => setFormData(prev => ({ ...prev, client: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select client" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pharmacorp">PharmaCorp Global</SelectItem>
                <SelectItem value="medihealth">MediHealth Solutions</SelectItem>
                <SelectItem value="biotech">BioTech Innovations</SelectItem>
                <SelectItem value="new">+ Add New Client</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Project Description</Label>
          <Textarea 
            id="description" 
            placeholder="Describe the pharmaceutical marketing objectives and target outcomes..."
            rows={3}
            value={formData.description}
            onChange={(e) => {
              console.log("Textarea changed:", e.target.value);
              setFormData(prev => ({ ...prev, description: e.target.value }));
            }}
            autoComplete="off"
            className="w-full resize-none"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="start-date">Start Date *</Label>
            <Input 
              id="start-date" 
              type="date"
              value={formData.startDate}
              onChange={(e) => {
                console.log("Start date changed:", e.target.value);
                setFormData(prev => ({ ...prev, startDate: e.target.value }));
              }}
              className="w-full"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="end-date">End Date *</Label>
            <Input 
              id="end-date" 
              type="date"
              value={formData.endDate}
              onChange={(e) => {
                console.log("End date changed:", e.target.value);
                setFormData(prev => ({ ...prev, endDate: e.target.value }));
              }}
              className="w-full"
            />
          </div>
        </div>

        <div className="space-y-4">
          <Label>Select Intelligence Modules</Label>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-3 p-4 border rounded-lg">
              <input 
                type="checkbox" 
                id="insight-engine" 
                checked={formData.modules.includes("insight-engine")}
                onChange={() => handleModuleToggle("insight-engine")}
              />
              <div className="flex items-center space-x-2">
                <Brain className="w-4 h-4 text-blue-600" />
                <Label htmlFor="insight-engine" className="text-sm font-medium">Insight Engine</Label>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-4 border rounded-lg">
              <input 
                type="checkbox" 
                id="engagement-studio" 
                checked={formData.modules.includes("engagement-studio")}
                onChange={() => handleModuleToggle("engagement-studio")}
              />
              <div className="flex items-center space-x-2">
                <Target className="w-4 h-4 text-green-600" />
                <Label htmlFor="engagement-studio" className="text-sm font-medium">Engagement Studio</Label>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-4 border rounded-lg">
              <input 
                type="checkbox" 
                id="learning-hub" 
                checked={formData.modules.includes("learning-hub")}
                onChange={() => handleModuleToggle("learning-hub")}
              />
              <div className="flex items-center space-x-2">
                <BookOpen className="w-4 h-4 text-purple-600" />
                <Label htmlFor="learning-hub" className="text-sm font-medium">Learning Hub</Label>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-4 border rounded-lg">
              <input 
                type="checkbox" 
                id="equity-infrastructure" 
                checked={formData.modules.includes("equity-infrastructure")}
                onChange={() => handleModuleToggle("equity-infrastructure")}
              />
              <div className="flex items-center space-x-2">
                <Shield className="w-4 h-4 text-orange-600" />
                <Label htmlFor="equity-infrastructure" className="text-sm font-medium">Equity Infrastructure</Label>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-4 pt-4">
          <Button variant="outline" onClick={() => setShowCreateForm(false)}>
            Save as Draft
          </Button>
          <Button 
            style={{ backgroundColor: '#9B7FB8' }}
            onClick={editingProjectId ? handleUpdateProject : handleCreateProject}
            disabled={isUpdating}
          >
            {isUpdating ? "Updating..." : (editingProjectId ? "Update Project" : "Create Project")}
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const ProjectsList = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Pharmaceutical Projects</h1>
          <p className="text-gray-600">Manage your marketing intelligence projects</p>
        </div>
        <div className="flex space-x-2">
          <Button 
            style={{ backgroundColor: '#9B7FB8' }}
            onClick={() => setShowWizard(true)}
          >
            <Zap className="w-4 h-4 mr-2" />
            Smart Wizard
          </Button>
          <Button 
            variant="outline"
            onClick={() => setShowCreateForm(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Quick Create
          </Button>
        </div>
      </div>

      {lastUpdated && (
        <div className="mb-4 bg-green-50 border border-green-200 rounded-lg px-4 py-3">
          <p className="text-sm text-green-700 font-medium">
            ✓ {lastUpdated}
          </p>
        </div>
      )}

      {/* Project Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Projects</p>
                <p className="text-2xl font-bold text-gray-900">{projects.length}</p>
              </div>
              <FolderOpen className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Projects</p>
                <p className="text-2xl font-bold text-gray-900">
                  {projects.filter(p => p.status === 'active').length}
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Team Members</p>
                <p className="text-2xl font-bold text-gray-900">
                  {projects.reduce((sum, p) => sum + p.teamMembers, 0)}
                </p>
              </div>
              <Users className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Budget</p>
                <p className="text-2xl font-bold text-gray-900">
                  ${(projects.reduce((sum, p) => sum + p.budget, 0) / 1000000).toFixed(1)}M
                </p>
              </div>
              <Target className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {projects.map((project) => (
          <Card key={project.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1">{project.name}</h3>
                  <p className="text-sm text-gray-600">{project.client}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant={
                    project.status === 'active' ? 'default' : 
                    project.status === 'planning' ? 'secondary' : 'outline'
                  }>
                    {project.status}
                  </Badge>
                  <Button variant="ghost" size="sm">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Progress</span>
                  <span className="font-medium">{project.progress}%</span>
                </div>
                <Progress value={project.progress} className="h-2 progress-gradient-purple-blue [&>div]:bg-gradient-purple-blue" />
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">Team</p>
                  <p className="font-medium flex items-center">
                    <Users className="w-3 h-3 mr-1" />
                    {project.teamMembers}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">Budget</p>
                  <p className="font-medium">${(project.budget / 1000).toFixed(0)}K</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <p className="text-sm text-gray-600">Active Modules</p>
                <div className="flex flex-wrap gap-1">
                  {project.modules.map((module, idx) => (
                    <Badge key={idx} variant="outline" className="text-xs">
                      {module}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div className="flex justify-between items-center pt-2">
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm">
                    <FileText className="w-3 h-3 mr-1" />
                    Details
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleEditProject(project)}
                    title="Edit project"
                  >
                    <Edit className="w-3 h-3" />
                  </Button>
                </div>
                <p className="text-xs text-gray-500">
                  Due: {new Date(project.endDate).toLocaleDateString()}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  if (showWizard) {
    return (
      <div className="p-6">
        <ProjectWizard 
          onComplete={handleWizardComplete} 
          onCancel={handleWizardCancel}
          onNavigateToModule={handleWizardNavigateToModule}
        />
      </div>
    );
  }

  if (showCreateForm) {
    return (
      <div className="p-6">
        <CreateProjectForm />
      </div>
    );
  }

  return (
    <div className="p-6">
      <ProjectsList />
    </div>
  );
}