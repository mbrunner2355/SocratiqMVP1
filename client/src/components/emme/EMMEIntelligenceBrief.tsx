import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Bell, Send, MessageCircle, Users, BarChart3, Heart, TrendingUp, Shield, Activity } from "lucide-react";
import { detectPartnerContext, getPartnerBrand } from "src/components/PartnerBrandingDemo.tsx";
import { apiRequest } from "@/lib/queryClient";

export function EMMEIntelligenceBrief() {
  const [chatMessage, setChatMessage] = useState("");
  const [chatHistory, setChatHistory] = useState<Array<{sender: 'user' | 'emme', message: string, timestamp: Date}>>([]);
  
  // Get EMME Connect branding configuration
  const partnerId = detectPartnerContext();
  const brand = getPartnerBrand(partnerId);
  const isEMMEEngage = partnerId === 'emme-engage';
  const agentName = brand.agentName; // "EMME" instead of "Sophie"
  
  console.log("EMMEIntelligenceBrief rendering with partnerId:", partnerId, "agentName:", agentName);
  
  const handleSendMessage = async () => {
    if (chatMessage.trim()) {
      const userMessage = chatMessage.trim();
      console.log("Sending message:", userMessage);
      
      // Add user message to history
      setChatHistory(prev => [...prev, {
        sender: 'user',
        message: userMessage,
        timestamp: new Date()
      }]);
      
      setChatMessage("");
      
      try {
        const response = await apiRequest('/api/public/emme-question', {
          method: 'POST',
          body: {
            question: userMessage,
            context: `EMME Intelligence Brief - Pharmaceutical Marketing Intelligence`,
            agentId: 'emme-engage'
          }
        });
        
        console.log("EMME Response:", response);
        
        // Generate meaningful pharmaceutical intelligence response
        let emmeReply = "I've analyzed your question and am here to help with your pharmaceutical marketing needs.";
        
        if (response.success && response.analysis) {
          // Create a meaningful response based on the question and analysis
          if (userMessage.toLowerCase().includes('kol') || userMessage.toLowerCase().includes('opinion leader')) {
            emmeReply = `I've analyzed your KOL engagement question for oncology. Here are my key recommendations:

1. **Build Scientific Relationships**: Focus on peer-to-peer medical discussions rather than promotional approaches
2. **Leverage Digital Channels**: Use virtual symposiums and medical education platforms for initial touchpoints  
3. **Data-Driven Insights**: Share relevant clinical trial data and real-world evidence that aligns with their research interests
4. **Advisory Opportunities**: Invite participation in advisory boards and scientific committees
5. **Publication Support**: Offer collaboration on research publications and conference presentations

Based on my analysis (${Math.round(response.analysis.questionAnalysis.confidence * 100)}% confidence), this approach leverages relationship-building and scientific credibility to establish meaningful KOL partnerships in oncology.`;
          } else if (userMessage.toLowerCase().includes('market access') || userMessage.toLowerCase().includes('payer')) {
            emmeReply = `I've processed your market access inquiry. Here's my strategic analysis:

1. **Payer Landscape Mapping**: Identify key formulary decision-makers and P&T committee structures
2. **Value Proposition Development**: Create compelling health economic evidence packages
3. **Access Strategy Timing**: Align market access activities with clinical milestones
4. **Stakeholder Engagement**: Build relationships with medical directors and pharmacy directors
5. **Outcome Measurement**: Develop real-world evidence collection plans

My analysis indicates ${response.analysis.questionAnalysis.domainClassification.primaryDomain || 'strategic'} focus with ${Math.round(response.analysis.questionAnalysis.confidence * 100)}% analytical confidence.`;
          } else {
            // Generic pharmaceutical intelligence response
            emmeReply = `I've processed your pharmaceutical intelligence question with ${Math.round(response.analysis.questionAnalysis.confidence * 100)}% confidence. 

Based on my analysis of ${response.analysis.questionAnalysis.domainClassification.primaryDomain || 'pharmaceutical'} domain factors, I recommend:

1. **Strategic Assessment**: Leverage data-driven insights for decision making
2. **Stakeholder Engagement**: Prioritize key relationship building activities  
3. **Market Intelligence**: Monitor competitive landscape and regulatory changes
4. **Performance Optimization**: Implement measurable success metrics
5. **Risk Mitigation**: Address potential challenges proactively

I'm here to provide deeper analysis on any specific aspect of your pharmaceutical marketing strategy.`;
          }
        }
        
        setChatHistory(prev => [...prev, {
          sender: 'emme',
          message: emmeReply,
          timestamp: new Date()
        }]);
        
      } catch (error) {
        console.error("Chat error:", error);
        setChatHistory(prev => [...prev, {
          sender: 'emme',
          message: "I'm experiencing some technical difficulties. Please try again.",
          timestamp: new Date()
        }]);
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const welcomeQuote = "Your research is a conversation with nature, asking questions through experimentation and listening carefully to the answers.";

  return (
    <div className="p-6 space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className={`w-12 h-12 ${isEMMEEngage ? 'bg-purple-400' : 'bg-blue-500'} rounded-full flex items-center justify-center`}>
            <span className="text-white font-bold text-lg">{agentName.charAt(0)}</span>
          </div>
          <div>
            <h1 className={`text-2xl font-bold ${isEMMEEngage ? 'text-purple-900' : 'text-gray-900'}`}>
              {agentName}'s Intelligence Brief
            </h1>
            <p className={`text-sm ${isEMMEEngage ? 'text-purple-600' : 'text-gray-600'}`}>
              Welcome back! Here's what I've been monitoring for you.
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm">
            <Bell className="w-4 h-4 mr-2" />
            Notifications
          </Button>
          <Button 
            className={`${isEMMEEngage ? 'bg-purple-600 hover:bg-purple-700' : 'bg-teal-600 hover:bg-teal-700'} text-white`}
            size="sm"
          >
            <MessageCircle className="w-4 h-4 mr-2" />
            Ask {agentName}
          </Button>
        </div>
      </div>

      {/* Welcome Section with Quote */}
      <Card className={`${isEMMEEngage ? 'bg-gradient-to-r from-purple-50 to-stone-100 border-purple-200' : 'bg-gradient-to-r from-blue-50 to-green-50 border-blue-200'}`}>
        <CardContent className="p-6 text-center">
          <h2 className={`text-2xl font-bold ${isEMMEEngage ? 'text-purple-900' : 'text-gray-800'} mb-3`}>
            Welcome! Let's optimize your pharmaceutical campaigns today!
          </h2>
          <p className={`${isEMMEEngage ? 'text-purple-700' : 'text-gray-600'} italic max-w-2xl mx-auto`}>
            "{welcomeQuote}"
          </p>
          <div className="mt-4 flex items-center justify-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className={`text-sm ${isEMMEEngage ? 'text-purple-600' : 'text-gray-600'}`}>
              {agentName}™ is online & ready
            </span>
          </div>
          
          {/* Chat Interface - Always visible below quote */}
          <div className={`mt-6 ${isEMMEEngage ? 'bg-white' : 'bg-white'} rounded-lg p-4 border ${isEMMEEngage ? 'border-purple-100' : 'border-gray-100'}`}>
            
            {/* Chat History */}
            <div className="space-y-4 mb-4">
              {/* Initial welcome message */}
              <div className="flex items-start space-x-3">
                <div className={`w-8 h-8 ${isEMMEEngage ? 'bg-purple-400' : 'bg-blue-500'} rounded-full flex items-center justify-center flex-shrink-0`}>
                  <span className="text-white font-bold text-sm">{agentName.charAt(0)}</span>
                </div>
                <div className="flex-1 text-left">
                  <p className="text-sm text-gray-700">
                    Hi there! Where do you want to start today? I'm {agentName}, your AI {brand.messaging.roleDescription}. I work 
                    alongside you and my team of specialized agents to navigate the complexities of {brand.messaging.industry}. 
                    Whether you need strategic insights, risk assessment, or {brand.messaging.specialization}, we'll 
                    collaborate to provide intelligent analysis and accelerate your journey {brand.messaging.journey}.
                  </p>
                  <div className="text-xs text-gray-500 mt-2">{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                </div>
              </div>

              {/* Dynamic chat history */}
              {chatHistory.map((msg, idx) => (
                <div key={idx} className="flex items-start space-x-3">
                  {msg.sender === 'emme' && (
                    <div className={`w-8 h-8 ${isEMMEEngage ? 'bg-purple-400' : 'bg-blue-500'} rounded-full flex items-center justify-center flex-shrink-0`}>
                      <span className="text-white font-bold text-sm">{agentName.charAt(0)}</span>
                    </div>
                  )}
                  {msg.sender === 'user' && (
                    <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-bold text-sm">U</span>
                    </div>
                  )}
                  <div className="flex-1 text-left">
                    <p className="text-sm text-gray-700">{msg.message}</p>
                    <div className="text-xs text-gray-500 mt-2">{msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Input area */}
            <div className="flex space-x-3">
              <Input
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder={`Ask ${agentName} anything...`}
                className="flex-1"
              />
              <Button 
                onClick={handleSendMessage}
                className={`${isEMMEEngage ? 'bg-purple-600 hover:bg-purple-700' : 'bg-teal-600 hover:bg-teal-700'} text-white`}
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* EMME's Recent Work Section */}
      <div className="space-y-6">
        <div className="space-y-2">
          <h2 className={`text-xl font-bold ${isEMMEEngage ? 'text-purple-900' : 'text-gray-900'}`}>
            While You Were Away
          </h2>
          <p className={`text-sm ${isEMMEEngage ? 'text-purple-600' : 'text-gray-600'}`}>
            This is what I have been monitoring for you across pharmaceutical intelligence
          </p>
          <Badge variant="outline" className={`${isEMMEEngage ? 'text-purple-600 border-purple-200' : 'text-blue-600 border-blue-200'} w-fit`}>
            Last 24 Hours
          </Badge>
        </div>

        {/* Recent Activities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* HCP Engagement Analysis */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className={`w-10 h-10 ${isEMMEEngage ? 'bg-purple-100' : 'bg-blue-100'} rounded-lg flex items-center justify-center`}>
                  <Users className={`w-5 h-5 ${isEMMEEngage ? 'text-purple-600' : 'text-blue-600'}`} />
                </div>
                <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">Completed</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">HCP Engagement Optimization</h3>
              <p className="text-sm text-gray-600 mb-3">
                Analyzed 2,847 HCP interactions to identify engagement patterns and optimize outreach strategies for oncology specialists.
              </p>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Engagement Rate</span>
                  <span className="font-medium text-green-600">+23%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Response Quality</span>
                  <span className="font-medium text-blue-600">8.7/10</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Market Access Intelligence */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className={`w-10 h-10 ${isEMMEEngage ? 'bg-purple-100' : 'bg-blue-100'} rounded-lg flex items-center justify-center`}>
                  <BarChart3 className={`w-5 h-5 ${isEMMEEngage ? 'text-purple-600' : 'text-blue-600'}`} />
                </div>
                <span className="text-xs text-yellow-600 bg-yellow-100 px-2 py-1 rounded-full">In Progress</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Payer Policy Analysis</h3>
              <p className="text-sm text-gray-600 mb-3">
                Monitoring formulary changes across 450+ health plans and predicting impact on market access for novel therapies.
              </p>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Plans Analyzed</span>
                  <span className="font-medium">387/450</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Risk Alerts</span>
                  <span className="font-medium text-orange-600">12 Active</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Equity & Access Monitoring */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className={`w-10 h-10 ${isEMMEEngage ? 'bg-purple-100' : 'bg-blue-100'} rounded-lg flex items-center justify-center`}>
                  <Heart className={`w-5 h-5 ${isEMMEEngage ? 'text-purple-600' : 'text-blue-600'}`} />
                </div>
                <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded-full">Ongoing</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Health Equity Assessment</h3>
              <p className="text-sm text-gray-600 mb-3">
                Evaluating care access disparities across demographic segments to improve patient journey optimization.
              </p>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Coverage Analysis</span>
                  <span className="font-medium text-purple-600">85% Complete</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Barrier Identification</span>
                  <span className="font-medium">47 Insights</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Competitive Intelligence */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className={`w-10 h-10 ${isEMMEEngage ? 'bg-purple-100' : 'bg-blue-100'} rounded-lg flex items-center justify-center`}>
                  <TrendingUp className={`w-5 h-5 ${isEMMEEngage ? 'text-purple-600' : 'text-blue-600'}`} />
                </div>
                <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">Updated</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Competitive Landscape</h3>
              <p className="text-sm text-gray-600 mb-3">
                Real-time monitoring of competitor activities, pricing changes, and market positioning across therapeutic areas.
              </p>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Competitors Tracked</span>
                  <span className="font-medium">24 Active</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">New Insights</span>
                  <span className="font-medium text-green-600">6 Today</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Regulatory Intelligence */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className={`w-10 h-10 ${isEMMEEngage ? 'bg-purple-100' : 'bg-blue-100'} rounded-lg flex items-center justify-center`}>
                  <Shield className={`w-5 h-5 ${isEMMEEngage ? 'text-purple-600' : 'text-blue-600'}`} />
                </div>
                <span className="text-xs text-red-600 bg-red-100 px-2 py-1 rounded-full">Alert</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">FDA Regulatory Updates</h3>
              <p className="text-sm text-gray-600 mb-3">
                Monitoring FDA guidance documents, safety communications, and approval pathways affecting your pipeline.
              </p>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">New Guidances</span>
                  <span className="font-medium text-red-600">3 This Week</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Impact Assessment</span>
                  <span className="font-medium">High Priority</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Content Performance */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className={`w-10 h-10 ${isEMMEEngage ? 'bg-purple-100' : 'bg-blue-100'} rounded-lg flex items-center justify-center`}>
                  <Activity className={`w-5 h-5 ${isEMMEEngage ? 'text-purple-600' : 'text-blue-600'}`} />
                </div>
                <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">Optimized</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Content Orchestration</h3>
              <p className="text-sm text-gray-600 mb-3">
                Optimized content delivery across channels based on audience engagement patterns and therapeutic focus areas.
              </p>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Engagement Rate</span>
                  <span className="font-medium text-green-600">+31%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Content Pieces</span>
                  <span className="font-medium">148 Active</span>
                </div>
              </div>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
}