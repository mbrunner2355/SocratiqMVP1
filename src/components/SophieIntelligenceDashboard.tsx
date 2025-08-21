import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import { 
  AlertTriangle, 
  Clock,
  Bell,
  BarChart3
} from "lucide-react";

export function SophieIntelligenceDashboard() {
  return (
    <div className="space-y-4">
      {/* Welcome Message */}
      <div className="text-center py-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Good morning! Let's make some magic today!
        </h2>
        <p className="text-gray-600">
          Every failed experiment teaches us something valuable. In research, these are not real failures—only data 
          that guides us toward success.
        </p>
      </div>

      {/* Sophie's Intelligence Brief */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">S</span>
              </div>
              <div>
                <CardTitle className="text-lg">Sophie's Intelligence Brief</CardTitle>
                <p className="text-sm text-gray-500">Welcome back! Here's what I've been researching for you:</p>
              </div>
            </div>
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              Ask Sophie
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          {/* Statistics Cards */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 mb-1">72%</div>
              <div className="text-xs text-gray-500 space-y-1">
                <div>▲ Segment A: 55%</div>
                <div>▲ Segment B: 65%</div>
                <div>▲ Segment C: 45%</div>
                <div>▲ Segment D: 72%</div>
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 mb-1">72%</div>
              <div className="text-xs text-gray-500 space-y-1">
                <div>▲ Segment A: 55%</div>
                <div>▲ Segment B: 65%</div>
                <div>▲ Segment C: 45%</div>
                <div>▲ Segment D: 72%</div>
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 mb-1">72%</div>
              <div className="text-xs text-gray-500 space-y-1">
                <div>▲ Segment A: 55%</div>
                <div>▲ Segment B: 65%</div>
                <div>▲ Segment C: 45%</div>
                <div>▲ Segment D: 72%</div>
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 mb-1">72%</div>
              <div className="text-xs text-gray-500 space-y-1">
                <div>▲ Segment A: 55%</div>
                <div>▲ Segment B: 65%</div>
                <div>▲ Segment C: 45%</div>
                <div>▲ Segment D: 72%</div>
              </div>
            </div>
          </div>

          {/* Alert Summary */}
          <div className="grid grid-cols-4 gap-4">
            <div className="flex items-center justify-center space-x-2 p-3 bg-red-50 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              <div className="text-center">
                <div className="font-semibold text-red-900">2</div>
                <div className="text-xs text-red-600">Critical</div>
                <div className="text-xs text-red-500">Incidents</div>
              </div>
            </div>
            <div className="flex items-center justify-center space-x-2 p-3 bg-yellow-50 rounded-lg">
              <Clock className="w-5 h-5 text-yellow-600" />
              <div className="text-center">
                <div className="font-semibold text-yellow-900">1</div>
                <div className="text-xs text-yellow-600">Warning</div>
                <div className="text-xs text-yellow-500">Incidents</div>
              </div>
            </div>
            <div className="flex items-center justify-center space-x-2 p-3 bg-blue-50 rounded-lg">
              <Bell className="w-5 h-5 text-blue-600" />
              <div className="text-center">
                <div className="font-semibold text-blue-900">65</div>
                <div className="text-xs text-blue-600">Informational</div>
                <div className="text-xs text-blue-500">Incidents</div>
              </div>
            </div>
            <div className="flex items-center justify-center space-x-2 p-3 bg-purple-50 rounded-lg">
              <BarChart3 className="w-5 h-5 text-purple-600" />
              <div className="text-center">
                <div className="font-semibold text-purple-900">88%</div>
                <div className="text-xs text-purple-600">On-Time</div>
                <div className="text-xs text-purple-500">Delivery</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}