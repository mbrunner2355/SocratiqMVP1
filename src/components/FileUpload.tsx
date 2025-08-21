import { useState } from "react";
import { CloudUpload, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function FileUpload() {
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;
    
    setIsUploading(true);
    console.log('Uploading files:', Array.from(files).map(f => f.name));
    
    // Simulate upload
    setTimeout(() => {
      setIsUploading(false);
      console.log('Upload completed');
    }, 2000);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <CloudUpload className="w-5 h-5" />
          <span>Document Upload</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <div className="space-y-2">
            <h3 className="text-lg font-medium">Upload Documents</h3>
            <p className="text-gray-600">Select PDF, DOCX, or TXT files for processing</p>
          </div>
          <div className="mt-4">
            <input
              type="file"
              id="file-upload"
              multiple
              accept=".pdf,.docx,.txt"
              onChange={handleFileUpload}
              className="hidden"
              disabled={isUploading}
            />
            <Button 
              onClick={() => document.getElementById('file-upload')?.click()}
              disabled={isUploading}
            >
              {isUploading ? 'Uploading...' : 'Choose Files'}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}