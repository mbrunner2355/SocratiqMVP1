import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Badge } from '../ui/badge'
import { FileUploadComponent } from '../FileUploadComponent'
import { useAppStore } from '../../stores/appStore'
import { 
  FileText,
  Globe,
  Zap,
  CheckCircle,
  Clock,
  Users,
  AlertTriangle,
  Workflow,
  Languages,
  Target,
  BarChart3,
  Shield,
  Upload
} from 'lucide-react'

export function ContentOrchestration() {
  const { documents } = useAppStore()

  const orchestrationMetrics = {
    totalAssets: 15429,
    activeWorkflows: 89,
    multilingualAssets: 4567,
    complianceRate: 97.3,
    avgApprovalTime: "2.4 days",
    globalCampaigns: 34
  }

  const recentUploads = documents.slice(0, 5)

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800'
      case 'processing': return 'bg-blue-100 text-blue-800'
      case 'failed': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Content Orchestration</h1>
          <p className="text-gray-600 mt-1">Manage pharmaceutical content workflows and compliance</p>
        </div>
      </div>

      {/* Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600">Total Assets</p>
                <p className="text-lg font-bold text-gray-900">{orchestrationMetrics.totalAssets.toLocaleString()}</p>
              </div>
              <FileText className="w-6 h-6 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600">Active Workflows</p>
                <p className="text-lg font-bold text-gray-900">{orchestrationMetrics.activeWorkflows}</p>
              </div>
              <Workflow className="w-6 h-6 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600">Multilingual Assets</p>
                <p className="text-lg font-bold text-gray-900">{orchestrationMetrics.multilingualAssets.toLocaleString()}</p>
              </div>
              <Languages className="w-6 h-6 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600">Compliance Rate</p>
                <p className="text-lg font-bold text-gray-900">{orchestrationMetrics.complianceRate}%</p>
              </div>
              <Shield className="w-6 h-6 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600">Avg Approval Time</p>
                <p className="text-lg font-bold text-gray-900">{orchestrationMetrics.avgApprovalTime}</p>
              </div>
              <Clock className="w-6 h-6 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600">Global Campaigns</p>
                <p className="text-lg font-bold text-gray-900">{orchestrationMetrics.globalCampaigns}</p>
              </div>
              <Globe className="w-6 h-6 text-teal-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upload Content */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Upload className="w-5 h-5 mr-2" />
              Upload Content
            </CardTitle>
            <CardDescription>
              Upload pharmaceutical documents for processing and compliance review
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FileUploadComponent />
          </CardContent>
        </Card>

        {/* Recent Uploads */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Uploads</CardTitle>
            <CardDescription>Latest documents in the processing pipeline</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentUploads.length > 0 ? (
                recentUploads.map((doc) => (
                  <div key={doc.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <FileText className="w-5 h-5 text-blue-600" />
                      <div>
                        <p className="font-medium text-gray-900">{doc.originalName}</p>
                        <p className="text-sm text-gray-600">
                          {(doc.fileSize / 1024 / 1024).toFixed(2)} MB • 
                          {new Date(doc.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <Badge className={getStatusColor(doc.status)}>
                      {doc.status}
                    </Badge>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <FileText className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>No documents uploaded yet</p>
                  <p className="text-sm">Upload your first document to get started</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Content Processing Pipeline */}
      <Card>
        <CardHeader>
          <CardTitle>Content Processing Pipeline</CardTitle>
          <CardDescription>
            Automated workflow for pharmaceutical content review and approval
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Upload className="w-8 h-8 text-blue-600" />
              </div>
              <h4 className="font-semibold text-gray-900">Content Upload</h4>
              <p className="text-sm text-gray-600 mt-1">Document ingestion and validation</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Zap className="w-8 h-8 text-yellow-600" />
              </div>
              <h4 className="font-semibold text-gray-900">AI Processing</h4>
              <p className="text-sm text-gray-600 mt-1">NLP analysis and entity extraction</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Shield className="w-8 h-8 text-orange-600" />
              </div>
              <h4 className="font-semibold text-gray-900">Compliance Check</h4>
              <p className="text-sm text-gray-600 mt-1">MLR review and regulatory validation</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h4 className="font-semibold text-gray-900">Distribution</h4>
              <p className="text-sm text-gray-600 mt-1">Approved content deployment</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Global Campaign Management */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Global Campaigns</CardTitle>
            <CardDescription>Multi-region pharmaceutical content campaigns</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  name: "Women's Health Initiative",
                  regions: ["US", "EU", "APAC"],
                  languages: 8,
                  compliance: 98.2,
                  status: "Active"
                },
                {
                  name: "Oncology HCP Education",
                  regions: ["Global"],
                  languages: 12,
                  compliance: 96.7,
                  status: "In Review"
                },
                {
                  name: "Cardiovascular Patient Support",
                  regions: ["US", "Canada"],
                  languages: 3,
                  compliance: 99.1,
                  status: "Approved"
                }
              ].map((campaign, index) => (
                <div key={index} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900">{campaign.name}</h4>
                    <Badge className={
                      campaign.status === 'Active' ? 'bg-green-100 text-green-800' :
                      campaign.status === 'In Review' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-blue-100 text-blue-800'
                    }>
                      {campaign.status}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Regions</p>
                      <p className="font-medium">{campaign.regions.join(', ')}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Languages</p>
                      <p className="font-medium">{campaign.languages}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Compliance</p>
                      <p className="font-medium">{campaign.compliance}%</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>MLR Workflow Status</CardTitle>
            <CardDescription>Medical, Legal, Regulatory review pipeline</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { stage: "Medical Review", count: 23, avgTime: "1.2 days", status: "On Track" },
                { stage: "Legal Review", count: 15, avgTime: "2.1 days", status: "Delayed" },
                { stage: "Regulatory Review", count: 8, avgTime: "1.8 days", status: "On Track" },
                { stage: "Final Approval", count: 12, avgTime: "0.8 days", status: "Ahead" }
              ].map((stage, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">{stage.stage}</h4>
                    <p className="text-sm text-gray-600">{stage.count} items • {stage.avgTime} avg</p>
                  </div>
                  <Badge className={
                    stage.status === 'On Track' ? 'bg-green-100 text-green-800' :
                    stage.status === 'Delayed' ? 'bg-red-100 text-red-800' :
                    'bg-blue-100 text-blue-800'
                  }>
                    {stage.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}