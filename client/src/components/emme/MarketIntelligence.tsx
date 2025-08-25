import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { 
  TrendingUp, 
  TrendingDown,
  AlertTriangle,
  Globe,
  DollarSign,
  Users,
  FileText,
  Calendar,
  Target,
  Zap,
  Eye
} from "lucide-react";

export function MarketIntelligence() {
  const marketTrends = [
    {
      category: "Oncology Immunotherapy",
      trend: "up",
      change: "+23%",
      value: "$47.2B",
      insight: "CAR-T therapy approvals driving segment growth",
      confidence: 94
    },
    {
      category: "Digital Therapeutics",
      trend: "up", 
      change: "+156%",
      value: "$8.9B",
      insight: "Post-pandemic telehealth adoption accelerating market",
      confidence: 89
    },
    {
      category: "Biosimilars",
      trend: "down",
      change: "-12%",
      value: "$23.1B", 
      insight: "Patent cliff effects creating pricing pressure",
      confidence: 91
    }
  ];

  const competitiveIntel = [
    {
      competitor: "Pfizer",
      action: "New FDA submission",
      therapeutic: "Oncology",
      impact: "High",
      timeframe: "Q2 2025",
      details: "PARP inhibitor for ovarian cancer - potential $2.1B opportunity"
    },
    {
      competitor: "Novartis",
      action: "Market access strategy",
      therapeutic: "Neurology", 
      impact: "Medium",
      timeframe: "Q1 2025",
      details: "Enhanced patient support programs for MS portfolio"
    },
    {
      competitor: "J&J",
      action: "Partnership announcement",
      therapeutic: "Immunology",
      impact: "High", 
      timeframe: "Ongoing",
      details: "AI-powered patient identification platform launch"
    }
  ];

  const payerInsights = [
    {
      payer: "Anthem",
      change: "Prior Auth Update",
      category: "Oncology",
      effective: "Jan 2025",
      impact: "Restrictive",
      details: "New step therapy requirements for targeted therapies"
    },
    {
      payer: "UnitedHealth",
      change: "Formulary Addition",
      category: "Diabetes",
      effective: "Feb 2025", 
      impact: "Favorable",
      details: "Tier 2 placement for GLP-1 receptor agonists"
    },
    {
      payer: "Aetna",
      change: "Policy Revision",
      category: "Rare Disease",
      effective: "Mar 2025",
      impact: "Neutral",
      details: "Updated clinical criteria for gene therapies"
    }
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Market Intelligence</h1>
          <p className="text-gray-600 mt-2">
            Real-time strategic insights across therapeutic areas and market access landscape
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Badge className="bg-blue-100 text-blue-800">Live Data</Badge>
          <Button size="sm">
            <Eye className="w-4 h-4 mr-2" />
            Generate Report
          </Button>
        </div>
      </div>

      {/* Market Trend Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            <span>Therapeutic Market Trends</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {marketTrends.map((trend, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-full ${
                      trend.trend === 'up' ? 'bg-green-100' : 'bg-red-100'
                    }`}>
                      {trend.trend === 'up' ? 
                        <TrendingUp className="w-4 h-4 text-green-600" /> :
                        <TrendingDown className="w-4 h-4 text-red-600" />
                      }
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{trend.category}</h3>
                      <p className="text-sm text-gray-600">Market Value: {trend.value}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-lg font-bold ${
                      trend.trend === 'up' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {trend.change}
                    </div>
                    <div className="text-xs text-gray-500">YoY Growth</div>
                  </div>
                </div>
                <p className="text-sm text-gray-700 mb-3">{trend.insight}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">Confidence Score</span>
                  <div className="flex items-center space-x-2">
                    <Progress value={trend.confidence} className="w-24 h-2 progress-gradient-blue-purple [&>div]:bg-gradient-blue-purple" />
                    <span className="text-xs font-medium">{trend.confidence}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Competitive Intelligence & Payer Insights Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Competitive Intelligence */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Target className="w-5 h-5 text-purple-600" />
              <span>Competitive Intelligence</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {competitiveIntel.map((intel, index) => (
                <div key={index} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-900">{intel.competitor}</span>
                    <Badge className={
                      intel.impact === 'High' ? 'bg-red-100 text-red-800' :
                      intel.impact === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }>
                      {intel.impact} Impact
                    </Badge>
                  </div>
                  <div className="text-sm text-gray-600 mb-1">
                    <strong>{intel.action}</strong> • {intel.therapeutic} • {intel.timeframe}
                  </div>
                  <p className="text-xs text-gray-500">{intel.details}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Payer Landscape Monitor */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-orange-600" />
              <span>Payer Landscape Monitor</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {payerInsights.map((insight, index) => (
                <div key={index} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-900">{insight.payer}</span>
                    <div className="flex items-center space-x-2">
                      <Badge className={
                        insight.impact === 'Favorable' ? 'bg-green-100 text-green-800' :
                        insight.impact === 'Restrictive' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }>
                        {insight.impact}
                      </Badge>
                      <span className="text-xs text-gray-500">{insight.effective}</span>
                    </div>
                  </div>
                  <div className="text-sm text-gray-600 mb-1">
                    <strong>{insight.change}</strong> • {insight.category}
                  </div>
                  <p className="text-xs text-gray-500">{insight.details}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Strategic Recommendations */}
      <Card className="border-l-4 border-l-blue-500">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Zap className="w-5 h-5 text-blue-600" />
            <span>AI-Generated Strategic Recommendations</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                <div>
                  <h4 className="font-medium text-blue-900">Accelerate Oncology Portfolio Positioning</h4>
                  <p className="text-sm text-blue-700 mt-1">
                    Given the 23% growth in immunotherapy market and upcoming Pfizer competition, consider advancing launch timeline by 6-8 weeks and enhancing differentiation messaging around biomarker selection.
                  </p>
                  <div className="flex items-center space-x-2 mt-2">
                    <Badge className="bg-blue-100 text-blue-800 text-xs">High Priority</Badge>
                    <span className="text-xs text-blue-600">Confidence: 94%</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-green-50 rounded-lg">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-green-600 rounded-full mt-2"></div>
                <div>
                  <h4 className="font-medium text-green-900">Optimize Payer Strategy for Q1</h4>
                  <p className="text-sm text-green-700 mt-1">
                    UnitedHealth's favorable GLP-1 formulary changes create expansion opportunity. Recommend targeted outreach to endocrinology networks within their coverage areas.
                  </p>
                  <div className="flex items-center space-x-2 mt-2">
                    <Badge className="bg-green-100 text-green-800 text-xs">Medium Priority</Badge>
                    <span className="text-xs text-green-600">Confidence: 89%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}