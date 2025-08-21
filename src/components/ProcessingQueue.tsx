import { FileText, Loader } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const mockProcessingDocs = [
  {
    id: '1',
    name: 'FDA_Submission_Draft.pdf',
    progress: 45,
    status: 'Extracting entities...'
  },
  {
    id: '2',
    name: 'Patent_Application.docx', 
    progress: 78,
    status: 'Building knowledge graph...'
  }
];

export default function ProcessingQueue() {
  if (mockProcessingDocs.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Loader className="w-5 h-5 animate-spin" />
          <span>Processing Queue</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {mockProcessingDocs.map((doc) => (
            <div key={doc.id} className="bg-gray-50 rounded-lg p-4 border">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-3">
                  <FileText className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium">{doc.name}</p>
                    <p className="text-xs text-gray-600">{doc.status}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Loader className="w-4 h-4 animate-spin text-blue-500" />
                  <span className="text-xs text-blue-600 font-medium">
                    {doc.progress}%
                  </span>
                </div>
              </div>
              <Progress value={doc.progress} className="h-2" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}