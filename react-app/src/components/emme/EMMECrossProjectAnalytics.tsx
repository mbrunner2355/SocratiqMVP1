import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, Area, AreaChart
} from 'recharts';
import { 
  Target, Users, FileText, BarChart3, TrendingUp, Globe,
  Calendar, Filter, Download, RefreshCw, AlertCircle
} from 'lucide-react';

export function EMMECrossProjectAnalytics() {
  const [timeRange, setTimeRange] = useState("3months");
  const [activeTab, setActiveTab] = useState("strategic");

  // Mock data for cross-project analytics
  const strategicMetrics = {
    totalProjects: 47,
    averageLaunchReadiness: 78,
    marketCoverage: 85,
    competitiveAdvantage: 72
  };

  const projectPerformanceData = [
    { name: 'Project Alpha', launchReadiness: 95, marketSize: 2400, riskScore: 23 },
    { name: 'Project Beta', launchReadiness: 78, marketSize: 1800, riskScore: 45 },
    { name: 'Project Gamma', launchReadiness: 82, marketSize: 3200, riskScore: 31 },
    { name: 'Project Delta', launchReadiness: 69, marketSize: 1500, riskScore: 58 },
    { name: 'Project Epsilon', launchReadiness: 87, marketSize: 2100, riskScore: 28 }
  ];

  const engagementTrends = [
    { month: 'Jan', hcp: 2400, kol: 180, payer: 95 },
    { month: 'Feb', hcp: 2800, kol: 210, payer: 102 },
    { month: 'Mar', hcp: 3200, kol: 245, payer: 118 },
    { month: 'Apr', hcp: 2900, kol: 198, payer: 95 },
    { month: 'May', hcp: 3400, kol: 267, payer: 134 },
    { month: 'Jun', hcp: 3800, kol: 289, payer: 147 }
  ];

  const contentMetrics = [
    { name: 'Medical Writing', value: 34, fill: '#3b82f6' },
    { name: 'Regulatory Content', value: 28, fill: '#10b981' },
    { name: 'Marketing Materials', value: 22, fill: '#f59e0b' },
    { name: 'Training Content', value: 16, fill: '#ef4444' }
  ];

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Cross-Project Analytics</h1>
          <p className="text-gray-600">Enterprise-wide strategic intelligence, stakeholder engagement, and content performance</p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1month">Last Month</SelectItem>
              <SelectItem value="3months">Last 3 Months</SelectItem>
              <SelectItem value="6months">Last 6 Months</SelectItem>
              <SelectItem value="1year">Last Year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid grid-cols-3 w-full">
          <TabsTrigger value="strategic" className="flex items-center gap-2">
            <Target className="w-4 h-4" />
            Strategic Intelligence
          </TabsTrigger>
          <TabsTrigger value="stakeholders" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            Stakeholder Engagement
          </TabsTrigger>
          <TabsTrigger value="content" className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Content Orchestration
          </TabsTrigger>
        </TabsList>

        <TabsContent value="strategic" className="space-y-6">
          {/* Strategic Intelligence Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Projects</p>
                    <p className="text-2xl font-bold">{strategicMetrics.totalProjects}</p>
                  </div>
                  <BarChart3 className="w-8 h-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Avg Launch Readiness</p>
                    <p className="text-2xl font-bold">{strategicMetrics.averageLaunchReadiness}%</p>
                  </div>
                  <Target className="w-8 h-8 text-green-500" />
                </div>
                <Progress value={strategicMetrics.averageLaunchReadiness} className="h-1 mt-2" />
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Market Coverage</p>
                    <p className="text-2xl font-bold">{strategicMetrics.marketCoverage}%</p>
                  </div>
                  <Globe className="w-8 h-8 text-purple-500" />
                </div>
                <Progress value={strategicMetrics.marketCoverage} className="h-1 mt-2" />
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Competitive Edge</p>
                    <p className="text-2xl font-bold">{strategicMetrics.competitiveAdvantage}%</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-orange-500" />
                </div>
                <Progress value={strategicMetrics.competitiveAdvantage} className="h-1 mt-2" />
              </CardContent>
            </Card>
          </div>

          {/* Project Performance Matrix */}
          <Card>
            <CardHeader>
              <CardTitle>Project Launch Readiness vs Market Opportunity</CardTitle>
              <CardDescription>Strategic positioning of active projects</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={projectPerformanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="launchReadiness" fill="#3b82f6" name="Launch Readiness %" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="stakeholders" className="space-y-6">
          {/* Stakeholder Engagement Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-blue-500" />
                  Total Stakeholder Reach
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Healthcare Professionals</span>
                    <span className="font-medium">14,726</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Key Opinion Leaders</span>
                    <span className="font-medium">847</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Payer Organizations</span>
                    <span className="font-medium">124</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Patient Advocacy Groups</span>
                    <span className="font-medium">89</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Engagement Quality Score</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-3xl font-bold">8.7</span>
                    <Badge variant="outline" className="text-green-600">Excellent</Badge>
                  </div>
                  <Progress value={87} className="h-3" />
                  <p className="text-sm text-gray-600">Based on interaction depth, frequency, and outcomes across all projects</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Geographic Coverage</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">North America</span>
                    <Badge variant="secondary">98%</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Europe</span>
                    <Badge variant="secondary">87%</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Asia-Pacific</span>
                    <Badge variant="secondary">72%</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Latin America</span>
                    <Badge variant="secondary">45%</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Engagement Trends */}
          <Card>
            <CardHeader>
              <CardTitle>Stakeholder Engagement Trends</CardTitle>
              <CardDescription>Monthly engagement across stakeholder types</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={engagementTrends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="hcp" stroke="#3b82f6" strokeWidth={2} name="HCP Interactions" />
                    <Line type="monotone" dataKey="kol" stroke="#10b981" strokeWidth={2} name="KOL Engagements" />
                    <Line type="monotone" dataKey="payer" stroke="#f59e0b" strokeWidth={2} name="Payer Meetings" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="content" className="space-y-6">
          {/* Content Performance Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Assets</p>
                    <p className="text-2xl font-bold">47,293</p>
                  </div>
                  <FileText className="w-8 h-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Active Workflows</p>
                    <p className="text-2xl font-bold">1,247</p>
                  </div>
                  <AlertCircle className="w-8 h-8 text-orange-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Compliance Rate</p>
                    <p className="text-2xl font-bold">96.8%</p>
                  </div>
                  <Target className="w-8 h-8 text-green-500" />
                </div>
                <Progress value={97} className="h-1 mt-2" />
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Avg Review Time</p>
                    <p className="text-2xl font-bold">1.8d</p>
                  </div>
                  <Calendar className="w-8 h-8 text-purple-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Content Distribution */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Content Type Distribution</CardTitle>
                <CardDescription>Breakdown of content assets by type</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={contentMetrics}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {contentMetrics.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>MLR Performance Metrics</CardTitle>
                <CardDescription>Medical Legal Regulatory workflow efficiency</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Assets Under Review</span>
                    <span className="font-medium">342</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Approved This Month</span>
                    <span className="font-medium text-green-600">1,847</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Rejection Rate</span>
                    <span className="font-medium text-red-600">3.2%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Avg Turnaround</span>
                    <span className="font-medium">1.8 days</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}