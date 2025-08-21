import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Brain,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Clock,
  Eye,
  ArrowRight,
  BarChart3,
  Users,
  Package,
  Truck,
  Settings,
  Bell,
  MessageSquare
} from "lucide-react";
import { SophieLogo } from "./SophieLogo";

interface StatisticsCard {
  title: string;
  value: number;
  segments: Array<{
    label: string;
    percentage: number;
    color: string;
  }>;
}

interface InsightItem {
  id: string;
  type: "critical" | "warning" | "info" | "success";
  title: string;
  timestamp: string;
  priority: "high" | "medium" | "low";
}

export function SophieIntelligenceDashboard() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const statisticsCards: StatisticsCard[] = [
    {
      title: "Statistics",
      value: 72,
      segments: [
        { label: "Segment A", percentage: 30, color: "bg-purple-500" },
        { label: "Segment B", percentage: 25, color: "bg-teal-500" },
        { label: "Segment C", percentage: 35, color: "bg-blue-500" },
        { label: "Segment D", percentage: 10, color: "bg-gray-400" }
      ]
    },
    {
      title: "Statistics", 
      value: 72,
      segments: [
        { label: "Segment A", percentage: 30, color: "bg-purple-500" },
        { label: "Segment B", percentage: 25, color: "bg-teal-500" },
        { label: "Segment C", percentage: 35, color: "bg-blue-500" },
        { label: "Segment D", percentage: 10, color: "bg-gray-400" }
      ]
    },
    {
      title: "Statistics",
      value: 72, 
      segments: [
        { label: "Segment A", percentage: 30, color: "bg-purple-500" },
        { label: "Segment B", percentage: 25, color: "bg-teal-500" },
        { label: "Segment C", percentage: 35, color: "bg-blue-500" },
        { label: "Segment D", percentage: 10, color: "bg-gray-400" }
      ]
    },
    {
      title: "Statistics",
      value: 72,
      segments: [
        { label: "Segment A", percentage: 30, color: "bg-purple-500" },
        { label: "Segment B", percentage: 25, color: "bg-teal-500" },
        { label: "Segment C", percentage: 35, color: "bg-blue-500" },
        { label: "Segment D", percentage: 10, color: "bg-gray-400" }
      ]
    }
  ];

  const insights: InsightItem[] = [
    {
      id: "1",
      type: "critical",
      title: "Depot_2 dropped below on-time SLA for 2nd day",
      timestamp: "2 hours ago",
      priority: "high"
    },
    {
      id: "2", 
      type: "critical",
      title: "3 temperature excursions tied to Trial T-004",
      timestamp: "5 hours ago",
      priority: "high"
    },
    {
      id: "3",
      type: "warning", 
      title: "Inventory trending low at Site_7",
      timestamp: "1 day ago",
      priority: "medium"
    },
    {
      id: "4",
      type: "success",
      title: "Corrective actions closed for Trial T-001",
      timestamp: "2 days ago", 
      priority: "low"
    }
  ];

  const getInsightIcon = (type: string) => {
    switch (type) {
      case "critical": return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case "warning": return <AlertTriangle className="h-4 w-4 text-orange-500" />;
      case "info": return <Brain className="h-4 w-4 text-blue-500" />;
      case "success": return <CheckCircle className="h-4 w-4 text-green-500" />;
      default: return <Brain className="h-4 w-4" />;
    }
  };

  const renderDonutChart = (card: StatisticsCard) => {
    const centerValue = card.value;
    const radius = 40;
    const circumference = 2 * Math.PI * radius;
    
    let cumulativePercentage = 0;
    
    return (
      <div className="relative w-24 h-24 mx-auto">
        <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke="#e5e7eb"
            strokeWidth="8"
          />
          {card.segments.map((segment, index) => {
            const strokeDasharray = `${(segment.percentage / 100) * circumference} ${circumference}`;
            const strokeDashoffset = -cumulativePercentage * (circumference / 100);
            cumulativePercentage += segment.percentage;
            
            const strokeColor = segment.color.replace('bg-', '').replace('-500', '');
            const colorMap: { [key: string]: string } = {
              'purple': '#8b5cf6',
              'teal': '#14b8a6', 
              'blue': '#3b82f6',
              'gray': '#6b7280'
            };
            
            return (
              <circle
                key={index}
                cx="50"
                cy="50"
                r={radius}
                fill="none"
                stroke={colorMap[strokeColor] || '#6b7280'}
                strokeWidth="8"
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                className="transition-all duration-1000"
              />
            );
          })}
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl font-bold text-gray-900">{centerValue}%</span>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <SophieLogo className="h-8 w-8" />
          <div>
            <h1 className="text-2xl font-bold text-teal-600">Sophie's Intelligence Brief</h1>
            <p className="text-sm text-gray-600">Welcome back! Here's what I've been monitoring for you.</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Bell className="h-4 w-4 mr-2" />
            Notifications
          </Button>
          <Button size="sm" className="bg-teal-600 hover:bg-teal-700">
            <MessageSquare className="h-4 w-4 mr-2" />
            Ask Sophie
          </Button>
        </div>
      </div>

      {/* Statistics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {statisticsCards.map((card, index) => (
          <Card key={index} className="bg-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">{card.title}</CardTitle>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <span>5d laborum</span>
                <span>Lorem in</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {renderDonutChart(card)}
              <div className="space-y-1">
                {card.segments.map((segment, segIndex) => (
                  <div key={segIndex} className="flex items-center gap-2 text-xs">
                    <div className={`w-2 h-2 rounded-full ${segment.color}`} />
                    <span className="text-gray-600">{segment.label}: {segment.percentage}%</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-white">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <div className="text-lg font-semibold">2</div>
                <div className="text-sm text-gray-600">Critical Insights</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <div className="text-lg font-semibold">1</div>
                <div className="text-sm text-gray-600">Warning Insights</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-teal-100 rounded-lg">
                <CheckCircle className="h-5 w-5 text-teal-600" />
              </div>
              <div>
                <div className="text-lg font-semibold">68</div>
                <div className="text-sm text-gray-600">Informational Insights</div>
                <div className="text-xs text-gray-500">increased by 6 this week</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Truck className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-semibold">86%</span>
                  <span className="text-sm text-red-500">-6%</span>
                </div>
                <div className="text-sm text-gray-600">On-Time Delivery</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sophie's Recommended Insights */}
      <Card className="bg-white">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg font-semibold">Sophie's Recommended Insights</CardTitle>
              <CardDescription className="text-sm text-gray-600">
                Organized by priority to help you focus on what matters most
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                Active (4)
              </Badge>
              <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
                Resolved (12)
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {insights.map((insight) => (
              <div key={insight.id} className="flex items-center justify-between p-3 rounded-lg border hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3">
                  {getInsightIcon(insight.type)}
                  <div>
                    <div className="font-medium text-sm">{insight.title}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-500">{insight.timestamp}</span>
                  <ArrowRight className="h-4 w-4 text-gray-400" />
                </div>
              </div>
            ))}
          </div>
          
          <div className="flex items-center justify-between mt-6 pt-4 border-t">
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm">
                <CheckCircle className="h-4 w-4 mr-2" />
                Acknowledge All
              </Button>
              <Button variant="outline" size="sm">
                <Eye className="h-4 w-4 mr-2" />
                Export Insights
              </Button>
            </div>
            <Button size="sm" className="bg-teal-600 hover:bg-teal-700">
              View All Insights
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Autonomous Activity Summary */}
      <Card className="bg-gradient-to-r from-teal-50 to-blue-50 border-teal-200">
        <CardHeader>
          <div className="flex items-center gap-2">
            <SophieLogo className="h-5 w-5" />
            <CardTitle className="text-lg font-semibold text-teal-800">Sophie Working While You Were Away</CardTitle>
          </div>
          <CardDescription className="text-teal-700">
            I've been actively monitoring and analyzing your data continuously - here's what I discovered
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-lg">
              <div className="text-2xl font-bold text-teal-600">24/7</div>
              <div className="text-sm text-gray-600">Continuous Monitoring</div>
              <div className="text-xs text-gray-500 mt-1">Supply chain, trials, inventory</div>
            </div>
            <div className="bg-white p-4 rounded-lg">
              <div className="text-2xl font-bold text-teal-600">147</div>
              <div className="text-sm text-gray-600">Data Points Analyzed</div>
              <div className="text-xs text-gray-500 mt-1">In the last 8 hours</div>
            </div>
            <div className="bg-white p-4 rounded-lg">
              <div className="text-2xl font-bold text-teal-600">4</div>
              <div className="text-sm text-gray-600">Proactive Insights</div>
              <div className="text-xs text-gray-500 mt-1">Requiring your attention</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}