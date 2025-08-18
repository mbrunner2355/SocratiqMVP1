import { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { Sparkles, Brain, Target, Users, FileText, TrendingUp, ArrowRight, ArrowLeft, CheckCircle } from 'lucide-react';

interface ProjectFormData {
  name: string;
  client: string;
  therapeuticArea: string;
  projectType: string;
  targetAudiences: string[];
}

export function EMMECreateProject() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<ProjectFormData>({
    name: '',
    client: '',
    therapeuticArea: '',
    projectType: '',
    targetAudiences: []
  });
  
  const { toast } = useToast();

  // Project creation mutation
  const createProjectMutation = useMutation({
    mutationFn: (projectData: any) => apiRequest('/api/emme/projects', { 
      method: 'POST', 
      body: {
        name: projectData.name,
        client: projectData.client,
        therapeuticArea: projectData.therapeuticArea,
        projectType: projectData.projectType,
        targetAudiences: projectData.targetAudiences,
        status: 'active',
        phase: 'planning',
        description: `${projectData.projectType} project for ${projectData.therapeuticArea}`,
        metadata: {
          createdFromWizard: true,
          targetAudiences: projectData.targetAudiences
        }
      }
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/emme/projects'] });
      toast({
        title: "Success!",
        description: "Project created successfully. Redirecting to project dashboard...",
      });
      
      // Navigate to projects view
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent('navigateToModule', {
          detail: { moduleId: 'projects' }
        }));
      }, 1500);
    },
    onError: (error) => {
      console.error('Error creating project:', error);
      toast({
        title: "Error",
        description: "Failed to create project. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Pharmaceutical therapeutic areas for development
  const therapeuticAreas = [
    { value: 'oncology', label: 'Oncology' },
    { value: 'cardiology', label: 'Cardiology' },
    { value: 'neurology', label: 'Neurology' },
    { value: 'immunology', label: 'Immunology' },
    { value: 'endocrinology', label: 'Endocrinology' },
    { value: 'respiratory', label: 'Respiratory' },
    { value: 'dermatology', label: 'Dermatology' },
    { value: 'gastroenterology', label: 'Gastroenterology' },
    { value: 'infectious_diseases', label: 'Infectious Diseases' },
    { value: 'rare_diseases', label: 'Rare Diseases' }
  ];

  const { data: projectTemplates } = useQuery({
    queryKey: ['/api/emme/project-templates', formData.therapeuticArea, formData.projectType],
    enabled: !!formData.therapeuticArea
  });

  const { data: marketIntelligence } = useQuery({
    queryKey: [`/api/emme/market-intelligence/${formData.therapeuticArea}/${formData.projectType}`],
    enabled: !!formData.therapeuticArea && !!formData.projectType
  });

  const targetAudienceOptions = [
    'Healthcare Providers',
    'Patients', 
    'Caregivers',
    'Payers',
    'Policy Makers',
    'Researchers'
  ];

  const projectTypes = [
    { value: 'launch_campaign', label: 'Launch Campaign' },
    { value: 'patient_education', label: 'Patient Education' },
    { value: 'hcp_engagement', label: 'HCP Engagement' },
    { value: 'market_access', label: 'Market Access' },
    { value: 'competitive_analysis', label: 'Competitive Analysis' }
  ];

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleAudienceToggle = (audience: string) => {
    setFormData(prev => ({
      ...prev,
      targetAudiences: prev.targetAudiences.includes(audience)
        ? prev.targetAudiences.filter(a => a !== audience)
        : [...prev.targetAudiences, audience]
    }));
  };

  const handleCreateProject = () => {
    if (!formData.name || !formData.client || !formData.therapeuticArea || !formData.projectType || formData.targetAudiences.length === 0) {
      toast({
        title: "Missing Information",
        description: "Please complete all required fields before creating the project.",
        variant: "destructive",
      });
      return;
    }
    
    createProjectMutation.mutate(formData);
  };

  const getProgressPercentage = () => {
    return (currentStep / 4) * 100;
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-purple-100 rounded-full">
          <Sparkles className="w-8 h-8 text-purple-600" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900">Project Basics</h3>
        <p className="text-gray-600">Core project information</p>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="projectName">Project Name *</Label>
          <Input
            id="projectName"
            placeholder="e.g. Oncology Launch Campaign Q4"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
          />
        </div>

        <div>
          <Label htmlFor="client">Client *</Label>
          <Select value={formData.client} onValueChange={(value) => setFormData(prev => ({ ...prev, client: value }))}>
            <SelectTrigger>
              <SelectValue placeholder="Select client" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="internal">Internal Project</SelectItem>
              <SelectItem value="client-a">Pharmaceutical Client A</SelectItem>
              <SelectItem value="client-b">Biotech Client B</SelectItem>
              <SelectItem value="client-c">Device Client C</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="therapeuticArea">Therapeutic Area *</Label>
          <Select value={formData.therapeuticArea} onValueChange={(value) => setFormData(prev => ({ ...prev, therapeuticArea: value }))}>
            <SelectTrigger>
              <SelectValue placeholder="Select therapeutic area" />
            </SelectTrigger>
            <SelectContent>
              {therapeuticAreas.map((area) => (
                <SelectItem key={area.value} value={area.value}>
                  {area.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="projectType">Project Type *</Label>
          <Select value={formData.projectType} onValueChange={(value) => setFormData(prev => ({ ...prev, projectType: value }))}>
            <SelectTrigger>
              <SelectValue placeholder="Select project type" />
            </SelectTrigger>
            <SelectContent>
              {projectTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-purple-100 rounded-full">
          <Target className="w-8 h-8 text-purple-600" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900">Strategic Content</h3>
        <p className="text-gray-600">Objectives and challenges</p>
      </div>

      <div className="space-y-4">
        <div>
          <Label className="text-base font-medium">Target Audience *</Label>
          <div className="grid grid-cols-2 gap-3 mt-2">
            {targetAudienceOptions.map((audience) => (
              <div key={audience} className="flex items-center space-x-2">
                <Checkbox
                  id={audience}
                  checked={formData.targetAudiences.includes(audience)}
                  onCheckedChange={() => handleAudienceToggle(audience)}
                />
                <Label htmlFor={audience} className="text-sm">
                  {audience}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {marketIntelligence && (
          <Card className="border-purple-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center">
                <Brain className="w-4 h-4 mr-2 text-purple-600" />
                Market Intelligence Insights
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <Label className="text-xs text-gray-600">Key Competitors</Label>
                <div className="flex flex-wrap gap-1 mt-1">
                  {marketIntelligence.competitiveAnalysis?.keyCompetitors?.map((competitor: string) => (
                    <Badge key={competitor} variant="outline" className="text-xs">
                      {competitor}
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <Label className="text-xs text-gray-600">Market Share</Label>
                <p className="text-sm font-medium">
                  Current: {marketIntelligence.competitiveAnalysis?.marketShare?.current} → 
                  Projected: {marketIntelligence.competitiveAnalysis?.marketShare?.projected}
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-purple-100 rounded-full">
          <TrendingUp className="w-8 h-8 text-purple-600" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900">Smart Configuration</h3>
        <p className="text-gray-600">AI-powered recommendations</p>
      </div>

      {projectTemplates && projectTemplates.length > 0 && (
        <div className="space-y-4">
          <Label className="text-base font-medium">Recommended Project Templates</Label>
          {projectTemplates.map((template: any) => (
            <Card key={template.id} className="border-purple-200 hover:border-purple-300 cursor-pointer transition-colors">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{template.name}</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      Duration: {template.estimatedDuration} • Complexity: {template.complexity}
                    </p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {template.targetAudiences?.map((audience: string) => (
                        <Badge key={audience} variant="outline" className="text-xs">
                          {audience}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <Badge 
                    className={
                      template.complexity === 'high' ? 'bg-red-100 text-red-800' :
                      template.complexity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }
                  >
                    {template.complexity}
                  </Badge>
                </div>
                
                <div className="mt-3">
                  <Label className="text-xs text-gray-600">Required Assets</Label>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {template.requiredAssets?.slice(0, 3).map((asset: string) => (
                      <Badge key={asset} variant="secondary" className="text-xs">
                        {asset}
                      </Badge>
                    ))}
                    {template.requiredAssets?.length > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{template.requiredAssets.length - 3} more
                      </Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900">Review & Confirm</h3>
        <p className="text-gray-600">Final project setup</p>
      </div>

      <Card className="border-purple-200">
        <CardHeader>
          <CardTitle className="text-lg">Project Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm text-gray-600">Project Name</Label>
              <p className="font-medium">{formData.name}</p>
            </div>
            <div>
              <Label className="text-sm text-gray-600">Client</Label>
              <p className="font-medium">{formData.client}</p>
            </div>
            <div>
              <Label className="text-sm text-gray-600">Therapeutic Area</Label>
              <p className="font-medium">
                {therapeuticAreas?.find((area: any) => area.id === formData.therapeuticArea)?.name}
              </p>
            </div>
            <div>
              <Label className="text-sm text-gray-600">Project Type</Label>
              <p className="font-medium">
                {projectTypes.find(type => type.value === formData.projectType)?.label}
              </p>
            </div>
          </div>
          
          <div>
            <Label className="text-sm text-gray-600">Target Audiences</Label>
            <div className="flex flex-wrap gap-1 mt-1">
              {formData.targetAudiences.map((audience) => (
                <Badge key={audience} variant="outline" className="text-xs">
                  {audience}
                </Badge>
              ))}
            </div>
          </div>

          {therapeuticAreas?.find((area: any) => area.id === formData.therapeuticArea) && (
            <div className="mt-4 p-4 bg-purple-50 rounded-lg">
              <Label className="text-sm font-medium text-purple-800">Performance Insights</Label>
              <div className="grid grid-cols-3 gap-4 mt-2">
                <div className="text-center">
                  <p className="text-lg font-bold text-purple-600">
                    {therapeuticAreas.find((area: any) => area.id === formData.therapeuticArea)?.performanceMetrics.reviews}
                  </p>
                  <p className="text-xs text-gray-600">Reviews</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-purple-600">
                    {therapeuticAreas.find((area: any) => area.id === formData.therapeuticArea)?.performanceMetrics.approvalRate}%
                  </p>
                  <p className="text-xs text-gray-600">Approval Rate</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-purple-600">
                    {therapeuticAreas.find((area: any) => area.id === formData.therapeuticArea)?.performanceMetrics.avgTimeToFirstReview}
                  </p>
                  <p className="text-xs text-gray-600">Avg Review Time</p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card className="border-purple-200">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="flex items-center space-x-2 text-purple-600">
              <Sparkles className="w-6 h-6" />
              <span className="text-xl font-bold">Dynamic Project Creation Wizard</span>
            </div>
          </div>
          <CardDescription>
            AI-powered project setup with intelligent recommendations
          </CardDescription>
          
          {/* Progress Bar */}
          <div className="mt-6">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Step {currentStep} of 4</span>
              <span>{Math.round(getProgressPercentage())}% Complete</span>
            </div>
            <Progress value={getProgressPercentage()} className="h-2" />
          </div>

          {/* Step Indicators */}
          <div className="flex justify-between mt-4">
            {[
              { step: 1, label: 'Project Basics', icon: Sparkles },
              { step: 2, label: 'Strategic Content', icon: Target },
              { step: 3, label: 'Smart Configuration', icon: TrendingUp },
              { step: 4, label: 'Review & Confirm', icon: CheckCircle }
            ].map(({ step, label, icon: Icon }) => (
              <div key={step} className={`flex flex-col items-center ${
                step <= currentStep ? 'text-purple-600' : 'text-gray-400'
              }`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step <= currentStep ? 'bg-purple-600 text-white' : 'bg-gray-200'
                }`}>
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-xs mt-1 text-center">{label}</span>
              </div>
            ))}
          </div>
        </CardHeader>

        <CardContent>
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}
          {currentStep === 4 && renderStep4()}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === 1}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>

            {currentStep < 4 ? (
              <Button
                onClick={handleNext}
                disabled={
                  (currentStep === 1 && (!formData.name || !formData.client || !formData.therapeuticArea || !formData.projectType)) ||
                  (currentStep === 2 && formData.targetAudiences.length === 0)
                }
                className="bg-purple-600 hover:bg-purple-700"
              >
                Next
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button 
                onClick={handleCreateProject}
                disabled={createProjectMutation.isPending}
                className="bg-green-600 hover:bg-green-700"
              >
                {createProjectMutation.isPending ? 'Creating...' : 'Create Project'}
                <CheckCircle className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}