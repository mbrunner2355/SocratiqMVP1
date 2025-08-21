import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { 
  Shield, 
  Heart, 
  Users, 
  TrendingUp, 
  FileText, 
  Brain, 
  Target,
  Activity,
  Clock,
  BarChart3,
  Eye,
  Download,
  Share2,
  MessageSquare,
  Zap
} from 'lucide-react';

export function EMMEDataSourcesDashboard() {
  // Fetch real pharmaceutical data from EMME
  const { data: payerIntelligence } = useQuery({
    queryKey: ['/api/emme/payer-intelligence'],
  });

  const { data: patientPrograms } = useQuery({
    queryKey: ['/api/emme/patient-programs'],
  });

  const { data: contentAssets } = useQuery({
    queryKey: ['/api/emme/content-assets'],
  });

  const { data: contentOptimization } = useQuery({
    queryKey: ['/api/emme/content-optimization'],
  });

  const { data: therapeuticAreas } = useQuery({
    queryKey: ['/api/emme/therapeutic-areas'],
  });

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">EMME Data Sources</h1>
          <p className="text-gray-600 mt-1">Real pharmaceutical intelligence and strategic data</p>
        </div>
        <Button className="bg-purple-600 hover:bg-purple-700">
          <Brain className="w-4 h-4 mr-2" />
          Run AI Analysis
        </Button>
      </div>

      {/* Payer Intelligence Dashboard */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Shield className="w-5 h-5 text-blue-600" />
          <h2 className="text-xl font-semibold text-gray-900">Payer Intelligence Dashboard</h2>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {payerIntelligence?.map((payer: any) => (
            <Card key={payer.payer} className="border-blue-200">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{payer.payer}</CardTitle>
                  <Badge className="bg-green-100 text-green-800">
                    {payer.marketAccessFavorability}% Favorability Score
                  </Badge>
                </div>
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <span className="flex items-center">
                    <Users className="w-4 h-4 mr-1" />
                    {(payer.lives / 1000000).toFixed(1)}M lives
                  </span>
                  <span className="flex items-center">
                    <Activity className="w-4 h-4 mr-1" />
                    {payer.recentChanges} recent changes
                  </span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Market Access Favorability</span>
                    <span className="text-sm text-gray-600">{payer.marketAccessFavorability}%</span>
                  </div>
                  <Progress value={payer.marketAccessFavorability} className="h-2" />
                </div>

                <div>
                  <span className="text-sm font-medium text-gray-700">Recent Policy Updates</span>
                  <ul className="mt-2 space-y-1">
                    {payer.recentPolicyUpdates?.slice(0, 2).map((update: string, index: number) => (
                      <li key={index} className="text-xs text-gray-600 flex items-start">
                        <span className="w-1.5 h-1.5 bg-purple-400 rounded-full mt-1.5 mr-2 flex-shrink-0"></span>
                        {update}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-blue-50 p-3 rounded-lg">
                  <span className="text-xs font-medium text-blue-800">Strategic Assessment</span>
                  <p className="text-xs text-blue-700 mt-1">{payer.strategicAssessment}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Separator />

      {/* Patient Programs */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Heart className="w-5 h-5 text-pink-600" />
            <h2 className="text-xl font-semibold text-gray-900">Patient Program Performance</h2>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm">
              <Eye className="w-4 h-4 mr-2" />
              View Patients
            </Button>
            <Button variant="outline" size="sm">
              <BarChart3 className="w-4 h-4 mr-2" />
              Analytics
            </Button>
          </div>
        </div>
        
        <div className="space-y-4">
          {patientPrograms?.map((program: any) => (
            <Card key={program.id} className="border-pink-200">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg flex items-center">
                      <Heart className="w-5 h-5 mr-2 text-pink-600" />
                      {program.name}
                    </CardTitle>
                    <div className="flex items-center space-x-4 text-sm text-gray-600 mt-2">
                      <Badge variant="outline">{program.therapeuticArea}</Badge>
                      <span>Launched {program.launchDate}</span>
                      <Badge className={
                        program.status === 'active' ? 'bg-green-100 text-green-800' :
                        program.status === 'pilot' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-blue-100 text-blue-800'
                      }>
                        {program.status}
                      </Badge>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-900">
                      {program.enrollment.current.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-600">Enrolled Patients</div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-lg font-bold text-gray-900">{program.enrollment.progress}%</div>
                    <div className="text-xs text-gray-600">Target Progress</div>
                    <Progress value={program.enrollment.progress} className="h-1 mt-1" />
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-gray-900">{program.performance.adherence}%</div>
                    <div className="text-xs text-gray-600">Adherence</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-gray-900">{program.performance.completion}%</div>
                    <div className="text-xs text-gray-600">Completion</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-gray-900">{program.performance.satisfaction}</div>
                    <div className="text-xs text-gray-600">Satisfaction</div>
                  </div>
                </div>

                <div>
                  <span className="text-sm font-medium text-gray-700">Clinical Outcomes</span>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-2">
                    {program.clinicalOutcomes?.map((outcome: any, index: number) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <span className="text-xs text-gray-600">{outcome.metric}</span>
                        <div className="flex items-center space-x-1">
                          <span className="text-xs font-medium">{outcome.value}</span>
                          <TrendingUp className={`w-3 h-3 ${
                            outcome.trend === 'up' ? 'text-green-600' :
                            outcome.trend === 'down' ? 'text-red-600' :
                            'text-gray-600'
                          }`} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="text-sm font-medium text-gray-700">Services Provided</span>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {program.services?.map((service: string) => (
                      <Badge key={service} variant="secondary" className="text-xs">
                        {service}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Separator />

      {/* Content Optimization */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <FileText className="w-5 h-5 text-purple-600" />
            <h2 className="text-xl font-semibold text-gray-900">Content Optimization</h2>
          </div>
          <Button className="bg-purple-600 hover:bg-purple-700" size="sm">
            <Zap className="w-4 h-4 mr-2" />
            Run AI Analysis
          </Button>
        </div>

        {contentOptimization && (
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-6">
            <Card>
              <CardContent className="p-4 text-center">
                <FileText className="w-8 h-8 mx-auto mb-2 text-purple-600" />
                <div className="text-2xl font-bold text-gray-900">{contentOptimization.totalAssets}</div>
                <div className="text-xs text-gray-600">Total Assets</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <Zap className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                <div className="text-2xl font-bold text-gray-900">{contentOptimization.activeOptimizations}</div>
                <div className="text-xs text-gray-600">Active Optimizations</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <Target className="w-8 h-8 mx-auto mb-2 text-green-600" />
                <div className="text-2xl font-bold text-gray-900">{contentOptimization.completed}</div>
                <div className="text-xs text-gray-600">Completed</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <TrendingUp className="w-8 h-8 mx-auto mb-2 text-orange-600" />
                <div className="text-2xl font-bold text-gray-900">{contentOptimization.avgImprovement}</div>
                <div className="text-xs text-gray-600">Avg Improvement</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <BarChart3 className="w-8 h-8 mx-auto mb-2 text-red-600" />
                <div className="text-2xl font-bold text-gray-900">{contentOptimization.costSavings}</div>
                <div className="text-xs text-gray-600">Cost Savings</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <Clock className="w-8 h-8 mx-auto mb-2 text-gray-600" />
                <div className="text-2xl font-bold text-gray-900">{contentOptimization.avgTime}</div>
                <div className="text-xs text-gray-600">Avg Time</div>
              </CardContent>
            </Card>
          </div>
        )}

        <div className="space-y-4">
          {contentAssets?.map((asset: any) => (
            <Card key={asset.id} className="border-purple-200">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">{asset.title}</CardTitle>
                    <div className="flex items-center space-x-4 text-sm text-gray-600 mt-2">
                      <Badge variant="outline">{asset.type}</Badge>
                      <Badge variant="outline">{asset.therapeuticArea}</Badge>
                      <Badge variant="outline">{asset.audience}</Badge>
                      <Badge className={
                        asset.status === 'high_performing' ? 'bg-green-100 text-green-800' :
                        asset.status === 'optimizing' ? 'bg-purple-100 text-purple-800' :
                        'bg-yellow-100 text-yellow-800'
                      }>
                        {asset.status === 'high_performing' ? 'High Performing' :
                         asset.status === 'optimizing' ? 'Optimizing' : 'Needs Review'}
                      </Badge>
                    </div>
                  </div>
                  <div className="text-right text-xs text-gray-600">
                    Last Updated: {asset.lastUpdated}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-4 gap-4">
                  <div>
                    <div className="text-sm font-medium text-gray-700">Engagement</div>
                    <div className="flex items-center space-x-2 mt-1">
                      <Progress value={asset.performanceScore.engagement} className="h-2 flex-1" />
                      <span className="text-xs text-gray-600">{asset.performanceScore.engagement}%</span>
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-700">Conversion</div>
                    <div className="flex items-center space-x-2 mt-1">
                      <Progress value={asset.performanceScore.conversion} className="h-2 flex-1" />
                      <span className="text-xs text-gray-600">{asset.performanceScore.conversion}%</span>
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-700">Sentiment</div>
                    <div className="flex items-center space-x-2 mt-1">
                      <Progress value={asset.performanceScore.sentiment} className="h-2 flex-1" />
                      <span className="text-xs text-gray-600">{asset.performanceScore.sentiment}%</span>
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-700">Accessibility</div>
                    <div className="flex items-center space-x-2 mt-1">
                      <Progress value={asset.performanceScore.accessibility} className="h-2 flex-1" />
                      <span className="text-xs text-gray-600">{asset.performanceScore.accessibility}%</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-4 text-center">
                  <div className="flex items-center justify-center space-x-1">
                    <Eye className="w-4 h-4 text-gray-400" />
                    <span className="text-sm font-medium">{asset.usageMetrics.views.toLocaleString()}</span>
                    <span className="text-xs text-gray-600">Views</span>
                  </div>
                  <div className="flex items-center justify-center space-x-1">
                    <Download className="w-4 h-4 text-gray-400" />
                    <span className="text-sm font-medium">{asset.usageMetrics.downloads.toLocaleString()}</span>
                    <span className="text-xs text-gray-600">Downloads</span>
                  </div>
                  <div className="flex items-center justify-center space-x-1">
                    <Share2 className="w-4 h-4 text-gray-400" />
                    <span className="text-sm font-medium">{asset.usageMetrics.shares.toLocaleString()}</span>
                    <span className="text-xs text-gray-600">Shares</span>
                  </div>
                  <div className="flex items-center justify-center space-x-1">
                    <MessageSquare className="w-4 h-4 text-gray-400" />
                    <span className="text-sm font-medium">{asset.usageMetrics.feedback}</span>
                    <span className="text-xs text-gray-600">Feedback</span>
                  </div>
                </div>

                <div>
                  <span className="text-sm font-medium text-gray-700">AI Insights</span>
                  <ul className="mt-2 space-y-1">
                    {asset.aiInsights?.map((insight: string, index: number) => (
                      <li key={index} className="text-xs text-gray-600 flex items-start">
                        <Brain className="w-3 h-3 text-purple-500 mt-0.5 mr-2 flex-shrink-0" />
                        {insight}
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Separator />

      {/* Performance by Therapeutic Area */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <BarChart3 className="w-5 h-5 text-green-600" />
          <h2 className="text-xl font-semibold text-gray-900">Performance by Therapeutic Area</h2>
        </div>
        
        <div className="space-y-3">
          {therapeuticAreas?.map((area: any) => (
            <Card key={area.id} className="border-green-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <span className="font-medium text-gray-900">{area.name}</span>
                      <Badge variant="outline" className="text-xs">
                        {area.performanceMetrics.reviews} reviews
                      </Badge>
                      <Badge className="bg-green-100 text-green-800 text-xs">
                        {area.performanceMetrics.approvalRate}% approved
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-4 mt-2">
                      <Progress value={area.performanceMetrics.approvalRate} className="h-2 flex-1 max-w-md" />
                      <span className="text-xs text-gray-600">
                        Avg Review Time: {area.performanceMetrics.avgTimeToFirstReview}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}