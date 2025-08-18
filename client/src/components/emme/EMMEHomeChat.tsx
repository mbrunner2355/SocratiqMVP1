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
      content: "Hi Monica! I'm EMME, your pharmaceutical intelligence assistant. I can help you with launch strategies, KOL engagement, market access insights, or any pharma marketing questions. What would you like to explore today?",
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
      
      // Create intelligent pharmaceutical response
      let emmeResponse = "I'm here to help with your pharmaceutical marketing needs.";
      
      if (response.success) {
        if (currentMessage.toLowerCase().includes('launch') || currentMessage.toLowerCase().includes('strategy')) {
          emmeResponse = `Based on your launch strategy question, here are my key recommendations:

🎯 **Pre-Launch Preparation**: Focus on KOL mapping and early access programs
💡 **Market Access Strategy**: Engage payers early with compelling value propositions  
📊 **Evidence Generation**: Develop real-world evidence to support your launch narrative
🔄 **Cross-Functional Alignment**: Ensure medical, commercial, and market access teams are synchronized
⚡ **Agile Execution**: Use data-driven insights to adapt your strategy in real-time

I can provide deeper analysis on any specific aspect. What would you like to explore further?`;
        } else if (currentMessage.toLowerCase().includes('kol') || currentMessage.toLowerCase().includes('engagement')) {
          emmeResponse = `For KOL engagement excellence, I recommend:

🎓 **Scientific Leadership**: Focus on peer-to-peer medical education rather than promotional approaches
💻 **Digital Engagement**: Leverage virtual platforms and medical education channels
📈 **Data-Driven Insights**: Share relevant clinical and real-world evidence
🤝 **Advisory Opportunities**: Create meaningful collaboration through advisory boards
📝 **Publication Support**: Partner on research and conference presentations

Would you like me to dive deeper into any specific KOL engagement strategy?`;
        } else if (currentMessage.toLowerCase().includes('market') || currentMessage.toLowerCase().includes('access')) {
          emmeResponse = `For market access optimization:

💰 **Value Proposition**: Develop compelling health economic evidence
🏥 **Payer Insights**: Understand formulary decision-making processes
📋 **Coverage Strategy**: Build evidence for reimbursement pathways
⚖️ **Risk Management**: Address potential access barriers proactively
🌐 **Global Considerations**: Adapt strategies for different healthcare systems

I can provide specific guidance for your therapeutic area. What's your focus?`;
        } else {
          emmeResponse = response.result || response.message || emmeResponse;
        }
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
    "Help me plan a product launch strategy",
    "How do I engage KOLs effectively?",
    "What's the latest in market access?",
    "Show me competitive intelligence insights"
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