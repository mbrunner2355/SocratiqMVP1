import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Shield, 
  AlertCircle,
  TrendingUp,
  Clock,
  Bell,
  FileText,
  Users,
  DollarSign,
  Globe,
  Activity
} from "lucide-react";

export function PayerLandscape() {
  const regulatoryAlerts = [
    {
      source: "CMS",
      title: "Medicare Part D Coverage Determination Updates",
      category: "Formulary Changes",
      urgency: "High",
      published: "2 hours ago",
      summary: "New clinical criteria for specialty tier placements affecting oncology and rare disease portfolios",
      impact: "Potential coverage restrictions for 12 branded therapies"
    },
    {
      source: "FDA",
      title: "Risk Evaluation and Mitigation Strategy (REMS) Guidance",
      category: "Safety Requirements", 
      urgency: "Medium",
      published: "6 hours ago",
      summary: "Updated REMS requirements for CAR-T cell therapies and gene treatments",
      impact: "Enhanced monitoring protocols required for market access"
    },
    {
      source: "ICER",
      title: "Cost-Effectiveness Assessment Draft Report",
      category: "HTA Review",
      urgency: "Medium", 
      published: "1 day ago",
      summary: "Preliminary findings on novel diabetes treatments suggest mixed value proposition",
      impact: "Potential payer hesitation for preferred tier placement"
    }
  ];

  const payerIntelligence = [
    {
      payer: "Anthem/Elevance Health",
      coverage: "45.2M lives",
      recentChanges: 3,
      favorability: 72,
      keyUpdates: [
        "Enhanced prior authorization for targeted therapies",
        "New outcomes-based contracts for rare diseases",
        "Digital therapeutics pilot program launched"
      ],
      strategy: "Value-based care focus with emphasis on real-world evidence"
    },
    {
      payer: "UnitedHealthcare", 
      coverage: "53.1M lives",
      recentChanges: 5,
      favorability: 68,
      keyUpdates: [
        "Formulary expansion for biosimilars",
        "Step therapy modifications in oncology",
        "AI-powered prior auth system rollout"
      ],
      strategy: "Technology-driven utilization management with cost containment priority"
    },
    {
      payer: "CVS Health/Aetna",
      coverage: "34.1M lives", 
      recentChanges: 2,
      favorability: 79,
      keyUpdates: [
        "Specialty pharmacy integration expansion",
        "Patient support program partnerships",
        "Value-based care model enhancements"
      ],
      strategy: "Integrated care delivery with emphasis on patient outcomes"
    }
  ];

  const accessBarriers = [
    {
      barrier: "Prior Authorization Complexity",
      prevalence: 89,
      impactScore: 8.2,
      affectedTherapeutics: ["Oncology", "Immunology", "Neurology"],
      solution: "Automated prior auth platforms and real-world evidence packages"
    },
    {
      barrier: "Step Therapy Requirements",
      prevalence: 76, 
      impactScore: 7.1,
      affectedTherapeutics: ["Cardiology", "Diabetes", "Mental Health"],
      solution: "Clinical pathway optimization and HCP education programs"
    },
    {
      barrier: "Specialty Pharmacy Restrictions", 
      prevalence: 62,
      impactScore: 6.8,
      affectedTherapeutics: ["Rare Disease", "Oncology", "Immunology"],
      solution: "Hub services integration and patient support enhancements"
    }
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Payer & Regulatory Monitor</h1>
          <p className="text-gray-600 mt-2">
            Real-time intelligence on payer policies, regulatory changes, and market access barriers
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Badge className="bg-red-100 text-red-800">
            <Bell className="w-3 h-3 mr-1" />
            3 New Alerts
          </Badge>
          <Button size="sm">
            <Activity className="w-4 h-4 mr-2" />
            Monitor Setup
          </Button>
        </div>
      </div>

      {/* Regulatory Alerts */}
      <Card className="border-l-4 border-l-red-500">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <span>Regulatory & Policy Alerts</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {regulatoryAlerts.map((alert, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <Badge className={
                      alert.source === 'CMS' ? 'bg-blue-100 text-blue-800' :
                      alert.source === 'FDA' ? 'bg-green-100 text-green-800' :
                      'bg-purple-100 text-purple-800'
                    }>
                      {alert.source}
                    </Badge>
                    <Badge className={
                      alert.urgency === 'High' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }>
                      {alert.urgency} Priority
                    </Badge>
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <Clock className="w-4 h-4 mr-1" />
                    {alert.published}
                  </div>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{alert.title}</h3>
                <p className="text-sm text-gray-700 mb-2">{alert.summary}</p>
                <div className="p-2 bg-orange-50 rounded text-xs text-orange-800">
                  <strong>Impact:</strong> {alert.impact}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Payer Intelligence Dashboard */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="w-5 h-5 text-blue-600" />
            <span>Payer Intelligence Dashboard</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {payerIntelligence.map((payer, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-gray-900 text-lg">{payer.payer}</h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span className="flex items-center">
                        <Users className="w-4 h-4 mr-1" />
                        {payer.coverage}
                      </span>
                      <span className="flex items-center">
                        <FileText className="w-4 h-4 mr-1" />
                        {payer.recentChanges} recent changes
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-green-600">{payer.favorability}%</div>
                    <div className="text-xs text-gray-500">Favorability Score</div>
                  </div>
                </div>
                
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">Market Access Favorability</span>
                    <span className="text-sm text-gray-600">{payer.favorability}%</span>
                  </div>
                  <Progress value={payer.favorability} className="h-2 progress-gradient-blue-purple [&>div]:bg-gradient-blue-purple" />
                </div>

                <div className="mb-4">
                  <h4 className="font-medium text-gray-900 mb-2">Recent Policy Updates</h4>
                  <div className="space-y-1">
                    {payer.keyUpdates.map((update, updateIndex) => (
                      <div key={updateIndex} className="text-sm text-gray-600 flex items-start">
                        <div className="w-1.5 h-1.5 bg-purple-600 rounded-full mt-2 mr-2 flex-shrink-0"></div>
                        {update}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-3 bg-blue-50 rounded">
                  <h5 className="font-medium text-blue-900 mb-1">Strategic Assessment</h5>
                  <p className="text-sm text-blue-700">{payer.strategy}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Access Barriers Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-orange-600" />
            <span>Market Access Barrier Analysis</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {accessBarriers.map((barrier, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-gray-900">{barrier.barrier}</h3>
                  <div className="flex items-center space-x-3">
                    <Badge className="bg-orange-100 text-orange-800">
                      Impact: {barrier.impactScore}/10
                    </Badge>
                  </div>
                </div>
                
                <div className="mb-3">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-gray-600">Prevalence across payers</span>
                    <span className="text-sm font-medium">{barrier.prevalence}%</span>
                  </div>
                  <Progress value={barrier.prevalence} className="h-2 progress-gradient-purple-blue [&>div]:bg-gradient-purple-blue" />
                </div>

                <div className="mb-3">
                  <span className="text-sm font-medium text-gray-700">Affected Therapeutic Areas:</span>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {barrier.affectedTherapeutics.map((therapeutic, thIndex) => (
                      <Badge key={thIndex} className="bg-gray-100 text-gray-800 text-xs">
                        {therapeutic}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="p-3 bg-green-50 rounded">
                  <span className="text-sm font-medium text-green-900">Recommended Solution: </span>
                  <span className="text-sm text-green-700">{barrier.solution}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}