import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Download, Upload, Database, Archive } from 'lucide-react';
import { exportLocalStorageData, downloadProjectData, uploadProjectDataToDatabase } from '../utils/projectExport';

export function ProjectBackupManager() {
  const [isExporting, setIsExporting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', content: string } | null>(null);

  const handleDownloadBackup = () => {
    try {
      setIsExporting(true);
      downloadProjectData();
      setMessage({ type: 'success', content: 'Project data backup downloaded successfully!' });
    } catch (error) {
      console.error('Export error:', error);
      setMessage({ type: 'error', content: 'Failed to export project data' });
    } finally {
      setIsExporting(false);
    }
  };

  const handleUploadToDatabase = async () => {
    try {
      setIsUploading(true);
      const data = exportLocalStorageData();
      
      if (!data['emme-projects'] || data['emme-projects'].length === 0) {
        setMessage({ type: 'error', content: 'No projects found in local storage to upload' });
        return;
      }

      // Use the import backup endpoint
      const apiUrl = import.meta.env.VITE_API_BASE_URL || '';
      const response = await fetch(`${apiUrl}/api/emme/projects/import-backup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ projects: data['emme-projects'] }),
      });

      if (response.ok) {
        const result = await response.json();
        setMessage({ type: 'success', content: result.message });
      } else {
        throw new Error(`Upload failed: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Upload error:', error);
      setMessage({ type: 'error', content: 'Failed to upload projects to database' });
    } finally {
      setIsUploading(false);
    }
  };

  const handleCreateZipBackup = async () => {
    try {
      setIsExporting(true);
      
      // Get project data
      const projectData = exportLocalStorageData();
      
      // Create a comprehensive backup object
      const backupData = {
        metadata: {
          exportDate: new Date().toISOString(),
          version: '1.0',
          description: 'EMME Engage Project Backup'
        },
        projects: projectData['emme-projects'] || [],
        projectContext: projectData['emme-project-context'],
        currentProject: projectData['current-project'],
        sessionData: Object.keys(projectData).reduce((acc, key) => {
          if (key.startsWith('project-')) {
            acc[key] = projectData[key];
          }
          return acc;
        }, {} as any)
      };

      // Create a blob with the backup data
      const backupJson = JSON.stringify(backupData, null, 2);
      const backupBlob = new Blob([backupJson], { type: 'application/json' });
      
      // Create instructions file
      const instructions = `# EMME Engage Project Backup

## Contents
- projects.json: Full project backup data
- This file: Restoration instructions

## How to Restore
1. Import the projects.json file using the Project Backup Manager in the application
2. Or manually upload via the /api/emme/projects/import-backup endpoint

## Project Summary
- Export Date: ${new Date().toISOString()}
- Number of Projects: ${(projectData['emme-projects'] || []).length}
- Current Project: ${projectData['current-project']?.name || 'None'}

## Projects Included:
${(projectData['emme-projects'] || []).map((p: any, i: number) => 
  `${i + 1}. ${p.name || p.projectTitle || 'Unnamed Project'} (${p.client || 'Unknown Client'})`
).join('\n')}
`;

      const instructionsBlob = new Blob([instructions], { type: 'text/markdown' });

      // Create zip file using browser APIs (simplified approach)
      // Since we can't use JSZip without installing it, we'll create separate files
      
      // Download the JSON backup
      const jsonUrl = URL.createObjectURL(backupBlob);
      const jsonLink = document.createElement('a');
      jsonLink.href = jsonUrl;
      jsonLink.download = `emme-projects-backup-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(jsonLink);
      jsonLink.click();
      document.body.removeChild(jsonLink);
      URL.revokeObjectURL(jsonUrl);

      // Download the instructions
      const instructionsUrl = URL.createObjectURL(instructionsBlob);
      const instructionsLink = document.createElement('a');
      instructionsLink.href = instructionsUrl;
      instructionsLink.download = `backup-instructions-${new Date().toISOString().slice(0, 10)}.md`;
      document.body.appendChild(instructionsLink);
      instructionsLink.click();
      document.body.removeChild(instructionsLink);
      URL.revokeObjectURL(instructionsUrl);

      setMessage({ type: 'success', content: 'Complete backup files downloaded! Check your Downloads folder for the JSON backup and instructions.' });
    } catch (error) {
      console.error('Backup creation error:', error);
      setMessage({ type: 'error', content: 'Failed to create backup files' });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Archive className="h-5 w-5" />
            Project Backup Manager
          </CardTitle>
          <CardDescription>
            Export and backup your EMME Engage project data to prevent data loss
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {message && (
            <Alert className={message.type === 'error' ? 'border-red-200 bg-red-50' : 'border-green-200 bg-green-50'}>
              <AlertDescription className={message.type === 'error' ? 'text-red-700' : 'text-green-700'}>
                {message.content}
              </AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              onClick={handleDownloadBackup}
              disabled={isExporting}
              className="flex items-center gap-2"
              variant="outline"
              data-testid="button-download-backup"
            >
              <Download className="h-4 w-4" />
              {isExporting ? 'Exporting...' : 'Download JSON Backup'}
            </Button>

            <Button
              onClick={handleCreateZipBackup}
              disabled={isExporting}
              className="flex items-center gap-2"
              variant="outline"
              data-testid="button-create-zip"
            >
              <Archive className="h-4 w-4" />
              {isExporting ? 'Creating...' : 'Create Full Backup'}
            </Button>

            <Button
              onClick={handleUploadToDatabase}
              disabled={isUploading}
              className="flex items-center gap-2"
              data-testid="button-upload-database"
            >
              <Database className="h-4 w-4" />
              {isUploading ? 'Uploading...' : 'Save to Database'}
            </Button>
          </div>

          <div className="text-sm text-gray-600 space-y-2">
            <p><strong>Download JSON Backup:</strong> Downloads your project data as a JSON file</p>
            <p><strong>Create Full Backup:</strong> Downloads comprehensive backup with instructions</p>
            <p><strong>Save to Database:</strong> Uploads your localStorage projects to the database for cross-device access</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}