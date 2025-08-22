import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Download, Upload, CheckCircle } from 'lucide-react';

export function SimpleDataBackup() {
  const [message, setMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const captureEverything = () => {
    const everything = {
      timestamp: new Date().toISOString(),
      localStorage: Object.fromEntries(
        Array.from({ length: localStorage.length }, (_, i) => {
          const key = localStorage.key(i);
          return key ? [key, localStorage.getItem(key)] : null;
        }).filter(Boolean)
      ),
      sessionStorage: Object.fromEntries(
        Array.from({ length: sessionStorage.length }, (_, i) => {
          const key = sessionStorage.key(i);
          return key ? [key, sessionStorage.getItem(key)] : null;
        }).filter(Boolean)
      ),
      // Specifically capture VMS project
      vmsProject: sessionStorage.getItem('emme-project-context'),
      // Capture any EMME data
      emmeData: Object.keys(localStorage).filter(k => k.includes('emme')).reduce((acc, key) => {
        acc[key] = localStorage.getItem(key);
        return acc;
      }, {}),
      // Browser info for restoration
      userAgent: navigator.userAgent,
      url: window.location.href
    };
    return everything;
  };

  const downloadBackup = () => {
    try {
      setIsLoading(true);
      const allData = captureEverything();
      
      const blob = new Blob([JSON.stringify(allData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `complete-backup-${new Date().toISOString().slice(0, 10)}.json`;
      link.click();
      URL.revokeObjectURL(url);
      
      setMessage('✅ Complete backup downloaded! Keep this file safe for AWS deployment.');
    } catch (error) {
      setMessage('❌ Backup failed');
    } finally {
      setIsLoading(false);
    }
  };

  const saveToCloud = async () => {
    try {
      setIsLoading(true);
      const allData = captureEverything();
      
      const response = await fetch('/api/backup-all-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: 'user123', // Replace with actual user ID
          browserData: allData
        })
      });

      if (response.ok) {
        setMessage('✅ Data saved to cloud! Available when you deploy to AWS.');
      } else {
        setMessage('❌ Cloud save failed');
      }
    } catch (error) {
      setMessage('❌ Cloud save failed');
    } finally {
      setIsLoading(false);
    }
  };

  const restoreData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        
        // Restore localStorage
        Object.entries(data.localStorage || {}).forEach(([key, value]) => {
          localStorage.setItem(key, value as string);
        });
        
        // Restore sessionStorage
        Object.entries(data.sessionStorage || {}).forEach(([key, value]) => {
          sessionStorage.setItem(key, value as string);
        });
        
        setMessage('✅ Data restored! Refreshing page...');
        setTimeout(() => window.location.reload(), 1000);
      } catch (error) {
        setMessage('❌ Restore failed - invalid file');
      }
    };
    reader.readAsText(file);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Complete Data Backup for AWS</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {message && (
          <Alert>
            <AlertDescription>{message}</AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button 
            onClick={downloadBackup} 
            disabled={isLoading}
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Download Everything
          </Button>

          <Button 
            onClick={saveToCloud} 
            disabled={isLoading}
            variant="outline"
            className="flex items-center gap-2"
          >
            <CheckCircle className="h-4 w-4" />
            Save to Cloud
          </Button>

          <div className="relative">
            <input
              type="file"
              accept=".json"
              onChange={restoreData}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <Button variant="secondary" className="w-full flex items-center gap-2">
              <Upload className="h-4 w-4" />
              Restore Data
            </Button>
          </div>
        </div>

        <Alert className="bg-yellow-50 border-yellow-200">
          <AlertDescription className="text-yellow-800">
            <strong>For AWS Deployment:</strong>
            <br />• Download backup before deploying
            <br />• Upload backup file in new environment
            <br />• Your VMS Global Campaign project will be restored
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
}