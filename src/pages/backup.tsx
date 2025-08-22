import { GlobalProjectBackup } from '@/components/GlobalProjectBackup';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'wouter';

export default function BackupPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Link href="/dashboard">
            <Button 
              variant="outline" 
              className="mb-4"
              data-testid="button-back"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">
            Complete Platform Backup
          </h1>
          <p className="text-gray-600 mt-2">
            Backup your entire SocratIQ platform including all modules, projects, and configurations
          </p>
        </div>
        
        <GlobalProjectBackup />
      </div>
    </div>
  );
}