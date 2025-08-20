import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Shield, FileText, AlertTriangle, TrendingUp, Zap, Globe, Star } from "lucide-react";

export default function IP() {
  const ipMetrics = [
    { label: "Active Patents", value: "247", trend: "+12%" },
    { label: "Federal IP Matches", value: "23", trend: "+18" },
    { label: "IP Risk Score", value: "Low", trend: "Stable" },
    { label: "505(b)(2) Candidates", value: "6", trend: "+2%" },
  ];

  const fedTechOpportunities = [
    {
      title: "NIH Cancer Immunotherapy Patent Portfolio",
      agency: "NIH/NCI",
      status: "Available",
      relevance: "High",
      description: "Novel CAR-T enhancement mechanisms with commercial potential",
      keyTerms: ["Immunotherapy", "CAR-T", "Cancer"],
    },
    {
      title: "FDA Drug Repurposing Database Access",
      agency: "FDA",
      status: "Licensed",
      relevance: "Medium", 
      description: "Comprehensive database of approved drugs for 505(b)(2) pathways",
      keyTerms: ["Drug Repurposing", "505(b)(2)", "Regulatory"],
    },
    {
      title: "DARPA Bioengineering Platform Technology",
      agency: "DARPA",
      status: "Restricted",
      relevance: "Medium",
      description: "Advanced bioengineering tools for accelerated drug development",
      keyTerms: ["Bioengineering", "Platform", "Development"],
    },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div className="border-b border-gray-200 pb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-lg bg-blue-500 flex items-center justify-center">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">IP™</h1>
            <p className="text-gray-600">Intellectual Property Management & Federal Technology Licensing</p>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {ipMetrics.map((metric) => (
          <Card key={metric.label}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{metric.label}</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metric.value}</div>
              <p className="text-xs text-muted-foreground">
                {metric.trend}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* IP Portfolio Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileText className="w-5 h-5" />
            <span>IP Portfolio Management</span>
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Prevent IP missteps and reveal licensing or 505(b)(2) options
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
              <div>
                <h4 className="font-medium text-green-900">Patent Analysis Complete</h4>
                <p className="text-sm text-green-700">Latest portfolio assessment shows strong IP position</p>
              </div>
              <Badge variant="secondary" className="bg-green-100 text-green-800">Active</Badge>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
              <div>
                <h4 className="font-medium text-blue-900">505(b)(2) Opportunities</h4>
                <p className="text-sm text-blue-700">6 potential candidates identified for repositioning</p>
              </div>
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">Review</Badge>
            </div>

            <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <AlertTriangle className="w-5 h-5 text-yellow-600" />
                <div>
                  <h4 className="font-medium text-yellow-900">Expiration Alert</h4>
                  <p className="text-sm text-yellow-700">3 patents expiring within 18 months</p>
                </div>
              </div>
              <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Action Required</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Licensing Intelligence */}
      <Card>
        <CardHeader>
          <CardTitle>Licensing & Partnership Intelligence</CardTitle>
          <p className="text-sm text-muted-foreground">
            Strategic opportunities for IP monetization and risk mitigation
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-blue-600">18</div>
              <div className="text-sm text-gray-600">Active Licensing Opportunities</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-green-600">$2.4M</div>
              <div className="text-sm text-gray-600">Est. Annual Licensing Value</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-purple-600">Low</div>
              <div className="text-sm text-gray-600">Overall IP Risk Level</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Federal Technology Licensing - FedScout */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Zap className="w-5 h-5" />
            <span>Federal Technology Licensing</span>
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            License-ready federal IP that matches your therapeutic focus—not basic science
          </p>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">1,247</div>
                <div className="text-xs text-gray-600">Available Patents</div>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">23</div>
                <div className="text-xs text-gray-600">High Relevance Matches</div>
              </div>
              <div className="text-center p-3 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">12</div>
                <div className="text-xs text-gray-600">Federal Agencies</div>
              </div>
              <div className="text-center p-3 bg-yellow-50 rounded-lg">
                <div className="text-2xl font-bold text-yellow-600">7</div>
                <div className="text-xs text-gray-600">Active Negotiations</div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {fedTechOpportunities.map((opportunity, index) => (
              <div key={index} className="p-4 border rounded-lg hover:bg-gray-50">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-semibold text-gray-900">{opportunity.title}</h4>
                    <p className="text-sm text-gray-600 mt-1">{opportunity.description}</p>
                  </div>
                  <div className="flex flex-col items-end space-y-2">
                    <Badge 
                      variant={opportunity.status === "Available" ? "default" : 
                              opportunity.status === "Licensed" ? "secondary" : "outline"}
                    >
                      {opportunity.status}
                    </Badge>
                    <Badge 
                      variant={opportunity.relevance === "High" ? "default" : "secondary"}
                      className={opportunity.relevance === "High" ? "bg-green-500" : ""}
                    >
                      {opportunity.relevance} Match
                    </Badge>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <span className="text-sm font-medium text-blue-600">{opportunity.agency}</span>
                    <div className="flex flex-wrap gap-1">
                      {opportunity.keyTerms.map((term, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {term}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <Button size="sm" variant="outline">
                    View Details
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Federal Agency Connections */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Globe className="w-5 h-5" />
            <span>Federal Agency Connections</span>
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Real-time access to federal technology transfer offices
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <div>
                <div className="font-medium">NIH Technology Transfer</div>
                <div className="text-sm text-gray-600">Connected</div>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <div>
                <div className="font-medium">FDA Innovation Office</div>
                <div className="text-sm text-gray-600">Connected</div>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg">
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div>
                <div className="font-medium">DARPA Partnerships</div>
                <div className="text-sm text-gray-600">Limited Access</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}