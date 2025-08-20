import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  FileText, 
  Network, 
  Shield, 
  Bot, 
  Building2, 
  Users, 
  Target,
  TrendingUp,
  Activity,
  Clock,
  CheckCircle,
  Zap,
  Layers,
  Lock
} from "lucide-react";
import { SophieLogo } from "@/components/SophieLogo";

interface AnalyticsData {
  entityStats: { [key: string]: number };
  processingStats: {
    totalDocuments: number;
    processingQueue: number;
    avgProcessingTime: number;
    avgAccuracy: number;
  };
}

export default function Home() {
  const { data: analytics } = useQuery<AnalyticsData>({
    queryKey: ["/api/analytics"],
    refetchInterval: 5000,
  });

  const totalEntities = analytics ? Object.values(analytics.entityStats).reduce((sum, count) => sum + count, 0) : 0;

  const quickActions = [
    { 
      label: "IP Intelligence", 
      href: "/ip", 
      icon: Shield, 
      description: "Prevent IP missteps and find 505(b)(2) options",
      color: "bg-blue-500"
    },
    { 
      label: "Market Access Strategy", 
      href: "/emme", 
      icon: Target, 
      description: "Go-to-market and commercial orchestration",
      color: "bg-green-500"
    },
    { 
      label: "Asset Profiling", 
      href: "/profile", 
      icon: Users, 
      description: "Phase 2-NDA translational intelligence",
      color: "bg-purple-500"
    },
    { 
      label: "Construction Intelligence", 
      href: "/build", 
      icon: Layers, 
      description: "AEC project optimization and risk analysis",
      color: "bg-orange-500"
    },
  ];

  const moduleStatus = [
    { name: "Transform™", status: "active", uptime: "99.9%", color: "bg-blue-500" },
    { name: "Mesh™", status: "active", uptime: "99.8%", color: "bg-green-500" },
    { name: "Trace™", status: "active", uptime: "99.9%", color: "bg-purple-500" },
    { name: "IP™", status: "active", uptime: "99.7%", color: "bg-blue-600" },
    { name: "EMME Connect™", status: "active", uptime: "99.6%", color: "bg-green-600" },
    { name: "Trials™", status: "active", uptime: "99.5%", color: "bg-indigo-500" },
    { name: "Profile™", status: "active", uptime: "99.4%", color: "bg-purple-600" },
    { name: "Build™", status: "active", uptime: "99.3%", color: "bg-orange-500" },
    { name: "Labs", status: "development", uptime: "Coming Q2", color: "bg-gray-400" },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Welcome to SocratIQ™
            </h1>
            <p className="text-gray-600">
              AI-enhanced intelligence platform for life sciences development and commercialization
            </p>
          </div>
          <div className="text-right">
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className="text-sm font-medium text-gray-700">All Systems Operational</span>
            </div>
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              Sophie™ AI Ready
            </Badge>
          </div>
        </div>
      </div>

      {/* Platform Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active IP Assets</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">247</div>
            <p className="text-xs text-muted-foreground">
              Patents & applications
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">505(b)(2) Opportunities</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">23</div>
            <p className="text-xs text-muted-foreground">
              Repositioning candidates
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Audit Events</CardTitle>
            <Lock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2,847</div>
            <p className="text-xs text-muted-foreground">
              Blockchain verified transactions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Trials</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">
              Clinical studies monitored
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <p className="text-sm text-muted-foreground">
            Jump to frequently used features and capabilities
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <Button
                  key={action.label}
                  variant="outline"
                  className="h-auto p-4 flex flex-col items-center space-y-2 hover:bg-gray-50"
                  asChild
                >
                  <a href={action.href}>
                    <div className={`w-10 h-10 rounded-lg ${action.color} flex items-center justify-center`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="text-center">
                      <div className="font-medium">{action.label}</div>
                      <div className="text-xs text-muted-foreground">{action.description}</div>
                    </div>
                  </a>
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Platform Modules Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Activity className="w-5 h-5" />
              <span>Module Status</span>
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Real-time status of all SocratIQ modules
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {moduleStatus.map((module) => (
                <div key={module.name} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${module.color}`}></div>
                    <span className="font-medium">{module.name}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-muted-foreground">{module.uptime}</span>
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <SophieLogo size="sm" className="w-5 h-5" />
              <span>Sophie™ AI Colleague</span>
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Your intelligent guide through the platform
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-orange-50 to-red-50 p-4 rounded-lg">
                <div className="flex items-center space-x-3 mb-2">
                  <SophieLogo size="md" />
                  <div>
                    <h4 className="font-medium">Sophie™ is Online</h4>
                    <p className="text-sm text-gray-600">Powered by Claude AI</p>
                  </div>
                </div>
                <p className="text-sm text-gray-700 mb-3">
                  I'm ready to help you navigate SocratIQ's comprehensive platform. I can explain blockchain audit trails, 
                  analyze knowledge graphs, assess IP portfolios, and provide strategic insights for drug development.
                </p>
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary" className="text-xs">IP Intelligence</Badge>
                  <Badge variant="secondary" className="text-xs">Market Access</Badge>
                  <Badge variant="secondary" className="text-xs">Regulatory Strategy</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}