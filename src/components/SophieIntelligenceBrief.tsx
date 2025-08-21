import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  TrendingDown,
  TrendingUp,
  AlertTriangle,
  BarChart3,
  Clock,
  Package,
  Thermometer,
  Star,
  Bell,
  Eye,
  MessageSquare,
  ArrowRight,
  Activity,
  Zap,
  Target,
  Award
} from "lucide-react";
import { SophieLogo } from "./SophieLogo";

interface IntelligenceInsight {
  id: string;
  title: string;
  category: "DETECTION" | "RECOMMENDATION" | "ALERT" | "TREND";
  priority: "high" | "medium" | "low";
  labels: string[];
  description: string;
  analytics: string[];
  recommendations: string[];
  chartType: "bar" | "line" | "trend";
  chartData?: any;
  timestamp: string;
  status: "active" | "resolved" | "monitoring";
}

export function SophieIntelligenceBrief() {
  const [selectedTab, setSelectedTab] = useState("insights");

  // Mock intelligence insights data matching the screenshot
  const insights: IntelligenceInsight[] = [
    {
      id: "insight_001",
      title: "Depot 2 dropped below on-time SLA for 2nd Day",
      category: "DETECTION",
      priority: "high",
      labels: ["Label 1", "Label 2", "Label 3"],
      description: "On-time delivery dropped below 80% for 2 consecutive days.",
      analytics: [
        "On-time delivery dropped below 80% for 2 consecutive days."
      ],
      recommendations: [
        "On-time delivery dropped below 80% for 2 consecutive days."
      ],
      chartType: "bar",
      timestamp: "2 hours ago",
      status: "active"
    },
    {
      id: "insight_002", 
      title: "3 Temperature excursions tied to Trial T-004",
      category: "DETECTION",
      priority: "medium",
      labels: ["Label 1", "Label 2", "Label 3"],
      description: "Multiple temperature excursions detected across 3 locations tied to trial.",
      analytics: [
        "Shipping containers within same issue with Vendor A shipments."
      ],
      recommendations: [
        "Quality affected batches and initiate vendor quality review."
      ],
      chartType: "line",
      timestamp: "4 hours ago",
      status: "monitoring"
    },
    {
      id: "insight_003",
      title: "Inventory trending low at Site 7",
      category: "ALERT",
      priority: "low",
      labels: ["Label 1", "Label 2"],
      description: "Inventory levels approaching minimum thresholds at Site 7.",
      analytics: [
        "On-time delivery dropped below 80% for 2 consecutive days."
      ],
      recommendations: [
        "On-time delivery dropped below 80% for 2 consecutive days."
      ],
      chartType: "bar",
      timestamp: "6 hours ago",
      status: "active"
    }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "text-red-600 bg-red-50 border-red-200";
      case "medium": return "text-orange-600 bg-orange-50 border-orange-200";
      case "low": return "text-blue-600 bg-blue-50 border-blue-200";
      default: return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "DETECTION": return <AlertTriangle className="h-4 w-4" />;
      case "RECOMMENDATION": return <Target className="h-4 w-4" />;
      case "ALERT": return <Bell className="h-4 w-4" />;
      case "TREND": return <TrendingUp className="h-4 w-4" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  const renderMockChart = (type: string, index: number) => {
    if (type === "bar") {
      return (
        <div className="flex items-end gap-1 h-16">
          {[85, 92, 78, 65, 82, 75, 88].map((value, i) => (
            <div
              key={i}
              className={`w-4 rounded-t ${
                index === 0 ? 'bg-purple-500' : 
                index === 1 ? 'bg-green-500' : 'bg-blue-500'
              }`}
              style={{ height: `${(value / 100) * 64}px` }}
            />
          ))}
        </div>
      );
    }
    
    if (type === "line") {
      return (
        <div className="relative h-16 w-full">
          <svg viewBox="0 0 100 50" className="w-full h-full">
            <polyline
              fill="none"
              stroke={index === 1 ? "#10b981" : "#3b82f6"}
              strokeWidth="2"
              points="5,40 20,35 35,30 50,25 65,20 80,15 95,10"
            />
            <polyline
              fill="none"
              stroke={index === 1 ? "#059669" : "#1d4ed8"}
              strokeWidth="2"
              points="5,45 20,42 35,38 50,35 65,32 80,28 95,25"
            />
          </svg>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <SophieLogo className="h-8 w-8" />
          <div>
            <h1 className="text-2xl font-bold">Sophie Intelligence Brief Screen</h1>
            <p className="text-muted-foreground text-sm">Clinical Trial Supply Intelligence</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Bell className="h-4 w-4 mr-2" />
            Notifications
          </Button>
          <Button variant="outline" size="sm">
            <MessageSquare className="h-4 w-4 mr-2" />
            Ask Sophie
          </Button>
        </div>
      </div>

      {/* Intelligence Brief Cards */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-teal-600">Sophie's Recommended Insights</h2>
            <p className="text-sm text-muted-foreground">Prioritized intelligence helping you take action</p>
          </div>
        </div>

        <div className="space-y-4">
          {insights.map((insight, index) => (
            <Card key={insight.id} className="border-l-4 border-l-purple-500">
              <CardContent className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  {/* Left Side - Chart/Visual */}
                  <div className="lg:col-span-3">
                    <div className="flex items-center gap-2 mb-3">
                      {insight.labels.map((label, i) => (
                        <Badge key={i} variant="outline" className="text-xs">
                          <div className={`w-2 h-2 rounded-full mr-1 ${
                            i === 0 ? 'bg-purple-500' : 
                            i === 1 ? 'bg-teal-500' : 'bg-blue-500'
                          }`} />
                          {label}
                        </Badge>
                      ))}
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      {renderMockChart(insight.chartType, index)}
                    </div>
                  </div>

                  {/* Right Side - Content */}
                  <div className="lg:col-span-9">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        {getCategoryIcon(insight.category)}
                        <h3 className="font-semibold text-lg">{insight.title}</h3>
                        <Badge className={getPriorityColor(insight.priority)}>
                          {insight.category}
                        </Badge>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {insight.timestamp}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Analytics Section */}
                      <div>
                        <h4 className="font-medium text-sm mb-2">ANALYTICS</h4>
                        <ul className="space-y-1">
                          {insight.analytics.map((item, i) => (
                            <li key={i} className="text-sm text-muted-foreground">
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Recommendations Section */}
                      <div>
                        <h4 className="font-medium text-sm mb-2">RECOMMENDATION</h4>
                        <ul className="space-y-1">
                          {insight.recommendations.map((item, i) => (
                            <li key={i} className="text-sm text-muted-foreground">
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center justify-between mt-4 pt-4 border-t">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          Label 1
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          Label 2
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          Label 3
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">
                          Button
                        </Button>
                        <Button variant="outline" size="sm">
                          Button
                        </Button>
                        <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                          Button
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Intelligence Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Insights</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">+3 from last week</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recommendations Pending</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">4 high priority</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Actions Taken</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}