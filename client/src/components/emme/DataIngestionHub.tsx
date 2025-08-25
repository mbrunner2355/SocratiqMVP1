import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Database, 
  Upload,
  Activity,
  Globe,
  Shield,
  Zap,
  FileText,
  Users,
  Building,
  Workflow,
  Brain,
  CheckCircle,
  AlertCircle,
  Clock
} from "lucide-react";

export function DataIngestionHub() {
  const dataConnectors = [
    {
      type: "Salesforce Health Cloud",
      category: "CRM Integration",
      status: "active",
      description: "Patient journey data, HCP interactions, territory management",
      records: "2.4M records/month",
      lastSync: "2 minutes ago",
      icon: <Users className="w-5 h-5" />
    },
    {
      type: "Epic MyChart", 
      category: "EMR Integration",
      status: "active",
      description: "Patient outcomes, treatment patterns, adherence data",
      records: "847K records/month", 
      lastSync: "5 minutes ago",
      icon: <FileText className="w-5 h-5" />
    },
    {
      type: "Veeva Vault",
      category: "Content Management", 
      status: "active",
      description: "Regulatory submissions, promotional materials, MLR assets",
      records: "156K documents/month",
      lastSync: "1 minute ago", 
      icon: <Shield className="w-5 h-5" />
    },
    {
      type: "CMS Policy Portal",
      category: "Regulatory Monitoring",
      status: "active", 
      description: "Medicare/Medicaid updates, formulary changes, coverage policies",
      records: "3.2K updates/month",
      lastSync: "Real-time",
      icon: <Building className="w-5 h-5" />
    }
  ];

  const processingPipeline = [
    {
      stage: "Data Ingestion",
      description: "REST/GraphQL APIs ingest structured & unstructured data",
      technologies: ["REST API", "GraphQL", "PDF Parser", "OCR"],
      throughput: "12.7TB/month",
      status: "operational"
    },
    {
      stage: "NLP Processing", 
      description: "Entity extraction, ontology mapping, semantic analysis",
      technologies: ["Named Entity Recognition", "UMLS Mapping", "BioBERT"],
      throughput: "847K entities/month",
      status: "operational"
    },
    {
      stage: "Knowledge Graph",
      description: "Semantic graph insertion, relationship mapping", 
      technologies: ["Neo4j", "RDF Triples", "Ontology Alignment"],
      throughput: "2.1M relationships/month",
      status: "operational"
    },
    {
      stage: "AI Analysis",
      description: "Equity-trained agents, scenario modeling, compliance",
      technologies: ["Transformer Models", "Bias Detection", "TraceUnits™"],
      throughput: "456K insights/month", 
      status: "operational"
    }
  ];

  const tenantMetrics = [
    {
      tenant: "GlobalPharma Enterprise",
      region: "North America",
      languages: ["English", "Spanish", "French"],
      dataVolume: "4.2TB",
      compliance: "SOC 2, HIPAA, GxP",
      customWorkflows: 23
    },
    {
      tenant: "EuropePharma Ltd",
      region: "EMEA", 
      languages: ["English", "German", "French", "Italian"],
      dataVolume: "2.8TB",
      compliance: "GDPR, MHRA, EMA",
      customWorkflows: 18
    },
    {
      tenant: "AsiaPacific Biopharma",
      region: "APAC",
      languages: ["English", "Japanese", "Mandarin", "Korean"], 
      dataVolume: "1.9TB",
      compliance: "PMDA, TGA, NMPA",
      customWorkflows: 12
    }
  ];

  const traceUnits = [
    {
      id: "TU-2025-0011847",
      action: "Market Access Decision",
      timestamp: "2025-01-11 13:45:22 UTC",
      agent: "Equity-AI Agent 7",
      confidence: 94,
      inputs: ["Payer policy updates", "Patient demographic data", "Clinical outcomes"],
      decision: "Recommend tier 2 formulary positioning for underserved populations",
      auditTrail: "Complete"
    },
    {
      id: "TU-2025-0011846", 
      action: "MLR Content Review",
      timestamp: "2025-01-11 13:42:18 UTC",
      agent: "Compliance-AI Agent 3",
      confidence: 98,
      inputs: ["Content assets", "Regulatory guidelines", "Medical accuracy"],
      decision: "Approved with minor modifications - cultural sensitivity enhanced",
      auditTrail: "Complete"
    }
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Data Integration & Processing Hub</h1>
          <p className="text-gray-600 mt-2">
            Real-time ingestion, transformation, and analysis of structured and unstructured life sciences data
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Badge className="bg-green-100 text-green-800">
            <Activity className="w-3 h-3 mr-1" />
            All Systems Operational
          </Badge>
          <Button size="sm">
            <Upload className="w-4 h-4 mr-2" />
            Configure Integration
          </Button>
        </div>
      </div>

      {/* Data Connectors */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Database className="w-5 h-5 text-blue-600" />
            <span>Active Data Connectors</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {dataConnectors.map((connector, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-100 rounded-full text-blue-600">
                      {connector.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{connector.type}</h3>
                      <Badge className="bg-gray-100 text-gray-800 text-xs">
                        {connector.category}
                      </Badge>
                    </div>
                  </div>
                  <Badge className="bg-green-100 text-green-800">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Active
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 mb-3">{connector.description}</p>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Throughput:</span>
                    <span className="font-medium">{connector.records}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Last Sync:</span>
                    <span className="text-green-600">{connector.lastSync}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Processing Pipeline */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Workflow className="w-5 h-5 text-purple-600" />
            <span>Data Processing Pipeline</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {processingPipeline.map((stage, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-gray-900">{stage.stage}</h3>
                  <Badge className="bg-green-100 text-green-800">
                    {stage.status}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 mb-3">{stage.description}</p>
                <div className="flex flex-wrap gap-2 mb-3">
                  {stage.technologies.map((tech, techIndex) => (
                    <Badge key={techIndex} className="bg-blue-100 text-blue-800 text-xs">
                      {tech}
                    </Badge>
                  ))}
                </div>
                <div className="text-sm">
                  <span className="text-gray-500">Throughput: </span>
                  <span className="font-medium text-purple-600">{stage.throughput}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Multi-Tenant Architecture */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Globe className="w-5 h-5 text-green-600" />
            <span>Multi-Tenant Deployment Status</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {tenantMetrics.map((tenant, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-gray-900">{tenant.tenant}</h3>
                  <div className="flex items-center space-x-2">
                    <Badge className="bg-blue-100 text-blue-800">{tenant.region}</Badge>
                    <Badge className="bg-green-100 text-green-800">Active</Badge>
                  </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Languages:</span>
                    <div className="font-medium">{tenant.languages.join(", ")}</div>
                  </div>
                  <div>
                    <span className="text-gray-500">Data Volume:</span>
                    <div className="font-medium">{tenant.dataVolume}</div>
                  </div>
                  <div>
                    <span className="text-gray-500">Compliance:</span>
                    <div className="font-medium">{tenant.compliance}</div>
                  </div>
                  <div>
                    <span className="text-gray-500">Custom Workflows:</span>
                    <div className="font-medium">{tenant.customWorkflows}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* TraceUnits™ Audit Trail */}
      <Card className="border-l-4 border-l-orange-500">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="w-5 h-5 text-orange-600" />
            <span>TraceUnits™ - Audit-Ready Decision Tracking</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {traceUnits.map((unit, index) => (
              <div key={index} className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-orange-900">{unit.id}</h3>
                    <p className="text-sm text-orange-700">{unit.action}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className="bg-orange-100 text-orange-800">
                      {unit.confidence}% Confidence
                    </Badge>
                    <Badge className="bg-green-100 text-green-800">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      {unit.auditTrail}
                    </Badge>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-sm">
                    <span className="text-orange-600 font-medium">Agent:</span> {unit.agent} • 
                    <span className="text-orange-600 font-medium"> Timestamp:</span> {unit.timestamp}
                  </div>
                  <div className="text-sm">
                    <span className="text-orange-600 font-medium">Inputs:</span> {unit.inputs.join(", ")}
                  </div>
                  <div className="text-sm">
                    <span className="text-orange-600 font-medium">Decision:</span> {unit.decision}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}