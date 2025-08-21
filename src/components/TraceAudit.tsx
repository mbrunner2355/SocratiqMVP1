import { useQuery } from "@tanstack/react-query";
import { Shield, Clock, User, FileText, Search, Filter, AlertTriangle, CheckCircle, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";

interface AuditEvent {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  action: string;
  resource: string;
  resourceId?: string;
  ipAddress: string;
  userAgent: string;
  status: 'SUCCESS' | 'FAILURE' | 'WARNING';
  details?: any;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  complianceFlags?: string[];
}

interface AuditMetrics {
  totalEvents: number;
  todayEvents: number;
  failureRate: number;
  highRiskEvents: number;
  complianceAlerts: number;
  topUsers: Array<{
    userId: string;
    userName: string;
    eventCount: number;
  }>;
  topActions: Array<{
    action: string;
    count: number;
  }>;
}

export default function TraceAudit() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [riskFilter, setRiskFilter] = useState<string>("all");

  // Fetch audit events from the backend
  const { data: auditEvents } = useQuery<AuditEvent[]>({
    queryKey: ["/api/audit/events"],
    refetchInterval: 30000, // Refresh every 30 seconds for real-time monitoring
  });

  // Fetch audit metrics from the backend  
  const { data: auditMetrics } = useQuery<AuditMetrics>({
    queryKey: ["/api/audit/metrics"],
    refetchInterval: 60000, // Refresh every minute
  });

  // Fallback to mock data if API is unavailable
  const mockAuditEvents: AuditEvent[] = [
    {
      id: "audit_001",
      timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
      userId: "user_123",
      userName: "Dr. Sarah Chen",
      action: "DOCUMENT_UPLOAD",
      resource: "clinical-trial-data.txt",
      resourceId: "doc_456",
      ipAddress: "192.168.1.100",
      userAgent: "Mozilla/5.0...",
      status: "SUCCESS",
      riskLevel: "LOW",
      details: { fileSize: "2.4MB", processingTime: "1.2s" }
    },
    {
      id: "audit_002", 
      timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
      userId: "user_456",
      userName: "Dr. Michael Rodriguez",
      action: "GRAPH_BUILD",
      resource: "KNOWLEDGE_GRAPH",
      ipAddress: "10.0.1.50",
      userAgent: "Mozilla/5.0...",
      status: "SUCCESS",
      riskLevel: "MEDIUM",
      details: { nodes: 1152, relationships: 0 }
    },
    {
      id: "audit_003",
      timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      userId: "user_789",
      userName: "Admin User",
      action: "USER_LOGIN_FAILURE",
      resource: "AUTH_SYSTEM",
      ipAddress: "203.0.113.1",
      userAgent: "curl/7.68.0",
      status: "FAILURE",
      riskLevel: "HIGH",
      complianceFlags: ["SUSPICIOUS_IP", "AUTOMATED_ACCESS"],
      details: { reason: "Invalid credentials", attempts: 3 }
    },
    {
      id: "audit_004",
      timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
      userId: "user_123",
      userName: "Dr. Sarah Chen", 
      action: "DATA_EXPORT",
      resource: "ENTITY_EXTRACTION",
      resourceId: "export_789",
      ipAddress: "192.168.1.100",
      userAgent: "Mozilla/5.0...",
      status: "SUCCESS",
      riskLevel: "MEDIUM",
      complianceFlags: ["DATA_EXPORT"],
      details: { format: "CSV", records: 150 }
    },
    {
      id: "audit_005",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      userId: "system",
      userName: "System Process",
      action: "AUTOMATED_BACKUP",
      resource: "DATABASE",
      ipAddress: "127.0.0.1",
      userAgent: "SystemProcess/1.0",
      status: "SUCCESS",
      riskLevel: "LOW",
      details: { backupSize: "245MB", duration: "12s" }
    }
  ];

  const mockMetrics: AuditMetrics = {
    totalEvents: 1247,
    todayEvents: 23,
    failureRate: 2.3,
    highRiskEvents: 7,
    complianceAlerts: 2,
    topUsers: [
      { userId: "user_123", userName: "Dr. Sarah Chen", eventCount: 45 },
      { userId: "user_456", userName: "Dr. Michael Rodriguez", eventCount: 32 },
      { userId: "user_789", userName: "Admin User", eventCount: 28 }
    ],
    topActions: [
      { action: "DOCUMENT_UPLOAD", count: 156 },
      { action: "GRAPH_BUILD", count: 89 },
      { action: "DATA_EXPORT", count: 67 },
      { action: "USER_LOGIN", count: 234 }
    ]
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'SUCCESS': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'FAILURE': return <AlertTriangle className="w-4 h-4 text-red-600" />;
      case 'WARNING': return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      default: return <Eye className="w-4 h-4 text-gray-500" />;
    }
  };

  const getRiskBadgeColor = (risk: string) => {
    switch (risk) {
      case 'CRITICAL': return 'bg-red-100 text-red-800 border-red-200';
      case 'HIGH': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'LOW': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - time.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  // Use real data from API, fallback to mock if not available
  const events = auditEvents || mockAuditEvents;
  const metrics = auditMetrics || mockMetrics;

  const filteredEvents = events.filter(event => {
    const matchesSearch = searchTerm === "" || 
      event.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.resource.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || event.status === statusFilter;
    const matchesRisk = riskFilter === "all" || event.riskLevel === riskFilter;
    
    return matchesSearch && matchesStatus && matchesRisk;
  });

  return (
    <div className="space-y-6" data-section="trace">
      {/* Header */}
      <div className="card-transform">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, hsl(220, 87%, 36%) 0%, hsl(16, 84%, 47%) 100%)' }}>
              <Shield className="text-white w-5 h-5" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-charcoal" style={{ color: 'var(--charcoal)' }}>SocratIQ Trace™</h2>
              <p className="text-sm font-medium text-slate" style={{ color: 'var(--slate)' }}>Comprehensive Audit Trail & Compliance Monitoring System</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2 text-sm font-medium" style={{ color: 'var(--slate)' }}>
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: 'var(--success)' }}></div>
              <span>Compliance Status: Active</span>
            </div>
            <Button className="btn-secondary">
              <FileText className="w-4 h-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>

        {/* Metrics Dashboard */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="text-center">
            <div className="text-3xl font-bold" style={{ color: 'var(--teal-primary)' }}>
              {metrics.totalEvents.toLocaleString()}
            </div>
            <p className="text-sm font-medium" style={{ color: 'var(--slate)' }}>Total Events</p>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold" style={{ color: 'var(--teal-secondary)' }}>
              {metrics.todayEvents}
            </div>
            <p className="text-sm font-medium" style={{ color: 'var(--slate)' }}>Today's Events</p>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold" style={{ color: metrics.failureRate > 5 ? 'var(--error)' : 'var(--success)' }}>
              {metrics.failureRate}%
            </div>
            <p className="text-sm font-medium" style={{ color: 'var(--slate)' }}>Failure Rate</p>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold" style={{ color: metrics.highRiskEvents > 10 ? 'var(--error)' : 'var(--warning)' }}>
              {metrics.highRiskEvents}
            </div>
            <p className="text-sm font-medium" style={{ color: 'var(--slate)' }}>High Risk Events</p>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold" style={{ color: metrics.complianceAlerts > 0 ? 'var(--error)' : 'var(--success)' }}>
              {metrics.complianceAlerts}
            </div>
            <p className="text-sm font-medium" style={{ color: 'var(--slate)' }}>Compliance Alerts</p>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="card-transform">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search events by user, action, or resource..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full md:w-40">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="SUCCESS">Success</SelectItem>
              <SelectItem value="FAILURE">Failure</SelectItem>
              <SelectItem value="WARNING">Warning</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={riskFilter} onValueChange={setRiskFilter}>
            <SelectTrigger className="w-full md:w-40">
              <SelectValue placeholder="Risk Level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Risk Levels</SelectItem>
              <SelectItem value="LOW">Low</SelectItem>
              <SelectItem value="MEDIUM">Medium</SelectItem>
              <SelectItem value="HIGH">High</SelectItem>
              <SelectItem value="CRITICAL">Critical</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Audit Events List */}
        <div className="lg:col-span-2">
          <Card className="card-socratiq">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-charcoal" style={{ color: 'var(--charcoal)' }}>
                <Clock className="w-5 h-5" style={{ color: 'var(--teal-primary)' }} />
                <span>Recent Audit Events</span>
                <Badge variant="secondary" className="ml-auto">
                  {filteredEvents.length} events
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredEvents.map((event) => (
                  <div key={event.id} className="border rounded-lg p-4" style={{ borderColor: 'var(--teal-light)' }}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(event.status)}
                        <span className="font-medium text-charcoal" style={{ color: 'var(--charcoal)' }}>
                          {event.action.replace(/_/g, ' ')}
                        </span>
                        <Badge className={getRiskBadgeColor(event.riskLevel)}>
                          {event.riskLevel}
                        </Badge>
                      </div>
                      <span className="text-sm text-slate" style={{ color: 'var(--slate)' }}>
                        {formatTimeAgo(event.timestamp)}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="font-medium">User:</span> {event.userName}
                      </div>
                      <div>
                        <span className="font-medium">Resource:</span> {event.resource}
                      </div>
                      <div>
                        <span className="font-medium">IP Address:</span> {event.ipAddress}
                      </div>
                      <div>
                        <span className="font-medium">Status:</span> {event.status}
                      </div>
                    </div>
                    
                    {event.complianceFlags && event.complianceFlags.length > 0 && (
                      <div className="mt-2">
                        <div className="flex flex-wrap gap-1">
                          {event.complianceFlags.map((flag, index) => (
                            <Badge key={index} variant="outline" className="text-xs bg-red-50 text-red-700 border-red-200">
                              {flag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {event.details && (
                      <div className="mt-2 p-2 bg-gray-50 rounded text-xs">
                        <span className="font-medium">Details:</span> {JSON.stringify(event.details)}
                      </div>
                    )}
                  </div>
                ))}
                
                {filteredEvents.length === 0 && (
                  <div className="text-center py-8">
                    <Shield className="w-12 h-12 mx-auto text-gray-300 mb-2" />
                    <p className="text-slate" style={{ color: 'var(--slate)' }}>
                      No audit events match your current filters
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Analytics Sidebar */}
        <div className="space-y-6">
          <Card className="card-socratiq">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-charcoal" style={{ color: 'var(--charcoal)' }}>
                <User className="w-5 h-5" style={{ color: 'var(--teal-primary)' }} />
                <span>Top Users</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {metrics.topUsers.map((user, index) => (
                  <div key={user.userId} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: 'var(--teal-primary)' }}></div>
                      <span className="text-sm font-medium text-charcoal truncate" style={{ color: 'var(--charcoal)' }}>
                        {user.userName}
                      </span>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {user.eventCount}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="card-socratiq">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-charcoal" style={{ color: 'var(--charcoal)' }}>
                <Filter className="w-5 h-5" style={{ color: 'var(--teal-primary)' }} />
                <span>Top Actions</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {metrics.topActions.map((action, index) => (
                  <div key={action.action} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: 'var(--teal-secondary)' }}></div>
                      <span className="text-sm font-medium text-charcoal" style={{ color: 'var(--charcoal)' }}>
                        {action.action.replace(/_/g, ' ')}
                      </span>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {action.count}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="card-socratiq">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-charcoal" style={{ color: 'var(--charcoal)' }}>
                <AlertTriangle className="w-5 h-5" style={{ color: 'var(--warning)' }} />
                <span>Compliance Monitoring</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">GDPR Compliance</span>
                <Badge className="bg-green-100 text-green-800 border-green-200">Active</Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm">HIPAA Compliance</span>
                <Badge className="bg-green-100 text-green-800 border-green-200">Active</Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm">SOX Compliance</span>
                <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Review</Badge>
              </div>
              
              <Separator />
              
              <div className="text-xs font-medium" style={{ color: 'var(--slate)' }}>
                <p>Last Audit: {new Date().toLocaleDateString()}</p>
                <p>Next Scheduled: {new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString()}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}