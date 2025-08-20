import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Brain, 
  Users, 
  Heart, 
  BarChart3, 
  TrendingUp, 
  Target,
  Shield,
  AlertTriangle,
  CheckCircle,
  Clock,
  Globe,
  UserCheck,
  RefreshCw,
  Download
} from "lucide-react";

interface EquityMetric {
  category: string;
  score: number;
  trend: "up" | "down" | "stable";
  priority: "high" | "medium" | "low";
  insights: string[];
}

interface LivedExperience {
  patientType: string;
  journey: string;
  painPoints: string[];
  opportunities: string[];
  satisfactionScore: number;
}

interface InsightEngineProps {
  projectData?: any;
}

export function InsightEngine({ projectData }: InsightEngineProps) {
  const [activeView, setActiveView] = useState("lived-experience");
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
      }, 3000);
    }
  }, [projectData, analysisComplete]);

  const equityMetrics: EquityMetric[] = [
    {
      category: "Access Barriers",
      score: 68,
      trend: "up",
      priority: "high",
      insights: [
        "Geographic access improved 12% in rural areas",
        "Financial barriers reduced through assistance programs",
        "Digital divide still affects 23% of target population"
      ]
    },
    {
      category: "Cultural Competency",
      score: 75,
      trend: "up", 
      priority: "medium",
      insights: [
        "Provider training completion rate at 89%",
        "Multi-language materials usage increased 45%",
        "Community liaison program showing positive results"
      ]
    },
    {
      category: "Social Determinants",
      score: 62,
      trend: "stable",
      priority: "high",
      insights: [
        "Housing instability affects 31% of patients",
        "Transportation barriers remain significant",
        "Food security programs showing impact"
      ]
    }
  ];

  const livedExperiences: LivedExperience[] = [
    {
      patientType: "Newly Diagnosed",
      journey: "Initial Treatment Phase",
      painPoints: [
        "Information overload during diagnosis",
        "Complex insurance authorization process",
        "Difficulty coordinating multiple appointments"
      ],
      opportunities: [
        "Simplified onboarding process",
        "Dedicated care coordinator",
        "Digital health tools integration"
      ],
      satisfactionScore: 72
    },
    {
      patientType: "Treatment Experienced",
      journey: "Long-term Management",
      painPoints: [
        "Side effect management challenges",
        "Treatment adherence difficulties",
        "Limited peer support options"
      ],
      opportunities: [
        "Enhanced symptom tracking",
        "Peer mentorship programs",
        "Personalized adherence solutions"
      ],
      satisfactionScore: 78
    }
  ];

  const handleNavigateToEngagement = () => {
    window.dispatchEvent(new CustomEvent('navigateToModule', { 
      detail: { moduleId: 'engagement-studio', projectData } 
    }));
  };

  return (
    <div className="space-y-6 p-6">
      {/* Project Context Alert */}
      {projectData && (
        <Alert className="border-l-4 border-l-blue-500 bg-blue-50">
          <Brain className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-800">
            <div className="flex items-center justify-between">
              <div>
                <strong>Project Context:</strong> {projectData.name} - {projectData.therapeuticArea} {projectData.projectType}
                {isAnalyzing && <span className="ml-2 text-sm">(Analyzing insights...)</span>}
                {analysisComplete && <span className="ml-2 text-sm text-green-600">✓ Analysis complete</span>}
              </div>
              {analysisComplete && (
                <Button size="sm" onClick={handleNavigateToEngagement} style={{ backgroundColor: '#9B7FB8' }}>
                  <Target className="w-3 h-3 mr-1" />
                  Continue to Engagement
                </Button>
              )}
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Insight Engine</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            AI-powered analysis of lived experiences and equity readiness
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh Analysis
          </Button>
          <Button style={{ backgroundColor: '#9B7FB8' }} size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export Insights
          </Button>
        </div>
      </div>

      <Tabs value={activeView} onValueChange={setActiveView} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="lived-experience" className="flex items-center gap-2">
            <Heart className="w-4 h-4" />
            Lived Experience
          </TabsTrigger>
          <TabsTrigger value="equity-readiness" className="flex items-center gap-2">
            <Shield className="w-4 h-4" />
            Equity Readiness
          </TabsTrigger>
          <TabsTrigger value="insights" className="flex items-center gap-2">
            <Brain className="w-4 h-4" />
            AI Insights
          </TabsTrigger>
        </TabsList>

        <TabsContent value="lived-experience" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {livedExperiences.map((experience, index) => (
              <Card key={index} className="p-6">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center justify-between">
                    <span>{experience.patientType}</span>
                    <Badge variant="secondary">{experience.satisfactionScore}% Satisfaction</Badge>
                  </CardTitle>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{experience.journey}</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-red-700 dark:text-red-400 mb-2 flex items-center">
                        <AlertTriangle className="w-4 h-4 mr-2" />
                        Pain Points
                      </h4>
                      <ul className="space-y-1">
                        {experience.painPoints.map((point, idx) => (
                          <li key={idx} className="text-sm text-gray-600 dark:text-gray-300 ml-4">
                            • {point}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <Separator />
                    <div>
                      <h4 className="font-medium text-green-700 dark:text-green-400 mb-2 flex items-center">
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Opportunities
                      </h4>
                      <ul className="space-y-1">
                        {experience.opportunities.map((opportunity, idx) => (
                          <li key={idx} className="text-sm text-gray-600 dark:text-gray-300 ml-4">
                            • {opportunity}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="equity-readiness" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {equityMetrics.map((metric, index) => (
              <Card key={index} className="p-6">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center justify-between">
                    <span className="text-lg">{metric.category}</span>
                    <Badge 
                      variant={metric.priority === 'high' ? 'destructive' : metric.priority === 'medium' ? 'default' : 'secondary'}
                    >
                      {metric.priority} priority
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold">{metric.score}%</span>
                      <div className="flex items-center">
                        {metric.trend === 'up' ? (
                          <TrendingUp className="w-5 h-5 text-green-600" />
                        ) : metric.trend === 'down' ? (
                          <TrendingUp className="w-5 h-5 text-red-600 rotate-180" />
                        ) : (
                          <div className="w-5 h-5 border-2 border-gray-400 rounded-full" />
                        )}
                      </div>
                    </div>
                    <Progress value={metric.score} className="w-full" />
                    <div>
                      <h4 className="font-medium mb-2">Key Insights:</h4>
                      <ul className="space-y-1">
                        {metric.insights.map((insight, idx) => (
                          <li key={idx} className="text-sm text-gray-600 dark:text-gray-300">
                            • {insight}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="insights" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Brain className="w-5 h-5 mr-2 text-blue-600" />
                  Predictive Analytics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <h4 className="font-medium text-blue-800 dark:text-blue-300">Market Expansion Opportunity</h4>
                    <p className="text-sm text-blue-700 dark:text-blue-400 mt-1">
                      AI identifies 34% increase potential in underserved Hispanic communities through targeted cultural competency programs
                    </p>
                  </div>
                  <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <h4 className="font-medium text-green-800 dark:text-green-300">Retention Risk Alert</h4>
                    <p className="text-sm text-green-700 dark:text-green-400 mt-1">
                      Early warning system identifies 127 patients at high risk of treatment discontinuation
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="p-6">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Target className="w-5 h-5 mr-2 text-purple-600" />
                  Engagement Optimization
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Digital Engagement</span>
                    <span className="text-sm text-gray-600">+23%</span>
                  </div>
                  <Progress value={78} className="w-full" />
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">HCP Satisfaction</span>
                    <span className="text-sm text-gray-600">+15%</span>
                  </div>
                  <Progress value={85} className="w-full" />

                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Patient Outcomes</span>
                    <span className="text-sm text-gray-600">+18%</span>
                  </div>
                  <Progress value={82} className="w-full" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}