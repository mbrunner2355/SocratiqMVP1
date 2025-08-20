import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  Heart,
  MapPin,
  Shield,
  TrendingDown,
  TrendingUp,
  Users,
  DollarSign,
  AlertTriangle,
  CheckCircle,
  BarChart3,
  Globe,
  Target
} from "lucide-react";

export function EquityAccessModule() {
  const equityMetrics = {
    disparityReduction: 23.4,
    accessPrograms: 47,
    reachUnderserved: "2.3M",
    languageSupport: 34,
    costSavingsPatients: "$67.8M",
    equityScore: 78.2
  };

  const disparityMapping = [
    {
      region: "Southeast United States",
      population: "Rural & Low-Income Communities",
      disparityType: "Geographic Access",
      severity: "high",
      affectedPopulation: 847000,
      keyBarriers: [
        "Limited healthcare provider availability",
        "Transportation challenges",
        "Insurance coverage gaps"
      ],
      interventions: [
        "Telehealth program expansion",
        "Mobile clinic partnerships",
        "Financial assistance programs"
      ],
      outcomes: {
        "Access Improvement": "+34%",
        "Patient Enrollment": "+67%",
        "Health Outcomes": "+23%"
      },
      investment: "$4.2M",
      roi: "280%"
    },
    {
      region: "Urban Northeast",
      population: "Hispanic/Latino Communities",
      disparityType: "Language & Cultural Barriers",
      severity: "medium",
      affectedPopulation: 1230000,
      keyBarriers: [
        "Language communication barriers", 
        "Cultural health beliefs",
        "Distrust of healthcare system"
      ],
      interventions: [
        "Spanish-language education materials",
        "Community health worker program",
        "Culturally adapted care protocols"
      ],
      outcomes: {
        "Treatment Adherence": "+45%",
        "Cultural Competency": "+78%",
        "Community Trust": "+56%"
      },
      investment: "$2.8M",
      roi: "340%"
    },
    {
      region: "Pacific Northwest",
      population: "Native American Tribal Communities",
      disparityType: "Historical & Systemic Barriers",
      severity: "high", 
      affectedPopulation: 156000,
      keyBarriers: [
        "Historical healthcare trauma",
        "Geographic isolation",
        "Limited specialized care access"
      ],
      interventions: [
        "Tribal partnership programs",
        "Traditional medicine integration",
        "Specialist telemedicine access"
      ],
      outcomes: {
        "Community Engagement": "+89%",
        "Treatment Acceptance": "+67%",
        "Health Equity Score": "+45%"
      },
      investment: "$3.1M", 
      roi: "190%"
    }
  ];

  const accessBarriers = [
    {
      category: "Financial Barriers",
      prevalence: 67,
      trend: "-12%",
      description: "Insurance copays, deductibles, and coverage limitations preventing access",
      solutions: [
        {
          name: "Patient Assistance Program",
          reach: "45,000 patients",
          savings: "$23.4M annually",
          eligibility: "Income-based qualification"
        },
        {
          name: "Copay Support Program", 
          reach: "78,000 patients",
          savings: "$15.7M annually",
          eligibility: "Insurance coverage required"
        }
      ],
      demographics: [
        "Uninsured/underinsured populations",
        "Low-income households (<200% FPL)",
        "Medicare/Medicaid beneficiaries"
      ]
    },
    {
      category: "Geographic Barriers",
      prevalence: 34,
      trend: "-8%",
      description: "Rural and remote locations with limited healthcare infrastructure",
      solutions: [
        {
          name: "Telehealth Expansion",
          reach: "23,000 patients", 
          savings: "$8.2M annually",
          eligibility: "Rural residence verification"
        },
        {
          name: "Mobile Clinic Program",
          reach: "12,000 patients",
          savings: "$4.1M annually", 
          eligibility: "Underserved area designation"
        }
      ],
      demographics: [
        "Rural communities",
        "Frontier regions",
        "Transportation-disadvantaged"
      ]
    },
    {
      category: "Cultural & Language Barriers",
      prevalence: 28,
      trend: "-15%",
      description: "Language differences and cultural beliefs affecting healthcare engagement",
      solutions: [
        {
          name: "Multilingual Support Program",
          reach: "34,000 patients",
          savings: "$6.8M annually",
          eligibility: "Primary language other than English"
        },
        {
          name: "Cultural Competency Initiative",
          reach: "89,000 patients",
          savings: "$12.3M annually",
          eligibility: "Minority community membership"
        }
      ],
      demographics: [
        "Non-English speaking populations",
        "Recent immigrants",
        "Cultural minority groups"
      ]
    }
  ];

  const localizedStrategies = [
    {
      region: "California Central Valley",
      community: "Migrant Farmworker Families",
      strategy: "Mobile Healthcare Initiative",
      population: 78000,
      languages: ["Spanish", "Mixteco", "Zapoteco"],
      culturalConsiderations: [
        "Seasonal work schedule accommodation",
        "Family-centered care approach",
        "Traditional remedy integration"
      ],
      partnerships: [
        "Farmworker health clinics",
        "Community-based organizations",
        "Agricultural employers"
      ],
      outcomes: {
        enrollment: "+67%",
        adherence: "+45%",
        satisfaction: "4.8/5"
      }
    },
    {
      region: "Detroit Metropolitan Area",
      community: "African American Urban Population",
      strategy: "Community Health Advocate Program",
      population: 234000,
      languages: ["English", "Arabic"],
      culturalConsiderations: [
        "Historical medical mistrust addressing",
        "Community leader engagement",
        "Culturally relevant health education"
      ],
      partnerships: [
        "Black churches and community centers",
        "Historically Black colleges/universities",
        "Local barbershops and salons"
      ],
      outcomes: {
        enrollment: "+89%",
        adherence: "+56%",
        satisfaction: "4.6/5"
      }
    },
    {
      region: "South Texas Border Region",
      community: "Binational Latino Population",
      strategy: "Cross-Border Care Coordination",
      population: 456000,
      languages: ["Spanish", "English"],
      culturalConsiderations: [
        "Cross-border healthcare patterns",
        "Extended family involvement",
        "Religious and spiritual beliefs integration"
      ],
      partnerships: [
        "Mexican healthcare systems",
        "Federally Qualified Health Centers",
        "Community promotoras programs"
      ],
      outcomes: {
        enrollment: "+123%",
        adherence: "+78%",
        satisfaction: "4.9/5"
      }
    }
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high": return "bg-red-100 text-red-800";
      case "medium": return "bg-yellow-100 text-yellow-800";
      case "low": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Equity & Access</h1>
          <p className="text-gray-600 mt-2">
            Health equity analysis, access barrier mitigation, and localized community engagement strategies
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button size="sm">
            <Heart className="w-4 h-4 mr-2" />
            Launch Initiative
          </Button>
          <Button variant="outline" size="sm">
            <BarChart3 className="w-4 h-4 mr-2" />
            Equity Dashboard
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <TrendingUp className="w-6 h-6 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">{equityMetrics.disparityReduction}%</div>
            <p className="text-sm text-gray-600">Disparity Reduction</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Shield className="w-6 h-6 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">{equityMetrics.accessPrograms}</div>
            <p className="text-sm text-gray-600">Access Programs</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Users className="w-6 h-6 text-purple-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">{equityMetrics.reachUnderserved}</div>
            <p className="text-sm text-gray-600">Reach Underserved</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Globe className="w-6 h-6 text-orange-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">{equityMetrics.languageSupport}</div>
            <p className="text-sm text-gray-600">Language Support</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <DollarSign className="w-6 h-6 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">{equityMetrics.costSavingsPatients}</div>
            <p className="text-sm text-gray-600">Cost Savings</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Target className="w-6 h-6 text-red-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">{equityMetrics.equityScore}</div>
            <p className="text-sm text-gray-600">Equity Score</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="mapping" className="space-y-6">
        <TabsList>
          <TabsTrigger value="mapping">Disparity Mapping</TabsTrigger>
          <TabsTrigger value="barriers">Access Barriers</TabsTrigger>
          <TabsTrigger value="strategies">Localized Strategies</TabsTrigger>
        </TabsList>

        <TabsContent value="mapping" className="space-y-4">
          {disparityMapping.map((disparity, index) => (
            <Card key={index}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-red-100 rounded-full">
                      <MapPin className="w-5 h-5 text-red-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{disparity.region}</CardTitle>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <span>{disparity.population}</span>
                        <span>•</span>
                        <span>{disparity.affectedPopulation.toLocaleString()} affected</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Badge className={getSeverityColor(disparity.severity)}>
                      {disparity.severity} severity
                    </Badge>
                    <div className="text-right">
                      <div className="text-lg font-bold text-green-600">{disparity.roi}</div>
                      <div className="text-sm text-gray-500">ROI</div>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <Badge className="bg-blue-100 text-blue-800 mb-2">
                    {disparity.disparityType}
                  </Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Key Barriers</h4>
                    <div className="space-y-2">
                      {disparity.keyBarriers.map((barrier, barrierIndex) => (
                        <div key={barrierIndex} className="flex items-start space-x-2 text-sm">
                          <AlertTriangle className="w-3 h-3 text-red-500 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-600">{barrier}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Interventions</h4>
                    <div className="space-y-2">
                      {disparity.interventions.map((intervention, interventionIndex) => (
                        <div key={interventionIndex} className="flex items-start space-x-2 text-sm">
                          <CheckCircle className="w-3 h-3 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-600">{intervention}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Outcomes Achieved</h4>
                    <div className="space-y-2">
                      {Object.entries(disparity.outcomes).map(([outcome, value], outcomeIndex) => (
                        <div key={outcomeIndex} className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">{outcome}</span>
                          <Badge className="bg-green-100 text-green-800">
                            {value}
                          </Badge>
                        </div>
                      ))}
                    </div>
                    <div className="mt-3 pt-3 border-t">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Investment</span>
                        <span className="font-medium">{disparity.investment}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="barriers" className="space-y-4">
          {accessBarriers.map((barrier, index) => (
            <Card key={index}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">{barrier.category}</CardTitle>
                    <p className="text-gray-600 mt-1">{barrier.description}</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-1 text-green-600">
                      <TrendingDown className="w-4 h-4" />
                      <span className="font-medium">{barrier.trend}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold">{barrier.prevalence}%</div>
                      <div className="text-sm text-gray-500">Prevalence</div>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Solution Programs</h4>
                    <div className="space-y-3">
                      {barrier.solutions.map((solution, solutionIndex) => (
                        <div key={solutionIndex} className="border rounded-lg p-3">
                          <div className="font-medium text-gray-900 mb-2">{solution.name}</div>
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div>
                              <span className="text-gray-600">Reach:</span>
                              <span className="ml-1 font-medium">{solution.reach}</span>
                            </div>
                            <div>
                              <span className="text-gray-600">Savings:</span>
                              <span className="ml-1 font-medium">{solution.savings}</span>
                            </div>
                          </div>
                          <div className="text-sm text-gray-600 mt-1">
                            <span className="font-medium">Eligibility:</span> {solution.eligibility}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Affected Demographics</h4>
                    <div className="space-y-2">
                      {barrier.demographics.map((demographic, demographicIndex) => (
                        <div key={demographicIndex} className="flex items-center space-x-2 text-sm">
                          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                          <span className="text-gray-600">{demographic}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="strategies" className="space-y-4">
          {localizedStrategies.map((strategy, index) => (
            <Card key={index}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">{strategy.strategy}</CardTitle>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <span>{strategy.region}</span>
                      <span>•</span>
                      <span>{strategy.community}</span>
                      <span>•</span>
                      <span>{strategy.population.toLocaleString()} population</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold">{strategy.outcomes.satisfaction}</div>
                    <div className="text-sm text-gray-500">Satisfaction</div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Language Support</h4>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {strategy.languages.map((language, languageIndex) => (
                        <Badge key={languageIndex} variant="outline">
                          {language}
                        </Badge>
                      ))}
                    </div>

                    <h4 className="font-semibold text-gray-900 mb-2">Cultural Considerations</h4>
                    <div className="space-y-1">
                      {strategy.culturalConsiderations.map((consideration, considerationIndex) => (
                        <div key={considerationIndex} className="flex items-start space-x-2 text-sm">
                          <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-gray-600">{consideration}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Community Partnerships</h4>
                    <div className="space-y-2">
                      {strategy.partnerships.map((partnership, partnershipIndex) => (
                        <div key={partnershipIndex} className="flex items-start space-x-2 text-sm">
                          <Users className="w-3 h-3 text-blue-500 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-600">{partnership}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Impact Metrics</h4>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm text-gray-600">Enrollment</span>
                          <span className="font-medium text-green-600">{strategy.outcomes.enrollment}</span>
                        </div>
                        <Progress value={parseInt(strategy.outcomes.enrollment.replace('%', '').replace('+', ''))} className="h-2 progress-gradient-blue-purple [&>div]:bg-gradient-blue-purple" />
                      </div>
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm text-gray-600">Adherence</span>
                          <span className="font-medium text-green-600">{strategy.outcomes.adherence}</span>
                        </div>
                        <Progress value={parseInt(strategy.outcomes.adherence.replace('%', '').replace('+', ''))} className="h-2 progress-gradient-purple-blue [&>div]:bg-gradient-purple-blue" />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}