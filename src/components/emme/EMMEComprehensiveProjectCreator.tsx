import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, MessageCircle, BarChart3, FileText, Users, Play, Map, Activity, Pin, PinOff } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';

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

// Helper function to get navigation icons
const getNavIcon = (iconName: string) => {
  switch (iconName) {
    case 'chart': return BarChart3;
    case 'document': return FileText;
    case 'content': return Users;
    case 'play': return Play;
    case 'map': return Map;
    default: return Activity;
  }
};

export function EMMEComprehensiveProjectCreator() {
  const [activeTab, setActiveTab] = useState('organization-overview');
  const [projectName, setProjectName] = useState('VMS Global');
  const [isProjectSetup, setIsProjectSetup] = useState(true);
  const [activeProjectNav, setActiveProjectNav] = useState('project-insights');
  const [insightsTab, setInsightsTab] = useState('overview');
  const [frameworkTab, setFrameworkTab] = useState('background');
  const [activeAccordion, setActiveAccordion] = useState('mission-vision');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
  const [sidebarPinned, setSidebarPinned] = useState(false);
  
  // Mission Vision form data
  const [missionVisionData, setMissionVisionData] = useState({
    missionStatement: 'Global mission, introduced as part of its strategic repositioning to integrate its life science focus across pharmaceuticals, consumer health, and other science.',
    vision: 'To be a trusted leader in life sciences, advancing health through innovation and sustainability, providing long-term societal value.',
    coreValues: 'Leadership, Integrity, Agility, Efficiency',
    commitmentAreas: 'Sustainability, Innovation, Patient Outcomes, and Collaboration',
    innovationPrinciple: 'Innovation for People and Planet – Using science to improve quality of life while reducing ecological footprint.',
    patientCentricity: 'Especially in pharma, promoting access-based innovation.',
    digitalTransformation: 'Democratizing access and enhancing R&D capabilities.',
    strategicCommitment: 'Committed to providing 100 million women in low- and middle-income countries (LMICs) with access to modern contraception by 2030. This initiative aims to enhance women\'s health, rights, and economic status, contributing significantly to gender equality and sustainable development.',
    pricingStrategy: 'Adapting pricing to local purchasing power in LMICs, aiming to make contraceptives more affordable. Working to increase access to hormonal IUSs.',
    challengeInitiative: 'In collaboration with Bill & Melinda Gates Foundation and others, assisting cities in Africa and Asia to rapidly and sustainably scale up reproductive health solutions for women and girls in urban poverty.',
    worldContraceptionDay: 'Co-founded WCD and the "Your Life" campaign to provide young people with accurate information on sexual and reproductive health, encouraging informed decisions.',
    environmentalIssue: 'Linked to serious environmental issue connected to various adverse health effects, particularly concerning women\'s health — negative fertility impact, potential associations with breast cancer, menstrual irregularities and hormonal disruption, and reduced fertility rates.',
    deiCommitments: 'Established clear global commitments for gender balance and aims to increase the number of women at all management levels globally to 50% by 2030.',
    employeeBenefits: 'Offers comprehensive benefits to support employees through various life stages, including maternity leave and menopause.',
    researchQuestion: 'Let\'s take a deeper dive into public perceptions, especially in regard to women\'s health? Are there any direct correlations to either positive or negative women\'s health outcomes?'
  });

  const handleMissionVisionChange = (field: string, value: string) => {
    setMissionVisionData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Chat functionality
  const [chatMessages, setChatMessages] = useState<Array<{id: string, content: string, sender: 'user' | 'emme', timestamp: Date}>>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [backgroundTab, setBackgroundTab] = useState('organization-overview');
  const [frameworkDropdownOpen, setFrameworkDropdownOpen] = useState(false);

  const sendMessageToEmme = async (message: string) => {
    const userMessage = {
      id: Date.now().toString(),
      content: message,
      sender: 'user' as const,
      timestamp: new Date()
    };
    
    setChatMessages(prev => [...prev, userMessage]);
    setIsTyping(true);

    try {
      const response = await fetch('/api/public/emme-question', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: message,
          context: `VMS Global Campaign - Women's Health Pharmaceutical Intelligence - Framework Background: Mission, Vision and Core Values`,
          agentId: 'emme-engage'
        })
      });

      const data = await response.json();
      
      const emmeResponse = {
        id: (Date.now() + 1).toString(),
        content: data.result || data.message || "I'm analyzing your pharmaceutical intelligence question. Let me provide strategic insights based on the current market data and competitive landscape.",
        sender: 'emme' as const,
        timestamp: new Date()
      };
      
      setChatMessages(prev => [...prev, emmeResponse]);
    } catch (error) {
      const errorResponse = {
        id: (Date.now() + 1).toString(),
        content: "I'm currently processing pharmaceutical market intelligence. Based on women's health trends and competitive analysis, I can provide strategic insights for your VMS campaign planning.",
        sender: 'emme' as const,
        timestamp: new Date()
      };
      setChatMessages(prev => [...prev, errorResponse]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSuggestedQuestion = (question: string) => {
    sendMessageToEmme(question);
  };

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
            status: project.status || (!project.developmentStage || !project.patientPopulation ? 'draft' : 'active')
          });
          // Update project in localStorage with correct status
          const existingProjects = JSON.parse(localStorage.getItem('emme-projects') || '[]');
          const updatedProjects = existingProjects.map((p: any) => 
            p.id === project.id ? { ...p, status: (!p.developmentStage || !p.patientPopulation ? 'draft' : p.status || 'active') } : p
          );
          localStorage.setItem('emme-projects', JSON.stringify(updatedProjects));
          
          // Clear edit mode flag
          sessionStorage.removeItem('edit-mode');
        } else {
          // Regular project workspace - update project status if incomplete and set formData
          const updatedProject = {
            ...project,
            status: (!project.developmentStage || !project.patientPopulation) ? 'draft' : (project.status || 'active')
          };
          
          setFormData(updatedProject);
          
          // Update localStorage and sessionStorage with correct status
          const existingProjects = JSON.parse(localStorage.getItem('emme-projects') || '[]');
          const updatedProjects = existingProjects.map((p: any) => 
            p.id === updatedProject.id ? updatedProject : p
          );
          localStorage.setItem('emme-projects', JSON.stringify(updatedProjects));
          sessionStorage.setItem('current-project', JSON.stringify(updatedProject));
          
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
    status: 'draft'
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
      const currentProject = sessionStorage.getItem('current-project');
      const isEditing = currentProject ? true : false;
      
      toast({
        title: isEditing ? "Project Updated" : "Project Created",
        description: `${newProject.name} has been ${isEditing ? 'updated' : 'created'} successfully!`,
      });
      
      // Invalidate projects cache to refresh the list
      queryClient.invalidateQueries({ queryKey: ['/api/projects'] });
      
      // Always redirect to project list after creation/update
      // Clear session storage and navigate to project list
      sessionStorage.removeItem('current-project');
      sessionStorage.removeItem('edit-mode');
      
      // Navigate back to project list
      window.dispatchEvent(new CustomEvent('navigate-to', { detail: 'view-projects' }));
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
    // The onSuccess handler will navigate back to project list
  };

  // Check if project has all required data for activation
  const isProjectComplete = () => {
    return formData.name && 
           formData.client && 
           formData.team && 
           formData.summary && 
           formData.developmentStage &&
           formData.patientPopulation;
  };

  // Handle project activation
  const handleActivateProject = () => {
    const updatedFormData = { ...formData, status: 'active' };
    setFormData(updatedFormData);
    
    // Update in localStorage
    const existingProjects = JSON.parse(localStorage.getItem('emme-projects') || '[]');
    const updatedProjects = existingProjects.map((p: any) => 
      p.id === formData.id ? { ...p, status: 'active' } : p
    );
    localStorage.setItem('emme-projects', JSON.stringify(updatedProjects));
    
    toast({
      title: "Project Activated",
      description: `${formData.name} is now active and ready for launch!`,
    });
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
{createProjectMutation.isPending ? 'Creating...' : (sessionStorage.getItem('current-project') ? 'Update Project' : "Create Project")}
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
            
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Competitive Analysis</h3>
                <Textarea 
                  defaultValue="• Landscape review of non-hormonal, hormonal, OTC, and natural alternatives
• SWOT analyses for key competitors
• Assessment of clinical positioning, messaging, patient targeting, and promotional strategies"
                  className="min-h-[80px] text-gray-700"
                  placeholder="Define competitive analysis scope..."
                />
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Pricing Models</h3>
                <Textarea 
                  defaultValue="• Evaluation of pricing strategies and structures across US, UK, and EU markets
• Competitive benchmarking and price sensitivity analysis
• Recommendations for pricing frameworks that support access and adoption"
                  className="min-h-[80px] text-gray-700"
                  placeholder="Define pricing model scope..."
                />
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Persona Development</h3>
                <Textarea 
                  defaultValue="• Creation of patient personas reflecting demographics, psychographics, treatment preferences, and barriers
• Development of provider personas including specialty types, decision drivers, and prescribing behaviors"
                  className="min-h-[80px] text-gray-700"
                  placeholder="Define persona development scope..."
                />
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Messaging Framework</h3>
                <Textarea 
                  defaultValue="• Development of core messaging pillars for patients, providers, and payers
• Adaptation of messaging to reflect cultural and regulatory differences across markets
• Identification of potential areas for differentiated storytelling and education"
                  className="min-h-[80px] text-gray-700"
                  placeholder="Define messaging framework scope..."
                />
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Market Access Strategy</h3>
                <Textarea 
                  defaultValue="• Assessment of reimbursement pathways and access requirements by market
• Recommendations for evidence generation, HEOR (Health Economics and Outcomes Research) support, and stakeholder engagement"
                  className="min-h-[80px] text-gray-700"
                  placeholder="Define market access strategy scope..."
                />
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Go-to-Market Models</h3>
                <Textarea 
                  defaultValue="• Development of launch models tailored to the dynamics of each region
• Channel strategy recommendations (digital, in-person, hybrid)
• Tactical launch planning support aligned to market nuances"
                  className="min-h-[80px] text-gray-700"
                  placeholder="Define go-to-market model scope..."
                />
              </div>

              <div className="mt-8 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">Scope Definition</p>
                    <p className="text-sm text-gray-600">Customize each section to match your project requirements</p>
                  </div>
                  <Button 
                    onClick={() => {
                      toast({
                        title: "Scope Saved",
                        description: "Project scope has been updated.",
                      });
                    }}
                    variant="outline"
                  >
                    Save Scope
                  </Button>
                </div>
              </div>
            </div>
          </div>
        );
      }
      
      if (insightsTab === 'timeline') {
        return (
          <div className="bg-white rounded-lg shadow-sm border p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center">
                <span className="text-gray-600 text-sm">📅</span>
              </div>
              <h2 className="text-xl font-semibold text-red-500">Project Timeline</h2>
            </div>
            
            <div className="space-y-6">
              {/* Phase 1: Research & Analysis */}
              <div className="border-l-4 border-purple-500 pl-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-4 h-4 bg-purple-500 rounded-full"></div>
                  <Input 
                    defaultValue="Phase 1: Research & Analysis"
                    className="font-semibold text-gray-900 border-none p-0 bg-transparent"
                  />
                </div>
                <Input 
                  defaultValue="Duration: 4-6 weeks"
                  className="text-sm text-gray-600 mb-3 border-none p-0 bg-transparent"
                />
                <Textarea 
                  defaultValue="• Competitive landscape analysis completion
• Patient and provider persona development
• Market access pathway assessment
• Pricing strategy framework development"
                  className="min-h-[80px] text-sm text-gray-700"
                  placeholder="Define Phase 1 activities..."
                />
              </div>

              {/* Phase 2: Strategic Development */}
              <div className="border-l-4 border-red-500 pl-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                  <Input 
                    defaultValue="Phase 2: Strategic Development"
                    className="font-semibold text-gray-900 border-none p-0 bg-transparent"
                  />
                </div>
                <Input 
                  defaultValue="Duration: 6-8 weeks"
                  className="text-sm text-gray-600 mb-3 border-none p-0 bg-transparent"
                />
                <Textarea 
                  defaultValue="• Core messaging framework creation
• Go-to-market model development
• Regional adaptation strategies (US, UK, EU)
• Stakeholder engagement plan"
                  className="min-h-[80px] text-sm text-gray-700"
                  placeholder="Define Phase 2 activities..."
                />
              </div>

              {/* Phase 3: Implementation Planning */}
              <div className="border-l-4 border-green-500 pl-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                  <Input 
                    defaultValue="Phase 3: Implementation Planning"
                    className="font-semibold text-gray-900 border-none p-0 bg-transparent"
                  />
                </div>
                <Input 
                  defaultValue="Duration: 4-5 weeks"
                  className="text-sm text-gray-600 mb-3 border-none p-0 bg-transparent"
                />
                <Textarea 
                  defaultValue="• Launch campaign development
• Channel strategy finalization
• Training materials creation
• Success metrics definition"
                  className="min-h-[80px] text-sm text-gray-700"
                  placeholder="Define Phase 3 activities..."
                />
              </div>

              {/* Phase 4: Pre-Launch */}
              <div className="border-l-4 border-blue-500 pl-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                  <Input 
                    defaultValue="Phase 4: Pre-Launch Preparation"
                    className="font-semibold text-gray-900 border-none p-0 bg-transparent"
                  />
                </div>
                <Input 
                  defaultValue="Duration: 3-4 weeks"
                  className="text-sm text-gray-600 mb-3 border-none p-0 bg-transparent"
                />
                <Textarea 
                  defaultValue="• Final regulatory approval coordination
• Launch readiness assessment
• Team training and preparation
• Market entry execution planning"
                  className="min-h-[80px] text-sm text-gray-700"
                  placeholder="Define Phase 4 activities..."
                />
              </div>

              {/* Phase 5: Launch */}
              <div className="border-l-4 border-yellow-500 pl-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
                  <Input 
                    defaultValue="Phase 5: Market Launch"
                    className="font-semibold text-gray-900 border-none p-0 bg-transparent"
                  />
                </div>
                <Input 
                  defaultValue="Duration: Ongoing"
                  className="text-sm text-gray-600 mb-3 border-none p-0 bg-transparent"
                />
                <Textarea 
                  defaultValue="• Multi-market launch execution
• Performance monitoring and optimization
• Real-time strategy adjustments
• Post-launch success evaluation"
                  className="min-h-[80px] text-sm text-gray-700"
                  placeholder="Define Phase 5 activities..."
                />
              </div>

              <div className="mt-8 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">Timeline Planning</p>
                    <p className="text-sm text-gray-600">Customize phases, durations, and activities for your project timeline</p>
                  </div>
                  <Button 
                    onClick={() => {
                      toast({
                        title: "Timeline Saved",
                        description: "Project timeline has been updated.",
                      });
                    }}
                    variant="outline"
                  >
                    Save Timeline
                  </Button>
                </div>
              </div>
            </div>

            {/* Key Milestones Summary */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-4">Key Milestones</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-purple-50 rounded-lg">
                  <h4 className="font-medium text-purple-900 mb-2">Research Complete</h4>
                  <p className="text-sm text-purple-700">Week 6: All competitive analysis and persona work finished</p>
                </div>
                <div className="p-4 bg-red-50 rounded-lg">
                  <h4 className="font-medium text-red-900 mb-2">Strategy Approval</h4>
                  <p className="text-sm text-red-700">Week 14: Final messaging and go-to-market strategy approved</p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <h4 className="font-medium text-green-900 mb-2">Launch Readiness</h4>
                  <p className="text-sm text-green-700">Week 19: All implementation plans and materials ready</p>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">Market Entry</h4>
                  <p className="text-sm text-blue-700">Week 23: Official launch across US, UK, and EU markets</p>
                </div>
              </div>
            </div>
          </div>
        );
      }
      
      // Overview tab content (default)
      return (
        <div className="bg-white rounded-lg shadow-sm border p-8">
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center">
                <span className="text-gray-600 text-sm">📊</span>
              </div>
              <h2 className="text-xl font-semibold text-red-500">Non-Hormonal Treatment Launch Preparation</h2>
            </div>
          </div>
          
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Background</h3>
            <Textarea 
              value={`Global pharmaceutical company is preparing to launch new non-hormonal treatment for moderate to severe vasomotor symptoms (VMS) associated with menopause. Product will launch simultaneously across US, UK, and EU markets.

Current landscape includes one direct non-hormonal competitor already in the market, alongside several hormonal therapies and a variety of over-the-counter and natural remedies. As patient and provider expectations evolve, there is an opportunity to position the new treatment strategically to address unmet needs, differentiate from existing options, and maximize market penetration at launch.`}
              onChange={(e) => setFormData(prev => ({ ...prev, summary: e.target.value }))}
              className="min-h-[120px] text-gray-700 mb-4"
              placeholder="Project background..."
            />
            
            <div className="space-y-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Development Stage</h4>
                <Select 
                  value={formData.developmentStage}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, developmentStage: value }))}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select development stage" />
                  </SelectTrigger>
                  <SelectContent className="z-50">
                    <SelectItem value="pre-clinical">Pre-Clinical</SelectItem>
                    <SelectItem value="phase-1">Phase I</SelectItem>
                    <SelectItem value="phase-2">Phase II</SelectItem>
                    <SelectItem value="phase-3">Phase III</SelectItem>
                    <SelectItem value="regulatory-submission">Regulatory Submission</SelectItem>
                    <SelectItem value="market-ready">Market Ready</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Target Patient Population</h4>
                <Textarea 
                  value={formData.patientPopulation}
                  onChange={(e) => setFormData(prev => ({ ...prev, patientPopulation: e.target.value }))}
                  className="min-h-[80px]"
                  placeholder="Describe the target patient population..."
                />
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Project Objectives</h3>
            <Textarea 
              defaultValue="To support successful launch, we will conduct a comprehensive launch readiness initiative designed to:
• Understand the competitive landscape across all target markets
• Clarify the value proposition for patients, providers, and payers
• Build compelling messaging that resonates across segments
• Ensure optimal market access and uptake strategies are in place"
              className="min-h-[100px] text-gray-700 mb-6"
              placeholder="Project objectives..."
            />
            
            <div className="mt-8 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">Project Status</p>
                  <p className="text-sm text-gray-600">
                    {formData.status === 'draft' ? 'Complete required fields to activate' : 'Ready for detailed planning'}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button 
                    onClick={() => {
                      // Save current changes
                      const existingProjects = JSON.parse(localStorage.getItem('emme-projects') || '[]');
                      const updatedProjects = existingProjects.map((p: any) => 
                        p.id === formData.id ? formData : p
                      );
                      localStorage.setItem('emme-projects', JSON.stringify(updatedProjects));
                      sessionStorage.setItem('current-project', JSON.stringify(formData));
                      toast({
                        title: "Changes Saved",
                        description: "Project updates have been saved.",
                      });
                    }}
                    variant="outline"
                  >
                    Save Changes
                  </Button>
                  {formData.status === 'draft' && (
                    <Button 
                      onClick={handleActivateProject}
                      disabled={!isProjectComplete()}
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      Activate Project
                    </Button>
                  )}
                </div>
              </div>
            </div>
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

  const renderFrameworkContent = () => {
    
    const renderAccordionContent = () => {
      switch (activeAccordion) {
        case 'mission-vision':
          return (
            <div className="space-y-6">
              {/* Mission Statement */}
              <div>
                <label className="block font-semibold text-gray-900 mb-2">Mission Statement</label>
                <textarea
                  value={missionVisionData.missionStatement}
                  onChange={(e) => handleMissionVisionChange('missionStatement', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg text-sm text-gray-700 focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  rows={3}
                  placeholder="Enter mission statement..."
                />
              </div>

              {/* Vision */}
              <div>
                <label className="block font-semibold text-gray-900 mb-2">Vision</label>
                <textarea
                  value={missionVisionData.vision}
                  onChange={(e) => handleMissionVisionChange('vision', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg text-sm text-gray-700 focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  rows={2}
                  placeholder="Enter vision statement..."
                />
              </div>

              {/* Core Values */}
              <div>
                <label className="block font-semibold text-gray-900 mb-2">Core Values & Framework</label>
                <input
                  type="text"
                  value={missionVisionData.coreValues}
                  onChange={(e) => handleMissionVisionChange('coreValues', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg text-sm text-gray-700 focus:ring-2 focus:ring-red-500 focus:border-red-500 mb-2"
                  placeholder="Enter core values..."
                />
                <textarea
                  value={missionVisionData.commitmentAreas}
                  onChange={(e) => handleMissionVisionChange('commitmentAreas', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg text-sm text-gray-700 focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  rows={2}
                  placeholder="Areas of commitment..."
                />
              </div>

              {/* Guiding Principles */}
              <div>
                <label className="block font-semibold text-gray-900 mb-2">Innovation Principle</label>
                <textarea
                  value={missionVisionData.innovationPrinciple}
                  onChange={(e) => handleMissionVisionChange('innovationPrinciple', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg text-sm text-gray-700 focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  rows={2}
                  placeholder="Innovation for People and Planet principle..."
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-900 mb-2">Patient-Centricity</label>
                <textarea
                  value={missionVisionData.patientCentricity}
                  onChange={(e) => handleMissionVisionChange('patientCentricity', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg text-sm text-gray-700 focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  rows={2}
                  placeholder="Patient-centricity approach..."
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-900 mb-2">Digital Transformation</label>
                <textarea
                  value={missionVisionData.digitalTransformation}
                  onChange={(e) => handleMissionVisionChange('digitalTransformation', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg text-sm text-gray-700 focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  rows={2}
                  placeholder="Digital transformation strategy..."
                />
              </div>

              {/* Strategic Commitments Section */}
              <div className="border-t border-gray-200 pt-4">
                <h4 className="font-semibold text-gray-900 mb-3">Strategic Commitments & Initiatives</h4>
                
                <div className="space-y-4">
                  <div>
                    <label className="block font-medium text-gray-900 mb-1">Strategic Commitment</label>
                    <textarea
                      value={missionVisionData.strategicCommitment}
                      onChange={(e) => handleMissionVisionChange('strategicCommitment', e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg text-sm text-gray-700 focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      rows={3}
                      placeholder="100 million women initiative details..."
                    />
                  </div>

                  <div>
                    <label className="block font-medium text-gray-900 mb-1">Equitable Pricing Strategies</label>
                    <textarea
                      value={missionVisionData.pricingStrategy}
                      onChange={(e) => handleMissionVisionChange('pricingStrategy', e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg text-sm text-gray-700 focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      rows={2}
                      placeholder="Pricing strategy for LMICs..."
                    />
                  </div>

                  <div>
                    <label className="block font-medium text-gray-900 mb-1">The Challenge Initiative (TCI)</label>
                    <textarea
                      value={missionVisionData.challengeInitiative}
                      onChange={(e) => handleMissionVisionChange('challengeInitiative', e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg text-sm text-gray-700 focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      rows={3}
                      placeholder="Gates Foundation collaboration details..."
                    />
                  </div>

                  <div>
                    <label className="block font-medium text-gray-900 mb-1">World Contraception Day (WCD)</label>
                    <textarea
                      value={missionVisionData.worldContraceptionDay}
                      onChange={(e) => handleMissionVisionChange('worldContraceptionDay', e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg text-sm text-gray-700 focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      rows={2}
                      placeholder="WCD and Your Life campaign..."
                    />
                  </div>

                  <div>
                    <label className="block font-medium text-gray-900 mb-1">Environmental Health Issues</label>
                    <textarea
                      value={missionVisionData.environmentalIssue}
                      onChange={(e) => handleMissionVisionChange('environmentalIssue', e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg text-sm text-gray-700 focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      rows={3}
                      placeholder="Environmental health impacts..."
                    />
                  </div>

                  <div>
                    <label className="block font-medium text-gray-900 mb-1">Global DEI Commitments</label>
                    <textarea
                      value={missionVisionData.deiCommitments}
                      onChange={(e) => handleMissionVisionChange('deiCommitments', e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg text-sm text-gray-700 focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      rows={2}
                      placeholder="Gender balance and DEI goals..."
                    />
                  </div>

                  <div>
                    <label className="block font-medium text-gray-900 mb-1">Employee Benefits</label>
                    <textarea
                      value={missionVisionData.employeeBenefits}
                      onChange={(e) => handleMissionVisionChange('employeeBenefits', e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg text-sm text-gray-700 focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      rows={2}
                      placeholder="Life stage benefits..."
                    />
                  </div>
                </div>
              </div>

              {/* Research Question Section */}
              <div className="border-t border-gray-200 pt-4">
                <label className="block font-medium text-gray-900 mb-2">Research Question</label>
                <textarea
                  value={missionVisionData.researchQuestion}
                  onChange={(e) => handleMissionVisionChange('researchQuestion', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg text-sm text-gray-700 focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-gray-50"
                  rows={3}
                  placeholder="Research questions and strategic insights..."
                />
              </div>

              {/* EMME Chat Interface */}
              <div className="border-t border-gray-200 pt-4">
                <h5 className="font-medium text-gray-900 mb-3">Chat with emme</h5>
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-semibold text-sm">e</span>
                    </div>
                    <div className="flex-1">
                      <h6 className="font-medium text-gray-900">emme</h6>
                      <p className="text-xs text-gray-500">Pharmaceutical Intelligence Assistant</p>
                    </div>
                  </div>
                  
                  {/* Chat Messages */}
                  {chatMessages.length > 0 && (
                    <div className="max-h-64 overflow-y-auto mb-3 space-y-3 border rounded-lg p-3 bg-gray-50">
                      {chatMessages.map((message) => (
                        <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                          <div className={`max-w-[80%] rounded-lg p-3 text-sm ${
                            message.sender === 'user' 
                              ? 'bg-blue-500 text-white' 
                              : 'bg-white text-gray-700 border'
                          }`}>
                            <p>{message.content}</p>
                            <div className={`text-xs mt-1 opacity-70 ${
                              message.sender === 'user' ? 'text-blue-100' : 'text-gray-500'
                            }`}>
                              {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </div>
                          </div>
                        </div>
                      ))}
                      {isTyping && (
                        <div className="flex justify-start">
                          <div className="bg-white text-gray-700 border rounded-lg p-3 text-sm">
                            <div className="flex items-center space-x-1">
                              <div className="flex space-x-1">
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                              </div>
                              <span className="text-xs text-gray-500 ml-2">emme is typing...</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                  
                  {/* Chat Input */}
                  <div className="space-y-3">
                    <input
                      type="text"
                      placeholder="Ask emme about pharmaceutical intelligence, market insights, or strategic analysis..."
                      className="w-full p-3 border border-gray-200 rounded-lg text-sm placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          const input = e.target as HTMLInputElement;
                          if (input.value.trim()) {
                            sendMessageToEmme(input.value);
                            input.value = '';
                          }
                        }
                      }}
                    />
                    
                    {/* Suggested Questions */}
                    <div className="space-y-2">
                      <p className="text-xs text-gray-500">Suggested questions:</p>
                      <div className="space-y-1">
                        <button 
                          className="w-full text-left p-2 text-xs bg-gray-50 hover:bg-gray-100 rounded border text-gray-700 transition-colors"
                          onClick={() => handleSuggestedQuestion("Let's take a deeper dive into public perceptions, especially in regard to women's health?")}
                        >
                          "Let's take a deeper dive into public perceptions, especially in regard to women's health?"
                        </button>
                        <button 
                          className="w-full text-left p-2 text-xs bg-gray-50 hover:bg-gray-100 rounded border text-gray-700 transition-colors"
                          onClick={() => handleSuggestedQuestion("What are the competitive advantages in the women's health therapeutic area?")}
                        >
                          "What are the competitive advantages in the women's health therapeutic area?"
                        </button>
                        <button 
                          className="w-full text-left p-2 text-xs bg-gray-50 hover:bg-gray-100 rounded border text-gray-700 transition-colors"
                          onClick={() => handleSuggestedQuestion("How can we optimize market access strategies for emerging markets?")}
                        >
                          "How can we optimize market access strategies for emerging markets?"
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Save Button */}
              <div className="flex justify-end pt-4">
                <Button 
                  onClick={() => {
                    toast({
                      title: "Mission & Vision Saved",
                      description: "All changes have been saved successfully.",
                    });
                  }}
                  className="bg-red-500 hover:bg-red-600 text-white"
                >
                  Save Changes
                </Button>
              </div>
            </div>
          );

        case 'unmet-need':
          return (
            <div className="space-y-6">
              {/* Prevalence of Vasomotor Symptoms */}
              <div className="bg-white border rounded-lg p-6">
                <h4 className="font-semibold text-gray-900 mb-4">Prevalence of Vasomotor Symptoms (VMS)</h4>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">VMS Prevalence Rate</label>
                    <div className="flex items-center space-x-4">
                      <input
                        type="text"
                        defaultValue="Up to 80% of women"
                        className="flex-1 p-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500"
                        placeholder="Enter prevalence rate..."
                      />
                    </div>
                    <textarea
                      defaultValue="experience vasomotor symptoms during the menopause transition. An estimated 20-25% report symptoms severe enough to disrupt daily life, sleep, mood, and work productivity."
                      className="w-full mt-2 p-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      rows={2}
                      placeholder="Enter description..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Global Impact Projection</label>
                    <div className="flex items-center space-x-4">
                      <input
                        type="text"
                        defaultValue="By 2030, 1.2 billion women worldwide"
                        className="flex-1 p-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500"
                        placeholder="Enter global projection..."
                      />
                    </div>
                    <textarea
                      defaultValue="will be in menopause — positioning this as a global public health priority, not just a niche women's health issue."
                      className="w-full mt-2 p-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      rows={2}
                      placeholder="Enter impact description..."
                    />
                  </div>
                </div>
              </div>

              {/* Limitations of Current Therapies */}
              <div className="bg-white border rounded-lg p-6">
                <h4 className="font-semibold text-gray-900 mb-4">Limitations of Current Therapies</h4>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Hormone Therapy (HRT) Limitations</label>
                    <textarea
                      defaultValue="Hormone therapy (HRT) remains the most effective treatment but is not appropriate for all women: Contraindicated in those with or at risk for hormone-sensitive cancers (e.g., breast cancer)."
                      className="w-full p-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      rows={3}
                      placeholder="Enter HRT limitations..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Patient Reluctance Factors</label>
                    <textarea
                      defaultValue="Many women are reluctant to use hormones due to perceived risks, side effects, or personal preference. Over-the-counter remedies like soy, black cohosh, and evening primrose offer inconsistent or placebo-level efficacy, with limited guidance from providers."
                      className="w-full p-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      rows={3}
                      placeholder="Enter patient reluctance factors..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Care Fragmentation Issues</label>
                    <textarea
                      defaultValue="Stigma and fragmentation in care often delay or prevent symptom recognition and treatment."
                      className="w-full p-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      rows={2}
                      placeholder="Enter care fragmentation issues..."
                    />
                  </div>
                </div>
              </div>

              {/* Market Demand for Non-Hormonal Options */}
              <div className="bg-white border rounded-lg p-6">
                <h4 className="font-semibold text-gray-900 mb-4">Market Demand for Non-Hormonal Options</h4>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Therapeutic Gap Description</label>
                    <textarea
                      defaultValue="There is a significant therapeutic gap for safe, effective, non-hormonal therapies — particularly for:"
                      className="w-full p-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      rows={2}
                      placeholder="Enter therapeutic gap description..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Target Populations</label>
                    <textarea
                      defaultValue="• Women with cancer histories or estrogen contraindications\n• Women of color, who are more likely to experience severe VMS but less likely to receive treatment\n• Underserved populations facing access or affordability barriers to specialty care"
                      className="w-full p-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      rows={4}
                      placeholder="Enter target populations..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Market Demand Drivers</label>
                    <textarea
                      defaultValue="Growing awareness, combined with dissatisfaction with current options, is fueling strong demand for new solutions that are:\n• Clinically effective\n• Easy to take\n• Accessible and inclusive"
                      className="w-full p-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      rows={4}
                      placeholder="Enter market demand drivers..."
                    />
                  </div>
                </div>
              </div>

              {/* HT Usage Decline Data */}
              <div className="bg-white border rounded-lg p-6">
                <h4 className="font-semibold text-gray-900 mb-4">Hormone Therapy Usage Decline</h4>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Market Context</label>
                    <textarea
                      defaultValue="A significant proportion of women in both the U.S. and U.K. opt out of hormone therapy (HT) for menopause symptoms, often due to concerns about associated risks."
                      className="w-full p-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      rows={2}
                      placeholder="Enter market context..."
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">United States</label>
                      <div className="space-y-2">
                        <input
                          type="text"
                          defaultValue="26.9% in 1999-2000"
                          className="w-full p-2 border border-gray-300 rounded text-xs focus:ring-2 focus:ring-red-500 focus:border-red-500"
                          placeholder="Historical rate..."
                        />
                        <input
                          type="text"
                          defaultValue="4.7% in 2017-2020"
                          className="w-full p-2 border border-gray-300 rounded text-xs focus:ring-2 focus:ring-red-500 focus:border-red-500"
                          placeholder="Current rate..."
                        />
                        <input
                          type="text"
                          defaultValue="1.8% as of 2023"
                          className="w-full p-2 border border-gray-300 rounded text-xs focus:ring-2 focus:ring-red-500 focus:border-red-500"
                          placeholder="Latest rate..."
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">United Kingdom</label>
                      <div className="space-y-2">
                        <input
                          type="text"
                          defaultValue="Approximately 10%"
                          className="w-full p-2 border border-gray-300 rounded text-xs focus:ring-2 focus:ring-red-500 focus:border-red-500"
                          placeholder="UK usage rate..."
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Summary</label>
                      <textarea
                        defaultValue="These figures suggest that a substantial majority of women experiencing menopausal symptoms opt out of hormone therapy, often due to risk aversion and misinformation."
                        className="w-full p-2 border border-gray-300 rounded text-xs focus:ring-2 focus:ring-red-500 focus:border-red-500"
                        rows={4}
                        placeholder="Enter summary..."
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Reasons for Decline</label>
                    <textarea
                      defaultValue="The decline is attributed to lingering concerns stemming from the Women's Health Initiative (WHI) study published in 2002, which reported increased risks of breast cancer and cardiovascular disease associated with HT. Despite subsequent analyses clarifying these risks, many women and healthcare providers remain cautious."
                      className="w-full p-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      rows={3}
                      placeholder="Enter reasons for decline..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Implications</label>
                    <div className="space-y-2">
                      <div>
                        <strong className="text-sm text-gray-900">Unmet Need:</strong>
                        <textarea
                          defaultValue="The low uptake of HT highlights a significant unmet need for alternative, non-hormonal treatments for menopausal symptoms."
                          className="w-full mt-1 p-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500"
                          rows={2}
                          placeholder="Enter unmet need implications..."
                        />
                      </div>
                      <div>
                        <strong className="text-sm text-gray-900">Educational Efforts:</strong>
                        <textarea
                          defaultValue="There's a need for improved education and communication to address misconceptions about HT and inform women about available treatment options."
                          className="w-full mt-1 p-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500"
                          rows={2}
                          placeholder="Enter educational implications..."
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Save Button */}
              <div className="flex justify-end">
                <button 
                  onClick={() => {
                    toast({
                      title: "Unmet Need Data Saved",
                      description: "All unmet need information has been updated successfully.",
                    });
                  }}
                  className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium"
                >
                  Save Unmet Need Data
                </button>
              </div>
            </div>
          );

        case 'mechanism-ce':
          return (
            <div className="space-y-6">
              {/* Drug Mechanism */}
              <div className="bg-white border rounded-lg p-6">
                <h4 className="font-semibold text-gray-900 mb-4">Mechanism of Action</h4>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Drug Classification</label>
                    <textarea
                      defaultValue="Elinzanetant is a dual neurokinin-1 (NK-1) and neurokinin-3 (NK-3) receptor antagonist, a novel, non-hormonal mechanism of action."
                      className="w-full p-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      rows={2}
                      placeholder="Enter drug classification..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Target Mechanism</label>
                    <textarea
                      defaultValue="It targets KNDy neurons (Kisspeptin, Neurokinin B, Dynorphin) in the hypothalamus — key players in thermoregulation and reproductive hormone signaling."
                      className="w-full p-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      rows={2}
                      placeholder="Enter target mechanism..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Therapeutic Effect</label>
                    <textarea
                      defaultValue="During menopause, estrogen decline causes these neurons to become hyperactive, triggering hot flashes and sleep disruptions. By modulating this pathway, elinzanetant helps restore thermal balance without affecting hormone levels."
                      className="w-full p-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      rows={3}
                      placeholder="Enter therapeutic effect..."
                    />
                  </div>
                </div>
              </div>

              {/* Clinical Evidence */}
              <div className="bg-white border rounded-lg p-6">
                <h4 className="font-semibold text-gray-900 mb-4">Clinical Evidence</h4>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phase 1 & 2 Trial Results</label>
                    <textarea
                      defaultValue="Phase 1 studies established safety, pharmacokinetics, and pharmacodynamics, confirming oral bioavailability and tolerability in healthy women."
                      className="w-full p-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      rows={2}
                      placeholder="Enter Phase 1 & 2 results..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">SWITCH-1 Trial (Phase 2b)</label>
                    <textarea
                      defaultValue="Phase 2b (SWITCH-1) trial identified the optimal 120 mg dose, showing a statistically significant reduction in hot flash frequency and severity by week 4, with a favorable safety profile."
                      className="w-full p-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      rows={2}
                      placeholder="Enter SWITCH-1 trial results..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Sleep Quality Benefits</label>
                    <textarea
                      defaultValue="Additional findings from early-phase research indicated positive effects on sleep quality, reduced wake time, and no impact on hormone-sensitive tissues."
                      className="w-full p-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      rows={2}
                      placeholder="Enter sleep quality findings..."
                    />
                  </div>
                </div>
              </div>

              {/* OASIS Phase 3 Program */}
              <div className="bg-white border rounded-lg p-6">
                <h4 className="font-semibold text-gray-900 mb-4">The OASIS Program: Phase 3 Evidence</h4>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Program Overview</label>
                    <textarea
                      defaultValue="Includes four global Phase 3 trials designed to confirm efficacy, safety, and real-world relevance:"
                      className="w-full p-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      rows={2}
                      placeholder="Enter program overview..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">OASIS 1 & 2 (26-week trials)</label>
                    <textarea
                      defaultValue="Showed significant reductions in hot flash frequency and severity by week 4, with effects beginning as early as week 1. Also improved sleep disturbances and menopause-specific quality of life scores. Discontinuation rates were low and comparable to placebo."
                      className="w-full p-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      rows={3}
                      placeholder="Enter OASIS 1 & 2 results..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">OASIS 3 (52-week extension trial)</label>
                    <textarea
                      defaultValue="Demonstrated sustained symptom relief over one year. No signals of hepatotoxicity, endometrial changes, or malignancy."
                      className="w-full p-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      rows={2}
                      placeholder="Enter OASIS 3 results..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">OASIS 4 (hormone-sensitive breast cancer study)</label>
                    <textarea
                      defaultValue="Met all primary and secondary endpoints. Confirmed elinzanetant's role as a non-hormonal option suitable for oncology patients, where hormone therapy is contraindicated."
                      className="w-full p-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      rows={2}
                      placeholder="Enter OASIS 4 results..."
                    />
                  </div>
                </div>
              </div>

              {/* Comparative Analysis */}
              <div className="bg-white border rounded-lg p-6">
                <h4 className="font-semibold text-gray-900 mb-4">Time to Effect, Durability & Quality of Life Impact</h4>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Parameter</label>
                      <div className="text-xs font-medium text-gray-900 bg-gray-100 p-2 rounded">Comparison Metric</div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">ELINZANETANT</label>
                      <div className="text-xs bg-red-50 p-2 rounded border-red-200 border">Primary Results</div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">FEZOLINETANT</label>
                      <div className="text-xs bg-gray-50 p-2 rounded border-gray-200 border">Comparator</div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-xs font-medium text-gray-700">Time to Effect:</div>
                      <input
                        type="text"
                        defaultValue="Week 1"
                        className="text-xs p-1 border border-red-300 rounded focus:ring-2 focus:ring-red-500"
                        placeholder="Enter time to effect..."
                      />
                      <input
                        type="text"
                        defaultValue="Week 4"
                        className="text-xs p-1 border border-gray-300 rounded focus:ring-2 focus:ring-red-500"
                        placeholder="Enter comparator time..."
                      />
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-xs font-medium text-gray-700">Durability:</div>
                      <input
                        type="text"
                        defaultValue="Sustained through 52 weeks"
                        className="text-xs p-1 border border-red-300 rounded focus:ring-2 focus:ring-red-500"
                        placeholder="Enter durability..."
                      />
                      <input
                        type="text"
                        defaultValue="Sustained through 24 weeks"
                        className="text-xs p-1 border border-gray-300 rounded focus:ring-2 focus:ring-red-500"
                        placeholder="Enter comparator durability..."
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-xs font-medium text-gray-700">QoL Improvements:</div>
                      <textarea
                        defaultValue="Sleep quality, menopause-specific QoL"
                        className="text-xs p-1 border border-red-300 rounded focus:ring-2 focus:ring-red-500"
                        rows={2}
                        placeholder="Enter QoL improvements..."
                      />
                      <textarea
                        defaultValue="Sleep quality, overall QoL"
                        className="text-xs p-1 border border-gray-300 rounded focus:ring-2 focus:ring-red-500"
                        rows={2}
                        placeholder="Enter comparator QoL..."
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Strategic Implications */}
              <div className="bg-white border rounded-lg p-6">
                <h4 className="font-semibold text-gray-900 mb-4">Strategic Implications</h4>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Rapid Onset Advantage</label>
                    <textarea
                      defaultValue="Elinzanetant's earlier onset of action may offer a competitive advantage for patients seeking quick relief from VMS."
                      className="w-full p-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      rows={2}
                      placeholder="Enter rapid onset advantage..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Long-Term Efficacy</label>
                    <textarea
                      defaultValue="The sustained benefits over a 52-week period position Elinzanetant as a viable long-term treatment option."
                      className="w-full p-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      rows={2}
                      placeholder="Enter long-term efficacy..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Quality of Life Differentiation</label>
                    <textarea
                      defaultValue="Both treatments improve quality of life, but Elinzanetant's impact on menopause-specific QoL measures may resonate more with patients experiencing a broader range of menopausal symptoms."
                      className="w-full p-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      rows={3}
                      placeholder="Enter QoL differentiation..."
                    />
                  </div>
                </div>
              </div>

              {/* Competitive Differentiation */}
              <div className="bg-white border rounded-lg p-6">
                <h4 className="font-semibold text-gray-900 mb-4">Competitive Differentiation</h4>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Novel Mechanism Advantage</label>
                    <textarea
                      defaultValue="First-in-class dual NK-1/NK-3 receptor antagonist specifically targeting thermoregulatory pathways, offering non-hormonal approach with precision targeting."
                      className="w-full p-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      rows={2}
                      placeholder="Enter mechanism advantage..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Safety Profile Differentiation</label>
                    <textarea
                      defaultValue="No hormone-related contraindications, suitable for women with cancer histories or those avoiding hormone therapy due to personal preference or medical contraindications."
                      className="w-full p-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      rows={2}
                      placeholder="Enter safety differentiation..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Clinical Efficacy Positioning</label>
                    <textarea
                      defaultValue="Demonstrated rapid onset of action (within 4 weeks) with sustained efficacy and favorable tolerability profile compared to existing non-hormonal alternatives."
                      className="w-full p-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      rows={2}
                      placeholder="Enter efficacy positioning..."
                    />
                  </div>
                </div>
              </div>

              {/* Save Button */}
              <div className="flex justify-end">
                <button 
                  onClick={() => {
                    toast({
                      title: "Mechanism & CE Data Saved",
                      description: "All mechanism and clinical efficacy information has been updated successfully.",
                    });
                  }}
                  className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium"
                >
                  Save Mechanism & CE Data
                </button>
              </div>
            </div>
          );

        case 'tolerability':
          return (
            <div className="space-y-6">
              {/* Safety Profile Overview */}
              <div className="bg-white border rounded-lg p-6">
                <h4 className="font-semibold text-gray-900 mb-4">Mild, Placebo-Like Side Effect Profile</h4>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Overall Safety Assessment</label>
                    <textarea
                      defaultValue="Across all phases of clinical development, Elinzanetant was consistently well tolerated, with a side effect profile comparable to placebo."
                      className="w-full p-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      rows={2}
                      placeholder="Enter overall safety assessment..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Most Frequently Reported Adverse Events (≥1% incidence)</label>
                    <textarea
                      defaultValue="Headache, Nausea, Fatigue, Nasopharyngitis"
                      className="w-full p-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      rows={2}
                      placeholder="Enter adverse events..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Event Characteristics</label>
                    <textarea
                      defaultValue="Events are generally mild, transient, and non-dose limiting = low discontinuation rates and high adherence."
                      className="w-full p-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      rows={2}
                      placeholder="Enter event characteristics..."
                    />
                  </div>
                </div>
              </div>

              {/* Hepatotoxicity & Endometrial Safety */}
              <div className="bg-white border rounded-lg p-6">
                <h4 className="font-semibold text-gray-900 mb-4">No Hepatotoxicity or Endometrial Risk</h4>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Hepatotoxicity Profile</label>
                    <textarea
                      defaultValue="Unlike some earlier NK receptor antagonists, Elinzanetant showed no signs of hepatotoxicity: No clinically relevant liver enzyme elevations in any Phase 3 trial."
                      className="w-full p-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      rows={2}
                      placeholder="Enter hepatotoxicity profile..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Long-term Safety Data (OASIS 3 and 4)</label>
                    <textarea
                      defaultValue="No endometrial hyperplasia or malignancy\nNo increased risk of breast tissue changes"
                      className="w-full p-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      rows={2}
                      placeholder="Enter long-term safety data..."
                    />
                  </div>
                </div>
              </div>

              {/* Target Population Suitability */}
              <div className="bg-white border rounded-lg p-6">
                <h4 className="font-semibold text-gray-900 mb-4">Target Population Suitability</h4>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Suitable Patient Populations</label>
                    <textarea
                      defaultValue="Elinzanetant is suitable for:"
                      className="w-full p-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      rows={1}
                      placeholder="Enter suitability overview..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Oncology-Adjacent Populations</label>
                    <textarea
                      defaultValue="Oncology-adjacent populations (e.g., women with breast cancer on endocrine therapy)"
                      className="w-full p-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      rows={2}
                      placeholder="Enter oncology population details..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Risk-Averse Patient Preference</label>
                    <textarea
                      defaultValue="Risk-averse patients who prefer non-hormonal, low-risk solutions"
                      className="w-full p-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      rows={2}
                      placeholder="Enter risk-averse patient details..."
                    />
                  </div>
                </div>
              </div>

              {/* Delivery Method & Compliance */}
              <div className="bg-white border rounded-lg p-6">
                <h4 className="font-semibold text-gray-900 mb-4">Delivery Method & Patient Compliance</h4>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Administration</label>
                    <textarea
                      defaultValue="Once-daily oral administration with no special timing requirements or dietary restrictions."
                      className="w-full p-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      rows={2}
                      placeholder="Enter administration details..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Compliance Advantages</label>
                    <textarea
                      defaultValue="Convenient oral dosing supports high patient compliance and ease of administration compared to alternative delivery methods (patches, gels, injections)."
                      className="w-full p-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      rows={2}
                      placeholder="Enter compliance advantages..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Discontinuation Rates</label>
                    <textarea
                      defaultValue="Low discontinuation rates observed across all Phase 3 trials, comparable to placebo, indicating excellent tolerability and patient acceptance."
                      className="w-full p-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      rows={2}
                      placeholder="Enter discontinuation rate data..."
                    />
                  </div>
                </div>
              </div>

              {/* Regulatory & Market Access Implications */}
              <div className="bg-white border rounded-lg p-6">
                <h4 className="font-semibold text-gray-900 mb-4">Regulatory & Market Access Implications</h4>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Regulatory Advantage</label>
                    <textarea
                      defaultValue="Clean safety profile supports streamlined regulatory approvals without need for extensive safety monitoring or contraindication warnings."
                      className="w-full p-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      rows={2}
                      placeholder="Enter regulatory advantages..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Payer Value Proposition</label>
                    <textarea
                      defaultValue="Excellent safety profile reduces healthcare system costs through lower monitoring requirements and reduced adverse event management."
                      className="w-full p-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      rows={2}
                      placeholder="Enter payer value proposition..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Prescriber Confidence</label>
                    <textarea
                      defaultValue="Placebo-like tolerability profile increases prescriber confidence, especially for patients with comorbidities or polypharmacy concerns."
                      className="w-full p-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      rows={2}
                      placeholder="Enter prescriber confidence factors..."
                    />
                  </div>
                </div>
              </div>

              {/* Save Button */}
              <div className="flex justify-end">
                <button 
                  onClick={() => {
                    toast({
                      title: "Tolerability Data Saved",
                      description: "All tolerability and delivery information has been updated successfully.",
                    });
                  }}
                  className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium"
                >
                  Save Tolerability Data
                </button>
              </div>
            </div>
          );

        case 'patient-population':
          return (
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Target Demographics</h4>
                <p className="text-sm text-gray-700">
                  Women experiencing moderate to severe menopausal symptoms seeking non-hormonal alternatives.
                </p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <h4 className="font-semibold text-purple-900 mb-2">Market Size</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="font-medium text-purple-800">US Market</p>
                    <p className="text-purple-700">~6 million women annually</p>
                  </div>
                  <div>
                    <p className="font-medium text-purple-800">EU Market</p>
                    <p className="text-purple-700">~4 million women annually</p>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Patient Characteristics</h4>
                <ul className="space-y-1 text-sm text-gray-700 ml-4">
                  <li>• Age range: 45-65 years</li>
                  <li>• Contraindicated for hormone therapy</li>
                  <li>• Preference for non-hormonal options</li>
                  <li>• Quality of life impact from symptoms</li>
                </ul>
              </div>
            </div>
          );

        case 'positioning':
          return (
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Market Position</h4>
                <p className="text-sm text-gray-700">
                  Novel non-hormonal option positioned as first-in-class dual NK receptor antagonist for women avoiding or contraindicated for hormone therapy.
                </p>
              </div>
              <div className="bg-orange-50 p-4 rounded-lg">
                <h4 className="font-semibold text-orange-900 mb-2">Competitive Advantage</h4>
                <ul className="space-y-1 text-sm text-orange-800 ml-4">
                  <li>• Novel mechanism of action</li>
                  <li>• Non-hormonal approach</li>
                  <li>• Proven efficacy in Phase 3</li>
                  <li>• Favorable safety profile</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Target Messaging</h4>
                <p className="text-sm text-gray-700">
                  Effective symptom relief without hormones - addressing the unmet need for safe, convenient treatment options.
                </p>
              </div>
            </div>
          );

        case 'access-affordability':
          return (
            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="font-medium text-blue-900">UNITED STATES</p>
                    <p className="text-blue-800">Average Among Menopausal Women</p>
                    <p className="text-blue-800 font-semibold">4.7%</p>
                    <p className="text-blue-800">Approximately 10%</p>
                  </div>
                  <div>
                    <p className="font-medium text-blue-900">SUMMARY</p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm text-gray-700">
                  These figures suggest that a substantial majority of women experiencing menopausal symptoms opt out of hormone therapy, often due to risk aversion and misinformation.
                </p>

                <div>
                  <h4 className="font-medium text-gray-900 mb-1">Implications</h4>
                  <p className="text-sm text-gray-700">
                    <strong>Unmet Need:</strong> The low uptake of HT highlights a significant unmet need for alternative, non-hormonal treatments for menopausal symptoms.
                  </p>
                  <p className="text-sm text-gray-700">
                    <strong>Educational Efforts:</strong> There's a need for improved education and communication to address misconceptions about HT and inform women about available treatment options.
                  </p>
                </div>
              </div>

              <div className="bg-yellow-50 p-4 rounded-lg">
                <h4 className="font-semibold text-yellow-900 mb-2">Market Access Strategy</h4>
                <ul className="space-y-1 text-sm text-yellow-800 ml-4">
                  <li>• Payer evidence development</li>
                  <li>• Value-based pricing models</li>
                  <li>• Patient assistance programs</li>
                  <li>• Real-world evidence generation</li>
                </ul>
              </div>
            </div>
          );

        default:
          return null;
      }
    };

    const renderOrganizationOverviewTab = () => (
      <div className="space-y-6">
        {/* Organization Overview Section */}
        <div className="bg-white rounded-lg border">
          <div className="px-4 py-3 bg-gray-100 border-b">
            <h3 className="font-semibold text-gray-900">Organization Overview</h3>
          </div>
          <div className="border-b border-gray-200">
            <button
              onClick={() => setActiveAccordion(activeAccordion === 'mission-vision' ? '' : 'mission-vision')}
              className={`w-full text-left px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors ${
                activeAccordion === 'mission-vision' ? 'bg-red-50 text-red-600 font-medium' : 'text-gray-700'
              }`}
            >
              <span className={`${activeAccordion === 'mission-vision' ? 'text-red-600' : 'text-gray-700'}`}>
                Mission, Vision and Core Values
              </span>
              <span className={`text-sm transition-transform duration-200 ${
                activeAccordion === 'mission-vision' ? 'text-red-500 rotate-180' : 'text-gray-400'
              }`}>
                ▼
              </span>
            </button>
            
            {activeAccordion === 'mission-vision' && (
              <div className="px-6 pb-6 pt-2 bg-gray-50 border-t border-gray-100">
                {renderAccordionContent()}
              </div>
            )}
          </div>
        </div>
      </div>
    );

    const renderInitiativeOverviewTab = () => (
      <div className="space-y-6">
        {/* Initiative Section */}
        <div className="bg-white rounded-lg border">
          {[
            { id: 'unmet-need', label: 'Unmet Need' },
            { id: 'mechanism-ce', label: 'Mechanism & CE' },
            { id: 'tolerability', label: 'Tolerability' },
            { id: 'patient-population', label: 'Patient Population' },
            { id: 'positioning', label: 'Positioning' },
            { id: 'access-affordability', label: 'Access & Affordability' }
          ].map((item, index) => (
            <div key={item.id} className={`${index > 0 ? 'border-t border-gray-200' : ''}`}>
              {/* Accordion Header */}
              <button
                onClick={() => setActiveAccordion(activeAccordion === item.id ? '' : item.id)}
                className={`w-full text-left px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors ${
                  activeAccordion === item.id ? 'bg-red-50 text-red-600 font-medium' : 'text-gray-700'
                }`}
              >
                <span className={`${activeAccordion === item.id ? 'text-red-600' : 'text-gray-700'}`}>
                  {item.label}
                </span>
                <span className={`text-sm transition-transform duration-200 ${
                  activeAccordion === item.id ? 'text-red-500 rotate-180' : 'text-gray-400'
                }`}>
                  ▼
                </span>
              </button>
              
              {/* Collapsible Content Area */}
              {activeAccordion === item.id && (
                <div className="px-6 pb-6 pt-2 bg-gray-50 border-t border-gray-100">
                  {renderAccordionContent()}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );

    const renderBackgroundContent = () => {
      // Use activeTab to determine which content to show since the main tabs control the content
      if (activeTab === 'organization-overview') {
        return renderOrganizationOverviewTab();
      } else if (activeTab === 'initiative-overview') {
        return renderInitiativeOverviewTab();
      } else if (activeTab === 'clinical-trials') {
        return (
          <div className="bg-white rounded-lg border p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Clinical Trials</h3>
            <p className="text-gray-600">Clinical trials configuration and data</p>
          </div>
        );
      } else if (activeTab === 'xxxx') {
        return (
          <div className="bg-white rounded-lg border p-6">
            <h3 className="font-semibold text-gray-900 mb-4">XXXX Module</h3>
            <p className="text-gray-600">XXXX configuration options</p>
          </div>
        );
      } else if (activeTab === 'xxx') {
        return (
          <div className="bg-white rounded-lg border p-6">
            <h3 className="font-semibold text-gray-900 mb-4">XXX Module</h3>
            <p className="text-gray-600">XXX configuration options</p>
          </div>
        );
      } else {
        // Default to organization overview
        return renderOrganizationOverviewTab();
      }
    };

    const renderExplorationContent = () => (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Product Overview - Key Findings from OASIS Trials</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Efficacy</h3>
              <p className="text-sm text-gray-700 mb-2">
                Eluzainetalnt demonstrated statistically significant reductions in the frequency and severity of moderate to severe VMS from baseline to weeks 4 and 12 compared to placebo.
              </p>
              <p className="text-sm text-gray-700">
                Notably, improvements were observed as early as week 1 and were sustained over the study periods.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Safety</h3>
              <p className="text-sm text-gray-700">
                The long-term safety profile over 52 weeks was consistent with previous findings, confirming a favorable safety profile. No incidences of endometrial hyperplasia or malignant neoplasms were observed, and there was no signal of hepatotoxicity.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Regulatory Progress</h3>
              <p className="text-sm text-gray-700">
                Based on the positive outcomes from the OASIS program, Bayer submitted data to health authorities for marketing authorization of eluzainetalnt as a treatment for moderate to severe VMS associated with menopause. In October 2024, Bayer applied for approval with the European Medicines Agency (EMA).
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Conclusion</h3>
              <p className="text-sm text-gray-700">
                The progression of eluzainetalnt through the OASIS Phase 3 trials has solidified its potential as a non-hormonal, once-daily oral treatment for moderate to severe VMS associated with menopause. The consistent efficacy and favorable safety profile observed across these studies support its promise as a novel therapeutic option for women seeking relief from menopausal symptoms.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Sources & References</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="p-3 bg-blue-50 rounded-lg">
                <p className="text-sm font-medium text-blue-900">Reuters Healthcare Report</p>
                <p className="text-xs text-blue-700">Pharmaceutical applications and regulatory updates</p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <p className="text-sm font-medium text-green-900">PatientCareOnline Clinical Review</p>
                <p className="text-xs text-green-700">Eluzainetalnt efficacy data and breast cancer treatment protocols</p>
              </div>
              <div className="p-3 bg-purple-50 rounded-lg">
                <p className="text-sm font-medium text-purple-900">BMJ Clinical Evidence</p>
                <p className="text-xs text-purple-700">Peer-reviewed clinical outcomes and safety profiles</p>
              </div>
              <div className="p-3 bg-orange-50 rounded-lg">
                <p className="text-sm font-medium text-orange-900">ClinicalTrials.gov Database</p>
                <p className="text-xs text-orange-700">OASIS trial registry and complete study protocols</p>
              </div>
              <div className="p-3 bg-red-50 rounded-lg">
                <p className="text-sm font-medium text-red-900">Bayer Pharmaceutical News</p>
                <p className="text-xs text-red-700">Phase 3 study announcements and regulatory submissions</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );

    const renderHumanInsightsContent = () => (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Human Insights & Research Questions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">ASKED CHAT: Strategic Research Direction</h3>
              <p className="text-sm text-gray-700 mb-3">
                "The next step in this project would be a deep dive into Eluzainetalnt. I think we should start from the beginning. I guess that would be with the early clinical trials, right? Or possibly journal articles and research?"
              </p>
              
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">Acumen Questions</h4>
                <ul className="space-y-1 text-sm text-blue-800">
                  <li>• Where does the information from the OASIS Trials come from? Is that known from the customer?</li>
                  <li>• Where does this information go in this screen?</li>
                  <li>• What CHAT question is asked when these sources are uploaded to CHAT and then asked this chat question?</li>
                </ul>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Strategic Thinking</h3>
              <p className="text-sm text-gray-700">
                "My thought here is that we create a Corpus or Corpora of information from which we can. The insights would be included in that."
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Information Architecture</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">Data Sources</h4>
                  <ul className="space-y-1 text-xs text-gray-700">
                    <li>• Clinical trial databases</li>
                    <li>• Peer-reviewed publications</li>
                    <li>• Regulatory submissions</li>
                    <li>• Market research reports</li>
                  </ul>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">AI Integration</h4>
                  <ul className="space-y-1 text-xs text-gray-700">
                    <li>• Document corpus creation</li>
                    <li>• Intelligent question answering</li>
                    <li>• Strategic insight generation</li>
                    <li>• Evidence synthesis</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );

    return (
      <div className="space-y-6">
        {frameworkTab === 'background' && renderBackgroundContent()}
        {frameworkTab === 'exploration' && renderExplorationContent()}
        {frameworkTab === 'human-insights' && renderHumanInsightsContent()}
      </div>
    );
  };



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

  const renderClientContent = () => {
    const [uploadedFiles, setUploadedFiles] = useState([
      {
        id: '1',
        name: 'Tech requirements.pdf',
        type: 'pdf',
        size: '2.4 MB',
        uploadDate: 'Jan 4, 2025',
        uploader: 'Olivia Rhye'
      },
      {
        id: '2', 
        name: 'Dashboard screenshot.jpg',
        type: 'image',
        size: '1.8 MB',
        uploadDate: 'Jan 4, 2025',
        uploader: 'Phoenix Baker'
      },
      {
        id: '3',
        name: 'Dashboard prototype recording.mp4',
        type: 'video',
        size: '12.3 MB',
        uploadDate: 'Jan 2, 2025',
        uploader: 'Lana Steiner'
      }
    ]);

    const [activeTab, setActiveTab] = useState('upload');
    const [dragActive, setDragActive] = useState(false);
    const [webUrl, setWebUrl] = useState('');

    const handleDrag = (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (e.type === 'dragenter' || e.type === 'dragover') {
        setDragActive(true);
      } else if (e.type === 'dragleave') {
        setDragActive(false);
      }
    };

    const handleDrop = (e) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);
      
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        handleFiles(e.dataTransfer.files);
      }
    };

    const handleFiles = (files) => {
      Array.from(files).forEach(file => {
        const newFile = {
          id: Date.now() + Math.random(),
          name: file.name,
          type: file.type.includes('image') ? 'image' : 
                file.type.includes('video') ? 'video' :
                file.type.includes('pdf') ? 'pdf' : 'document',
          size: (file.size / (1024 * 1024)).toFixed(1) + ' MB',
          uploadDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          uploader: 'Current User'
        };
        setUploadedFiles(prev => [newFile, ...prev]);
      });
      
      toast({
        title: "Files Uploaded",
        description: `Successfully uploaded ${files.length} file(s)`,
      });
    };

    const handleWebUpload = () => {
      if (webUrl.trim()) {
        const fileName = webUrl.split('/').pop() || 'web-content';
        const newFile = {
          id: Date.now(),
          name: fileName,
          type: 'web',
          size: '-- MB',
          uploadDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          uploader: 'Current User'
        };
        setUploadedFiles(prev => [newFile, ...prev]);
        setWebUrl('');
        
        toast({
          title: "Web Content Added",
          description: "Successfully added content from web link",
        });
      }
    };

    const removeFile = (fileId) => {
      setUploadedFiles(prev => prev.filter(file => file.id !== fileId));
      toast({
        title: "File Removed",
        description: "File has been removed from the project",
      });
    };

    const getFileIcon = (type) => {
      switch (type) {
        case 'pdf':
          return '📄';
        case 'image':
          return '🖼️';
        case 'video':
          return '🎥';
        case 'web':
          return '🌐';
        default:
          return '📁';
      }
    };

    return (
      <div className="space-y-6">
        <div className="border-b border-gray-200">
          <div className="flex space-x-8">
            <button
              onClick={() => setActiveTab('upload')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'upload'
                  ? 'border-red-500 text-red-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Upload documents
            </button>
            <button
              onClick={() => setActiveTab('ask-emme')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'ask-emme'
                  ? 'border-red-500 text-red-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Ask emme
            </button>
          </div>
        </div>

        {activeTab === 'upload' && (
          <div className="space-y-6">
            {/* Drag and Drop Upload Area */}
            <div
              className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
                dragActive
                  ? 'border-red-300 bg-red-50'
                  : 'border-gray-300 bg-gray-50 hover:bg-gray-100'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <div className="space-y-4">
                <div className="mx-auto w-12 h-12 text-gray-400">
                  <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Drag and drop or click here</h3>
                  <p className="text-sm text-gray-600">to upload your image (max 2 MB)</p>
                </div>
                <input
                  type="file"
                  multiple
                  onChange={(e) => handleFiles(e.target.files)}
                  className="hidden"
                  id="file-upload"
                  accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.mp4,.mov"
                />
                <label
                  htmlFor="file-upload"
                  className="inline-block px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium cursor-pointer"
                >
                  Choose Files
                </label>
              </div>
            </div>

            {/* Web Link Upload */}
            <div className="border rounded-lg p-4">
              <div className="flex items-center space-x-4">
                <span className="text-sm font-medium text-gray-700">Link from the web</span>
                <div className="flex-1 flex space-x-2">
                  <input
                    type="url"
                    value={webUrl}
                    onChange={(e) => setWebUrl(e.target.value)}
                    placeholder="http://imgur.com/GenTYVrL.png"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  />
                  <button
                    onClick={handleWebUpload}
                    disabled={!webUrl.trim()}
                    className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 disabled:text-gray-400"
                  >
                    Add
                  </button>
                  <button
                    onClick={() => setWebUrl('')}
                    className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>

            {/* File List */}
            <div className="space-y-3">
              <div className="grid grid-cols-12 gap-4 px-4 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider">
                <div className="col-span-5">File name</div>
                <div className="col-span-2">Date uploaded</div>
                <div className="col-span-2">Uploader</div>
                <div className="col-span-2">Size</div>
                <div className="col-span-1"></div>
              </div>
              
              {uploadedFiles.map((file) => (
                <div key={file.id} className="grid grid-cols-12 gap-4 px-4 py-3 bg-white border rounded-lg hover:bg-gray-50">
                  <div className="col-span-5 flex items-center space-x-3">
                    <input
                      type="checkbox"
                      className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                    />
                    <span className="text-lg">{getFileIcon(file.type)}</span>
                    <span className="text-sm font-medium text-gray-900 truncate">{file.name}</span>
                  </div>
                  <div className="col-span-2 flex items-center text-sm text-gray-500">
                    {file.uploadDate}
                  </div>
                  <div className="col-span-2 flex items-center text-sm text-gray-500">
                    {file.uploader}
                  </div>
                  <div className="col-span-2 flex items-center text-sm text-gray-500">
                    {file.size}
                  </div>
                  <div className="col-span-1 flex items-center justify-end">
                    <button
                      onClick={() => removeFile(file.id)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'ask-emme' && (
          <div className="bg-white border rounded-lg p-6">
            <div className="text-center py-8">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-white text-2xl font-bold">e</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Ask emme for assistance</h3>
              <p className="text-gray-600 mb-4">Get help with your client content management and pharmaceutical intelligence queries.</p>
              <button className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-lg font-medium">
                Start Chat with emme
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

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
                <MessageCircle className="w-5 h-5 text-purple-600 hover:text-purple-700 cursor-pointer" title="Chat with EMME" />
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
      {/* Collapsible Sidebar */}
      <div 
        className={`${sidebarCollapsed && !sidebarPinned ? 'w-16' : 'w-64'} bg-white border-r border-gray-200 transition-all duration-300 ease-in-out`}
        onMouseEnter={() => !sidebarPinned && setSidebarCollapsed(false)}
        onMouseLeave={() => !sidebarPinned && setSidebarCollapsed(true)}
      >
        <div className="p-4">
          {/* Sidebar Header */}
          <div className="flex items-center justify-between mb-4">
            {(!sidebarCollapsed || sidebarPinned) && (
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 bg-gray-300 rounded"></div>
                <span className="font-medium text-gray-800 truncate">{projectName}</span>
              </div>
            )}
            <button
              onClick={() => setSidebarPinned(!sidebarPinned)}
              className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
              title={sidebarPinned ? 'Unpin sidebar' : 'Pin sidebar'}
            >
              {sidebarPinned ? <PinOff className="w-4 h-4" /> : <Pin className="w-4 h-4" />}
            </button>
          </div>
          
          {/* Navigation Items */}
          <div className="space-y-1">
            {PROJECT_NAV_ITEMS.map((item) => {
              const IconComponent = getNavIcon(item.icon);
              
              if (item.id === 'framework') {
                return (
                  <div key={item.id} className="relative">
                    <button
                      onClick={() => {
                        setActiveProjectNav(item.id);
                        setFrameworkDropdownOpen(!frameworkDropdownOpen);
                        // Save last visited section for this project
                        const currentProject = sessionStorage.getItem('current-project');
                        if (currentProject) {
                          const project = JSON.parse(currentProject);
                          sessionStorage.setItem(`project-${project.id}-last-section`, item.id);
                        }
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 text-sm rounded transition-colors ${
                        item.id === activeProjectNav
                          ? 'bg-purple-50 text-purple-700 font-medium'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                      title={sidebarCollapsed && !sidebarPinned ? item.label : ''}
                    >
                      <div className="flex items-center">
                        <IconComponent className="w-5 h-5 flex-shrink-0" />
                        {(!sidebarCollapsed || sidebarPinned) && (
                          <span className="ml-3 truncate">{item.label}</span>
                        )}
                      </div>
                      {(!sidebarCollapsed || sidebarPinned) && (
                        <span className={`text-xs transition-transform duration-200 ${
                          frameworkDropdownOpen ? 'rotate-180' : ''
                        }`}>
                          ▼
                        </span>
                      )}
                    </button>
                    
                    {frameworkDropdownOpen && (!sidebarCollapsed || sidebarPinned) && (
                      <div className="ml-6 mt-1 space-y-1">
                        {[
                          { id: 'background', label: 'Background' },
                          { id: 'exploration', label: 'Exploration' },
                          { id: 'human-insights', label: 'Human Insights' }
                        ].map((subItem) => (
                          <button
                            key={subItem.id}
                            onClick={() => {
                              setFrameworkTab(subItem.id);
                            }}
                            className={`w-full text-left px-3 py-1.5 text-xs rounded transition-colors ${
                              frameworkTab === subItem.id
                                ? 'bg-red-50 text-red-600 font-medium'
                                : 'text-gray-500 hover:bg-gray-50'
                            }`}
                          >
                            {subItem.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              }
              
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveProjectNav(item.id);
                    // Save last visited section for this project
                    const currentProject = sessionStorage.getItem('current-project');
                    if (currentProject) {
                      const project = JSON.parse(currentProject);
                      sessionStorage.setItem(`project-${project.id}-last-section`, item.id);
                    }
                  }}
                  className={`w-full flex items-center px-3 py-2 text-sm rounded transition-colors ${
                    item.id === activeProjectNav
                      ? 'bg-purple-50 text-purple-700 font-medium'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                  title={sidebarCollapsed && !sidebarPinned ? item.label : ''}
                >
                  <IconComponent className="w-5 h-5 flex-shrink-0" />
                  {(!sidebarCollapsed || sidebarPinned) && (
                    <span className="ml-3 truncate">{item.label}</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        <div className="bg-white border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold text-gray-900 capitalize">{activeProjectNav}</h1>
              {formData.status === 'draft' && (
                <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">
                  DRAFT
                </span>
              )}
            </div>
            <div className="flex items-center gap-4">
              {formData.status === 'draft' && (
                <Button 
                  onClick={handleActivateProject}
                  className="bg-green-600 hover:bg-green-700 text-white"
                  disabled={!isProjectComplete()}
                >
                  Activate Project
                </Button>
              )}
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <Input placeholder="Search..." className="pl-10 w-64" />
              </div>
              <MessageCircle className="w-5 h-5 text-purple-600 hover:text-purple-700 cursor-pointer" />
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
          {activeProjectNav === 'client-content' && renderClientContent()}
          {!['project-insights', 'framework', 'client-content'].includes(activeProjectNav) && (
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