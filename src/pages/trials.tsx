import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { AlertTriangle, TrendingUp, Clock, Users } from "lucide-react";

export default function Trials() {
  const trialMetrics = [
    { label: "Active Trials", value: "12", trend: "+2%" },
    { label: "Supply Chain Risk", value: "Medium", trend: "Stable" },
    { label: "Enrollment Rate", value: "87%", trend: "+5%" },
    { label: "Timeline Confidence", value: "High", trend: "+12%" },
  ];

  const supplyChainAlerts = [
    {
      priority: "High",
      component: "API Supplier - China",
      issue: "Potential 30-day delay due to regulatory changes",
      impact: "Phase III timeline risk",
      recommendation: "Activate backup supplier in India",
    },
    {
      priority: "Medium", 
      component: "Packaging Materials",
      issue: "Cost increase of 15% from primary vendor",
      impact: "Budget variance",
      recommendation: "Negotiate or source alternative",
    },
    {
      priority: "Low",
      component: "Cold Chain Logistics",
      issue: "Seasonal capacity constraints Q4",
      impact: "Distribution planning",
      recommendation: "Reserve capacity in advance",
    },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div className="border-b border-gray-200 pb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-lg bg-indigo-500 flex items-center justify-center">
            <Users className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Trials™</h1>
            <p className="text-gray-600">Clinical Trial Intelligence & Risk Management</p>
          </div>
        </div>
      </div>

      {/* Trial Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {trialMetrics.map((metric) => (
          <Card key={metric.label}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{metric.label}</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metric.value}</div>
              <p className="text-xs text-muted-foreground">{metric.trend}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Supply Chain Risk Dashboard */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5" />
            <span>Supply Chain Risk Intelligence</span>
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Forecast supply chain issues and trial design risks before they impact timelines
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {supplyChainAlerts.map((alert, index) => (
              <div 
                key={index} 
                className={`p-4 rounded-lg border-l-4 ${
                  alert.priority === "High" ? "border-red-500 bg-red-50" :
                  alert.priority === "Medium" ? "border-yellow-500 bg-yellow-50" :
                  "border-green-500 bg-green-50"
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="font-semibold text-gray-900">{alert.component}</h4>
                      <Badge 
                        variant={
                          alert.priority === "High" ? "destructive" :
                          alert.priority === "Medium" ? "default" : "secondary"
                        }
                      >
                        {alert.priority} Priority
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-700 mb-1">{alert.issue}</p>
                    <p className="text-xs text-gray-600">Impact: {alert.impact}</p>
                  </div>
                </div>
                <div className="mt-3 p-2 bg-white rounded border">
                  <p className="text-sm font-medium text-gray-900">Recommendation:</p>
                  <p className="text-sm text-gray-700">{alert.recommendation}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Trial Design Risk Assessment */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="w-5 h-5" />
              <span>Timeline Risk Analysis</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Phase III Enrollment</span>
                  <span className="text-sm text-gray-600">87% Complete</span>
                </div>
                <Progress value={87} className="h-2" />
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Site Activation</span>
                  <span className="text-sm text-gray-600">94% Complete</span>
                </div>
                <Progress value={94} className="h-2" />
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Regulatory Submissions</span>
                  <span className="text-sm text-gray-600">67% Complete</span>
                </div>
                <Progress value={67} className="h-2" />
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Data Collection</span>
                  <span className="text-sm text-gray-600">78% Complete</span>
                </div>
                <Progress value={78} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Protocol Optimization</CardTitle>
            <p className="text-sm text-muted-foreground">
              AI-powered insights for trial design improvement
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-3 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-900">Enrollment Optimization</h4>
                <p className="text-sm text-blue-700 mt-1">
                  Consider expanding inclusion criteria for primary endpoint - could increase enrollment rate by 23%
                </p>
              </div>
              
              <div className="p-3 bg-green-50 rounded-lg">
                <h4 className="font-medium text-green-900">Site Performance</h4>
                <p className="text-sm text-green-700 mt-1">
                  Top 3 sites contributing 67% of enrollment - consider similar site profiles for future trials
                </p>
              </div>
              
              <div className="p-3 bg-yellow-50 rounded-lg">
                <h4 className="font-medium text-yellow-900">Protocol Amendment Risk</h4>
                <p className="text-sm text-yellow-700 mt-1">
                  Current dropout rate (8%) suggests potential protocol burden - monitor closely
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}