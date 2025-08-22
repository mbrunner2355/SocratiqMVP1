import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Download, Upload, Database, AlertTriangle, CheckCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export function DataMigrationBackup() {
  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'warning', content: string } | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const captureAllBrowserData = () => {
    const allData = {
      metadata: {
        backupDate: new Date().toISOString(),
        description: "Complete browser data backup including all projects and user data",
        browserInfo: navigator.userAgent
      },
      localStorage: {},
      sessionStorage: {},
      emmeProjects: {},
      userPreferences: {},
      currentSession: {}
    };

    // Capture all localStorage data
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        try {
          const value = localStorage.getItem(key);
          allData.localStorage[key] = value;
        } catch (e) {
          console.warn(`Failed to backup localStorage key: ${key}`);
        }
      }
    }

    // Capture all sessionStorage data
    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i);
      if (key) {
        try {
          const value = sessionStorage.getItem(key);
          allData.sessionStorage[key] = value;
        } catch (e) {
          console.warn(`Failed to backup sessionStorage key: ${key}`);
        }
      }
    }

    // Specifically capture EMME project data
    const emmeProjectContext = sessionStorage.getItem('emme-project-context');
    if (emmeProjectContext) {
      try {
        allData.emmeProjects.currentProject = JSON.parse(emmeProjectContext);
      } catch (e) {
        allData.emmeProjects.currentProject = emmeProjectContext;
      }
    }

    // Look for any project-related data
    const projectKeys = Object.keys(localStorage).filter(key => 
      key.toLowerCase().includes('project') || 
      key.toLowerCase().includes('emme') ||
      key.toLowerCase().includes('vms') ||
      key.toLowerCase().includes('campaign')
    );
    
    projectKeys.forEach(key => {
      const value = localStorage.getItem(key);
      if (value) {
        try {
          allData.emmeProjects[key] = JSON.parse(value);
        } catch (e) {
          allData.emmeProjects[key] = value;
        }
      }
    });

    return allData;
  };

  const handleExportBrowserData = () => {
    try {
      setIsProcessing(true);
      const browserData = captureAllBrowserData();
      
      const dataStr = JSON.stringify(browserData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `emme-complete-data-backup-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setMessage({ 
        type: 'success', 
        content: `Complete data backup created! This includes your VMS Global Campaign project and all browser-stored data. ${Object.keys(browserData.localStorage).length} localStorage items and ${Object.keys(browserData.sessionStorage).length} sessionStorage items backed up.` 
      });
    } catch (error) {
      console.error('Data backup error:', error);
      setMessage({ 
        type: 'error', 
        content: 'Failed to create data backup. Please try again.' 
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleImportBrowserData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        setIsProcessing(true);
        const result = e.target?.result as string;
        const importedData = JSON.parse(result);

        let restoredCount = 0;

        // Restore localStorage data
        if (importedData.localStorage) {
          Object.entries(importedData.localStorage).forEach(([key, value]) => {
            try {
              localStorage.setItem(key, value as string);
              restoredCount++;
            } catch (e) {
              console.warn(`Failed to restore localStorage key: ${key}`);
            }
          });
        }

        // Restore sessionStorage data
        if (importedData.sessionStorage) {
          Object.entries(importedData.sessionStorage).forEach(([key, value]) => {
            try {
              sessionStorage.setItem(key, value as string);
              restoredCount++;
            } catch (e) {
              console.warn(`Failed to restore sessionStorage key: ${key}`);
            }
          });
        }

        // Specifically restore EMME project data
        if (importedData.emmeProjects?.currentProject) {
          sessionStorage.setItem('emme-project-context', JSON.stringify(importedData.emmeProjects.currentProject));
        }

        setMessage({ 
          type: 'success', 
          content: `Data successfully restored! ${restoredCount} items imported. Please refresh the page to see your restored projects.` 
        });

        // Refresh the page after a delay to load restored data
        setTimeout(() => {
          window.location.reload();
        }, 2000);

      } catch (error) {
        console.error('Data import error:', error);
        setMessage({ 
          type: 'error', 
          content: 'Failed to import data. Please check the file format and try again.' 
        });
      } finally {
        setIsProcessing(false);
      }
    };
    reader.readAsText(file);
  };

  const handleSaveToDatabase = async () => {
    try {
      setIsProcessing(true);
      const browserData = captureAllBrowserData();

      const response = await fetch('/api/emme/projects/import-backup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          browserData,
          projectData: browserData.emmeProjects
        }),
      });

      if (response.ok) {
        setMessage({ 
          type: 'success', 
          content: 'Your projects and data have been saved to the database! This will be available when you deploy to AWS or switch devices.' 
        });
      } else {
        throw new Error(`Database save failed: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Database save error:', error);
      setMessage({ 
        type: 'error', 
        content: 'Failed to save to database. The API endpoint may not be available.' 
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const getCurrentProjectInfo = () => {
    const emmeProject = sessionStorage.getItem('emme-project-context');
    if (emmeProject) {
      try {
        const project = JSON.parse(emmeProject);
        return {
          name: project.name || 'Unknown Project',
          client: project.client || 'Unknown Client',
          status: project.status || 'Unknown Status',
          lastUpdated: project.updatedAt || 'Unknown'
        };
      } catch (e) {
        return null;
      }
    }
    return null;
  };

  const currentProject = getCurrentProjectInfo();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Browser Data Migration & Backup
          </CardTitle>
          <CardDescription>
            Export and import your actual project data (VMS Global Campaign, user preferences, etc.) that's stored in your browser
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {message && (
            <Alert className={`${message.type === 'error' ? 'border-red-200 bg-red-50' : 
                               message.type === 'warning' ? 'border-yellow-200 bg-yellow-50' : 
                               'border-green-200 bg-green-50'}`}>
              <AlertDescription className={`${message.type === 'error' ? 'text-red-700' : 
                                           message.type === 'warning' ? 'text-yellow-700' : 
                                           'text-green-700'}`}>
                {message.content}
              </AlertDescription>
            </Alert>
          )}

          {currentProject && (
            <Alert className="border-blue-200 bg-blue-50">
              <CheckCircle className="h-4 w-4" />
              <AlertDescription className="text-blue-700">
                <strong>Current Project Detected:</strong> {currentProject.name} 
                {currentProject.client && ` (${currentProject.client})`}
                <br />
                <small>Status: {currentProject.status} • Last Updated: {new Date(currentProject.lastUpdated).toLocaleDateString()}</small>
              </AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              onClick={handleExportBrowserData}
              disabled={isProcessing}
              className="flex items-center gap-2 h-auto p-4"
              data-testid="button-export-browser-data"
            >
              <Download className="h-5 w-5" />
              <div className="text-left">
                <div className="font-medium">
                  {isProcessing ? 'Exporting Data...' : 'Export Browser Data'}
                </div>
                <div className="text-xs opacity-80">
                  Include VMS project & all stored data
                </div>
              </div>
            </Button>

            <div className="relative">
              <input
                type="file"
                accept=".json"
                onChange={handleImportBrowserData}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                disabled={isProcessing}
                data-testid="input-import-browser-data"
              />
              <Button
                variant="outline"
                disabled={isProcessing}
                className="w-full flex items-center gap-2 h-auto p-4 pointer-events-none"
              >
                <Upload className="h-5 w-5" />
                <div className="text-left">
                  <div className="font-medium">
                    {isProcessing ? 'Importing Data...' : 'Import Browser Data'}
                  </div>
                  <div className="text-xs opacity-80">
                    Restore projects to new environment
                  </div>
                </div>
              </Button>
            </div>

            <Button
              onClick={handleSaveToDatabase}
              disabled={isProcessing}
              variant="secondary"
              className="flex items-center gap-2 h-auto p-4"
              data-testid="button-save-to-database"
            >
              <Database className="h-5 w-5" />
              <div className="text-left">
                <div className="font-medium">
                  {isProcessing ? 'Saving to Database...' : 'Save to Database'}
                </div>
                <div className="text-xs opacity-80">
                  Persist for AWS deployment
                </div>
              </div>
            </Button>
          </div>

          <Card className="bg-yellow-50 border-yellow-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2 text-yellow-800">
                <AlertTriangle className="h-4 w-4" />
                AWS Deployment Warning
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-sm text-yellow-700 space-y-2">
                <p><strong>Critical:</strong> When you deploy to AWS, all browser-stored data will be lost!</p>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">Required</Badge>
                    <span>Export your browser data before deploying</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">Recommended</Badge>
                    <span>Save to database for automatic restoration</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">Backup</Badge>
                    <span>Keep the JSON file as a backup copy</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
}