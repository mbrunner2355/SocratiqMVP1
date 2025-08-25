import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Heart, 
  Shield, 
  Activity,
  ArrowRight,
  Stethoscope,
  Users,
  TrendingUp,
  Brain,
  Zap,
  Globe,
  Star
} from "lucide-react";

export default function EMMEHealthLanding() {
  const handleLogin = () => {
    // Set partner app indicator for post-login routing
    localStorage.setItem('partner-app', 'emme-health');
    NavigationService.handleLogin();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-60">
        {/* Floating health nodes */}
        <div className="absolute top-20 left-20 w-3 h-3 bg-blue-500/60 rounded-full animate-pulse"></div>
        <div className="absolute top-32 right-32 w-2 h-2 bg-cyan-400/70 rounded-full animate-bounce" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-40 left-40 w-2.5 h-2.5 bg-indigo-400/60 rounded-full animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/2 right-20 w-2 h-2 bg-blue-500/50 rounded-full animate-bounce" style={{animationDelay: '0.5s'}}></div>
        <div className="absolute bottom-32 right-1/4 w-3 h-3 bg-cyan-300/60 rounded-full animate-pulse" style={{animationDelay: '1.5s'}}></div>
        
        {/* Connection lines */}
        <svg className="absolute inset-0 w-full h-full" style={{zIndex: -1}}>
          <defs>
            <pattern id="grid-health" width="100" height="100" patternUnits="userSpaceOnUse">
              <path d="M 100 0 L 0 0 0 100" fill="none" stroke="rgb(59 130 246 / 0.3)" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid-health)" />
          
          <line x1="20%" y1="30%" x2="80%" y2="70%" stroke="rgb(59 130 246 / 0.3)" strokeWidth="2" strokeDasharray="5,5">
            <animate attributeName="stroke-dashoffset" values="0;10" dur="20s" repeatCount="indefinite"/>
          </line>
          <line x1="70%" y1="20%" x2="30%" y2="80%" stroke="rgb(6 182 212 / 0.3)" strokeWidth="2" strokeDasharray="3,7">
            <animate attributeName="stroke-dashoffset" values="0;10" dur="25s" repeatCount="indefinite"/>
          </line>
        </svg>
      </div>

      {/* Header */}
      <div className="border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/95">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center space-x-2">
            <Heart className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold text-blue-700">EMME Health</span>
          </div>
          <Button onClick={handleLogin} className="bg-blue-600 hover:bg-blue-700">
            Provider Login
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Hero Section */}
      <div className="container py-16 text-center">
        <Badge variant="secondary" className="mb-4 bg-blue-100 text-blue-800">
          Healthcare Intelligence Platform
        </Badge>
        <h1 className="text-4xl font-bold tracking-tight sm:text-6xl mb-6">
          Transform Healthcare
          <span className="text-blue-600 block">Delivery & Outcomes</span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
          Empower healthcare organizations with intelligent analytics, predictive insights, and 
          evidence-based decision support that improve patient outcomes while reducing costs and operational complexity.
        </p>
        <Button size="lg" onClick={handleLogin} className="text-lg px-8 py-4 bg-blue-600 hover:bg-blue-700">
          Access Platform
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </div>

      {/* Core Features */}
      <div className="container py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Healthcare Intelligence Features</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card className="border-l-4 border-l-blue-500">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Stethoscope className="h-6 w-6 text-blue-600" />
                <CardTitle className="text-lg">Clinical Decision Support</CardTitle>
              </div>
              <CardDescription>AI-Powered Care Guidance</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Evidence-based clinical recommendations and predictive analytics for improved patient care.
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-cyan-500">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Activity className="h-6 w-6 text-cyan-600" />
                <CardTitle className="text-lg">Population Health</CardTitle>
              </div>
              <CardDescription>Community Health Analytics</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Comprehensive population health monitoring with risk stratification and intervention planning.
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-indigo-500">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-6 w-6 text-indigo-600" />
                <CardTitle className="text-lg">Outcomes Analytics</CardTitle>
              </div>
              <CardDescription>Performance Optimization</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Real-time outcomes tracking with predictive modeling for quality improvement initiatives.
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-500">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Shield className="h-6 w-6 text-purple-600" />
                <CardTitle className="text-lg">Risk Management</CardTitle>
              </div>
              <CardDescription>Proactive Care Safety</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Advanced risk prediction and early warning systems for patient safety and quality assurance.
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-teal-500">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Users className="h-6 w-6 text-teal-600" />
                <CardTitle className="text-lg">Care Coordination</CardTitle>
              </div>
              <CardDescription>Integrated Care Workflows</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Streamlined care coordination across providers with intelligent workflow automation.
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-blue-500">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Brain className="h-6 w-6 text-blue-600" />
                <CardTitle className="text-lg">Precision Medicine</CardTitle>
              </div>
              <CardDescription>Personalized Treatment Pathways</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                AI-driven precision medicine recommendations based on patient genetics and clinical data.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Value Proposition */}
      <div className="bg-blue-50 py-16">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why Healthcare Leaders Choose EMME Health</h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Leading healthcare organizations trust EMME Health to transform their delivery models and 
              improve patient outcomes through intelligent healthcare analytics and decision support.
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            <div className="text-center p-6 bg-white rounded-lg shadow-sm">
              <div className="text-3xl font-bold text-blue-600 mb-2">25%</div>
              <div className="text-sm font-medium text-blue-800 mb-2">Improvement in Patient Outcomes</div>
              <div className="text-xs text-blue-700">Through predictive analytics</div>
            </div>
            <div className="text-center p-6 bg-white rounded-lg shadow-sm">
              <div className="text-3xl font-bold text-cyan-600 mb-2">30%</div>
              <div className="text-sm font-medium text-cyan-800 mb-2">Reduction in Readmissions</div>
              <div className="text-xs text-cyan-700">Via risk prediction models</div>
            </div>
            <div className="text-center p-6 bg-white rounded-lg shadow-sm">
              <div className="text-3xl font-bold text-indigo-600 mb-2">40%</div>
              <div className="text-sm font-medium text-indigo-800 mb-2">Decrease in Clinical Errors</div>
              <div className="text-xs text-indigo-700">With decision support systems</div>
            </div>
          </div>
        </div>
      </div>

      {/* Healthcare Benefits */}
      <div className="container py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Healthcare Innovation Made Accessible</h2>
        <div className="grid gap-8 md:grid-cols-3">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mb-4">
              <Zap className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="font-semibold mb-2">Rapid Implementation</h3>
            <p className="text-sm text-muted-foreground">
              Deploy healthcare intelligence solutions quickly with minimal disruption to existing workflows.
            </p>
          </div>
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mb-4">
              <Globe className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="font-semibold mb-2">Interoperability</h3>
            <p className="text-sm text-muted-foreground">
              Seamlessly integrate with existing EHR systems and healthcare technology infrastructure.
            </p>
          </div>
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mb-4">
              <Star className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="font-semibold mb-2">Evidence-Based</h3>
            <p className="text-sm text-muted-foreground">
              All recommendations backed by peer-reviewed research and real-world clinical evidence.
            </p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-blue-600 text-white py-16">
        <div className="container text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Transform Patient Care?</h2>
          <p className="text-lg mb-8 text-blue-100">
            Join healthcare organizations that are improving outcomes and reducing costs with intelligent healthcare analytics.
          </p>
          <Button size="lg" variant="secondary" onClick={handleLogin} className="text-lg px-8 py-4">
            Start Healing
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t bg-blue-50 py-8">
        <div className="container text-center text-sm text-muted-foreground">
          <p>© 2025 EMME Health. Intelligent healthcare platform for improved patient outcomes and care delivery.</p>
          <p className="text-xs text-gray-400 mt-2">Powered by SocratIQ</p>
        </div>
      </div>
    </div>
  );
}