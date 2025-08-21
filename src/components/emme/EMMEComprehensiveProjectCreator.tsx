import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Bell } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

// Top navigation tabs - starting with Organization Overview
const TOP_TABS = [
  { id: 'organization-overview', label: 'Organization Overview' },
  { id: 'initiative-overview', label: 'Initiative Overview' },
  { id: 'clinical-trials', label: 'Clinical Trials' },
  { id: 'xxxx', label: 'XXXX' },
  { id: 'xxx', label: 'XXX' }
];

// Project structure navigation items
const PROJECT_NAV_ITEMS = [
  { id: 'framework', label: 'Framework', icon: 'document' },
  { id: 'background', label: 'Background', icon: 'info', active: true },
  { id: 'exploration', label: 'Exploration', icon: 'search' },
  { id: 'human-insights', label: 'Human Insights', icon: 'users' },
  { id: 'client-content', label: 'Client Content', icon: 'content' },
  { id: 'playground', label: 'Playground', icon: 'play' },
  { id: 'strategy-map', label: 'Strategy Map', icon: 'map' },
  { id: 'dashboard', label: 'Dashboard', icon: 'chart' }
];

export function EMMEComprehensiveProjectCreator() {
  const [activeTab, setActiveTab] = useState('organization-overview');
  const [projectName, setProjectName] = useState('VMS Global');
  const [isProjectSetup, setIsProjectSetup] = useState(true);
  const [activeProjectNav, setActiveProjectNav] = useState('background');
  
  // Form data state
  const [formData, setFormData] = useState({
    name: 'VMS Global',
    organizationType: '',
    therapeuticArea: '',
    developmentStage: '',
    patientPopulation: '',
    hcpInsights: '',
    clinicalEndpoints: '',
    status: 'active'
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const createProjectMutation = useMutation({
    mutationFn: async (projectData: typeof formData) => {
      return apiRequest('/api/projects', {
        method: 'POST',
        body: projectData
      });
    },
    onSuccess: (newProject) => {
      toast({
        title: "Project Created",
        description: `${newProject.name} has been created successfully!`,
      });
      // Invalidate projects cache to refresh the list
      queryClient.invalidateQueries({ queryKey: ['/api/projects'] });
      setIsProjectSetup(false);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create project. Please try again.",
        variant: "destructive"
      });
      console.error('Failed to create project:', error);
    }
  });

  const handleNextStep = () => {
    const tabOrder = ['organization-overview', 'initiative-overview', 'clinical-trials', 'xxxx', 'xxx'];
    const currentIndex = tabOrder.indexOf(activeTab);
    if (currentIndex < tabOrder.length - 1) {
      setActiveTab(tabOrder[currentIndex + 1]);
    }
  };

  const handlePreviousStep = () => {
    const tabOrder = ['organization-overview', 'initiative-overview', 'clinical-trials', 'xxxx', 'xxx'];
    const currentIndex = tabOrder.indexOf(activeTab);
    if (currentIndex > 0) {
      setActiveTab(tabOrder[currentIndex - 1]);
    }
  };

  const handleCompleteSetup = () => {
    createProjectMutation.mutate(formData);
    setActiveTab('initiative-overview');
  };

  const renderOrganizationOverview = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Project Setup - Organization Overview</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Project Name</label>
            <Input 
              value={formData.name}
              onChange={(e) => {
                setFormData(prev => ({ ...prev, name: e.target.value }));
                setProjectName(e.target.value);
              }}
              placeholder="Enter project name (e.g., VMS Global)"
              className="text-lg"
            />
          </div>
          
          <div className="relative">
            <label className="block text-sm font-medium mb-2">Organization Type</label>
            <Select onValueChange={(value) => setFormData(prev => ({ ...prev, organizationType: value }))}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select organization type" />
              </SelectTrigger>
              <SelectContent className="z-[100] bg-white border shadow-lg max-h-60">
                <SelectItem value="pharmaceutical">Pharmaceutical Company</SelectItem>
                <SelectItem value="biotech">Biotechnology Company</SelectItem>
                <SelectItem value="medical-device">Medical Device Company</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="relative">
            <label className="block text-sm font-medium mb-2">Primary Therapeutic Area</label>
            <Select onValueChange={(value) => setFormData(prev => ({ ...prev, therapeuticArea: value }))}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select primary therapeutic area" />
              </SelectTrigger>
              <SelectContent className="z-[100] bg-white border shadow-lg max-h-60">
                <SelectItem value="womens-health">Women's Health</SelectItem>
                <SelectItem value="oncology">Oncology</SelectItem>
                <SelectItem value="neurology">Neurology</SelectItem>
                <SelectItem value="cardiology">Cardiology</SelectItem>
                <SelectItem value="endocrinology">Endocrinology</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-between pt-4">
            <Button variant="outline" disabled>Previous</Button>
            <Button 
              onClick={handleCompleteSetup} 
              disabled={createProjectMutation.isPending}
            >
              {createProjectMutation.isPending ? 'Creating Project...' : 'Complete Setup'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderBackgroundContent = () => (
    <div className="space-y-6">
      <div className="flex justify-end mb-4">
        <Button className="bg-purple-600 hover:bg-purple-700 text-white">Complete</Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="text-pink-500">▼</span>
            Mechanism & CE
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-gray-700">
            <strong>PRODUCT A</strong> is a dual neurokinin-1 (NK-1) and neurokinin-3 (NK-3) receptor antagonist, a novel, non-hormonal mechanism of action.
          </p>
          
          <p className="text-sm text-gray-700">
            It targets KNDy neurons (Kisspeptin, Neurokinin B, Dynorphin) in the hypothalamus — key players in thermoregulation and reproductive hormone signaling.
          </p>
          
          <div className="pl-4">
            <p className="text-sm text-gray-700 mb-2">
              <span className="text-pink-500">▶</span> During menopause, estrogen decline causes these neurons to become hyperactive, triggering hot flashes and sleep disruptions. By modulating this pathway, PRODUCT A helps restore thermal balance without affecting hormone levels.
            </p>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm font-semibold text-gray-800 mb-2">Phase 1 & 2 Trials:</p>
              <p className="text-sm text-gray-700">
                Phase 1 studies established safety, pharmacokinetics, and pharmacodynamics, confirming oral bioavailability and tolerability in healthy women.
              </p>
              
              <p className="text-sm text-gray-700 mt-2">
                Phase 2b (SWITCH-1) trial identified the optimal 120 mg dose, showing a statistically significant reduction in hot flash frequency and severity by week 4, with a favorable safety profile.
              </p>
            </div>
            
            <p className="text-sm text-gray-700 mt-2">
              <span className="text-pink-500">▶</span> Additional findings from early-phase research indicated positive effects on sleep quality, reduced wake time, and no impact on hormone-sensitive tissues.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>What can I help you with?</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="min-h-[100px] bg-gray-50 rounded-lg flex items-center justify-center">
            <p className="text-gray-500">Chat interface placeholder</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderClinicalTrials = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Clinical Development Program</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="relative">
            <label className="block text-sm font-medium mb-2">Development Stage</label>
            <Select>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select current development stage" />
              </SelectTrigger>
              <SelectContent className="z-[100] bg-white border shadow-lg max-h-60">
                <SelectItem value="phase-1">Phase 1</SelectItem>
                <SelectItem value="phase-2">Phase 2</SelectItem>
                <SelectItem value="phase-3">Phase 3</SelectItem>
                <SelectItem value="nda-prep">NDA Preparation</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Key Clinical Endpoints</label>
            <Textarea 
              placeholder="Primary and secondary endpoints..."
              className="min-h-[100px]"
            />
          </div>

          <div className="flex justify-between pt-4">
            <Button variant="outline" onClick={handlePreviousStep}>Previous</Button>
            <Button onClick={handleNextStep}>Next: XXXX</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'organization-overview':
        return renderOrganizationOverview();
      case 'initiative-overview':
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Initiative Overview - {projectName}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Project setup completed successfully! Use the navigation sidebar to explore different sections of your project.</p>
              </CardContent>
            </Card>
          </div>
        );
      case 'clinical-trials':
        return renderClinicalTrials();
      case 'xxxx':
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Additional Configuration</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Configuration options for XXXX module</p>
                <div className="flex justify-between pt-4">
                  <Button variant="outline" onClick={handlePreviousStep}>Previous</Button>
                  <Button onClick={handleNextStep}>Next: XXX</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        );
      case 'xxx':
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Final Configuration</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Final setup options for XXX module</p>
                <div className="flex justify-between pt-4">
                  <Button variant="outline" onClick={handlePreviousStep}>Previous</Button>
                  <Button>Complete Setup</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        );
      default:
        return renderOrganizationOverview();
    }
  };

  if (isProjectSetup) {
    return (
      <div className="flex flex-col h-full bg-gray-50">
        <div className="flex-1 flex flex-col">
          <div className="bg-white border-b border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{projectName} - Project Setup</h1>
              </div>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                  <Input placeholder="Search..." className="pl-10 w-64" />
                </div>
                <Button className="bg-purple-600 hover:bg-purple-700">New Project</Button>
                <Bell className="w-5 h-5 text-gray-400" />
              </div>
            </div>
          </div>

          <div className="bg-white border-b border-gray-200">
            <div className="flex items-center px-4">
              {TOP_TABS.map((tab) => (
                <button
                  key={tab.id}
                  className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                    tab.id === activeTab
                      ? 'border-purple-500 text-purple-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 p-6 overflow-y-auto">
            {renderContent()}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full bg-gray-50">
      {/* Project Structure Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200">
        <div className="p-4">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-5 h-5 bg-gray-300 rounded"></div>
            <span className="font-medium text-gray-800">{projectName}</span>
          </div>
          
          <div className="space-y-1">
            {PROJECT_NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveProjectNav(item.id)}
                className={`w-full text-left px-3 py-2 text-sm rounded transition-colors ${
                  item.id === activeProjectNav
                    ? 'bg-purple-50 text-purple-700 font-medium'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        <div className="bg-white border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900 capitalize">{activeProjectNav}</h1>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <Input placeholder="Search..." className="pl-10 w-64" />
              </div>
              <Button className="bg-purple-600 hover:bg-purple-700">New Project</Button>
              <Bell className="w-5 h-5 text-gray-400" />
            </div>
          </div>
        </div>

        {/* Content Navigation Tabs */}
        <div className="bg-white border-b border-gray-200">
          <div className="flex items-center px-4">
            {TOP_TABS.map((tab) => (
              <button
                key={tab.id}
                className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                  tab.id === activeTab
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 p-6 overflow-y-auto">
          {activeProjectNav === 'background' && renderBackgroundContent()}
          {activeProjectNav !== 'background' && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="capitalize">{activeProjectNav}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">Content for {activeProjectNav} section</p>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}