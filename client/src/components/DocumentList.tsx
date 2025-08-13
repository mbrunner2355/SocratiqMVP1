import { useQuery, useMutation } from "@tanstack/react-query";
import { FileText, Calendar, User, Building, MapPin, Pill, Trash2, Download, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { Document, Entity } from "@shared/schema";

const getFileIcon = (fileType: string) => {
  if (fileType.includes('pdf')) return '📄';
  if (fileType.includes('word')) return '📝';
  if (fileType.includes('text')) return '📋';
  return '📄';
};

const getEntityIcon = (type: string) => {
  switch (type) {
    case 'PERSON': return <User className="w-3 h-3" />;
    case 'ORGANIZATION': return <Building className="w-3 h-3" />;
    case 'LOCATION': return <MapPin className="w-3 h-3" />;
    case 'DATE': return <Calendar className="w-3 h-3" />;
    case 'DRUG': return <Pill className="w-3 h-3" />;
    default: return <FileText className="w-3 h-3" />;
  }
};

const getEntityColor = (type: string) => {
  switch (type) {
    case 'PERSON': return 'bg-green-100 text-green-800';
    case 'ORGANIZATION': return 'bg-blue-100 text-blue-800';
    case 'LOCATION': return 'bg-purple-100 text-purple-800';
    case 'DATE': return 'bg-yellow-100 text-yellow-800';
    case 'DRUG': return 'bg-red-100 text-red-800';
    case 'MEDICAL_TERM': return 'bg-orange-100 text-orange-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const getSemanticTagColor = (tag: string) => {
  switch (tag.toLowerCase()) {
    case 'clinical trial': return 'bg-red-50 text-red-700 border-red-200';
    case 'regulatory': return 'bg-blue-50 text-blue-700 border-blue-200';
    case 'research': return 'bg-green-50 text-green-700 border-green-200';
    case 'oncology': return 'bg-purple-50 text-purple-700 border-purple-200';
    case 'genetics': return 'bg-pink-50 text-pink-700 border-pink-200';
    default: return 'bg-gray-50 text-gray-700 border-gray-200';
  }
};

export default function DocumentList() {
  const { toast } = useToast();
  
  const { data: documents = [], isLoading } = useQuery<Document[]>({
    queryKey: ["/api/documents"],
    refetchInterval: 5000, // Refresh every 5 seconds for real-time updates
  });

  const deleteMutation = useMutation({
    mutationFn: async (documentId: string) => {
      await apiRequest('DELETE', `/api/documents/${documentId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/documents"] });
      queryClient.invalidateQueries({ queryKey: ["/api/analytics"] });
      toast({
        title: "Document Deleted",
        description: "Document has been successfully deleted.",
      });
    },
    onError: (error) => {
      toast({
        title: "Delete Failed",
        description: error instanceof Error ? error.message : "Failed to delete document",
        variant: "destructive",
      });
    },
  });

  const handleExport = async (format: 'json' | 'csv') => {
    try {
      const response = await fetch(`/api/export/${format}`);
      if (!response.ok) throw new Error('Export failed');
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `documents.${format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast({
        title: "Export Successful",
        description: `Documents exported as ${format.toUpperCase()}.`,
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Failed to export documents",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="space-y-3">
            <div className="h-20 bg-gray-200 rounded"></div>
            <div className="h-20 bg-gray-200 rounded"></div>
            <div className="h-20 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  const completedDocuments = documents.filter(doc => doc.status === 'completed');

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-lg font-semibold text-secondary">Processed Documents</h2>
            <p className="text-sm text-gray-600 mt-1">Recently analyzed documents with extracted insights</p>
          </div>
          <div className="flex items-center space-x-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => handleExport('csv')}
            >
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
            <Button 
              variant="default" 
              size="sm"
              onClick={() => handleExport('json')}
              className="bg-accent text-white hover:bg-cyan-600"
            >
              <Download className="w-4 h-4 mr-2" />
              Export JSON
            </Button>
          </div>
        </div>
      </div>

      {completedDocuments.length === 0 ? (
        <div className="p-12 text-center">
          <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No processed documents yet</h3>
          <p className="text-gray-600">Upload some documents to see them analyzed here.</p>
        </div>
      ) : (
        <div className="divide-y divide-gray-200">
          {completedDocuments.map((document) => {
            const entities = Array.isArray(document.entities) ? document.entities : [];
            const semanticTags = Array.isArray(document.semanticTags) ? document.semanticTags : [];
            
            return (
              <div key={document.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-xl">
                      {getFileIcon(document.fileType)}
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="text-base font-semibold text-secondary">{document.originalName}</h3>
                      <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                        <span>
                          <FileText className="w-4 h-4 inline mr-1" />
                          {document.fileType.split('/')[1].toUpperCase()} • {Math.round(document.fileSize / 1024)} KB
                        </span>
                        <span>
                          <Calendar className="w-4 h-4 inline mr-1" />
                          Processed {new Date(document.createdAt!).toLocaleString()}
                        </span>
                      </div>
                      
                      {/* Extracted Entities */}
                      {entities.length > 0 && (
                        <div className="mt-4">
                          <h4 className="text-sm font-medium text-secondary mb-2">Key Entities Extracted</h4>
                          <div className="flex flex-wrap gap-2">
                            {entities.slice(0, 4).map((entity, idx) => (
                              <Badge 
                                key={idx} 
                                variant="secondary"
                                className={`${getEntityColor(entity.type)} flex items-center gap-1`}
                              >
                                {getEntityIcon(entity.type)}
                                {entity.value}
                              </Badge>
                            ))}
                            {entities.length > 4 && (
                              <span className="text-xs text-gray-500">+{entities.length - 4} more</span>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Semantic Tags */}
                      {semanticTags.length > 0 && (
                        <div className="mt-3">
                          <h4 className="text-sm font-medium text-secondary mb-2">Semantic Categories</h4>
                          <div className="flex flex-wrap gap-2">
                            {semanticTags.map((tag, idx) => (
                              <span 
                                key={idx}
                                className={`px-2 py-1 rounded text-xs border ${getSemanticTagColor(tag)}`}
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 ml-4">
                    <Badge variant="secondary" className="bg-success text-white">
                      Complete
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteMutation.mutate(document.id)}
                      disabled={deleteMutation.isPending}
                      className="text-red-600 hover:text-red-800 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Processing Stats */}
                <div className="mt-4 grid grid-cols-4 gap-4 text-center">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-lg font-semibold text-secondary">{entities.length}</p>
                    <p className="text-xs text-gray-600">Entities Found</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-lg font-semibold text-secondary">
                      {document.confidence ? `${Math.round(document.confidence * 100)}%` : 'N/A'}
                    </p>
                    <p className="text-xs text-gray-600">Confidence</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-lg font-semibold text-secondary">
                      {document.processingTimeMs ? `${Math.round(document.processingTimeMs / 1000)}s` : 'N/A'}
                    </p>
                    <p className="text-xs text-gray-600">Processing Time</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-lg font-semibold text-secondary">{document.wordCount || 0}</p>
                    <p className="text-xs text-gray-600">Words</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
