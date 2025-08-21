import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Brain, 
  Zap, 
  FileText, 
  Network, 
  Shield, 
  Building2, 
  Users, 
  TrendingUp,
  ArrowRight,
  Search,
  BarChart3,
  Activity,
  CheckCircle,
  Clock,
  AlertTriangle
} from "lucide-react";

export default function MainDashboard() {
  // Mock data matching the screenshot
  const stats = {
    activeProjects: 247,
    projectsCompleted: 247,
    sophieOpportunities: 23,
    revenueOpportunities: 23,
    auditEvents: 2847,
    eventsProcessed: 2847,
    activeTasks: 12,
    tasksCompleted: 12
  };

  const moduleStatus = [
    { name: "Transform™", status: "99.9%", color: "green" },
    { name: "Mesh™", status: "99.8%", color: "green" },
    { name: "Trace™", status: "99.9%", color: "green" },
    { name: "IP™", status: "99.7%", color: "green" },
    { name: "EMME Connect™", status: "99.8%", color: "green" },
    { name: "Trials™", status: "99.9%", color: "green" },
    { name: "Profile™", status: "99.4%", color: "green" },
    { name: "Build™", status: "99.5%", color: "green" },
    { name: "Labs", status: "Coming Q2", color: "orange" }
  ];

  const quickActions = [
    {
      title: "IP Intelligence",
      description: "Process and analyze patent landscapes and competitive intelligence",
      icon: Brain,
      color: "blue"
    },
    {
      title: "Market Access Strategy", 
      description: "Develop and commercialize payer development strategies",
      icon: TrendingUp,
      color: "green"
    },
    {
      title: "Asset Profiling",
      description: "Regulatory intelligence and commercial viability intelligence",
      icon: Shield,
      color: "purple"
    },
    {
      title: "Construction Intelligence",
      description: "AEC project development and risk analytics",
      icon: Building2,
      color: "orange"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Welcome to SocratIQ™</h1>
            <p className="text-gray-600 mt-1">AI-enhanced intelligence platform for lab sciences development and commercialization</p>
          </div>
          <div className="flex items-center space-x-3">
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              All Systems Operational
            </Badge>
            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
              Sophie™ AI Ready
            </Badge>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-600">Active Projects</CardTitle>
              <FileText className="w-4 h-4 text-gray-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">{stats.activeProjects}</div>
            <div className="text-sm text-gray-500">projects in development</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-600">Sophie™ Opportunities</CardTitle>
              <Brain className="w-4 h-4 text-gray-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">{stats.sophieOpportunities}</div>
            <div className="text-sm text-gray-500">revenue opportunities</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-600">Audit Events</CardTitle>
              <Shield className="w-4 h-4 text-gray-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">{stats.auditEvents.toLocaleString()}</div>
            <div className="text-sm text-gray-500">events processed today</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-600">Active Tasks</CardTitle>
              <Activity className="w-4 h-4 text-gray-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">{stats.activeTasks}</div>
            <div className="text-sm text-gray-500">incomplete overload</div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <p className="text-gray-600 mb-6">Jump to frequently used features and capabilities</p>
        
        <div className="grid grid-cols-4 gap-6">
          {quickActions.map((action, index) => (
            <Card key={index} className="cursor-pointer hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <div className={`w-12 h-12 rounded-lg mx-auto mb-4 flex items-center justify-center ${
                  action.color === 'blue' ? 'bg-blue-100' :
                  action.color === 'green' ? 'bg-green-100' :
                  action.color === 'purple' ? 'bg-purple-100' : 'bg-orange-100'
                }`}>
                  <action.icon className={`w-6 h-6 ${
                    action.color === 'blue' ? 'text-blue-600' :
                    action.color === 'green' ? 'text-green-600' :
                    action.color === 'purple' ? 'text-purple-600' : 'text-orange-600'
                  }`} />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{action.title}</h3>
                <p className="text-sm text-gray-600">{action.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-2 gap-8">
        {/* Module Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Activity className="w-5 h-5" />
              <span>Module Status</span>
            </CardTitle>
            <p className="text-sm text-gray-600">Real-time status of all SocratIQ modules</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {moduleStatus.map((module, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${
                      module.color === 'green' ? 'bg-green-500' : 'bg-orange-500'
                    }`}></div>
                    <span className="font-medium text-gray-900">{module.name}</span>
                  </div>
                  <span className={`text-sm font-medium ${
                    module.color === 'green' ? 'text-green-600' : 'text-orange-600'
                  }`}>
                    {module.status}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Sophie AI Colleague */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Brain className="w-5 h-5 text-blue-600" />
              <span>Sophie™ AI Colleague</span>
            </CardTitle>
            <p className="text-sm text-gray-600">Your intelligent partner through the platform</p>
          </CardHeader>
          <CardContent>
            <div className="bg-blue-50 rounded-lg p-4 mb-4">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">S</span>
                </div>
                <div>
                  <h4 className="font-semibold text-blue-900">Sophie™'s Gating</h4>
                  <p className="text-sm text-blue-700">Powered by Claude AI</p>
                </div>
              </div>
              <p className="text-sm text-blue-800 mb-4">
                Good evening! Here are your key competitive platform. I can explain biochemical pathways, medical findings, analyze 
                market landscape for drug development.
              </p>
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
                <MessageCircle className="w-4 h-4 mr-2" />
                Continue chatting
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function MessageCircle({ className }: { className?: string }) {
  return <div className={className}>💬</div>;
}