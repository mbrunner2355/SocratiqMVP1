import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AlertTriangle, FileText, Users, TrendingUp, Brain, Search, Target } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

interface AnalysisResult {
  type: string;
  subject: string;
  findings: string[];
  confidence: number;
  evidence: {
    documentId: string;
    excerpt: string;
    relevance: number;
  }[];
}

export function SophieAnalysis() {
  const [selectedDocument, setSelectedDocument] = useState('');
  const [entityQuery, setEntityQuery] = useState('');
  const [riskQuery, setRiskQuery] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Document Analysis
  const documentAnalysisMutation = useMutation({
    mutationFn: async (documentId: string) => {
      const response = await apiRequest('/api/sophie/analyze/document', 'POST', { documentId });
      return response;
    },
    onError: (error) => {
      console.error('Document analysis error:', error);
    }
  });

  // Entity Analysis
  const entityAnalysisMutation = useMutation({
    mutationFn: async (entityValue: string) => {
      const response = await apiRequest('/api/sophie/analyze/entity', 'POST', { entityValue });
      return response;
    },
    onError: (error) => {
      console.error('Entity analysis error:', error);
    }
  });

  // Risk Assessment
  const riskAssessmentMutation = useMutation({
    mutationFn: async (query: string) => {
      const response = await apiRequest('/api/sophie/analyze/risks', 'POST', { query });
      return response;
    },
    onError: (error) => {
      console.error('Risk assessment error:', error);
    }
  });

  // Semantic Search
  const semanticSearchMutation = useMutation({
    mutationFn: async (query: string) => {
      const response = await apiRequest('/api/sophie/search', 'POST', { query, limit: 10 });
      return response;
    },
    onError: (error) => {
      console.error('Semantic search error:', error);
    }
  });

  const renderAnalysisResult = (result: AnalysisResult, title: string) => (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Brain className="h-5 w-5" />
          <span>{title}</span>
          <Badge variant="outline">
            {(result.confidence * 100).toFixed(1)}% confidence
          </Badge>
        </CardTitle>
        <CardDescription>Analysis of: {result.subject}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label className="text-sm font-medium">Key Findings</Label>
          <div className="mt-2 space-y-2">
            {result.findings.map((finding, idx) => (
              <div key={idx} className="p-3 bg-muted rounded-lg text-sm">
                {finding}
              </div>
            ))}
          </div>
        </div>
        
        {result.evidence.length > 0 && (
          <div>
            <Label className="text-sm font-medium">Supporting Evidence</Label>
            <div className="mt-2 space-y-2">
              {result.evidence.map((evidence, idx) => (
                <div key={idx} className="p-3 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="secondary" className="text-xs">
                      Relevance: {(evidence.relevance * 100).toFixed(1)}%
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {evidence.excerpt}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );

  const renderSearchResults = (results: any) => (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Search className="h-5 w-5" />
          <span>Search Results</span>
          <Badge variant="outline">
            {(results.results.relevanceScore * 100).toFixed(1)}% relevance
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Tabs defaultValue="documents" className="w-full">
          <TabsList>
            <TabsTrigger value="documents">
              Documents ({results.results.documents?.length || 0})
            </TabsTrigger>
            <TabsTrigger value="entities">
              Entities ({results.results.entities?.length || 0})
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="documents" className="space-y-2">
            <ScrollArea className="h-64">
              {results.results.documents?.map((doc: any, idx: number) => (
                <div key={idx} className="p-3 border rounded-lg mb-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-sm">{doc.originalName}</h4>
                    <Badge variant="outline">{doc.status}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Size: {doc.fileSize} bytes | Type: {doc.fileType}
                  </p>
                </div>
              ))}
            </ScrollArea>
          </TabsContent>
          
          <TabsContent value="entities" className="space-y-2">
            <ScrollArea className="h-64">
              {results.results.entities?.map((entity: any, idx: number) => (
                <div key={idx} className="p-3 border rounded-lg mb-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-sm">{entity.value}</h4>
                    <Badge variant={entity.type === 'PERSON' ? 'default' : 'secondary'}>
                      {entity.type}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Confidence: {((entity.confidence || 0) * 100).toFixed(1)}%
                  </p>
                </div>
              ))}
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="h-5 w-5" />
              <span>Document Analysis</span>
            </CardTitle>
            <CardDescription>
              Deep analysis of individual documents using AI
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="document-id">Document ID</Label>
              <Input
                id="document-id"
                value={selectedDocument}
                onChange={(e) => setSelectedDocument(e.target.value)}
                placeholder="Enter document ID for analysis"
              />
            </div>
            <Button 
              onClick={() => documentAnalysisMutation.mutate(selectedDocument)}
              disabled={!selectedDocument || documentAnalysisMutation.isPending}
              className="w-full"
            >
              {documentAnalysisMutation.isPending ? 'Analyzing...' : 'Analyze Document'}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="h-5 w-5" />
              <span>Entity Relationship Analysis</span>
            </CardTitle>
            <CardDescription>
              Explore connections and relationships between entities
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="entity-query">Entity Name</Label>
              <Input
                id="entity-query"
                value={entityQuery}
                onChange={(e) => setEntityQuery(e.target.value)}
                placeholder="e.g., Dr. Sarah Chen"
              />
            </div>
            <Button 
              onClick={() => entityAnalysisMutation.mutate(entityQuery)}
              disabled={!entityQuery || entityAnalysisMutation.isPending}
              className="w-full"
            >
              {entityAnalysisMutation.isPending ? 'Analyzing...' : 'Analyze Relationships'}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5" />
              <span>Risk Assessment</span>
            </CardTitle>
            <CardDescription>
              Identify and evaluate potential risk factors
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="risk-query">Risk Query</Label>
              <Input
                id="risk-query"
                value={riskQuery}
                onChange={(e) => setRiskQuery(e.target.value)}
                placeholder="e.g., side effects, toxicity, contraindications"
              />
            </div>
            <Button 
              onClick={() => riskAssessmentMutation.mutate(riskQuery)}
              disabled={!riskQuery || riskAssessmentMutation.isPending}
              className="w-full"
            >
              {riskAssessmentMutation.isPending ? 'Assessing...' : 'Assess Risks'}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Target className="h-5 w-5" />
              <span>Semantic Search</span>
            </CardTitle>
            <CardDescription>
              AI-powered search across your knowledge base
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="search-query">Search Query</Label>
              <Input
                id="search-query"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Describe what you're looking for..."
              />
            </div>
            <Button 
              onClick={() => semanticSearchMutation.mutate(searchQuery)}
              disabled={!searchQuery || semanticSearchMutation.isPending}
              className="w-full"
            >
              {semanticSearchMutation.isPending ? 'Searching...' : 'Semantic Search'}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Results Display */}
      {documentAnalysisMutation.data?.success && documentAnalysisMutation.data.analysis &&
        renderAnalysisResult(documentAnalysisMutation.data.analysis, "Document Analysis Results")
      }

      {entityAnalysisMutation.data?.success && entityAnalysisMutation.data.analysis &&
        renderAnalysisResult(entityAnalysisMutation.data.analysis, "Entity Relationship Analysis")
      }

      {riskAssessmentMutation.data?.success && riskAssessmentMutation.data.riskAssessment &&
        renderAnalysisResult(riskAssessmentMutation.data.riskAssessment, "Risk Assessment Results")
      }

      {semanticSearchMutation.data?.success && semanticSearchMutation.data.results &&
        renderSearchResults(semanticSearchMutation.data)
      }
    </div>
  );
}