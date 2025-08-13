import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Heart,
  Users,
  Pill,
  Calendar,
  Phone,
  MessageSquare,
  TrendingUp,
  Shield,
  DollarSign,
  Award,
  Activity,
  AlertTriangle
} from "lucide-react";

export function PatientPrograms() {
  const programMetrics = {
    totalPatients: 47834,
    activePrograms: 23,
    adherenceRate: 78,
    satisfactionScore: 4.6,
    costSavings: "$12.8M",
    avgEngagementTime: "14.2 min"
  };

  const programs = [
    {
      id: "PP-2025-0067",
      name: "Diabetes Care Journey",
      therapeuticArea: "Endocrinology",
      status: "Active",
      enrolledPatients: 12847,
      targetEnrollment: 15000,
      adherenceRate: 84,
      satisfactionScore: 4.7,
      completionRate: 76,
      costPerPatient: "$347",
      outcomes: {
        hba1cReduction: "1.2%",
        hospitalizations: "-23%",
        emergencyVisits: "-31%"
      },
      services: [
        "Medication adherence coaching",
        "Nutritional counseling", 
        "Glucose monitoring support",
        "Educational materials",
        "24/7 nurse hotline"
      ],
      duration: "12 months",
      launch: "Jan 2024"
    },
    {
      id: "PP-2025-0068",
      name: "Oncology Support Network",
      therapeuticArea: "Oncology", 
      status: "Active",
      enrolledPatients: 8934,
      targetEnrollment: 10000,
      adherenceRate: 91,
      satisfactionScore: 4.8,
      completionRate: 88,
      costPerPatient: "$892",
      outcomes: {
        treatmentCompletion: "+15%",
        qualityOfLife: "+34%",
        sideEffectManagement: "+28%"
      },
      services: [
        "Oncology nurse navigation",
        "Financial assistance program",
        "Symptom management support",
        "Caregiver resources",
        "Peer support groups"
      ],
      duration: "Treatment duration",
      launch: "Mar 2024"
    },
    {
      id: "PP-2025-0069", 
      name: "Heart Health Champions",
      therapeuticArea: "Cardiology",
      status: "Pilot",
      enrolledPatients: 1456,
      targetEnrollment: 5000,
      adherenceRate: 72,
      satisfactionScore: 4.4,
      completionRate: 68,
      costPerPatient: "$245",
      outcomes: {
        bpControl: "+19%",
        lipidManagement: "+12%",
        lifestyleAdherence: "+41%"
      },
      services: [
        "Heart health coaching",
        "Blood pressure monitoring",
        "Lifestyle modification support",
        "Medication reminders",
        "Telehealth consultations"
      ],
      duration: "6 months",
      launch: "Oct 2024"
    }
  ];

  const patientJourney = [
    {
      stage: "Identification & Enrollment",
      description: "AI-powered patient identification through EMR screening and provider referrals",
      metrics: {
        "Eligible Patients": "89,234",
        "Enrollment Rate": "34%",
        "Time to Enrollment": "3.2 days"
      },
      touchpoints: ["Provider referral", "EMR alerts", "Patient outreach", "Digital enrollment"]
    },
    {
      stage: "Onboarding & Assessment", 
      description: "Comprehensive health assessment and personalized program customization",
      metrics: {
        "Assessment Completion": "92%",
        "Risk Stratification": "100%",
        "Care Plan Creation": "2.1 days"
      },
      touchpoints: ["Health questionnaire", "Clinical data review", "Risk assessment", "Goal setting"]
    },
    {
      stage: "Active Engagement",
      description: "Ongoing support through multi-channel communication and interventions",
      metrics: {
        "Monthly Touchpoints": "8.4",
        "Response Rate": "73%",
        "Satisfaction": "4.6/5"
      },
      touchpoints: ["Medication reminders", "Educational content", "Nurse consultations", "Peer support"]
    },
    {
      stage: "Outcome Monitoring",
      description: "Continuous tracking of clinical and behavioral outcomes with adaptive interventions",
      metrics: {
        "Data Collection": "97%",
        "Outcome Improvement": "68%",
        "Program Retention": "84%"
      },
      touchpoints: ["Clinical monitoring", "Patient-reported outcomes", "Biomarker tracking", "Progress reviews"]
    }
  ];

  const adherenceInsights = [
    {
      factor: "Medication Complexity",
      impact: "High",
      description: "Patients on complex regimens (>3 medications) show 23% lower adherence",
      recommendation: "Implement pill packaging and simplified dosing schedules"
    },
    {
      factor: "Socioeconomic Status",
      impact: "High", 
      description: "Lower-income patients face 31% higher discontinuation rates",
      recommendation: "Enhance financial assistance and transportation support programs"
    },
    {
      factor: "Digital Engagement",
      impact: "Medium",
      description: "Patients using mobile app show 18% better adherence outcomes",
      recommendation: "Increase digital literacy support and mobile app adoption"
    },
    {
      factor: "Peer Support Participation",
      impact: "Medium",
      description: "Peer support group members maintain 15% higher program completion",
      recommendation: "Expand peer mentorship and community building initiatives"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active": return "bg-green-100 text-green-800";
      case "Pilot": return "bg-purple-100 text-purple-800";
      case "Planning": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Patient Programs</h1>
          <p className="text-gray-600 mt-2">
            Patient support services and adherence program management
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button size="sm" className="bg-purple-600 hover:bg-purple-700 text-white">
            <Users className="w-4 h-4 mr-2" />
            Enroll Patients
          </Button>
          <Button variant="outline" size="sm">
            <Activity className="w-4 h-4 mr-2" />
            Program Analytics
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <Users className="w-6 h-6 text-purple-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">{programMetrics.totalPatients.toLocaleString()}</div>
            <p className="text-sm text-gray-600">Total Patients</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Heart className="w-6 h-6 text-red-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">{programMetrics.activePrograms}</div>
            <p className="text-sm text-gray-600">Active Programs</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Pill className="w-6 h-6 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">{programMetrics.adherenceRate}%</div>
            <p className="text-sm text-gray-600">Adherence Rate</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Award className="w-6 h-6 text-purple-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">{programMetrics.satisfactionScore}</div>
            <p className="text-sm text-gray-600">Satisfaction Score</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <DollarSign className="w-6 h-6 text-orange-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">{programMetrics.costSavings}</div>
            <p className="text-sm text-gray-600">Cost Savings</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <TrendingUp className="w-6 h-6 text-indigo-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">{programMetrics.avgEngagementTime}</div>
            <p className="text-sm text-gray-600">Avg Engagement</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="programs" className="space-y-6">
        <TabsList>
          <TabsTrigger value="programs">Active Programs</TabsTrigger>
          <TabsTrigger value="journey">Patient Journey</TabsTrigger>
          <TabsTrigger value="insights">Adherence Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="programs" className="space-y-4">
          {programs.map((program, index) => (
            <Card key={index}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-purple-100 rounded-full">
                      <Heart className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{program.name}</CardTitle>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <span>{program.therapeuticArea}</span>
                        <span>•</span>
                        <span>Launched {program.launch}</span>
                        <span>•</span>
                        <span>{program.id}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Badge className={getStatusColor(program.status)}>
                      {program.status}
                    </Badge>
                    <div className="text-right">
                      <div className="text-lg font-bold">{program.enrolledPatients.toLocaleString()}</div>
                      <div className="text-sm text-gray-500">Enrolled Patients</div>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  {/* Enrollment Progress */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Enrollment Progress</h4>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm text-gray-600">Target Progress</span>
                          <span className="font-medium">{Math.round((program.enrolledPatients / program.targetEnrollment) * 100)}%</span>
                        </div>
                        <Progress value={(program.enrolledPatients / program.targetEnrollment) * 100} className="h-2 progress-gradient-blue-purple [&>div]:bg-gradient-blue-purple" />
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Duration</span>
                        <span className="font-medium">{program.duration}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Cost per Patient</span>
                        <span className="font-medium">{program.costPerPatient}</span>
                      </div>
                    </div>
                  </div>

                  {/* Performance Metrics */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Performance</h4>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm text-gray-600">Adherence</span>
                          <span className="font-medium">{program.adherenceRate}%</span>
                        </div>
                        <Progress value={program.adherenceRate} className="h-2 progress-gradient-purple-blue [&>div]:bg-gradient-purple-blue" />
                      </div>
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm text-gray-600">Completion</span>
                          <span className="font-medium">{program.completionRate}%</span>
                        </div>
                        <Progress value={program.completionRate} className="h-2 progress-gradient-blue-purple [&>div]:bg-gradient-blue-purple" />
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Satisfaction</span>
                        <span className="font-medium">{program.satisfactionScore}/5.0</span>
                      </div>
                    </div>
                  </div>

                  {/* Clinical Outcomes */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Clinical Outcomes</h4>
                    <div className="space-y-2">
                      {Object.entries(program.outcomes).map(([outcome, value], outcomeIndex) => (
                        <div key={outcomeIndex} className="flex justify-between items-center">
                          <span className="text-sm text-gray-600 capitalize">{outcome.replace(/([A-Z])/g, ' $1')}</span>
                          <Badge className={value.startsWith('+') || value.includes('-') && value.includes('visits') ? 'bg-green-100 text-green-800' : 'bg-purple-100 text-purple-800'}>
                            {value}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Program Services */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Services Provided</h4>
                    <div className="space-y-1">
                      {program.services.slice(0, 3).map((service, serviceIndex) => (
                        <div key={serviceIndex} className="flex items-start space-x-2 text-sm">
                          <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-gray-600">{service}</span>
                        </div>
                      ))}
                      {program.services.length > 3 && (
                        <div className="text-sm text-purple-600">
                          +{program.services.length - 3} more services
                        </div>
                      )}
                    </div>
                    <div className="mt-4 flex space-x-2">
                      <Button size="sm" className="bg-purple-600 hover:bg-purple-700 text-white">
                        <Users className="w-4 h-4 mr-1" />
                        View Patients
                      </Button>
                      <Button size="sm" variant="outline">
                        <Activity className="w-4 h-4 mr-1" />
                        Analytics
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="journey" className="space-y-4">
          {patientJourney.map((stage, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="text-lg">{stage.stage}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">{stage.description}</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Key Metrics</h4>
                    <div className="space-y-2">
                      {Object.entries(stage.metrics).map(([metric, value], metricIndex) => (
                        <div key={metricIndex} className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">{metric}</span>
                          <span className="font-medium">{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Touchpoints</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {stage.touchpoints.map((touchpoint, touchpointIndex) => (
                        <Badge key={touchpointIndex} variant="outline" className="text-xs">
                          {touchpoint}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="insights" className="space-y-4">
          {adherenceInsights.map((insight, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start space-x-3">
                    <AlertTriangle className={`w-5 h-5 mt-0.5 ${insight.impact === 'High' ? 'text-red-600' : 'text-yellow-600'}`} />
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{insight.factor}</h3>
                      <p className="text-gray-600 mt-1">{insight.description}</p>
                    </div>
                  </div>
                  <Badge className={insight.impact === 'High' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}>
                    {insight.impact} Impact
                  </Badge>
                </div>
                <div className="bg-purple-50 border-l-4 border-purple-500 p-4">
                  <p className="text-sm text-purple-800">
                    <span className="font-medium">Recommendation: </span>
                    {insight.recommendation}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}