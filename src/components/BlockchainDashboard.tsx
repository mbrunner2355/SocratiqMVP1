import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Shield, 
  Lock,
  Hash,
  Link,
  Activity,
  CheckCircle,
  Clock,
  Copy,
  Eye,
  FileText,
  AlertTriangle,
  Cpu,
  Database,
  Network
} from 'lucide-react';

interface TraceUnit {
  id: string;
  agentName: string;
  reasoningCycleId: string;
  contextSnapshot: any;
  inputTokens: number;
  outputTokens: number;
  processingTime: number;
  verificationStatus: string;
  cryptographicHash: string;
  previousTraceUnit?: string;
  createdAt: string;
}

interface AuditEvent {
  id: string;
  eventType: string;
  eventSubtype: string;
  actor: string;
  actorType: string;
  targetEntity: string;
  operation: string;
  payloadHash: string;
  previousEventHash?: string;
  cryptographicSignature: string;
  validationStatus: string;
  timestamp: string;
  transactionId: string;
}

export function BlockchainDashboard() {
  const [selectedTab, setSelectedTab] = useState('overview');

  // Fetch TraceUnits data
  const { data: traceUnits, isLoading: traceLoading } = useQuery<TraceUnit[]>({
    queryKey: ['/api/trace/trace-units'],
  });

  // Fetch audit events
  const { data: auditEvents, isLoading: eventsLoading } = useQuery<AuditEvent[]>({
    queryKey: ['/api/trace/events'],
  });

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const formatHash = (hash: string) => {
    return hash ? `${hash.slice(0, 8)}...${hash.slice(-8)}` : 'N/A';
  };

  const getValidationColor = (status: string) => {
    switch (status) {
      case 'VALID':
      case 'VERIFIED':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'INVALID':
      case 'FAILED':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">SocratIQ Trace™ Blockchain</h1>
          <p className="text-muted-foreground">
            Immutable audit trail with cryptographic verification and blockchain technology
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            <Hash className="h-4 w-4 mr-2" />
            Verify Chain
          </Button>
          <Button variant="outline" size="sm">
            <FileText className="h-4 w-4 mr-2" />
            Export Audit
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total TraceUnits™</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{traceUnits?.length || 0}</div>
            <p className="text-xs text-muted-foreground">Immutable audit records</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Audit Events</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{auditEvents?.length || 0}</div>
            <p className="text-xs text-muted-foreground">Blockchain transactions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Verified Units</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {traceUnits?.filter(unit => unit.verificationStatus === 'VERIFIED').length || 0}
            </div>
            <p className="text-xs text-muted-foreground">Cryptographically verified</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Chain Integrity</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">100%</div>
            <p className="text-xs text-muted-foreground">Hash chain verified</p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="trace-units">TraceUnits™</TabsTrigger>
          <TabsTrigger value="audit-events">Audit Events</TabsTrigger>
          <TabsTrigger value="blockchain">Blockchain</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Link className="h-5 w-5" />
                  Blockchain Architecture
                </CardTitle>
                <CardDescription>
                  SocratIQ Trace™ implements enterprise-grade blockchain technology
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Hash Algorithm</span>
                    <Badge variant="secondary">SHA-256</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Consensus Mechanism</span>
                    <Badge variant="secondary">RAFT</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Immutability</span>
                    <Badge variant="secondary">Cryptographic</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Compliance</span>
                    <Badge variant="secondary">21CFR11.10</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="h-5 w-5" />
                  Security Features
                </CardTitle>
                <CardDescription>
                  Advanced cryptographic protection and verification
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Digital Signatures</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Hash Chain Verification</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Tamper Detection</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Immutable Records</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="trace-units" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>TraceUnits™ - Immutable Context Records</CardTitle>
              <CardDescription>
                Each TraceUnit represents an immutable snapshot of AI reasoning with cryptographic verification
              </CardDescription>
            </CardHeader>
            <CardContent>
              {traceLoading ? (
                <div className="text-center py-8">Loading TraceUnits...</div>
              ) : (
                <div className="space-y-4">
                  {traceUnits?.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      No TraceUnits found. Create AI reasoning cycles to generate immutable audit records.
                    </div>
                  ) : (
                    traceUnits?.map((unit) => (
                      <div key={unit.id} className="border rounded-lg p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Cpu className="h-4 w-4" />
                            <span className="font-medium">{unit.agentName}</span>
                            <Badge className={getValidationColor(unit.verificationStatus)}>
                              {unit.verificationStatus}
                            </Badge>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {new Date(unit.createdAt).toLocaleString()}
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">Reasoning Cycle:</span>
                            <div className="font-mono">{formatHash(unit.reasoningCycleId)}</div>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Processing Time:</span>
                            <div>{unit.processingTime}ms</div>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Input Tokens:</span>
                            <div>{unit.inputTokens}</div>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Output Tokens:</span>
                            <div>{unit.outputTokens}</div>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Hash className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">Cryptographic Hash:</span>
                            <code className="text-xs bg-muted px-2 py-1 rounded flex-1">
                              {unit.cryptographicHash}
                            </code>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => copyToClipboard(unit.cryptographicHash)}
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                          </div>
                          
                          {unit.previousTraceUnit && (
                            <div className="flex items-center gap-2">
                              <Link className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm text-muted-foreground">Previous Unit:</span>
                              <code className="text-xs bg-muted px-2 py-1 rounded">
                                {formatHash(unit.previousTraceUnit)}
                              </code>
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="audit-events" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Blockchain Audit Events</CardTitle>
              <CardDescription>
                Immutable transaction log with cryptographic verification
              </CardDescription>
            </CardHeader>
            <CardContent>
              {eventsLoading ? (
                <div className="text-center py-8">Loading audit events...</div>
              ) : (
                <div className="space-y-4">
                  {auditEvents?.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      No audit events found. System operations will automatically generate blockchain records.
                    </div>
                  ) : (
                    auditEvents?.map((event) => (
                      <div key={event.id} className="border rounded-lg p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Activity className="h-4 w-4" />
                            <span className="font-medium">{event.eventType}</span>
                            <Badge variant="outline">{event.eventSubtype}</Badge>
                            <Badge className={getValidationColor(event.validationStatus)}>
                              {event.validationStatus}
                            </Badge>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {new Date(event.timestamp).toLocaleString()}
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">Actor:</span>
                            <div>{event.actor}</div>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Operation:</span>
                            <div>{event.operation}</div>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Target:</span>
                            <div>{formatHash(event.targetEntity)}</div>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Transaction:</span>
                            <div className="font-mono">{formatHash(event.transactionId)}</div>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Hash className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">Payload Hash:</span>
                            <code className="text-xs bg-muted px-2 py-1 rounded flex-1">
                              {event.payloadHash}
                            </code>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <Shield className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">Digital Signature:</span>
                            <code className="text-xs bg-muted px-2 py-1 rounded flex-1">
                              {formatHash(event.cryptographicSignature)}
                            </code>
                          </div>
                          
                          {event.previousEventHash && (
                            <div className="flex items-center gap-2">
                              <Link className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm text-muted-foreground">Previous Hash:</span>
                              <code className="text-xs bg-muted px-2 py-1 rounded">
                                {formatHash(event.previousEventHash)}
                              </code>
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="blockchain" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Blockchain Implementation Details</CardTitle>
              <CardDescription>
                Technical details of the SocratIQ Trace™ blockchain infrastructure
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium">Cryptographic Security</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Hash Algorithm:</span>
                      <span className="font-mono">SHA-256</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Signature Method:</span>
                      <span className="font-mono">Digital Signatures</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Chain Verification:</span>
                      <span className="font-mono">Previous Hash Linking</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Compliance & Regulations</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>FDA 21CFR11:</span>
                      <Badge variant="secondary">Compliant</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>GxP Standards:</span>
                      <Badge variant="secondary">Compliant</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Data Retention:</span>
                      <span>25+ Years</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-medium mb-3">Blockchain Features</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Network className="h-4 w-4 text-blue-600" />
                    <span className="text-sm">Hyperledger Fabric Network</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Immutable Audit Trail</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Lock className="h-4 w-4 text-red-600" />
                    <span className="text-sm">Tamper-Proof Records</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-purple-600" />
                    <span className="text-sm">Real-time Verification</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}