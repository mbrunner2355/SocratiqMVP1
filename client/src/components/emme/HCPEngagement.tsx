import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Users,
  UserCheck,
  MessageCircle,
  Calendar,
  Target,
  TrendingUp,
  Star,
  Mail,
  Phone,
  Award,
  Activity,
  Clock
} from "lucide-react";

export function HCPEngagement() {
  const hcpMetrics = {
    totalHCPs: 12847,
    activeEngagement: 8934,
    highValueTargets: 2341,
    engagementRate: 73,
    npsScore: 67,
    avgInteractionFreq: "2.3/month"
  };

  const topHCPs = [
    {
      id: "HCP-00234",
      name: "Dr. Sarah Chen",
      specialty: "Endocrinology",
      institution: "Johns Hopkins Medical Center",
      tier: "Tier 1 - KOL",
      engagementScore: 94,
      lastInteraction: "2 days ago",
      interactionCount: 47,
      influence: {
        publications: 89,
        citations: 2847,
        speakingEvents: 23
      },
      preferences: ["Digital content", "Peer-to-peer discussions", "Clinical data"],
      territories: ["Baltimore", "Washington DC"],
      therapeuticInterests: ["Diabetes", "Obesity", "Metabolic disorders"]
    },
    {
      id: "HCP-00891",
      name: "Dr. Michael Rodriguez",
      specialty: "Oncology",
      institution: "MD Anderson Cancer Center",
      tier: "Tier 1 - KOL",
      engagementScore: 91,
      lastInteraction: "1 week ago",
      interactionCount: 34,
      influence: {
        publications: 156,
        citations: 4782,
        speakingEvents: 45
      },
      preferences: ["In-person meetings", "Clinical trials", "Research collaborations"],
      territories: ["Houston", "Austin"],
      therapeuticInterests: ["Immunooncology", "Precision medicine", "CAR-T therapy"]
    },
    {
      id: "HCP-01456",
      name: "Dr. Jennifer Park",
      specialty: "Cardiology",
      institution: "Cleveland Clinic",
      tier: "Tier 2 - High Prescriber",
      engagementScore: 87,
      lastInteraction: "3 days ago", 
      interactionCount: 28,
      influence: {
        publications: 67,
        citations: 1923,
        speakingEvents: 12
      },
      preferences: ["Mobile apps", "Webinars", "Patient case studies"],
      territories: ["Cleveland", "Akron"],
      therapeuticInterests: ["Heart failure", "Lipid management", "Preventive cardiology"]
    }
  ];

  const engagementChannels = [
    {
      channel: "Digital Detailing",
      usage: 78,
      effectiveness: 82,
      cost: "$23/interaction",
      reachability: "High",
      preferredBy: "Younger HCPs (35-45)"
    },
    {
      channel: "In-Person Meetings",
      usage: 45,
      effectiveness: 94,
      cost: "$487/interaction", 
      reachability: "Medium",
      preferredBy: "Senior HCPs (55+)"
    },
    {
      channel: "Medical Conferences",
      usage: 67,
      effectiveness: 89,
      cost: "$892/interaction",
      reachability: "Low",
      preferredBy: "KOLs & Researchers"
    },
    {
      channel: "Peer-to-Peer Programs", 
      usage: 34,
      effectiveness: 96,
      cost: "$1,234/interaction",
      reachability: "Low",
      preferredBy: "Tier 1 HCPs"
    }
  ];

  const campaignPerformance = [
    {
      campaign: "Diabetes Innovation Summit 2025",
      type: "Educational Event",
      status: "Active",
      targetHCPs: 2450,
      registered: 1876,
      attended: 1456,
      satisfaction: 4.7,
      leadGeneration: 234,
      cost: "$125K",
      roi: "312%"
    },
    {
      campaign: "Oncology Digital Learning Series",
      type: "Digital Content",
      status: "Active", 
      targetHCPs: 5670,
      registered: 4234,
      completed: 3456,
      satisfaction: 4.5,
      leadGeneration: 567,
      cost: "$78K",
      roi: "445%"
    },
    {
      campaign: "Cardiology Real-World Evidence Webinar",
      type: "Virtual Event",
      status: "Completed",
      targetHCPs: 1250,
      registered: 987,
      attended: 743,
      satisfaction: 4.8,
      leadGeneration: 178,
      cost: "$34K", 
      roi: "287%"
    }
  ];

  const getTierColor = (tier: string) => {
    if (tier.includes("Tier 1")) return "bg-purple-100 text-purple-800";
    if (tier.includes("Tier 2")) return "bg-purple-100 text-purple-800";
    return "bg-gray-100 text-gray-800";
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">HCP Engagement</h1>
          <p className="text-gray-600 mt-2">
            Healthcare provider relationship management and engagement optimization
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button size="sm" className="bg-purple-600 hover:bg-purple-700 text-white">
            <MessageCircle className="w-4 h-4 mr-2" />
            Schedule Campaign
          </Button>
          <Button variant="outline" size="sm">
            <Target className="w-4 h-4 mr-2" />
            Segment Analysis
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <Users className="w-6 h-6 text-purple-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">{hcpMetrics.totalHCPs.toLocaleString()}</div>
            <p className="text-sm text-gray-600">Total HCPs</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <UserCheck className="w-6 h-6 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">{hcpMetrics.activeEngagement.toLocaleString()}</div>
            <p className="text-sm text-gray-600">Active Engagement</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Star className="w-6 h-6 text-purple-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">{hcpMetrics.highValueTargets.toLocaleString()}</div>
            <p className="text-sm text-gray-600">High Value Targets</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <TrendingUp className="w-6 h-6 text-orange-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">{hcpMetrics.engagementRate}%</div>
            <p className="text-sm text-gray-600">Engagement Rate</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Award className="w-6 h-6 text-red-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">{hcpMetrics.npsScore}</div>
            <p className="text-sm text-gray-600">NPS Score</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Clock className="w-6 h-6 text-indigo-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">{hcpMetrics.avgInteractionFreq}</div>
            <p className="text-sm text-gray-600">Avg Interactions</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="hcps" className="space-y-6">
        <TabsList>
          <TabsTrigger value="hcps">Key HCPs</TabsTrigger>
          <TabsTrigger value="channels">Engagement Channels</TabsTrigger>
          <TabsTrigger value="campaigns">Campaign Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="hcps" className="space-y-4">
          {topHCPs.map((hcp, index) => (
            <Card key={index}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-purple-100 rounded-full">
                      <Users className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{hcp.name}</CardTitle>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <span>{hcp.specialty}</span>
                        <span>•</span>
                        <span>{hcp.institution}</span>
                        <span>•</span>
                        <span>{hcp.id}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Badge className={getTierColor(hcp.tier)}>
                      {hcp.tier}
                    </Badge>
                    <div className="text-right">
                      <div className="text-lg font-bold">{hcp.engagementScore}</div>
                      <div className="text-sm text-gray-500">Engagement Score</div>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  {/* Interaction History */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Interaction History</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Last Contact</span>
                        <span className="font-medium">{hcp.lastInteraction}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Total Interactions</span>
                        <span className="font-medium">{hcp.interactionCount}</span>
                      </div>
                    </div>
                  </div>

                  {/* Influence Metrics */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Influence Metrics</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Publications</span>
                        <span className="font-medium">{hcp.influence.publications}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Citations</span>
                        <span className="font-medium">{hcp.influence.citations.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Speaking Events</span>
                        <span className="font-medium">{hcp.influence.speakingEvents}</span>
                      </div>
                    </div>
                  </div>

                  {/* Preferences & Interests */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Engagement Preferences</h4>
                    <div className="space-y-2">
                      {hcp.preferences.map((pref, prefIndex) => (
                        <Badge key={prefIndex} variant="outline" className="mr-1 mb-1">
                          {pref}
                        </Badge>
                      ))}
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-2 mt-4">Therapeutic Interests</h4>
                    <div className="space-y-1">
                      {hcp.therapeuticInterests.map((interest, interestIndex) => (
                        <div key={interestIndex} className="flex items-center space-x-2 text-sm">
                          <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
                          <span className="text-gray-600">{interest}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Territory Coverage */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Territory Coverage</h4>
                    <div className="space-y-2">
                      {hcp.territories.map((territory, territoryIndex) => (
                        <Badge key={territoryIndex} className="bg-green-100 text-green-800 mr-1">
                          {territory}
                        </Badge>
                      ))}
                    </div>
                    <div className="mt-4 flex space-x-2">
                      <Button size="sm" className="bg-purple-600 hover:bg-purple-700 text-white">
                        <Calendar className="w-4 h-4 mr-1" />
                        Schedule
                      </Button>
                      <Button size="sm" variant="outline">
                        <MessageCircle className="w-4 h-4 mr-1" />
                        Contact
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="channels" className="space-y-4">
          {engagementChannels.map((channel, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">{channel.channel}</h3>
                  <div className="flex items-center space-x-2">
                    <Badge className="bg-purple-100 text-purple-800">
                      {channel.cost}
                    </Badge>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm text-gray-600">Usage Rate</span>
                      <span className="font-medium">{channel.usage}%</span>
                    </div>
                    <Progress value={channel.usage} className="h-2 progress-gradient-blue-purple [&>div]:bg-gradient-blue-purple" />
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm text-gray-600">Effectiveness</span>
                      <span className="font-medium">{channel.effectiveness}%</span>
                    </div>
                    <Progress value={channel.effectiveness} className="h-2 progress-gradient-purple-blue [&>div]:bg-gradient-purple-blue" />
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Reachability: </span>
                    <Badge className={channel.reachability === 'High' ? 'bg-green-100 text-green-800' : 
                                    channel.reachability === 'Medium' ? 'bg-yellow-100 text-yellow-800' : 
                                    'bg-red-100 text-red-800'}>
                      {channel.reachability}
                    </Badge>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Preferred by: </span>
                    <span className="text-sm font-medium">{channel.preferredBy}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="campaigns" className="space-y-4">
          {campaignPerformance.map((campaign, index) => (
            <Card key={index}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">{campaign.campaign}</CardTitle>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <span>{campaign.type}</span>
                      <span>•</span>
                      <Badge className={campaign.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                        {campaign.status}
                      </Badge>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-green-600">{campaign.roi}</div>
                    <div className="text-sm text-gray-500">ROI</div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 text-sm">
                  <div className="text-center">
                    <div className="text-lg font-bold text-gray-900">{campaign.targetHCPs.toLocaleString()}</div>
                    <div className="text-gray-600">Targeted</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-purple-600">{campaign.registered.toLocaleString()}</div>
                    <div className="text-gray-600">Registered</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-green-600">{campaign.attended?.toLocaleString() || campaign.completed?.toLocaleString()}</div>
                    <div className="text-gray-600">{campaign.attended ? 'Attended' : 'Completed'}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-purple-600">{campaign.satisfaction}</div>
                    <div className="text-gray-600">Satisfaction</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-orange-600">{campaign.leadGeneration}</div>
                    <div className="text-gray-600">Leads</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-red-600">{campaign.cost}</div>
                    <div className="text-gray-600">Cost</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-indigo-600">{Math.round((campaign.attended || campaign.completed) / campaign.registered * 100)}%</div>
                    <div className="text-gray-600">Completion Rate</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-teal-600">{Math.round(campaign.leadGeneration / (campaign.attended || campaign.completed) * 100)}%</div>
                    <div className="text-gray-600">Conversion</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}