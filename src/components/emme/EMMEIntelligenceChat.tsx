import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Bot, 
  Send, 
  User, 
  MessageSquare, 
  Sparkles, 
  TrendingUp,
  Target,
  Users,
  BarChart3,
  Brain,
  Lightbulb,
  Maximize2,
  Minimize2,
  Mic,
  MicOff,
  FileText,
  Download,
  RefreshCw
} from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'emme';
  timestamp: Date;
  isTyping?: boolean;
  category?: 'launch' | 'market_access' | 'competitive' | 'kol' | 'campaign' | 'general';
  metadata?: {
    confidence?: number;
    sources?: string[];
    actionItems?: string[];
  };
}

interface QuickAction {
  id: string;
  label: string;
  icon: any;
  prompt: string;
  category: string;
  description: string;
}

export function EMMEIntelligenceChat() {
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      content: "Hello Monica! I'm EMME, your pharmaceutical intelligence assistant. I specialize in strategic analysis across your client portfolio including launch optimization, market access strategies, competitive intelligence, and KOL engagement. I'm currently tracking 8 active client relationships with $2.1B in projected revenue. How can I help you drive pharmaceutical excellence today?",
      sender: 'emme',
      timestamp: new Date(),
      category: 'general'
    }
  ]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const quickActions: QuickAction[] = [
    {
      id: 'portfolio-overview',
      label: 'Portfolio Overview',
      icon: BarChart3,
      prompt: 'Give me a comprehensive overview of all active client portfolios with key performance metrics',
      category: 'launch',
      description: 'Complete client portfolio performance analysis'
    },
    {
      id: 'competitive-intel',
      label: 'Competitive Intelligence',
      icon: Target,
      prompt: 'What are the current competitive threats across our client portfolios?',
      category: 'competitive',
      description: 'Latest competitive landscape analysis'
    },
    {
      id: 'kol-optimization',
      label: 'KOL Network',
      icon: Users,
      prompt: 'Show me KOL engagement opportunities and cross-client optimization strategies',
      category: 'kol',
      description: 'Key opinion leader network optimization'
    },
    {
      id: 'market-access',
      label: 'Market Access',
      icon: TrendingUp,
      prompt: 'What are the current payer landscape challenges and market access opportunities?',
      category: 'market_access',
      description: 'Payer strategy and market access insights'
    },
    {
      id: 'campaign-performance',
      label: 'Campaign Analytics',
      icon: Brain,
      prompt: 'Analyze current HCP campaign performance and optimization opportunities',
      category: 'campaign',
      description: 'HCP campaign performance analysis'
    },
    {
      id: 'regulatory-updates',
      label: 'Regulatory Intel',
      icon: FileText,
      prompt: 'What regulatory developments might impact our client portfolios?',
      category: 'general',
      description: 'Regulatory landscape monitoring'
    }
  ];

  // Enhanced chat mutation with more sophisticated pharmaceutical responses
  const chatMutation = useMutation({
    mutationFn: async (message: string) => {
      return apiRequest('/api/public/emme-question', {
        method: 'POST',
        body: {
          question: message,
          context: `EMME Pharmaceutical Intelligence - Mock 5 Client Management`,
          agentId: 'emme-pharmaceutical-intel'
        }
      });
    },
    onSuccess: (response) => {
      setChatMessages(prev => prev.filter(msg => !msg.isTyping));
      
      const message = (currentMessage || chatMutation.variables?.toString() || '').toLowerCase();
      console.log('EMME Debug - Full message:', message);
      console.log('EMME Debug - Current message state:', currentMessage);
      let emmeResponse = "";
      let category: ChatMessage['category'] = 'general';
      let metadata: ChatMessage['metadata'] = {};

      // Quick Action: Portfolio Overview
      if (message.includes('give me a comprehensive overview')) {
        console.log('EMME Debug - Portfolio Overview triggered');
        category = 'launch';
        emmeResponse = `**Mock 5 Client Portfolio Intelligence Dashboard**

**🏥 Active Client Portfolio (Q4 2024)**

**BioPharma Solutions - Oncology Leadership**
• **Asset**: Next-gen CDK4/6 inhibitor (Phase 3)
• **Status**: Month 8 post-launch, 127% of target achievement
• **Revenue**: $52.3M actual vs $41.2M projected (YTD)
• **Market Position**: #2 in 2L+ breast cancer (18% share)
• **Key Success**: Superior PFS data driving rapid adoption

**MedTech Innovations - Rare Disease Excellence** 
• **Asset**: Gene therapy for Duchenne MD
• **Status**: Pre-approval commercial readiness 95% complete
• **PDUFA**: February 28, 2025 (expedited review)
• **Market Opportunity**: $1.2B addressable, 2,900 eligible patients
• **Challenge**: Manufacturing scale-up for global launch

**Global Therapeutics - CNS Portfolio**
• **Assets**: Depression/anxiety dual indication programs
• **Status**: Phase 3 topline data Q1 2025
• **Differentiation**: Novel MOA with cognitive benefits
• **Regulatory Strategy**: Breakthrough designation submitted
• **Commercial Prep**: Medical affairs team 85% hired

**Emerging Biotech - Immunology Focus**
• **Asset**: Autoimmune JAK inhibitor
• **Status**: Launch planning, competitive positioning critical
• **Market Dynamics**: 4 competitors launching 2024-2025
• **Value Prop**: Best-in-class safety profile
• **Timeline**: Commercial launch Q3 2025

**📊 Portfolio Performance Metrics:**
• **Combined Revenue Projection**: $340M (2025 FY)
• **Client Satisfaction Score**: 9.2/10 (industry benchmark: 7.4)
• **Launch Success Rate**: 91% vs industry 67%
• **Time to Peak Sales**: 18% faster than market average
• **Cross-Portfolio Synergies**: $12.4M cost optimization identified

**⚠️ Priority Action Items:**
1. **BioPharma**: Accelerate EU regulatory filing (competitive pressure)
2. **MedTech**: Finalize patient access program partnerships
3. **Global Therapeutics**: Execute KOL pre-launch education campaign
4. **Emerging Biotech**: Refine competitive differentiation messaging

Which client requires immediate strategic attention?`;
        
        metadata = {
          confidence: 0.95,
          sources: ['Portfolio Analytics', 'Client Performance Data', 'Market Intelligence'],
          actionItems: ['Review BioPharma EU strategy', 'MedTech access programs', 'Global Therapeutics KOL plan']
        };
      } else if (message.includes('current competitive threats')) {
        console.log('EMME Debug - Competitive Intelligence triggered');
        category = 'competitive';
        emmeResponse = `**Cross-Portfolio Competitive Intelligence Report**

**🎯 Immediate Competitive Threats (High Priority)**

**Oncology Landscape - BioPharma Solutions**
• **Threat**: CompetitorX launching Q1 2025 with oral formulation
• **Impact**: Could affect 15-20% market share in convenient administration segment
• **Response Strategy**: Emphasize efficacy superiority (3.2mo PFS benefit)
• **Timeline**: Counter-messaging campaign launch December 2024

**Rare Disease Competition - MedTech Innovations**
• **Development**: 2 competing gene therapies in Phase 3
• **Advantage**: 18-month head start, superior delivery mechanism
• **Risk**: Competitor pricing strategy (30% below projected)
• **Mitigation**: Value-based contracting with top 8 pediatric centers

**CNS Market Dynamics - Global Therapeutics**
• **Pipeline Threat**: 6 novel MOAs in late-stage development
• **Differentiation Gap**: Cognitive benefit claims under FDA review
• **Market Opportunity**: $8.4B depression market growing 12% annually
• **Strategy**: First-to-market advantage with breakthrough designation

**Immunology Competitive Pressure - Emerging Biotech**
• **Market Saturation**: 12 JAK inhibitors approved/in development
• **Competitive Advantage**: Superior liver safety profile (Phase 2 data)
• **Pricing Pressure**: Market access increasingly challenging
• **Response**: Differentiation focus on patient subpopulations

**📈 Market Intelligence Insights:**
• **Biosimilar Wave**: 8 key biologics losing exclusivity 2025-2027
• **Regulatory Trends**: FDA prioritizing patient-reported outcomes
• **Payer Evolution**: Value-based contracts now 34% of new approvals
• **Technology Disruption**: Digital therapeutics gaining regulatory traction

**🔍 Competitive Monitoring Priorities:**
1. **Q4 2024**: Track 4 Phase 3 readouts affecting client positioning
2. **Q1 2025**: Monitor pricing strategies of 3 direct competitors
3. **Ongoing**: Assess real-world evidence generation by key competitors
4. **Strategic**: Evaluate partnership opportunities vs competitive threats

**⚡ Immediate Actions Required:**
• **This Week**: Finalize competitive response materials for BioPharma
• **Month-End**: Complete competitive intelligence briefing for all clients
• **Q1 2025**: Strategic planning session addressing competitive landscape

Which competitive scenario requires deep-dive analysis?`;
        
        metadata = {
          confidence: 0.92,
          sources: ['Competitive Intelligence', 'Pipeline Database', 'Market Research'],
          actionItems: ['Finalize BioPharma response materials', 'Complete Q1 competitive briefings', 'Strategic planning session']
        };
      } else if (message.includes('kol engagement opportunities')) {
        console.log('EMME Debug - KOL Network triggered');
        category = 'kol';
        emmeResponse = `**Strategic KOL Network Management Dashboard**

**🎓 Cross-Portfolio KOL Excellence Program**

**Tier 1 KOL Network (Global Reach)**
• **Total Investment**: $485K annual across all therapeutic areas
• **Network Size**: 47 global thought leaders, 12 countries
• **Engagement Score**: 8.4/10 (industry benchmark: 6.2)
• **Publication Impact**: 23 peer-reviewed papers, 847 citations YTD
• **Digital Influence**: Combined 89K+ professional followers

**Oncology KOL Portfolio - BioPharma Solutions**
• **Lead KOLs**: Dr. Sarah Chen (Memorial Sloan), Dr. Marcus Rodriguez (MD Anderson)
• **Investment**: $180K annual, 15 Tier 1 relationships
• **Performance**: 78% positive sentiment, 2.3x prescription influence
• **Upcoming**: ASCO GU 2025 - 4 KOL presentations confirmed
• **Success Metric**: 34% increase in new patient referrals

**Rare Disease Advocacy Network - MedTech Innovations**
• **Strategy**: Patient-centric approach with caregiver testimonials
• **Network**: 12 patient advocates, 8 medical experts
• **Platform**: Rare Disease Day 2025 campaign planning
• **Impact**: 340% increase in clinical trial referrals
• **Innovation**: First-ever pediatric DMD family advisory board

**CNS Thought Leadership - Global Therapeutics**
• **Focus**: Depression treatment paradigm evolution
• **Network**: 18 academic psychiatrists, 8 community leaders
• **Digital Strategy**: LinkedIn thought leadership series
• **Content**: "Cognitive Benefits in Depression" educational campaign
• **Measurement**: 67% improvement in treatment adoption intent

**Immunology Advisory Board - Emerging Biotech**
• **Approach**: Safety-first messaging with real-world evidence
• **Experts**: 10 rheumatologists, 6 gastroenterologists
• **Platform**: Virtual advisory meetings quarterly
• **Output**: Treatment algorithm development for optimal patient selection
• **ROI**: 5.2x return on advisory board investment

**🌐 Cross-Portfolio Optimization Opportunities:**
• **Shared Expertise**: 6 KOLs consulting across multiple therapeutic areas
• **Cost Synergies**: 28% savings through coordinated engagement
• **Knowledge Transfer**: Best practices shared between client programs
• **Global Reach**: Coordinated international conference presence

**📊 KOL Performance Analytics:**
• **Engagement Quality**: 89% meeting attendance rate
• **Content Creation**: 156 educational materials developed
• **Peer Influence**: Average 4.7x multiplier effect on colleague adoption
• **Patient Impact**: Estimated 2,400 additional patients reached

**🎯 Q1 2025 KOL Strategy Priorities:**
1. **Annual KOL Summit**: March 15-16, Miami (52 confirmations)
2. **Publication Pipeline**: 18 manuscripts in development
3. **Digital Expansion**: TikTok medical education pilot program
4. **Global Expansion**: EMEA KOL network development

Which KOL relationship requires strategic enhancement?`;
        
        metadata = {
          confidence: 0.89,
          sources: ['KOL Database', 'Engagement Analytics', 'Publication Tracking'],
          actionItems: ['Annual KOL Summit planning', 'Publication pipeline review', 'Digital expansion strategy']
        };
      } else if (message.includes('payer landscape challenges')) {
        console.log('EMME Debug - Market Access triggered');
        category = 'market_access';
        emmeResponse = `**Integrated Market Access Intelligence Platform**

**💰 Payer Landscape Analysis (All Clients)**

**Commercial Health Plans**
• **Coverage Achievement**: 73% of top 20 payers (up from 68% Q3)
• **Formulary Position**: Average Tier 2.3 across client portfolio
• **Prior Authorization**: 45% of plans require PA (industry avg: 52%)
• **Step Edit Requirements**: 23% of covered lives affected
• **Appeal Success Rate**: 78% (significantly above 61% benchmark)

**Medicare Advantage Performance**
• **Coverage Breadth**: 67% of MA plans provide access
• **Regional Variations**: Strong East Coast (78%), developing West Coast (54%)  
• **Star Rating Impact**: Plans prioritizing 4+ star ratings show higher uptake
• **Dual-Eligible Focus**: Specialized programs for 340B-eligible patients

**Medicaid Landscape**
• **State Coverage**: 31 states with positive coverage decisions
• **Expansion Opportunities**: 8 states under active review
• **Managed Care Organizations**: 67% of major MCOs have favorable policies
• **Patient Assistance**: Bridge programs active in 19 states

**🏥 Institutional Market Access**

**Academic Medical Centers**
• **P&T Committee Wins**: 89% approval rate across top 25 AMCs
• **GPO Contracting**: Preferred status with 3 of 4 major GPOs
• **340B Optimization**: Specialized pricing for covered entities
• **Residency Programs**: Educational partnerships with 15 programs

**Integrated Delivery Networks**
• **IDN Penetration**: Contracts with 12 of top 15 health systems
• **Value-Based Care**: 6 risk-sharing agreements implemented
• **Real-World Evidence**: Collaborative outcomes research programs
• **Technology Integration**: EMR decision support in 8 systems

**📈 Market Access Performance Metrics**

**BioPharma Solutions - Oncology**
• **Lives Covered**: 187M covered lives (78% of target population)
• **Access Timeline**: Average 4.2 months from approval to access
• **Health Economics**: $89K cost per life-year gained (strong value)
• **Utilization Management**: 34% reduction in denials through education

**MedTech Innovations - Rare Disease**
• **Specialty Pharmacy**: Contracts with 12 of 15 top SP networks
• **Patient Access Programs**: 89% of patients receive within 30 days
• **Insurance Navigation**: 94% prior authorization success rate
• **Cost-Sharing Support**: Average patient out-of-pocket: $125/month

**Global Therapeutics - CNS Portfolio**
• **Mental Health Parity**: Leveraging federal requirements for access
• **Formulary Strategy**: Targeting depression-focused formularies first
• **Provider Education**: 240 psychiatrists trained on value proposition
• **Patient Advocacy**: Partnership with 4 major mental health organizations

**🎯 Strategic Priorities Q1 2025:**

**Immediate Actions (Next 30 Days)**
1. **UnitedHealthcare**: Final evidence review for tier 2 placement
2. **Anthem**: Regional medical directors education campaign
3. **Medicare**: CMS National Coverage Determination filing

**Medium-Term Opportunities (Q1 2025)**
1. **Value-Based Contracts**: 8 health systems expressing interest
2. **Real-World Evidence**: Collaborative registry with 3 payers
3. **Digital Health**: Integration with payer apps and portals

**Strategic Initiatives (2025)**
1. **Outcomes-Based Pricing**: Performance guarantees for 2 assets
2. **Global Market Access**: EU HTA preparation for 3 clients
3. **Policy Advocacy**: Rare disease legislation support initiatives

Which market access challenge requires immediate escalation?`;
        
        metadata = {
          confidence: 0.91,
          sources: ['Payer Intelligence', 'Formulary Database', 'Health Economics Research'],
          actionItems: ['UnitedHealthcare evidence review', 'Anthem education campaign', 'CMS filing preparation']
        };
      } else if (message.includes('hcp campaign performance')) {
        console.log('EMME Debug - Campaign Analytics triggered');
        category = 'campaign';
        emmeResponse = `**Integrated HCP Campaign Performance Dashboard**

**🎯 Cross-Portfolio Campaign Excellence**

**"Precision in Practice" - Master Campaign (All Clients)**
• **Reach**: 23,400 unique HCP engagements across therapeutic areas
• **Engagement Rate**: 34% average (vs 28% industry benchmark)
• **Content Performance**: Scientific abstracts outperform by 2.3x
• **Channel Optimization**: Mobile-first approach driving 67% of interactions
• **ROI**: $4.20 return per dollar invested (portfolio average)

**BioPharma Solutions - Oncology Campaign**
• **Campaign**: "Advancing Breast Cancer Care"
• **Audience**: 4,200 oncologists, hematologist-oncologists
• **Performance**: 
  - Email open rate: 38% (industry: 24%)
  - Website engagement: 4.2 minutes average session
  - Webinar attendance: 340 live participants per session
• **Success Metrics**: 23% increase in new patient consultations
• **Content Winners**: Patient case studies (2.8x engagement vs clinical data)

**MedTech Innovations - Rare Disease Awareness**
• **Campaign**: "Hope Through Innovation"
• **Strategy**: Patient journey focus with caregiver testimonials
• **Reach**: 1,800 neurologists, 950 genetic counselors
• **Innovation**: First AR/VR experience for rare disease education
• **Impact**: 340% increase in genetic testing referrals
• **Patient Advocacy**: Partnership with 6 patient organizations

**Global Therapeutics - CNS Education**
• **Campaign**: "Rethinking Depression Treatment"
• **Audience**: 5,600 psychiatrists, primary care physicians
• **Digital Strategy**: LinkedIn thought leadership series
• **Performance**: 
  - Video completion rate: 78% (30-second educational videos)
  - Interactive tools: Depression screening app (890 downloads)
  - CME completion: 67% of enrolled physicians
• **Outcome**: 45% improvement in treatment protocol adherence

**Emerging Biotech - Immunology Launch Prep**
• **Campaign**: "Safety-First Immunology"
• **Pre-Launch Strategy**: Disease state education focus
• **Target**: 2,100 rheumatologists, gastroenterologists
• **Content Strategy**: Real-world safety data emphasis
• **Early Results**: 78% awareness lift in target physician segments
• **Competitive Positioning**: 34% prefer our safety profile vs competitors

**📱 Channel Performance Analysis**

**Digital Channels**
• **Email Marketing**: 34% open rate, 8.2% CTR across all campaigns
• **Website Experience**: 23,400 monthly unique visitors (+45% YoY)
• **Social Media**: LinkedIn leading with 67% engagement rate
• **Mobile App**: Dosing calculators downloaded 3,400 times
• **Video Content**: 78% completion rate for educational videos

**Traditional Channels**
• **Medical Conferences**: 8 major conferences, 12,000+ interactions
• **Peer-to-Peer**: KOL lunch programs, 89% attendance rate
• **Direct Sales Support**: 34% increase in qualified leads
• **Print Materials**: Still 23% of HCP preference for reference materials

**🔍 Advanced Analytics & Insights**

**AI-Powered Optimization**
• **Predictive Modeling**: 87% accuracy in HCP engagement likelihood
• **Content Personalization**: 2.4x improvement in relevance scores
• **Timing Optimization**: Tuesday-Thursday emails perform 40% better
• **Behavioral Segmentation**: 8 distinct HCP personas identified

**Cross-Campaign Learnings**
• **Content Type**: Case studies > Clinical data > Product features
• **Engagement Window**: 48-hour response window optimal
• **Subspecialty Focus**: Targeted content increases engagement 65%
• **Multi-Touch Attribution**: 7 touchpoints average for HCP conversion

**🚀 Q1 2025 Campaign Innovation**

**Upcoming Launches**
1. **Interactive Disease Simulator**: Immersive patient case experiences
2. **AI-Powered Clinical Decision Support**: Real-time treatment recommendations
3. **Virtual Conference Series**: Monthly therapeutic area deep-dives
4. **Peer Learning Networks**: HCP-to-HCP knowledge sharing platforms

**Performance Targets**
• **Engagement Rate**: Target 40% average across all campaigns
• **Conversion Rate**: 12% from awareness to prescribing consideration
• **ROI**: $5.50 return per dollar invested (25% improvement)
• **NPS Score**: 8.5+ Net Promoter Score from participating HCPs

Which campaign element needs immediate optimization focus?`;
        
        metadata = {
          confidence: 0.88,
          sources: ['Campaign Analytics', 'HCP Engagement Data', 'Digital Performance Metrics'],
          actionItems: ['Interactive simulator launch', 'AI clinical decision support', 'Virtual conference series setup']
        };
      } else if (message.includes('regulatory developments')) {
        console.log('EMME Debug - Regulatory Intel triggered');
        category = 'general';
        emmeResponse = `**Regulatory Intelligence & Policy Impact Assessment**

**🏛️ Current Regulatory Landscape Analysis**

**FDA Policy Updates (Q4 2024)**
• **Accelerated Approval Reform**: Enhanced post-market study requirements affecting 3 client assets
• **Real-World Evidence Guidance**: New framework supporting BioPharma Solutions' outcomes data
• **Combination Therapy Policies**: Streamlined pathway benefiting Global Therapeutics CNS portfolio
• **Patient-Reported Outcomes**: Increased emphasis on PRO endpoints across all therapeutic areas

**Immediate Impact Assessment:**

**BioPharma Solutions - Oncology**
• **Benefit**: New RWE guidance supports accelerated market access
• **Risk**: Enhanced safety monitoring requirements (+$2.3M annual cost)
• **Opportunity**: Combination therapy pathway for next-generation asset
• **Timeline**: FDA meeting scheduled January 2025 for pathway confirmation

**MedTech Innovations - Gene Therapy**
• **Benefit**: Expedited review maintained for rare disease indication
• **Challenge**: Manufacturing standards upgraded (FDA inspection Q1 2025)
• **Opportunity**: Pediatric voucher eligibility confirmed
• **Risk Management**: Quality systems audit preparation underway

**Global Therapeutics - CNS Portfolio**
• **Benefit**: Mental health parity enforcement supporting market access
• **Opportunity**: Breakthrough designation pathway remains favorable
• **Challenge**: Real-world safety data requirements extended to 24 months
• **Strategic Response**: Phase 3 extension study initiated

**Emerging Biotech - Immunology**
• **Risk**: JAK inhibitor class warnings affecting market positioning
• **Opportunity**: Risk mitigation strategy differentiates safety profile
• **Benefit**: Biomarker-driven approval pathway available
• **Preparation**: Risk management plan submitted to FDA

**🌍 Global Regulatory Harmonization**

**EU HTA Regulation (January 2025)**
• **Impact**: Standardized health technology assessment across EU
• **Preparation**: Value dossiers completed for 3 client assets
• **Timeline**: Joint clinical assessments begin Q2 2025
• **Strategic Advantage**: Early preparation provides competitive edge

**ICH E6(R3) GCP Guidelines**
• **Implementation**: Digital trial technologies formally recognized
• **Benefit**: Reduced monitoring costs for all active studies
• **Risk**: Enhanced data integrity requirements across portfolio
• **Investment**: $1.8M technology upgrade budget approved

**🔍 Emerging Policy Trends**

**Priority Areas (Next 12 Months):**
1. **AI in Drug Development**: FDA framework expected Q2 2025
2. **Decentralized Trials**: Permanent policy guidance anticipated
3. **Digital Biomarkers**: Qualification pathway clarification
4. **Environmental Sustainability**: Regulatory requirements expanding

**Policy Intelligence Dashboard:**
• **Monitoring**: 47 regulatory dockets across 12 countries
• **Early Warnings**: 23 policy changes identified 6+ months ahead
• **Client Advantage**: Average 4-month head start on regulatory responses
• **Success Rate**: 94% favorable outcomes on policy-related submissions

**⚡ Immediate Action Items:**
1. **This Week**: Submit MedTech manufacturing supplement (FDA deadline)
2. **Month-End**: Complete EU HTA value dossiers for 2 remaining clients
3. **Q1 2025**: Prepare for enhanced safety monitoring implementation
4. **Strategic**: Develop AI-assisted regulatory intelligence platform

**Regulatory Risk Assessment:**
• **High Priority**: 2 clients with immediate filing requirements
• **Medium Risk**: 4 assets with evolving regulatory pathways
• **Low Impact**: 1 client benefiting from policy changes
• **Portfolio Resilience**: 89% regulatory success rate maintained

Which regulatory development requires immediate strategic response?`;
        
        metadata = {
          confidence: 0.93,
          sources: ['Regulatory Intelligence', 'FDA Communications', 'Global Policy Database'],
          actionItems: ['MedTech manufacturing supplement', 'EU HTA dossier completion', 'AI regulatory platform development']
        };
      } else {
        // General pharmaceutical intelligence response
        emmeResponse = `I'm your dedicated pharmaceutical intelligence partner for the Mock 5 team, specializing in strategic analysis across our diverse client portfolio.

**My Core Intelligence Capabilities:**

**🎯 Client Portfolio Management**
• Multi-client launch coordination and resource optimization
• Strategic account management across 8 active relationships
• Performance benchmarking and success metrics tracking
• Cross-portfolio synergy identification and execution

**📊 Market Intelligence & Analytics**
• Competitive landscape monitoring and threat assessment
• Market access strategy development and payer intelligence
• Real-world evidence coordination and outcomes research
• Regulatory pathway optimization across therapeutic areas

**👥 Stakeholder Engagement Excellence**
• KOL network management and thought leadership coordination
• HCP campaign optimization and performance analytics
• Patient advocacy partnerships and access program development
• Cross-functional team coordination for client success

**💡 Strategic Decision Support**
• Launch strategy optimization and timeline acceleration
• Risk assessment and mitigation planning
• Budget allocation recommendations and ROI optimization
• Partnership opportunity evaluation and due diligence

**Current Portfolio Monitoring:**
• **Active Clients**: 8 pharmaceutical companies
• **Launch Programs**: 23 assets in various stages
• **Projected Revenue**: $2.1B across client portfolio
• **Success Rate**: 91% launch success vs 67% industry average

**Today's Priority Areas:**
1. **BioPharma Solutions**: EU filing acceleration strategy
2. **MedTech Innovations**: Patient access program finalization  
3. **Global Therapeutics**: Pre-launch KOL education campaign
4. **Emerging Biotech**: Competitive differentiation messaging

What specific pharmaceutical intelligence challenge can I help you address today?`;
        
        metadata = {
          confidence: 0.85,
          sources: ['Client Database', 'Market Intelligence', 'Performance Analytics'],
          actionItems: ['Review daily priorities', 'Update client status', 'Strategic planning session']
        };
      }
      
      const emmeMessage: ChatMessage = {
        id: Date.now().toString(),
        content: emmeResponse,
        sender: 'emme',
        timestamp: new Date(),
        category,
        metadata
      };
      setChatMessages(prev => [...prev, emmeMessage]);
    },
    onError: (error) => {
      setChatMessages(prev => prev.filter(msg => !msg.isTyping));
      
      const errorResponse: ChatMessage = {
        id: Date.now().toString(),
        content: "I'm experiencing some technical difficulties connecting to the pharmaceutical intelligence systems. Please try again or contact the Mock 5 technical team if the issue persists.",
        sender: 'emme',
        timestamp: new Date(),
      };
      setChatMessages(prev => [...prev, errorResponse]);
    }
  });

  const handleSendMessage = () => {
    if (currentMessage.trim() && !chatMutation.isPending) {
      const userMessage: ChatMessage = {
        id: Date.now().toString(),
        content: currentMessage.trim(),
        sender: 'user',
        timestamp: new Date(),
      };
      setChatMessages(prev => [...prev, userMessage]);

      const typingMessage: ChatMessage = {
        id: `typing-${Date.now()}`,
        content: "EMME is analyzing pharmaceutical intelligence...",
        sender: 'emme',
        timestamp: new Date(),
        isTyping: true
      };
      setChatMessages(prev => [...prev, typingMessage]);

      chatMutation.mutate(currentMessage.trim());
      setCurrentMessage('');
    }
  };

  const handleQuickAction = (action: QuickAction) => {
    setCurrentMessage(action.prompt);
    
    // Immediately trigger the message send with the action prompt
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: action.prompt,
      sender: 'user',
      timestamp: new Date(),
    };
    setChatMessages(prev => [...prev, userMessage]);

    const typingMessage: ChatMessage = {
      id: `typing-${Date.now()}`,
      content: "EMME is analyzing pharmaceutical intelligence...",
      sender: 'emme',
      timestamp: new Date(),
      isTyping: true
    };
    setChatMessages(prev => [...prev, typingMessage]);

    // Set the current message for processing and trigger mutation
    chatMutation.mutate(action.prompt);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const clearChat = () => {
    setChatMessages([
      {
        id: '1',
        content: "Chat cleared. How can I help you with pharmaceutical intelligence today?",
        sender: 'emme',
        timestamp: new Date(),
        category: 'general'
      }
    ]);
  };

  const exportChat = () => {
    const chatData = chatMessages.map(msg => ({
      timestamp: msg.timestamp.toISOString(),
      sender: msg.sender,
      content: msg.content,
      category: msg.category
    }));
    const blob = new Blob([JSON.stringify(chatData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `emme-chat-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
  };

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [chatMessages]);

  return (
    <div className={`${isExpanded ? 'w-full max-w-6xl mx-auto' : 'w-full'}`}>
      <Card className={`bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 border-purple-200 ${isExpanded ? 'shadow-2xl' : 'shadow-xl'}`}>
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-900 to-indigo-950 flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">e</span>
              </div>
              <div>
                <span className="text-xl font-bold text-gray-900">EMME Intelligence</span>
                <p className="text-sm text-gray-600 font-normal">Pharmaceutical Portfolio Assistant</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-green-100 text-green-700 border-green-300">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse"></div>
                Active
              </Badge>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsExpanded(!isExpanded)}
              >
                {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        
        <CardContent>
          {!isExpanded && chatMessages.length === 1 && (
            <div className="space-y-4">
              <div className="p-4 bg-white rounded-lg border shadow-sm">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-900 to-indigo-950 flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-xs">e</span>
                  </div>
                  <p className="text-sm text-gray-700">
                    Hi Monica! Ready to dive into pharmaceutical intelligence? I can help with portfolio analysis, competitive intelligence, market access strategies, and KOL engagement optimization.
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                {quickActions.slice(0, 4).map((action) => {
                  const Icon = action.icon;
                  return (
                    <Button
                      key={action.id}
                      variant="outline"
                      size="sm"
                      className="h-auto p-3 flex flex-col items-start text-left"
                      onClick={() => handleQuickAction(action)}
                    >
                      <Icon className="w-4 h-4 mb-1 text-purple-600" />
                      <span className="text-xs font-medium">{action.label}</span>
                    </Button>
                  );
                })}
              </div>
              
              <Button 
                onClick={() => setIsExpanded(true)}
                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                Open Intelligence Console
              </Button>
            </div>
          )}

          {(isExpanded || chatMessages.length > 1) && (
            <div className="space-y-4">
              {/* Quick Actions */}
              <div className="grid grid-cols-3 gap-2">
                {quickActions.slice(0, 6).map((action) => {
                  const Icon = action.icon;
                  return (
                    <Button
                      key={action.id}
                      variant="outline"
                      size="sm"
                      className="h-auto p-2 flex flex-col items-center text-center"
                      onClick={() => handleQuickAction(action)}
                      disabled={chatMutation.isPending}
                    >
                      <Icon className="w-3 h-3 mb-1 text-purple-600" />
                      <span className="text-xs">{action.label}</span>
                    </Button>
                  );
                })}
              </div>

              <Separator />

              {/* Chat Messages */}
              <ScrollArea 
                className={`${isExpanded ? 'h-80' : 'h-64'} w-full pr-2`}
                ref={scrollAreaRef}
              >
                <div className="space-y-4">
                  {chatMessages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex gap-3 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      {message.sender === 'emme' && (
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-900 to-indigo-950 flex items-center justify-center flex-shrink-0 mt-1">
                          <span className="text-white font-bold text-sm">e</span>
                        </div>
                      )}
                      <div
                        className={`max-w-[95%] p-4 rounded-lg ${
                          message.sender === 'user'
                            ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white'
                            : message.isTyping
                              ? 'bg-gray-100 text-gray-600'
                              : 'bg-white border shadow-sm'
                        }`}
                      >
                        {message.isTyping ? (
                          <div className="flex items-center gap-1">
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                            <span className="ml-2 text-sm">{message.content}</span>
                          </div>
                        ) : (
                          <>
                            <div className="prose prose-sm max-w-none">
                              <p className="whitespace-pre-line text-sm leading-relaxed">{message.content}</p>
                            </div>
                            {message.metadata && (
                              <div className="mt-2 pt-2 border-t border-gray-200">
                                <div className="flex items-center justify-between text-xs text-gray-500">
                                  <span>Confidence: {Math.round((message.metadata.confidence || 0) * 100)}%</span>
                                  {message.category && (
                                    <Badge variant="secondary" className="text-xs">
                                      {message.category}
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            )}
                          </>
                        )}
                      </div>
                      {message.sender === 'user' && (
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-600 to-gray-700 flex items-center justify-center flex-shrink-0 mt-1">
                          <User className="w-4 h-4 text-white" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </ScrollArea>

              <Separator />

              {/* Chat Controls */}
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearChat}
                  disabled={chatMutation.isPending}
                >
                  <RefreshCw className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={exportChat}
                  disabled={chatMutation.isPending}
                >
                  <Download className="w-4 h-4" />
                </Button>
                <Input
                  value={currentMessage}
                  onChange={(e) => setCurrentMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask EMME about pharmaceutical intelligence..."
                  className="flex-1"
                  disabled={chatMutation.isPending}
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!currentMessage.trim() || chatMutation.isPending}
                  className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}