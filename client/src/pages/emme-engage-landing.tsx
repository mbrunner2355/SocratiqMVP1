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

export default function EMMEEngageLanding() {
  const handleEnterApp = () => {
    // For development - go directly to the main app
    // Set partner app indicator for routing
    localStorage.setItem('partner-app', 'emme-engage');
    window.location.href = "/emme-engage/app";
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
            <pattern id="grid-engage" width="100" height="100" patternUnits="userSpaceOnUse">
              <path d="M 100 0 L 0 0 0 100" fill="none" stroke="rgb(139 92 246 / 0.3)" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid-engage)" />
          
          <line x1="20%" y1="30%" x2="80%" y2="70%" stroke="rgb(139 92 246 / 0.3)" strokeWidth="2" strokeDasharray="5,5">
            <animate attributeName="stroke-dashoffset" values="0;10" dur="20s" repeatCount="indefinite"/>
          </line>
          <line x1="70%" y1="20%" x2="30%" y2="80%" stroke="rgb(124 58 237 / 0.3)" strokeWidth="2" strokeDasharray="3,7">
            <animate attributeName="stroke-dashoffset" values="0;10" dur="25s" repeatCount="indefinite"/>
          </line>
        </svg>
      </div>

      {/* Header */}
      <div className="border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/95">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">E</span>
            </div>
            <span className="text-xl font-bold">EMME Engage</span>
          </div>
          <Button onClick={handleEnterApp} className="bg-purple-600 hover:bg-purple-700">
            Enter App
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Hero Section */}
      <div className="container py-16 text-center">
        <Badge variant="secondary" className="mb-4 bg-purple-100 text-purple-800">
          Go-to-Market Excellence Platform
        </Badge>
        <h1 className="text-4xl font-bold tracking-tight sm:text-6xl mb-6">
          <span className="text-purple-600">15-30%</span> of Marketing Spend
          <span className="block text-2xl text-muted-foreground mt-2">Optimized with Adaptive Go-to-Market Intelligence</span>
        </h1>
        <div className="text-center mb-8">
          <div className="text-4xl font-bold text-purple-600 mb-2">$300M-$900M/YR</div>
          <p className="text-lg text-muted-foreground">Average savings potential through intelligent market access optimization</p>
        </div>
        <Button size="lg" onClick={handleEnterApp} className="text-lg px-8 py-4 bg-purple-600 hover:bg-purple-700">
          Access Platform
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </div>

      {/* Core Features */}
      <div className="container py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Core Modules</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card className="border-l-4 border-l-purple-500">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Lightbulb className="h-6 w-6 text-purple-600" />
                <CardTitle className="text-lg">Insight Engine</CardTitle>
              </div>
              <CardDescription>Experience + Equity Intelligence</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Lived experience insights combined with equity-readiness assessment for inclusive market strategies.
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-violet-500">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Users className="h-6 w-6 text-violet-600" />
                <CardTitle className="text-lg">Engagement Studio</CardTitle>
              </div>
              <CardDescription>Multi-Stakeholder Strategy</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Integrated HCP, patient, and payer engagement strategy with personalized touchpoint optimization.
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-indigo-500">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Star className="h-6 w-6 text-indigo-600" />
                <CardTitle className="text-lg">Learning + Activation Hub</CardTitle>
              </div>
              <CardDescription>Training & Support Ecosystem</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Comprehensive training modules and support infrastructure for stakeholder activation and engagement.
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-500">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-6 w-6 text-purple-600" />
                <CardTitle className="text-lg">Equity Infrastructure</CardTitle>
              </div>
              <CardDescription>SDOH & Impact Metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Social determinants of health analysis with comprehensive impact measurement and equity tracking.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Value Proposition */}
      <div className="bg-purple-50 py-16">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Proven Go-to-Market Efficiency Gains</h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              EMME delivers a condensed and adaptive go-to-market model with a robust, flexible content framework 
              designed to help every launch achieve maximum engagement within their specific stakeholder strategies.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <div className="p-4 bg-white rounded-lg shadow-sm">
              <div className="text-lg font-bold text-purple-600 mb-1">Agency Efficiency Gains</div>
              <div className="text-sm text-gray-600 mb-2">Reduced duplication, restricting, creative rounds, and analytics rework across holding company partners</div>
              <div className="text-xl font-bold text-purple-700">$10M-$20M</div>
            </div>
            <div className="p-4 bg-white rounded-lg shadow-sm">
              <div className="text-lg font-bold text-purple-600 mb-1">Accelerated Time-to-Market</div>
              <div className="text-sm text-gray-600 mb-2">Faster GTM execution across brands (e.g., even a 1-week gain = ~$30M+ for high-value launches)</div>
              <div className="text-xl font-bold text-purple-700">$150M-$350M</div>
            </div>
            <div className="p-4 bg-white rounded-lg shadow-sm">
              <div className="text-lg font-bold text-purple-600 mb-1">Content & Asset Optimization</div>
              <div className="text-sm text-gray-600 mb-2">Modular content platform cuts down on redundant production, QA, and local adaptation costs</div>
              <div className="text-xl font-bold text-purple-700">$50M-$100M</div>
            </div>
            <div className="p-4 bg-white rounded-lg shadow-sm">
              <div className="text-lg font-bold text-purple-600 mb-1">Strategic Alignment Across Teams</div>
              <div className="text-sm text-gray-600 mb-2">Reduced conflict across brand and market teams - fewer workarounds and delays</div>
              <div className="text-xl font-bold text-purple-700">$50M-$150M</div>
            </div>
            <div className="p-4 bg-white rounded-lg shadow-sm">
              <div className="text-lg font-bold text-purple-600 mb-1">Reduced Churn & Onboarding Loss</div>
              <div className="text-sm text-gray-600 mb-2">Faster ramp-up or turnover, with preserved institutional knowledge and historical data</div>
              <div className="text-xl font-bold text-purple-700">$10M-$25M</div>
            </div>
            <div className="p-4 bg-white rounded-lg shadow-sm">
              <div className="text-lg font-bold text-purple-600 mb-1">Improved Equity & Access Strategy</div>
              <div className="text-sm text-gray-600 mb-2">Increased patient uptake from better SDOH informed engagement and earlier payer wins</div>
              <div className="text-xl font-bold text-purple-700">$40M-$100M</div>
            </div>
          </div>
        </div>
      </div>

      {/* Partnership Benefits */}
      <div className="container py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Partnership Success Made Simple</h2>
        <div className="grid gap-8 md:grid-cols-3">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg mb-4">
              <Zap className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="font-semibold mb-2">Rapid Deployment</h3>
            <p className="text-sm text-muted-foreground">
              Launch partnership programs in days, not months, with pre-built templates and workflows.
            </p>
          </div>
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg mb-4">
              <Globe className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="font-semibold mb-2">Global Reach</h3>
            <p className="text-sm text-muted-foreground">
              Connect with partners worldwide through our intelligent matching and collaboration platform.
            </p>
          </div>
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg mb-4">
              <Lightbulb className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="font-semibold mb-2">Smart Insights</h3>
            <p className="text-sm text-muted-foreground">
              AI-powered analytics provide actionable insights to optimize partnership performance.
            </p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-purple-600 text-white py-16">
        <div className="container text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Partnership Strategy?</h2>
          <p className="text-lg mb-8 text-purple-100">
            Join industry leaders who are accelerating growth through intelligent partnership engagement.
          </p>
          <Button size="lg" variant="secondary" onClick={handleEnterApp} className="text-lg px-8 py-4">
            Enter EMME Engage
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t bg-purple-50 py-8">
        <div className="container text-center text-sm text-muted-foreground">
          <p>© 2025 EMME Engage. Intelligent partnership platform for accelerated collaborative growth.</p>
        </div>
      </div>
    </div>
  );
}