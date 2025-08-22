import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
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
  User,
  Eye,
  EyeOff,
  Loader2
} from "lucide-react";
import { detectPartnerContext } from "@shared/partner-branding";
import { NavigationService } from "../lib/navigation";

// Import your Cognito service
import { CognitoAuthService } from "../lib/aws-config"; // Adjust path as needed

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Initialize Cognito auth service
  const cognitoAuth = new CognitoAuthService();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // Use your Cognito authentication
      const result = await cognitoAuth.signIn(email, password);
      
      // Store authentication tokens
      localStorage.setItem('cognito_access_token', result.accessToken);
      localStorage.setItem('cognito_id_token', result.idToken);
      localStorage.setItem('cognito_refresh_token', result.refreshToken);
      localStorage.setItem('isAuthenticated', 'true');
      
      // Store user info
      localStorage.setItem('user', JSON.stringify(result.user));
      
      // Redirect based on partner context
      const partnerId = detectPartnerContext();
      if (partnerId === 'emme-engage') {
        NavigationService.goTo('/emme-engage/app');
      } else if (partnerId === 'emme-health') {
        NavigationService.goTo('/dashboard');
      } else {
        NavigationService.goTo('/dashboard');
      }
      
    } catch (error: any) {
      console.error('Login error:', error);
      setError(error.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = () => {
    // For demo purposes - remove in production
    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('user', JSON.stringify({
      email: 'demo@socratiq.ai',
      firstName: 'Demo',
      lastName: 'User'
    }));
    
    const partnerId = detectPartnerContext();
    if (partnerId === 'emme-engage') {
      NavigationService.goTo('/emme-engage/app');
    } else {
      NavigationService.goTo('/dashboard');
    }
  };

  // Detect partner context for dynamic branding
  const partnerId = detectPartnerContext();
  const isEMMEEngage = partnerId === 'emme-engage';

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

            {/* Error Alert */}
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Login Form */}
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-slate-700">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  disabled={isLoading}
                  className="h-12"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-slate-700">
                  Password
                </label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                    disabled={isLoading}
                    className="h-12 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700"
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Login Button */}
              <Button 
                type="submit"
                disabled={isLoading || !email || !password}
                className="w-full h-12 bg-primary hover:bg-primary/90 text-white font-medium text-base"
                size="lg"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Signing in...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center space-x-2">
                    <span>Sign In</span>
                    <ArrowRight className="h-4 w-4" />
                  </div>
                )}
              </Button>
            </form>

            {/* Demo Login Button - Remove in production */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-slate-300" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-slate-500">Or</span>
              </div>
            </div>

            <Button 
              onClick={handleDemoLogin}
              variant="outline"
              className="w-full h-12 font-medium text-base"
              size="lg"
            >
              Demo Login (Development)
            </Button>

            {/* Forgot Password Link */}
            <div className="text-center">
              <button 
                type="button"
                className="text-sm text-primary hover:text-primary/80 underline"
                onClick={() => {
                  // Implement forgot password functionality
                  alert('Forgot password functionality to be implemented');
                }}
              >
                Forgot your password?
              </button>
            </div>

            {/* Platform Highlights */}
            <div className="space-y-3 pt-4 border-t border-slate-200">
              <p className="text-xs font-medium text-slate-600 text-center uppercase tracking-wide">
                Platform Features
              </p>
              
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
                </>
              )}
            </div>

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