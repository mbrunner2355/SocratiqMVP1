import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  Building2, 
  Users, 
  TrendingUp, 
  Calendar, 
  FileText, 
  MessageCircle,
  ChevronRight,
  Bell,
  Settings,
  Search,
  Filter,
  BarChart3,
  Target,
  Handshake,
  DollarSign,
  Globe,
  Activity
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";

interface Partnership {
  id: string;
  partnerName: string;
  partnerType: string;
  status: string;
  relationship: string;
  projects: number;
  revenue: string;
  lastActivity: string;
}

interface EngagementOpportunity {
  id: string;
  title: string;
  type: string;
  priority: string;
  value: string;
  timeline: string;
  description: string;
  requirements: string[];
}

interface CollaborationProject {
  id: string;
  title: string;
  partner: string;
  status: string;
  progress: number;
  nextMilestone: string;
  dueDate: string;
}

export default function EMMEEngage() {
  const [activeTab, setActiveTab] = useState("dashboard");
  
  // Fetch partnerships data
  const { data: partnerships = [] } = useQuery<Partnership[]>({
    queryKey: ['/api/emme/partnerships'],
  });

  // Mock data for engagement opportunities (would come from API)
  const engagementOpportunities: EngagementOpportunity[] = [
    {
      id: "opp_001",
      title: "Digital Health Platform Integration",
      type: "Technology Partnership",
      priority: "high",
      value: "$2.5M",
      timeline: "6 months",
      description: "Integrate EMME analytics into partner's digital health platform",
      requirements: ["API Integration", "Data Security Compliance", "Clinical Validation"]
    },
    {
      id: "opp_002", 
      title: "Market Access Consulting",
      type: "Service Partnership",
      priority: "medium",
      value: "$800K",
      timeline: "3 months",
      description: "Provide market access strategy consulting for new therapeutic area",
      requirements: ["Regulatory Expertise", "Payer Analytics", "Real-World Evidence"]
    }
  ];

  // Mock data for collaboration projects
  const collaborationProjects: CollaborationProject[] = [
    {
      id: "proj_001",
      title: "VMS Treatment Launch Strategy",
      partner: "PharmaX",
      status: "active",
      progress: 68,
      nextMilestone: "Market Research Completion",
      dueDate: "2025-09-15"
    },
    {
      id: "proj_002",
      title: "Regulatory Pathway Analysis", 
      partner: "BioTech Solutions",
      status: "planning",
      progress: 25,
      nextMilestone: "FDA Pre-Submission Meeting",
      dueDate: "2025-10-30"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'planning': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Handshake className="w-8 h-8 text-blue-600" />
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">EMME Engage™</h1>
                  <p className="text-sm text-gray-600">Partner Collaboration Platform</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm">
                <Bell className="w-4 h-4 mr-2" />
                Notifications
              </Button>
              <Button variant="outline" size="sm">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="opportunities">Opportunities</TabsTrigger>
            <TabsTrigger value="collaborations">Collaborations</TabsTrigger>
            <TabsTrigger value="partnerships">Partnerships</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Active Partnerships</p>
                      <p className="text-3xl font-bold">{partnerships.length}</p>
                    </div>
                    <Building2 className="w-8 h-8 text-blue-500" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Collaboration Projects</p>
                      <p className="text-3xl font-bold">{collaborationProjects.length}</p>
                    </div>
                    <Users className="w-8 h-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Revenue Pipeline</p>
                      <p className="text-3xl font-bold">$3.3M</p>
                    </div>
                    <DollarSign className="w-8 h-8 text-purple-500" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Engagement Score</p>
                      <p className="text-3xl font-bold">92%</p>
                    </div>
                    <TrendingUp className="w-8 h-8 text-orange-500" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Activity className="w-5 h-5 mr-2" />
                    Recent Activities
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">New collaboration opportunity submitted</p>
                        <p className="text-xs text-gray-500">PharmaX - Digital Health Platform</p>
                        <p className="text-xs text-gray-400">2 hours ago</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Project milestone completed</p>
                        <p className="text-xs text-gray-500">VMS Treatment Launch - Market Research</p>
                        <p className="text-xs text-gray-400">1 day ago</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Partnership agreement signed</p>
                        <p className="text-xs text-gray-500">BioTech Solutions - Strategic Licensing</p>
                        <p className="text-xs text-gray-400">3 days ago</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Target className="w-5 h-5 mr-2" />
                    Upcoming Milestones
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {collaborationProjects.map((project) => (
                      <div key={project.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium">{project.title}</h4>
                          <Badge className={getStatusColor(project.status)}>
                            {project.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{project.nextMilestone}</p>
                        <div className="flex items-center justify-between">
                          <Progress value={project.progress} className="flex-1 mr-4" />
                          <span className="text-xs text-gray-500">{project.dueDate}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Opportunities Tab */}
          <TabsContent value="opportunities" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Engagement Opportunities</h2>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  <Search className="w-4 h-4 mr-2" />
                  Search
                </Button>
                <Button variant="outline" size="sm">
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {engagementOpportunities.map((opportunity) => (
                <Card key={opportunity.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{opportunity.title}</CardTitle>
                      <Badge className={getStatusColor(opportunity.priority)}>
                        {opportunity.priority}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">{opportunity.type}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <p className="text-sm">{opportunity.description}</p>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs text-gray-500">VALUE</p>
                          <p className="font-semibold">{opportunity.value}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">TIMELINE</p>
                          <p className="font-semibold">{opportunity.timeline}</p>
                        </div>
                      </div>
                      
                      <div>
                        <p className="text-xs text-gray-500 mb-2">REQUIREMENTS</p>
                        <div className="flex flex-wrap gap-2">
                          {opportunity.requirements.map((req, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {req}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      <Button className="w-full">
                        Express Interest
                        <ChevronRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Collaborations Tab */}
          <TabsContent value="collaborations" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Active Collaborations</h2>
              <Button>
                <MessageCircle className="w-4 h-4 mr-2" />
                New Collaboration
              </Button>
            </div>

            <div className="space-y-4">
              {collaborationProjects.map((project) => (
                <Card key={project.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold">{project.title}</h3>
                        <p className="text-sm text-gray-600">Partner: {project.partner}</p>
                      </div>
                      <Badge className={getStatusColor(project.status)}>
                        {project.status}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <p className="text-xs text-gray-500">PROGRESS</p>
                        <div className="flex items-center space-x-2">
                          <Progress value={project.progress} className="flex-1" />
                          <span className="text-sm font-medium">{project.progress}%</span>
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">NEXT MILESTONE</p>
                        <p className="font-medium">{project.nextMilestone}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">DUE DATE</p>
                        <p className="font-medium">{project.dueDate}</p>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <FileText className="w-4 h-4 mr-2" />
                        View Details
                      </Button>
                      <Button variant="outline" size="sm">
                        <MessageCircle className="w-4 h-4 mr-2" />
                        Collaborate
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Partnerships Tab */}
          <TabsContent value="partnerships" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Partnership Portfolio</h2>
              <Button>
                <Building2 className="w-4 h-4 mr-2" />
                New Partnership
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {partnerships.map((partnership) => (
                <Card key={partnership.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{partnership.partnerName}</CardTitle>
                      <Badge className={getStatusColor(partnership.status)}>
                        {partnership.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">{partnership.partnerType}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Relationship</span>
                        <span className="text-sm font-medium">{partnership.relationship}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Projects</span>
                        <span className="text-sm font-medium">{partnership.projects}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Revenue</span>
                        <span className="text-sm font-medium">{partnership.revenue}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Last Activity</span>
                        <span className="text-sm font-medium">{partnership.lastActivity}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Partnership Analytics</h2>
              <Button variant="outline">
                <BarChart3 className="w-4 h-4 mr-2" />
                Export Report
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="text-center">
                    <Globe className="w-8 h-8 mx-auto mb-2 text-blue-500" />
                    <p className="text-2xl font-bold">15</p>
                    <p className="text-sm text-gray-600">Global Partners</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="text-center">
                    <Target className="w-8 h-8 mx-auto mb-2 text-green-500" />
                    <p className="text-2xl font-bold">28</p>
                    <p className="text-sm text-gray-600">Active Projects</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="text-center">
                    <DollarSign className="w-8 h-8 mx-auto mb-2 text-purple-500" />
                    <p className="text-2xl font-bold">$12.8M</p>
                    <p className="text-sm text-gray-600">Annual Revenue</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="text-center">
                    <TrendingUp className="w-8 h-8 mx-auto mb-2 text-orange-500" />
                    <p className="text-2xl font-bold">94%</p>
                    <p className="text-sm text-gray-600">Success Rate</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Partnership Performance Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center text-gray-500">
                  <div className="text-center">
                    <BarChart3 className="w-12 h-12 mx-auto mb-4" />
                    <p>Analytics dashboard will be integrated with real-time data</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}