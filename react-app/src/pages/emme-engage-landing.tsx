import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Target, 
  Users, 
  TrendingUp,
  ArrowRight,
  Handshake,
  Globe,
  Zap,
  Building2,
  Star,
  Lightbulb
} from "lucide-react";
import { NavigationService } from '@/lib/navigation';

export default function EMMEEngageLanding() {
  const handleEnterApp = () => {
    NavigationService.handleAppEntry('emme-engage');
  };

  const handleLogin = () => {
    NavigationService.handleLogin('emme-engage');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-60">
        {/* Floating connection nodes */}
        <div className="absolute top-20 left-20 w-3 h-3 bg-purple-500/60 rounded-full animate-pulse"></div>
        <div className="absolute top-32 right-32 w-2 h-2 bg-violet-400/70 rounded-full animate-bounce" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-40 left-40 w-2.5 h-2.5 bg-indigo-400/60 rounded-full animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/2 right-20 w-2 h-2 bg-purple-500/50 rounded-full animate-bounce" style={{animationDelay: '0.5s'}}></div>
        <div className="absolute bottom-32 right-1/4 w-3 h-3 bg-violet-300/60 rounded-full animate-pulse" style={{animationDelay: '1.5s'}}></div>
        
        {/* Connection lines */}
        <svg className="absolute inset-0 w-full h-full" style={{zIndex: -1}}>
          <defs>
            <pattern id="grid" width="100" height="100" patternUnits="userSpaceOnUse">
              <path d="M 100 0 L 0 0 0 100" fill="none" stroke="rgb(139 92 246 / 0.3)" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
          
          <line x1="20%" y1="30%" x2="80%" y2="70%" stroke="rgb(139 92 246 / 0.3)" strokeWidth="2" strokeDasharray="5,5">
            <animate attributeName="stroke-dashoffset" values="0;10" dur="20s" repeatCount="indefinite"/>
          </line>
          <line x1="70%" y1="20%" x2="30%" y2="80%" stroke="rgb(124 58 237 / 0.3)" strokeWidth="2" strokeDasharray="3,7">
            <animate attributeName="stroke-dashoffset" values="0;10" dur="25s" repeatCount="indefinite"/>
          </line>
        </svg>
      </div>

      {/* Header */}
      <div className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-purple-600 flex items-center justify-center">
                <Target className="w-4 h-4 text-white" />
              </div>
              <div>
                <h1 className="font-bold text-gray-900">EMME Engage™</h1>
                <p className="text-xs text-gray-600">Pharmaceutical Intelligence</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" onClick={handleLogin}>
                Sign In
              </Button>
              <Button onClick={handleEnterApp}>
                Enter App
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-purple-100 text-purple-700 border-purple-200">
            EMME Engage™ Platform
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            <span className="text-gray-900">Transform</span>{" "}
            <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Pharmaceutical
            </span>{" "}
            <span className="text-gray-900">Intelligence</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Accelerate market access, enhance stakeholder engagement, and drive strategic decision-making 
            with AI-powered pharmaceutical intelligence and analytics.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" onClick={handleEnterApp} className="bg-purple-600 hover:bg-purple-700">
              Get Started
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            <Button size="lg" variant="outline" onClick={handleLogin}>
              Sign In
            </Button>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center mb-4">
                <Target className="w-6 h-6 text-purple-600" />
              </div>
              <CardTitle>Strategic Intelligence</CardTitle>
              <CardDescription>
                Real-time market analysis and competitive intelligence for informed decision-making
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <CardTitle>Stakeholder Engagement</CardTitle>
              <CardDescription>
                Comprehensive HCP, patient, and payer relationship management platform
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <CardTitle>Market Access</CardTitle>
              <CardDescription>
                Accelerate time-to-market with strategic payer engagement and access optimization
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Platform Features */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Comprehensive Platform Features</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Unlock the full potential of your pharmaceutical strategy with our integrated suite of intelligence tools
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="flex items-start space-x-3 p-4 rounded-lg hover:bg-purple-50 transition-colors">
              <div className="w-8 h-8 rounded bg-purple-100 flex items-center justify-center flex-shrink-0">
                <Target className="w-4 h-4 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Competitive Intelligence</h3>
                <p className="text-sm text-gray-600">Real-time competitor monitoring and analysis</p>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-4 rounded-lg hover:bg-blue-50 transition-colors">
              <div className="w-8 h-8 rounded bg-blue-100 flex items-center justify-center flex-shrink-0">
                <Building2 className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Market Access Planning</h3>
                <p className="text-sm text-gray-600">Strategic payer engagement and access optimization</p>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-4 rounded-lg hover:bg-green-50 transition-colors">
              <div className="w-8 h-8 rounded bg-green-100 flex items-center justify-center flex-shrink-0">
                <Users className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Stakeholder Mapping</h3>
                <p className="text-sm text-gray-600">Comprehensive HCP and payer relationship management</p>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-4 rounded-lg hover:bg-orange-50 transition-colors">
              <div className="w-8 h-8 rounded bg-orange-100 flex items-center justify-center flex-shrink-0">
                <TrendingUp className="w-4 h-4 text-orange-600" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Analytics Dashboard</h3>
                <p className="text-sm text-gray-600">Real-time metrics and performance insights</p>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-4 rounded-lg hover:bg-indigo-50 transition-colors">
              <div className="w-8 h-8 rounded bg-indigo-100 flex items-center justify-center flex-shrink-0">
                <Handshake className="w-4 h-4 text-indigo-600" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Partnership Management</h3>
                <p className="text-sm text-gray-600">Alliance tracking and deal analytics</p>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-4 rounded-lg hover:bg-pink-50 transition-colors">
              <div className="w-8 h-8 rounded bg-pink-100 flex items-center justify-center flex-shrink-0">
                <Lightbulb className="w-4 h-4 text-pink-600" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">AI-Powered Insights</h3>
                <p className="text-sm text-gray-600">Sophie™ intelligent assistant and analytics</p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid md:grid-cols-4 gap-8 mb-16">
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">500+</div>
            <div className="text-gray-600">Global Pharma Companies</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">95%</div>
            <div className="text-gray-600">Faster Market Access</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">$2.5B</div>
            <div className="text-gray-600">Revenue Impact</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-orange-600 mb-2">24/7</div>
            <div className="text-gray-600">AI-Powered Monitoring</div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-12 text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Strategy?</h2>
          <p className="text-xl mb-8 text-purple-100">
            Join leading pharmaceutical companies using EMME Engage™ to accelerate market success
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" onClick={handleEnterApp}>
              Start Free Trial
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-purple-600">
              Schedule Demo
            </Button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t bg-white/80 backdrop-blur-sm mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-6 h-6 rounded bg-purple-600 flex items-center justify-center">
                <Target className="w-3 h-3 text-white" />
              </div>
              <span className="font-semibold text-gray-900">EMME Engage™</span>
            </div>
            <div className="flex items-center space-x-6 text-sm text-gray-600">
              <span>© 2024 SocratIQ. All rights reserved.</span>
              <span>Privacy Policy</span>
              <span>Terms of Service</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}