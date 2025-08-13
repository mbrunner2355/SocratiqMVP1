import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, BookOpen, FileText, Database, TrendingUp, Star, Globe, Users } from "lucide-react";

export default function ResearchHub() {
  const researchProjects = [
    {
      id: "RH001",
      title: "Oncology Biomarker Discovery Program",
      status: "Active",
      phase: "Phase II Clinical",
      priority: "High",
      researchers: 12,
      institutions: ["NIH/NCI", "Mayo Clinic", "Johns Hopkins"],
      keyFindings: "Novel biomarker panel shows 85% accuracy in early detection",
      lastUpdate: "2 days ago"
    },
    {
      id: "RH002", 
      title: "Immunotherapy Combination Studies",
      status: "Planning",
      phase: "Preclinical",
      priority: "Medium",
      researchers: 8,
      institutions: ["DARPA BTO", "Stanford", "UCSF"],
      keyFindings: "Synergistic effects observed in preliminary studies",
      lastUpdate: "1 week ago"
    },
    {
      id: "RH003",
      title: "Drug Repurposing Analytics",
      status: "Completed",
      phase: "Data Analysis",
      priority: "Low",
      researchers: 15,
      institutions: ["FDA CDER", "MIT", "Harvard"],
      keyFindings: "Identified 23 new therapeutic applications",
      lastUpdate: "3 weeks ago"
    }
  ];

  const researchMetrics = [
    { label: "Active Projects", value: "47", trend: "+8 this month" },
    { label: "Research Papers", value: "234", trend: "+12 published" },
    { label: "Collaborations", value: "89", trend: "+15 new partners" },
    { label: "Patent Applications", value: "67", trend: "+23 filed" }
  ];

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active': return 'bg-green-100 text-green-800 border-green-200';
      case 'planning': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'completed': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-gray-200 pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-purple-500 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Research Hub</h1>
              <p className="text-gray-600">Collaborative research management and discovery platform</p>
            </div>
          </div>
          <Button>
            <FileText className="w-4 h-4 mr-2" />
            New Research Project
          </Button>
        </div>
      </div>

      {/* Research Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {researchMetrics.map((metric) => (
          <Card key={metric.label}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{metric.label}</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metric.value}</div>
              <p className="text-xs text-muted-foreground">{metric.trend}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Research Discovery</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-4">
            <div className="flex-1">
              <Input 
                placeholder="Search research projects, papers, collaborations..." 
                className="w-full"
              />
            </div>
            <Button>
              <Search className="w-4 h-4 mr-2" />
              Search
            </Button>
          </div>
          
          <Tabs defaultValue="projects" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="projects">Projects</TabsTrigger>
              <TabsTrigger value="papers">Papers</TabsTrigger>
              <TabsTrigger value="collaborations">Collaborations</TabsTrigger>
              <TabsTrigger value="grants">Grants</TabsTrigger>
            </TabsList>
            
            <TabsContent value="projects" className="space-y-4">
              {researchProjects.map((project) => (
                <Card key={project.id} className="border-l-4 border-l-purple-500">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg">{project.title}</CardTitle>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge className={`text-xs border ${getStatusColor(project.status)}`}>
                            {project.status}
                          </Badge>
                          <Badge className={`text-xs border ${getPriorityColor(project.priority)}`}>
                            {project.priority} Priority
                          </Badge>
                          <span className="text-sm text-gray-500">•</span>
                          <span className="text-sm text-gray-500">{project.phase}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1 text-sm text-gray-500">
                          <Users className="w-4 h-4" />
                          {project.researchers} researchers
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <h4 className="font-medium text-sm mb-1">Key Findings</h4>
                      <p className="text-sm text-gray-600">{project.keyFindings}</p>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-sm mb-1">Collaborating Institutions</h4>
                      <div className="flex flex-wrap gap-1">
                        {project.institutions.map((institution, i) => (
                          <Badge key={i} variant="outline" className="text-xs">
                            {institution}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between pt-2 border-t">
                      <span className="text-xs text-gray-500">Last updated {project.lastUpdate}</span>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">View Details</Button>
                        <Button size="sm">Join Research</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
            
            <TabsContent value="papers">
              <div className="text-center py-8 text-gray-500">
                Research papers database coming soon...
              </div>
            </TabsContent>
            
            <TabsContent value="collaborations">
              <div className="text-center py-8 text-gray-500">
                Collaboration matching system coming soon...
              </div>
            </TabsContent>
            
            <TabsContent value="grants">
              <div className="text-center py-8 text-gray-500">
                Grant opportunity tracker coming soon...
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}