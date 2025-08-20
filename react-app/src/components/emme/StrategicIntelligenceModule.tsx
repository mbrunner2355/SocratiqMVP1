import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  Brain,
  Target,
  TrendingUp,
  AlertTriangle,
  BarChart3,
  Globe,
  Zap,
  Calendar,
  Activity,
  CheckCircle
} from "lucide-react";

export function StrategicIntelligenceModule() {
  const strategicInsights = [
    {
      category: "Market Dynamics",
      priority: "critical",
      insight: "GLP-1 market showing 47% YoY growth with supply constraints creating competitive opportunities",
      confidence: 94,
      sources: ["MarketData Pro", "FDA FAERS", "Prescription Analytics"],
      actionItems: [
        "Accelerate manufacturing capacity planning",
        "Engage supply chain partners for raw materials",
        "Update go-to-market timeline by 90 days"
      ],
      impactForecast: "$340M revenue opportunity",
      timeframe: "Q1-Q2 2025"
    },
    {
      category: "Regulatory Intelligence",
      priority: "high",
      insight: "FDA signaling preference for real-world evidence in cardiovascular outcomes studies",
      confidence: 87,
      sources: ["FDA Guidance", "Advisory Committee Transcripts", "Industry Intelligence"],
      actionItems: [
        "Initiate RWE data partnerships with health systems",
        "Revise clinical development strategy", 
        "Engage regulatory consultants for pathway optimization"
      ],
      impactForecast: "18-month timeline acceleration",
      timeframe: "Q2 2025"
    },
    {
      category: "Competitive Landscape",
      priority: "medium",
      insight: "Competitor patent cliff in obesity segment opening $2.1B addressable market",
      confidence: 82,
      sources: ["Patent Analytics", "Financial Filings", "Pipeline Intelligence"],
      actionItems: [
        "Evaluate market entry strategies",
        "Assess IP freedom to operate",
        "Develop competitive positioning"
      ],
      impactForecast: "$2.1B market opportunity",
      timeframe: "2026-2027"
    }
  ];

  const scenarioModeling = [
    {
      scenario: "Accelerated Launch",
      probability: "Medium (45%)",
      description: "6-month timeline acceleration through expedited regulatory pathway",
      keyAssumptions: [
        "FDA breakthrough therapy designation",
        "Priority review granted",
        "No major safety signals"
      ],
      outcomes: {
        revenue: "+$180M (Year 1)",
        marketShare: "+12%",
        competitiveAdvantage: "18-month head start"
      },
      risks: [
        "Manufacturing scale-up challenges",
        "Regulatory scrutiny increase",
        "Quality system strain"
      ]
    },
    {
      scenario: "Market Disruption",
      probability: "Low (25%)",
      description: "Major competitor withdraws leading product due to safety concerns",
      keyAssumptions: [
        "Significant safety signal emergence",
        "Regulatory action required",
        "Market confidence shift"
      ],
      outcomes: {
        revenue: "+$420M (Year 1)",
        marketShare: "+28%",
        competitiveAdvantage: "Market leadership position"
      },
      risks: [
        "Regulatory class effect concerns",
        "Physician prescribing hesitation",
        "Supply chain overwhelm"
      ]
    },
    {
      scenario: "Delayed Entry",
      probability: "High (65%)",
      description: "Clinical trial delays push launch 12-18 months",
      keyAssumptions: [
        "COVID-19 enrollment impacts",
        "Site capacity constraints",
        "Regulatory feedback cycles"
      ],
      outcomes: {
        revenue: "-$290M (Year 1)",
        marketShare: "-8%",
        competitiveAdvantage: "Late follower position"
      },
      risks: [
        "Competitor entrenchment",
        "Payer formulary exclusion",
        "HCP adoption barriers"
      ]
    }
  ];

  const marketIntelligence = {
    totalAddressableMarket: "$47.3B",
    servicableMarket: "$18.6B",
    currentPenetration: "12%",
    growthRate: "+23% CAGR",
    keyGrowthDrivers: [
      "Aging population demographics",
      "Increasing disease prevalence", 
      "Expanded indication approvals",
      "Improved access and reimbursement"
    ],
    competitiveThreats: [
      "Biosimilar competition (2025-2026)",
      "Novel mechanism entrants",
      "Pricing pressure initiatives"
    ]
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical": return "bg-red-100 text-red-800";
      case "high": return "bg-orange-100 text-orange-800";
      case "medium": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getProbabilityColor = (probability: string) => {
    if (probability.includes("High")) return "bg-red-100 text-red-800";
    if (probability.includes("Medium")) return "bg-yellow-100 text-yellow-800";
    return "bg-green-100 text-green-800";
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Strategic Intelligence</h1>
          <p className="text-gray-600 mt-2">
            AI-powered market analysis, competitive intelligence, and strategic scenario modeling
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button size="sm">
            <Brain className="w-4 h-4 mr-2" />
            Generate Insights
          </Button>
          <Button variant="outline" size="sm">
            <BarChart3 className="w-4 h-4 mr-2" />
            Strategic Dashboard
          </Button>
        </div>
      </div>

      {/* Market Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <Globe className="w-6 h-6 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">{marketIntelligence.totalAddressableMarket}</div>
            <p className="text-sm text-gray-600">Total Addressable Market</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Target className="w-6 h-6 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">{marketIntelligence.servicableMarket}</div>
            <p className="text-sm text-gray-600">Serviceable Market</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <TrendingUp className="w-6 h-6 text-purple-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">{marketIntelligence.growthRate}</div>
            <p className="text-sm text-gray-600">Growth Rate</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Activity className="w-6 h-6 text-orange-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">{marketIntelligence.currentPenetration}</div>
            <p className="text-sm text-gray-600">Current Penetration</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="insights" className="space-y-6">
        <TabsList>
          <TabsTrigger value="insights">Strategic Insights</TabsTrigger>
          <TabsTrigger value="scenarios">Scenario Modeling</TabsTrigger>
          <TabsTrigger value="market">Market Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="insights" className="space-y-4">
          {strategicInsights.map((insight, index) => (
            <Card key={index}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Brain className="w-5 h-5 text-blue-600" />
                    <div>
                      <CardTitle className="text-lg">{insight.category}</CardTitle>
                      <div className="flex items-center space-x-2">
                        <Badge className={getPriorityColor(insight.priority)}>
                          {insight.priority} priority
                        </Badge>
                        <span className="text-sm text-gray-500">
                          {insight.confidence}% confidence
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-orange-600">{insight.impactForecast}</div>
                    <div className="text-sm text-gray-500">{insight.timeframe}</div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-gray-700 font-medium">{insight.insight}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Data Sources</h4>
                      <div className="space-y-1">
                        {insight.sources.map((source, sourceIndex) => (
                          <Badge key={sourceIndex} variant="outline" className="mr-2">
                            {source}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Recommended Actions</h4>
                      <div className="space-y-1">
                        {insight.actionItems.map((action, actionIndex) => (
                          <div key={actionIndex} className="flex items-start space-x-2 text-sm">
                            <CheckCircle className="w-3 h-3 text-green-500 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-600">{action}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-2">
                    <Button size="sm" variant="outline">
                      Deep Dive Analysis
                    </Button>
                    <Button size="sm">
                      Create Action Plan
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="scenarios" className="space-y-4">
          {scenarioModeling.map((scenario, index) => (
            <Card key={index}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">{scenario.scenario}</CardTitle>
                    <p className="text-gray-600 mt-1">{scenario.description}</p>
                  </div>
                  <Badge className={getProbabilityColor(scenario.probability)}>
                    {scenario.probability}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Key Assumptions</h4>
                    <div className="space-y-2">
                      {scenario.keyAssumptions.map((assumption, assumptionIndex) => (
                        <div key={assumptionIndex} className="flex items-start space-x-2 text-sm">
                          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-gray-600">{assumption}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Expected Outcomes</h4>
                    <div className="space-y-2">
                      {Object.entries(scenario.outcomes).map(([outcome, value], outcomeIndex) => (
                        <div key={outcomeIndex} className="flex justify-between items-center">
                          <span className="text-sm text-gray-600 capitalize">{outcome.replace(/([A-Z])/g, ' $1')}</span>
                          <Badge className={value.includes('+') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                            {value}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Key Risks</h4>
                    <div className="space-y-2">
                      {scenario.risks.map((risk, riskIndex) => (
                        <div key={riskIndex} className="flex items-start space-x-2 text-sm">
                          <AlertTriangle className="w-3 h-3 text-orange-500 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-600">{risk}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 flex justify-end">
                  <Button size="sm">
                    <Zap className="w-4 h-4 mr-2" />
                    Run Simulation
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="market">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Growth Drivers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {marketIntelligence.keyGrowthDrivers.map((driver, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <TrendingUp className="w-4 h-4 text-green-500" />
                      <span className="text-sm text-gray-700">{driver}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Competitive Threats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {marketIntelligence.competitiveThreats.map((threat, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <AlertTriangle className="w-4 h-4 text-red-500" />
                      <span className="text-sm text-gray-700">{threat}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}