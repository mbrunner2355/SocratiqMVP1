import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Badge } from '../ui/badge'
import { Users, MessageSquare, UserCheck, Heart, Calendar, TrendingUp } from 'lucide-react'

export function StakeholderEngagement() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Stakeholder Engagement</h1>
          <p className="text-gray-600 mt-1">HCP, patient, and payer relationship management</p>
        </div>
        <Badge className="bg-blue-100 text-blue-800">
          <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
          Active Campaigns
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">HCP Engagement</p>
                <p className="text-2xl font-bold text-gray-900">84%</p>
              </div>
              <UserCheck className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Patient Programs</p>
                <p className="text-2xl font-bold text-gray-900">127</p>
              </div>
              <Heart className="w-8 h-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Payer Relations</p>
                <p className="text-2xl font-bold text-gray-900">92%</p>
              </div>
              <TrendingUp className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">KOL Network</p>
                <p className="text-2xl font-bold text-gray-900">456</p>
              </div>
              <Users className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="text-center py-12">
        <div className="max-w-md mx-auto">
          <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Stakeholder Engagement Hub</h3>
          <p className="text-gray-600">
            Manage relationships with healthcare professionals, patients, payers, and key opinion leaders through integrated engagement strategies.
          </p>
        </div>
      </div>
    </div>
  )
}