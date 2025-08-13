import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Settings, 
  Users, 
  BarChart3, 
  Shield, 
  Target, 
  Heart,
  Eye,
  Edit,
  UserPlus,
  Activity,
  TrendingUp,
  Globe
} from "lucide-react";

interface PartnerApp {
  id: string;
  name: string;
  slug: string;
  icon: React.ComponentType<{ className?: string }>;
  status: "active" | "inactive";
  theme: string;
  totalUsers: number;
  activeUsers: number;
  monthlyGrowth: string;
  lastLogin: string;
}

export function PartnerAppsManager() {
  const [partnerApps] = useState<PartnerApp[]>([
    {
      id: "emme-engage",
      name: "EMME Engage",
      slug: "emme-engage",
      icon: Target,
      status: "active",
      theme: "emerald",
      totalUsers: 247,
      activeUsers: 189,
      monthlyGrowth: "+18%",
      lastLogin: "2 minutes ago"
    },
    {
      id: "emme-health",
      name: "EMME Health", 
      slug: "emme-health",
      icon: Heart,
      status: "active",
      theme: "blue",
      totalUsers: 156,
      activeUsers: 134,
      monthlyGrowth: "+23%",
      lastLogin: "5 minutes ago"
    }
  ]);

  const totalMetrics = {
    totalUsers: partnerApps.reduce((sum, app) => sum + app.totalUsers, 0),
    activeUsers: partnerApps.reduce((sum, app) => sum + app.activeUsers, 0),
    totalApps: partnerApps.length,
    avgGrowth: "+20.5%"
  };

  const recentActivity = [
    { app: "EMME Health", action: "New user registration", user: "Dr. Sarah Johnson", time: "2 minutes ago" },
    { app: "EMME Engage", action: "Partnership created", user: "BioTech Corp", time: "5 minutes ago" },
    { app: "EMME Health", action: "Clinical report generated", user: "Metro Hospital", time: "12 minutes ago" },
    { app: "EMME Engage", action: "Contract signed", user: "Pharma Alliance", time: "18 minutes ago" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-gray-200 pb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-lg bg-purple-500 flex items-center justify-center">
            <Settings className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Partner Applications</h1>
            <p className="text-gray-600">Manage white-label partner platforms and user access</p>
          </div>
        </div>
      </div>

      {/* Overview Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalMetrics.totalApps}</div>
            <p className="text-xs text-muted-foreground">Active partner platforms</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalMetrics.totalUsers.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Across all platforms</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalMetrics.activeUsers}</div>
            <p className="text-xs text-muted-foreground">Last 30 days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Growth Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{totalMetrics.avgGrowth}</div>
            <p className="text-xs text-muted-foreground">Average monthly growth</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="applications" className="space-y-6">
        <TabsList>
          <TabsTrigger value="applications">Applications</TabsTrigger>
          <TabsTrigger value="users">User Management</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="applications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Partner Applications</CardTitle>
              <p className="text-sm text-muted-foreground">
                Manage white-label partner platforms and their configurations
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {partnerApps.map((app) => {
                  const IconComponent = app.icon;
                  return (
                    <div key={app.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className={`w-10 h-10 rounded-lg ${
                          app.theme === 'emerald' ? 'bg-emerald-500' : 'bg-blue-500'
                        } flex items-center justify-center`}>
                          <IconComponent className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{app.name}</h3>
                          <p className="text-sm text-gray-600">/{app.slug}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-6">
                        <div className="text-center">
                          <div className="text-2xl font-bold">{app.totalUsers}</div>
                          <div className="text-xs text-gray-500">Total Users</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-600">{app.activeUsers}</div>
                          <div className="text-xs text-gray-500">Active</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-blue-600">{app.monthlyGrowth}</div>
                          <div className="text-xs text-gray-500">Growth</div>
                        </div>
                        <Badge variant={app.status === 'active' ? 'default' : 'secondary'}>
                          {app.status}
                        </Badge>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">
                            <Eye className="w-4 h-4 mr-1" />
                            View
                          </Button>
                          <Button size="sm" variant="outline">
                            <Edit className="w-4 h-4 mr-1" />
                            Edit
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>User Management</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Manage user access and permissions across partner applications
                </p>
              </div>
              <Button>
                <UserPlus className="w-4 h-4 mr-2" />
                Add User
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { name: "Dr. Sarah Johnson", email: "sarah.johnson@metrohospital.com", app: "EMME Health", role: "Admin", status: "Active" },
                  { name: "Michael Chen", email: "m.chen@biotechcorp.com", app: "EMME Engage", role: "User", status: "Active" },
                  { name: "Jessica Rodriguez", email: "j.rodriguez@pharmaalliance.com", app: "EMME Engage", role: "Manager", status: "Active" },
                  { name: "Dr. Robert Kim", email: "r.kim@cityclinic.org", app: "EMME Health", role: "User", status: "Inactive" },
                ].map((user, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                        <Users className="w-5 h-5 text-gray-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{user.name}</h3>
                        <p className="text-sm text-gray-600">{user.email}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <div className="text-center">
                        <div className="text-sm font-medium">{user.app}</div>
                        <div className="text-xs text-gray-500">Application</div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm font-medium">{user.role}</div>
                        <div className="text-xs text-gray-500">Role</div>
                      </div>
                      <Badge variant={user.status === 'Active' ? 'default' : 'secondary'}>
                        {user.status}
                      </Badge>
                      <Button size="sm" variant="outline">
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Partner Application Analytics</CardTitle>
              <p className="text-sm text-muted-foreground">
                Usage analytics and performance metrics across all partner platforms
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {partnerApps.map((app) => {
                    const IconComponent = app.icon;
                    return (
                      <div key={app.id} className="p-4 border rounded-lg">
                        <div className="flex items-center space-x-2 mb-4">
                          <IconComponent className={`w-5 h-5 ${
                            app.theme === 'emerald' ? 'text-emerald-600' : 'text-blue-600'
                          }`} />
                          <h3 className="font-semibold">{app.name}</h3>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm">Total Users:</span>
                            <span className="font-medium">{app.totalUsers}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm">Active Users:</span>
                            <span className="font-medium text-green-600">{app.activeUsers}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm">Monthly Growth:</span>
                            <span className="font-medium text-blue-600">{app.monthlyGrowth}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm">Last Activity:</span>
                            <span className="text-sm text-gray-600">{app.lastLogin}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-center justify-between py-2 border-b last:border-b-0">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 rounded-full bg-green-500"></div>
                      <div>
                        <p className="text-sm font-medium">{activity.action}</p>
                        <p className="text-xs text-gray-600">{activity.app} • {activity.user}</p>
                      </div>
                    </div>
                    <span className="text-xs text-gray-500">{activity.time}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Platform Settings</CardTitle>
              <p className="text-sm text-muted-foreground">
                Configure global settings for all partner applications
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-medium">Branding Settings</h3>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Attribution Text</label>
                      <input 
                        className="w-full p-2 border rounded"
                        defaultValue="Powered by SocratIQ"
                        placeholder="Attribution text..."
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Support Email</label>
                      <input 
                        className="w-full p-2 border rounded"
                        defaultValue="support@socratiq.com"
                        placeholder="Support email..."
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="font-medium">Security Settings</h3>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Session Timeout (minutes)</label>
                      <input 
                        className="w-full p-2 border rounded"
                        defaultValue="120"
                        type="number"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Password Requirements</label>
                      <select className="w-full p-2 border rounded">
                        <option>Standard</option>
                        <option>Enhanced</option>
                        <option>Enterprise</option>
                      </select>
                    </div>
                  </div>
                </div>
                
                <div className="pt-4 border-t">
                  <Button>Save Settings</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}