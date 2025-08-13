import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { 
  Brain, 
  FileText, 
  Network, 
  ArrowRight,
  Bot,
  Shield,
  TrendingUp,
  Users,
  Target,
  Building,
  Briefcase,
  Search,
  User
} from "lucide-react";
import { detectPartnerContext, getPartnerBrand } from "@shared/partner-branding";

export default function Login() {
  const handleLogin = () => {
    window.location.href = "/api/login";
  };

  // Detect partner context for dynamic branding
  const partnerId = detectPartnerContext();
  const isEMMEEngage = partnerId === 'emme-engage';
  const isDefaultSocratIQ = !partnerId || partnerId === 'socratiq';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Login Card */}
        <Card className="bg-white/95 backdrop-blur border-0 shadow-2xl">
          <CardHeader className="space-y-4 pb-6">
            <div className="flex flex-col items-center space-y-3">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                <Brain className="h-8 w-8 text-primary" />
              </div>
              <div className="text-center">
                <h1 className="text-2xl font-bold text-slate-900">
                  {isEMMEEngage ? 'EMME Engage™' : 'SocratIQ Transform™'}
                </h1>
                <p className="text-sm text-slate-600 mt-1">
                  {isEMMEEngage ? 'Pharmaceutical Strategic Intelligence' : 'AI-Powered Document Intelligence'}
                </p>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-6 pb-8">
            <div className="text-center space-y-2">
              <h2 className="text-xl font-semibold text-slate-800">Welcome Back</h2>
              <p className="text-sm text-slate-600">
                {isEMMEEngage 
                  ? 'Sign in to access your pharmaceutical intelligence platform'
                  : 'Sign in to access your intelligent document platform'
                }
              </p>
            </div>

            {/* Platform Highlights */}
            <div className="space-y-3">
              {isEMMEEngage ? (
                // EMME Engage modules
                <>
                  <div className="flex items-center space-x-3 p-2">
                    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                      <TrendingUp className="h-4 w-4 text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-slate-800">Strategic Intelligence</p>
                      <p className="text-xs text-slate-600">Market & Competitive Insights</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3 p-2">
                    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Users className="h-4 w-4 text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-slate-800">Stakeholder Engagement</p>
                      <p className="text-xs text-slate-600">HCP, Patient & Payer Relations</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3 p-2">
                    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Target className="h-4 w-4 text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-slate-800">Campaign Optimization</p>
                      <p className="text-xs text-slate-600">AI-Powered Performance Analytics</p>
                    </div>
                  </div>
                </>
              ) : (
                // SocratIQ Transform modules
                <>
                  <div className="flex items-center space-x-3 p-2">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Building className="h-4 w-4 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-slate-800">Build™</p>
                      <p className="text-xs text-slate-600">AEC Intelligence & Analytics</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3 p-2">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Briefcase className="h-4 w-4 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-slate-800">EmmeConnect</p>
                      <p className="text-xs text-slate-600">Pharmaceutical MLR Workflow</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3 p-2">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Search className="h-4 w-4 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-slate-800">IP Suite</p>
                      <p className="text-xs text-slate-600">Technology Transfer & Patents</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3 p-2">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <User className="h-4 w-4 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-slate-800">Profile™</p>
                      <p className="text-xs text-slate-600">User & System Analytics</p>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Login Button */}
            <Button 
              onClick={handleLogin} 
              className="w-full h-12 bg-primary hover:bg-primary/90 text-white font-medium text-base"
              size="lg"
            >
              <div className="flex items-center justify-center space-x-2">
                <span>Continue with Replit</span>
                <ArrowRight className="h-4 w-4" />
              </div>
            </Button>

            {/* Security Badge */}
            <div className="flex items-center justify-center space-x-2 pt-4">
              <Shield className="h-4 w-4 text-slate-500" />
              <span className="text-xs text-slate-500">Enterprise-grade security & compliance</span>
            </div>
          </CardContent>
        </Card>

        {/* Bottom Text */}
        <p className="text-center text-xs text-slate-400 mt-6">
          © 2025 {isEMMEEngage ? 'EMME Engage™ - Pharmaceutical Strategic Intelligence Platform' : 'SocratIQ Transform™ - Advanced BioPharma Intelligence Platform'}
        </p>
      </div>
    </div>
  );
}