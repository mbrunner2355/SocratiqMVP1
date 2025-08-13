import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Brain, 
  Target, 
  Shield, 
  Users, 
  TrendingUp, 
  Zap,
  ArrowRight,
  CheckCircle,
  BarChart3,
  Globe,
  Clock,
  DollarSign
} from "lucide-react";
import { Link } from "wouter";

export default function Landing() {
  const metrics = [
    { label: "Timeline Reduction", value: "55%", icon: Clock, color: "text-green-600" },
    { label: "Cost Reduction", value: "55%", icon: DollarSign, color: "text-blue-600" },
    { label: "Value Enhancement", value: "20%", icon: TrendingUp, color: "text-purple-600" },
    { label: "Scale Improvement", value: "400%", icon: BarChart3, color: "text-orange-600" }
  ];

  const platforms = [
    {
      title: "SocratIQ Transform™",
      description: "AI-powered document intelligence and knowledge extraction",
      features: ["Multi-format processing", "Real-time analytics", "Advanced NLP"],
      icon: Brain,
      color: "bg-blue-50 border-blue-200"
    },
    {
      title: "FedScout™",
      description: "Federal technology discovery and life sciences opportunities",
      features: ["300+ federal labs", "Technology transfer", "Investment intelligence"],
      icon: Target,
      color: "bg-green-50 border-green-200"
    },
    {
      title: "EMME Engage™",
      description: "Pharmaceutical commercialization and strategic intelligence",
      features: ["Market intelligence", "Stakeholder engagement", "Regulatory monitoring"],
      icon: Users,
      color: "bg-purple-50 border-purple-200"
    },
    {
      title: "Sophie Intelligence™",
      description: "24/7 autonomous AI agent for proactive insights",
      features: ["Continuous monitoring", "Predictive analytics", "Risk assessment"],
      icon: Zap,
      color: "bg-orange-50 border-orange-200"
    }
  ];

  const capabilities = [
    "Advanced transformer ensemble management",
    "Scalable enterprise-grade NLP processing", 
    "Comprehensive authentication framework",
    "Adaptive machine learning infrastructure",
    "Interactive federal technology scouting",
    "Real-time strategic intelligence"
  ];

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">SocratIQ Platform</h1>
                <p className="text-sm text-gray-500">AI-Powered Strategic Intelligence</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/login">
                <Button variant="outline">Sign In</Button>
              </Link>
              <Link href="/emme">
                <Button>Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-blue-100 text-blue-700 border-blue-200">
            Advanced AI Platform
          </Badge>
          <h1 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
            Transform Your Strategic Intelligence with
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> AI-Powered Insights</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Comprehensive enterprise platform delivering strategic intelligence for life sciences commercialization, 
            federal technology discovery, and advanced document processing through cutting-edge AI and semantic analysis.
          </p>
          
          {/* Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
            {metrics.map((metric, index) => (
              <Card key={index} className="text-center">
                <CardContent className="pt-6">
                  <metric.icon className={`w-8 h-8 ${metric.color} mx-auto mb-2`} />
                  <div className="text-3xl font-bold text-gray-900">{metric.value}</div>
                  <div className="text-sm text-gray-600">{metric.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/platform">
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                Start Free Trial
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
            <Link href="/ip/fedscout">
              <Button size="lg" variant="outline">
                Explore FedScout™
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Platform Overview */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Integrated AI Platform Suite</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Four powerful platforms working together to deliver comprehensive strategic intelligence and business acceleration.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {platforms.map((platform, index) => (
            <Card key={index} className={`${platform.color} hover:shadow-lg transition-shadow`}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <platform.icon className="w-8 h-8 text-gray-700" />
                  <Badge variant="secondary">{index + 1}</Badge>
                </div>
                <CardTitle className="text-lg">{platform.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">{platform.description}</p>
                <ul className="space-y-2">
                  {platform.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center text-sm">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Key Capabilities */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Enterprise-Grade AI Capabilities
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Built for scale with advanced machine learning infrastructure, 
                comprehensive security, and seamless integration capabilities.
              </p>
              <ul className="space-y-4">
                {capabilities.map((capability, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{capability}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl p-8">
                <div className="grid grid-cols-2 gap-6">
                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <Globe className="w-8 h-8 text-blue-600 mb-2" />
                    <div className="text-2xl font-bold text-gray-900">300+</div>
                    <div className="text-sm text-gray-600">Federal Labs</div>
                  </div>
                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <Brain className="w-8 h-8 text-purple-600 mb-2" />
                    <div className="text-2xl font-bold text-gray-900">24/7</div>
                    <div className="text-sm text-gray-600">AI Monitoring</div>
                  </div>
                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <Shield className="w-8 h-8 text-green-600 mb-2" />
                    <div className="text-2xl font-bold text-gray-900">100%</div>
                    <div className="text-sm text-gray-600">Secure & Compliant</div>
                  </div>
                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <TrendingUp className="w-8 h-8 text-orange-600 mb-2" />
                    <div className="text-2xl font-bold text-gray-900">Real-time</div>
                    <div className="text-sm text-gray-600">Intelligence</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 py-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Ready to Accelerate Your Strategic Intelligence?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join leading organizations using SocratIQ to transform their decision-making with AI-powered insights.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/emme">
              <Button size="lg" variant="secondary" className="bg-white text-blue-600 hover:bg-gray-50">
                Start Your Free Trial
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
            <Link href="/contact">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
                Contact Sales
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Brain className="w-6 h-6" />
                <span className="font-bold">SocratIQ</span>
              </div>
              <p className="text-gray-400">
                AI-powered strategic intelligence platform for enterprise transformation.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Platforms</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/transform" className="hover:text-white">Transform™</Link></li>
                <li><Link href="/fedscout" className="hover:text-white">FedScout™</Link></li>
                <li><Link href="/emme" className="hover:text-white">EMME Engage™</Link></li>
                <li><Link href="/sophie" className="hover:text-white">Sophie Intelligence™</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Solutions</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/life-sciences" className="hover:text-white">Life Sciences</Link></li>
                <li><Link href="/federal-tech" className="hover:text-white">Federal Technology</Link></li>
                <li><Link href="/document-ai" className="hover:text-white">Document AI</Link></li>
                <li><Link href="/strategic-intelligence" className="hover:text-white">Strategic Intelligence</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/about" className="hover:text-white">About</Link></li>
                <li><Link href="/contact" className="hover:text-white">Contact</Link></li>
                <li><Link href="/support" className="hover:text-white">Support</Link></li>
                <li><Link href="/privacy" className="hover:text-white">Privacy</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 SocratIQ Platform. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}