import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Bot, Send, User, MessageSquare, Sparkles } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'emme';
  timestamp: Date;
  isTyping?: boolean;
}

export function EMMEHomeChat() {
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      content: "Hi Monica! I'm EMME, your pharmaceutical client management assistant. I help the Mock 5 team oversee customer projects, track launch strategies, monitor KOL engagement across clients, and provide market access insights. What client project can I help you with today?",
      sender: 'emme',
      timestamp: new Date(),
    }
  ]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  // Chat mutation
  const chatMutation = useMutation({
    mutationFn: async (message: string) => {
      return apiRequest('/api/public/emme-question', {
        method: 'POST',
        body: {
          question: message,
          context: `EMME Engage Home Dashboard - Pharmaceutical Marketing Intelligence`,
          agentId: 'emme-engage'
        }
      });
    },
    onSuccess: (response) => {
      // Remove typing indicator
      setChatMessages(prev => prev.filter(msg => !msg.isTyping));
      
      // Create realistic pharmaceutical marketing responses for demo
      let emmeResponse = "I'm here to help with your pharmaceutical marketing needs.";
      
      const message = currentMessage.toLowerCase();
      
      if (message.includes('launch') || message.includes('strategy') || message.includes('plan')) {
        emmeResponse = `**Client Launch Portfolio Overview - Mock 5 Management**

**Active Client Launches (Q4 2024):**

**BioPharma Solutions Inc. - Oncology Asset**
• Status: Month 6 post-launch, exceeding targets by 23%
• Revenue: $47M actual vs. $38M projected (Q4 YTD)
• Coverage: 68% of target payers, UnitedHealth pending
• KOL Engagement: 15 Tier 1 KOLs contracted, high advocacy
• Next Milestone: NCCN Guidelines review (Jan 2025)

**MedTech Innovations - Rare Disease**
• Status: Pre-launch Phase 3 prep, FDA meeting scheduled
• Market: $890M addressable, 4,200 diagnosed patients/year
• Regulatory: PDUFA date March 15, 2025
• Payer Strategy: Early access program with 8 specialty pharmacies
• Challenge: Competitor launching 6 months ahead

**Global Therapeutics - CNS Portfolio**
• Status: Launch planning, commercial team onboarding
• Assets: 2 late-stage programs in depression, anxiety
• Market Access: Value dossiers completed for top 12 payers
• Digital Strategy: HCP portal development 78% complete
• Timeline: Launch window Q2 2025

**Portfolio Metrics (All Clients):**
• Total projected revenue: $340M (FY 2025)
• Average launch success rate: 89% vs industry 67%
• Client retention: 96% (Mock 5 track record)
• Time to market: 14% faster than industry average

Which client project needs immediate attention?`;
      } else if (message.includes('kol') || message.includes('engagement') || message.includes('opinion leader')) {
        emmeResponse = `**Cross-Client KOL Management Dashboard**

**Mock 5 KOL Network (All Therapeutic Areas):**

**Oncology KOL Portfolio**
• **BioPharma Solutions**: 15 Tier 1 KOLs, $180K annual investment
• **Performance**: 78% positive sentiment, 2.3x prescription influence
• **Key KOLs**: Dr. Sarah Chen (Memorial Sloan), Dr. Marcus Rodriguez (MD Anderson)
• **Upcoming**: ASCO symposium planning, 3 KOLs confirmed speakers

**CNS/Psychiatry Network**
• **Global Therapeutics**: 22 KOLs across depression/anxiety
• **Investment**: $145K annual, ROI tracking at 4.2x
• **Digital Strategy**: LinkedIn thought leadership, 12K+ followers
• **Success**: Published 8 peer-reviewed papers featuring client data

**Rare Disease Advocates** 
• **MedTech Innovations**: 8 patient advocacy leaders
• **Approach**: Patient journey focus, caregiver testimonials
• **Platform**: Rare disease conference circuit, patient summits
• **Impact**: 340% increase in patient referrals to clinical sites

**Cross-Portfolio Optimization:**
• **Shared KOLs**: 4 opinion leaders working across multiple clients
• **Cost Efficiency**: 23% savings through portfolio approach
• **Knowledge Transfer**: Best practices shared across therapeutic areas
• **Competitive Intel**: KOL insights on competitor activities

**Q4 Action Items:**
1. Annual KOL summit (Dec 12) - 45 attendees confirmed
2. Publication pipeline: 12 manuscripts in development
3. Digital strategy expansion: TikTok medical education pilot

Which client's KOL strategy needs optimization?`;
      } else if (message.includes('market') || message.includes('access') || message.includes('payer')) {
        emmeResponse = `**Market Access Intelligence Dashboard**

**Payer Landscape Analysis:**
• **Commercial Plans**: 78% of top 20 payers have favorable coverage policies
• **Medicare Advantage**: 65% coverage, working on 4 outstanding plans  
• **Medicaid**: 42% coverage across 28 states, prior authorization requirements vary

**Value Proposition Performance:**
• **Health Economic Model**: $47,000 cost per QALY (well below $100K threshold)
• **Budget Impact**: 0.2% increase in total oncology spend for typical plan
• **Clinical Differentiation**: 3.2 month OS improvement vs. standard of care

**Current Coverage Status:**
✅ **Tier 2 Formulary**: Anthem, Cigna, Humana (68% coverage)
⏳ **Under Review**: UnitedHealth (decision expected Dec 2024)
❌ **Coverage Gaps**: Regional plans in TX, FL require additional evidence

**Upcoming Catalysts:**
• **NCCN Guidelines**: Expected Preferred recommendation Q1 2025
• **ICER Review**: Final evidence report due January 15, 2025  
• **CMS Coverage Decision**: National Coverage Determination filing submitted

**Action Items:**
1. Submit additional RWE to UnitedHealth by Nov 30
2. Prepare payer presentations for ASCO-GU 2025
3. Initiate coverage discussions with 8 regional Medicaid plans

What specific payer challenge can I help you address?`;
      } else if (message.includes('competitive') || message.includes('intelligence') || message.includes('competitor')) {
        emmeResponse = `**Competitive Intelligence Report - Q4 2024**

**Key Competitive Threats:**

**DrugX (Competitor A)**
• Status: Phase 3 completion expected Q1 2025, NDA filing Q3 2025
• Differentiation: Oral formulation vs. our IV administration  
• Market Position: 18 months behind our launch timeline
• Vulnerability: Safety signal in liver function (FDA discussion ongoing)

**TherapyY (Competitor B)**  
• Status: Recently launched, gaining traction in community oncology
• Market Share: 8% in 2L+ NSCLC (up from 3% at launch)
• Pricing: 15% premium to our pricing strategy
• Challenge: Strong payer relationships, faster patient access

**Pipeline Analysis:**
• 12 investigational assets in Phase 2+ development
• 3 biosimilars expected 2026-2027 (patent cliff considerations)
• Novel MOA combinations gaining regulatory interest

**Competitive Response Strategy:**
• **Clinical**: Head-to-head study vs. TherapyY initiated (enrollment: 45%)
• **Market Access**: Value messaging emphasizes superior PFS data
• **Medical Affairs**: KOL education on mechanism of action advantages

**Market Dynamics:**
• Total addressable market: $4.2B globally (2024 estimates)
• Our target share: 22% by Year 3 post-launch
• Competitive intensity: High, with 5 assets launching 2024-2026

**Monitoring Priorities:**
1. Track TherapyY real-world outcomes data
2. Monitor DrugX FDA interactions via public filings
3. Assess biosimilar manufacturer alliance strategies

What competitive scenario would you like me to model?`;
      } else if (message.includes('campaign') || message.includes('hcp') || message.includes('awareness')) {
        emmeResponse = `**HCP Campaign Performance Analytics**

**Current Campaign Status - "Precision in Practice"**

**Digital Engagement Metrics:**
• **Email Performance**: 34% open rate, 8.2% click-through (vs. 28%/6.1% industry avg)
• **Website Traffic**: 12,400 unique HCP visitors/month (+45% vs. Q3)
• **Content Engagement**: Phase 3 data summary downloaded 2,847 times
• **Webinar Series**: Average 340 live attendees, 85% completion rate

**Channel Performance:**
📱 **Mobile/Tablet**: 67% of HCP interactions (up 23% YoY)
💻 **Desktop**: 33% of interactions, highest engagement quality
📧 **Email**: Top performing content type for initial awareness
📺 **Video**: Mechanism of action animation: 78% view completion

**Audience Insights:**
• **Primary Targets**: Medical oncologists (45%), hematologist-oncologists (32%)
• **Practice Setting**: Academic medical centers (38%), large oncology practices (35%)
• **Geographic Focus**: Northeast and West Coast showing highest engagement
• **Specialty Conferences**: ASCO Abstract views: 8,900 unique HCPs

**Campaign Optimization:**
• **A/B Testing**: Patient case studies outperform clinical data presentations (2.3x engagement)
• **Timing**: Tuesday-Thursday emails perform 40% better than Monday/Friday
• **Personalization**: Subspecialty-specific content increases engagement 65%

**Upcoming Initiatives:**
🎯 **November**: Disease state education campaign targeting 1,500 community oncologists
📊 **December**: Interactive dosing calculator launch
🏆 **Q1 2025**: "Excellence in Oncology" award program with KOL partnerships

**ROI Analysis:**
• Campaign investment: $2.4M (Q4 budget)
• Attributed prescriptions: 342 new patient starts
• Cost per acquisition: $7,017 per patient
• Projected lifetime value: $89,000 per patient

Which campaign element would you like to optimize further?`;
      } else {
        // Generic pharmaceutical response
        emmeResponse = `I'm the Mock 5 team's pharmaceutical client management assistant, specialized in:

**Client Portfolio Management**
• Multi-client launch coordination and timeline optimization
• Cross-portfolio resource allocation and budget management
• Client performance tracking and success metrics
• Strategic account management and growth opportunities

**Therapeutic Area Expertise**  
• Oncology, CNS, Rare Disease, and Immunology portfolios
• Regulatory pathway optimization across therapeutic areas
• Market access strategies tailored to each client's needs
• Competitive intelligence across all client sectors

**Operational Excellence**
• KOL network management across multiple clients
• Campaign performance benchmarking and optimization
• Real-world evidence coordination and synthesis
• Cross-functional team coordination for client success

**Market Intelligence**
• Multi-therapeutic area trend analysis and forecasting
• Regulatory landscape monitoring across all client areas
• Payer policy changes affecting client portfolios
• Competitive threat assessment and response planning

I monitor 8 active client relationships, 23 launch programs, and $2.1B in projected revenue. What client project or portfolio challenge can I help you address?`;
      }
      
      const emmeMessage: ChatMessage = {
        id: Date.now().toString(),
        content: emmeResponse,
        sender: 'emme',
        timestamp: new Date(),
      };
      setChatMessages(prev => [...prev, emmeMessage]);
    },
    onError: (error) => {
      // Remove typing indicator
      setChatMessages(prev => prev.filter(msg => !msg.isTyping));
      
      const errorResponse: ChatMessage = {
        id: Date.now().toString(),
        content: "I'm experiencing some technical difficulties. Please try again or contact support if the issue persists.",
        sender: 'emme',
        timestamp: new Date(),
      };
      setChatMessages(prev => [...prev, errorResponse]);
    }
  });

  const handleSendMessage = () => {
    if (currentMessage.trim() && !chatMutation.isPending) {
      // Add user message
      const userMessage: ChatMessage = {
        id: Date.now().toString(),
        content: currentMessage.trim(),
        sender: 'user',
        timestamp: new Date(),
      };
      setChatMessages(prev => [...prev, userMessage]);

      // Add typing indicator
      const typingMessage: ChatMessage = {
        id: `typing-${Date.now()}`,
        content: "EMME is thinking...",
        sender: 'emme',
        timestamp: new Date(),
        isTyping: true
      };
      setChatMessages(prev => [...prev, typingMessage]);

      // Send message to API
      chatMutation.mutate(currentMessage.trim());
      setCurrentMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const quickActions = [
    "Show me client portfolio performance",
    "Which clients need immediate attention?",
    "Cross-client KOL optimization opportunities",
    "Competitive threats across all portfolios"
  ];

  return (
    <Card className="mb-8 bg-gradient-to-r from-purple-50 to-indigo-50 border-purple-200">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            {/* EMME Logo - Dark plum "e" */}
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-900 to-indigo-950 flex items-center justify-center">
              <span className="text-white font-bold text-sm">e</span>
            </div>
            <span className="text-lg font-semibold text-gray-900">Chat with EMME</span>
          </div>
          <Badge variant="outline" className="bg-green-100 text-green-700 border-green-300">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
            Online
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!isExpanded ? (
          // Compact view
          <div className="space-y-4">
            <div className="flex items-start gap-3 p-3 bg-white rounded-lg border">
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-900 to-indigo-950 flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-xs">e</span>
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-700">
                  Hi Monica! I'm here to help with launch strategies, KOL engagement, market access, and all your pharma marketing needs. 
                </p>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button 
                onClick={() => setIsExpanded(true)}
                className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                Start Conversation
              </Button>
              <Button variant="outline" size="sm">
                <Sparkles className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ) : (
          // Expanded chat view
          <div className="space-y-4">
            <ScrollArea className="h-64 w-full pr-4">
              <div className="space-y-3">
                {chatMessages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-3 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    {message.sender === 'emme' && (
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-900 to-indigo-950 flex items-center justify-center flex-shrink-0 mt-1">
                        <span className="text-white font-bold text-xs">e</span>
                      </div>
                    )}
                    <div
                      className={`max-w-[80%] p-3 rounded-lg text-sm ${
                        message.sender === 'user'
                          ? 'bg-blue-600 text-white'
                          : message.isTyping
                          ? 'bg-gray-100 text-gray-600 italic'
                          : 'bg-white text-gray-700 border'
                      }`}
                    >
                      <div className="whitespace-pre-wrap">{message.content}</div>
                    </div>
                    {message.sender === 'user' && (
                      <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0 mt-1">
                        <User className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </ScrollArea>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-2">
              {quickActions.map((action, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  className="text-xs h-8 justify-start"
                  onClick={() => {
                    setCurrentMessage(action);
                    handleSendMessage();
                  }}
                >
                  {action}
                </Button>
              ))}
            </div>

            {/* Input area */}
            <div className="flex gap-2">
              <Input
                value={currentMessage}
                onChange={(e) => setCurrentMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask EMME about pharmaceutical strategies..."
                className="flex-1"
                disabled={chatMutation.isPending}
              />
              <Button 
                onClick={handleSendMessage}
                disabled={!currentMessage.trim() || chatMutation.isPending}
                className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
              >
                {chatMutation.isPending ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </Button>
            </div>

            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setIsExpanded(false)}
              className="w-full"
            >
              Minimize Chat
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}