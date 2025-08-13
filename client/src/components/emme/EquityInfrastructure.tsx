import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Shield, 
  Heart, 
  MapPin, 
  Users, 
  BarChart3, 
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  DollarSign,
  Globe,
  Home,
  GraduationCap,
  Car,
  Utensils,
  Stethoscope,
  Building
} from "lucide-react";

interface SDOHIndicator {
  category: string;
  icon: React.ReactNode;
  score: number;
  trend: "improving" | "stable" | "declining";
  impactLevel: "high" | "medium" | "low";
  description: string;
  recommendations: string[];
}

interface EquityMetric {
  metric: string;
  current: number;
  target: number;
  change: number;
  timeframe: string;
}

interface ImpactMeasurement {
  category: string;
  baseline: number;
  current: number;
  target: number;
  improvement: number;
  interventions: string[];
}

interface EquityInfrastructureProps {
  projectData?: any;
}

export function EquityInfrastructure({ projectData }: EquityInfrastructureProps) {
  const [activeTab, setActiveTab] = useState("sdoh");
  const [selectedRegion, setSelectedRegion] = useState("all");

  const sdohIndicators: SDOHIndicator[] = [
    {
      category: "Housing Stability",
      icon: <Home className="w-5 h-5" />,
      score: 68,
      trend: "improving",
      impactLevel: "high",
      description: "Housing instability affects medication adherence and appointment attendance",
      recommendations: [
        "Partner with housing assistance programs",
        "Mobile health services for unstable housing situations",
        "Transportation vouchers for medical appointments"
      ]
    },
    {
      category: "Education Access",
      icon: <GraduationCap className="w-5 h-5" />,
      score: 74,
      trend: "stable",
      impactLevel: "medium",
      description: "Health literacy impacts treatment understanding and compliance",
      recommendations: [
        "Develop health literacy-appropriate materials",
        "Implement teach-back methods",
        "Multi-language educational resources"
      ]
    },
    {
      category: "Transportation",
      icon: <Car className="w-5 h-5" />,
      score: 61,
      trend: "declining",
      impactLevel: "high",
      description: "Transportation barriers lead to missed appointments and poor outcomes",
      recommendations: [
        "Telemedicine expansion",
        "Transportation voucher programs",
        "Mobile clinic services"
      ]
    },
    {
      category: "Food Security",
      icon: <Utensils className="w-5 h-5" />,
      score: 72,
      trend: "improving",
      impactLevel: "medium",
      description: "Food insecurity affects medication timing and nutritional health",
      recommendations: [
        "Partner with food banks",
        "Nutrition counseling programs",
        "Food prescription programs"
      ]
    },
    {
      category: "Healthcare Access",
      icon: <Stethoscope className="w-5 h-5" />,
      score: 79,
      trend: "improving",
      impactLevel: "high",
      description: "Geographic and financial barriers to healthcare services",
      recommendations: [
        "Expand clinic locations",
        "Sliding fee scales",
        "Community health worker programs"
      ]
    }
  ];

  const equityMetrics: EquityMetric[] = [
    { metric: "Treatment Access Equity", current: 73, target: 85, change: +5, timeframe: "YTD" },
    { metric: "Cultural Competency Score", current: 81, target: 90, change: +8, timeframe: "YTD" },
    { metric: "Language Accessibility", current: 69, target: 80, change: +12, timeframe: "YTD" },
    { metric: "Geographic Coverage", current: 76, target: 85, change: +3, timeframe: "YTD" },
    { metric: "Socioeconomic Inclusion", current: 71, target: 80, change: +6, timeframe: "YTD" }
  ];

  const impactMeasurements: ImpactMeasurement[] = [
    {
      category: "Patient Outcomes",
      baseline: 65,
      current: 78,
      target: 85,
      improvement: 20,
      interventions: [
        "Culturally tailored education materials",
        "Community health navigator program",
        "Peer support groups"
      ]
    },
    {
      category: "Access Barriers",
      baseline: 45,
      current: 68,
      target: 80,
      improvement: 51,
      interventions: [
        "Transportation assistance program",
        "Extended clinic hours",
        "Telemedicine services"
      ]
    },
    {
      category: "Health Literacy",
      baseline: 58,
      current: 72,
      target: 80,
      improvement: 24,
      interventions: [
        "Plain language materials",
        "Visual education tools",
        "Health literacy training for staff"
      ]
    }
  ];

  const getTrendIcon = (trend: SDOHIndicator["trend"]) => {
    switch (trend) {
      case "improving":
        return <TrendingUp className="w-4 h-4 text-green-600" />;
      case "declining":
        return <TrendingUp className="w-4 h-4 text-red-600 rotate-180" />;
      case "stable":
        return <div className="w-4 h-4 border-2 border-gray-400 rounded-full" />;
    }
  };

  const getImpactColor = (level: SDOHIndicator["impactLevel"]) => {
    switch (level) {
      case "high": return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300";
      case "medium": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300";
      case "low": return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Equity Infrastructure</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Social determinants of health monitoring and impact measurement
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Select value={selectedRegion} onValueChange={setSelectedRegion}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select region" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Regions</SelectItem>
              <SelectItem value="northeast">Northeast</SelectItem>
              <SelectItem value="southeast">Southeast</SelectItem>
              <SelectItem value="midwest">Midwest</SelectItem>
              <SelectItem value="southwest">Southwest</SelectItem>
              <SelectItem value="west">West</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm">
            <BarChart3 className="w-4 h-4 mr-2" />
            Generate Report
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Equity Score</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">74.2</p>
              <p className="text-sm text-green-600">+4.8% vs last quarter</p>
            </div>
            <Shield className="w-8 h-8 text-blue-600" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Communities Served</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">247</p>
              <p className="text-sm text-green-600">+23 new communities</p>
            </div>
            <MapPin className="w-8 h-8 text-green-600" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Impact Interventions</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">34</p>
              <p className="text-sm text-blue-600">12 high-impact</p>
            </div>
            <Heart className="w-8 h-8 text-red-600" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">ROI on Equity</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">4.2x</p>
              <p className="text-sm text-green-600">Above industry avg</p>
            </div>
            <DollarSign className="w-8 h-8 text-purple-600" />
          </div>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="sdoh" className="flex items-center gap-2">
            <Home className="w-4 h-4" />
            SDOH Monitoring
          </TabsTrigger>
          <TabsTrigger value="equity" className="flex items-center gap-2">
            <Shield className="w-4 h-4" />
            Equity Metrics
          </TabsTrigger>
          <TabsTrigger value="impact" className="flex items-center gap-2">
            <Heart className="w-4 h-4" />
            Impact Measurement
          </TabsTrigger>
        </TabsList>

        <TabsContent value="sdoh" className="space-y-6">
          <div className="grid gap-6">
            {sdohIndicators.map((indicator, index) => (
              <Card key={index} className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                      {indicator.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold">{indicator.category}</h3>
                        <Badge className={getImpactColor(indicator.impactLevel)}>
                          {indicator.impactLevel} impact
                        </Badge>
                        {getTrendIcon(indicator.trend)}
                      </div>
                      <p className="text-gray-600 dark:text-gray-300 mb-4">{indicator.description}</p>
                      
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Current Score</span>
                          <span className="text-lg font-bold">{indicator.score}%</span>
                        </div>
                        <Progress value={indicator.score} className="w-full" />
                        
                        <div>
                          <h4 className="font-medium mb-2">Recommended Actions:</h4>
                          <ul className="space-y-1">
                            {indicator.recommendations.map((rec, idx) => (
                              <li key={idx} className="text-sm text-gray-600 dark:text-gray-300 ml-4">
                                • {rec}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                  <Button variant="outline">
                    View Details
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="equity" className="space-y-6">
          <div className="grid gap-4">
            {equityMetrics.map((metric, index) => (
              <Card key={index} className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-semibold">{metric.metric}</h3>
                      <div className="flex items-center space-x-2">
                        <Badge variant={metric.change > 0 ? "default" : "destructive"}>
                          {metric.change > 0 ? "+" : ""}{metric.change}% {metric.timeframe}
                        </Badge>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Current: {metric.current}%</span>
                        <span>Target: {metric.target}%</span>
                      </div>
                      <Progress value={metric.current} className="w-full" />
                      <div className="text-xs text-gray-500">
                        {metric.current >= metric.target ? (
                          <span className="text-green-600 flex items-center">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Target achieved
                          </span>
                        ) : (
                          <span>
                            {metric.target - metric.current}% to target
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="impact" className="space-y-6">
          <div className="grid gap-6">
            {impactMeasurements.map((measurement, index) => (
              <Card key={index} className="p-6">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center justify-between">
                    <span>{measurement.category}</span>
                    <Badge variant="default">
                      {measurement.improvement}% improvement
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div className="text-center">
                      <p className="text-sm text-gray-600 dark:text-gray-300">Baseline</p>
                      <p className="text-2xl font-bold text-gray-500">{measurement.baseline}%</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-600 dark:text-gray-300">Current</p>
                      <p className="text-2xl font-bold text-blue-600">{measurement.current}%</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-600 dark:text-gray-300">Target</p>
                      <p className="text-2xl font-bold text-green-600">{measurement.target}%</p>
                    </div>
                  </div>
                  
                  <Progress 
                    value={(measurement.current / measurement.target) * 100} 
                    className="w-full mb-4" 
                  />
                  
                  <div>
                    <h4 className="font-medium mb-2">Key Interventions:</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                      {measurement.interventions.map((intervention, idx) => (
                        <div key={idx} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                          <p className="text-sm">{intervention}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}