import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  FileText, 
  TrendingUp,
  Target,
  Brain,
  BarChart3,
  CheckCircle,
  AlertTriangle,
  Eye,
  MessageSquare,
  Share2,
  Clock
} from "lucide-react";

export function ContentOptimization() {
  const contentAssets = [
    {
      id: "CA-2025-0847",
      title: "Diabetes Patient Education Brochure",
      type: "Patient Education",
      therapeuticArea: "Endocrinology",
      status: "optimizing",
      performance: {
        engagement: 76,
        conversion: 23,
        sentiment: 89,
        accessibility: 92
      },
      metrics: {
        views: "12,847",
        downloads: "2,934",
        shares: "847",
        feedback: "4.7/5"
      },
      insights: [
        "Cultural adaptation needed for Hispanic audience",
        "Medical terminology simplification recommended",
        "Visual accessibility improvements suggested"
      ],
      lastUpdated: "2 hours ago"
    },
    {
      id: "CA-2025-0846",
      title: "Oncology HCP Clinical Data Summary",
      type: "HCP Education", 
      therapeuticArea: "Oncology",
      status: "high-performing",
      performance: {
        engagement: 94,
        conversion: 67,
        sentiment: 92,
        accessibility: 87
      },
      metrics: {
        views: "8,234",
        downloads: "5,921",
        shares: "1,247",
        feedback: "4.9/5"
      },
      insights: [
        "Excellent clinical data presentation",
        "Strong peer engagement metrics",
        "Consider multilingual version for global audience"
      ],
      lastUpdated: "4 hours ago"
    },
    {
      id: "CA-2025-0845",
      title: "Payer Value Proposition Deck",
      type: "Market Access",
      therapeuticArea: "Cardiology",
      status: "needs-improvement",
      performance: {
        engagement: 54,
        conversion: 18,
        sentiment: 71,
        accessibility: 83
      },
      metrics: {
        views: "3,247",
        downloads: "587",
        shares: "124",
        feedback: "3.8/5"
      },
      insights: [
        "Economic evidence needs strengthening",
        "Real-world outcomes data gaps identified",
        "Comparative effectiveness messaging unclear"
      ],
      lastUpdated: "6 hours ago"
    }
  ];

  const optimizationRecommendations = [
    {
      category: "Cultural Adaptation",
      priority: "high",
      impact: "25% engagement increase",
      description: "Adapt visual elements and messaging for Hispanic/Latino audiences",
      assetCount: 23,
      timeframe: "2-3 weeks"
    },
    {
      category: "Medical Language Simplification", 
      priority: "medium",
      impact: "18% comprehension improvement",
      description: "Reduce medical jargon and improve readability scores",
      assetCount: 47,
      timeframe: "3-4 weeks"
    },
    {
      category: "Accessibility Enhancement",
      priority: "high", 
      impact: "15% broader reach",
      description: "Improve color contrast, alt text, and screen reader compatibility",
      assetCount: 156,
      timeframe: "4-6 weeks"
    },
    {
      category: "Interactive Content",
      priority: "low",
      impact: "35% engagement boost",
      description: "Convert static PDFs to interactive digital experiences",
      assetCount: 89,
      timeframe: "8-12 weeks"
    }
  ];

  const performanceMetrics = {
    totalAssets: 1247,
    activeOptimizations: 89,
    completedOptimizations: 234,
    avgPerformanceImprovement: 28,
    costSavings: "$2.4M",
    timeToOptimization: "3.2 weeks"
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "high-performing": return "bg-green-100 text-green-800";
      case "optimizing": return "bg-purple-100 text-purple-800";
      case "needs-improvement": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "high-performing": return <CheckCircle className="w-4 h-4" />;
      case "optimizing": return <Brain className="w-4 h-4" />;
      case "needs-improvement": return <AlertTriangle className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Content Optimization</h1>
          <p className="text-gray-600 mt-2">
            AI-powered content performance analysis and optimization recommendations
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button size="sm" className="bg-purple-600 hover:bg-purple-700 text-white">
            <Brain className="w-4 h-4 mr-2" />
            Run AI Analysis
          </Button>
          <Button variant="outline" size="sm">
            <FileText className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Performance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <FileText className="w-6 h-6 text-purple-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">{performanceMetrics.totalAssets}</div>
            <p className="text-sm text-gray-600">Total Assets</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Brain className="w-6 h-6 text-purple-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">{performanceMetrics.activeOptimizations}</div>
            <p className="text-sm text-gray-600">Active Optimizations</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <CheckCircle className="w-6 h-6 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">{performanceMetrics.completedOptimizations}</div>
            <p className="text-sm text-gray-600">Completed</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <TrendingUp className="w-6 h-6 text-orange-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">{performanceMetrics.avgPerformanceImprovement}%</div>
            <p className="text-sm text-gray-600">Avg Improvement</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Target className="w-6 h-6 text-red-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">{performanceMetrics.costSavings}</div>
            <p className="text-sm text-gray-600">Cost Savings</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Clock className="w-6 h-6 text-indigo-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">{performanceMetrics.timeToOptimization}</div>
            <p className="text-sm text-gray-600">Avg Time</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="assets" className="space-y-6">
        <TabsList>
          <TabsTrigger value="assets">Content Assets</TabsTrigger>
          <TabsTrigger value="recommendations">Optimization Recommendations</TabsTrigger>
          <TabsTrigger value="analytics">Performance Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="assets" className="space-y-4">
          {contentAssets.map((asset, index) => (
            <Card key={index}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-100 rounded-full text-blue-600">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{asset.title}</CardTitle>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <span>{asset.type}</span>
                        <span>•</span>
                        <span>{asset.therapeuticArea}</span>
                        <span>•</span>
                        <span>{asset.id}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={getStatusColor(asset.status)}>
                      {getStatusIcon(asset.status)}
                      <span className="ml-1">{asset.status.replace('-', ' ')}</span>
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Performance Metrics */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Performance Score</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Engagement</span>
                        <span className="text-sm font-medium">{asset.performance.engagement}%</span>
                      </div>
                      <Progress value={asset.performance.engagement} className="h-2 progress-gradient-blue-purple [&>div]:bg-gradient-blue-purple" />
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Conversion</span>
                        <span className="text-sm font-medium">{asset.performance.conversion}%</span>
                      </div>
                      <Progress value={asset.performance.conversion} className="h-2 progress-gradient-purple-blue [&>div]:bg-gradient-purple-blue" />
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Sentiment</span>
                        <span className="text-sm font-medium">{asset.performance.sentiment}%</span>
                      </div>
                      <Progress value={asset.performance.sentiment} className="h-2 progress-gradient-blue-purple [&>div]:bg-gradient-blue-purple" />
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Accessibility</span>
                        <span className="text-sm font-medium">{asset.performance.accessibility}%</span>
                      </div>
                      <Progress value={asset.performance.accessibility} className="h-2 progress-gradient-purple-blue [&>div]:bg-gradient-purple-blue" />
                    </div>
                  </div>

                  {/* Usage Metrics */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Usage Metrics</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Eye className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-600">Views</span>
                        </div>
                        <span className="font-medium">{asset.metrics.views}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <FileText className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-600">Downloads</span>
                        </div>
                        <span className="font-medium">{asset.metrics.downloads}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Share2 className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-600">Shares</span>
                        </div>
                        <span className="font-medium">{asset.metrics.shares}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <MessageSquare className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-600">Feedback</span>
                        </div>
                        <span className="font-medium">{asset.metrics.feedback}</span>
                      </div>
                    </div>
                  </div>

                  {/* AI Insights */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">AI Insights</h4>
                    <div className="space-y-2">
                      {asset.insights.map((insight, insightIndex) => (
                        <div key={insightIndex} className="flex items-start space-x-2 text-sm">
                          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-gray-600">{insight}</span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 pt-3 border-t">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">Last Updated:</span>
                        <span className="font-medium">{asset.lastUpdated}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-4">
          {optimizationRecommendations.map((rec, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">{rec.category}</h3>
                  <div className="flex items-center space-x-2">
                    <Badge className={rec.priority === 'high' ? 'bg-red-100 text-red-800' : rec.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}>
                      {rec.priority} priority
                    </Badge>
                    <Badge className="bg-blue-100 text-blue-800">
                      {rec.impact}
                    </Badge>
                  </div>
                </div>
                <p className="text-gray-600 mb-4">{rec.description}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span>{rec.assetCount} assets affected</span>
                    <span>•</span>
                    <span>{rec.timeframe} estimated</span>
                  </div>
                  <Button size="sm">
                    Start Optimization
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="analytics">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Content Performance Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500">Performance analytics visualization</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Optimization ROI</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500">ROI metrics visualization</p>
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