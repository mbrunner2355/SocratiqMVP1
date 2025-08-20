import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useTenant } from "@/components/TenantProvider";
import { detectPartnerContext, getPartnerBrand, type PartnerBrandConfig } from "@shared/partner-branding";
import { 
  MessageCircle, 
  Send, 
  AlertTriangle, 
  CheckCircle,
  Info,
  Bell,
  TrendingUp,
  Users,
  Calendar,
  ArrowRight
} from "lucide-react";

interface InsightItem {
  id: string;
  type: 'critical' | 'warning' | 'informational' | 'resolved';
  title: string;
  timeAgo: string;
  priority?: 'Active' | 'Resolved';
}

export function SophieDashboard() {
  const [chatMessage, setChatMessage] = useState("");
  const [isChatOpen, setIsChatOpen] = useState(true); // Always show chat by default
  const { tenant } = useTenant();

  // Get partner branding configuration
  const partnerId = detectPartnerContext();
  const brand: PartnerBrandConfig = getPartnerBrand(partnerId);
  
  // Extract brand properties for easy access
  const { agentName, agentBrand, colors, messaging } = brand;
  const isPartnerBranded = partnerId !== 'socratiq';

  const welcomeQuote = "Your research is a conversation with nature, asking questions through experimentation and listening carefully to the answers.";

  const insights: InsightItem[] = [
    {
      id: '1',
      type: 'critical',
      title: 'Depot_2 dropped below on-time SLA for 2nd day',
      timeAgo: '2 hours ago',
      priority: 'Active'
    },
    {
      id: '2', 
      type: 'critical',
      title: '3 temperature excursions tied to Trial T-004',
      timeAgo: '5 hours ago',
      priority: 'Active'
    },
    {
      id: '3',
      type: 'warning',
      title: 'Inventory trending low at Site_7',
      timeAgo: '1 day ago',
      priority: 'Active'
    },
    {
      id: '4',
      type: 'resolved',
      title: 'Corrective actions closed for Trial T-001',
      timeAgo: '2 days ago',
      priority: 'Resolved'
    }
  ];

  const statistics = [
    { value: '72%', label: 'Statistics', segments: ['Segment A: 30%', 'Segment B: 25%', 'Segment C: 35%', 'Segment D: 10%'] },
    { value: '72%', label: 'Statistics', segments: ['Segment A: 30%', 'Segment B: 25%', 'Segment C: 35%', 'Segment D: 10%'] },
    { value: '72%', label: 'Statistics', segments: ['Segment A: 30%', 'Segment B: 25%', 'Segment C: 35%', 'Segment D: 10%'] },
    { value: '72%', label: 'Statistics', segments: ['Segment A: 30%', 'Segment B: 25%', 'Segment C: 35%', 'Segment D: 10%'] }
  ];

  const metrics = [
    { count: '2', label: 'Critical\nInsights', type: 'critical', icon: AlertTriangle },
    { count: '1', label: 'Warning\nInsights', type: 'warning', icon: AlertTriangle },
    { count: '68', label: 'Informational\nInsights', type: 'info', icon: Info, note: 'increased by 6\nthis week' },
    { count: '86%', label: 'On-Time\nDelivery', type: 'success', icon: CheckCircle, trend: '-6%' }
  ];

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'critical':
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'informational':
        return <Info className="w-4 h-4 text-blue-500" />;
      case 'resolved':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      default:
        return <Info className="w-4 h-4" />;
    }
  };

  const handleSendMessage = () => {
    if (chatMessage.trim()) {
      // Handle sending message to Sophie
      setChatMessage("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 bg-${colors.primary} rounded-full flex items-center justify-center`}>
              <span className="text-white font-bold text-lg">{agentName.charAt(0)}</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">{agentName}'s Intelligence Brief</h1>
              <p className="text-sm text-gray-600">Welcome back! Here's what I've been monitoring for you.</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline" size="sm">
              <Bell className="w-4 h-4 mr-2" />
              Notifications
            </Button>
            <Button 
              className={`bg-${colors.button.primary} hover:bg-${colors.button.hover}`}
              onClick={() => setIsChatOpen(!isChatOpen)}
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Ask {agentName}
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 space-y-6 overflow-y-auto">
        {/* Welcome Section */}
        <Card className={`bg-gradient-to-r from-${colors.gradient.from} to-${colors.gradient.to} border-${colors.primary.split('-')[0]}-200`}>
          <CardContent className="p-6 text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-3">
              Good morning! Let's make some magic today!
            </h2>
            <p className="text-gray-600 italic max-w-2xl mx-auto">
              "{welcomeQuote}"
            </p>
            <div className="mt-4 flex items-center justify-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-600">{agentBrand} is online & ready</span>
            </div>
            
            {/* Chat Interface - Always visible below quote */}
            <div className={`mt-6 bg-${colors.chat.background} rounded-lg p-4`}>
              <div className="flex items-start space-x-3 mb-4">
                <div className={`w-8 h-8 bg-${colors.chat.avatar} rounded-full flex items-center justify-center flex-shrink-0`}>
                  <span className="text-white font-bold text-sm">{agentName.charAt(0)}</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-700">
                    Hi there! Where do you want to start today? I'm {agentBrand}, your AI {messaging.roleDescription}. I work 
                    alongside you and my team of specialized agents to navigate the complexities of {messaging.industry}. 
                    Whether you need strategic insights, risk assessment, or {messaging.specialization}, we'll 
                    collaborate to provide intelligent analysis and accelerate your journey {messaging.journey}.
                  </p>
                  <div className="text-xs text-gray-500 mt-2">1:25:37 PM</div>
                </div>
              </div>
              <div className="flex space-x-3">
                <Input
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={`Ask ${agentBrand} anything...`}
                  className="flex-1"
                />
                <Button 
                  onClick={handleSendMessage}
                  className={`bg-${colors.button.primary} hover:bg-${colors.button.hover}`}
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Statistics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {statistics.map((stat, index) => (
            <Card key={index} className="text-center">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-gray-600">{stat.label}</CardTitle>
                <div className="text-xs text-gray-500">5d laborum. Lorem in</div>
              </CardHeader>
              <CardContent>
                <div className="relative w-20 h-20 mx-auto mb-3">
                  {/* Circular Progress */}
                  <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 36 36">
                    <path
                      className="text-gray-200"
                      stroke="currentColor"
                      strokeWidth="3"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                      className="text-gradient-to-r from-purple-500 to-teal-500"
                      stroke="url(#gradient)"
                      strokeWidth="3"
                      strokeLinecap="round"
                      fill="none"
                      strokeDasharray="72, 100"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <defs>
                      <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#8B5CF6" />
                        <stop offset="100%" stopColor="#14B8A6" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-2xl font-bold text-gray-800">{stat.value}</span>
                  </div>
                </div>
                <div className="text-xs text-left space-y-1">
                  {stat.segments.map((segment, idx) => (
                    <div key={idx} className="flex items-center space-x-2">
                      <div className={`w-2 h-2 rounded-full ${
                        idx === 0 ? 'bg-purple-500' : 
                        idx === 1 ? 'bg-teal-500' : 
                        idx === 2 ? 'bg-blue-500' : 'bg-gray-400'
                      }`}></div>
                      <span className="text-gray-600">{segment}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {metrics.map((metric, index) => (
            <Card key={index} className="text-center">
              <CardContent className="p-6">
                <div className="flex items-center justify-center mb-3">
                  <div className={`p-3 rounded-lg ${
                    metric.type === 'critical' ? 'bg-red-50' :
                    metric.type === 'warning' ? 'bg-yellow-50' :
                    metric.type === 'info' ? 'bg-blue-50' : 'bg-green-50'
                  }`}>
                    <metric.icon className={`w-6 h-6 ${
                      metric.type === 'critical' ? 'text-red-500' :
                      metric.type === 'warning' ? 'text-yellow-500' :
                      metric.type === 'info' ? 'text-blue-500' : 'text-green-500'
                    }`} />
                  </div>
                </div>
                <div className="text-3xl font-bold text-gray-800 mb-1">
                  {metric.count}
                  {metric.trend && (
                    <span className="text-sm text-red-500 ml-1">{metric.trend}</span>
                  )}
                </div>
                <div className="text-sm text-gray-600 whitespace-pre-line">{metric.label}</div>
                {metric.note && (
                  <div className="text-xs text-gray-500 mt-1 whitespace-pre-line">{metric.note}</div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Sophie's Recommended Insights */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">{agentName}'s Recommended Insights</CardTitle>
                <p className="text-sm text-gray-600 mt-1">
                  Organized by priority to help you focus on what matters most
                </p>
              </div>
              <div className="flex space-x-2">
                <Badge variant="destructive" className="bg-red-100 text-red-700">
                  Active (4)
                </Badge>
                <Badge variant="secondary" className="bg-gray-100 text-gray-700">
                  Resolved (12)
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {insights.map((insight) => (
                <div 
                  key={insight.id}
                  className="flex items-center justify-between p-3 rounded-lg border hover:bg-gray-50 cursor-pointer"
                >
                  <div className="flex items-center space-x-3">
                    {getInsightIcon(insight.type)}
                    <span className="text-gray-800">{insight.title}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-sm text-gray-500">{insight.timeAgo}</span>
                    <ArrowRight className="w-4 h-4 text-gray-400" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>


    </div>
  );
}