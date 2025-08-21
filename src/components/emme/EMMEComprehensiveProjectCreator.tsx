import { useState, useEffect } from 'react';
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
  { id: 'project-insights', label: 'Project Insights', icon: 'chart', active: true },
  { id: 'framework', label: 'Framework', icon: 'document' },
  { id: 'client-content', label: 'Client Content', icon: 'content' },
  { id: 'playground', label: 'Playground', icon: 'play' },
  { id: 'strategy-map', label: 'Strategy Map', icon: 'map' },
  { id: 'dashboard', label: 'Dashboard', icon: 'chart' }
];

export function EMMEComprehensiveProjectCreator() {
  const [activeTab, setActiveTab] = useState('organization-overview');
  const [projectName, setProjectName] = useState('VMS Global');
  const [isProjectSetup, setIsProjectSetup] = useState(true);
  const [activeProjectNav, setActiveProjectNav] = useState('project-insights');
  const [insightsTab, setInsightsTab] = useState('overview');

  // Check if we're opening an existing project from session storage
  useEffect(() => {
    const currentProject = sessionStorage.getItem('current-project');
    const editMode = sessionStorage.getItem('edit-mode');
    
    if (currentProject) {
      try {
        const project = JSON.parse(currentProject);
        setProjectName(project.name);
        
        // If in edit mode, show the setup form with existing data
        if (editMode === 'true') {
          setIsProjectSetup(true);
          setFormData({
            name: project.name || 'VMS Global Campaign',
            client: project.client || 'PharmaX',
            team: project.team || 'm5 alpha',
            summary: project.summary || 'Launch readiness investigation-al and strategic planning for PRODUCT A dual NK receptor antagonist in US, UK, EU with patient and provider messaging. Include pric',
            organizationType: project.organizationType || 'pharmaceutical',
            therapeuticArea: project.therapeuticArea || 'womens-health',
            developmentStage: project.developmentStage || '',
            patientPopulation: project.patientPopulation || '',
            hcpInsights: project.hcpInsights || '',
            clinicalEndpoints: project.clinicalEndpoints || '',
            status: project.status || 'active'
          });
          // Clear edit mode flag
          sessionStorage.removeItem('edit-mode');
        } else {
          // Regular project workspace - skip setup
          setIsProjectSetup(false);
          
          // Set the active navigation based on URL or default to project-insights
          const currentView = window.location.hash.replace('#', '') || 'project-insights';
          if (['project-insights', 'framework', 'client-content', 'playground', 'strategy-map', 'dashboard'].includes(currentView)) {
            setActiveProjectNav(currentView);
          }
        }
      } catch (error) {
        console.error('Failed to parse current project:', error);
      }
    }
  }, []);
  
  // Form data state
  const [formData, setFormData] = useState({
    name: 'VMS Global Campaign',
    client: 'PharmaX',
    team: 'm5 alpha',
    summary: 'Launch readiness investigation-al and strategic planning for PRODUCT A dual NK receptor antagonist in US, UK, EU with patient and provider messaging. Include pric',
    organizationType: 'pharmaceutical',
    therapeuticArea: 'womens-health',
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
      try {
        const response = await fetch('/api/projects', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(projectData)
        });
        
        // Check if we got HTML instead of JSON (API routing issue)
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('text/html')) {
          console.warn('API routing issue - using localStorage fallback');
          // Save to localStorage as fallback
          const newProject = {
            id: Date.now().toString(),
            ...projectData,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };
          
          const existingProjects = JSON.parse(localStorage.getItem('emme-projects') || '[]');
          existingProjects.push(newProject);
          localStorage.setItem('emme-projects', JSON.stringify(existingProjects));
          return newProject;
        }
        
        if (!response.ok) {
          throw new Error('Failed to create project');
        }
        return response.json();
      } catch (error) {
        console.warn('API error, using localStorage fallback:', error);
        // Fallback to localStorage
        const newProject = {
          id: Date.now().toString(),
          ...projectData,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        
        const existingProjects = JSON.parse(localStorage.getItem('emme-projects') || '[]');
        existingProjects.push(newProject);
        localStorage.setItem('emme-projects', JSON.stringify(existingProjects));
        return newProject;
      }
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
    <div className="max-w-2xl mx-auto space-y-6 p-6">
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Project Title</label>
          <Input 
            value={formData.name}
            onChange={(e) => {
              setFormData(prev => ({ ...prev, name: e.target.value }));
              setProjectName(e.target.value);
            }}
            className="text-base bg-gray-50 border-gray-200"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Client</label>
          <div className="relative">
            <Select 
              value={formData.client}
              onValueChange={(value) => setFormData(prev => ({ ...prev, client: value }))}
            >
              <SelectTrigger className="w-full bg-gray-50 border-gray-200">
                <SelectValue placeholder="Select client" />
              </SelectTrigger>
              <SelectContent className="z-[100] bg-white border shadow-lg">
                <SelectItem value="PharmaX">PharmaX</SelectItem>
                <SelectItem value="BioTech Alpha">BioTech Alpha</SelectItem>
                <SelectItem value="Global Pharma">Global Pharma</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Team</label>
          <div className="relative">
            <Select 
              value={formData.team}
              onValueChange={(value) => setFormData(prev => ({ ...prev, team: value }))}
            >
              <SelectTrigger className="w-full bg-gray-50 border-gray-200">
                <SelectValue placeholder="Select team" />
              </SelectTrigger>
              <SelectContent className="z-[100] bg-white border shadow-lg">
                <SelectItem value="m5 alpha">m5 alpha</SelectItem>
                <SelectItem value="beta team">beta team</SelectItem>
                <SelectItem value="gamma squad">gamma squad</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Summary</label>
          <Textarea 
            value={formData.summary}
            onChange={(e) => setFormData(prev => ({ ...prev, summary: e.target.value }))}
            className="bg-gray-50 border-gray-200 min-h-[100px] resize-none"
            rows={4}
          />
        </div>

        <div className="flex justify-center pt-8">
          <Button 
            onClick={handleCompleteSetup}
            disabled={createProjectMutation.isPending}
            className="bg-red-500 hover:bg-red-600 text-white px-8 py-2 rounded-md font-medium"
          >
            {createProjectMutation.isPending ? 'Saving...' : (sessionStorage.getItem('current-project') ? 'Save Changes' : "Let's get to work!")}
          </Button>
        </div>
      </div>
    </div>
  );

  const renderProjectInsights = () => {
    const renderInsightsContent = () => {
      if (insightsTab === 'scope') {
        return (
          <div className="bg-white rounded-lg shadow-sm border p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center">
                <span className="text-gray-600 text-sm">📋</span>
              </div>
              <h2 className="text-xl font-semibold text-red-500">Scope</h2>
            </div>
            
            <div className="space-y-8">
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Competitive Analysis</h3>
                <ul className="space-y-1 text-gray-700 ml-4">
                  <li>• Landscape review of non-hormonal, hormonal, OTC, and natural alternatives</li>
                  <li>• SWOT analyses for key competitors</li>
                  <li>• Assessment of clinical positioning, messaging, patient targeting, and promotional strategies</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Pricing Models</h3>
                <ul className="space-y-1 text-gray-700 ml-4">
                  <li>• Evaluation of pricing strategies and structures across US, UK, and EU markets</li>
                  <li>• Competitive benchmarking and price sensitivity analysis</li>
                  <li>• Recommendations for pricing frameworks that support access and adoption</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Persona Development</h3>
                <ul className="space-y-1 text-gray-700 ml-4">
                  <li>• Creation of patient personas reflecting demographics, psychographics, treatment preferences, and barriers</li>
                  <li>• Development of provider personas including specialty types, decision drivers, and prescribing behaviors</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Messaging Framework</h3>
                <ul className="space-y-1 text-gray-700 ml-4">
                  <li>• Development of core messaging pillars for patients, providers, and payers</li>
                  <li>• Adaptation of messaging to reflect cultural and regulatory differences across markets</li>
                  <li>• Identification of potential areas for differentiated storytelling and education</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Market Access Strategy</h3>
                <ul className="space-y-1 text-gray-700 ml-4">
                  <li>• Assessment of reimbursement pathways and access requirements by market</li>
                  <li>• Recommendations for evidence generation, HEOR (Health Economics and Outcomes Research) support, and stakeholder engagement</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Go-to-Market Models</h3>
                <ul className="space-y-1 text-gray-700 ml-4">
                  <li>• Development of launch models tailored to the dynamics of each region</li>
                  <li>• Channel strategy recommendations (digital, in-person, hybrid)</li>
                  <li>• Tactical launch planning support aligned to market nuances</li>
                </ul>
              </div>
            </div>
          </div>
        );
      }
      
      // Overview tab content
      return (
        <div className="bg-white rounded-lg shadow-sm border p-8">
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center">
                <span className="text-gray-600 text-sm">U</span>
              </div>
              <h2 className="text-xl font-semibold text-red-500">Non-Hormonal Treatment Launch Preparation</h2>
            </div>
          </div>
          
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Background</h3>
            <p className="text-gray-700 mb-4">
              Global pharmaceutical company is preparing to launch new non-hormonal treatment for moderate to severe vasomotor 
              symptoms (VMS) associated with menopause. Product will launch simultaneously across US, UK, and EU markets.
            </p>
            <p className="text-gray-700 mb-6">
              Current landscape includes one direct non-hormonal competitor already in the market, alongside several hormonal 
              therapies and a variety of over-the-counter and natural remedies. As patient and provider expectations evolve, there is 
              an opportunity to position the new treatment strategically to address unmet needs, differentiate from existing options, 
              and maximize market penetration at launch.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Project Objectives</h3>
            <p className="text-gray-700 mb-4">To support successful launch, we will conduct a comprehensive launch readiness initiative designed to:</p>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-gray-400 mt-1">•</span>
                <span>Understand the competitive landscape across all target markets</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-gray-400 mt-1">•</span>
                <span>Clarify the value proposition for patients, providers, and payers</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-gray-400 mt-1">•</span>
                <span>Build compelling messaging that resonates across segments</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-gray-400 mt-1">•</span>
                <span>Ensure optimal market access and uptake strategies are in place</span>
              </li>
            </ul>
          </div>
        </div>
      );
    };

    return (
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Project Insights</h1>
          <Button className="bg-red-500 hover:bg-red-600 text-white px-6">
            Activate
          </Button>
        </div>
        
        {/* Tab Navigation */}
        <div className="border-b border-gray-200 mb-8">
          <div className="flex space-x-8">
            <button 
              onClick={() => setInsightsTab('overview')}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                insightsTab === 'overview'
                  ? 'border-red-500 text-red-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Overview
            </button>
            <button 
              onClick={() => setInsightsTab('scope')}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                insightsTab === 'scope'
                  ? 'border-red-500 text-red-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Scope
            </button>
            <button 
              onClick={() => setInsightsTab('timeline')}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                insightsTab === 'timeline'
                  ? 'border-red-500 text-red-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Timeline
            </button>
          </div>
        </div>
        
        {renderInsightsContent()}
      </div>
    );
  };

  const renderFrameworkContent = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Framework</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">Framework content will be displayed here</p>
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
          {activeProjectNav === 'project-insights' && renderProjectInsights()}
          {activeProjectNav === 'framework' && renderFrameworkContent()}
          {activeProjectNav !== 'project-insights' && activeProjectNav !== 'framework' && (
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