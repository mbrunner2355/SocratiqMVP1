import { useQuery } from "@tanstack/react-query";
import { FileText, Loader } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import type { Document } from "@shared/schema";

export default function ProcessingQueue() {
  const { data: documents = [] } = useQuery<Document[]>({
    queryKey: ["/api/documents"],
    refetchInterval: 2000, // Refresh every 2 seconds for real-time updates
  });

  const processingDocuments = documents.filter(doc => 
    doc.status === 'queued' || doc.status === 'processing'
  );

  if (processingDocuments.length === 0) {
    return null;
  }

  return (
    <div className="mt-6">
      <h3 className="text-sm font-medium text-secondary mb-3">Processing Queue</h3>
      <div className="space-y-3">
        {processingDocuments.map((document) => (
          <div key={document.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <FileText className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-secondary">{document.originalName}</p>
                  <p className="text-xs text-gray-600">
                    {Math.round(document.fileSize / 1024)} KB • {
                      document.status === 'queued' ? 'Queued...' : 'Processing...'
                    }
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Loader className="w-4 h-4 animate-spin text-accent" />
                <span className="text-xs text-accent font-medium">
                  {document.processingProgress || 0}%
                </span>
              </div>
            </div>
            <div className="mt-2">
              <Progress 
                value={document.processingProgress || 0} 
                className="h-2"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
