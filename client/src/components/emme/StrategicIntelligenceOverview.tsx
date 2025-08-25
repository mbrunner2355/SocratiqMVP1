import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Brain, 
  TrendingUp,
  Shield,
  Target,
  BarChart3,
  Globe,
  Zap,
  Users,
  FileText,
  Activity,
  AlertTriangle,
  Clock,
  DollarSign
} from "lucide-react";

export function StrategicIntelligenceOverview() {
  const capabilities = [
    {
      category: "Market Intelligence",
      icon: <TrendingUp className="w-6 h-6" />,
      color: "bg-blue-500",
      features: [
        "Real-time therapeutic area trend analysis",
        "Competitive landscape monitoring", 
        "Market opportunity identification",
        "AI-powered strategic recommendations"
      ],
      metrics: {
        label: "Market Insights Generated",
        value: "2,847",
        trend: "+23%"
      }
    },
    {
      category: "Payer & Regulatory Intelligence",
      icon: <Shield className="w-6 h-6" />,
      color: "bg-green-500", 
      features: [
        "CMS, FDA, ICER policy monitoring",
        "Payer formulary change tracking",
        "Access barrier identification",
        "Regulatory compliance orchestration"
      ],
      metrics: {
        label: "Policy Changes Tracked", 
        value: "1,432",
        trend: "+67%"
      }
    },
    {
      category: "Stakeholder Engagement",
      icon: <Users className="w-6 h-6" />,
      color: "bg-purple-500",
      features: [
        "HCP engagement optimization",
        "Patient program orchestration", 
        "KOL relationship management",
        "Multichannel campaign coordination"
      ],
      metrics: {
        label: "Stakeholder Interactions",
        value: "847K",
        trend: "+34%"
      }
    },
    {
      category: "Content Orchestration",
      icon: <FileText className="w-6 h-6" />,
      color: "bg-orange-500",
      features: [
        "MLR workflow automation",
        "Content performance optimization",
        "Multilingual campaign management", 
        "Compliance monitoring & reporting"
      ],
      metrics: {
        label: "Content Assets Managed",
        value: "12,394",
        trend: "+156%"
      }
    }
  ];

  const dataIngestion = [
    {
      source: "PDFs & Documents",
      types: "Regulatory filings, clinical studies, policy documents",
      volume: "847 documents/month",
      processing: "OCR + NLP extraction"
    },
    {
      source: "Payer Portals", 
      types: "Formulary changes, prior auth updates, coverage policies",
      volume: "2,341 updates/month",
      processing: "API integration"
    },
    {
      source: "CMS Updates",
      types: "Medicare/Medicaid policies, reimbursement changes",
      volume: "156 updates/month", 
      processing: "Real-time monitoring"
    },
    {
      source: "EMR/CRM Data",
      types: "Patient outcomes, HCP interactions, treatment patterns",
      volume: "9.8M records/month",
      processing: "FHIR/HL7 integration"
    }
  ];

  return (
    <div className="p-6 space-y-8">
      <div className="text-center max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          EMME Engage Strategic Intelligence Platform
        </h1>
        <p className="text-xl text-gray-600 mb-6">
          REST/GraphQL APIs for ingestion, transformation, and analysis of structured and unstructured life sciences data. 
          Performs NLP entity extraction, ontology mapping, and semantic graph insertion with equity-trained AI agents.
        </p>
        <div className="flex justify-center space-x-4">
          <Badge className="bg-blue-100 text-blue-800 px-4 py-2">
            REST & GraphQL APIs
          </Badge>
          <Badge className="bg-green-100 text-green-800 px-4 py-2">
            NLP Entity Extraction
          </Badge>
          <Badge className="bg-purple-100 text-purple-800 px-4 py-2">
            TraceUnits™ Audit
          </Badge>
          <Badge className="bg-orange-100 text-orange-800 px-4 py-2">
            Multi-Tenant Architecture
          </Badge>
        </div>
      </div>

      {/* Core Capabilities */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {capabilities.map((capability, index) => (
          <Card key={index} className="border-l-4" style={{ borderLeftColor: capability.color.replace('bg-', '#') + '500' }}>
            <CardHeader>
              <CardTitle className="flex items-center space-x-3">
                <div className={`p-2 rounded-full ${capability.color} text-white`}>
                  {capability.icon}
                </div>
                <span>{capability.category}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <ul className="space-y-2">
                  {capability.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start space-x-2 text-sm text-gray-600">
                      <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <div className="pt-3 border-t">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">{capability.metrics.label}</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-lg font-bold text-gray-900">{capability.metrics.value}</span>
                      <Badge className="bg-green-100 text-green-800 text-xs">
                        {capability.metrics.trend}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Data Ingestion & Processing */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Activity className="w-5 h-5 text-blue-600" />
            <span>Multi-Source Data Ingestion & Transformation</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-6">
            Multi-source data ingestion with REST/GraphQL APIs, performing NLP entity extraction, ontology mapping (UMLS/SNOMED), 
            and semantic graph insertion for real-time policy monitoring and equity-aware targeting
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {dataIngestion.map((source, index) => (
              <div key={index} className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2">{source.source}</h4>
                <p className="text-sm text-gray-600 mb-3">{source.types}</p>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-500">Volume:</span>
                    <span className="font-medium">{source.volume}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-500">Processing:</span>
                    <Badge className="bg-blue-100 text-blue-800 text-xs">
                      {source.processing}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Strategic Intelligence Outcomes */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-6 text-center">
            <Clock className="w-8 h-8 text-blue-600 mx-auto mb-3" />
            <div className="text-2xl font-bold text-blue-900 mb-1">Weeks, Not Years</div>
            <p className="text-sm text-blue-700">
              Move from reactive decision-making to proactive, precision execution
            </p>
          </CardContent>
        </Card>

        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-6 text-center">
            <Globe className="w-8 h-8 text-green-600 mx-auto mb-3" />
            <div className="text-2xl font-bold text-green-900 mb-1">Global Reach</div>
            <p className="text-sm text-green-700">
              Multilingual campaigns with localized, culturally-adapted strategies
            </p>
          </CardContent>
        </Card>

        <Card className="bg-purple-50 border-purple-200">
          <CardContent className="p-6 text-center">
            <Target className="w-8 h-8 text-purple-600 mx-auto mb-3" />
            <div className="text-2xl font-bold text-purple-900 mb-1">Precision Execution</div>
            <p className="text-sm text-purple-700">
              Equity-trained AI agents identify disparities and optimize access
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Value Proposition */}
      <Card className="border-l-4 border-l-orange-500 bg-orange-50">
        <CardContent className="p-6">
          <div className="flex items-start space-x-4">
            <div className="bg-orange-500 p-2 rounded-full text-white">
              <Zap className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-orange-900 mb-2">Enterprise Integration Ready</h3>
              <p className="text-orange-800 mb-4">
                Partner integrations with Salesforce Health Cloud, Epic MyChart, and Veeva Vault. 
                Tenant isolation, custom workflows, and localization support for multilingual, geographically distributed deployments.
              </p>
              <div className="flex flex-wrap gap-2">
                <Button size="sm" className="bg-orange-600 hover:bg-orange-700">
                  Explore Data Platform
                </Button>
                <Button size="sm" variant="outline" className="border-orange-600 text-orange-700">
                  View API Documentation
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}