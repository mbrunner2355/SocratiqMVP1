import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Brain,
  Target,
  BookOpen,
  Shield,
  Lightbulb,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  TrendingUp,
  Users,
  Calendar,
  DollarSign,
  Zap,
  AlertCircle,
  Star
} from "lucide-react";

interface ProjectWizardProps {
  onComplete: (projectData: any) => void;
  onCancel: () => void;
  onNavigateToModule?: (moduleId: string, projectData: any) => void;
}

interface SmartSuggestion {
  id: string;
  title: string;
  description: string;
  confidence: number;
  category: "module" | "timeline" | "budget" | "strategy";
  applicable: boolean;
  reasoning: string;
}

interface WizardStep {
  id: string;
  title: string;
  description: string;
  completed: boolean;
}

export function ProjectWizard({ onComplete, onCancel, onNavigateToModule }: ProjectWizardProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [projectData, setProjectData] = useState({
    name: "",
    client: "",
    therapeuticArea: "",
    projectType: "",
    targetAudience: [] as string[],
    timeline: "",
    budget: "",
    description: "",
    modules: [] as string[],
    objectives: [] as string[],
    challenges: [] as string[]
  });

  const [suggestions, setSuggestions] = useState<SmartSuggestion[]>([]);
  const [isGeneratingSuggestions, setIsGeneratingSuggestions] = useState(false);

  const steps: WizardStep[] = [
    { id: "basics", title: "Project Basics", description: "Core project information", completed: false },
    { id: "context", title: "Strategic Context", description: "Objectives and challenges", completed: false },
    { id: "configuration", title: "Smart Configuration", description: "AI-powered recommendations", completed: false },
    { id: "review", title: "Review & Confirm", description: "Final project setup", completed: false }
  ];

  const therapeuticAreas = [
    "Oncology", "Cardiology", "Neurology", "Immunology", "Rare Diseases", 
    "Diabetes", "Respiratory", "Mental Health", "Women's Health", "Pediatrics"
  ];

  const projectTypes = [
    "Product Launch", "Disease Awareness", "HCP Education", "Patient Support",
    "Market Access", "Clinical Trial Recruitment", "Competitive Response", "Brand Repositioning"
  ];

  const targetAudiences = [
    "Healthcare Providers", "Patients", "Caregivers", "Payers", "Policy Makers", "Researchers"
  ];

  const availableModules = [
    { id: "insight-engine", name: "Insight Engine", icon: Brain, color: "text-blue-600" },
    { id: "engagement-studio", name: "Engagement Studio", icon: Target, color: "text-green-600" },
    { id: "learning-hub", name: "Learning Hub", icon: BookOpen, color: "text-purple-600" },
    { id: "equity-infrastructure", name: "Equity Infrastructure", icon: Shield, color: "text-orange-600" }
  ];

  // Generate smart suggestions based on current project data
  const generateSuggestions = async () => {
    setIsGeneratingSuggestions(true);
    
    // Simulate AI analysis
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const newSuggestions: SmartSuggestion[] = [];

    // Module suggestions based on project type and therapeutic area
    if (projectData.projectType === "Product Launch") {
      newSuggestions.push({
        id: "launch-modules",
        title: "Complete Launch Suite Recommended",
        description: "All four modules are highly recommended for product launches to ensure comprehensive market preparation and execution.",
        confidence: 95,
        category: "module",
        applicable: true,
        reasoning: "Product launches require comprehensive insights, multi-channel engagement, educational content, and equity considerations."
      });
    }

    if (projectData.therapeuticArea === "Rare Diseases") {
      newSuggestions.push({
        id: "rare-disease-equity",
        title: "Equity Infrastructure Essential",
        description: "Rare disease projects benefit significantly from equity-focused approaches due to diverse patient populations and access challenges.",
        confidence: 88,
        category: "module",
        applicable: true,
        reasoning: "Rare diseases often affect diverse populations with unique access barriers and social determinants."
      });
    }

    // Timeline suggestions
    if (projectData.projectType === "Product Launch" && projectData.therapeuticArea === "Oncology") {
      newSuggestions.push({
        id: "oncology-timeline",
        title: "Extended 9-Month Timeline Recommended",
        description: "Oncology product launches typically require longer preparation periods for HCP education and patient pathway development.",
        confidence: 82,
        category: "timeline",
        applicable: true,
        reasoning: "Complex treatment protocols and specialist education requirements in oncology necessitate extended timelines."
      });
    }

    // Budget optimization suggestions
    if (projectData.targetAudience.includes("Healthcare Providers") && projectData.targetAudience.includes("Patients")) {
      newSuggestions.push({
        id: "dual-audience-budget",
        title: "Multi-Audience Budget Allocation",
        description: "Split budget allocation: 60% HCP engagement, 40% patient education for optimal dual-audience impact.",
        confidence: 76,
        category: "budget",
        applicable: true,
        reasoning: "Dual-audience campaigns require balanced investment with HCP education taking priority for clinical adoption."
      });
    }

    // Strategy suggestions
    if (projectData.therapeuticArea === "Mental Health") {
      newSuggestions.push({
        id: "mental-health-strategy",
        title: "Stigma-Reduction Focus",
        description: "Mental health campaigns benefit from stigma-reduction messaging and peer support integration.",
        confidence: 90,
        category: "strategy",
        applicable: true,
        reasoning: "Mental health conditions face unique social stigma requiring specialized communication strategies."
      });
    }

    setSuggestions(newSuggestions);
    setIsGeneratingSuggestions(false);
  };

  useEffect(() => {
    if (currentStep === 2 && projectData.projectType && projectData.therapeuticArea) {
      generateSuggestions();
    }
  }, [currentStep, projectData.projectType, projectData.therapeuticArea]);

  const handleNext = () => {
    if (isStepValid() && currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
      
      // Generate suggestions when moving to step 2 (recommendations)
      if (currentStep === 1) {
        generateSuggestions();
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    console.log("Project creation completed:", projectData);
    onComplete(projectData);
  };

  const handleCompleteAndNavigate = (moduleId: string) => {
    console.log("Project creation completed with navigation to:", moduleId, projectData);
    
    // Always ensure navigation happens
    if (onNavigateToModule) {
      onNavigateToModule(moduleId, projectData);
    } else {
      // Fallback navigation using custom event
      window.dispatchEvent(new CustomEvent('navigateToModule', { 
        detail: { moduleId, projectData } 
      }));
    }
    
    onComplete(projectData);
  };

  const applySuggestion = (suggestion: SmartSuggestion) => {
    switch (suggestion.category) {
      case "module":
        if (suggestion.id === "launch-modules") {
          setProjectData(prev => ({
            ...prev,
            modules: ["insight-engine", "engagement-studio", "learning-hub", "equity-infrastructure"]
          }));
        } else if (suggestion.id === "rare-disease-equity") {
          setProjectData(prev => ({
            ...prev,
            modules: [...prev.modules.filter(m => m !== "equity-infrastructure"), "equity-infrastructure"]
          }));
        }
        break;
      case "timeline":
        if (suggestion.id === "oncology-timeline") {
          setProjectData(prev => ({ ...prev, timeline: "9-months" }));
        }
        break;
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0: // Project Basics
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="project-name">Project Name *</Label>
                <Input
                  id="project-name"
                  placeholder="e.g., Oncology Launch Campaign Q4"
                  value={projectData.name}
                  onChange={(e) => setProjectData(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="client">Client *</Label>
                <Select value={projectData.client} onValueChange={(value) => setProjectData(prev => ({ ...prev, client: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select client" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pharmacorp">PharmaCorp Global</SelectItem>
                    <SelectItem value="medihealth">MediHealth Solutions</SelectItem>
                    <SelectItem value="biotech">BioTech Innovations</SelectItem>
                    <SelectItem value="globalthera">Global Therapeutics</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="therapeutic-area">Therapeutic Area *</Label>
                <Select value={projectData.therapeuticArea} onValueChange={(value) => setProjectData(prev => ({ ...prev, therapeuticArea: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select therapeutic area" />
                  </SelectTrigger>
                  <SelectContent>
                    {therapeuticAreas.map(area => (
                      <SelectItem key={area} value={area.toLowerCase()}>{area}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="project-type">Project Type *</Label>
                <Select value={projectData.projectType} onValueChange={(value) => setProjectData(prev => ({ ...prev, projectType: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select project type" />
                  </SelectTrigger>
                  <SelectContent>
                    {projectTypes.map(type => (
                      <SelectItem key={type} value={type.toLowerCase().replace(/\s+/g, '-')}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Target Audience *</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {targetAudiences.map(audience => (
                  <div key={audience} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={audience}
                      checked={projectData.targetAudience.includes(audience)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setProjectData(prev => ({ ...prev, targetAudience: [...prev.targetAudience, audience] }));
                        } else {
                          setProjectData(prev => ({ ...prev, targetAudience: prev.targetAudience.filter(a => a !== audience) }));
                        }
                      }}
                    />
                    <Label htmlFor={audience} className="text-sm">{audience}</Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 1: // Strategic Context
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="description">Project Description</Label>
              <Textarea
                id="description"
                placeholder="Describe the strategic goals and context for this pharmaceutical marketing project..."
                rows={4}
                value={projectData.description}
                onChange={(e) => setProjectData(prev => ({ ...prev, description: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="objectives">Key Objectives (one per line)</Label>
              <Textarea
                id="objectives"
                placeholder="e.g., Increase HCP awareness by 40%&#10;Improve patient adherence rates&#10;Establish thought leadership"
                rows={4}
                value={projectData.objectives.join('\n')}
                onChange={(e) => setProjectData(prev => ({ ...prev, objectives: e.target.value.split('\n').filter(o => o.trim()) }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="challenges">Anticipated Challenges (one per line)</Label>
              <Textarea
                id="challenges"
                placeholder="e.g., Complex treatment protocols&#10;Limited patient awareness&#10;Competitive landscape"
                rows={4}
                value={projectData.challenges.join('\n')}
                onChange={(e) => setProjectData(prev => ({ ...prev, challenges: e.target.value.split('\n').filter(c => c.trim()) }))}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="timeline">Project Timeline</Label>
                <Select value={projectData.timeline} onValueChange={(value) => setProjectData(prev => ({ ...prev, timeline: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select timeline" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="3-months">3 Months</SelectItem>
                    <SelectItem value="6-months">6 Months</SelectItem>
                    <SelectItem value="9-months">9 Months</SelectItem>
                    <SelectItem value="12-months">12+ Months</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="budget">Budget Range</Label>
                <Select value={projectData.budget} onValueChange={(value) => setProjectData(prev => ({ ...prev, budget: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select budget range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="under-100k">Under $100K</SelectItem>
                    <SelectItem value="100k-250k">$100K - $250K</SelectItem>
                    <SelectItem value="250k-500k">$250K - $500K</SelectItem>
                    <SelectItem value="500k-1m">$500K - $1M</SelectItem>
                    <SelectItem value="over-1m">Over $1M</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        );

      case 2: // Smart Configuration
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="flex items-center justify-center mb-4">
                <Sparkles className="w-8 h-8 text-purple-600 mr-2" />
                <h3 className="text-xl font-semibold">AI-Powered Recommendations</h3>
              </div>
              <p className="text-gray-600">Based on your project details, here are intelligent suggestions to optimize your campaign</p>
            </div>

            {isGeneratingSuggestions && (
              <Card className="border-dashed">
                <CardContent className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mr-3"></div>
                  <span className="text-gray-600">Analyzing project context and generating smart suggestions...</span>
                </CardContent>
              </Card>
            )}

            <div className="space-y-4">
              {suggestions.map((suggestion) => (
                <Card key={suggestion.id} className="border-l-4 border-l-blue-500">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <Lightbulb className="w-5 h-5 text-yellow-500" />
                        <h4 className="font-medium">{suggestion.title}</h4>
                        <Badge variant="outline" className="text-xs">
                          {suggestion.confidence}% confidence
                        </Badge>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => applySuggestion(suggestion)}
                        className="text-xs"
                      >
                        Apply
                      </Button>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{suggestion.description}</p>
                    <div className="flex items-center text-xs text-gray-500">
                      <Star className="w-3 h-3 mr-1" />
                      {suggestion.reasoning}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Separator />

            <div className="space-y-4">
              <Label>Intelligence Modules Configuration</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {availableModules.map(module => (
                  <div key={module.id} className="flex items-center space-x-3 p-4 border rounded-lg">
                    <input
                      type="checkbox"
                      id={module.id}
                      checked={projectData.modules.includes(module.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setProjectData(prev => ({ ...prev, modules: [...prev.modules, module.id] }));
                        } else {
                          setProjectData(prev => ({ ...prev, modules: prev.modules.filter(m => m !== module.id) }));
                        }
                      }}
                    />
                    <div className="flex items-center space-x-2">
                      <module.icon className={`w-4 h-4 ${module.color}`} />
                      <Label htmlFor={module.id} className="text-sm font-medium">{module.name}</Label>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 3: // Review & Confirm
        return (
          <div className="space-y-6">
            <div className="text-center">
              <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Project Configuration Complete</h3>
              <p className="text-gray-600">Review your project setup and confirm to create</p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Project Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-600">Project Name:</span>
                    <div>{projectData.name || "Not specified"}</div>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Client:</span>
                    <div>{projectData.client || "Not specified"}</div>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Therapeutic Area:</span>
                    <div>{projectData.therapeuticArea || "Not specified"}</div>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Project Type:</span>
                    <div>{projectData.projectType || "Not specified"}</div>
                  </div>
                </div>

                <Separator />

                <div>
                  <span className="font-medium text-gray-600">Target Audience:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {projectData.targetAudience.map(audience => (
                      <Badge key={audience} variant="secondary" className="text-xs">{audience}</Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="font-medium text-gray-600">Selected Modules:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {projectData.modules.map(moduleId => {
                      const module = availableModules.find(m => m.id === moduleId);
                      return module ? (
                        <Badge key={moduleId} variant="default" className="text-xs">{module.name}</Badge>
                      ) : null;
                    })}
                  </div>
                </div>

                {projectData.objectives.length > 0 && (
                  <div>
                    <span className="font-medium text-gray-600">Objectives:</span>
                    <ul className="mt-1 text-sm space-y-1">
                      {projectData.objectives.map((obj, idx) => (
                        <li key={idx} className="flex items-start">
                          <CheckCircle className="w-3 h-3 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                          {obj}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        );

      default:
        return null;
    }
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 0:
        return projectData.name && projectData.client && projectData.therapeuticArea && 
               projectData.projectType && projectData.targetAudience.length > 0;
      case 1:
        return true; // All fields optional in this step
      case 2:
        return projectData.modules.length > 0;
      case 3:
        return true;
      default:
        return false;
    }
  };

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center">
              <Zap className="w-6 h-6 mr-2 text-purple-600" />
              Dynamic Project Creation Wizard
            </CardTitle>
            <p className="text-sm text-gray-600 mt-1">AI-powered project setup with intelligent recommendations</p>
          </div>
          <Button variant="outline" onClick={onCancel}>Cancel</Button>
        </div>
        
        {/* Progress indicator */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Step {currentStep + 1} of {steps.length}</span>
            <span>{Math.round(((currentStep + 1) / steps.length) * 100)}% Complete</span>
          </div>
          <Progress value={((currentStep + 1) / steps.length) * 100} className="h-2 progress-gradient-blue-purple [&>div]:bg-gradient-blue-purple" />
          
          <div className="flex justify-between mt-4">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-medium ${
                  index <= currentStep ? 'bg-purple-600 border-purple-600 text-white' : 'border-gray-300 text-gray-400'
                }`}>
                  {index + 1}
                </div>
                <div className="ml-2 hidden md:block">
                  <div className={`text-sm font-medium ${index <= currentStep ? 'text-purple-600' : 'text-gray-400'}`}>
                    {step.title}
                  </div>
                  <div className="text-xs text-gray-500">{step.description}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="min-h-[500px]">
          {renderStep()}
        </div>

        <div className="flex justify-between mt-8 pt-4 border-t">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentStep === 0}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>

          <div className="flex space-x-2">
            {currentStep < steps.length - 1 ? (
              <Button
                onClick={handleNext}
                disabled={!isStepValid()}
                style={{ backgroundColor: '#9B7FB8' }}
              >
                Next
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <div className="flex space-x-2">
                <Button
                  onClick={handleComplete}
                  disabled={!isStepValid()}
                  variant="outline"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Create Project
                </Button>
                <Button
                  onClick={() => handleCompleteAndNavigate("insight-engine")}
                  disabled={!isStepValid()}
                  style={{ backgroundColor: '#9B7FB8' }}
                >
                  <Brain className="w-4 h-4 mr-2" />
                  Create & Start Insights
                </Button>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}