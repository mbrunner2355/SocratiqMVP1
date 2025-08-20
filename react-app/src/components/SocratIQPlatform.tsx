import { Link } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { 
  Brain, 
  Zap, 
  Shield, 
  Building2, 
  ArrowRight,
  Users,
  TrendingUp,
  FileSearch,
  Network
} from 'lucide-react'

export function SocratIQPlatform() {
  const platformModules = [
    {
      id: 'transform',
      name: 'Transform™',
      description: 'Multi-format document ingestion and NLP entity extraction',
      icon: FileSearch,
      status: 'Production Ready',
      features: ['PDF/DOCX/TXT Processing', 'Entity Extraction', 'Semantic Tagging', 'Content Analysis']
    },
    {
      id: 'mesh',
      name: 'Mesh™',
      description: 'Automatic knowledge graph construction and visualization',
      icon: Network,
      status: 'Production Ready',
      features: ['Knowledge Graphs', 'Relationship Mapping', 'Visual Analytics', 'Graph Neural Networks']
    },
    {
      id: 'trace',
      name: 'Trace™',
      description: 'Comprehensive audit trail and compliance monitoring',
      icon: Shield,
      status: 'Production Ready',
      features: ['Immutable Audit Trails', 'GxP Compliance', 'Risk Assessment', 'Regulatory Tracking']
    },
    {
      id: 'sophie',
      name: 'Sophie™',
      description: 'AI agent layer with conversational intelligence',
      icon: Brain,
      status: 'Advanced AI',
      features: ['Conversational AI', 'Semantic Search', 'Risk Analysis', 'Proactive Insights']
    },
    {
      id: 'build',
      name: 'Build™',
      description: 'Predictive intelligence for AEC programs',
      icon: Building2,
      status: 'Specialized',
      features: ['Schedule Optimization', 'Cost Management', 'Risk Monitoring', 'Quality Assurance']
    },
    {
      id: 'emme',
      name: 'EMME Engage™',
      description: 'White-label SaaS for pharmaceutical strategic intelligence',
      icon: TrendingUp,
      status: 'Enterprise Ready',
      features: ['Strategic Intelligence', 'Market Analysis', 'Stakeholder Engagement', 'Content Orchestration']
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Production Ready': return 'bg-green-100 text-green-800'
      case 'Advanced AI': return 'bg-purple-100 text-purple-800'
      case 'Enterprise Ready': return 'bg-blue-100 text-blue-800'
      case 'Specialized': return 'bg-orange-100 text-orange-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getIcon = (IconComponent: any) => {
    return <IconComponent className="w-8 h-8 text-purple-600" />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">SocratIQ Transform™</h1>
                <p className="text-sm text-gray-600">AI-Powered Document Intelligence Platform</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                All Systems Operational
              </Badge>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Transform Documents into Strategic Intelligence
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            SocratIQ Transform™ processes diverse document formats to create rich semantic knowledge networks,
            providing advanced conversational AI, semantic search, and intelligent analytics across various domains.
          </p>
          <div className="flex justify-center space-x-4">
            <Link to="/emme">
              <Button size="lg" className="bg-purple-600 hover:bg-purple-700">
                <Users className="w-5 h-5 mr-2" />
                Launch EMME Engage
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Button variant="outline" size="lg">
              <FileSearch className="w-5 h-5 mr-2" />
              Explore Platform
            </Button>
          </div>
        </div>
      </section>

      {/* Platform Modules */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Platform Modules</h3>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Comprehensive suite of AI-powered tools for document intelligence, knowledge management, and strategic analysis
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {platformModules.map((module) => (
              <Card key={module.id} className="hover:shadow-lg transition-shadow duration-200">
                <CardHeader>
                  <div className="flex items-center justify-between mb-4">
                    {getIcon(module.icon)}
                    <Badge className={getStatusColor(module.status)}>
                      {module.status}
                    </Badge>
                  </div>
                  <CardTitle className="text-xl">{module.name}</CardTitle>
                  <CardDescription className="text-gray-600">
                    {module.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {module.features.map((feature, index) => (
                      <div key={index} className="flex items-center text-sm text-gray-600">
                        <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mr-2"></div>
                        {feature}
                      </div>
                    ))}
                  </div>
                  <div className="mt-6">
                    {module.id === 'emme' ? (
                      <Link to="/emme">
                        <Button className="w-full">
                          Launch Application
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </Link>
                    ) : (
                      <Button variant="outline" className="w-full">
                        Learn More
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Key Capabilities</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-purple-600" />
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-2">Real-time Processing</h4>
              <p className="text-gray-600">
                Advanced NLP models process documents in real-time with comprehensive entity extraction and semantic analysis
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-blue-600" />
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-2">Enterprise Security</h4>
              <p className="text-gray-600">
                Comprehensive audit trails, GxP compliance, and immutable blockchain-based tracking for pharmaceutical applications
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Brain className="w-8 h-8 text-green-600" />
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-2">AI-Powered Insights</h4>
              <p className="text-gray-600">
                Sophie™ AI agents provide conversational intelligence, predictive analytics, and proactive risk assessment
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-600">
            <p>&copy; 2024 SocratIQ Transform™. Advanced AI-powered document intelligence platform.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}