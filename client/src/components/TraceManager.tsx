import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { 
  Shield, 
  Plus, 
  FileText,
  Clock,
  Users,
  Activity,
  AlertTriangle,
  CheckCircle,
  Download,
  Search,
  Database,
  Lock,
  Eye,
  Brain,
  Settings,
  ExternalLink,
  Archive,
  Hash,
  Zap,
  Key,
  Globe,
  Server,
  GitBranch,
  Layers,
  Network,
  HardDrive,
  Cpu,
  BarChart3,
  TrendingUp,
  CloudLightning,
  Fingerprint,
  Scan,
  FileCheck,
  AlertCircle,
  Link2,
  ShieldCheck
} from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';

interface AuditEvent {
  id: string;
  eventType: string;
  eventSubtype: string;
  actor: string;
  actorType: string;
  targetEntity?: string;
  targetEntityType?: string;
  operation: string;
  payload: any;
  timestamp: string;
  sessionId?: string;
  validationStatus: string;
  complianceFlags: string[];
  cryptographicSignature: string;
}

interface DecisionEvent {
  id: string;
  auditEventId: string;
  decisionType: string;
  decisionMaker: string;
  decisionMakerType: string;
  confidence?: number;
  reasoning?: string;
  reviewStatus: string;
  createdAt: string;
}

interface EvidenceBundle {
  id: string;
  bundleName: string;
  bundleType: string;
  regulatoryContext?: string;
  status: string;
  dataLineage: any;
  createdAt: string;
  submittedAt?: string;
}

interface TraceUnit {
  id: string;
  reasoningCycleId: string;
  agentName: string;
  queryInput: string;
  reasoning: any;
  confidence: number;
  executionTime: number;
  modelVersion: string;
  blockchainHash: string;
  validationStatus: string;
  finalConclusion: string;
  confidenceScores: any;
  verificationStatus: string;
  processingTime?: number;
  createdAt: string;
}

interface BlockchainTransaction {
  transactionId: string;
  blockNumber: number;
  timestamp: string;
  chaincode: string;
  event: {
    type: string;
    actor: any;
    operation: string;
    payload: any;
    metadata: any;
  };
  consensus: string;
  verification: string;
}

interface ComplianceReport {
  id: string;
  reportType: string;
  regulatoryFramework: string;
  coverage: string[];
  status: string;
  findings: any;
  recommendations: string[];
  generatedAt: string;
}

interface CryptographicStatus {
  signingAlgorithm: string;
  encryptionStandard: string;
  keyManagement: string;
  integrityVerification: string;
  consensusProtocol: string;
}

export function TraceManager() {
  const [selectedTab, setSelectedTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const queryClient = useQueryClient();

  // Fetch data
  const { data: auditEvents, isLoading: eventsLoading } = useQuery<AuditEvent[]>({
    queryKey: ['/api/trace/events'],
  });

  const { data: metrics } = useQuery({
    queryKey: ['/api/trace/metrics'],
  });

  const { data: decisionEvents } = useQuery<DecisionEvent[]>({
    queryKey: ['/api/trace/decisions'],
  });

  const { data: evidenceBundles } = useQuery<EvidenceBundle[]>({
    queryKey: ['/api/trace/evidence-bundles'],
  });

  const { data: traceUnits } = useQuery<TraceUnit[]>({
    queryKey: ['/api/trace/trace-units'],
  });

  // Create audit event mutation
  const createAuditEventMutation = useMutation({
    mutationFn: (data: any) => apiRequest('/api/trace/events', 'POST', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/trace/events'] });
      queryClient.invalidateQueries({ queryKey: ['/api/trace/metrics'] });
    }
  });

  // Export evidence bundle mutation
  const exportBundleMutation = useMutation({
    mutationFn: ({ bundleId, format }: { bundleId: string; format: string }) => 
      apiRequest(`/api/trace/evidence-bundles/${bundleId}/export`, 'POST', { format })
  });

  // Query audit trail mutation
  const queryTrailMutation = useMutation({
    mutationFn: (queryData: any) => apiRequest('/api/trace/query/trail', 'POST', queryData)
  });

  const getEventTypeColor = (eventType: string) => {
    switch (eventType) {
      case 'DATA_OPERATION': return 'bg-blue-100 text-blue-800';
      case 'DECISION_EVENT': return 'bg-purple-100 text-purple-800';
      case 'SYSTEM_EVENT': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'VALID': 
      case 'APPROVED': 
      case 'VERIFIED': return 'bg-green-100 text-green-800';
      case 'PENDING': 
      case 'DRAFT': return 'bg-yellow-100 text-yellow-800';
      case 'INVALID': 
      case 'REJECTED': 
      case 'DISPUTED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getActorIcon = (actorType: string) => {
    switch (actorType) {
      case 'USER': return <Users className="h-4 w-4" />;
      case 'AGENT': return <Brain className="h-4 w-4" />;
      case 'SYSTEM': return <Settings className="h-4 w-4" />;
      case 'API': return <ExternalLink className="h-4 w-4" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  const handleCreateAuditEvent = () => {
    createAuditEventMutation.mutate({
      eventType: 'DATA_OPERATION',
      eventSubtype: 'DOCUMENT_INGESTION',
      actor: 'current_user',
      actorType: 'USER',
      targetEntity: 'doc_sample',
      targetEntityType: 'DOCUMENT',
      operation: 'CREATE',
      payload: {
        filename: 'sample_document.pdf',
        fileSize: 1024000,
        processingType: 'AUTOMATIC'
      },
      sourceSystem: 'SOCRATIQ',
      retentionPolicy: 'PERMANENT',
      complianceFlags: ['GDPR']
    });
  };

  const handleExportBundle = (bundleId: string, format: string = 'JSON') => {
    exportBundleMutation.mutate({ bundleId, format });
  };

  const handleQueryTrail = () => {
    const queryData: any = { eventTypes: ['DATA_OPERATION', 'DECISION_EVENT'] };
    
    if (searchTerm) queryData.entityId = searchTerm;
    if (dateRange.start) queryData.startDate = dateRange.start;
    if (dateRange.end) queryData.endDate = dateRange.end;
    
    queryTrailMutation.mutate(queryData);
  };

  if (eventsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-sm text-muted-foreground">Loading Trace™ Audit System...</p>
        </div>
      </div>
    );
  }

  const events = Array.isArray(auditEvents) ? auditEvents : auditEvents?.events || [];
  const filteredEvents = events.filter((event: AuditEvent) =>
    event.actor.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.operation.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.eventType.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">SocratIQ Trace™ - Immutable Audit System</h1>
          <p className="text-muted-foreground">
            Cryptographically-signed audit trail for all platform operations and decisions
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search audit trail..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 w-64"
            />
          </div>
          <Button onClick={handleCreateAuditEvent} disabled={createAuditEventMutation.isPending}>
            <Plus className="h-4 w-4 mr-2" />
            Record Event
          </Button>
        </div>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="events">Audit Events ({auditEvents?.length || 0})</TabsTrigger>
          <TabsTrigger value="decisions">Decisions</TabsTrigger>
          <TabsTrigger value="bundles">Evidence Bundles</TabsTrigger>
          <TabsTrigger value="traces">Trace Units</TabsTrigger>
          <TabsTrigger value="trail">Query Trail</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Metrics Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Events</CardTitle>
                <Shield className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{(metrics as any)?.totalEvents || 0}</div>
                <p className="text-xs text-muted-foreground">
                  {(metrics as any)?.todayEvents || 0} today
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Failed Validations</CardTitle>
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{(metrics as any)?.failedValidations || 0}</div>
                <p className="text-xs text-muted-foreground">
                  Integrity violations
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Evidence Bundles</CardTitle>
                <Archive className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{(metrics as any)?.evidenceBundleMetrics?.totalBundles || 0}</div>
                <p className="text-xs text-muted-foreground">
                  {(metrics as any)?.evidenceBundleMetrics?.submittedBundles || 0} submitted
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Trace Units</CardTitle>
                <Brain className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{(metrics as any)?.traceUnitMetrics?.totalTraceUnits || 0}</div>
                <p className="text-xs text-muted-foreground">
                  SophieLogic™ reasoning cycles
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Audit Event Types Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Audit Event Distribution</CardTitle>
              <CardDescription>Breakdown of audit events by type and actor</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-3">
                  <h4 className="font-medium">Event Types</h4>
                  {(metrics as any)?.eventsByType && Object.entries((metrics as any).eventsByType).map(([type, count]: [string, any]) => (
                    <div key={type} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Badge className={getEventTypeColor(type)}>
                          {type}
                        </Badge>
                      </div>
                      <span className="font-medium">{count as number}</span>
                    </div>
                  ))}
                </div>
                
                <div className="space-y-3">
                  <h4 className="font-medium">Top Actors</h4>
                  {(metrics as any)?.topActors && Object.entries((metrics as any).topActors).slice(0, 5).map(([actor, count]: [string, any]) => (
                    <div key={actor} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{actor}</span>
                      </div>
                      <span className="font-medium">{count as number}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Immutable Ledger Architecture */}
          <Card>
            <CardHeader>
              <CardTitle>Immutable Ledger Architecture</CardTitle>
              <CardDescription>Cryptographically-signed event chain with hash verification</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="flex items-center space-x-3 p-3 border rounded-lg">
                  <Hash className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="font-medium">Hash Chain</p>
                    <p className="text-sm text-muted-foreground">Sequential event verification</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 border rounded-lg">
                  <Lock className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="font-medium">Digital Signatures</p>
                    <p className="text-sm text-muted-foreground">Cryptographic authenticity</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 border rounded-lg">
                  <Database className="h-5 w-5 text-purple-600" />
                  <div>
                    <p className="font-medium">Append-Only</p>
                    <p className="text-sm text-muted-foreground">Immutable event storage</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="events">
          <Card>
            <CardHeader>
              <CardTitle>Audit Events</CardTitle>
              <CardDescription>Cryptographically-signed trail of all platform operations</CardDescription>
            </CardHeader>
            <CardContent>
              {filteredEvents && filteredEvents.length > 0 ? (
                <div className="space-y-4">
                  {filteredEvents.slice(0, 20).map((event: AuditEvent) => (
                    <Card key={event.id}>
                      <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                              {getActorIcon(event.actorType)}
                            </div>
                            <div>
                              <div className="flex items-center space-x-2 mb-1">
                                <Badge className={getEventTypeColor(event.eventType)}>
                                  {event.eventType}
                                </Badge>
                                <Badge variant="outline">{event.eventSubtype}</Badge>
                                <Badge className={getStatusColor(event.validationStatus)}>
                                  {event.validationStatus}
                                </Badge>
                              </div>
                              <h4 className="font-medium">{event.operation} by {event.actor}</h4>
                              <p className="text-sm text-muted-foreground">
                                {event.targetEntityType}: {event.targetEntity || 'N/A'}
                              </p>
                              {event.complianceFlags.length > 0 && (
                                <div className="flex items-center space-x-1 mt-1">
                                  {event.complianceFlags.map((flag: string) => (
                                    <Badge key={flag} variant="outline" className="text-xs">
                                      {flag}
                                    </Badge>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="text-right text-sm">
                            <p className="font-medium">{new Date(event.timestamp).toLocaleString()}</p>
                            <p className="text-muted-foreground">Session: {event.sessionId?.slice(0, 8) || 'N/A'}</p>
                            <div className="flex items-center mt-1">
                              <Lock className="h-3 w-3 mr-1 text-green-600" />
                              <span className="text-xs text-muted-foreground">Signed</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Shield className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-medium mb-2">No audit events found</h3>
                  <p className="text-muted-foreground mb-4">
                    {searchTerm ? 'Try adjusting your search terms' : 'Audit events will appear here as operations occur'}
                  </p>
                  {!searchTerm && (
                    <Button onClick={handleCreateAuditEvent}>
                      <Plus className="h-4 w-4 mr-2" />
                      Record Event
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="decisions">
          <Card>
            <CardHeader>
              <CardTitle>Decision Events</CardTitle>
              <CardDescription>Agent recommendations and human overrides with justification</CardDescription>
            </CardHeader>
            <CardContent>
              {decisionEvents && decisionEvents.length > 0 ? (
                <div className="space-y-4">
                  {decisionEvents.map((decision) => (
                    <div key={decision.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Brain className="h-4 w-4 text-purple-600" />
                        <div>
                          <p className="font-medium">{decision.decisionType}</p>
                          <p className="text-sm text-muted-foreground">
                            By {decision.decisionMaker} ({decision.decisionMakerType})
                          </p>
                          {decision.confidence && (
                            <p className="text-xs text-muted-foreground">
                              Confidence: {(decision.confidence * 100).toFixed(1)}%
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge className={getStatusColor(decision.reviewStatus)}>
                          {decision.reviewStatus}
                        </Badge>
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(decision.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Brain className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No decision events recorded</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bundles">
          <Card>
            <CardHeader>
              <CardTitle>Evidence Bundles</CardTitle>
              <CardDescription>Regulatory submission packages with complete data lineage</CardDescription>
            </CardHeader>
            <CardContent>
              {evidenceBundles && evidenceBundles.length > 0 ? (
                <div className="space-y-4">
                  {evidenceBundles.map((bundle) => (
                    <div key={bundle.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <FileText className="h-4 w-4 text-blue-600" />
                        <div>
                          <p className="font-medium">{bundle.bundleName}</p>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge variant="outline">{bundle.bundleType}</Badge>
                            {bundle.regulatoryContext && (
                              <Badge variant="outline">{bundle.regulatoryContext}</Badge>
                            )}
                            <Badge className={getStatusColor(bundle.status)}>
                              {bundle.status}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleExportBundle(bundle.id, 'PDF')}
                          disabled={exportBundleMutation.isPending}
                        >
                          <Download className="h-3 w-3 mr-1" />
                          PDF
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleExportBundle(bundle.id, 'JSON')}
                          disabled={exportBundleMutation.isPending}
                        >
                          <Download className="h-3 w-3 mr-1" />
                          JSON
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Archive className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No evidence bundles created</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="traces">
          <Card>
            <CardHeader>
              <CardTitle>Trace Units</CardTitle>
              <CardDescription>SophieLogic™ reasoning cycles with immutable capture</CardDescription>
            </CardHeader>
            <CardContent>
              {traceUnits && traceUnits.length > 0 ? (
                <div className="space-y-4">
                  {traceUnits.map((trace) => (
                    <div key={trace.id} className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <Zap className="h-4 w-4 text-yellow-600" />
                          <span className="font-medium">{trace.agentName}</span>
                          <Badge className={getStatusColor(trace.verificationStatus)}>
                            {trace.verificationStatus}
                          </Badge>
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {trace.processingTime}ms
                        </span>
                      </div>
                      <p className="text-sm mb-1">
                        <strong>Query:</strong> {trace.queryInput}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        <strong>Conclusion:</strong> {trace.finalConclusion}
                      </p>
                      <p className="text-xs text-muted-foreground mt-2">
                        Cycle: {trace.reasoningCycleId} • {new Date(trace.createdAt).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Brain className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No trace units recorded</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trail">
          <Card>
            <CardHeader>
              <CardTitle>Audit Trail Query</CardTitle>
              <CardDescription>Query audit trail by entity, user, time range, and operation type</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-3">
                  <div>
                    <label className="text-sm font-medium">Entity ID</label>
                    <Input
                      placeholder="Enter entity ID..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Start Date</label>
                    <Input
                      type="date"
                      value={dateRange.start}
                      onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">End Date</label>
                    <Input
                      type="date"
                      value={dateRange.end}
                      onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                    />
                  </div>
                </div>
                
                <Button onClick={handleQueryTrail} disabled={queryTrailMutation.isPending}>
                  <Search className="h-4 w-4 mr-2" />
                  Query Trail
                </Button>

                {queryTrailMutation.data && (
                  <div className="mt-6">
                    <h4 className="font-medium mb-4">Query Results</h4>
                    <div className="grid gap-4 md:grid-cols-2 mb-4">
                      <div className="p-3 border rounded-lg">
                        <p className="font-medium">Total Events</p>
                        <p className="text-2xl font-bold">{(queryTrailMutation.data as any).trail.length}</p>
                      </div>
                      <div className="p-3 border rounded-lg">
                        <p className="font-medium">Unique Actors</p>
                        <p className="text-2xl font-bold">{(queryTrailMutation.data as any).metadata?.actors?.length || 0}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      {(queryTrailMutation.data as any).trail.slice(0, 10).map((event: any, index: number) => (
                        <div key={event.id} className="flex items-center justify-between p-2 border rounded">
                          <div className="flex items-center space-x-2">
                            <span className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center text-xs">
                              {index + 1}
                            </span>
                            <span className="text-sm font-medium">{event.operation}</span>
                            <Badge variant="outline">{event.eventType}</Badge>
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {new Date(event.timestamp).toLocaleString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}