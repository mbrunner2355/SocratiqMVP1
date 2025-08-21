import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  Search, 
  MessageSquare, 
  Send,
  Building2,
  Star,
  Eye,
  TrendingUp,
  Database,
  Target,
  Zap,
  Globe,
  Shield,
  FileText,
  Calendar,
  DollarSign,
  Users,
  BarChart3,
  Clock,
  CheckCircle,
  AlertTriangle,
  ExternalLink
} from "lucide-react";
import { SophieLogo } from "./SophieLogo";

interface Message {
  id: string;
  type: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface TechnologyCard {
  id: string;
  title: string;
  agency: string;
  patentNumber: string;
  commercializationScore: number;
  developmentStage: string;
  licensingType: string;
  fitToProject: number;
  overview: string;
  keyBenefits: string[];
  contactInfo?: string;
}

export function FedScoutDashboard() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "assistant",
      content: "Hello! I've analyzed federal lab technologies that could complement your project. Would you like to see my findings?",
      timestamp: new Date(Date.now() - 5 * 60 * 1000)
    },
    {
      id: "2",
      type: "user", 
      content: "Yes, please show me the technologies relevant to our biologics development project.",
      timestamp: new Date(Date.now() - 4 * 60 * 1000)
    },
    {
      id: "3",
      type: "assistant",
      content: "I've identified several promising technologies from federal labs for biologics development. The NIH formulation stabilization technology uses a novel excipient matrix that extends shelf-life by 40-45% across varying temperature conditions, reducing cold chain requirements and improving stability.",
      timestamp: new Date(Date.now() - 3 * 60 * 1000)
    },
    {
      id: "4",
      type: "user",
      content: "Can you provide more details on the NIH stability enhancement technology?",
      timestamp: new Date(Date.now() - 2 * 60 * 1000)
    },
    {
      id: "5",
      type: "assistant",
      content: "The NIH formulation stabilization technology (Patent US10982357 + NIH Technology Transfer Office) uses a novel excipient matrix for biologics that extends shelf-life by 40-45% across varying temperature conditions, reducing cold chain requirements and improving stability. It's been validated in phase 1 studies for monoclonal antibodies and could significantly reduce cold chain requirements for your product. I've added more details to the Fed Scout dashboard. Would you like me to explain any specific technology in more detail?",
      timestamp: new Date(Date.now() - 1 * 60 * 1000)
    }
  ]);
  
  const [inputMessage, setInputMessage] = useState("");
  const queryClient = useQueryClient();

  // Mock data matching the screenshot
  const technologies: TechnologyCard[] = [
    {
      id: "tech_001",
      title: "NIH Formulation Stabilization Technology",
      agency: "NIH",
      patentNumber: "Patent US10982357",
      commercializationScore: 8.2,
      developmentStage: "Clinical (Phase 1 completed)",
      licensingType: "Non-exclusive available",
      fitToProject: 85,
      overview: "Novel excipient matrix for biologics that extends shelf-life by 40-45% across varying temperature conditions, reducing cold chain requirements and improving stability.",
      keyBenefits: [
        "Stability issues in current formulation",
        "Cold chain requirements increase costs",
        "Analytical method reproducibility issues"
      ],
      contactInfo: "NIH Technology Transfer Office"
    },
    {
      id: "tech_002", 
      title: "NIST Analytical Quality Control System",
      agency: "NIST",
      patentNumber: "Patent US11674762",
      commercializationScore: 7.8,
      developmentStage: "Prototype validated",
      licensingType: "Exclusive available",
      fitToProject: 72,
      overview: "Advanced analytical platform for biologics manufacturing that reduces batch-to-batch variability by 78% and improves analytical method reproducibility across sites.",
      keyBenefits: [
        "Reduced batch-to-batch variability",
        "Improved analytical method reproducibility",
        "Enhanced quality control"
      ],
      contactInfo: "NIST Technology Partnerships Office"
    },
    {
      id: "tech_003",
      title: "DoD Novel Targeting Technology", 
      agency: "DoD",
      patentNumber: "Patent US10577962",
      commercializationScore: 6.9,
      developmentStage: "Research phase",
      licensingType: "Non-exclusive available",
      fitToProject: 65,
      overview: "Bispecific antibody platform with enhanced tissue penetration capabilities and reduced systemic toxicity, particularly effective for solid tumors.",
      keyBenefits: [
        "Enhanced tissue penetration",
        "Reduced systemic toxicity", 
        "Solid tumor targeting"
      ],
      contactInfo: "Defense Transfer Partnerships Office"
    }
  ];

  const projectSummary = {
    name: "BioLogic-427",
    description: "Novel bispecific antibody for solid tumors",
    currentPhase: "Pre-IND",
    keyChallenges: [
      "Stability issues in current formulation",
      "Cold chain requirements increase costs", 
      "Analytical method reproducibility issues"
    ],
    technologyMatched: "NIH Formulation Stabilization",
    matchedBenefits: [
      "Addresses stability & cold chain issues",
      "FDA-validated technology",
      "Time Saved: 12-18 months"
    ]
  };

  const relatedProjects = [
    "Supply Chain Risk Analysis",
    "COVID Performance Monitoring", 
    "Regulatory Submission Planning"
  ];

  // Interactive FedScout chat mutation
  const chatMutation = useMutation({
    mutationFn: async (message: string) => {
      const response = await apiRequest('POST', '/api/fedscout/chat', {
        message,
        context: 'federal_technology_scout'
      });
      return await response.json();
    },
    onSuccess: (data: any) => {
      const sophieResponse: Message = {
        id: Date.now().toString(),
        type: "assistant",
        content: data.reply || data.response || 'I found some relevant federal technologies. Let me analyze the patent database and technology transfer opportunities for your project.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, sophieResponse]);
    },
    onError: (error) => {
      console.error('FedScout chat error:', error);
      const errorResponse: Message = {
        id: Date.now().toString(),
        type: "assistant",
        content: 'I apologize, but I encountered an issue accessing the federal technology database. Let me provide you with some general guidance based on the current technologies I have identified.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorResponse]);
    }
  });

  const handleSendMessage = () => {
    if (!inputMessage.trim() || chatMutation.isPending) return;

    const newUserMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newUserMessage]);
    const messageToSend = inputMessage;
    setInputMessage("");

    // Call the FedScout chat API
    chatMutation.mutate(messageToSend);
  };

  const getScoreColor = (score: number) => {
    if (score >= 8) return "text-green-600 bg-green-50 border-green-200";
    if (score >= 7) return "text-blue-600 bg-blue-50 border-blue-200";
    return "text-orange-600 bg-orange-50 border-orange-200";
  };

  const getFitColor = (fit: number) => {
    if (fit >= 80) return "bg-green-500";
    if (fit >= 60) return "bg-blue-500";
    return "bg-orange-500";
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] gap-4 p-4">
      {/* Main Content Area */}
      <div className="flex-1 space-y-4 overflow-auto">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Federal Technology Scout</h1>
            <p className="text-muted-foreground text-sm">
              Identifying promising technologies from federal labs for biologic development
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button size="sm">
              <FileText className="h-4 w-4 mr-2" />
              Generate Comprehensive Report
            </Button>
          </div>
        </div>

        {/* Technology Cards */}
        <div className="space-y-4">
          {technologies.map((tech, index) => (
            <Card key={tech.id} className="border-l-4 border-l-blue-500">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Shield className="h-4 w-4 text-blue-600" />
                      <span className="text-sm font-medium text-blue-600">{tech.agency}</span>
                    </div>
                    <CardTitle className="text-lg">{tech.title}</CardTitle>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                      <span>{tech.patentNumber}</span>
                      <span>•</span>
                      <span>{tech.agency} Technology Transfer Office</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`inline-flex items-center px-2 py-1 rounded-md text-sm font-medium border ${getScoreColor(tech.commercializationScore)}`}>
                      Commercialization Score {tech.commercializationScore}/10
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Technology Overview */}
                <div>
                  <h4 className="font-medium mb-2">Technology Overview</h4>
                  <p className="text-sm text-muted-foreground">{tech.overview}</p>
                </div>

                {/* Status Row */}
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <div className="text-xs text-muted-foreground">Development Stage</div>
                    <div className="text-sm font-medium">{tech.developmentStage}</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Licensing Type</div>
                    <div className="text-sm font-medium">{tech.licensingType}</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Fit to Your Project</div>
                    <div className="flex items-center gap-2">
                      <Progress value={tech.fitToProject} className="flex-1 h-2" />
                      <span className="text-sm font-medium">{tech.fitToProject}%</span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-between pt-2 border-t">
                  <Button variant="outline" size="sm">
                    View Full Details
                  </Button>
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Contact TTO
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Right Sidebar - Project Summary and Sophie Chat */}
      <div className="w-80 space-y-4">
        {/* Project Summary */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Project Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <div className="font-medium text-sm">Project: {projectSummary.name}</div>
              <div className="text-xs text-muted-foreground">{projectSummary.description}</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Current Phase</div>
              <Badge variant="outline" className="text-xs">{projectSummary.currentPhase}</Badge>
            </div>
            
            <div>
              <div className="text-xs text-muted-foreground mb-1">Key Challenges</div>
              <ul className="text-xs text-muted-foreground space-y-1">
                {projectSummary.keyChallenges.map((challenge, i) => (
                  <li key={i} className="flex items-start gap-1">
                    <span>•</span>
                    <span>{challenge}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <div className="text-xs text-muted-foreground mb-1">Technology Matched</div>
              <div className="text-sm font-medium text-green-700">● {projectSummary.technologyMatched}</div>
              <ul className="text-xs text-muted-foreground mt-1 space-y-1">
                {projectSummary.matchedBenefits.map((benefit, i) => (
                  <li key={i} className="flex items-start gap-1">
                    <span>•</span>
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <div className="text-xs text-muted-foreground mb-1">Financial Impact</div>
              <div className="space-y-1">
                <div className="text-xs">Licensing Costs: <span className="font-medium">$250K-$450K</span></div>
                <div className="text-xs">Development Savings: <span className="font-medium text-green-600">$3.5M-$4.4M</span></div>
                <div className="text-xs">Time-to-Market Value: <span className="font-medium text-green-600">+$6M</span></div>
              </div>
            </div>

            <div>
              <div className="text-xs text-muted-foreground mb-1">Related Projects</div>
              <div className="space-y-1">
                {relatedProjects.map((project, i) => (
                  <div key={i} className="text-xs text-blue-600 hover:underline cursor-pointer">
                    {project}
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sophie Chat Panel */}
        <Card className="flex-1 flex flex-col h-96">
          <CardHeader className="pb-3 border-b">
            <div className="flex items-center gap-2">
              <SophieLogo className="h-5 w-5" />
              <CardTitle className="text-sm">Sophie</CardTitle>
              <div className="text-xs text-muted-foreground">Conversation Agent</div>
            </div>
          </CardHeader>
          
          <CardContent className="flex-1 flex flex-col p-0">
            {/* Messages */}
            <div className="flex-1 overflow-auto p-4 space-y-3">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-3 rounded-lg text-xs ${
                    message.type === 'user' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-muted'
                  }`}>
                    <div>{message.content}</div>
                    <div className={`text-xs mt-1 ${
                      message.type === 'user' ? 'text-blue-100' : 'text-muted-foreground'
                    }`}>
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Input */}
            <div className="border-t p-3">
              <div className="flex gap-2">
                <Input
                  placeholder={chatMutation.isPending ? "Sophie is analyzing federal databases..." : "Ask Sophie about federal technologies..."}
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  className="text-xs"
                  disabled={chatMutation.isPending}
                />
                <Button size="sm" onClick={handleSendMessage} disabled={chatMutation.isPending}>
                  {chatMutation.isPending ? (
                    <div className="animate-spin h-3 w-3 border border-gray-300 border-t-blue-600 rounded-full" />
                  ) : (
                    <Send className="h-3 w-3" />
                  )}
                </Button>
              </div>
              {chatMutation.isPending && (
                <div className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                  <div className="animate-pulse w-2 h-2 bg-blue-500 rounded-full"></div>
                  Sophie is searching 300+ federal labs for relevant technologies...
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}