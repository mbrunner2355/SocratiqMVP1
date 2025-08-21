import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Zap, FileSearch, Globe, Star } from "lucide-react";

export default function FedScout() {
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
          <div className="w-10 h-10 rounded-lg bg-yellow-500 flex items-center justify-center">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">FedScout</h1>
            <p className="text-gray-600">Federal Technology Licensing Intelligence</p>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available Patents</CardTitle>
            <FileSearch className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,247</div>
            <p className="text-xs text-muted-foreground">+18 this week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">High Relevance</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">23</div>
            <p className="text-xs text-muted-foreground">Match criteria</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Federal Agencies</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">Connected</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Licenses</CardTitle>
            <FileSearch className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">7</div>
            <p className="text-xs text-muted-foreground">In negotiation</p>
          </CardContent>
        </Card>
      </div>

      {/* Federal Technology Opportunities */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Globe className="w-5 h-5" />
            <span>Federal Technology Scanner</span>
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            License-ready federal IP that matches your therapeutic focus—not basic science
          </p>
        </CardHeader>
        <CardContent>
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

      {/* Integration Status */}
      <Card>
        <CardHeader>
          <CardTitle>Federal Agency Connections</CardTitle>
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