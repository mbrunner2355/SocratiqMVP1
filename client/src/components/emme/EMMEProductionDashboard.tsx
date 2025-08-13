import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Brain, 
  Target, 
  Users, 
  TrendingUp, 
  Heart, 
  Activity,
  BarChart3,
  FileText,
  Shield,
  Zap,
  Globe,
  ArrowUpRight,
  CheckCircle,
  AlertTriangle,
  Clock,
  Sparkles
} from 'lucide-react';

interface PharmaceuticalMetrics {
  launchSuccess: number;
  marketPenetration: number;
  timeToMarket: string;
  costReduction: number;
  roi: number;
}

interface MarketIntelligence {
  therapeuticArea: string;
  competitiveIntensity: number;
  marketSize: string;
  regulatoryRisk: 'low' | 'medium' | 'high';
  opportunities: string[];
  threats: string[];
}

interface ProjectData {
  name: string;
  status: string;
  progress: number;
  therapeuticArea: string;
}

export function EMMEProductionDashboard() {
  const [activeTab, setActiveTab] = useState('overview');

  const { data: pharmaceuticalMetrics } = useQuery({
    queryKey: ['/api/emme/pharmaceutical-metrics'],
  });

  const { data: marketIntelligence } = useQuery({
    queryKey: ['/api/emme/market-intelligence'],
  });

  const { data: activeProjects } = useQuery({
    queryKey: ['/api/emme/active-projects'],
  });

  const { data: payerLandscape } = useQuery({
    queryKey: ['/api/emme/payer-landscape'],
  });

  const metrics: PharmaceuticalMetrics = pharmaceuticalMetrics || {
    launchSuccess: 89,
    marketPenetration: 34,
    timeToMarket: '18 months',
    costReduction: 55,
    roi: 340
  };

  const marketData: MarketIntelligence[] = marketIntelligence || [
    {
      therapeuticArea: "Women's Health",
      competitiveIntensity: 6,
      marketSize: '$12.8B',
      regulatoryRisk: 'medium' as const,
      opportunities: ['VMS treatment gap', 'Post-menopausal market expansion', 'Digital health integration'],
      threats: ['Generic competition', 'Regulatory delays', 'Payer scrutiny']
    },
    {
      therapeuticArea: 'Oncology',
      competitiveIntensity: 9,
      marketSize: '$186.2B',
      regulatoryRisk: 'high' as const,
      opportunities: ['Precision medicine', 'Combination therapies', 'Rare cancer indications'],
      threats: ['High development costs', 'FDA approval challenges', 'Biosimilar threats']
    }
  ];

  const projects: ProjectData[] = activeProjects || [
    { name: 'Elinzanetant VMS Launch', status: 'active', progress: 78, therapeuticArea: "Women's Health" },
    { name: 'Oncology Pipeline Assessment', status: 'planning', progress: 23, therapeuticArea: 'Oncology' },
    { name: 'Cardiology Market Access', status: 'active', progress: 67, therapeuticArea: 'Cardiology' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center space-x-3 mb-2">
            <Target className="h-8 w-8 text-purple-600" />
            <h1 className="text-3xl font-bold text-gray-900">EMME Engage</h1>
            <Badge className="bg-green-100 text-green-800">Production Ready</Badge>
          </div>
          <p className="text-gray-600">Pharmaceutical Intelligence & Strategic Go-to-Market Platform</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline">
            <FileText className="w-4 h-4 mr-2" />
            Generate Report
          </Button>
          <Button className="bg-purple-600 hover:bg-purple-700">
            <Brain className="w-4 h-4 mr-2" />
            Launch Sophie
          </Button>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Launch Success Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{metrics.launchSuccess}%</div>
            <p className="text-xs text-gray-500">+15% vs industry avg</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Market Penetration</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{metrics.marketPenetration}%</div>
            <p className="text-xs text-gray-500">Target: 40%</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Time to Market</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{metrics.timeToMarket}</div>
            <p className="text-xs text-gray-500">55% reduction</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Cost Reduction</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{metrics.costReduction}%</div>
            <p className="text-xs text-gray-500">Marketing spend</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-emerald-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">ROI</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">{metrics.roi}%</div>
            <p className="text-xs text-gray-500">Platform investment</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Dashboard Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Strategic Overview</TabsTrigger>
          <TabsTrigger value="intelligence">Market Intelligence</TabsTrigger>
          <TabsTrigger value="projects">Active Projects</TabsTrigger>
          <TabsTrigger value="payer">Payer Landscape</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Therapeutic Area Performance */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5 text-purple-600" />
                  <span>Therapeutic Area Performance</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {marketData.map((area, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-gray-900">{area.therapeuticArea}</h4>
                        <Badge variant="outline">{area.marketSize}</Badge>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="flex-1">
                          <div className="flex justify-between text-sm mb-1">
                            <span>Competitive Intensity</span>
                            <span>{area.competitiveIntensity}/10</span>
                          </div>
                          <Progress value={area.competitiveIntensity * 10} className="h-2" />
                        </div>
                        <Badge className={
                          area.regulatoryRisk === 'high' ? 'bg-red-100 text-red-800' :
                          area.regulatoryRisk === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }>
                          {area.regulatoryRisk} risk
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Strategic Insights */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Sparkles className="h-5 w-5 text-purple-600" />
                  <span>AI Insights</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="font-semibold text-green-900">Opportunity</span>
                    </div>
                    <p className="text-sm text-green-800">VMS market shows 67% treatment gap with high unmet need</p>
                  </div>
                  
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <TrendingUp className="h-4 w-4 text-blue-600" />
                      <span className="font-semibold text-blue-900">Trend</span>
                    </div>
                    <p className="text-sm text-blue-800">Digital health integration increasing payer acceptance</p>
                  </div>

                  <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <AlertTriangle className="h-4 w-4 text-yellow-600" />
                      <span className="font-semibold text-yellow-900">Risk</span>
                    </div>
                    <p className="text-sm text-yellow-800">Regulatory timeline uncertainty may impact launch strategy</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="intelligence" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {marketData.map((area, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{area.therapeuticArea}</span>
                    <Badge variant="outline">{area.marketSize}</Badge>
                  </CardTitle>
                  <CardDescription>Market Intelligence & Strategic Assessment</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-green-600 mb-2">Key Opportunities</h4>
                    <ul className="space-y-1">
                      {area.opportunities.map((opp, i) => (
                        <li key={i} className="text-sm text-gray-700 flex items-center space-x-2">
                          <CheckCircle className="h-3 w-3 text-green-500" />
                          <span>{opp}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-red-600 mb-2">Potential Threats</h4>
                    <ul className="space-y-1">
                      {area.threats.map((threat, i) => (
                        <li key={i} className="text-sm text-gray-700 flex items-center space-x-2">
                          <AlertTriangle className="h-3 w-3 text-red-500" />
                          <span>{threat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="projects" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {projects.map((project, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-lg">{project.name}</CardTitle>
                  <CardDescription>{project.therapeuticArea}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Progress</span>
                    <span className="text-sm text-gray-600">{project.progress}%</span>
                  </div>
                  <Progress value={project.progress} className="h-2" />
                  
                  <div className="flex items-center justify-between">
                    <Badge className={
                      project.status === 'active' ? 'bg-green-100 text-green-800' :
                      project.status === 'planning' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }>
                      {project.status}
                    </Badge>
                    <Button variant="ghost" size="sm">
                      View Details
                      <ArrowUpRight className="w-3 h-3 ml-1" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="payer" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-5 w-5 text-purple-600" />
                <span>Payer Landscape Analysis</span>
              </CardTitle>
              <CardDescription>Real-time payer intelligence and market access insights</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Payer landscape data loading...</p>
                <p className="text-sm text-gray-500 mt-2">Connecting to real-time payer intelligence feeds</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}