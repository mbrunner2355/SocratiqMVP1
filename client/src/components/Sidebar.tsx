import { Search, Download, BarChart3, Settings, FileText, Brain, Users, Zap, User } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AnalyticsData {
  entityStats: { [key: string]: number };
  processingStats: {
    totalDocuments: number;
    processingQueue: number;
    avgProcessingTime: number;
    avgAccuracy: number;
  };
}

interface SidebarProps {
  analytics?: AnalyticsData;
}

export default function Sidebar({ analytics }: SidebarProps) {
  const totalEntities = analytics?.entityStats 
    ? Object.values(analytics.entityStats).reduce((sum, count) => sum + count, 0)
    : 0;

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
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  return (
    <div className="card-socratiq">
      <h2 className="text-xl font-bold text-charcoal mb-6" style={{ color: 'var(--charcoal)' }}>Transform™ Overview</h2>
      
      {/* Processing Stats */}
      <div className="space-y-4 mb-6">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-slate" style={{ color: 'var(--slate)' }}>Documents Processed</span>
          <span className="text-lg font-bold text-teal-primary" style={{ color: 'var(--teal-primary)' }}>
            {analytics?.processingStats.totalDocuments || 0}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-slate" style={{ color: 'var(--slate)' }}>Entities Extracted</span>
          <span className="text-lg font-bold text-teal-primary" style={{ color: 'var(--teal-primary)' }}>
            {totalEntities.toLocaleString()}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-slate" style={{ color: 'var(--slate)' }}>Processing Queue</span>
          <span className="text-lg font-bold text-teal-secondary" style={{ color: 'var(--teal-secondary)' }}>
            {analytics?.processingStats.processingQueue || 0}
          </span>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="space-y-2">
        <h3 className="text-lg font-bold text-charcoal mb-4" style={{ color: 'var(--charcoal)' }}>Quick Actions</h3>
        
        <Button 
          variant="ghost" 
          className="w-full justify-start font-medium" 
          style={{ color: 'var(--slate)' }}
          onClick={() => {
            // Scroll to documents section
            const documentsSection = document.querySelector('[data-section="documents"]');
            documentsSection?.scrollIntoView({ behavior: 'smooth' });
          }}
        >
          <Search className="w-4 h-4 mr-2" />
          Search Documents
        </Button>
        
        <Button 
          variant="ghost" 
          className="w-full justify-start font-medium" 
          style={{ color: 'var(--slate)' }}
          onClick={() => handleExport('json')}
        >
          <Download className="w-4 h-4 mr-2" />
          Export Data
        </Button>
        
        <Button 
          variant="ghost" 
          className="w-full justify-start font-medium" 
          style={{ color: 'var(--slate)' }}
          onClick={() => {
            // Scroll to analytics section
            const analyticsSection = document.querySelector('[data-section="analytics"]');
            analyticsSection?.scrollIntoView({ behavior: 'smooth' });
          }}
        >
          <BarChart3 className="w-4 h-4 mr-2" />
          Analytics
        </Button>
        
        <Button 
          variant="ghost" 
          className="w-full justify-start font-medium" 
          style={{ color: 'var(--slate)' }}
          onClick={() => {
            // Scroll to build section
            const buildSection = document.querySelector('[data-section="build"]');
            buildSection?.scrollIntoView({ behavior: 'smooth' });
          }}
        >
          <Zap className="w-4 h-4 mr-2" />
          Build™ Module
        </Button>
        
        <Button 
          variant="ghost" 
          className="w-full justify-start font-medium" 
          style={{ color: 'var(--slate)' }}
          onClick={() => {
            // Scroll to profile section
            const profileSection = document.querySelector('[data-section="profile"]');
            profileSection?.scrollIntoView({ behavior: 'smooth' });
          }}
        >
          <User className="w-4 h-4 mr-2" />
          Profile™ Module
        </Button>
        
        <Button 
          variant="ghost" 
          className="w-full justify-start font-medium" 
          style={{ color: 'var(--slate)' }}
          disabled
        >
          <Settings className="w-4 h-4 mr-2" />
          Configure NLP
        </Button>
      </div>

      {/* System Info */}
      <div className="mt-6 pt-6 border-t" style={{ borderTopColor: 'var(--teal-light)' }}>
        <h3 className="text-lg font-bold text-charcoal mb-4" style={{ color: 'var(--charcoal)' }}>System Info</h3>
        <div className="space-y-3 text-sm font-medium" style={{ color: 'var(--slate)' }}>
          <div className="flex items-center space-x-3">
            <Brain className="w-4 h-4" style={{ color: 'var(--teal-primary)' }} />
            <span>NLP Engine: Active</span>
          </div>
          <div className="flex items-center space-x-3">
            <FileText className="w-4 h-4" style={{ color: 'var(--teal-primary)' }} />
            <span>Supported: PDF, DOCX, TXT</span>
          </div>
          <div className="flex items-center space-x-3">
            <Users className="w-4 h-4" style={{ color: 'var(--teal-primary)' }} />
            <span>Version: Transform™ v1.0</span>
          </div>
        </div>
      </div>
    </div>
  );
}
