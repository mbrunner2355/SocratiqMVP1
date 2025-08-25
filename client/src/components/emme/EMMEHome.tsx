import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Brain, 
  Target, 
  BookOpen, 
  Shield, 
  TrendingUp, 
  Users, 
  Calendar,
  BarChart3,
  Lightbulb,
  Heart,
  Award,
  Zap,
  ArrowRight,
  Plus,
  Clock,
  Eye,
  Activity,
  CheckCircle
} from "lucide-react";
import { useTenantStyling } from "@/components/TenantProvider";
import { detectPartnerContext, getPartnerBrand } from "src/components/PartnerBrandingDemo.tsx";

export function EMMEHome() {
  // Get EMME Connect branding configuration
  const partnerId = detectPartnerContext();
  const brand = getPartnerBrand(partnerId);
  const isEMMEEngage = partnerId === 'emme-engage';

  // Key metrics data
  const keyMetrics = [
    {
      label: "Time to Insight",
      value: "150 days",
      subtitle: "From pre-launch",
      color: "text-blue-600"
    },
    {
      label: "Cost Savings",
      value: "$9.8M",
      subtitle: "So patient cycle",
      color: "text-green-600"
    },
    {
      label: "Market Achieve",
      value: "25%",
      subtitle: "Baseline achieved",
      color: "text-purple-600"
    },
    {
      label: "Lift Reach",
      value: "87%",
      subtitle: "Strategic over",
      color: "text-orange-600"
    }
  ];
  
  const moduleStats = [
    {
      name: "Insight Engine",
      icon: <Brain className="w-6 h-6" />,
      description: "AI-powered modeling & initiative-specific insights",
      activeProjects: 12,
      completion: 78,
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      name: "Engagement Studio", 
      icon: <Target className="w-6 h-6" />,
      description: "Omnichannel campaigns for patients, HCPs, and payers",
      activeProjects: 8,
      completion: 85,
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      name: "Learning Hub",
      icon: <BookOpen className="w-6 h-6" />,
      description: "Cross-functional team enablement & support",
      activeProjects: 5,
      completion: 92,
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    },
    {
      name: "Equity Infrastructure",
      icon: <Heart className="w-6 h-6" />,
      description: "Global execution & scalable deployment",
      activeProjects: 15,
      completion: 73,
      color: "text-orange-600",
      bgColor: "bg-orange-50"
    }
  ];

  const recentActivity = [
    {
      type: "insight",
      title: "Health equity analysis completed",
      project: "Oncology Campaign Q3",
      time: "2 hours ago",
      status: "Completed",
      statusColor: "bg-green-100 text-green-800"
    },
    {
      type: "engagement", 
      title: "HCP engagement campaign launched",
      project: "Diabetes Education Series",
      time: "4 hours ago", 
      status: "Active",
      statusColor: "bg-blue-100 text-blue-800"
    },
    {
      type: "learning",
      title: "Cultural competency training updated",
      project: "Team Development",
      time: "6 hours ago",
      status: "Updated",
      statusColor: "bg-purple-100 text-purple-800"
    },
    {
      type: "equity",
      title: "SDOH metrics dashboard refreshed",
      project: "Community Impact Study", 
      time: "8 hours ago",
      status: "Completed",
      statusColor: "bg-green-100 text-green-800"
    }
  ];

  const upcomingEvents = [
    {
      title: "HCP Training Webinar",
      time: "Tomorrow, 2:00 PM",
      type: "training"
    },
    {
      title: "Campaign Review Meeting", 
      time: "Friday, 10:00 AM",
      type: "meeting"
    }
  ];

  const quickActions = [
    {
      title: "Plan New Launch",
      description: "LOE-driven scenario-based planning with AI models",
      icon: <Target className="w-5 h-5" />,
      action: "Start Planning"
    },
    {
      title: "Monitor Market Dynamics", 
      description: "Real-time pricing, access, and policy trends",
      icon: <BarChart3 className="w-5 h-5" />,
      action: "View Dashboard"
    },
    {
      title: "Track Campaign Impact",
      description: "Purposeful KPIs across awareness and equity",
      icon: <TrendingUp className="w-5 h-5" />,
      action: "View Analytics"
    },
    {
      title: "Generate RWE Insights",
      description: "Real-world evidence for strategy optimization", 
      icon: <Lightbulb className="w-5 h-5" />,
      action: "Run Analysis"
    }
  ];

  return (
    <div className="p-6">
      {/* SocratIQ Core Landing Section - Always First */}
      <div className="mb-8">
        <div className="bg-gradient-to-r from-gray-50 to-purple-50 rounded-lg p-8 border">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome, Monica! Let's optimize your pharmaceutical campaigns today!
            </h1>
            <p className="text-lg text-gray-600">
              Welcome to your EMME-powered pharmaceutical intelligence platform
            </p>
          </div>
          
          <div className="bg-white rounded-lg p-8 mt-6 border-l-4 shadow-sm" style={{ borderLeftColor: '#9B7FB8' }}>
            <div className="text-center">
              <blockquote className="text-gray-700 italic text-lg leading-relaxed">
                "You may not always see the seeds take root—but every action you take plants 
                something enduring. Trust that the forest is growing, even if right now you can only 
                see the soil."
              </blockquote>
              <div className="mt-4 text-sm text-gray-500">
                — Your daily inspiration
              </div>
            </div>
          </div>
        </div>
      </div>



      {/* EMME Engage Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Launch Acceleration</p>
                <p className="text-2xl font-bold text-gray-900">150 days</p>
                <p className="text-sm text-green-600">Faster go-to-market</p>
              </div>
              <Clock className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Cost Savings</p>
                <p className="text-2xl font-bold text-gray-900">$9.8M</p>
                <p className="text-sm text-green-600">Per launch cycle</p>
              </div>
              <Award className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Marketing Waste</p>
                <p className="text-2xl font-bold text-gray-900">25%</p>
                <p className="text-sm text-green-600">Reduction achieved</p>
              </div>
              <TrendingUp className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">LOE Portfolio</p>
                <p className="text-2xl font-bold text-gray-900">87%</p>
                <p className="text-sm text-green-600">Coverage ready</p>
              </div>
              <BarChart3 className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* EMME Engage Project Overview */}
        <div className="lg:col-span-2">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">EMME Strategic Intelligence Modules</h2>
            <p className="text-sm text-gray-600 mb-4">
              Accelerate drug launches with AI-powered go-to-market intelligence. From clinical trial to LOE, EMME delivers critical therapies to patients faster while reducing system burden and advancing real health impact.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {moduleStats.map((module, index) => (
                <Card key={index} className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg bg-gray-100 ${module.color}`}>
                          {module.icon}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{module.name}</h3>
                          <p className="text-xs text-gray-500">{module.description}</p>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-gray-400" />
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Active Projects</span>
                        <span className="font-medium">{module.activeProjects}</span>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Completion</span>
                          <span className="font-medium">{module.completion}%</span>
                        </div>
                        <Progress value={module.completion} className="h-2 progress-gradient-blue-purple [&>div]:bg-gradient-blue-purple" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {quickActions.map((action, index) => (
                <Card key={index} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-3">
                      <div className="p-2 rounded-lg bg-purple-100 text-purple-600">
                        {action.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1">{action.title}</h3>
                        <p className="text-sm text-gray-600 mb-3">{action.description}</p>
                        <Button 
                          size="sm" 
                          variant="outline"
                          className="w-full"
                        >
                          {action.action}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h2>
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-start space-x-3 pb-4 border-b border-gray-100 last:border-b-0">
                    <div className="flex-shrink-0">
                      {activity.type === "insight" && <Brain className="w-4 h-4 text-purple-600" />}
                      {activity.type === "engagement" && <Target className="w-4 h-4 text-green-600" />}
                      {activity.type === "learning" && <BookOpen className="w-4 h-4 text-purple-600" />}
                      {activity.type === "equity" && <Shield className="w-4 h-4 text-orange-600" />}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                      <p className="text-xs text-gray-600">{activity.project}</p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-gray-500">{activity.time}</span>
                        <Badge 
                          variant="outline"
                          className={`text-xs ${activity.statusColor}`}
                        >
                          {activity.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <Button variant="outline" className="w-full mt-4" size="sm">
                View All Activity
              </Button>
            </CardContent>
          </Card>

          {/* Upcoming Events */}
          <Card className="mt-6">
            <CardContent className="p-6">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                <Calendar className="w-4 h-4 mr-2" />
                Upcoming Events
              </h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                  <Clock className="w-4 h-4 text-blue-600" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">HCP Training Webinar</p>
                    <p className="text-xs text-gray-600">Tomorrow, 2:00 PM</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                  <Clock className="w-4 h-4 text-green-600" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Campaign Review Meeting</p>
                    <p className="text-xs text-gray-600">Friday, 10:00 AM</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}