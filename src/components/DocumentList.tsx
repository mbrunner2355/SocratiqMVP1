import { FileText, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const mockDocuments = [
  {
    id: '1',
    originalName: 'Clinical_Trial_Protocol.pdf',
    status: 'completed' as const,
    uploadedAt: '2024-08-21T10:00:00Z',
    entityCount: 42
  },
  {
    id: '2', 
    originalName: 'Market_Analysis_Report.docx',
    status: 'processing' as const,
    uploadedAt: '2024-08-21T11:30:00Z',
    entityCount: 0
  },
  {
    id: '3',
    originalName: 'Regulatory_Guidelines.txt',
    status: 'completed' as const,
    uploadedAt: '2024-08-21T09:15:00Z',
    entityCount: 28
  }
];

export default function DocumentList() {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
      case 'processing':
        return <Badge className="bg-blue-100 text-blue-800">Processing</Badge>;
      case 'failed':
        return <Badge className="bg-red-100 text-red-800">Failed</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">Unknown</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <FileText className="w-5 h-5" />
          <span>Document Library</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {mockDocuments.map((doc) => (
            <div key={doc.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center space-x-3">
                <FileText className="w-8 h-8 text-blue-500" />
                <div>
                  <h4 className="font-medium">{doc.originalName}</h4>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(doc.uploadedAt).toLocaleDateString()}</span>
                    {doc.entityCount > 0 && (
                      <span>• {doc.entityCount} entities</span>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {getStatusBadge(doc.status)}
                <Button variant="outline" size="sm">
                  View
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}