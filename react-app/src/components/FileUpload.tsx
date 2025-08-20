import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { CloudUpload, FileText, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";

export default function FileUpload() {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    for (const file of acceptedFiles) {
      await uploadFile(file);
    }
  }, []);

  const uploadFile = async (file: File) => {
    try {
      setIsUploading(true);
      
      const formData = new FormData();
      formData.append('file', file);

      const response = await apiRequest('/api/documents/upload', {
        method: 'POST',
        body: formData
      });
      const result = await response;

      toast({
        title: "Upload Successful",
        description: `${file.name} has been uploaded and is being processed.`,
      });

      // Invalidate queries to refresh the UI
      queryClient.invalidateQueries({ queryKey: ["/api/documents"] });
      queryClient.invalidateQueries({ queryKey: ["/api/analytics"] });

    } catch (error) {
      console.error('Upload failed:', error);
      toast({
        title: "Upload Failed",
        description: error instanceof Error ? error.message : "Failed to upload file",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt']
    },
    maxSize: 50 * 1024 * 1024, // 50MB
    disabled: isUploading
  });

  const getBorderColor = () => {
    if (isDragReject) return 'border-red-400';
    if (isDragActive) return 'border-teal-secondary';
    return 'border-slate';
  };

  const getBgColor = () => {
    if (isDragReject) return 'bg-red-50';
    if (isDragActive) return 'bg-teal-light';
    return '';
  };

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${getBorderColor()} ${getBgColor()}`}
    >
      <input {...getInputProps()} />
      
      <div className="space-y-4">
        <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto" style={{ background: 'linear-gradient(135deg, var(--teal-light) 0%, var(--warm-gray) 100%)' }}>
          {isDragReject ? (
            <AlertCircle className="w-8 h-8 text-red-400" />
          ) : (
            <CloudUpload className="w-8 h-8" style={{ color: 'var(--teal-primary)' }} />
          )}
        </div>
        
        <div>
          {isDragReject ? (
            <>
              <p className="text-lg font-medium text-red-600">Unsupported file type</p>
              <p className="text-sm text-red-500">Please upload PDF, DOCX, or TXT files only</p>
            </>
          ) : isDragActive ? (
            <>
              <p className="text-lg font-bold" style={{ color: 'var(--teal-secondary)' }}>Drop files here</p>
              <p className="text-sm font-medium" style={{ color: 'var(--teal-primary)' }}>Release to upload</p>
            </>
          ) : (
            <>
              <p className="text-lg font-bold" style={{ color: 'var(--charcoal)' }}>
                {isUploading ? "Uploading..." : "Drag & drop files here"}
              </p>
              <p className="text-sm font-medium" style={{ color: 'var(--slate)' }}>or click to browse</p>
              <p className="text-sm font-medium mt-2" style={{ color: 'var(--slate)' }}>Supports PDF, DOCX, TXT • Max 50MB per file</p>
            </>
          )}
        </div>
        
        {!isUploading && (
          <Button 
            type="button"
            className="btn-primary"
            disabled={isDragReject}
          >
            <FileText className="w-4 h-4 mr-2" />
            Select Files
          </Button>
        )}
      </div>
    </div>
  );
}
