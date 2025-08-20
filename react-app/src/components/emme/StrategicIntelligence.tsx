import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Badge } from '../ui/badge'
import { TrendingUp, BarChart3, Target, Globe, DollarSign, Users } from 'lucide-react'

export function StrategicIntelligence() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Strategic Intelligence</h1>
          <p className="text-gray-600 mt-1">Market analysis and competitive intelligence</p>
        </div>
        <Badge className="bg-green-100 text-green-800">
          <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
          Live Data
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Market Size</p>
                <p className="text-2xl font-bold text-gray-900">$45.2B</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Competitive Index</p>
                <p className="text-2xl font-bold text-gray-900">89%</p>
              </div>
              <BarChart3 className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Launch Success</p>
                <p className="text-2xl font-bold text-gray-900">92%</p>
              </div>
              <Target className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="text-center py-12">
        <div className="max-w-md mx-auto">
          <TrendingUp className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Strategic Intelligence Dashboard</h3>
          <p className="text-gray-600">
            Comprehensive market analysis, competitive intelligence, and strategic insights for pharmaceutical decision-making.
          </p>
        </div>
      </div>
    </div>
  )
}