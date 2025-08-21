import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { 
  FileCheck, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Eye,
  Calendar,
  User
} from "lucide-react";

interface MLRSubmission {
  id: string;
  title: string;
  therapeutic_area: string;
  content_type: string;
  status: string;
  approval_status?: string;
  submitted_date: string;
  completed_date?: string;
  processing_time_hours?: number;
  compliance_score?: number;
  reviewer: string;
  conditions?: string[];
  revision_notes?: string[];
  rejection_reasons?: string[];
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'approved':
      return <CheckCircle className="w-4 h-4 text-green-600" />;
    case 'approved_with_conditions':
      return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
    case 'rejected':
      return <XCircle className="w-4 h-4 text-red-600" />;
    case 'needs_revision':
      return <FileCheck className="w-4 h-4 text-orange-600" />;
    case 'processing':
      return <Clock className="w-4 h-4 text-blue-600" />;
    default:
      return <FileCheck className="w-4 h-4 text-gray-600" />;
  }
};

const getStatusBadge = (status: string) => {
  const config = {
    'approved': { variant: 'bg-green-100 text-green-800', label: 'Approved' },
    'approved_with_conditions': { variant: 'bg-yellow-100 text-yellow-800', label: 'Approved*' },
    'rejected': { variant: 'bg-red-100 text-red-800', label: 'Rejected' },
    'needs_revision': { variant: 'bg-orange-100 text-orange-800', label: 'Needs Revision' },
    'processing': { variant: 'bg-blue-100 text-blue-800', label: 'Processing' }
  };
  
  const statusConfig = config[status as keyof typeof config] || 
    { variant: 'bg-gray-100 text-gray-800', label: status };
    
  return (
    <Badge className={statusConfig.variant}>
      {statusConfig.label}
    </Badge>
  );
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export function MLRSubmissions() {
  const { data: submissions, isLoading } = useQuery<{total: number, submissions: MLRSubmission[]}>({
    queryKey: ["/api/emme-connect/mlr/submissions"]
  });

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          {[...Array(5)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!submissions) {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-600">No MLR submissions found.</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">MLR Submissions</h1>
            <p className="text-gray-600">4-hour pharmaceutical content review workflow</p>
          </div>
          <div className="flex items-center space-x-2">
            <Badge className="bg-blue-100 text-blue-800">
              {submissions.total} Total Submissions
            </Badge>
            <Button className="bg-purple-600 hover:bg-purple-700">
              New Submission
            </Button>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {submissions.submissions.map((submission) => (
          <Card key={submission.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    {getStatusIcon(submission.status)}
                    <h3 className="font-semibold text-gray-900">{submission.title}</h3>
                    {getStatusBadge(submission.status)}
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <span className="flex items-center space-x-1">
                      <FileCheck className="w-4 h-4" />
                      <span>{submission.id}</span>
                    </span>
                    <span className="capitalize">{submission.therapeutic_area}</span>
                    <span className="capitalize">{submission.content_type.replace('_', ' ')}</span>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  <Eye className="w-4 h-4 mr-2" />
                  View Details
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="flex items-center space-x-2 text-sm">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">Submitted:</span>
                  <span className="font-medium">{formatDate(submission.submitted_date)}</span>
                </div>
                
                {submission.completed_date && (
                  <div className="flex items-center space-x-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">Completed:</span>
                    <span className="font-medium">{formatDate(submission.completed_date)}</span>
                  </div>
                )}
                
                <div className="flex items-center space-x-2 text-sm">
                  <User className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">Reviewer:</span>
                  <span className="font-medium">{submission.reviewer}</span>
                </div>
              </div>

              {submission.processing_time_hours && (
                <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3 mb-4">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium">Processing Time:</span>
                    <span className="text-sm text-blue-600 font-bold">
                      {submission.processing_time_hours}h
                    </span>
                    <span className="text-xs text-gray-500">(vs 3 weeks traditional)</span>
                  </div>
                  {submission.compliance_score && (
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium">Compliance Score:</span>
                      <span className={`text-sm font-bold ${
                        submission.compliance_score >= 0.9 ? 'text-green-600' :
                        submission.compliance_score >= 0.8 ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                        {Math.round(submission.compliance_score * 100)}%
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* Conditions, Revisions, or Rejection Reasons */}
              {submission.conditions && submission.conditions.length > 0 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-2">
                  <p className="text-sm font-medium text-yellow-800 mb-1">Approval Conditions:</p>
                  <ul className="text-sm text-yellow-700 space-y-1">
                    {submission.conditions.map((condition, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <span>•</span>
                        <span>{condition}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {submission.revision_notes && submission.revision_notes.length > 0 && (
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 mb-2">
                  <p className="text-sm font-medium text-orange-800 mb-1">Revision Required:</p>
                  <ul className="text-sm text-orange-700 space-y-1">
                    {submission.revision_notes.map((note, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <span>•</span>
                        <span>{note}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {submission.rejection_reasons && submission.rejection_reasons.length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-2">
                  <p className="text-sm font-medium text-red-800 mb-1">Rejection Reasons:</p>
                  <ul className="text-sm text-red-700 space-y-1">
                    {submission.rejection_reasons.map((reason, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <span>•</span>
                        <span>{reason}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}