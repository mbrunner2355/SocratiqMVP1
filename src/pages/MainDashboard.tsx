import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  MessageSquare, 
  Bell, 
  User, 
  Settings,
  FileText,
  Network,
  Shield,
  Building2,
  Activity,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  Target
} from "lucide-react";
import { SophieLogo } from "@/components/SophieLogo";

export default function MainDashboard() {
  const [chatInput, setChatInput] = useState("");

  const handleChatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Chat message:", chatInput);
    setChatInput("");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">S</span>
              </div>
              <span className="text-xl font-bold text-gray-900">SocratIQ™</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search platform..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
              />
            </div>
            <Button variant="ghost" size="icon">
              <Bell className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <User className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Left Sidebar Navigation */}
        <aside className="w-64 bg-white border-r border-gray-200 h-screen overflow-y-auto">
          <div className="p-4">
            <div className="space-y-2">
              {/* Platform Core Section */}
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                Platform Core
              </div>
              <nav className="space-y-1">
                <a href="/dashboard" className="flex items-center space-x-3 px-3 py-2 text-gray-700 rounded-lg bg-blue-50">
                  <Activity className="w-5 h-5" />
                  <span>Dashboard</span>
                </a>
                <a href="/pipeline" className="flex items-center space-x-3 px-3 py-2 text-gray-700 rounded-lg hover:bg-gray-50">
                  <FileText className="w-5 h-5" />
                  <span>Pipeline</span>
                </a>
                <a href="/models" className="flex items-center space-x-3 px-3 py-2 text-gray-700 rounded-lg hover:bg-gray-50">
                  <Network className="w-5 h-5" />
                  <span>Models</span>
                </a>
                <a href="/trust" className="flex items-center space-x-3 px-3 py-2 text-gray-700 rounded-lg hover:bg-gray-50">
                  <Shield className="w-5 h-5" />
                  <span>Trust</span>
                </a>
                <a href="/agents" className="flex items-center space-x-3 px-3 py-2 text-gray-700 rounded-lg hover:bg-gray-50">
                  <SophieLogo size="sm" />
                  <span>Agents</span>
                </a>
              </nav>

              {/* Specialized Modules Section */}
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3 mt-6">
                Specialized Modules
              </div>
              <nav className="space-y-1">
                <a href="/ip" className="flex items-center space-x-3 px-3 py-2 text-gray-700 rounded-lg hover:bg-gray-50">
                  <Shield className="w-5 h-5" />
                  <span>IP™</span>
                </a>
                <a href="/emme" className="flex items-center space-x-3 px-3 py-2 text-gray-700 rounded-lg hover:bg-gray-50">
                  <Building2 className="w-5 h-5" />
                  <span>EMME Connect™</span>
                </a>
                <a href="/trials" className="flex items-center space-x-3 px-3 py-2 text-gray-700 rounded-lg hover:bg-gray-50">
                  <Activity className="w-5 h-5" />
                  <span>Trials™</span>
                </a>
                <a href="/profile" className="flex items-center space-x-3 px-3 py-2 text-gray-700 rounded-lg hover:bg-gray-50">
                  <User className="w-5 h-5" />
                  <span>Profile™</span>
                </a>
                <a href="/build" className="flex items-center space-x-3 px-3 py-2 text-gray-700 rounded-lg hover:bg-gray-50">
                  <Building2 className="w-5 h-5" />
                  <span>Build™</span>
                  <Badge variant="secondary" className="ml-auto text-xs">Preview</Badge>
                </a>
              </nav>

              {/* Partner Solutions Section */}
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3 mt-6">
                Partner Solutions
              </div>
              <nav className="space-y-1">
                <a href="/emme-engage" className="flex items-center space-x-3 px-3 py-2 text-gray-700 rounded-lg hover:bg-gray-50">
                  <Target className="w-5 h-5" />
                  <span>EMME Engage</span>
                </a>
                <a href="/fedscout" className="flex items-center space-x-3 px-3 py-2 text-gray-700 rounded-lg hover:bg-gray-50">
                  <Search className="w-5 h-5" />
                  <span>FedScout Dashboard</span>
                </a>
                <a href="/jansus" className="flex items-center space-x-3 px-3 py-2 text-gray-700 rounded-lg hover:bg-gray-50">
                  <FileText className="w-5 h-5" />
                  <span>Jansus Client Demo</span>
                </a>
              </nav>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 p-6">
          {/* Welcome Message */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Good morning! Let's make some magic today!
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Every failed experiment teaches us something valuable. In research, there are no true failures—only data 
              that guides us toward success.
            </p>
          </div>

          {/* Chat Interface */}
          <Card className="max-w-4xl mx-auto mb-8">
            <CardContent className="p-6">
              <div className="bg-blue-50 rounded-lg p-4 mb-4">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-blue-600 font-medium">Sophie™</span>
                  <span className="text-sm text-blue-500">is online & ready</span>
                </div>
                <p className="text-gray-700 text-sm mb-3">
                  Hi Ryan! Where do you want to start today? I'm Sophie™, your AI biopharmaceutical colleague. I walk 
                  alongside you and the team of specialized agents to navigate the complexities of biopharmaceutical 
                  development. Whether you need strategic insights, risk assessment, or regulatory guidance, we'll 
                  collaborate to provide intelligent analysis and accelerate your journey from lab to market.
                </p>
                <p className="text-xs text-gray-500">11:48:57 AM</p>
              </div>
              
              <form onSubmit={handleChatSubmit} className="flex space-x-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Ask Sophie™ anything..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                  <Search className="w-4 h-4" />
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Sophie's Intelligence Brief */}
          <Card className="max-w-4xl mx-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <SophieLogo size="md" />
                  <div>
                    <CardTitle className="text-lg">Sophie's Intelligence Brief</CardTitle>
                    <p className="text-sm text-gray-600">Welcome back! Here's what I've been monitoring for you.</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary">Notifications</Badge>
                  <Button variant="outline" size="sm" className="bg-teal-600 text-white hover:bg-teal-700">
                    Ask Sophie
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {/* Statistics Cards */}
              <div className="grid grid-cols-4 gap-6 mb-6">
                <div className="text-center">
                  <div className="text-sm text-gray-600 mb-2">Statistics</div>
                  <div className="text-sm text-gray-500 mb-2">All Research: Clients: 0</div>
                  <div className="w-20 h-20 mx-auto bg-blue-100 rounded-full flex items-center justify-center mb-2">
                    <span className="text-2xl font-bold text-blue-600">72%</span>
                  </div>
                  <div className="text-xs space-y-1">
                    <div className="flex items-center justify-center space-x-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>Segment A: 35%</span>
                    </div>
                    <div className="flex items-center justify-center space-x-1">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span>Segment B: 25%</span>
                    </div>
                    <div className="flex items-center justify-center space-x-1">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                      <span>Segment C: 25%</span>
                    </div>
                    <div className="flex items-center justify-center space-x-1">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <span>Segment D: 15%</span>
                    </div>
                  </div>
                </div>

                <div className="text-center">
                  <div className="text-sm text-gray-600 mb-2">Statistics</div>
                  <div className="text-sm text-gray-500 mb-2">All Research: Clients: 0</div>
                  <div className="w-20 h-20 mx-auto bg-blue-100 rounded-full flex items-center justify-center mb-2">
                    <span className="text-2xl font-bold text-blue-600">72%</span>
                  </div>
                  <div className="text-xs space-y-1">
                    <div className="flex items-center justify-center space-x-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>Segment A: 35%</span>
                    </div>
                    <div className="flex items-center justify-center space-x-1">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span>Segment B: 25%</span>
                    </div>
                    <div className="flex items-center justify-center space-x-1">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                      <span>Segment C: 25%</span>
                    </div>
                    <div className="flex items-center justify-center space-x-1">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <span>Segment D: 15%</span>
                    </div>
                  </div>
                </div>

                <div className="text-center">
                  <div className="text-sm text-gray-600 mb-2">Statistics</div>
                  <div className="text-sm text-gray-500 mb-2">All Research: Clients: 0</div>
                  <div className="w-20 h-20 mx-auto bg-blue-100 rounded-full flex items-center justify-center mb-2">
                    <span className="text-2xl font-bold text-blue-600">72%</span>
                  </div>
                  <div className="text-xs space-y-1">
                    <div className="flex items-center justify-center space-x-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>Segment A: 35%</span>
                    </div>
                    <div className="flex items-center justify-center space-x-1">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span>Segment B: 25%</span>
                    </div>
                    <div className="flex items-center justify-center space-x-1">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                      <span>Segment C: 25%</span>
                    </div>
                    <div className="flex items-center justify-center space-x-1">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <span>Segment D: 15%</span>
                    </div>
                  </div>
                </div>

                <div className="text-center">
                  <div className="text-sm text-gray-600 mb-2">Statistics</div>
                  <div className="text-sm text-gray-500 mb-2">All Research: Clients: 0</div>
                  <div className="w-20 h-20 mx-auto bg-blue-100 rounded-full flex items-center justify-center mb-2">
                    <span className="text-2xl font-bold text-blue-600">72%</span>
                  </div>
                  <div className="text-xs space-y-1">
                    <div className="flex items-center justify-center space-x-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>Segment A: 35%</span>
                    </div>
                    <div className="flex items-center justify-center space-x-1">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span>Segment B: 25%</span>
                    </div>
                    <div className="flex items-center justify-center space-x-1">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                      <span>Segment C: 25%</span>
                    </div>
                    <div className="flex items-center justify-center space-x-1">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <span>Segment D: 15%</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Alert Summary */}
              <div className="grid grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="w-12 h-12 mx-auto bg-red-100 rounded-lg flex items-center justify-center mb-2">
                    <AlertTriangle className="w-6 h-6 text-red-600" />
                  </div>
                  <div className="text-lg font-bold">2</div>
                  <div className="text-sm text-gray-600">Critical Insights</div>
                </div>
                
                <div className="text-center">
                  <div className="w-12 h-12 mx-auto bg-yellow-100 rounded-lg flex items-center justify-center mb-2">
                    <Clock className="w-6 h-6 text-yellow-600" />
                  </div>
                  <div className="text-lg font-bold">1</div>
                  <div className="text-sm text-gray-600">Warning Insights</div>
                </div>
                
                <div className="text-center">
                  <div className="w-12 h-12 mx-auto bg-blue-100 rounded-lg flex items-center justify-center mb-2">
                    <TrendingUp className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="text-lg font-bold">68</div>
                  <div className="text-sm text-gray-600">Informational Insights</div>
                </div>
                
                <div className="text-center">
                  <div className="w-12 h-12 mx-auto bg-green-100 rounded-lg flex items-center justify-center mb-2">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="text-lg font-bold">84% → 86%</div>
                  <div className="text-sm text-gray-600">On-Time Delivery</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}