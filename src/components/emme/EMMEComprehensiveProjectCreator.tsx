import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import { 
  Building2, 
  Users, 
  Search, 
  FileText, 
  BarChart3, 
  Target, 
  Map, 
  Settings,
  Globe,
  BookOpen,
  Lightbulb,
  MessageSquare,
  ChevronDown,
  ChevronRight,
  Bell,
  Home
} from 'lucide-react';

// Left sidebar navigation items
const SIDEBAR_ITEMS = [
  {
    id: 'vms-global',
    label: 'VMS Global',
    icon: Building2,
    children: [
      { id: 'framework', label: 'Framework', active: false },
      { id: 'background', label: 'Background', active: true },
      { id: 'exploration', label: 'Exploration', active: false },
      { id: 'human-insights', label: 'Human Insights', active: false },
      { id: 'client-content', label: 'Client Content', active: false },
      { id: 'playground', label: 'Playground', active: false },
      { id: 'strategy-map', label: 'Strategy Map', active: false },
      { id: 'dashboard', label: 'Dashboard', active: false }
    ]
  }
];

// Top navigation tabs
const TOP_TABS = [
  { id: 'organization-overview', label: 'Organization Overview', active: false },
  { id: 'initiative-overview', label: 'Initiative Overview', active: true },
  { id: 'clinical-trials', label: 'Clinical Trials', active: false },
  { id: 'xxxx', label: 'XXXX', active: false },
  { id: 'xxx', label: 'XXX', active: false }
];

export function EMMEComprehensiveProjectCreator() {
  const [activeTab, setActiveTab] = useState('initiative-overview');
  const [activeSidebarItem, setActiveSidebarItem] = useState('background');
  const [expandedItems, setExpandedItems] = useState(['vms-global']);

  const toggleExpanded = (itemId: string) => {
    setExpandedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const renderBackgroundContent = () => (
    <div className="space-y-6">
      {/* Complete Button */}
      <div className="flex justify-end mb-6">
        <Button variant="outline" className="bg-green-100 text-green-800 border-green-300">
          Complete
        </Button>
      </div>

      {/* Mechanism & CE Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <ChevronDown className="w-4 h-4" />
          <h3 className="text-lg font-semibold text-red-600">Mechanism & CE</h3>
        </div>
        
        <div className="bg-gray-50 p-4 border-l-4 border-red-400 space-y-4">
          <p className="text-sm text-gray-700">
            <strong>PRODUCT A</strong> is a dual neurokinin-1 (NK-1) and neurokinin-3 (NK-3) receptor antagonist, a novel, non-hormonal mechanism of action.
          </p>
          
          <p className="text-sm text-gray-700">
            It targets KNDy neurons (Kisspeptin, Neurokinin B, Dynorphin) in the hypothalamus — key players in thermoregulation and reproductive hormone signaling.
          </p>
          
          <div className="flex items-center gap-2">
            <ChevronRight className="w-4 h-4" />
            <p className="text-sm text-gray-700">
              During menopause, estrogen decline causes these neurons to become hyperactive, triggering hot flashes and sleep disruptions. By modulating this pathway, PRODUCT A helps restore thermal balance without affecting hormone levels.
            </p>
          </div>
          
          <div className="space-y-2">
            <p className="text-sm font-semibold text-gray-800">Phase 1 & 2 Trials:</p>
            <p className="text-sm text-gray-700">
              Phase 1 studies established safety, pharmacokinetics, and pharmacodynamics, confirming oral bioavailability and tolerability in healthy women.
            </p>
            
            <p className="text-sm text-gray-700">
              Phase 2b (SWITCH-1) trial identified the optimal 120 mg dose, showing a statistically significant reduction in hot flash frequency and severity by week 4, with a favorable safety profile.
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <ChevronRight className="w-4 h-4" />
            <p className="text-sm text-gray-700">
              Additional findings from early-phase research indicated positive effects on sleep quality, reduced wake time, and no impact on hormone-sensitive tissues.
            </p>
          </div>
        </div>
      </div>

      {/* Chat Interface */}
      <div className="border rounded-lg p-4 bg-white">
        <div className="flex items-center gap-2 mb-4">
          <MessageSquare className="w-5 h-5 text-gray-500" />
          <span className="text-sm font-medium text-gray-700">What can I help you with?</span>
        </div>
        <Textarea 
          placeholder="Ask about mechanism of action, clinical trial data, regulatory pathway, or competitive landscape..."
          className="min-h-[80px] border-gray-200"
        />
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Left Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 overflow-y-auto">
        <div className="p-4">
          <div className="flex items-center gap-2 mb-6">
            <div className="flex items-center gap-1">
              <span className="text-xl font-bold text-red-600">emme</span>
              <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded">vi</span>
            </div>
            <span className="text-xs text-gray-500">powered by mock5</span>
          </div>
          
          {/* Navigation Icons */}
          <div className="space-y-4 mb-6">
            <div className="flex flex-col gap-3">
              <Home className="w-5 h-5 text-gray-400" />
              <Users className="w-5 h-5 text-gray-400" />
              <Search className="w-5 h-5 text-gray-400" />
              <FileText className="w-5 h-5 text-gray-400" />
              <BarChart3 className="w-5 h-5 text-gray-400" />
              <Bell className="w-5 h-5 text-gray-400" />
              <Target className="w-5 h-5 text-gray-400" />
              <Settings className="w-5 h-5 text-gray-400" />
            </div>
          </div>

          {/* Project Navigation */}
          <div className="space-y-1">
            {SIDEBAR_ITEMS.map((item) => (
              <div key={item.id}>
                <div 
                  className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded cursor-pointer"
                  onClick={() => toggleExpanded(item.id)}
                >
                  <Building2 className="w-4 h-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700">{item.label}</span>
                  {expandedItems.includes(item.id) ? (
                    <ChevronDown className="w-4 h-4 text-gray-400 ml-auto" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-gray-400 ml-auto" />
                  )}
                </div>
                
                {expandedItems.includes(item.id) && (
                  <div className="ml-6 space-y-1">
                    {item.children.map((child) => (
                      <div
                        key={child.id}
                        className={`p-2 rounded cursor-pointer text-sm transition-colors ${
                          child.id === activeSidebarItem
                            ? 'bg-red-50 text-red-700 font-medium'
                            : 'text-gray-600 hover:bg-gray-50'
                        }`}
                        onClick={() => setActiveSidebarItem(child.id)}
                      >
                        {child.label}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Background</h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search..."
                  className="pl-10 w-64"
                />
              </div>
              <Button className="bg-red-600 hover:bg-red-700">
                New Project
              </Button>
              <Bell className="w-5 h-5 text-gray-400" />
            </div>
          </div>
        </div>

        {/* Top Tabs */}
        <div className="bg-white border-b border-gray-200">
          <div className="flex items-center px-4">
            {TOP_TABS.map((tab) => (
              <button
                key={tab.id}
                className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                  tab.id === activeTab
                    ? 'border-red-500 text-red-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-6 overflow-y-auto">
          {activeSidebarItem === 'background' && renderBackgroundContent()}
          
          {activeSidebarItem === 'framework' && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Strategic Framework Setup</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Therapeutic Area</label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select therapeutic area" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="womens-health">Women's Health</SelectItem>
                          <SelectItem value="endocrinology">Endocrinology</SelectItem>
                          <SelectItem value="neurology">Neurology</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Product Stage</label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select development stage" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="phase-3">Phase 3</SelectItem>
                          <SelectItem value="nda-prep">NDA Preparation</SelectItem>
                          <SelectItem value="pre-launch">Pre-Launch</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeSidebarItem === 'exploration' && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Market Exploration</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Target Market Size</label>
                      <Input placeholder="Enter market size estimate" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Competitive Landscape</label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select competition level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="high">High Competition</SelectItem>
                          <SelectItem value="moderate">Moderate Competition</SelectItem>
                          <SelectItem value="low">Low Competition</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeSidebarItem === 'human-insights' && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Human Insights & Patient Journey</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Patient Population</label>
                      <Textarea placeholder="Describe target patient population and unmet needs..." />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Healthcare Provider Insights</label>
                      <Textarea placeholder="Key insights from healthcare providers..." />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeSidebarItem === 'client-content' && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Client Content Management</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Content Strategy</label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select content approach" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="educational">Educational Focus</SelectItem>
                          <SelectItem value="awareness">Awareness Building</SelectItem>
                          <SelectItem value="advocacy">Patient Advocacy</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Key Messages</label>
                      <Textarea placeholder="Define key messages and value propositions..." />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeSidebarItem === 'playground' && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Strategy Playground</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">Interactive strategy modeling and scenario planning workspace</p>
                </CardContent>
              </Card>
            </div>
          )}

          {activeSidebarItem === 'strategy-map' && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Strategic Roadmap</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">Visual strategic roadmap and milestone tracking</p>
                </CardContent>
              </Card>
            </div>
          )}

          {activeSidebarItem === 'dashboard' && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Project Dashboard</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="p-4 bg-blue-50 rounded">
                      <h4 className="font-medium text-blue-900">Progress</h4>
                      <p className="text-2xl font-bold text-blue-600">75%</p>
                    </div>
                    <div className="p-4 bg-green-50 rounded">
                      <h4 className="font-medium text-green-900">Milestones</h4>
                      <p className="text-2xl font-bold text-green-600">8/12</p>
                    </div>
                    <div className="p-4 bg-yellow-50 rounded">
                      <h4 className="font-medium text-yellow-900">Timeline</h4>
                      <p className="text-2xl font-bold text-yellow-600">On Track</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}