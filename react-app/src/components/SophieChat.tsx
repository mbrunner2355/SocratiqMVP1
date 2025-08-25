import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bot, Send, User, Brain, Search, TrendingUp, AlertTriangle } from "lucide-react";
import { SophieLogo } from "./SophieLogo";
import { apiRequest } from "@/lib/queryClient";
import { NavigationService } from '@/lib/navigation';

// @ts-ignore - Types for complex response structures
declare global {
  interface Window {
    SophieResponse: any;
  }
}

interface Message {
  id: string;
  type: 'user' | 'sophie';
  content: string;
  timestamp: Date;
  confidence?: number;
  sources?: any;
  insights?: any;
}

interface SophieResponse {
  success: boolean;
  reply: string;
  confidence: number;
  sources: {
    documents: any[];
    entities: any[];
  };
  insights: {
    keyFindings: string[];
    recommendations: string[];
    riskFactors: string[];
  };
  conversationId: string;
}

export function SophieChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'sophie',
      content: "Hello! I'm Sophie™, your intelligent assistant for document analysis and knowledge discovery. Ask me anything about your pharmaceutical documents, entity relationships, or risk assessments.",
      timestamp: new Date(),
      confidence: 1.0
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [conversationId, setConversationId] = useState<string>('');
  const queryClient = useQueryClient();

  // Get Sophie insights
  const { data: sophieInsights, error: insightsError } = useQuery({
    queryKey: ['/api/sophie/insights'],
    retry: false,
    refetchOnWindowFocus: false
  });

  // Chat mutation
  const chatMutation = useMutation({
    mutationFn: async (message: string) => {
      const response = await apiRequest('/api/sophie/chat', {
        method: 'POST',
        body: {
          message,
          conversationId: conversationId || undefined
        }
      });
      return response as any;
    },
    onSuccess: (data: any) => {
      if (!conversationId && data.conversationId) {
        setConversationId(data.conversationId);
      }
      
      const sophieMessage: Message = {
        id: Date.now().toString(),
        type: 'sophie',
        content: data.reply || 'No response received',
        timestamp: new Date(),
        confidence: data.confidence || 0,
        sources: data.sources,
        insights: data.insights
      };
      
      setMessages(prev => [...prev, sophieMessage]);
    },
    onError: (error) => {
      console.error('Chat error:', error);
      const errorMessage: Message = {
        id: Date.now().toString(),
        type: 'sophie',
        content: 'Sorry, I encountered an error processing your request. Please try again.',
        timestamp: new Date(),
        confidence: 0
      };
      setMessages(prev => [...prev, errorMessage]);
    }
  });

  // Query mutation for structured queries
  const queryMutation = useMutation({
    mutationFn: async (query: string) => {
      const response = await apiRequest('/api/sophie/query', {
        method: 'POST',
        body: { query }
      });
      return response;
    },
    onSuccess: (data: any) => {
      const sophieMessage: Message = {
        id: Date.now().toString(),
        type: 'sophie',
        content: data.response?.answer || 'No response received',
        timestamp: new Date(),
        confidence: data.response?.confidence || 0,
        sources: data.response?.sources,
        insights: data.response?.insights
      };
      
      setMessages(prev => [...prev, sophieMessage]);
    },
    onError: (error) => {
      console.error('Query error:', error);
      const errorMessage: Message = {
        id: Date.now().toString(),
        type: 'sophie',
        content: 'Sorry, I encountered an error processing your query. Please try again.',
        timestamp: new Date(),
        confidence: 0
      };
      setMessages(prev => [...prev, errorMessage]);
    }
  });

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const lowerInput = inputMessage.toLowerCase().trim();

    // Check for EMME navigation request
    if (lowerInput.includes('emme')) {
      
      const userMessage: Message = {
        id: Date.now().toString(),
        type: 'user',
        content: inputMessage,
        timestamp: new Date()
      };

      // Check for specific EMME section navigation first
      const emmeRoutes: Record<string, string> = {
        'research hub': 'research-hub',
        'competitive intelligence': 'competitive-intelligence',
        'regulatory strategy': 'regulatory-strategy', 
        'market access': 'market-access',
        'content library': 'content-library',
        'partnerships': 'partnerships',
        'analytics dashboard': 'analytics-dashboard',
        'analytics': 'analytics-dashboard',
        'projects': 'projects',
        'questions': 'questions'
      };

      const matchedRoute = Object.keys(emmeRoutes).find(key => 
        lowerInput.includes(key)
      );

      let sophieMessage: Message;

      if (matchedRoute) {
        // Direct navigation to specific section
        sophieMessage = {
          id: (Date.now() + 1).toString(),
          type: 'sophie',
          content: `Perfect! Taking you to ${matchedRoute.charAt(0).toUpperCase() + matchedRoute.slice(1)}...`,
          timestamp: new Date(),
          confidence: 1.0
        };

        setMessages(prev => [...prev, userMessage, sophieMessage]);
        setInputMessage('');
        
        // UPDATED: Use NavigationService instead of window.location.href
        setTimeout(() => {
          NavigationService.goToEMMESection(emmeRoutes[matchedRoute]);
        }, 1000);
        return; // IMPORTANT: Exit here
      } else {
        // Show navigation menu
        sophieMessage = {
          id: (Date.now() + 1).toString(),
          type: 'sophie',
          content: "Great! I can take you to any section of EMME Connect™. Where would you like to go?\n\n📊 **Research Hub** - Market analysis and competitive intelligence\n🎯 **Competitive Intelligence** - Real-time competitor monitoring\n🛡️ **Regulatory Strategy** - 505(b)(2) pathway analysis\n📈 **Market Access** - Payer strategy and commercialization\n📚 **Content Library** - Document management and insights\n🤝 **Partnerships** - Alliance management and deal analytics\n📊 **Analytics Dashboard** - Performance metrics and reporting\n\nJust type the name of the section you'd like to visit!",
          timestamp: new Date(),
          confidence: 1.0
        };

        setMessages(prev => [...prev, userMessage, sophieMessage]);
        setInputMessage('');
        return; // IMPORTANT: Exit here
      }
    }

    // Only reach here if NOT emme-related
    console.log('Not EMME-related, calling backend API...');
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    chatMutation.mutate(inputMessage);
    setInputMessage('');
  };

  const handleQuickQuery = (query: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: query,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    queryMutation.mutate(query);
  };

  const quickQueries = [
    "Summarize clinical trial findings",
    "Identify potential risk factors",
    "Show pharmaceutical entity relationships", 
    "Analyze regulatory compliance patterns"
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-3">
        {/* Main Chat Interface */}
        <Card className="md:col-span-2">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Bot className="h-5 w-5 text-primary" />
              <CardTitle>Sophie™ Intelligent Assistant</CardTitle>
            </div>
            <CardDescription>
              Advanced AI-powered analysis and insights for your pharmaceutical knowledge base
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <ScrollArea className="h-96 w-full rounded border p-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg p-3 ${
                        message.type === 'user'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted'
                      }`}
                    >
                      <div className="flex items-start space-x-2">
                        {message.type === 'sophie' && <SophieLogo size="sm" className="h-4 w-4 mt-1 flex-shrink-0" />}
                        {message.type === 'user' && <User className="h-4 w-4 mt-1 flex-shrink-0" />}
                        <div className="space-y-2 flex-1">
                          <p className="text-sm">{message.content}</p>
                          {message.confidence && (
                            <Badge variant="outline" className="text-xs">
                              Confidence: {(message.confidence * 100).toFixed(1)}%
                            </Badge>
                          )}
                          {message.sources && (
                            <div className="text-xs text-muted-foreground">
                              Sources: {message.sources.documents?.length || 0} documents, {message.sources.entities?.length || 0} entities
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {(chatMutation.isPending || queryMutation.isPending) && (
                  <div className="flex justify-start">
                    <div className="max-w-[80%] rounded-lg p-3 bg-muted">
                      <div className="flex items-center space-x-2">
                        <SophieLogo size="sm" className="h-4 w-4 animate-pulse" />
                        <div className="text-sm">Sophie is thinking...</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
            
            <div className="flex space-x-2">
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Ask Sophie anything about your documents..."
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                disabled={chatMutation.isPending || queryMutation.isPending}
              />
              <Button 
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || chatMutation.isPending || queryMutation.isPending}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions & Insights */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <p className="text-sm font-medium">Quick Queries</p>
              {quickQueries.map((query, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  className="w-full text-left justify-start"
                  onClick={() => handleQuickQuery(query)}
                  disabled={chatMutation.isPending || queryMutation.isPending}
                >
                  {query}
                </Button>
              ))}
            </div>
            
            <Separator />
            
            {sophieInsights && (
              <div className="space-y-2">
                <p className="text-sm font-medium">Recent Insights</p>
                <div className="space-y-2">
                  {sophieInsights.keyFindings?.slice(0, 3).map((finding: string, index: number) => (
                    <div key={index} className="text-xs p-2 bg-muted rounded">
                      {finding}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Sophie Analytics Tabs */}
      <Tabs defaultValue="analytics" className="space-y-4">
        <TabsList>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
          <TabsTrigger value="risks">Risk Assessment</TabsTrigger>
        </TabsList>
        
        <TabsContent value="analytics" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Documents Analyzed</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1,247</div>
                <p className="text-xs text-muted-foreground">+12% from last month</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Entities Identified</CardTitle>
                <Network className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">8,592</div>
                <p className="text-xs text-muted-foreground">+5% from last month</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Risk Factors</CardTitle>
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">23</div>
                <p className="text-xs text-muted-foreground">-2 from last week</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="insights" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Key Insights</CardTitle>
            </CardHeader>
            <CardContent>
              {sophieInsights?.keyFindings ? (
                <div className="space-y-2">
                  {sophieInsights.keyFindings.map((insight: string, index: number) => (
                    <div key={index} className="p-3 bg-muted rounded">
                      <p className="text-sm">{insight}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No insights available yet. Upload documents to get started.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="risks" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Risk Assessment</CardTitle>
            </CardHeader>
            <CardContent>
              {sophieInsights?.riskFactors ? (
                <div className="space-y-2">
                  {sophieInsights.riskFactors.map((risk: string, index: number) => (
                    <div key={index} className="p-3 bg-red-50 border border-red-200 rounded">
                      <div className="flex items-start space-x-2">
                        <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5" />
                        <p className="text-sm">{risk}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No risk factors identified yet.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}