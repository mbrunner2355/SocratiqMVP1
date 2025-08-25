import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  UserCheck, 
  Heart, 
  DollarSign, 
  Target, 
  MessageSquare, 
  Calendar,
  TrendingUp,
  Users,
  FileText,
  Send,
  Eye,
  BarChart3,
  CheckCircle,
  Clock,
  AlertCircle,
  Brain,
  BookOpen
} from "lucide-react";

interface Campaign {
  id: string;
  name: string;
  audience: "HCP" | "Patient" | "Payer";
  status: "active" | "draft" | "completed";
  reach: number;
  engagement: number;
  conversion: number;
  budget: number;
  spent: number;
  endDate: string;
}

interface EngagementChannel {
  channel: string;
  audience: "HCP" | "Patient" | "Payer";
  performance: number;
  cost: number;
  roi: number;
}

interface EngagementStudioProps {
  projectData?: any;
}

export function EngagementStudio({ projectData }: EngagementStudioProps) {
  const [activeTab, setActiveTab] = useState("campaigns");
  const [selectedAudience, setSelectedAudience] = useState("all");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);

  // Initialize analysis if project data is available
  useEffect(() => {
    if (projectData && !analysisComplete) {
      setIsAnalyzing(true);
      // Simulate analysis process
      setTimeout(() => {
        setIsAnalyzing(false);
        setAnalysisComplete(true);
      }, 2500);
    }
  }, [projectData, analysisComplete]);

  const campaigns: Campaign[] = [
    {
      id: "1",
      name: "HCP Education Series Q3",
      audience: "HCP",
      status: "active",
      reach: 12450,
      engagement: 78,
      conversion: 23,
      budget: 50000,
      spent: 32000,
      endDate: "2024-09-30"
    },
    {
      id: "2", 
      name: "Patient Support Program",
      audience: "Patient",
      status: "active",
      reach: 8900,
      engagement: 85,
      conversion: 34,
      budget: 75000,
      spent: 41000,
      endDate: "2024-10-15"
    },
    {
      id: "3",
      name: "Payer Value Demonstration",
      audience: "Payer",
      status: "draft",
      reach: 0,
      engagement: 0,
      conversion: 0,
      budget: 40000,
      spent: 0,
      endDate: "2024-11-01"
    }
  ];

  const engagementChannels: EngagementChannel[] = [
    { channel: "Medical Conferences", audience: "HCP", performance: 89, cost: 15000, roi: 3.2 },
    { channel: "Digital Learning", audience: "HCP", performance: 76, cost: 8000, roi: 4.1 },
    { channel: "Patient Communities", audience: "Patient", performance: 92, cost: 12000, roi: 5.8 },
    { channel: "Mobile App", audience: "Patient", performance: 71, cost: 25000, roi: 2.9 },
    { channel: "Economic Reports", audience: "Payer", performance: 84, cost: 18000, roi: 3.7 },
    { channel: "Policy Briefings", audience: "Payer", performance: 67, cost: 10000, roi: 2.8 }
  ];

  const filteredCampaigns = campaigns.filter(campaign => 
    selectedAudience === "all" || campaign.audience === selectedAudience
  );

  const getStatusColor = (status: Campaign["status"]) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300";
      case "draft": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300";
      case "completed": return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const handleNavigateToLearning = () => {
    window.dispatchEvent(new CustomEvent('navigateToModule', { 
      detail: { moduleId: 'learning-hub', projectData } 
    }));
  };

  return (
    <div className="space-y-6 p-6">
      {/* Project Context Alert */}
      {projectData && (
        <Alert className="border-l-4 border-l-green-500 bg-green-50">
          <Target className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            <div className="flex items-center justify-between">
              <div>
                <strong>Project Context:</strong> {projectData.name} - Creating engagement strategy for {projectData.therapeuticArea} {projectData.projectType}
                {isAnalyzing && <span className="ml-2 text-sm">(Building engagement campaigns...)</span>}
                {analysisComplete && <span className="ml-2 text-sm text-green-600">✓ Campaigns optimized</span>}
              </div>
              {analysisComplete && (
                <Button size="sm" onClick={handleNavigateToLearning} style={{ backgroundColor: '#9B7FB8' }}>
                  <BookOpen className="w-3 h-3 mr-1" />
                  Continue to Learning
                </Button>
              )}
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Engagement Studio</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Multi-channel engagement strategy for HCP, Patient, and Payer audiences
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            <FileText className="w-4 h-4 mr-2" />
            Export Report
          </Button>
          <Button size="sm">
            <Send className="w-4 h-4 mr-2" />
            Launch Campaign
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Active Campaigns</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {campaigns.filter(c => c.status === "active").length}
              </p>
            </div>
            <Target className="w-8 h-8 text-blue-600" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Total Reach</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {campaigns.reduce((sum, c) => sum + c.reach, 0).toLocaleString()}
              </p>
            </div>
            <Users className="w-8 h-8 text-green-600" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Avg Engagement</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {Math.round(campaigns.reduce((sum, c) => sum + c.engagement, 0) / campaigns.length)}%
              </p>
            </div>
            <MessageSquare className="w-8 h-8 text-purple-600" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Total Budget</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                ${campaigns.reduce((sum, c) => sum + c.budget, 0).toLocaleString()}
              </p>
            </div>
            <DollarSign className="w-8 h-8 text-indigo-600" />
          </div>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="campaigns" className="flex items-center gap-2">
            <Target className="w-4 h-4" />
            Campaigns
          </TabsTrigger>
          <TabsTrigger value="channels" className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4" />
            Channels
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="campaigns" className="space-y-6">
          <div className="flex items-center justify-between">
            <Select value={selectedAudience} onValueChange={setSelectedAudience}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by audience" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Audiences</SelectItem>
                <SelectItem value="HCP">Healthcare Providers</SelectItem>
                <SelectItem value="Patient">Patients</SelectItem>
                <SelectItem value="Payer">Payers</SelectItem>
              </SelectContent>
            </Select>
            <Button>
              <Target className="w-4 h-4 mr-2" />
              Create Campaign
            </Button>
          </div>

          <div className="grid gap-6">
            {filteredCampaigns.map((campaign) => (
              <Card key={campaign.id} className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <h3 className="text-lg font-semibold">{campaign.name}</h3>
                    <Badge className={getStatusColor(campaign.status)}>
                      {campaign.status}
                    </Badge>
                    <Badge variant="outline">
                      {campaign.audience === "HCP" && <UserCheck className="w-3 h-3 mr-1" />}
                      {campaign.audience === "Patient" && <Heart className="w-3 h-3 mr-1" />}
                      {campaign.audience === "Payer" && <DollarSign className="w-3 h-3 mr-1" />}
                      {campaign.audience}
                    </Badge>
                  </div>
                  <Button variant="outline" size="sm">
                    <Eye className="w-4 h-4 mr-2" />
                    View Details
                  </Button>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Reach</p>
                    <p className="text-xl font-bold">{campaign.reach.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Engagement</p>
                    <p className="text-xl font-bold">{campaign.engagement}%</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Conversion</p>
                    <p className="text-xl font-bold">{campaign.conversion}%</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Budget</p>
                    <p className="text-xl font-bold">${campaign.budget.toLocaleString()}</p>
                    <Progress value={(campaign.spent / campaign.budget) * 100} className="mt-1" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-300">End Date</p>
                    <p className="text-sm font-medium flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      {campaign.endDate}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="channels" className="space-y-6">
          <div className="grid gap-4">
            {["HCP", "Patient", "Payer"].map((audience) => (
              <Card key={audience} className="p-6">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center">
                    {audience === "HCP" && <UserCheck className="w-5 h-5 mr-2 text-blue-600" />}
                    {audience === "Patient" && <Heart className="w-5 h-5 mr-2 text-red-600" />}
                    {audience === "Payer" && <DollarSign className="w-5 h-5 mr-2 text-green-600" />}
                    {audience} Channels
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {engagementChannels
                      .filter((channel) => channel.audience === audience)
                      .map((channel, index) => (
                        <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex-1">
                            <h4 className="font-medium">{channel.channel}</h4>
                            <div className="flex items-center space-x-4 mt-2">
                              <div>
                                <span className="text-sm text-gray-600">Performance</span>
                                <Progress value={channel.performance} className="w-24 mt-1" />
                              </div>
                              <div>
                                <span className="text-sm text-gray-600">Cost: ${channel.cost.toLocaleString()}</span>
                              </div>
                              <div>
                                <span className="text-sm text-gray-600">ROI: {channel.roi}x</span>
                              </div>
                            </div>
                          </div>
                          <Button variant="outline" size="sm">
                            Optimize
                          </Button>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6">
              <CardHeader>
                <CardTitle>Campaign Performance Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">HCP Engagement</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm">78%</span>
                      <TrendingUp className="w-4 h-4 text-green-600" />
                    </div>
                  </div>
                  <Progress value={78} className="w-full" />

                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Patient Engagement</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm">85%</span>
                      <TrendingUp className="w-4 h-4 text-green-600" />
                    </div>
                  </div>
                  <Progress value={85} className="w-full" />

                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Payer Engagement</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm">72%</span>
                      <TrendingUp className="w-4 h-4 text-yellow-600" />
                    </div>
                  </div>
                  <Progress value={72} className="w-full" />
                </div>
              </CardContent>
            </Card>

            <Card className="p-6">
              <CardHeader>
                <CardTitle>Budget Optimization</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <div className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                      <span className="font-medium text-green-800 dark:text-green-300">Cost Savings Identified</span>
                    </div>
                    <p className="text-sm text-green-700 dark:text-green-400 mt-1">
                      Reallocating $23K from underperforming channels could increase ROI by 34%
                    </p>
                  </div>

                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <div className="flex items-center">
                      <Clock className="w-5 h-5 text-blue-600 mr-2" />
                      <span className="font-medium text-blue-800 dark:text-blue-300">Timing Optimization</span>
                    </div>
                    <p className="text-sm text-blue-700 dark:text-blue-400 mt-1">
                      Q4 campaigns show 45% higher engagement rates in your target segments
                    </p>
                  </div>

                  <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                    <div className="flex items-center">
                      <AlertCircle className="w-5 h-5 text-orange-600 mr-2" />
                      <span className="font-medium text-orange-800 dark:text-orange-300">Channel Alert</span>
                    </div>
                    <p className="text-sm text-orange-700 dark:text-orange-400 mt-1">
                      Digital learning platform showing declining engagement - review content strategy
                    </p>
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