import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Download, Package, Database, Code, Archive, FileText, Server, Layers } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DataMigrationBackup } from './DataMigrationBackup';

export function GlobalProjectBackup() {
  const [isCreatingBackup, setIsCreatingBackup] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', content: string } | null>(null);

  const platformModules = [
    {
      category: "SocratIQ Core Platform",
      description: "Main platform components and infrastructure",
      files: [
        "SocratIQPlatform.tsx",
        "Layout.tsx", 
        "Sidebar.tsx",
        "PostLoginLanding.tsx",
        "PlatformDashboard.tsx",
        "AdminDashboard.tsx"
      ]
    },
    {
      category: "EMME™ Partnership Ecosystem", 
      description: "Pharmaceutical partnership and intelligence platform",
      files: [
        "EMMEEngageWhiteLabel.tsx",
        "EMMELayout.tsx",
        "EMMEHome.tsx", 
        "EMMEComprehensiveProjectCreator.tsx",
        "SimpleProjectManager.tsx",
        "EMMEConnectEnhanced.tsx",
        "EMMEManager.tsx",
        "EMMEProjectManager.tsx"
      ]
    },
    {
      category: "Sophie™ AI Intelligence",
      description: "AI-powered analysis and decision support system",
      files: [
        "SophieDashboard.tsx",
        "SophieChat.tsx",
        "SophieAnalysis.tsx",
        "SophieIntelligenceBrief.tsx",
        "SophieIntelligenceDashboard.tsx",
        "SophieOrchestrator.tsx",
        "SophieModelsManager.tsx",
        "SophieTrustManager.tsx"
      ]
    },
    {
      category: "FedScout™ Technology Intelligence",
      description: "Federal technology licensing and IP intelligence",
      files: [
        "FedScoutDashboard.tsx",
        "FedScoutManager.tsx"
      ]
    },
    {
      category: "Advanced Analytics & NLP",
      description: "Machine learning and natural language processing",
      files: [
        "AdvancedNLPDashboard.tsx",
        "MultiParadigmReasoningDashboard.tsx",
        "BayesianMonteCarloManager.tsx",
        "GraphNeuralNetworkManager.tsx",
        "TransformersManager.tsx"
      ]
    },
    {
      category: "Data Platform & Infrastructure",
      description: "Data ingestion, processing, and management",
      files: [
        "VectorDatabaseManager.tsx",
        "GraphVisualization.tsx",
        "GraphVisualizationManager.tsx",
        "CorpusManager.tsx",
        "PipelineManager.tsx",
        "ProcessingQueue.tsx"
      ]
    },
    {
      category: "Security & Governance",
      description: "Authentication, audit trails, and compliance",
      files: [
        "TraceAudit.tsx",
        "TraceManager.tsx", 
        "CognitoLogin.tsx",
        "ProductionLogin.tsx",
        "TenantProvider.tsx"
      ]
    },
    {
      category: "Partner Solutions",
      description: "White-label and partner management",
      files: [
        "PartnerAppsManager.tsx",
        "PartnerBrandingDemo.tsx"
      ]
    }
  ];

  const serverModules = [
    {
      category: "API Routes & Services",
      files: [
        "routes.ts - Main API routing",
        "routes-emme-projects.ts - EMME project management",
        "routes-sophie.ts - Sophie AI services", 
        "routes-fedscout.ts - FedScout intelligence",
        "routes-advanced-nlp.ts - NLP processing",
        "routes-multi-paradigm-reasoning.ts - Advanced reasoning",
        "routes-bayesian-monte-carlo.ts - Statistical modeling",
        "routes-backup.ts - Backup services"
      ]
    },
    {
      category: "Core Services",
      files: [
        "advancedNLP.ts - Natural language processing",
        "multiParadigmReasoning.ts - AI reasoning engine",
        "emmeDataProvider.ts - Pharmaceutical data",
        "pharmaceuticalCorpus.ts - Medical corpus management",
        "sophie-agent.ts - Sophie AI agent"
      ]
    },
    {
      category: "Database & Storage",
      files: [
        "db.ts - Database connection",
        "storage.ts - Data storage interface",
        "storage-graph.ts - Graph database operations"
      ]
    },
    {
      category: "Authentication & Security",
      files: [
        "authManager.ts - Authentication management",
        "cognitoAuth.ts - AWS Cognito integration", 
        "productionAuth.ts - Production authentication",
        "rbac.ts - Role-based access control"
      ]
    }
  ];

  const handleCreateCompleteBackup = async () => {
    try {
      setIsCreatingBackup(true);
      setMessage(null);

      const response = await fetch('/api/backup/create-zip', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          includeAssets: true,
          includeDocumentation: true,
          fullPlatformBackup: true
        }),
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `socratiq-complete-platform-backup-${new Date().toISOString().slice(0, 10)}.zip`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);

        setMessage({ 
          type: 'success', 
          content: 'Complete SocratIQ platform backup created successfully! This includes all modules, components, server code, database schema, and configurations.' 
        });
      } else {
        throw new Error(`Backup failed: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Backup creation error:', error);
      setMessage({ 
        type: 'error', 
        content: 'Failed to create complete platform backup. Please try again.' 
      });
    } finally {
      setIsCreatingBackup(false);
    }
  };

  const handleExportPlatformStructure = () => {
    const platformStructure = {
      metadata: {
        projectName: "SocratIQ™ - Complete AI Intelligence Platform",
        backupDate: new Date().toISOString(),
        description: "Complete platform backup including all modules and components",
        version: "2.0"
      },
      platformModules,
      serverModules,
      architecture: {
        frontend: "React + TypeScript + TailwindCSS + shadcn/ui",
        backend: "Node.js + Express + Drizzle ORM",
        database: "PostgreSQL + Neon", 
        authentication: "AWS Cognito + Multi-tenant RBAC",
        ai: "OpenAI GPT + Custom NLP + Transformers",
        deployment: "Replit + AWS Integration"
      },
      features: [
        "Multi-tenant white-label platform",
        "AI-powered pharmaceutical intelligence (EMME™)",
        "Sophie™ AI assistant and analysis engine", 
        "FedScout™ federal technology intelligence",
        "Advanced NLP and multi-paradigm reasoning",
        "Graph neural networks and vector databases",
        "Bayesian Monte Carlo statistical modeling",
        "Corpus management and pipeline processing",
        "Blockchain audit trails (Trace™)",
        "Partner ecosystem management",
        "Role-based access control (RBAC)",
        "Real-time chat and collaboration"
      ],
      totalComponents: platformModules.reduce((sum, module) => sum + module.files.length, 0)
    };

    const dataStr = JSON.stringify(platformStructure, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `socratiq-platform-structure-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setMessage({ 
      type: 'success', 
      content: 'Complete platform structure exported! This JSON contains the full architecture and component mapping.' 
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Layers className="h-5 w-5" />
            Complete SocratIQ Platform Backup
          </CardTitle>
          <CardDescription>
            Backup your entire SocratIQ platform including all modules, components, and configurations
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
              size="lg"
              data-testid="button-complete-platform-backup"
            >
              <Archive className="h-5 w-5" />
              <div className="text-left">
                <div className="font-medium">
                  {isCreatingBackup ? 'Creating Complete Platform Backup...' : 'Create Complete Platform Backup'}
                </div>
                <div className="text-xs opacity-80">
                  All modules, components, server code & database schema
                </div>
              </div>
            </Button>

            <Button
              onClick={handleExportPlatformStructure}
              variant="outline"
              className="flex items-center gap-2 h-auto p-4"
              size="lg"
              data-testid="button-export-platform-structure"
            >
              <FileText className="h-5 w-5" />
              <div className="text-left">
                <div className="font-medium">Export Platform Architecture</div>
                <div className="text-xs opacity-80">
                  Complete component mapping & system overview
                </div>
              </div>
            </Button>
          </div>

          <Tabs defaultValue="data" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="data">Project Data</TabsTrigger>
              <TabsTrigger value="frontend">Frontend Modules</TabsTrigger>
              <TabsTrigger value="backend">Backend Services</TabsTrigger>
              <TabsTrigger value="overview">Platform Overview</TabsTrigger>
            </TabsList>

            <TabsContent value="data" className="space-y-4">
              <DataMigrationBackup />
            </TabsContent>

            <TabsContent value="frontend" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {platformModules.map((module, index) => (
                  <Card key={index} className="border-l-4 border-l-blue-500">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm flex items-center gap-2">
                        <Code className="h-4 w-4" />
                        {module.category}
                      </CardTitle>
                      <CardDescription className="text-xs">
                        {module.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="space-y-1">
                        {module.files.slice(0, 4).map((file, fileIndex) => (
                          <div key={fileIndex} className="text-xs text-gray-600 flex items-center gap-1">
                            <div className="w-1 h-1 bg-blue-400 rounded-full"></div>
                            {file}
                          </div>
                        ))}
                        {module.files.length > 4 && (
                          <div className="text-xs text-gray-500 italic">
                            +{module.files.length - 4} more components
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="backend" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {serverModules.map((module, index) => (
                  <Card key={index} className="border-l-4 border-l-green-500">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm flex items-center gap-2">
                        <Server className="h-4 w-4" />
                        {module.category}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="space-y-1">
                        {module.files.map((file, fileIndex) => (
                          <div key={fileIndex} className="text-xs text-gray-600 flex items-center gap-1">
                            <div className="w-1 h-1 bg-green-400 rounded-full"></div>
                            {file}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="overview" className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="text-center">
                  <CardContent className="pt-6">
                    <div className="text-2xl font-bold text-blue-600">8</div>
                    <div className="text-sm text-gray-600">Platform Modules</div>
                  </CardContent>
                </Card>
                <Card className="text-center">
                  <CardContent className="pt-6">
                    <div className="text-2xl font-bold text-green-600">50+</div>
                    <div className="text-sm text-gray-600">Components</div>
                  </CardContent>
                </Card>
                <Card className="text-center">
                  <CardContent className="pt-6">
                    <div className="text-2xl font-bold text-purple-600">25+</div>
                    <div className="text-sm text-gray-600">API Routes</div>
                  </CardContent>
                </Card>
                <Card className="text-center">
                  <CardContent className="pt-6">
                    <div className="text-2xl font-bold text-orange-600">15+</div>
                    <div className="text-sm text-gray-600">Core Services</div>
                  </CardContent>
                </Card>
              </div>

              <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
                <CardHeader>
                  <CardTitle className="text-lg">Complete Platform Backup Includes:</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">Frontend</Badge>
                        <span className="text-sm">All React components & pages</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">Backend</Badge>
                        <span className="text-sm">Complete API & server infrastructure</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">Database</Badge>
                        <span className="text-sm">Schema, migrations & seed data</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">AI/ML</Badge>
                        <span className="text-sm">Sophie™, NLP models & reasoning</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">Config</Badge>
                        <span className="text-sm">TypeScript, Vite, Tailwind configs</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">Auth</Badge>
                        <span className="text-sm">Cognito, RBAC & security middleware</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">Assets</Badge>
                        <span className="text-sm">Images, documents & static files</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">Deploy</Badge>
                        <span className="text-sm">Deployment scripts & configurations</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}