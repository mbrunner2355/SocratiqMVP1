import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
// import { useAuth } from "@/hooks/useAuth";
import { type User } from "@shared/schema";

// Mock useAuth hook for development
const useAuth = () => ({
  user: { id: '1', email: 'admin@socratiq.com', name: 'SocratIQ Admin', role: 'admin' } as User,
  isLoading: false,
  isAuthenticated: true
});
import { 
  Brain, 
  Settings, 
  MessageCircle,
  FileText,
  Network,
  Shield,
  Building2,
  Users,
  Target,
  Layers,
  GitBranch,
  Zap,
  Bot,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Home,
  LogOut,
  Database,
  Cpu,
  Lock,
  Menu,
  X,
  Search,
  Bell,
  Lightbulb,
  Upload,
  Play,
  Map,
  BarChart3,
  Handshake,
  FolderOpen,
  MessageSquare,
  Activity,
  Eye,
  CheckCircle,
  Clock,
  AlertTriangle,
  Archive
} from "lucide-react";
import { SophieLogo } from "./SophieLogo";
import { SophieIntelligenceDashboard } from "./SophieIntelligenceDashboard";

interface LayoutProps {
  children: React.ReactNode;
}

interface Message {
  id: string;
  type: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const navigationItems = [
  { href: "/home", label: "Dashboard", icon: Home, category: "core" },
  { 
    href: "/ip", 
    label: "IP™", 
    icon: Shield, 
    category: "module",
    submenu: [
      { href: "/ip/fedscout", label: "FedScout™", icon: Zap },
      { href: "/ip", label: "IP Overview", icon: Shield },
      { href: "/ip/overview", label: "IP Intelligence", icon: Shield },
      { href: "/ip/research-hub", label: "Research Hub", icon: Brain },
      { href: "/ip/upload", label: "Upload Documents", icon: Upload },
      { href: "/ip/knowledge-graph", label: "Knowledge Graph", icon: Network },
      { href: "/ip/audit-trail", label: "Audit Trail", icon: Lock },
      { href: "/ip/sophie", label: "Sophie™ AI", icon: SophieLogo },
      { href: "/sophie/brief", label: "Intelligence Brief", icon: Target }
    ]
  },
  { 
    href: "/emme", 
    label: "EMME Connect™", 
    icon: Target, 
    category: "module",
    submenu: [
      { href: "/emme/research-hub", label: "Research Hub", icon: Brain },
      { href: "/emme/competitive-intelligence", label: "Competitive Intelligence", icon: Target },
      { href: "/emme/regulatory-strategy", label: "Regulatory Strategy", icon: Shield },
      { href: "/emme/market-access", label: "Market Access", icon: BarChart3 },
      { href: "/emme/content-library", label: "Content Library", icon: Upload },
      { href: "/emme/partnerships", label: "Client Management", icon: Users },
      { href: "/emme/analytics-dashboard", label: "Analytics Dashboard", icon: BarChart3 },
      { href: "/emme/projects", label: "Projects", icon: FolderOpen },
      { href: "/emme/questions", label: "Questions", icon: MessageSquare },
      { href: "/emme/sophie", label: "Sophie™ AI", icon: SophieLogo }
    ]
  },
  { 
    href: "/engage", 
    label: "EMME Engage™", 
    icon: Handshake, 
    category: "partner",
    submenu: [
      { href: "/engage", label: "Partner Dashboard", icon: Handshake },
      { href: "/mock5-client", label: "mock5 Client Demo", icon: Building2 }
    ]
  },
  { 
    href: "/trials", 
    label: "Trials™", 
    icon: GitBranch, 
    category: "module",
    submenu: [
      { href: "/trials/overview", label: "Trial Intelligence", icon: GitBranch },
      { href: "/trials/research-hub", label: "Research Hub", icon: Brain },
      { href: "/trials/upload-documents", label: "Upload Documents", icon: Upload },
      { href: "/trials/supply-chain", label: "Supply Chain Risk", icon: Network },
      { href: "/trials/audit-trail", label: "Audit Trail", icon: Lock },
      { href: "/trials/sophie", label: "Sophie™ AI", icon: SophieLogo }
    ]
  },
  { 
    href: "/profile", 
    label: "Profile™", 
    icon: Users, 
    category: "module",
    submenu: [
      { href: "/profile/overview", label: "Asset Profiling", icon: Users },
      { href: "/profile/research-hub", label: "Research Hub", icon: Brain },
      { href: "/profile/upload-documents", label: "Upload Documents", icon: Upload },
      { href: "/profile/knowledge-graph", label: "Knowledge Graph", icon: Network },
      { href: "/profile/audit-trail", label: "Audit Trail", icon: Lock },
      { href: "/profile/sophie", label: "Sophie™ AI", icon: SophieLogo }
    ]
  },
  { 
    href: "/build", 
    label: "Build™", 
    icon: Layers, 
    category: "module",
    submenu: [
      { href: "/build/overview", label: "Construction Intelligence", icon: Layers },
      { href: "/build/research-hub", label: "Research Hub", icon: Brain },
      { href: "/build/upload-documents", label: "Upload Documents", icon: Upload },
      { href: "/build/project-network", label: "Project Network", icon: Network },
      { href: "/build/audit-trail", label: "Audit Trail", icon: Lock },
      { href: "/build/sophie", label: "Sophie™ AI", icon: SophieLogo }
    ]
  },
  { href: "/labs", label: "Labs", icon: Building2, category: "module", comingSoon: true },

  { 
    href: "/pipeline", 
    label: "Pipeline", 
    icon: GitBranch, 
    category: "core",
    submenu: [
      { href: "/pipeline", label: "Pipeline Manager", icon: GitBranch },
      { href: "/pipeline/models", label: "Models", icon: Bot },
      { href: "/pipeline/analytics", label: "Analytics", icon: BarChart3 },
      { href: "/pipeline/monitoring", label: "Monitoring", icon: Activity }
    ]
  },
  { 
    href: "/models", 
    label: "Models", 
    icon: Bot, 
    category: "core",
    submenu: [
      { href: "/models/sophie", label: "Sophie Models", icon: Bot },
      { href: "/models/transformers", label: "Transformers", icon: Cpu },
      { href: "/models/llm", label: "LLM Manager", icon: Brain },
      { href: "/models/advanced-nlp", label: "Advanced NLP", icon: Network },
      { href: "/models/bayesian-mc", label: "Bayesian Monte Carlo", icon: Target },
      { href: "/models/multi-paradigm", label: "Multi-Paradigm Reasoning", icon: Brain }
    ]
  },
  { 
    href: "/trust", 
    label: "Trust", 
    icon: Shield, 
    category: "core",
    submenu: [
      { href: "/trust", label: "Trust Manager", icon: Shield },
      { href: "/sophie-impact-lens", label: "Sophie Impact Lens™", icon: Target },
      { href: "/risk-analyzer", label: "Risk Analyzer", icon: AlertTriangle },
      { href: "/trust/monitoring", label: "Trust Monitoring", icon: Eye },
      { href: "/trust/validation", label: "Validation", icon: CheckCircle },
      { href: "/trust/reports", label: "Trust Reports", icon: BarChart3 }
    ]
  },
  { 
    href: "/agents", 
    label: "Agents", 
    icon: Users, 
    category: "core",
    submenu: [
      { href: "/agents", label: "Agent Manager", icon: Users },
      { href: "/agents/orchestration", label: "Orchestration", icon: Network },
      { href: "/agents/monitoring", label: "Monitoring", icon: Activity },
      { href: "/agents/analytics", label: "Analytics", icon: BarChart3 }
    ]
  },
  { 
    href: "/agentic-rag", 
    label: "Agentic RAG", 
    icon: Bot, 
    category: "core",
    submenu: [
      { href: "/agentic-rag", label: "RAG Manager", icon: Bot },
      { href: "/agentic-rag/temporal", label: "Temporal Agents", icon: Clock },
      { href: "/agentic-rag/context", label: "Context Protocol", icon: Network },
      { href: "/agentic-rag/agora", label: "Agora Platform", icon: Users }
    ]
  },
  { 
    href: "/graphs", 
    label: "Knowledge Graphs", 
    icon: Network, 
    category: "core",
    submenu: [
      { href: "/graphs", label: "Graph Explorer", icon: Network },
      { href: "/graphs/visualization", label: "Visualization", icon: Eye },
      { href: "/graphs/analytics", label: "Analytics", icon: BarChart3 },
      { href: "/graphs/temporal", label: "Temporal Layers", icon: Clock }
    ]
  },
  { 
    href: "/gnn", 
    label: "Graph Neural Networks", 
    icon: Brain, 
    category: "core",
    submenu: [
      { href: "/gnn", label: "GNN Manager", icon: Brain },
      { href: "/gnn/training", label: "Training", icon: Play },
      { href: "/gnn/inference", label: "Inference", icon: Target },
      { href: "/gnn/monitoring", label: "Monitoring", icon: Activity }
    ]
  },
  { 
    href: "/trace", 
    label: "Trace™", 
    icon: Lock, 
    category: "core",
    submenu: [
      { href: "/trace", label: "Audit Manager", icon: Lock },
      { href: "/trace/events", label: "Event Log", icon: Activity },
      { href: "/trace/compliance", label: "Compliance", icon: Shield },
      { href: "/trace/analytics", label: "Analytics", icon: BarChart3 }
    ]
  },
];

const adminItems = [
  { href: "/admin/corpus", label: "Corpus Manager", icon: Database, category: "admin" },
  { href: "/admin/pipeline", label: "Pipeline Manager", icon: GitBranch, category: "admin" },
  { href: "/admin/sophie-models", label: "Sophie Models", icon: Cpu, category: "admin" },
  { href: "/admin/sophie-trust", label: "Sophie Trust", icon: Bot, category: "admin" },
  { href: "/admin/partner-apps", label: "Partner Applications", icon: Settings, category: "admin" },
];

// Mock user permissions - in real app, this would come from API
const userModules = {
  core: ["home", "corpus", "pipeline", "models", "trust", "agents", "transformers", "agentic-rag", "graphs", "gnn", "trace"],
  modules: ["ip", "emme", "trials", "profile", "build"] // User only has access to these
};

// Check if user is an admin (in real app, this would come from API/auth system)
const isAdmin = (user: User | null): boolean => {
  if (!user) return false;
  // For now, check if email contains 'admin' or is from company domain
  const adminEmails = ['admin@socratiq.com', 'vinnyc2306@gmail.com']; // Add admin emails here
  return adminEmails.includes(user.email || '') || 
         (user.email || '').endsWith('@socratiq.com');
};

const dailyInspiration = [
  "You may not always see the seeds take root—but every action you take plants something enduring. Trust that the forest is growing, even if right now you can only see the soil.",
  "Innovation isn't about having all the answers; it's about asking better questions and being brave enough to explore the unknown paths ahead.",
  "Every breakthrough in science began with someone willing to challenge what everyone else accepted as impossible. Your curiosity is your greatest asset.",
  "The molecules you work with today could be tomorrow's miracle. Never underestimate the power of persistent discovery.",
  "In biopharmaceutical development, patience and precision dance together. Each careful step forward is progress, even when the destination feels distant.",
  "Your research doesn't just change compounds—it changes lives. Remember that behind every data point is hope for someone's future.",
  "The best discoveries often come from the intersection of preparation and unexpected opportunity. Stay ready for those moments of insight.",
  "Science is the art of turning impossible into inevitable, one hypothesis at a time. Your work is part of that magnificent transformation.",
  "Every failed experiment teaches us something valuable. In research, there are no true failures—only data that guides us toward success.",
  "The complexity of biology is not an obstacle—it's an invitation to think more creatively and discover solutions no one has imagined yet.",
  "Your dedication to rigorous science today builds the foundation for breakthrough therapies tomorrow. Every detail matters.",
  "In the lab and beyond, courage isn't the absence of uncertainty—it's moving forward with purpose despite the unknowns.",
  "The most profound impacts often come from the quietest work. Your daily efforts ripple outward in ways you may never fully see.",
  "Excellence in research isn't about being perfect; it's about being consistently thoughtful, curious, and committed to growth.",
  "Behind every successful drug lies thousands of small decisions made with care. Your attention to detail is shaping the future of medicine.",
  "Innovation thrives when we combine scientific rigor with creative thinking. Don't be afraid to approach old problems with fresh perspectives.",
  "The path from bench to bedside is long, but every step you take with integrity and passion brings healing closer to those who need it.",
  "Your work bridges the gap between what is and what could be. That bridge is built one careful experiment at a time.",
  "In biopharmaceutical research, we don't just develop drugs—we develop hope. Your contributions matter more than you might realize.",
  "The best scientists are perpetual students, always learning, always questioning. Your willingness to grow is your greatest strength.",
  "Collaboration amplifies innovation. The connections you build today may become the partnerships that change tomorrow's therapeutic landscape.",
  "Precision in method leads to clarity in results. Your methodical approach today prevents confusion and accelerates progress tomorrow.",
  "Every challenge in drug development is an opportunity to innovate. What seems impossible today becomes routine through dedicated effort.",
  "Your research is a conversation with nature, asking questions through experimentation and listening carefully to the answers.",
  "The intersection of technology and biology offers endless possibilities. Your work helps us read and rewrite the language of life itself.",
];

function getDailyInspiration(): string {
  const today = new Date();
  const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
  return dailyInspiration[dayOfYear % dailyInspiration.length];
}

export default function Layout({ children }: LayoutProps) {
  const [location] = useLocation();
  const { user } = useAuth() as { user: User | null; isLoading: boolean; isAuthenticated: boolean; };
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [sophieExpanded, setSophieExpanded] = useState(true);
  const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>({ '/emme': true });
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());
  const todaysInspiration = getDailyInspiration();
  
  const toggleMenu = (menuKey: string) => {
    setExpandedMenus(prev => ({
      ...prev,
      [menuKey]: !prev[menuKey]
    }));
  };

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    setExpandedSections(newExpanded);
  };
  
  // Detect if we're in EMME Connect
  const isInEMMEConnect = location.startsWith('/emme');
  const currentAgent = isInEMMEConnect ? 'EMME' : 'Sophie™';
  const agentDescription = isInEMMEConnect ? 'Pharmaceutical Intelligence' : 'AI Colleague';
  
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "assistant",
      content: isInEMMEConnect 
        ? `Welcome to EMME Connect™! I'm EMME, your pharmaceutical intelligence agent specializing in market analysis, competitive intelligence, regulatory strategy, and commercial insights. I can help you navigate pharmaceutical research, analyze clinical data, and develop go-to-market strategies. What pharmaceutical intelligence do you need?`
        : `Hi there! Where do you want to start today? I'm Sophie™, your AI biopharmaceutical colleague. I work alongside you and my team of specialized agents to navigate the complexities of biopharmaceutical development. Whether you need strategic insights, risk assessment, or regulatory guidance, we'll collaborate to provide intelligent analysis and accelerate your journey from lab to market.`,
      timestamp: new Date(),
    }
  ]);
  const [inputMessage, setInputMessage] = useState("");

  // Update the initial message when agent changes - avoid infinite loop
  useEffect(() => {
    setMessages([
      {
        id: "1",
        type: "assistant",
        content: isInEMMEConnect 
          ? `Welcome to EMME Connect™! I'm EMME, your pharmaceutical intelligence agent specializing in market analysis, competitive intelligence, regulatory strategy, and commercial insights. I can help you navigate pharmaceutical research, analyze clinical data, and develop go-to-market strategies. What pharmaceutical intelligence do you need?`
          : `Hi there! Where do you want to start today? I'm Sophie™, your AI biopharmaceutical colleague. I work alongside you and my team of specialized agents to navigate the complexities of biopharmaceutical development. Whether you need strategic insights, risk assessment, or regulatory guidance, we'll collaborate to provide intelligent analysis and accelerate your journey from lab to market.`,
        timestamp: new Date(),
      }
    ]);
  }, [isInEMMEConnect]);

  const handleLogout = () => {
    window.location.href = "/api/logout";
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: inputMessage,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    const currentMessage = inputMessage;
    setInputMessage("");

    try {
      const apiEndpoint = isInEMMEConnect ? "/api/emme/chat" : "/api/sophie/chat";
      const response = await fetch(apiEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: currentMessage }),
      });

      if (response.ok) {
        const data = await response.json();
        const assistantMessage: Message = {
          id: data.id,
          type: "assistant",
          content: data.content,
          timestamp: new Date(data.timestamp),
        };
        setMessages(prev => [...prev, assistantMessage]);
      } else {
        // Fallback response if API fails
        const fallbackContent = isInEMMEConnect 
          ? "EMME is temporarily unavailable. Please try again in a moment."
          : "I'm temporarily unavailable. Please try again in a moment.";
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          type: "assistant",
          content: fallbackContent,
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, assistantMessage]);
      }
    } catch (error) {
      console.error(`${currentAgent} chat error:`, error);
      // Fallback response
      const fallbackContent = isInEMMEConnect 
        ? "EMME is having trouble connecting right now. Please try again."
        : "I'm having trouble connecting right now. Please try again.";
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "assistant",
        content: fallbackContent,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, assistantMessage]);
    }
  };

  return (
    <div className="app-container bg-gradient-to-br from-blue-50 via-white to-indigo-50 relative overflow-hidden">
      {/* Molecular Background Pattern */}
      <div className="absolute inset-0 opacity-60 pointer-events-none">
        {/* Floating molecular nodes */}
        <div className="absolute top-20 left-16 w-6 h-6 bg-blue-400 rounded-full animate-pulse"></div>
        <div className="absolute top-32 right-24 w-4 h-4 bg-indigo-400 rounded-full animate-bounce" style={{animationDelay: '1.5s'}}></div>
        <div className="absolute bottom-40 left-32 w-7 h-7 bg-cyan-300 rounded-full animate-pulse" style={{animationDelay: '2.5s'}}></div>
        <div className="absolute top-1/2 right-16 w-5 h-5 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.8s'}}></div>
        <div className="absolute bottom-32 right-1/3 w-6 h-6 bg-indigo-300 rounded-full animate-pulse" style={{animationDelay: '1.8s'}}></div>
        <div className="absolute top-1/4 left-1/4 w-3 h-3 bg-cyan-400 rounded-full animate-bounce" style={{animationDelay: '3s'}}></div>
        
        {/* Organic molecular connections */}
        <svg className="absolute inset-0 w-full h-full" style={{zIndex: -1}}>
          <defs>
            <pattern id="molecular-grid-dashboard" width="80" height="80" patternUnits="userSpaceOnUse">
              <circle cx="40" cy="40" r="1.5" fill="rgb(99 102 241 / 0.25)" />
              <circle cx="20" cy="20" r="1" fill="rgb(6 182 212 / 0.2)" />
              <circle cx="60" cy="20" r="0.8" fill="rgb(59 130 246 / 0.15)" />
              <circle cx="20" cy="60" r="1.2" fill="rgb(6 182 212 / 0.18)" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#molecular-grid-dashboard)" />
          
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



      <div className="flex-1 flex relative h-full">
        {/* Collapsible Sidebar */}
        <div className={`${isSidebarOpen ? 'w-64' : 'w-0'} bg-white border-r border-gray-200 flex flex-col transition-all duration-300 overflow-hidden fixed lg:relative z-20 h-full max-h-screen`}>
        {/* Sidebar Header with Toggle */}
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-6 h-6 rounded bg-gradient-to-br from-blue-600 to-teal-600 flex items-center justify-center">
              <Brain className="text-white w-3 h-3" />
            </div>
            <span className="text-lg font-bold">
              <span className="text-blue-900">Socrat</span><span className="text-cyan-500">IQ</span><span className="text-gray-700">™</span>
            </span>
          </div>
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-1.5 hover:bg-gray-100 rounded-md transition-colors"
          >
            <Menu className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation */}
        <ScrollArea className="flex-1">
          <nav className="p-4 space-y-4">
            {/* Core Platform */}
            <div>
              <Button
                variant="ghost"
                className="w-full justify-between p-2 h-auto text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 hover:bg-gray-50"
                onClick={() => toggleSection('core')}
              >
                Platform Core
                {expandedSections.has('core') ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              </Button>
              {expandedSections.has('core') && (
                <div className="space-y-1">
                {navigationItems.filter(item => item.category === "core").map((item) => {
                  const Icon = item.icon;
                  const isActive = location === item.href || (item.submenu && item.submenu.some(sub => location === sub.href));
                  const hasAccess = item.href === "/" || userModules.core.some(module => item.href.includes(module));
                  const hasSubmenu = item.submenu && item.submenu.length > 0;
                  const isExpanded = expandedMenus[item.href];
                  
                  return (
                    <div key={item.href} className="relative">
                      {hasSubmenu ? (
                        <>
                          <Button
                            variant={isActive ? "default" : "ghost"}
                            className={`w-full justify-start ${
                              isActive 
                                ? "bg-primary text-primary-foreground" 
                                : hasAccess 
                                  ? "text-gray-700 hover:bg-gray-100" 
                                  : "text-gray-400 cursor-not-allowed hover:bg-transparent"
                            }`}
                            disabled={!hasAccess}
                            onClick={() => toggleMenu(item.href)}
                          >
                            <Icon className="w-4 h-4 mr-3" />
                            {item.label}
                            {isExpanded ? <ChevronUp className="w-4 h-4 ml-auto" /> : <ChevronDown className="w-4 h-4 ml-auto" />}
                          </Button>
                          {isExpanded && (
                            <div className="ml-4 mt-1 space-y-1 border-l border-gray-200 pl-2">
                              {item.submenu.map((subItem) => {
                                const SubIcon = subItem.icon;
                                const isSubActive = location === subItem.href;
                                
                                return (
                                  <Link key={subItem.href} href={hasAccess ? subItem.href : "#"}>
                                    <Button
                                      variant={isSubActive ? "default" : "ghost"}
                                      size="sm"
                                      className={`w-full justify-start text-xs ${
                                        isSubActive 
                                          ? "bg-primary text-primary-foreground" 
                                          : hasAccess 
                                            ? "text-gray-600 hover:bg-gray-50" 
                                            : "text-gray-400 cursor-not-allowed hover:bg-transparent"
                                      }`}
                                      disabled={!hasAccess}
                                    >
                                      <SubIcon className="w-3 h-3 mr-2" />
                                      {subItem.label}
                                    </Button>
                                  </Link>
                                );
                              })}
                            </div>
                          )}
                        </>
                      ) : (
                        <Link href={hasAccess ? item.href : "#"}>
                          <Button
                            variant={isActive ? "default" : "ghost"}
                            className={`w-full justify-start ${
                              isActive 
                                ? "bg-primary text-primary-foreground" 
                                : hasAccess 
                                  ? "text-gray-700 hover:bg-gray-100" 
                                  : "text-gray-400 cursor-not-allowed hover:bg-transparent"
                            }`}
                            disabled={!hasAccess}
                          >
                            <Icon className="w-4 h-4 mr-3" />
                            {item.label}
                          </Button>
                        </Link>
                      )}
                    </div>
                  );
                })}
                </div>
              )}
            </div>

            {/* Specialized Modules */}
            <div>
              <Button
                variant="ghost"
                className="w-full justify-between p-2 h-auto text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 hover:bg-gray-50"
                onClick={() => toggleSection('modules')}
              >
                Specialized Modules
                {expandedSections.has('modules') ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              </Button>
              {expandedSections.has('modules') && (
                <div className="space-y-1">
                {navigationItems.filter(item => item.category === "module").map((item) => {
                  const Icon = item.icon;
                  const isActive = location === item.href || (item.submenu && item.submenu.some(sub => location === sub.href));
                  const hasAccess = userModules.modules.some(module => item.href.includes(module));
                  const hasSubmenu = item.submenu && item.submenu.length > 0;
                  const isExpanded = expandedMenus[item.href];
                  
                  return (
                    <div key={item.href} className="relative">
                      {hasSubmenu ? (
                        <>
                          <Button
                            variant={isActive ? "default" : "ghost"}
                            className={`w-full justify-start ${
                              isActive 
                                ? "bg-primary text-primary-foreground" 
                                : hasAccess 
                                  ? "text-gray-700 hover:bg-gray-100" 
                                  : "text-gray-400 cursor-not-allowed hover:bg-transparent"
                            }`}
                            disabled={!hasAccess || item.comingSoon}
                            onClick={() => setExpandedMenus(prev => ({ ...prev, [item.href]: !prev[item.href] }))}
                          >
                            <Icon className="w-4 h-4 mr-3" />
                            {item.label}
                            {item.comingSoon && <Badge variant="secondary" className="ml-2 text-xs">Soon</Badge>}
                            {hasSubmenu && (
                              <div className="ml-auto">
                                {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                              </div>
                            )}
                          </Button>
                          {isExpanded && item.submenu && (
                            <div className="ml-4 mt-1 space-y-1 border-l border-gray-200 pl-2">
                              {item.submenu.map((subItem) => {
                                const SubIcon = subItem.icon;
                                const isSubActive = location === subItem.href;
                                return (
                                  <Link key={subItem.href} href={subItem.href}>
                                    <Button
                                      variant={isSubActive ? "default" : "ghost"}
                                      size="sm"
                                      className={`w-full justify-start text-xs ${
                                        isSubActive 
                                          ? "bg-primary text-primary-foreground" 
                                          : "text-gray-600 hover:bg-gray-100"
                                      }`}
                                    >
                                      <SubIcon className="w-3 h-3 mr-2" />
                                      {subItem.label}
                                    </Button>
                                  </Link>
                                );
                              })}
                            </div>
                          )}
                        </>
                      ) : (
                        <Link href={hasAccess ? item.href : "#"}>
                          <Button
                            variant={isActive ? "default" : "ghost"}
                            className={`w-full justify-start ${
                              isActive 
                                ? "bg-primary text-primary-foreground" 
                                : hasAccess 
                                  ? "text-gray-700 hover:bg-gray-100" 
                                  : "text-gray-400 cursor-not-allowed hover:bg-transparent"
                            }`}
                            disabled={!hasAccess || item.comingSoon}
                          >
                            <Icon className="w-4 h-4 mr-3" />
                            {item.label}
                            {item.comingSoon && <Badge variant="secondary" className="ml-2 text-xs">Soon</Badge>}
                          </Button>
                        </Link>
                      )}
                      {!hasAccess && (
                        <div className="absolute inset-0 flex items-center justify-end pr-2 pointer-events-none">
                          <Badge variant="outline" className="text-xs opacity-60">License Required</Badge>
                        </div>
                      )}
                    </div>
                  );
                })}
                </div>
              )}
            </div>

            {/* Partner Solutions */}
            <div>
              <Button
                variant="ghost"
                className="w-full justify-between p-2 h-auto text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 hover:bg-gray-50"
                onClick={() => toggleSection('partner')}
              >
                Partner Solutions
                {expandedSections.has('partner') ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              </Button>
              {expandedSections.has('partner') && (
                <div className="space-y-1">
                {navigationItems.filter(item => item.category === "partner").map((item) => {
                  const Icon = item.icon;
                  const isActive = location === item.href || (item.submenu && item.submenu.some(sub => location === sub.href));
                  const hasAccess = true; // Partner solutions are always accessible for demo
                  const hasSubmenu = item.submenu && item.submenu.length > 0;
                  const isExpanded = expandedMenus[item.href];
                  
                  return (
                    <div key={item.href} className="relative">
                      {hasSubmenu ? (
                        <>
                          <Button
                            variant={isActive ? "default" : "ghost"}
                            className={`w-full justify-start ${
                              isActive 
                                ? "bg-primary text-primary-foreground" 
                                : hasAccess 
                                  ? "text-gray-700 hover:bg-gray-100" 
                                  : "text-gray-400 cursor-not-allowed hover:bg-transparent"
                            }`}
                            onClick={() => toggleMenu(item.href)}
                            disabled={!hasAccess}
                          >
                            <Icon className="w-4 h-4 mr-3" />
                            {item.label}
                            {isExpanded ? <ChevronUp className="w-4 h-4 ml-auto" /> : <ChevronDown className="w-4 h-4 ml-auto" />}
                          </Button>
                          {isExpanded && (
                            <div className="ml-4 mt-1 space-y-1">
                              {item.submenu.map((subItem) => {
                                const SubIcon = subItem.icon;
                                const isSubActive = location === subItem.href;
                                
                                return (
                                  <Link key={subItem.href} href={hasAccess ? subItem.href : "#"}>
                                    <Button
                                      variant={isSubActive ? "default" : "ghost"}
                                      size="sm"
                                      className={`w-full justify-start ${
                                        isSubActive 
                                          ? "bg-primary text-primary-foreground" 
                                          : hasAccess 
                                            ? "text-gray-600 hover:bg-gray-50" 
                                            : "text-gray-400 cursor-not-allowed hover:bg-transparent"
                                      }`}
                                      disabled={!hasAccess}
                                    >
                                      <SubIcon className="w-3 h-3 mr-3" />
                                      {subItem.label}
                                    </Button>
                                  </Link>
                                );
                              })}
                            </div>
                          )}
                        </>
                      ) : (
                        <Link href={hasAccess ? item.href : "#"}>
                          <Button
                            variant={isActive ? "default" : "ghost"}
                            className={`w-full justify-start ${
                              isActive 
                                ? "bg-primary text-primary-foreground" 
                                : hasAccess 
                                  ? "text-gray-700 hover:bg-gray-100" 
                                  : "text-gray-400 cursor-not-allowed hover:bg-transparent"
                            }`}
                            disabled={!hasAccess}
                          >
                            <Icon className="w-4 h-4 mr-3" />
                            {item.label}
                          </Button>
                        </Link>
                      )}
                    </div>
                  );
                })}
                </div>
              )}
            </div>



          </nav>
        </ScrollArea>



        {/* User Profile */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <span className="text-white text-sm font-medium">
                {(user as User)?.firstName?.[0] || (user as User)?.email?.[0] || 'U'}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {(user as User)?.firstName} {(user as User)?.lastName}
              </p>
              <p className="text-xs text-gray-600 truncate">{(user as User)?.email}</p>
            </div>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" className="flex-1">
              <Settings className="w-3 h-3 mr-1" />
              Settings
            </Button>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="w-3 h-3" />
            </Button>
          </div>
        </div>
        </div>

        {/* Main Content Area */}
        {/* Mobile overlay */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-10 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
        
        {/* Main Content Area */}
        <div className={`flex-1 flex transition-all duration-300 ${isSidebarOpen ? 'lg:ml-0' : 'ml-0'}`}>
          {/* Check if we're on a route that should show the chat interface */}
          {location === '/' || location === '/sophie' || location === '/emme' || location.endsWith('/sophie') ? (
            /* Integrated Chat with Original Design */
            <div className="flex-1 overflow-y-auto overflow-x-hidden">
              <div className="min-h-full flex items-start justify-center py-8">
                <div className="w-full max-w-4xl px-6 relative z-10">
                <Card className="border-0 shadow-none bg-transparent">
                  <CardContent className="text-center space-y-8 p-8">
                    {/* Sophie Chat Bubble Icon */}
                    <div className="flex justify-center">
                      {isInEMMEConnect ? (
                        <div className="w-16 h-18 rounded-full flex items-center justify-center bg-gradient-to-br from-purple-500 to-blue-500 shadow-lg">
                          <Target className="text-white w-8 h-8" />
                        </div>
                      ) : (
                        <div className="relative">
                          {/* Chat bubble main body */}
                          <div className="w-16 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center shadow-lg">
                            <span className="text-white text-2xl font-bold font-serif">S</span>
                          </div>
                          {/* Chat bubble tail */}
                          <div className="absolute top-10 left-6 w-0 h-0 border-l-4 border-r-4 border-t-6 border-l-transparent border-r-transparent border-t-blue-700"></div>
                        </div>
                      )}
                    </div>

                    {/* Welcome Message */}
                    <div className="space-y-4">
                      <h1 className="text-3xl font-bold text-navy-900">
                        Good morning! Let's make some magic today!
                      </h1>
                      
                      {/* Inspirational Quote */}
                      <div className="border-l-4 border-primary/30 pl-6 py-4 bg-slate-50/50 rounded-r-lg">
                        <p className="text-gray-700 italic leading-relaxed">
                          "{todaysInspiration}"
                        </p>
                      </div>
                    </div>

                    {/* Chat Interface */}
                    <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-8 w-full">
                      {/* Agent Status */}
                      <div className="flex items-center justify-center space-x-2 mb-4">
                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                        <span className="text-sm font-medium text-gray-700">{currentAgent} is online & ready</span>
                      </div>

                      {/* Chat Messages */}
                      <ScrollArea className="h-64 mb-4">
                        <div className="space-y-4 pr-4">
                          {messages.map((message) => (
                            <div key={message.id} className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}>
                              <div
                                className={`max-w-[95%] p-4 rounded-lg ${
                                  message.type === "user"
                                    ? "bg-primary text-primary-foreground"
                                    : "bg-gray-100 text-gray-900"
                                }`}
                              >
                                <p className="text-sm leading-relaxed">{message.content}</p>
                                <p className="text-xs mt-2 opacity-70">
                                  {message.timestamp.toLocaleTimeString()}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </ScrollArea>

                      {/* Message Input */}
                      <div className="flex space-x-3">
                        <input
                          type="text"
                          value={inputMessage}
                          onChange={(e) => setInputMessage(e.target.value)}
                          onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                          placeholder={`Ask ${currentAgent} anything...`}
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                        <Button onClick={handleSendMessage} size="sm">
                          <MessageCircle className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Sophie Intelligence Dashboard - Working While You Were Away */}
                    <div className="pt-4">
                      <SophieIntelligenceDashboard />
                    </div>
                  </CardContent>
                </Card>
                </div>
              </div>
            </div>
          ) : (
            /* Regular Page Content */
            <div className="flex-1 overflow-y-auto overflow-x-hidden h-full">
              <div className="min-h-full">
                {children}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}