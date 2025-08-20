import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ArrowLeft,
  Users,
  Calendar,
  DollarSign,
  Target,
  TrendingUp,
  FileText,
  MessageSquare,
  BarChart3,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Brain,
  Shield
} from "lucide-react";


interface ProjectDetailsProps {
  projectId: string;
  onBack: () => void;
}

export function ProjectDetails({ projectId, onBack }: ProjectDetailsProps) {

  // Mock project data - in real app this would come from API
  const projects: Record<string, any> = {
    "proj-001": {
      id: "proj-001",
      name: "Xarelto Market Access Strategy",
      client: "Bayer HealthCare",
      status: "active",
      progress: 78,
      startDate: "2024-01-15",
      endDate: "2024-06-30",
      teamMembers: 12,
      modules: ["Insight Engine", "Engagement Studio", "Learning Hub"],
      budget: 850000,
      spent: 663000,
      description: "Comprehensive market access strategy for Xarelto anticoagulant therapy, focusing on payer engagement and value-based care messaging.",
      therapeuticArea: "Cardiovascular",
      indication: "Anticoagulation",
      phase: "Commercial Launch",
      keyObjectives: [
        "Develop payer value propositions",
        "Create HCP education materials",
        "Launch patient support programs",
        "Establish real-world evidence strategy"
      ],
      milestones: [
        { name: "Payer Dossier Completion", date: "2024-02-15", status: "completed" },
        { name: "HCP Materials Launch", date: "2024-04-01", status: "completed" },
        { name: "Patient Program Rollout", date: "2024-05-15", status: "in-progress" },
        { name: "Outcomes Data Analysis", date: "2024-06-30", status: "pending" }
      ]
    },
    "proj-002": {
      id: "proj-002", 
      name: "Eylea Ophthalmology Launch",
      client: "Bayer HealthCare",
      status: "planning",
      progress: 35,
      startDate: "2024-02-01",
      endDate: "2024-09-30",
      teamMembers: 8,
      modules: ["Engagement Studio", "Learning Hub", "Equity Infrastructure"],
      budget: 1200000,
      spent: 420000,
      description: "Strategic launch campaign for Eylea ophthalmology treatment targeting retinal specialists and comprehensive eye care providers.",
      therapeuticArea: "Ophthalmology",
      indication: "Diabetic Macular Edema",
      phase: "Pre-Launch",
      keyObjectives: [
        "Build retinal specialist awareness",
        "Develop injection training programs",
        "Create patient education materials",
        "Establish treatment access pathways"
      ],
      milestones: [
        { name: "Market Research Completion", date: "2024-03-15", status: "completed" },
        { name: "Advisory Board Sessions", date: "2024-05-01", status: "in-progress" },
        { name: "Training Program Development", date: "2024-07-15", status: "pending" },
        { name: "Launch Campaign Execution", date: "2024-09-30", status: "pending" }
      ]
    },
    "proj-003": {
      id: "proj-003",
      name: "Nubeqa Prostate Cancer HCP Education",
      client: "Bayer HealthCare",
      status: "active",
      progress: 92,
      startDate: "2023-10-01",
      endDate: "2024-03-31",
      teamMembers: 15,
      modules: ["Insight Engine", "Engagement Studio", "Learning Hub", "Equity Infrastructure"],
      budget: 950000,
      spent: 874000,
      description: "Comprehensive HCP education program for Nubeqa prostate cancer treatment, focusing on oncology and urology specialists.",
      therapeuticArea: "Oncology",
      indication: "Prostate Cancer",
      phase: "Commercial Expansion",
      keyObjectives: [
        "Educate oncologists on treatment benefits",
        "Develop clinical pathway integration",
        "Launch patient identification tools",
        "Create outcomes tracking system"
      ],
      milestones: [
        { name: "Clinical Education Series", date: "2023-12-15", status: "completed" },
        { name: "Digital Tools Launch", date: "2024-01-30", status: "completed" },
        { name: "Pathway Integration", date: "2024-02-28", status: "completed" },
        { name: "Outcomes Reporting", date: "2024-03-31", status: "in-progress" }
      ]
    },
    "proj-004": {
      id: "proj-004",
      name: "VMS Global Vendor Management Platform",
      client: "Bayer HealthCare",
      status: "active",
      progress: 65,
      startDate: "2024-01-01",
      endDate: "2024-12-31",
      teamMembers: 18,
      modules: ["Insight Engine", "Engagement Studio", "Learning Hub", "Equity Infrastructure"],
      budget: 1500000,
      spent: 975000,
      description: "Enterprise-wide Vendor Management System for pharmaceutical partner coordination, content sourcing, and compliance tracking across all Bayer HealthCare divisions.",
      therapeuticArea: "Cross-Portfolio",
      indication: "Vendor Management",
      phase: "Implementation",
      keyObjectives: [
        "Centralize vendor relationship management",
        "Implement automated compliance tracking",
        "Develop content sourcing workflows",
        "Create performance analytics dashboard"
      ],
      milestones: [
        { name: "Platform Architecture Design", date: "2024-02-29", status: "completed" },
        { name: "Vendor Onboarding System", date: "2024-05-31", status: "completed" },
        { name: "Compliance Module Launch", date: "2024-08-31", status: "in-progress" },
        { name: "Full Platform Rollout", date: "2024-12-31", status: "pending" }
      ]
    }
  };

  const project = projects[projectId];

  if (!project) {
    return (
      <div className="p-6">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900">Project Not Found</h2>
          <p className="text-gray-600 mt-2">The requested project could not be found.</p>
          <Button onClick={onBack} className="mt-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Projects
          </Button>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'planning': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getMilestoneIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle2 className="w-4 h-4 text-green-600" />;
      case 'in-progress': return <Clock className="w-4 h-4 text-blue-600" />;
      case 'pending': return <AlertTriangle className="w-4 h-4 text-gray-400" />;
      default: return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Projects
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{project.name}</h1>
            <p className="text-gray-600">{project.client} • {project.therapeuticArea}</p>
          </div>
        </div>
        <Badge className={getStatusColor(project.status)}>
          {project.status}
        </Badge>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Progress</p>
                <p className="text-2xl font-bold text-gray-900">{project.progress}%</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-600" />
            </div>
            <Progress value={project.progress} className="mt-3 h-2" />
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Team Members</p>
                <p className="text-2xl font-bold text-gray-900">{project.teamMembers}</p>
              </div>
              <Users className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Budget</p>
                <p className="text-2xl font-bold text-gray-900">
                  ${(project.budget / 1000000).toFixed(1)}M
                </p>
              </div>
              <DollarSign className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Days Remaining</p>
                <p className="text-2xl font-bold text-gray-900">
                  {Math.ceil((new Date(project.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))}
                </p>
              </div>
              <Calendar className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Information Tabs */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="intelligence">Intelligence</TabsTrigger>
          <TabsTrigger value="milestones">Milestones</TabsTrigger>
          <TabsTrigger value="modules">Modules</TabsTrigger>
          <TabsTrigger value="budget">Budget</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Project Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">{project.description}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Project Details</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Therapeutic Area:</span>
                      <span className="font-medium">{project.therapeuticArea}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Indication:</span>
                      <span className="font-medium">{project.indication}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Phase:</span>
                      <span className="font-medium">{project.phase}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Start Date:</span>
                      <span className="font-medium">{new Date(project.startDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">End Date:</span>
                      <span className="font-medium">{new Date(project.endDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Key Objectives</h4>
                  <ul className="space-y-2">
                    {project.keyObjectives.map((objective: string, index: number) => (
                      <li key={index} className="flex items-start space-x-2">
                        <Target className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-gray-700">{objective}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="milestones" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Project Milestones</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {project.milestones.map((milestone: any, index: number) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      {getMilestoneIcon(milestone.status)}
                      <div>
                        <h4 className="font-medium text-gray-900">{milestone.name}</h4>
                        <p className="text-sm text-gray-600">Due: {new Date(milestone.date).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <Badge className={
                      milestone.status === 'completed' ? 'bg-green-100 text-green-800' :
                      milestone.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }>
                      {milestone.status.replace('-', ' ')}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="intelligence" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Project Intelligence</CardTitle>
              <CardDescription>AI-powered insights and analytics for {project.name}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-3 p-4 border rounded-lg bg-purple-50">
                  <Brain className="w-8 h-8 text-purple-600" />
                  <div>
                    <h4 className="font-medium text-gray-900">AI Analysis Available</h4>
                    <p className="text-sm text-gray-600">Access advanced pharmaceutical intelligence through the main EMME platform in the left navigation menu.</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div className="p-3 border rounded">
                    <h5 className="font-medium text-gray-900">Market Intelligence</h5>
                    <p className="text-sm text-gray-600">TAM analysis, competitive landscape</p>
                  </div>
                  <div className="p-3 border rounded">
                    <h5 className="font-medium text-gray-900">Regulatory Insights</h5>
                    <p className="text-sm text-gray-600">FDA pathway planning, compliance monitoring</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="modules" className="space-y-6">
          {/* Standard Modules Content */}
          {project.id === 'proj-004' ? (
            <Card>
              <CardHeader>
                <CardTitle>VMS Project Modules</CardTitle>
                <CardDescription>Active pharmaceutical development modules</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3 p-4 border rounded-lg bg-purple-50">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                      <BarChart3 className="w-5 h-5 text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">Market Analysis</h4>
                      <p className="text-sm text-gray-600">TAM analysis & competitive intelligence</p>
                    </div>
                    <Badge className="bg-green-100 text-green-800">Active</Badge>
                  </div>
                  
                  <div className="flex items-center space-x-3 p-4 border rounded-lg bg-blue-50">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Shield className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">Regulatory Strategy</h4>
                      <p className="text-sm text-gray-600">FDA pathway & compliance</p>
                    </div>
                    <Badge className="bg-green-100 text-green-800">Active</Badge>
                  </div>
                  
                  <div className="flex items-center space-x-3 p-4 border rounded-lg bg-green-50">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <FileText className="w-5 h-5 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">Clinical Evidence</h4>
                      <p className="text-sm text-gray-600">Phase 2b results & trials</p>
                    </div>
                    <Badge className="bg-green-100 text-green-800">Active</Badge>
                  </div>
                  
                  <div className="flex items-center space-x-3 p-4 border rounded-lg bg-orange-50">
                    <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                      <TrendingUp className="w-5 h-5 text-orange-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">Commercial Strategy</h4>
                      <p className="text-sm text-gray-600">Launch planning & market access</p>
                    </div>
                    <Badge className="bg-green-100 text-green-800">Active</Badge>
                  </div>
                </div>
                
                <div className="mt-6 p-4 bg-purple-50 border border-purple-200 rounded-lg">
                  <h4 className="font-semibold text-purple-900 mb-2">Access Full Intelligence Platform</h4>
                  <p className="text-sm text-purple-700 mb-3">
                    Complete pharmaceutical intelligence with TAM analysis, competitive positioning, 
                    and regulatory strategy available in the Intelligence tab.
                  </p>
                  <Button 
                    onClick={() => {
                      const intelligenceTab = document.querySelector('[value="intelligence"]') as HTMLButtonElement;
                      if (intelligenceTab) {
                        intelligenceTab.click();
                      }
                    }}
                    className="bg-purple-600 hover:bg-purple-700 text-white"
                  >
                    Open Intelligence Hub
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Active Modules</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {project.modules.map((module: string, index: number) => (
                    <div key={index} className="flex items-center space-x-3 p-4 border rounded-lg">
                      <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                        <BarChart3 className="w-5 h-5 text-purple-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">{module}</h4>
                        <p className="text-sm text-gray-600">Active & Processing</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="budget" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Budget Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600">Budget Utilization</span>
                    <span className="font-medium">{Math.round((project.spent / project.budget) * 100)}%</span>
                  </div>
                  <Progress value={(project.spent / project.budget) * 100} className="h-3" />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center p-4 border rounded-lg">
                    <p className="text-sm text-gray-600">Total Budget</p>
                    <p className="text-2xl font-bold text-gray-900">${(project.budget / 1000).toFixed(0)}K</p>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <p className="text-sm text-gray-600">Amount Spent</p>
                    <p className="text-2xl font-bold text-blue-600">${(project.spent / 1000).toFixed(0)}K</p>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <p className="text-sm text-gray-600">Remaining</p>
                    <p className="text-2xl font-bold text-green-600">${((project.budget - project.spent) / 1000).toFixed(0)}K</p>
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