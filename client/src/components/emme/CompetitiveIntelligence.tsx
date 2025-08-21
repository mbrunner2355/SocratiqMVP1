import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Target,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  Building2,
  DollarSign,
  Users,
  Calendar,
  FileText,
  Activity
} from "lucide-react";

export function CompetitiveIntelligence() {
  const competitors = [
    {
      company: "NovoNordisk",
      therapeuticArea: "Diabetes/GLP-1",
      marketShare: 42,
      shareChange: "+3.2%",
      trend: "up",
      products: ["Ozempic", "Rybelsus", "Wegovy"],
      recentActivity: [
        {
          type: "Clinical Trial",
          title: "Phase III SUSTAIN-11 results published",
          date: "3 days ago",
          impact: "high"
        },
        {
          type: "Regulatory",
          title: "FDA approval for new indication",
          date: "1 week ago", 
          impact: "medium"
        }
      ],
      financials: {
        revenue: "$24.8B",
        growth: "+18%",
        rdSpend: "$3.2B"
      }
    },
    {
      company: "Eli Lilly",
      therapeuticArea: "Diabetes/Alzheimer's",
      marketShare: 38,
      shareChange: "+5.7%",
      trend: "up",
      products: ["Mounjaro", "Trulicity", "Leqembi"],
      recentActivity: [
        {
          type: "Launch",
          title: "Mounjaro obesity indication launch",
          date: "2 weeks ago",
          impact: "high"
        },
        {
          type: "Partnership",
          title: "Strategic alliance with Verily",
          date: "3 weeks ago",
          impact: "medium"
        }
      ],
      financials: {
        revenue: "$28.5B", 
        growth: "+22%",
        rdSpend: "$7.1B"
      }
    },
    {
      company: "Sanofi",
      therapeuticArea: "Diabetes/Immunology",
      marketShare: 23,
      shareChange: "-1.8%",
      trend: "down", 
      products: ["Lantus", "Toujeo", "Dupixent"],
      recentActivity: [
        {
          type: "Acquisition",
          title: "Acquired Translate Bio for $3.2B",
          date: "1 month ago",
          impact: "high"
        },
        {
          type: "Clinical Trial",
          title: "Phase II Dupixent COPD trial initiated",
          date: "6 weeks ago",
          impact: "medium"
        }
      ],
      financials: {
        revenue: "$44.4B",
        growth: "-2%", 
        rdSpend: "$6.7B"
      }
    }
  ];

  const therapeuticLandscape = [
    {
      area: "GLP-1 Diabetes/Obesity",
      totalMarket: "$18.5B",
      growth: "+32%",
      keyPlayers: ["Novo Nordisk (42%)", "Eli Lilly (38%)", "Sanofi (20%)"],
      upcomingCatalysts: [
        "Ozempic sleep apnea indication (Q2 2025)",
        "Mounjaro cardiovascular outcomes (Q3 2025)",
        "Oral GLP-1 competitive landscape (2025-2026)"
      ]
    },
    {
      area: "Oncology Immunotherapy", 
      totalMarket: "$89.6B",
      growth: "+12%",
      keyPlayers: ["Merck (23%)", "Bristol Myers (19%)", "Roche (16%)"],
      upcomingCatalysts: [
        "CAR-T cell therapy expansions (2025)",
        "Bispecific antibody approvals (H1 2025)",
        "Tumor-agnostic biomarker strategies"
      ]
    },
    {
      area: "Alzheimer's Disease",
      totalMarket: "$7.3B", 
      growth: "+67%",
      keyPlayers: ["Biogen (45%)", "Eisai (38%)", "Roche (17%)"],
      upcomingCatalysts: [
        "Leqembi Medicare coverage decision (Q1 2025)",
        "Donanemab FDA approval timeline (Q2 2025)", 
        "Early-stage prevention trials readout (2025-2026)"
      ]
    }
  ];

  const competitiveAlerts = [
    {
      id: "CA-2025-0234",
      priority: "high",
      type: "Regulatory Filing",
      title: "Competitor filing for expanded indication in our core market",
      competitor: "Eli Lilly",
      description: "Mounjaro (tirzepatide) filing for chronic kidney disease indication could impact our nephrology strategy",
      timeframe: "FDA decision expected Q2 2025",
      potentialImpact: "High - $2.3B addressable market overlap",
      recommendedActions: [
        "Accelerate our CKD clinical program timeline",
        "Prepare competitive response positioning", 
        "Engage nephrology KOLs proactively"
      ]
    },
    {
      id: "CA-2025-0233",
      priority: "medium", 
      type: "Clinical Results",
      title: "Positive Phase III data announcement",
      competitor: "Novo Nordisk",
      description: "SUSTAIN-12 cardiovascular outcomes study shows superior efficacy vs. current standard of care",
      timeframe: "Publication in NEJM expected January 2025",
      potentialImpact: "Medium - strengthens competitive position in cardio-diabetes",
      recommendedActions: [
        "Update competitive intelligence materials",
        "Prepare medical affairs response strategy",
        "Review our CV outcomes study design"
      ]
    }
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Competitive Intelligence</h1>
          <p className="text-gray-600 mt-2">
            Real-time competitor tracking and strategic analysis
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button size="sm">
            <Activity className="w-4 h-4 mr-2" />
            Generate Report
          </Button>
          <Button variant="outline" size="sm">
            <AlertCircle className="w-4 h-4 mr-2" />
            Set Alerts
          </Button>
        </div>
      </div>

      <Tabs defaultValue="competitors" className="space-y-6">
        <TabsList>
          <TabsTrigger value="competitors">Key Competitors</TabsTrigger>
          <TabsTrigger value="landscape">Market Landscape</TabsTrigger>
          <TabsTrigger value="alerts">Competitive Alerts</TabsTrigger>
        </TabsList>

        <TabsContent value="competitors" className="space-y-4">
          {competitors.map((competitor, index) => (
            <Card key={index}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-100 rounded-full">
                      <Building2 className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">{competitor.company}</CardTitle>
                      <p className="text-gray-600">{competitor.therapeuticArea}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <div className="text-2xl font-bold">{competitor.marketShare}%</div>
                      <div className={`flex items-center text-sm ${competitor.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                        {competitor.trend === 'up' ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
                        {competitor.shareChange}
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Key Products */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Key Products</h4>
                    <div className="space-y-2">
                      {competitor.products.map((product, productIndex) => (
                        <Badge key={productIndex} variant="outline" className="mr-2">
                          {product}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Financial Metrics */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Financial Metrics</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Revenue</span>
                        <span className="font-medium">{competitor.financials.revenue}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Growth</span>
                        <span className={`font-medium ${competitor.financials.growth.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                          {competitor.financials.growth}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">R&D Spend</span>
                        <span className="font-medium">{competitor.financials.rdSpend}</span>
                      </div>
                    </div>
                  </div>

                  {/* Recent Activity */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Recent Activity</h4>
                    <div className="space-y-3">
                      {competitor.recentActivity.map((activity, activityIndex) => (
                        <div key={activityIndex} className="border-l-2 border-blue-200 pl-3">
                          <div className="flex items-center space-x-2 mb-1">
                            <Badge className={activity.impact === 'high' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}>
                              {activity.type}
                            </Badge>
                            <span className="text-xs text-gray-500">{activity.date}</span>
                          </div>
                          <p className="text-sm text-gray-700">{activity.title}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="landscape" className="space-y-4">
          {therapeuticLandscape.map((area, index) => (
            <Card key={index}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl">{area.area}</CardTitle>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <div className="text-lg font-bold">{area.totalMarket}</div>
                      <div className="text-sm text-green-600">{area.growth} growth</div>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Market Leaders</h4>
                    <div className="space-y-2">
                      {area.keyPlayers.map((player, playerIndex) => (
                        <div key={playerIndex} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <span className="text-sm">{player}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Upcoming Catalysts</h4>
                    <div className="space-y-2">
                      {area.upcomingCatalysts.map((catalyst, catalystIndex) => (
                        <div key={catalystIndex} className="flex items-start space-x-2 text-sm">
                          <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-gray-600">{catalyst}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="alerts" className="space-y-4">
          {competitiveAlerts.map((alert, index) => (
            <Card key={index} className={`border-l-4 ${alert.priority === 'high' ? 'border-l-red-500' : 'border-l-yellow-500'}`}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <AlertCircle className={`w-5 h-5 ${alert.priority === 'high' ? 'text-red-600' : 'text-yellow-600'}`} />
                    <div>
                      <CardTitle className="text-lg">{alert.title}</CardTitle>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <span>{alert.competitor}</span>
                        <span>•</span>
                        <span>{alert.type}</span>
                        <span>•</span>
                        <Badge className={alert.priority === 'high' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}>
                          {alert.priority} priority
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="text-right text-sm text-gray-500">
                    {alert.id}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-4">{alert.description}</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Timeline & Impact</h4>
                    <div className="space-y-2 text-sm">
                      <div><span className="text-gray-600">Timeframe:</span> {alert.timeframe}</div>
                      <div><span className="text-gray-600">Potential Impact:</span> {alert.potentialImpact}</div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Recommended Actions</h4>
                    <div className="space-y-1">
                      {alert.recommendedActions.map((action, actionIndex) => (
                        <div key={actionIndex} className="flex items-start space-x-2 text-sm">
                          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-gray-600">{action}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="mt-4 flex justify-end space-x-2">
                  <Button size="sm" variant="outline">
                    Snooze Alert
                  </Button>
                  <Button size="sm">
                    Create Action Plan
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}