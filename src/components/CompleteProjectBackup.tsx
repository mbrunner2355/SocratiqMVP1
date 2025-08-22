import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Download, Package, FileText, Database, Code, Archive } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export function CompleteProjectBackup() {
  const [isCreatingBackup, setIsCreatingBackup] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', content: string } | null>(null);

  const projectComponents = [
    {
      category: "EMME Core Components",
      files: [
        "EMMEEngageWhiteLabel.tsx",
        "EMMELayout.tsx", 
        "EMMEHome.tsx",
        "EMMEComprehensiveProjectCreator.tsx",
        "SimpleProjectManager.tsx"
      ]
    },
    {
      category: "Strategic Intelligence",
      files: [
        "StrategicIntelligenceModule.tsx",
        "StrategicIntelligenceOverview.tsx",
        "MarketIntelligence.tsx",
        "CompetitiveIntelligence.tsx",
        "PayerLandscape.tsx"
      ]
    },
    {
      category: "Stakeholder Engagement", 
      files: [
        "StakeholderEngagementModule.tsx",
        "HCPEngagement.tsx",
        "PatientPrograms.tsx",
        "ClientManager.tsx"
      ]
    },
    {
      category: "Content Orchestration",
      files: [
        "ContentOrchestrationModule.tsx",
        "ContentOptimization.tsx",
        "MLRVisualization.tsx",
        "MLRSubmissions.tsx"
      ]
    },
    {
      category: "Data Platform",
      files: [
        "DataPlatformModule.tsx",
        "DataIngestionHub.tsx",
        "EMMEDataSourcesDashboard.tsx",
        "CorpusPipelineModule.tsx"
      ]
    },
    {
      category: "Server & API",
      files: [
        "routes-emme-projects.ts",
        "routes-emme.ts",
        "routes-backup.ts",
        "emmeDataProvider.ts"
      ]
    },
    {
      category: "Database Schema",
      files: [
        "schema.ts (emmeProjects, partnerships, etc.)"
      ]
    }
  ];

  const handleCreateCompleteBackup = async () => {
    try {
      setIsCreatingBackup(true);
      setMessage(null);

      // Create comprehensive backup via API
      const response = await fetch('/api/backup/create-zip', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          includeAssets: true,
          includeDocumentation: true
        }),
      });

      if (response.ok) {
        // Download the zip file
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `emme-engage-complete-backup-${new Date().toISOString().slice(0, 10)}.zip`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);

        setMessage({ 
          type: 'success', 
          content: 'Complete project backup created and downloaded successfully! This includes all your components, modules, server code, and database schema.' 
        });
      } else {
        throw new Error(`Backup failed: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Backup creation error:', error);
      setMessage({ 
        type: 'error', 
        content: 'Failed to create complete backup. Please try again.' 
      });
    } finally {
      setIsCreatingBackup(false);
    }
  };

  const handleExportProjectStructure = () => {
    const projectStructure = {
      metadata: {
        projectName: "EMME Engage - Pharmaceutical Partnership Platform",
        backupDate: new Date().toISOString(),
        description: "Complete component and code structure backup"
      },
      components: projectComponents,
      architecture: {
        frontend: "React + TypeScript + TailwindCSS",
        backend: "Node.js + Express + Drizzle ORM", 
        database: "PostgreSQL",
        authentication: "AWS Cognito",
        deployment: "Replit"
      },
      features: [
        "Multi-tenant white-label platform",
        "Strategic intelligence dashboard",
        "Stakeholder engagement tracking",
        "Content orchestration & MLR workflow",
        "Data platform & corpus management",
        "Project management system",
        "Real-time chat with EMME AI assistant"
      ]
    };

    const dataStr = JSON.stringify(projectStructure, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `emme-project-structure-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setMessage({ 
      type: 'success', 
      content: 'Project structure exported! This JSON file contains a complete mapping of all your components and architecture.' 
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Complete Project Backup
          </CardTitle>
          <CardDescription>
            Backup your entire EMME Engage platform including all components, modules, server code, and database schema
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {message && (
            <Alert className={message.type === 'error' ? 'border-red-200 bg-red-50' : 'border-green-200 bg-green-50'}>
              <AlertDescription className={message.type === 'error' ? 'text-red-700' : 'text-green-700'}>
                {message.content}
              </AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button
              onClick={handleCreateCompleteBackup}
              disabled={isCreatingBackup}
              className="flex items-center gap-2 h-auto p-4"
              data-testid="button-complete-backup"
            >
              <Archive className="h-5 w-5" />
              <div className="text-left">
                <div className="font-medium">
                  {isCreatingBackup ? 'Creating Complete Backup...' : 'Create Complete ZIP Backup'}
                </div>
                <div className="text-xs opacity-80">
                  All components, server code, schema & assets
                </div>
              </div>
            </Button>

            <Button
              onClick={handleExportProjectStructure}
              variant="outline"
              className="flex items-center gap-2 h-auto p-4"
              data-testid="button-export-structure"
            >
              <FileText className="h-5 w-5" />
              <div className="text-left">
                <div className="font-medium">Export Project Structure</div>
                <div className="text-xs opacity-80">
                  Component mapping & architecture overview
                </div>
              </div>
            </Button>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Your Project Components</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {projectComponents.map((category, index) => (
                <Card key={index} className="border-l-4 border-l-purple-500">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">{category.category}</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-1">
                      {category.files.slice(0, 3).map((file, fileIndex) => (
                        <div key={fileIndex} className="flex items-center gap-2 text-xs text-gray-600">
                          <Code className="h-3 w-3" />
                          {file}
                        </div>
                      ))}
                      {category.files.length > 3 && (
                        <div className="text-xs text-gray-500">
                          +{category.files.length - 3} more files
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 mb-2">What's Included in Complete Backup:</h4>
            <div className="grid grid-cols-2 gap-2 text-sm text-blue-800">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">Frontend</Badge>
                All React components & pages
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">Backend</Badge>
                API routes & server logic
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">Database</Badge>
                Complete schema & migrations
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">Config</Badge>
                TypeScript, Vite, Tailwind configs
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}