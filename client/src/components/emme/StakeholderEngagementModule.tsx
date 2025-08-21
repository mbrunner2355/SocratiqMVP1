import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  Users,
  UserCheck,
  Heart,
  Building2,
  Stethoscope,
  CreditCard,
  Star,
  MessageCircle,
  Calendar,
  Target,
  TrendingUp,
  Award
} from "lucide-react";

export function StakeholderEngagementModule() {
  const engagementMetrics = {
    totalStakeholders: 45629,
    activeEngagements: 34782,
    satisfactionScore: 4.7,
    npsScore: 73,
    monthlyTouchpoints: 127394,
    conversionRate: 23.4
  };

  const stakeholderSegments = [
    {
      segment: "Healthcare Providers",
      count: 18947,
      engagementRate: 78,
      satisfaction: 4.6,
      keyMetrics: {
        "Prescription Volume": "+34%",
        "Clinical Adoption": "89%",
        "Educational Engagement": "76%"
      },
      topConcerns: [
        "Patient safety and monitoring",
        "Dosing and administration",
        "Insurance coverage issues"
      ],
      preferredChannels: ["Medical conferences", "Peer discussions", "Digital content"],
      recentActivities: [
        "Endocrinology Congress 2025 - 2,847 attendees",
        "Virtual tumor board participation - 567 HCPs",
        "Clinical data webinar series - 1,234 completions"
      ]
    },
    {
      segment: "Patients & Caregivers",
      count: 23891,
      engagementRate: 85,
      satisfaction: 4.8,
      keyMetrics: {
        "Program Enrollment": "+67%", 
        "Adherence Rate": "82%",
        "Support Utilization": "91%"
      },
      topConcerns: [
        "Medication affordability",
        "Side effect management",
        "Treatment accessibility"
      ],
      preferredChannels: ["Mobile apps", "Peer support groups", "Educational materials"],
      recentActivities: [
        "Patient advocacy partnerships - 12 organizations",
        "Disease awareness campaigns - 3.2M reach",
        "Support program enrollment - 4,567 new patients"
      ]
    },
    {
      segment: "Payers & Health Systems",
      count: 2791,
      engagementRate: 67,
      satisfaction: 4.2,
      keyMetrics: {
        "Formulary Coverage": "73%",
        "Prior Auth Approval": "84%",
        "Cost-Effectiveness Score": "4.1/5"
      },
      topConcerns: [
        "Budget impact and cost-effectiveness",
        "Real-world outcomes data",
        "Population health management"
      ],
      preferredChannels: ["Economic data presentations", "Health outcomes research", "Policy briefings"],
      recentActivities: [
        "HEOR symposium presentations - 234 attendees",
        "Value-based care pilot programs - 8 health systems",
        "Budget impact model updates - 45 payers"
      ]
    }
  ];

  const engagementCampaigns = [
    {
      name: "Precision Diabetes Management",
      targetSegment: "Healthcare Providers",
      status: "Active",
      duration: "6 months",
      participants: 3456,
      engagement: 89,
      satisfaction: 4.8,
      outcomes: {
        "Knowledge Increase": "+42%",
        "Practice Change": "+67%",
        "Patient Outcomes": "+23%"
      },
      channels: ["Digital platform", "Peer discussions", "Case studies"],
      investment: "$2.3M",
      roi: "340%"
    },
    {
      name: "Patient Empowerment Initiative",
      targetSegment: "Patients & Caregivers", 
      status: "Active",
      duration: "12 months",
      participants: 8947,
      engagement: 91,
      satisfaction: 4.9,
      outcomes: {
        "Self-Management": "+58%",
        "Adherence": "+34%",
        "Quality of Life": "+41%"
      },
      channels: ["Mobile app", "Support groups", "Educational content"],
      investment: "$1.8M",
      roi: "278%"
    },
    {
      name: "Value Demonstration Program",
      targetSegment: "Payers & Health Systems",
      status: "Planning",
      duration: "9 months",
      participants: 125,
      engagement: 0,
      satisfaction: 0,
      outcomes: {
        "Coverage Decisions": "TBD",
        "Access Improvement": "TBD",
        "Cost Savings": "TBD"
      },
      channels: ["HEOR presentations", "RWE studies", "Economic modeling"],
      investment: "$3.1M",
      roi: "TBD"
    }
  ];

  const kolNetwork = [
    {
      name: "Dr. Sarah Chen",
      specialty: "Endocrinology",
      tier: "Tier 1",
      influence: 94,
      activities: ["Speaker bureau", "Advisory board", "Research collaboration"],
      reach: "12,847 HCP network",
      engagement: "High",
      recentContributions: [
        "Led diabetes innovation roundtable",
        "Published outcomes research paper",
        "Participated in FDA advisory committee"
      ]
    },
    {
      name: "Dr. Michael Rodriguez", 
      specialty: "Oncology",
      tier: "Tier 1",
      influence: 91,
      activities: ["Clinical trials", "Medical conferences", "Peer education"],
      reach: "8,934 HCP network",
      engagement: "High",
      recentContributions: [
        "Principal investigator - Phase III study",
        "Keynote speaker at ASCO 2024",
        "Clinical practice guidelines committee"
      ]
    },
    {
      name: "Prof. Jennifer Park",
      specialty: "Health Economics",
      tier: "Tier 2", 
      influence: 87,
      activities: ["HEOR research", "Policy advocacy", "Payer education"],
      reach: "2,456 payer network",
      engagement: "Medium",
      recentContributions: [
        "Budget impact analysis publication",
        "Health policy forum participation",
        "Value framework development"
      ]
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active": return "bg-green-100 text-green-800";
      case "Planning": return "bg-purple-100 text-purple-800";
      case "Completed": return "bg-gray-100 text-gray-800";
      default: return "bg-yellow-100 text-yellow-800";
    }
  };

  const getTierColor = (tier: string) => {
    if (tier.includes("Tier 1")) return "bg-purple-100 text-purple-800";
    if (tier.includes("Tier 2")) return "bg-purple-100 text-purple-800";
    return "bg-gray-100 text-gray-800";
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Stakeholder Engagement</h1>
          <p className="text-gray-600 mt-2">
            Multi-stakeholder relationship management and engagement optimization
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button size="sm" className="bg-purple-600 hover:bg-purple-700 text-white">
            <Users className="w-4 h-4 mr-2" />
            Launch Campaign
          </Button>
          <Button variant="outline" size="sm">
            <Target className="w-4 h-4 mr-2" />
            Engagement Analytics
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <Users className="w-6 h-6 text-purple-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">{engagementMetrics.totalStakeholders.toLocaleString()}</div>
            <p className="text-sm text-gray-600">Total Stakeholders</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <UserCheck className="w-6 h-6 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">{engagementMetrics.activeEngagements.toLocaleString()}</div>
            <p className="text-sm text-gray-600">Active Engagements</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Star className="w-6 h-6 text-yellow-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">{engagementMetrics.satisfactionScore}</div>
            <p className="text-sm text-gray-600">Satisfaction Score</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Award className="w-6 h-6 text-purple-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">{engagementMetrics.npsScore}</div>
            <p className="text-sm text-gray-600">NPS Score</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <MessageCircle className="w-6 h-6 text-orange-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">{engagementMetrics.monthlyTouchpoints.toLocaleString()}</div>
            <p className="text-sm text-gray-600">Monthly Touchpoints</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <TrendingUp className="w-6 h-6 text-red-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">{engagementMetrics.conversionRate}%</div>
            <p className="text-sm text-gray-600">Conversion Rate</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="segments" className="space-y-6">
        <TabsList>
          <TabsTrigger value="segments">Stakeholder Segments</TabsTrigger>
          <TabsTrigger value="campaigns">Engagement Campaigns</TabsTrigger>
          <TabsTrigger value="kols">KOL Network</TabsTrigger>
        </TabsList>

        <TabsContent value="segments" className="space-y-4">
          {stakeholderSegments.map((segment, index) => (
            <Card key={index}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-purple-100 rounded-full">
                      {segment.segment.includes("Providers") ? <Stethoscope className="w-5 h-5 text-purple-600" /> : 
                       segment.segment.includes("Patients") ? <Heart className="w-5 h-5 text-purple-600" /> :
                       <CreditCard className="w-5 h-5 text-purple-600" />}
                    </div>
                    <div>
                      <CardTitle className="text-lg">{segment.segment}</CardTitle>
                      <p className="text-gray-600">{segment.count.toLocaleString()} stakeholders</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold">{segment.engagementRate}%</div>
                    <div className="text-sm text-gray-500">Engagement Rate</div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Key Performance Metrics</h4>
                    <div className="space-y-2">
                      {Object.entries(segment.keyMetrics).map(([metric, value], metricIndex) => (
                        <div key={metricIndex} className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">{metric}</span>
                          <Badge className={value.includes('+') ? 'bg-green-100 text-green-800' : 'bg-purple-100 text-purple-800'}>
                            {value}
                          </Badge>
                        </div>
                      ))}
                    </div>
                    <div className="mt-3 pt-3 border-t">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Satisfaction</span>
                        <span className="font-medium">{segment.satisfaction}/5.0</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Top Concerns</h4>
                    <div className="space-y-2">
                      {segment.topConcerns.map((concern, concernIndex) => (
                        <div key={concernIndex} className="flex items-start space-x-2 text-sm">
                          <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-gray-600">{concern}</span>
                        </div>
                      ))}
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-2 mt-4">Preferred Channels</h4>
                    <div className="space-y-1">
                      {segment.preferredChannels.map((channel, channelIndex) => (
                        <Badge key={channelIndex} variant="outline" className="mr-1 mb-1 text-xs">
                          {channel}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Recent Activities</h4>
                    <div className="space-y-2">
                      {segment.recentActivities.map((activity, activityIndex) => (
                        <div key={activityIndex} className="text-sm text-gray-600 border-l-2 border-purple-200 pl-3">
                          {activity}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="campaigns" className="space-y-4">
          {engagementCampaigns.map((campaign, index) => (
            <Card key={index}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">{campaign.name}</CardTitle>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <span>{campaign.targetSegment}</span>
                      <span>•</span>
                      <span>{campaign.duration}</span>
                      <span>•</span>
                      <Badge className={getStatusColor(campaign.status)}>
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
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 text-sm mb-4">
                  <div className="text-center">
                    <div className="text-lg font-bold text-purple-600">{campaign.participants.toLocaleString()}</div>
                    <div className="text-gray-600">Participants</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-green-600">{campaign.engagement || 'N/A'}%</div>
                    <div className="text-gray-600">Engagement</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-purple-600">{campaign.satisfaction || 'N/A'}</div>
                    <div className="text-gray-600">Satisfaction</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-orange-600">{campaign.investment}</div>
                    <div className="text-gray-600">Investment</div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Engagement Channels</h4>
                    <div className="space-y-1">
                      {campaign.channels.map((channel, channelIndex) => (
                        <Badge key={channelIndex} variant="outline" className="mr-1">
                          {channel}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Key Outcomes</h4>
                    <div className="space-y-1">
                      {Object.entries(campaign.outcomes).map(([outcome, value], outcomeIndex) => (
                        <div key={outcomeIndex} className="flex justify-between items-center text-sm">
                          <span className="text-gray-600">{outcome}</span>
                          <Badge className={value === 'TBD' ? 'bg-gray-100 text-gray-800' : 'bg-green-100 text-green-800'}>
                            {value}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="kols" className="space-y-4">
          {kolNetwork.map((kol, index) => (
            <Card key={index}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-purple-100 rounded-full">
                      <Star className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{kol.name}</CardTitle>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <span>{kol.specialty}</span>
                        <span>•</span>
                        <Badge className={getTierColor(kol.tier)}>
                          {kol.tier}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold">{kol.influence}</div>
                    <div className="text-sm text-gray-500">Influence Score</div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Activities</h4>
                    <div className="space-y-1">
                      {kol.activities.map((activity, activityIndex) => (
                        <Badge key={activityIndex} variant="outline" className="mr-1 mb-1 text-xs">
                          {activity}
                        </Badge>
                      ))}
                    </div>
                    <div className="mt-3 pt-3 border-t text-sm">
                      <div className="text-gray-600">Network Reach</div>
                      <div className="font-medium">{kol.reach}</div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Engagement Level</h4>
                    <Badge className={kol.engagement === 'High' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                      {kol.engagement}
                    </Badge>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Recent Contributions</h4>
                    <div className="space-y-1">
                      {kol.recentContributions.map((contribution, contributionIndex) => (
                        <div key={contributionIndex} className="text-sm text-gray-600 border-l-2 border-purple-200 pl-2">
                          {contribution}
                        </div>
                      ))}
                    </div>
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