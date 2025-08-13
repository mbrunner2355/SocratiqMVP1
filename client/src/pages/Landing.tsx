import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Zap, 
  FileText, 
  Network,
  CheckCircle
} from "lucide-react";

export default function Landing() {
  const handleLogin = () => {
    window.location.href = "/api/login";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex flex-col relative overflow-hidden">
      {/* Molecular Background Pattern */}
      <div className="absolute inset-0 opacity-60">
        {/* Enhanced floating molecular nodes with more movement */}
        <div className="absolute top-20 left-16 w-6 h-6 bg-blue-400 rounded-full animate-pulse"></div>
        <div className="absolute top-32 right-24 w-4 h-4 bg-indigo-400 rounded-full animate-bounce" style={{animationDelay: '1.5s'}}></div>
        <div className="absolute bottom-40 left-32 w-7 h-7 bg-cyan-300 rounded-full animate-pulse" style={{animationDelay: '2.5s'}}></div>
        <div className="absolute top-1/2 right-16 w-5 h-5 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.8s'}}></div>
        <div className="absolute bottom-32 right-1/3 w-6 h-6 bg-indigo-300 rounded-full animate-pulse" style={{animationDelay: '1.8s'}}></div>
        <div className="absolute top-1/4 left-1/4 w-3 h-3 bg-cyan-400 rounded-full animate-bounce" style={{animationDelay: '3s'}}></div>
        
        {/* Additional floating nodes for more dynamic feel */}
        <div className="absolute top-40 right-40 w-5 h-5 bg-teal-400 rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
        <div className="absolute bottom-60 left-20 w-4 h-4 bg-blue-300 rounded-full animate-bounce" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-60 left-60 w-6 h-6 bg-indigo-400 rounded-full animate-pulse" style={{animationDelay: '1.2s'}}></div>
        <div className="absolute bottom-20 right-60 w-3 h-3 bg-cyan-500 rounded-full animate-bounce" style={{animationDelay: '3.5s'}}></div>
        <div className="absolute top-80 right-80 w-5 h-5 bg-blue-400 rounded-full animate-pulse" style={{animationDelay: '0.3s'}}></div>
        <div className="absolute bottom-80 left-80 w-4 h-4 bg-teal-300 rounded-full animate-bounce" style={{animationDelay: '2.8s'}}></div>
        
        {/* Organic molecular connections */}
        <svg className="absolute inset-0 w-full h-full" style={{zIndex: -1}}>
          <defs>
            <pattern id="molecular-grid" width="80" height="80" patternUnits="userSpaceOnUse">
              <circle cx="40" cy="40" r="1.5" fill="rgb(99 102 241 / 0.25)" />
              <circle cx="20" cy="20" r="1" fill="rgb(6 182 212 / 0.2)" />
              <circle cx="60" cy="20" r="0.8" fill="rgb(59 130 246 / 0.15)" />
              <circle cx="20" cy="60" r="1.2" fill="rgb(6 182 212 / 0.18)" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#molecular-grid)" />
          
          {/* Enhanced organic curved connections */}
          <path d="M20 30 Q 80 50, 120 80 T 200 120 T 300 160" stroke="rgb(59 130 246 / 0.4)" strokeWidth="2" fill="none" strokeDasharray="3,6">
            <animate attributeName="stroke-dashoffset" values="0;9" dur="25s" repeatCount="indefinite"/>
          </path>
          <path d="M80 20 Q 60 70, 40 120 T 20 200 T 80 280" stroke="rgb(99 102 241 / 0.3)" strokeWidth="1.5" fill="none" strokeDasharray="2,8">
            <animate attributeName="stroke-dashoffset" values="0;10" dur="30s" repeatCount="indefinite"/>
          </path>
          <path d="M70 80 Q 120 60, 180 90 T 250 110 T 320 140" stroke="rgb(6 182 212 / 0.35)" strokeWidth="1.5" fill="none" strokeDasharray="4,5">
            <animate attributeName="stroke-dashoffset" values="0;9" dur="20s" repeatCount="indefinite"/>
          </path>
          <path d="M200 20 Q 150 80, 100 140 T 50 220 T 150 300" stroke="rgb(6 182 212 / 0.25)" strokeWidth="1.2" fill="none" strokeDasharray="5,7">
            <animate attributeName="stroke-dashoffset" values="0;12" dur="35s" repeatCount="indefinite"/>
          </path>
          <path d="M300 60 Q 250 120, 200 180 T 150 260 T 250 340" stroke="rgb(59 130 246 / 0.3)" strokeWidth="1.8" fill="none" strokeDasharray="3,5">
            <animate attributeName="stroke-dashoffset" values="0;8" dur="28s" repeatCount="indefinite"/>
          </path>
          <path d="M400 100 Q 350 160, 300 220 T 250 300 T 350 380" stroke="rgb(99 102 241 / 0.28)" strokeWidth="1.6" fill="none" strokeDasharray="4,6">
            <animate attributeName="stroke-dashoffset" values="0;10" dur="32s" repeatCount="indefinite"/>
          </path>
          
          {/* Additional dynamic flowing lines for more movement */}
          <path d="M50 200 Q 150 180, 250 200 T 400 220 T 550 240" stroke="rgb(6 182 212 / 0.3)" strokeWidth="1.4" fill="none" strokeDasharray="6,4">
            <animate attributeName="stroke-dashoffset" values="0;10" dur="18s" repeatCount="indefinite"/>
          </path>
          <path d="M600 50 Q 500 100, 400 150 T 300 250 T 200 350" stroke="rgb(59 130 246 / 0.35)" strokeWidth="1.8" fill="none" strokeDasharray="3,7">
            <animate attributeName="stroke-dashoffset" values="0;10" dur="22s" repeatCount="indefinite"/>
          </path>
          <path d="M100 400 Q 200 350, 300 400 T 500 420 T 700 400" stroke="rgb(99 102 241 / 0.25)" strokeWidth="1.3" fill="none" strokeDasharray="5,5">
            <animate attributeName="stroke-dashoffset" values="0;10" dur="26s" repeatCount="indefinite"/>
          </path>
          <path d="M450 20 Q 400 80, 350 140 T 250 240 T 150 340" stroke="rgb(6 182 212 / 0.32)" strokeWidth="1.7" fill="none" strokeDasharray="4,8">
            <animate attributeName="stroke-dashoffset" values="0;12" dur="24s" repeatCount="indefinite"/>
          </path>
          <path d="M0 150 Q 100 120, 200 150 T 400 180 T 600 150" stroke="rgb(59 130 246 / 0.28)" strokeWidth="1.5" fill="none" strokeDasharray="7,3">
            <animate attributeName="stroke-dashoffset" values="0;10" dur="20s" repeatCount="indefinite"/>
          </path>
          <path d="M350 450 Q 300 400, 250 350 T 150 250 T 50 150" stroke="rgb(6 182 212 / 0.27)" strokeWidth="1.6" fill="none" strokeDasharray="2,6">
            <animate attributeName="stroke-dashoffset" values="0;8" dur="29s" repeatCount="indefinite"/>
          </path>
          <path d="M500 300 Q 450 250, 400 200 T 300 100 T 200 0" stroke="rgb(99 102 241 / 0.3)" strokeWidth="1.4" fill="none" strokeDasharray="6,6">
            <animate attributeName="stroke-dashoffset" values="0;12" dur="21s" repeatCount="indefinite"/>
          </path>
          <path d="M150 500 Q 200 450, 250 400 T 350 300 T 450 200" stroke="rgb(59 130 246 / 0.26)" strokeWidth="1.2" fill="none" strokeDasharray="8,4">
            <animate attributeName="stroke-dashoffset" values="0;12" dur="33s" repeatCount="indefinite"/>
          </path>
          
          {/* Cross-diagonal flowing patterns */}
          <path d="M0 0 Q 150 150, 300 300 T 600 600" stroke="rgb(6 182 212 / 0.2)" strokeWidth="1.1" fill="none" strokeDasharray="10,5">
            <animate attributeName="stroke-dashoffset" values="0;15" dur="40s" repeatCount="indefinite"/>
          </path>
          <path d="M600 0 Q 450 150, 300 300 T 0 600" stroke="rgb(99 102 241 / 0.22)" strokeWidth="1.3" fill="none" strokeDasharray="4,10">
            <animate attributeName="stroke-dashoffset" values="0;14" dur="38s" repeatCount="indefinite"/>
          </path>
        </svg>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 relative z-10">
        <div className="w-full max-w-md space-y-8">
          {/* Logo */}
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-blue-500 rounded-2xl flex items-center justify-center">
                <Zap className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-7xl font-bold">
              <span className="text-blue-900">Socrat</span><span className="text-cyan-500">IQ</span>
            </h1>
            <p className="text-gray-600 mt-2">Intelligent Life Sciences Platform</p>
          </div>

          {/* Welcome Section */}
          <div className="text-center space-y-4">
            <h2 className="text-xl font-semibold text-blue-900">Welcome Back</h2>
            <p className="text-gray-600">Sign in to access your life sciences intelligence platform</p>
          </div>

          {/* Platform Features */}
          <div className="space-y-4">
            <div className="text-center space-y-3">
              <div className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-50 rounded-full">
                <CheckCircle className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-700">Comprehensive Life Sciences Intelligence</span>
              </div>
              <p className="text-sm text-gray-600 max-w-sm mx-auto">
                Access document processing, knowledge graphs, AI agents, and specialized pharmaceutical intelligence all in one unified platform.
              </p>
            </div>
          </div>

          {/* Continue Button */}
          <Button 
            onClick={handleLogin}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-base font-medium"
            size="lg"
          >
            Continue with Replit →
          </Button>

          {/* Security Notice */}
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
              <CheckCircle className="w-4 h-4" />
              <span>Enterprise-grade security & compliance</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}