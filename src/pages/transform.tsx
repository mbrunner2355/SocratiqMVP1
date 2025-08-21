import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import FileUpload from "@/components/FileUpload";
import DocumentList from "@/components/DocumentList";
import ProcessingQueue from "@/components/ProcessingQueue";
import { FileText, Upload, Clock } from "lucide-react";

export default function Transform() {
  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div className="border-b border-gray-200 pb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-lg bg-blue-500 flex items-center justify-center">
            <FileText className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Transform™</h1>
            <p className="text-gray-600">Document Processing Engine</p>
          </div>
        </div>
      </div>

      {/* Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Upload className="w-5 h-5" />
            <span>Document Upload & Processing</span>
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Upload documents for AI-powered semantic analysis and entity extraction
          </p>
        </CardHeader>
        <CardContent>
          <FileUpload />
        </CardContent>
      </Card>

      {/* Processing Queue */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Clock className="w-5 h-5" />
            <span>Processing Queue</span>
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Monitor real-time document processing status
          </p>
        </CardHeader>
        <CardContent>
          <ProcessingQueue />
        </CardContent>
      </Card>

      {/* Document List */}
      <DocumentList />
    </div>
  );
}