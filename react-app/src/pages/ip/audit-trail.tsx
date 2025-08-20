import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Shield, 
  Search, 
  Filter, 
  Download, 
  Eye, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  User,
  FileText,
  Database,
  Settings,
  Lock
} from "lucide-react";

interface AuditEvent {
  id: string;
  timestamp: Date;
  user: string;
  action: string;
  resource: string;
  resourceType: 'document' | 'patent' | 'research' | 'system';
  status: 'success' | 'warning' | 'error';
  ipAddress: string;
  details: string;
  riskLevel: 'low' | 'medium' | 'high';
}

export default function AuditTrail() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterUser, setFilterUser] = useState("");
  const [filterAction, setFilterAction] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  const auditEvents: AuditEvent[] = [
    {
      id: "audit_001",
      timestamp: new Date(Date.now() - 10 * 60 * 1000),
      user: "vincent.carpenter@company.com",
      action: "document_upload",
      resource: "Patent_Application_2024_001.pdf",
      resourceType: "document",
      status: "success",
      ipAddress: "192.168.1.105",
      details: "Successfully uploaded patent application document",
      riskLevel: "low"
    },
    {
      id: "audit_002",
      timestamp: new Date(Date.now() - 25 * 60 * 1000),
      user: "sarah.chen@partner.com",
      action: "knowledge_graph_access",
      resource: "Oncology Research Network",
      resourceType: "research",
      status: "success",
      ipAddress: "10.0.0.45",
      details: "Accessed knowledge graph for oncology research analysis",
      riskLevel: "medium"
    },
    {
      id: "audit_003",
      timestamp: new Date(Date.now() - 45 * 60 * 1000),
      user: "john.smith@external.org",
      action: "failed_login",
      resource: "Authentication System",
      resourceType: "system",
      status: "error",
      ipAddress: "203.45.67.89",
      details: "Failed login attempt from external IP address",
      riskLevel: "high"
    },
    {
      id: "audit_004",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      user: "researcher@nih.gov",
      action: "patent_search",
      resource: "US Patent Database",
      resourceType: "patent",
      status: "success",
      ipAddress: "192.168.1.78",
      details: "Performed comprehensive patent search query",
      riskLevel: "low"
    },
    {
      id: "audit_005",
      timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
      user: "admin@company.com",
      action: "system_configuration",
      resource: "Audit Settings",
      resourceType: "system",
      status: "warning",
      ipAddress: "192.168.1.1",
      details: "Modified audit retention policy settings",
      riskLevel: "medium"
    }
  ];

  const auditMetrics = [
    { label: "Total Events", value: "15,847", trend: "+1,247 today" },
    { label: "Security Alerts", value: "23", trend: "3 high risk" },
    { label: "Active Users", value: "289", trend: "+12 new logins" },
    { label: "Failed Attempts", value: "45", trend: "8 blocked IPs" }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-orange-500" />;
      case 'error': return <AlertTriangle className="w-4 h-4 text-red-500" />;
      default: return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'bg-green-100 text-green-800 border-green-200';
      case 'warning': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'error': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'document': return <FileText className="w-4 h-4 text-blue-500" />;
      case 'patent': return <Shield className="w-4 h-4 text-purple-500" />;
      case 'research': return <Database className="w-4 h-4 text-green-500" />;
      case 'system': return <Settings className="w-4 h-4 text-gray-500" />;
      default: return <FileText className="w-4 h-4 text-gray-500" />;
    }
  };

  const filteredEvents = auditEvents.filter(event => {
    const matchesSearch = !searchQuery || 
      event.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.resource.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesUser = !filterUser || filterUser === "all" || event.user.includes(filterUser);
    const matchesAction = !filterAction || filterAction === "all" || event.action === filterAction;
    const matchesStatus = !filterStatus || filterStatus === "all" || event.status === filterStatus;
    
    return matchesSearch && matchesUser && matchesAction && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-gray-200 pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-red-500 flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Audit Trail</h1>
              <p className="text-gray-600">Comprehensive activity monitoring and compliance tracking</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </Button>
            <Button variant="outline">
              <Settings className="w-4 h-4 mr-2" />
              Configure
            </Button>
          </div>
        </div>
      </div>

      {/* Audit Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {auditMetrics.map((metric) => (
          <Card key={metric.label}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{metric.label}</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metric.value}</div>
              <p className="text-xs text-muted-foreground">{metric.trend}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="events" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="events">Audit Events</TabsTrigger>
          <TabsTrigger value="security">Security Alerts</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="events" className="space-y-6">
          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle>Search & Filter Events</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div className="md:col-span-2">
                  <Input 
                    placeholder="Search users, actions, resources..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Select value={filterUser} onValueChange={setFilterUser}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by user" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Users</SelectItem>
                    <SelectItem value="vincent.carpenter">Vincent Carpenter</SelectItem>
                    <SelectItem value="sarah.chen">Sarah Chen</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filterAction} onValueChange={setFilterAction}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by action" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Actions</SelectItem>
                    <SelectItem value="document_upload">Document Upload</SelectItem>
                    <SelectItem value="knowledge_graph_access">Graph Access</SelectItem>
                    <SelectItem value="patent_search">Patent Search</SelectItem>
                    <SelectItem value="failed_login">Failed Login</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="success">Success</SelectItem>
                    <SelectItem value="warning">Warning</SelectItem>
                    <SelectItem value="error">Error</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Event List */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Audit Events ({filteredEvents.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredEvents.map((event) => (
                  <div key={event.id} className="border rounded-lg p-4 hover:bg-gray-50">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-3">
                        {getResourceIcon(event.resourceType)}
                        <div>
                          <div className="font-medium">{event.action.replace('_', ' ').toUpperCase()}</div>
                          <div className="text-sm text-gray-600">{event.resource}</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(event.status)}
                        <Badge className={`text-xs border ${getStatusColor(event.status)}`}>
                          {event.status.toUpperCase()}
                        </Badge>
                        <Badge className={`text-xs border ${getRiskColor(event.riskLevel)}`}>
                          {event.riskLevel.toUpperCase()} RISK
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600 mb-3">
                      <div className="flex items-center gap-1">
                        <User className="w-4 h-4" />
                        {event.user}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {event.timestamp.toLocaleString()}
                      </div>
                      <div className="flex items-center gap-1">
                        <Lock className="w-4 h-4" />
                        {event.ipAddress}
                      </div>
                    </div>
                    
                    <div className="text-sm text-gray-700 mb-3">
                      {event.details}
                    </div>
                    
                    <div className="flex justify-end">
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4 mr-2" />
                        View Details
                      </Button>
                    </div>
                  </div>
                ))}
                
                {filteredEvents.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <Shield className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                    <p>No audit events match your current filters.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Security Alerts & Threats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-gray-500">
                <AlertTriangle className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <p>Security monitoring dashboard coming soon...</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="compliance">
          <Card>
            <CardHeader>
              <CardTitle>Compliance Monitoring</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-gray-500">
                <CheckCircle className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <p>Compliance tracking and reporting coming soon...</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports">
          <Card>
            <CardHeader>
              <CardTitle>Audit Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-gray-500">
                <FileText className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <p>Automated report generation coming soon...</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}