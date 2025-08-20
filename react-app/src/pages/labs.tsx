import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, FlaskConical, Activity } from "lucide-react";

export default function Labs() {
  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div className="border-b border-gray-200 pb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-lg bg-gray-400 flex items-center justify-center">
            <Building2 className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Labs</h1>
            <p className="text-gray-600">Translational Lab Operations & Diagnostics</p>
            <Badge variant="secondary" className="mt-2">Coming Soon</Badge>
          </div>
        </div>
      </div>

      {/* Coming Soon Content */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FlaskConical className="w-5 h-5" />
            <span>Unified Translational Lab Intelligence</span>
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Streamline lab operations and diagnostic workflows for accelerated drug development
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Activity className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Labs Module In Development
              </h3>
              <p className="text-gray-600 max-w-md mx-auto mb-4">
                We're building comprehensive lab operations intelligence to unify translational 
                research, diagnostics, and quality control workflows.
              </p>
              <Badge variant="outline" className="px-4 py-2">
                Expected Q2 2025
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 border rounded-lg text-center">
                <FlaskConical className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                <h4 className="font-medium mb-1">Lab Operations</h4>
                <p className="text-sm text-gray-600">
                  Workflow optimization and resource management
                </p>
              </div>
              
              <div className="p-4 border rounded-lg text-center">
                <Activity className="w-8 h-8 text-green-500 mx-auto mb-2" />
                <h4 className="font-medium mb-1">Diagnostics Integration</h4>
                <p className="text-sm text-gray-600">
                  Seamless diagnostic data flow and analysis
                </p>
              </div>
              
              <div className="p-4 border rounded-lg text-center">
                <Building2 className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                <h4 className="font-medium mb-1">Quality Control</h4>
                <p className="text-sm text-gray-600">
                  Automated QC monitoring and compliance
                </p>
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">Get Early Access</h4>
              <p className="text-sm text-blue-700">
                Interested in beta testing the Labs module? Contact your account team 
                to join our early access program and help shape the development of this 
                critical life sciences intelligence capability.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}