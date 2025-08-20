import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useQuery } from "@tanstack/react-query";
import { 
  FileText, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Timer,
  DollarSign,
  TrendingUp,
  Activity,
  Users,
  Calendar,
  Target,
  Zap,
  BarChart3
} from "lucide-react";

interface MLRDashboard {
  overview: {
    reviewsProcessed: number;
    firstPassApprovalRate: number;
    averageReviewTime: number;
    timeSavedWeeks: number;
    costSavedThisMonth: number;
    complianceScore: number;
  };
  complianceTrend: Array<{
    week: string;
    score: number;
  }>;
  therapeuticAreas: Array<{
    area: string;
    reviews: number;
    approvalRate: number;
  }>;
}

export function MLRVisualization() {
  // Fetch MLR dashboard data
  const { data: mlrDashboard, isLoading } = useQuery<MLRDashboard>({
    queryKey: ["/api/emme-connect/mlr/dashboard"],
    refetchInterval: 30000 // Refresh every 30 seconds for real-time feel
  });

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <Card key={i}>
                <CardContent className="p-4">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!mlrDashboard) {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-600">MLR dashboard data not available.</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">EMME Connect MLR Analytics</h1>
          <p className="text-gray-600 mt-2">
            4-Hour pharmaceutical content review workflow vs traditional 3-week process
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Badge className="bg-green-100 text-green-800">Live Data</Badge>
          <Badge className="bg-blue-100 text-blue-800">Real-time Updates</Badge>
        </div>
      </div>

      {/* Hero Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Reviews This Month</p>
                <p className="text-3xl font-bold text-blue-600">{mlrDashboard.overview.reviewsProcessed}</p>
                <p className="text-xs text-gray-500 mt-1">+12% vs last month</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <FileText className="w-8 h-8 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">First-Pass Approval</p>
                <p className="text-3xl font-bold text-green-600">
                  {Math.round(mlrDashboard.overview.firstPassApprovalRate * 100)}%
                </p>
                <p className="text-xs text-gray-500 mt-1">Industry-leading rate</p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Average Review Time</p>
                <p className="text-3xl font-bold text-purple-600">{mlrDashboard.overview.averageReviewTime}h</p>
                <p className="text-xs text-gray-500 mt-1">vs 3 weeks manual</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-full">
                <Timer className="w-8 h-8 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-l-orange-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Time Saved This Month</p>
                <p className="text-3xl font-bold text-orange-600">{mlrDashboard.overview.timeSavedWeeks}</p>
                <p className="text-sm text-gray-600">weeks</p>
              </div>
              <div className="bg-orange-100 p-3 rounded-full">
                <Clock className="w-8 h-8 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ROI and Efficiency Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <DollarSign className="w-5 h-5 text-green-600" />
              <span>Cost Savings Analysis</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-4xl font-bold text-green-600 mb-2">
                  ${(mlrDashboard.overview.costSavedThisMonth / 1000).toFixed(0)}K
                </div>
                <p className="text-sm text-gray-600">Total Saved This Month</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-red-50 rounded">
                  <div className="text-lg font-bold text-red-600">$2,500</div>
                  <p className="text-xs text-gray-600">Traditional Cost/Review</p>
                </div>
                <div className="text-center p-3 bg-green-50 rounded">
                  <div className="text-lg font-bold text-green-600">$150</div>
                  <p className="text-xs text-gray-600">EMME Cost/Review</p>
                </div>
              </div>
              
              <div className="pt-3 border-t">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Cost per review saved:</span>
                  <span className="font-semibold text-green-600">
                    ${(mlrDashboard.overview.costSavedThisMonth / mlrDashboard.overview.reviewsProcessed).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-sm mt-1">
                  <span className="text-gray-600">ROI improvement:</span>
                  <span className="font-semibold text-green-600">94%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              <span>Compliance Score Trend</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-4xl font-bold text-blue-600 mb-2">
                  {Math.round(mlrDashboard.overview.complianceScore * 100)}%
                </div>
                <p className="text-sm text-gray-600">Current Compliance Score</p>
              </div>
              
              <div className="h-20 flex items-end space-x-1">
                {mlrDashboard.complianceTrend.map((week, index) => (
                  <div key={week.week} className="flex-1 flex flex-col items-center">
                    <div 
                      className="bg-blue-600 rounded-t w-full transition-all duration-500 hover:bg-blue-700"
                      style={{ height: `${week.score * 100}%` }}
                      title={`Week ${week.week}: ${Math.round(week.score * 100)}%`}
                    ></div>
                    <span className="text-xs text-gray-500 mt-1">{week.week}</span>
                  </div>
                ))}
              </div>
              
              <div className="pt-3 border-t text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Improvement trend:</span>
                  <span className="font-semibold text-green-600">+5.6% this month</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Therapeutic Areas Performance */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BarChart3 className="w-5 h-5 text-gray-600" />
            <span>Performance by Therapeutic Area</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mlrDashboard.therapeuticAreas.map((area, index) => (
              <div key={area.area} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${
                      index === 0 ? 'bg-blue-500' :
                      index === 1 ? 'bg-green-500' :
                      index === 2 ? 'bg-purple-500' :
                      index === 3 ? 'bg-orange-500' : 'bg-gray-500'
                    }`}></div>
                    <span className="font-medium text-gray-900">{area.area}</span>
                  </div>
                  <div className="flex items-center space-x-4 text-sm">
                    <span className="text-gray-600">{area.reviews} reviews</span>
                    <span className="font-semibold text-green-600">
                      {Math.round(area.approvalRate * 100)}% approved
                    </span>
                  </div>
                </div>
                <Progress value={area.approvalRate * 100} className="h-3" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Activity className="w-5 h-5 text-gray-600" />
              <span>Recent Activity</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 p-3 bg-green-50 rounded">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <div className="flex-1">
                  <p className="text-sm font-medium">MLR-2025-0156 approved</p>
                  <p className="text-xs text-gray-500">Oncology patient brochure • 2 hours ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-yellow-50 rounded">
                <AlertTriangle className="w-5 h-5 text-yellow-600" />
                <div className="flex-1">
                  <p className="text-sm font-medium">MLR-2025-0157 needs revision</p>
                  <p className="text-xs text-gray-500">Cardiology HCP detail aid • 3 hours ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded">
                <Clock className="w-5 h-5 text-blue-600" />
                <div className="flex-1">
                  <p className="text-sm font-medium">MLR-2025-0158 in review</p>
                  <p className="text-xs text-gray-500">Endocrinology website content • 4 hours ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Target className="w-5 h-5 text-gray-600" />
              <span>Key Performance Indicators</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <span className="text-sm text-gray-600">Avg. Time to First Review</span>
                <span className="font-semibold text-blue-600">1.2h</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <span className="text-sm text-gray-600">Customer Satisfaction</span>
                <span className="font-semibold text-green-600">4.8/5.0</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <span className="text-sm text-gray-600">Regulatory Compliance</span>
                <span className="font-semibold text-green-600">100%</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <span className="text-sm text-gray-600">Process Efficiency</span>
                <span className="font-semibold text-purple-600">89%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}