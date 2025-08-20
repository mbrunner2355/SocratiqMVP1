import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { useAppStore } from '../../stores/appStore'
import { 
  TrendingUp, 
  Users, 
  FileText, 
  BarChart3,
  ArrowRight,
  Calendar,
  Target,
  Zap,
  Heart
} from 'lucide-react'

export function EMMEHome() {
  const { projects, documents, getAnalytics } = useAppStore()
  const analytics = getAnalytics()

  const quickActions = [
    {
      title: 'Create New Project',
      description: 'Start a new pharmaceutical project',
      icon: Target,
      action: 'create-project',
      color: 'purple'
    },
    {
      title: 'Upload Documents',
      description: 'Add documents for processing',
      icon: FileText,
      action: 'content-orchestration',
      color: 'blue'
    },
    {
      title: 'Strategic Analysis',
      description: 'View market intelligence',
      icon: TrendingUp,
      action: 'strategic-intelligence',
      color: 'green'
    },
    {
      title: 'Team Collaboration',
      description: 'Manage stakeholders',
      icon: Users,
      action: 'stakeholder-engagement',
      color: 'orange'
    }
  ]

  const recentProjects = projects.slice(0, 3)

  const upcomingEvents = [
    {
      title: 'Phase 3 Protocol Review',
      date: '2024-08-25',
      project: 'VMS Global Platform',
      type: 'milestone'
    },
    {
      title: 'Market Access Strategy Meeting',
      date: '2024-08-27',
      project: 'Xarelto Strategy',
      type: 'meeting'
    },
    {
      title: 'Regulatory Submission Deadline',
      date: '2024-09-01',
      project: 'VMS Global Platform',
      type: 'deadline'
    }
  ]

  const getActionColor = (color: string) => {
    const colors = {
      purple: 'bg-purple-100 text-purple-700 hover:bg-purple-200',
      blue: 'bg-blue-100 text-blue-700 hover:bg-blue-200',
      green: 'bg-green-100 text-green-700 hover:bg-green-200',
      orange: 'bg-orange-100 text-orange-700 hover:bg-orange-200'
    }
    return colors[color as keyof typeof colors] || colors.purple
  }

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'milestone': return 'bg-blue-100 text-blue-800'
      case 'meeting': return 'bg-green-100 text-green-800'
      case 'deadline': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Welcome to EMME Engage</h1>
          <p className="text-gray-600 mt-1">Your pharmaceutical strategic intelligence platform</p>
        </div>
        <Badge className="bg-green-100 text-green-800">
          <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
          All Systems Operational
        </Badge>
      </div>

      {/* Analytics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Projects</p>
                <p className="text-2xl font-bold text-gray-900">{analytics.activeProjects}</p>
              </div>
              <Target className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Documents</p>
                <p className="text-2xl font-bold text-gray-900">{analytics.totalDocuments}</p>
              </div>
              <FileText className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Processing</p>
                <p className="text-2xl font-bold text-gray-900">{analytics.processingDocuments}</p>
              </div>
              <Zap className="w-8 h-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Success Rate</p>
                <p className="text-2xl font-bold text-gray-900">89%</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Get started with common tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, index) => {
              const Icon = action.icon
              return (
                <Button
                  key={index}
                  variant="outline"
                  className={`h-auto p-4 flex flex-col items-center space-y-2 ${getActionColor(action.color)}`}
                >
                  <Icon className="w-6 h-6" />
                  <div className="text-center">
                    <p className="font-medium">{action.title}</p>
                    <p className="text-xs opacity-80">{action.description}</p>
                  </div>
                </Button>
              )
            })}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Projects */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Projects</CardTitle>
            <CardDescription>Your latest pharmaceutical initiatives</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentProjects.map((project, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{project.name}</h4>
                    <p className="text-sm text-gray-600">{project.client} • {project.therapeuticArea}</p>
                    <div className="flex items-center mt-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-purple-600 h-2 rounded-full" 
                          style={{ width: `${project.progress}%` }}
                        />
                      </div>
                      <span className="ml-2 text-sm text-gray-600">{project.progress}%</span>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    View Details
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Events */}
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Events</CardTitle>
            <CardDescription>Important dates and milestones</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingEvents.map((event, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 border rounded-lg">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{event.title}</h4>
                    <p className="text-sm text-gray-600">{event.project}</p>
                    <p className="text-xs text-gray-500">{new Date(event.date).toLocaleDateString()}</p>
                  </div>
                  <Badge className={getEventTypeColor(event.type)}>
                    {event.type}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Key Metrics */}
      <Card>
        <CardHeader>
          <CardTitle>Platform Performance</CardTitle>
          <CardDescription>Real-time intelligence metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <BarChart3 className="w-8 h-8 text-purple-600" />
              </div>
              <h4 className="font-semibold text-gray-900">Market Intelligence</h4>
              <p className="text-2xl font-bold text-purple-600 mt-1">92%</p>
              <p className="text-sm text-gray-600">Accuracy Rate</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Users className="w-8 h-8 text-blue-600" />
              </div>
              <h4 className="font-semibold text-gray-900">Stakeholder Engagement</h4>
              <p className="text-2xl font-bold text-blue-600 mt-1">84%</p>
              <p className="text-sm text-gray-600">Engagement Score</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Heart className="w-8 h-8 text-green-600" />
              </div>
              <h4 className="font-semibold text-gray-900">Health Equity</h4>
              <p className="text-2xl font-bold text-green-600 mt-1">78%</p>
              <p className="text-sm text-gray-600">Coverage Index</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}