import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Brain, Zap, Network, TrendingUp, Clock, FileText, Microscope, Target } from "lucide-react";

interface AdvancedNLPResult {
  entities: Array<{
    type: string;
    value: string;
    confidence: number;
    semanticEnrichment?: {
      biomedicalConcepts: string[];
      domainSpecialization: string;
      confidenceScore: number;
    };
    meshConnections?: Array<{
      nodeId: string;
      nodeType: string;
      relationshipType: string;
      confidence: number;
    }>;
  }>;
  biomedicalConcepts: string[];
  semanticTags: string[];
  domainClassification: {
    primaryDomain: string;
    subDomains: string[];
    confidence: number;
    specializations: string[];
  };
  sentiment: {
    clinicalRisk: number;
    therapeuticPotential: number;
    regulatoryCompliance: number;
    innovationLevel: number;
    overallSentiment: number;
  };
  meshEnrichment: {
    connectedNodes: number;
    newRelationships: number;
    semanticClusters: string[];
    knowledgeGaps: string[];
  };
  confidence: number;
  processingMetrics: {
    totalProcessingTime: number;
    bertProcessingTime: number;
    bioBertProcessingTime: number;
    meshEnrichmentTime: number;
    entityExtractionTime: number;
  };
}

interface Document {
  id: string;
  originalName: string;
  status: string;
  confidence?: number;
  metadata?: any;
}

export default function AdvancedNLPDashboard() {
  const [activeTab, setActiveTab] = useState("process");
  const [selectedDocument, setSelectedDocument] = useState<string>("");
  const [testText, setTestText] = useState("");
  const [emmeQuestion, setEmmeQuestion] = useState("");
  const [emmeContext, setEmmeContext] = useState("");
  const [agentId, setAgentId] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch documents
  const { data: documents = [] } = useQuery<Document[]>({
    queryKey: ["/api/documents"],
  });

  // Fetch advanced NLP statistics
  const { data: statistics } = useQuery({
    queryKey: ["/api/advanced-nlp/statistics"],
  }) as { data?: { statistics: any } };

  // Process text mutation
  const processTextMutation = useMutation({
    mutationFn: async (text: string) => {
      const response = await fetch("/api/advanced-nlp/process", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text })
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return await response.json();
    },
    onSuccess: () => {
      toast({
        title: "Processing Complete",
        description: "Text processed successfully with advanced NLP models",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/advanced-nlp/statistics"] });
    },
    onError: (error: any) => {
      toast({
        title: "Processing Failed",
        description: error.message || "Failed to process text",
        variant: "destructive",
      });
    },
  });

  // Reprocess document mutation
  const reprocessDocumentMutation = useMutation({
    mutationFn: async (documentId: string) => {
      const response = await fetch(`/api/advanced-nlp/reprocess/${documentId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" }
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return await response.json();
    },
    onSuccess: () => {
      toast({
        title: "Reprocessing Complete",
        description: "Document reprocessed with advanced NLP models",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/documents"] });
      queryClient.invalidateQueries({ queryKey: ["/api/advanced-nlp/statistics"] });
    },
    onError: (error: any) => {
      toast({
        title: "Reprocessing Failed",
        description: error.message || "Failed to reprocess document",
        variant: "destructive",
      });
    },
  });

  // Batch process mutation
  const batchProcessMutation = useMutation({
    mutationFn: async (documentIds: string[]) => {
      const response = await fetch("/api/advanced-nlp/batch-process", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ documentIds })
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return await response.json();
    },
    onSuccess: (data: any) => {
      toast({
        title: "Batch Processing Complete",
        description: `Processed ${data.processed} documents successfully`,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/documents"] });
      queryClient.invalidateQueries({ queryKey: ["/api/advanced-nlp/statistics"] });
    },
    onError: (error: any) => {
      toast({
        title: "Batch Processing Failed",
        description: error.message || "Failed to batch process documents",
        variant: "destructive",
      });
    },
  });

  // EMME question processing mutation
  const emmeQuestionMutation = useMutation({
    mutationFn: async (params: { question: string; context?: string; agentId?: string }) => {
      const response = await fetch("/api/public/emme-question", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params)
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return await response.json();
    },
    onSuccess: (data: any) => {
      toast({
        title: "EMME Question Processed",
        description: `Analysis complete with ${data.guidance.confidence.overall > 0.8 ? 'high' : 'moderate'} confidence`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "EMME Processing Failed",
        description: error.message || "Failed to process EMME question",
        variant: "destructive",
      });
    },
  });

  const handleProcessText = () => {
    if (!testText.trim()) {
      toast({
        title: "Text Required",
        description: "Please enter text to process",
        variant: "destructive",
      });
      return;
    }
    processTextMutation.mutate(testText);
  };

  const handleReprocessDocument = () => {
    if (!selectedDocument) {
      toast({
        title: "Document Required",
        description: "Please select a document to reprocess",
        variant: "destructive",
      });
      return;
    }
    reprocessDocumentMutation.mutate(selectedDocument);
  };

  const handleBatchProcess = () => {
    const unprocessedDocs = documents.filter(doc => !doc.metadata?.advancedNLP);
    if (unprocessedDocs.length === 0) {
      toast({
        title: "No Documents to Process",
        description: "All documents have already been processed with advanced NLP",
      });
      return;
    }
    batchProcessMutation.mutate(unprocessedDocs.map(doc => doc.id));
  };

  const handleEMMEQuestion = () => {
    if (!emmeQuestion.trim()) {
      toast({
        title: "Question Required",
        description: "Please enter a question for EMME agent processing",
        variant: "destructive",
      });
      return;
    }
    emmeQuestionMutation.mutate({
      question: emmeQuestion,
      context: emmeContext.trim() || undefined,
      agentId: agentId.trim() || undefined
    });
  };

  const processedDocuments = documents.filter(doc => doc.metadata?.advancedNLP);
  const unprocessedDocuments = documents.filter(doc => !doc.metadata?.advancedNLP);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Advanced NLP Dashboard</h1>
          <p className="text-muted-foreground">
            BERT/BioBERT enhanced processing with SocratIQ Mesh™ integration
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Brain className="w-8 h-8 text-blue-600" />
          <Microscope className="w-8 h-8 text-green-600" />
        </div>
      </div>

      {/* Statistics Overview */}
      {statistics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Documents</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{statistics.statistics.totalDocuments}</div>
              <p className="text-xs text-muted-foreground">
                {statistics.statistics.processedWithAdvancedNLP} processed with advanced NLP
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Processing Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {Math.round(statistics.statistics.processingRate * 100)}%
              </div>
              <Progress value={statistics.statistics.processingRate * 100} className="mt-2" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Biomedical Concepts</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{statistics.statistics.totalBiomedicalConcepts}</div>
              <p className="text-xs text-muted-foreground">Unique concepts identified</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Mesh Connections</CardTitle>
              <Network className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{statistics.statistics.meshConnections}</div>
              <p className="text-xs text-muted-foreground">Knowledge graph links</p>
            </CardContent>
          </Card>
        </div>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="process">Text Processing</TabsTrigger>
          <TabsTrigger value="emme-agent">EMME Agent Q&A</TabsTrigger>
          <TabsTrigger value="documents">Document Analysis</TabsTrigger>
          <TabsTrigger value="domains">Domain Classification</TabsTrigger>
          <TabsTrigger value="insights">AI Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="process" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Brain className="w-5 h-5" />
                <span>Advanced Text Processing</span>
              </CardTitle>
              <CardDescription>
                Process text with BERT/BioBERT models for biomedical domain analysis
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Text to Process</label>
                <Textarea
                  placeholder="Enter biomedical text for advanced NLP analysis..."
                  value={testText}
                  onChange={(e) => setTestText(e.target.value)}
                  className="mt-1"
                  rows={6}
                />
              </div>
              <Button 
                onClick={handleProcessText}
                disabled={processTextMutation.isPending || !testText.trim()}
                className="w-full"
              >
                {processTextMutation.isPending ? (
                  <>
                    <Zap className="w-4 h-4 mr-2 animate-spin" />
                    Processing with AI Models...
                  </>
                ) : (
                  <>
                    <Brain className="w-4 h-4 mr-2" />
                    Process with Advanced NLP
                  </>
                )}
              </Button>

              {processTextMutation.data && (
                <div className="mt-4 space-y-4">
                  <h3 className="font-semibold">Processing Results</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Domain Classification</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <Badge variant="secondary">
                          {(processTextMutation.data as any).result?.domainClassification?.primaryDomain || 'N/A'}
                        </Badge>
                        <p className="text-xs text-muted-foreground mt-1">
                          Confidence: {Math.round(((processTextMutation.data as any).result?.domainClassification?.confidence || 0) * 100)}%
                        </p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Processing Metrics</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center space-x-2">
                          <Clock className="w-4 h-4" />
                          <span className="text-sm">
                            {(processTextMutation.data as any).result?.processingMetrics?.totalProcessingTime || 0}ms
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          {(processTextMutation.data as any).result?.entities?.length || 0} entities extracted
                        </p>
                      </CardContent>
                    </Card>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium mb-2">Biomedical Concepts</h4>
                    <div className="flex flex-wrap gap-1">
                      {((processTextMutation.data as any).result?.biomedicalConcepts || []).map((concept: string, index: number) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {concept}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium mb-2">Semantic Tags</h4>
                    <div className="flex flex-wrap gap-1">
                      {((processTextMutation.data as any).result?.semanticTags || []).map((tag: string, index: number) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="emme-agent" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Target className="w-5 h-5" />
                <span>EMME Agent Question Processing</span>
              </CardTitle>
              <CardDescription>
                Process questions that EMME asks to provide enhanced guidance for agent responses
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">EMME Question</label>
                  <Textarea
                    placeholder="Enter the question that EMME is asking..."
                    value={emmeQuestion}
                    onChange={(e) => setEmmeQuestion(e.target.value)}
                    className="mt-1"
                    rows={4}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Context (Optional)</label>
                  <Textarea
                    placeholder="Provide any relevant context for the question..."
                    value={emmeContext}
                    onChange={(e) => setEmmeContext(e.target.value)}
                    className="mt-1"
                    rows={4}
                  />
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium">Agent ID (Optional)</label>
                <input
                  type="text"
                  placeholder="Agent identifier for tracking..."
                  value={agentId}
                  onChange={(e) => setAgentId(e.target.value)}
                  className="w-full mt-1 p-2 border rounded-md"
                />
              </div>
              
              <Button 
                onClick={handleEMMEQuestion}
                disabled={emmeQuestionMutation.isPending || !emmeQuestion.trim()}
                className="w-full"
              >
                {emmeQuestionMutation.isPending ? (
                  <>
                    <Brain className="w-4 h-4 mr-2 animate-spin" />
                    Processing EMME Question...
                  </>
                ) : (
                  <>
                    <Target className="w-4 h-4 mr-2" />
                    Process for Agent Response
                  </>
                )}
              </Button>

              {emmeQuestionMutation.data && (
                <div className="mt-6 space-y-6">
                  <h3 className="font-semibold text-lg">Agent Guidance Results</h3>
                  
                  {/* Response Strategy */}
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Recommended Response Strategy</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Badge variant="secondary" className="mb-2">
                        {(emmeQuestionMutation.data as any).guidance?.strategy || 'N/A'}
                      </Badge>
                      <p className="text-sm text-muted-foreground">
                        Domain Focus: <strong>{(emmeQuestionMutation.data as any).guidance?.domainFocus || 'General'}</strong>
                      </p>
                    </CardContent>
                  </Card>

                  {/* Confidence Metrics */}
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Confidence Assessment</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Overall Confidence</span>
                          <span className="text-sm font-medium">
                            {Math.round(((emmeQuestionMutation.data as any).guidance?.confidence?.overall || 0) * 100)}%
                          </span>
                        </div>
                        <Progress 
                          value={((emmeQuestionMutation.data as any).guidance?.confidence?.overall || 0) * 100} 
                          className="h-2" 
                        />
                        <p className="text-xs text-muted-foreground">
                          Recommendation: <strong>{(emmeQuestionMutation.data as any).guidance?.confidence?.recommendation || 'N/A'}</strong>
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Key Entities */}
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Key Entities Identified</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-1">
                        {((emmeQuestionMutation.data as any).guidance?.keyEntities || []).map((entity: any, index: number) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {entity.value} ({entity.type})
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Required Knowledge */}
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Required Knowledge Areas</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-1">
                        {((emmeQuestionMutation.data as any).guidance?.requiredKnowledge || []).map((area: string, index: number) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {area.replace(/_/g, ' ')}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Risk Factors */}
                  {((emmeQuestionMutation.data as any).guidance?.riskFactors || []).length > 0 && (
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm text-orange-600">Risk Factors</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {((emmeQuestionMutation.data as any).guidance?.riskFactors || []).map((risk: any, index: number) => (
                            <div key={index} className="border-l-4 border-orange-400 pl-3">
                              <p className="text-sm font-medium">{risk.type.replace(/_/g, ' ')}</p>
                              <p className="text-xs text-muted-foreground">{risk.description}</p>
                              <p className="text-xs text-blue-600">Mitigation: {risk.mitigation}</p>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Validation Checks */}
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Validation Checklist</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {((emmeQuestionMutation.data as any).guidance?.validationChecks || []).map((check: any, index: number) => (
                          <div key={index} className="flex items-center space-x-2">
                            <div className={`w-2 h-2 rounded-full ${
                              check.priority === 'critical' ? 'bg-red-500' :
                              check.priority === 'high' ? 'bg-orange-500' :
                              check.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                            }`} />
                            <span className="text-sm">{check.description}</span>
                            <Badge variant="outline" className="text-xs">
                              {check.priority}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Response Structure */}
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Suggested Response Structure</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <p className="text-sm">
                          <span className="font-medium">Format:</span> {(emmeQuestionMutation.data as any).guidance?.responseStructure?.format || 'N/A'}
                        </p>
                        <p className="text-sm">
                          <span className="font-medium">Tone:</span> {(emmeQuestionMutation.data as any).guidance?.responseStructure?.tone || 'N/A'}
                        </p>
                        <p className="text-sm">
                          <span className="font-medium">Length:</span> {(emmeQuestionMutation.data as any).guidance?.responseStructure?.length || 'N/A'}
                        </p>
                        <div>
                          <span className="text-sm font-medium">Sections:</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {((emmeQuestionMutation.data as any).guidance?.responseStructure?.sections || []).map((section: string, index: number) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {section.replace(/_/g, ' ')}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Document Reprocessing</CardTitle>
                <CardDescription>
                  Enhance existing documents with advanced NLP analysis
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Select Document</label>
                  <select
                    value={selectedDocument}
                    onChange={(e) => setSelectedDocument(e.target.value)}
                    className="w-full mt-1 p-2 border rounded-md"
                  >
                    <option value="">Choose a document...</option>
                    {documents.map((doc) => (
                      <option key={doc.id} value={doc.id}>
                        {doc.originalName} ({doc.status})
                      </option>
                    ))}
                  </select>
                </div>
                <Button 
                  onClick={handleReprocessDocument}
                  disabled={reprocessDocumentMutation.isPending || !selectedDocument}
                  className="w-full"
                >
                  {reprocessDocumentMutation.isPending ? (
                    <>
                      <Zap className="w-4 h-4 mr-2 animate-spin" />
                      Reprocessing...
                    </>
                  ) : (
                    <>
                      <Brain className="w-4 h-4 mr-2" />
                      Reprocess with Advanced NLP
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Batch Processing</CardTitle>
                <CardDescription>
                  Process multiple documents simultaneously
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Processed:</span>
                    <span>{processedDocuments.length} documents</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Pending:</span>
                    <span>{unprocessedDocuments.length} documents</span>
                  </div>
                  <Progress 
                    value={documents.length > 0 ? (processedDocuments.length / documents.length) * 100 : 0} 
                  />
                </div>
                <Button 
                  onClick={handleBatchProcess}
                  disabled={batchProcessMutation.isPending || unprocessedDocuments.length === 0}
                  className="w-full"
                >
                  {batchProcessMutation.isPending ? (
                    <>
                      <Zap className="w-4 h-4 mr-2 animate-spin" />
                      Batch Processing...
                    </>
                  ) : (
                    <>
                      <Brain className="w-4 h-4 mr-2" />
                      Process {unprocessedDocuments.length} Documents
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Document Status</CardTitle>
              <CardDescription>Advanced NLP processing status for all documents</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {documents.length === 0 ? (
                  <p className="text-muted-foreground text-center py-4">No documents available</p>
                ) : (
                  documents.map((doc) => (
                    <div key={doc.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium">{doc.originalName}</h4>
                        <p className="text-sm text-muted-foreground">Status: {doc.status}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        {doc.metadata?.advancedNLP ? (
                          <Badge variant="default">Advanced NLP ✓</Badge>
                        ) : (
                          <Badge variant="outline">Basic NLP</Badge>
                        )}
                        {doc.confidence && (
                          <Badge variant="secondary">
                            {Math.round(doc.confidence * 100)}% confidence
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="domains" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Domain Distribution</CardTitle>
              <CardDescription>
                Domain classification analysis across all processed documents
              </CardDescription>
            </CardHeader>
            <CardContent>
              {statistics?.statistics?.domainDistribution ? (
                <div className="space-y-4">
                  {Object.entries(statistics.statistics.domainDistribution).map(([domain, count]) => (
                    <div key={domain} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium capitalize">{domain}</span>
                        <span>{count as number} documents</span>
                      </div>
                      <Progress 
                        value={(count as number / (statistics.statistics.processedWithAdvancedNLP || 1)) * 100} 
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-4">
                  No domain classification data available
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Network className="w-5 h-5" />
                  <span>SocratIQ Mesh™ Integration</span>
                </CardTitle>
                <CardDescription>
                  Knowledge graph enrichment and semantic connections
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-sm">Connected Nodes:</span>
                    <span className="font-medium">{statistics?.statistics.meshConnections || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Biomedical Concepts:</span>
                    <span className="font-medium">{statistics?.statistics.totalBiomedicalConcepts || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Average Confidence:</span>
                    <span className="font-medium">
                      {statistics?.statistics.averageConfidence ? 
                        Math.round(statistics.statistics.averageConfidence * 100) + '%' : 'N/A'}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Microscope className="w-5 h-5" />
                  <span>AI Model Performance</span>
                </CardTitle>
                <CardDescription>
                  BERT and BioBERT processing insights
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center space-y-2">
                    <div className="text-2xl font-bold text-green-600">✓</div>
                    <p className="text-sm font-medium">Advanced NLP Models Active</p>
                    <p className="text-xs text-muted-foreground">
                      BERT and BioBERT models are successfully initialized and processing documents
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-4 pt-4">
                    <div className="text-center">
                      <div className="text-lg font-semibold">{documents.length}</div>
                      <div className="text-xs text-muted-foreground">Total Documents</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-semibold">{processedDocuments.length}</div>
                      <div className="text-xs text-muted-foreground">AI Enhanced</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}