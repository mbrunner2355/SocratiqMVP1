import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Badge } from '../ui/badge'
import { Heart, Globe, Users, TrendingUp, MapPin, BarChart3 } from 'lucide-react'

export function EquityAccess() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Equity & Access</h1>
          <p className="text-gray-600 mt-1">Health equity analysis and access optimization</p>
        </div>
        <Badge className="bg-green-100 text-green-800">
          <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
          Global Coverage
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Coverage Index</p>
                <p className="text-2xl font-bold text-gray-900">78%</p>
              </div>
              <Heart className="w-8 h-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Access Programs</p>
                <p className="text-2xl font-bold text-gray-900">89</p>
              </div>
              <Users className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Global Reach</p>
                <p className="text-2xl font-bold text-gray-900">45</p>
              </div>
              <Globe className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Equity Score</p>
                <p className="text-2xl font-bold text-gray-900">85%</p>
              </div>
              <TrendingUp className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="text-center py-12">
        <div className="max-w-md mx-auto">
          <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Health Equity & Access Dashboard</h3>
          <p className="text-gray-600">
            Monitor and optimize health equity outcomes, access programs, and coverage strategies across diverse patient populations and global markets.
          </p>
        </div>
      </div>
    </div>
  )
}