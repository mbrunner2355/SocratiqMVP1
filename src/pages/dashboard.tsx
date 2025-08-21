import { useQuery } from "@tanstack/react-query";
import { Brain, Settings, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import FileUpload from "@/components/FileUpload";
import DocumentList from "@/components/DocumentList";
import ProcessingQueue from "@/components/ProcessingQueue";
import Analytics from "@/components/Analytics";
import GraphVisualization from "@/components/GraphVisualization";
import { TraceManager } from "@/components/TraceManager";
import { SophieTrustManager } from "@/components/SophieTrustManager";
import { SophieModelsManager } from "@/components/SophieModelsManager";
import { EMMEManager } from "@/components/EMMEManager";
import Sidebar from "@/components/Sidebar";
import { SophieChat } from "@/components/SophieChat";
import { SophieAnalysis } from "@/components/SophieAnalysis";
import { BuildDashboard } from "@/components/BuildDashboard";
import { ProfileManager } from "@/components/ProfileManager";
import { CorpusManager } from "@/components/CorpusManager";
import { PipelineManager } from "@/components/PipelineManager";

interface AnalyticsData {
  entityStats: { [key: string]: number };
  processingStats: {
    totalDocuments: number;
    processingQueue: number;
    avgProcessingTime: number;
    avgAccuracy: number;
  };
}

export default function Dashboard() {
  const { data: analytics } = useQuery<AnalyticsData>({
    queryKey: ["/api/analytics"],
    refetchInterval: 5000, // Refresh every 5 seconds
  });

  return (
    <div className="min-h-screen bg-warm-gray" style={{ backgroundColor: 'var(--warm-gray)' }}>
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200" style={{ background: 'linear-gradient(135deg, white 0%, var(--teal-light) 100%)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, hsl(220, 87%, 36%) 0%, hsl(173, 81%, 29%) 100%)' }}>
                  <Brain className="text-white w-5 h-5" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-charcoal" style={{ color: 'var(--charcoal)' }}>SocratIQ Transform™</h1>
                  <p className="text-sm font-medium text-slate" style={{ color: 'var(--slate)' }}>AI-Enhanced Document Intelligence Platform</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm font-medium" style={{ color: 'var(--slate)' }}>
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: 'var(--success)' }}></div>
                <span>Transform™ Engine: Operational</span>
              </div>
              <Button className="btn-primary">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Sidebar analytics={analytics} />
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3 space-y-6">
            {/* Upload Section */}
            <div className="card-transform">
              <div className="pb-6 border-b" style={{ borderBottomColor: 'var(--teal-light)' }}>
                <h2 className="text-xl font-bold text-charcoal" style={{ color: 'var(--charcoal)' }}>Document Upload & Processing</h2>
                <p className="text-sm font-medium text-slate mt-2" style={{ color: 'var(--slate)' }}>Upload documents for AI-powered semantic analysis and entity extraction with Transform™</p>
              </div>
              <div className="pt-6">
                <FileUpload />
                <ProcessingQueue />
              </div>
            </div>

            {/* Processed Documents */}
            <DocumentList />

            {/* Analytics Dashboard */}
            <Analytics analytics={analytics} />

            {/* SocratIQ Mesh™ - Knowledge Graph */}
            <GraphVisualization />

            {/* SocratIQ Trace™ - Audit System */}
            <TraceManager />

            {/* SocratIQ Sophie™ - AI Agent Layer */}
            <div className="card-transform">
              <div className="pb-6 border-b" style={{ borderBottomColor: 'var(--teal-light)' }}>
                <h2 className="text-xl font-bold text-charcoal" style={{ color: 'var(--charcoal)' }}>Sophie™ Intelligent Assistant</h2>
                <p className="text-sm font-medium text-slate mt-2" style={{ color: 'var(--slate)' }}>AI-powered analysis, semantic search, and intelligent insights</p>
              </div>
              <div className="pt-6">
                <SophieChat />
              </div>
            </div>

            {/* SocratIQ Sophie™ - Advanced Analysis */}
            <div className="card-transform">
              <div className="pb-6 border-b" style={{ borderBottomColor: 'var(--teal-light)' }}>
                <h2 className="text-xl font-bold text-charcoal" style={{ color: 'var(--charcoal)' }}>Advanced AI Analysis</h2>
                <p className="text-sm font-medium text-slate mt-2" style={{ color: 'var(--slate)' }}>Document analysis, entity relationships, and risk assessment tools</p>
              </div>
              <div className="pt-6">
                <SophieAnalysis />
              </div>
            </div>

            {/* SocratIQ Build™ - Pipeline Construction */}
            <div className="card-transform" data-section="build">
              <div className="pb-6 border-b" style={{ borderBottomColor: 'var(--teal-light)' }}>
                <h2 className="text-xl font-bold text-charcoal" style={{ color: 'var(--charcoal)' }}>Build™ Pipeline Construction</h2>
                <p className="text-sm font-medium text-slate mt-2" style={{ color: 'var(--slate)' }}>Custom workflow creation, pipeline management, and template library</p>
              </div>
              <div className="pt-6">
                <BuildDashboard />
              </div>
            </div>

            {/* SocratIQ Profile™ - Comprehensive Profiling */}
            <div className="card-transform" data-section="profile">
              <div className="pb-6 border-b" style={{ borderBottomColor: 'var(--teal-light)' }}>
                <h2 className="text-xl font-bold text-charcoal" style={{ color: 'var(--charcoal)' }}>Profile™ Management System</h2>
                <p className="text-sm font-medium text-slate mt-2" style={{ color: 'var(--slate)' }}>User profiles, document profiling, entity management, and system monitoring</p>
              </div>
              <div className="pt-6">
                <ProfileManager />
              </div>
            </div>

            {/* SocratIQ Corpus Construction & Federation */}
            <div className="card-transform" data-section="corpus">
              <div className="pb-6 border-b" style={{ borderBottomColor: 'var(--teal-light)' }}>
                <h2 className="text-xl font-bold text-charcoal" style={{ color: 'var(--charcoal)' }}>Corpus Construction & Federation</h2>
                <p className="text-sm font-medium text-slate mt-2" style={{ color: 'var(--slate)' }}>Modular corpora, cross-module semantic linking, and context memory architecture</p>
              </div>
              <div className="pt-6">
                <CorpusManager />
              </div>
            </div>

            {/* Advanced AI/ML Processing Pipeline */}
            <div className="card-transform" data-section="pipeline">
              <div className="pb-6 border-b" style={{ borderBottomColor: 'var(--blue-light)' }}>
                <h2 className="text-xl font-bold text-charcoal" style={{ color: 'var(--charcoal)' }}>Advanced AI/ML Processing Pipeline</h2>
                <p className="text-sm font-medium text-slate mt-2" style={{ color: 'var(--slate)' }}>Transformer ensemble, LoRA adapters, federated learning, and human-in-the-loop processing</p>
              </div>
              <div className="pt-6">
                <PipelineManager />
              </div>
            </div>

            {/* SocratIQ SophieTrust™ - Governance and Safety Framework */}
            <div className="card-transform" data-section="sophietrust">
              <div className="pb-6 border-b" style={{ borderBottomColor: 'var(--purple-light)' }}>
                <h2 className="text-xl font-bold text-charcoal" style={{ color: 'var(--charcoal)' }}>SophieTrust™ - Governance & Safety Framework</h2>
                <p className="text-sm font-medium text-slate mt-2" style={{ color: 'var(--slate)' }}>Real-time compliance enforcement, probabilistic risk assessment, and intelligent guardrails</p>
              </div>
              <div className="pt-6">
                <SophieTrustManager />
              </div>
            </div>

            {/* SocratIQ SophieModels™ - AI Cognitive Toolkit */}
            <div className="card-transform" data-section="sophiemodels">
              <div className="pb-6 border-b" style={{ borderBottomColor: 'var(--blue-light)' }}>
                <h2 className="text-xl font-bold text-charcoal" style={{ color: 'var(--charcoal)' }}>SophieModels™ - AI Cognitive Toolkit</h2>
                <p className="text-sm font-medium text-slate mt-2" style={{ color: 'var(--slate)' }}>Multi-paradigm AI model portfolio with specialized agent families and cognitive architectures</p>
              </div>
              <div className="pt-6">
                <SophieModelsManager />
              </div>
            </div>

            {/* SocratIQ EMME Connect™ - Partnership Ecosystem */}
            <div className="card-transform" data-section="emme">
              <div className="pb-6 border-b" style={{ borderBottomColor: 'var(--teal-light)' }}>
                <h2 className="text-xl font-bold text-charcoal" style={{ color: 'var(--charcoal)' }}>EMME Connect™ - Partnership Ecosystem</h2>
                <p className="text-sm font-medium text-slate mt-2" style={{ color: 'var(--slate)' }}>Bi-directional licensing and co-development platform for strategic partnerships</p>
              </div>
              <div className="pt-6">
                <EMMEManager />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
