import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useQuery } from "@tanstack/react-query";
import { 
  Play,
  Pause,
  RotateCcw,
  ChevronRight,
  Clock,
  CheckCircle,
  AlertCircle,
  Zap,
  Brain,
  Target,
  Users,
  TrendingUp,
  Heart,
  Shield,
  BookOpen,
  FileText,
  BarChart3,
  MessageCircle,
  Calendar,
  DollarSign,
  Timer
} from "lucide-react";

interface WorkflowStep {
  id: string;
  title: string;
  description: string;
  duration: number;
  status: "pending" | "active" | "completed" | "warning";
  progress: number;
  module: "insight-engine" | "engagement-studio" | "learning-hub" | "equity-infrastructure";
  dependencies: string[];
  activities: string[];
}

interface WorkflowVisualizationProps {
  projectType?: string;
  therapeuticArea?: string;
}

export function WorkflowVisualization({ 
  projectType = "product-launch", 
  therapeuticArea = "oncology" 
}: WorkflowVisualizationProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [globalProgress, setGlobalProgress] = useState(0);
  const [animationSpeed, setAnimationSpeed] = useState(1);

  const workflowSteps: WorkflowStep[] = [
    {
      id: "market-analysis",
      title: "Market Intelligence Gathering",
      description: "Analyze market landscape, competitor positioning, and patient journey data",
      duration: 2,
      status: "completed",
      progress: 100,
      module: "insight-engine",
      dependencies: [],
      activities: [
        "Competitive landscape analysis",
        "Patient journey mapping", 
        "Market size assessment",
        "Unmet needs identification"
      ]
    },
    {
      id: "audience-segmentation",
      title: "Audience Segmentation & Profiling",
      description: "Develop detailed HCP and patient personas with engagement preferences",
      duration: 3,
      status: "completed",
      progress: 100,
      module: "insight-engine",
      dependencies: ["market-analysis"],
      activities: [
        "HCP persona development",
        "Patient segmentation analysis",
        "Channel preference mapping",
        "Behavioral insights compilation"
      ]
    },
    {
      id: "equity-assessment",
      title: "Health Equity Readiness Assessment", 
      description: "Evaluate cultural competency and access barriers for diverse populations",
      duration: 2,
      status: "active",
      progress: 65,
      module: "equity-infrastructure",
      dependencies: ["audience-segmentation"],
      activities: [
        "SDOH impact analysis",
        "Cultural competency evaluation",
        "Access barrier identification",
        "Inclusivity framework development"
      ]
    },
    {
      id: "content-strategy",
      title: "Multi-Channel Content Strategy",
      description: "Develop tailored messaging and content for each audience segment",
      duration: 4,
      status: "active",
      progress: 30,
      module: "engagement-studio",
      dependencies: ["audience-segmentation", "equity-assessment"],
      activities: [
        "Message hierarchy development",
        "Channel-specific content creation",
        "Scientific communication materials",
        "Patient education resources"
      ]
    },
    {
      id: "training-program",
      title: "HCP Education Program Development",
      description: "Create comprehensive training materials and certification programs",
      duration: 3,
      status: "pending",
      progress: 0,
      module: "learning-hub",
      dependencies: ["content-strategy"],
      activities: [
        "Clinical training modules",
        "MOA education materials",
        "Case study development",
        "Certification program setup"
      ]
    },
    {
      id: "campaign-execution",
      title: "Integrated Campaign Launch",
      description: "Execute multi-channel marketing campaign with real-time optimization",
      duration: 6,
      status: "pending", 
      progress: 0,
      module: "engagement-studio",
      dependencies: ["training-program"],
      activities: [
        "Digital campaign activation",
        "HCP engagement initiatives",
        "Patient support programs",
        "KOL engagement activities"
      ]
    },
    {
      id: "performance-monitoring",
      title: "Performance Analytics & Optimization",
      description: "Monitor campaign performance and optimize based on real-time data",
      duration: 2,
      status: "pending",
      progress: 0,
      module: "insight-engine",
      dependencies: ["campaign-execution"],
      activities: [
        "Real-time performance tracking",
        "A/B testing implementation",
        "ROI analysis and reporting",
        "Continuous optimization"
      ]
    }
  ];

  const moduleConfig = {
    "insight-engine": {
      color: "bg-blue-500",
      lightColor: "bg-blue-100",
      textColor: "text-blue-700",
      icon: Brain,
      name: "Insight Engine"
    },
    "engagement-studio": {
      color: "bg-green-500", 
      lightColor: "bg-green-100",
      textColor: "text-green-700",
      icon: Target,
      name: "Engagement Studio"
    },
    "learning-hub": {
      color: "bg-purple-500",
      lightColor: "bg-purple-100", 
      textColor: "text-purple-700",
      icon: BookOpen,
      name: "Learning Hub"
    },
    "equity-infrastructure": {
      color: "bg-orange-500",
      lightColor: "bg-orange-100",
      textColor: "text-orange-700", 
      icon: Shield,
      name: "Equity Infrastructure"
    }
  };

  // Animation logic
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isPlaying) {
      interval = setInterval(() => {
        setGlobalProgress(prev => {
          const newProgress = prev + (0.5 * animationSpeed);
          if (newProgress >= 100) {
            setIsPlaying(false);
            return 100;
          }
          return newProgress;
        });
        
        // Update current step based on progress
        const stepProgress = globalProgress / 100 * workflowSteps.length;
        setCurrentStep(Math.floor(stepProgress));
        
      }, 100);
    }
    
    return () => clearInterval(interval);
  }, [isPlaying, animationSpeed, globalProgress, workflowSteps.length]);

  const handlePlay = () => setIsPlaying(true);
  const handlePause = () => setIsPlaying(false);
  const handleReset = () => {
    setIsPlaying(false);
    setGlobalProgress(0);
    setCurrentStep(0);
  };

  const getStepStatus = (index: number) => {
    if (index < currentStep) return "completed";
    if (index === currentStep) return "active";
    return "pending";
  };

  const getStepProgress = (index: number) => {
    if (index < currentStep) return 100;
    if (index === currentStep) {
      const stepProgress = (globalProgress % (100 / workflowSteps.length)) * workflowSteps.length;
      return Math.min(stepProgress, 100);
    }
    return 0;
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Workflow Visualization</h1>
          <p className="text-gray-600 mt-2">
            Interactive pharmaceutical marketing campaign lifecycle for {therapeuticArea} {projectType}
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Speed:</span>
            <select 
              value={animationSpeed}
              onChange={(e) => setAnimationSpeed(Number(e.target.value))}
              className="text-sm border rounded px-2 py-1"
            >
              <option value={0.5}>0.5x</option>
              <option value={1}>1x</option>
              <option value={2}>2x</option>
              <option value={3}>3x</option>
            </select>
          </div>
          
          <Button
            onClick={handlePlay}
            disabled={isPlaying || globalProgress >= 100}
            size="sm"
            className="bg-purple-600 hover:bg-purple-700 text-white"
          >
            <Play className="w-4 h-4 mr-2" />
            Play
          </Button>
          
          <Button
            onClick={handlePause}
            disabled={!isPlaying}
            variant="outline"
            size="sm"
          >
            <Pause className="w-4 h-4 mr-2" />
            Pause
          </Button>
          
          <Button
            onClick={handleReset}
            variant="outline"
            size="sm"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </Button>
        </div>
      </div>

      {/* Overall Progress */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Campaign Progress</h3>
            <Badge variant="outline" className="text-sm">
              {Math.round(globalProgress)}% Complete
            </Badge>
          </div>
          <Progress value={globalProgress} className="h-3 mb-4" />
          
          <div className="grid grid-cols-4 gap-4 text-sm">
            <div className="text-center">
              <div className="font-medium text-gray-900">Current Phase</div>
              <div className="text-gray-600">
                {currentStep < workflowSteps.length ? workflowSteps[currentStep]?.title : "Complete"}
              </div>
            </div>
            <div className="text-center">
              <div className="font-medium text-gray-900">Estimated Timeline</div>
              <div className="text-gray-600">22 weeks total</div>
            </div>
            <div className="text-center">
              <div className="font-medium text-gray-900">Active Modules</div>
              <div className="text-gray-600">
                {new Set(workflowSteps.slice(0, currentStep + 1).map(s => s.module)).size} / 4
              </div>
            </div>
            <div className="text-center">
              <div className="font-medium text-gray-900">Next Milestone</div>
              <div className="text-gray-600">
                {currentStep < workflowSteps.length - 1 ? workflowSteps[currentStep + 1]?.title : "Campaign Complete"}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Workflow Steps */}
      <div className="space-y-4">
        {workflowSteps.map((step, index) => {
          const stepStatus = getStepStatus(index);
          const stepProgress = getStepProgress(index);
          const config = moduleConfig[step.module];
          const IconComponent = config.icon;
          
          return (
            <Card key={step.id} className={`transition-all duration-500 ${
              stepStatus === "active" ? "ring-2 ring-purple-500 shadow-lg" : ""
            }`}>
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  {/* Step Number & Status */}
                  <div className="flex flex-col items-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold transition-all duration-500 ${
                      stepStatus === "completed" ? "bg-green-500" : 
                      stepStatus === "active" ? "bg-purple-500 animate-pulse" : 
                      "bg-gray-300"
                    }`}>
                      {stepStatus === "completed" ? (
                        <CheckCircle className="w-5 h-5" />
                      ) : stepStatus === "active" ? (
                        <Zap className="w-5 h-5" />
                      ) : (
                        <span className="text-sm">{index + 1}</span>
                      )}
                    </div>
                    
                    {/* Connection Line */}
                    {index < workflowSteps.length - 1 && (
                      <div className={`w-0.5 h-16 mt-2 transition-all duration-500 ${
                        stepStatus === "completed" ? "bg-green-500" : "bg-gray-200"
                      }`} />
                    )}
                  </div>

                  {/* Step Content */}
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-3">
                        <h3 className="text-lg font-semibold text-gray-900">{step.title}</h3>
                        <Badge className={`${config.lightColor} ${config.textColor} border-0`}>
                          <IconComponent className="w-3 h-3 mr-1" />
                          {config.name}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Clock className="w-4 h-4" />
                        <span>{step.duration} weeks</span>
                      </div>
                    </div>
                    
                    <p className="text-gray-600 mb-4">{step.description}</p>
                    
                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span className="text-gray-600">Progress</span>
                        <span className="font-medium">{Math.round(stepProgress)}%</span>
                      </div>
                      <Progress 
                        value={stepProgress} 
                        className={`h-2 transition-all duration-300 ${
                          stepStatus === "active" ? "animate-pulse" : ""
                        }`}
                      />
                    </div>

                    {/* Activities */}
                    {stepStatus !== "pending" && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {step.activities.map((activity, actIndex) => (
                          <div key={actIndex} className={`flex items-center text-sm transition-opacity duration-500 ${
                            actIndex * 25 <= stepProgress ? "opacity-100" : "opacity-30"
                          }`}>
                            <div className={`w-2 h-2 rounded-full mr-2 ${
                              actIndex * 25 <= stepProgress ? config.color : "bg-gray-300"
                            }`} />
                            <span className={actIndex * 25 <= stepProgress ? "text-gray-700" : "text-gray-400"}>
                              {activity}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Dependencies */}
                    {step.dependencies.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-gray-100">
                        <div className="text-xs text-gray-500 mb-1">Dependencies:</div>
                        <div className="flex flex-wrap gap-1">
                          {step.dependencies.map(depId => {
                            const depStep = workflowSteps.find(s => s.id === depId);
                            return depStep ? (
                              <Badge key={depId} variant="outline" className="text-xs">
                                {depStep.title}
                              </Badge>
                            ) : null;
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Module Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {Object.entries(moduleConfig).map(([moduleKey, config]) => {
          const IconComponent = config.icon;
          const moduleSteps = workflowSteps.filter(s => s.module === moduleKey);
          const completedSteps = moduleSteps.filter((_, index) => 
            workflowSteps.findIndex(ws => ws.id === moduleSteps[index].id) < currentStep
          ).length;
          
          return (
            <Card key={moduleKey}>
              <CardContent className="p-4 text-center">
                <div className={`w-12 h-12 rounded-full ${config.color} flex items-center justify-center mx-auto mb-3`}>
                  <IconComponent className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold mb-2">{config.name}</h3>
                <div className="text-sm text-gray-600">
                  {completedSteps} / {moduleSteps.length} steps
                </div>
                <Progress value={(completedSteps / moduleSteps.length) * 100} className="h-2 mt-2 progress-gradient-blue-purple [&>div]:bg-gradient-blue-purple" />
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Real-time Insights */}
      {isPlaying && (
        <Card className="border-l-4 border-l-blue-500 bg-blue-50">
          <CardContent className="p-4">
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse mt-2"></div>
              <div>
                <h4 className="font-medium text-blue-900">Real-time Insight</h4>
                <p className="text-sm text-blue-700 mt-1">
                  {currentStep < workflowSteps.length ? (
                    `Currently executing: ${workflowSteps[currentStep]?.title}. 
                     Estimated ${workflowSteps[currentStep]?.duration} weeks remaining for this phase.`
                  ) : (
                    "Campaign workflow complete! Ready for performance analysis and optimization."
                  )}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}


    </div>
  );
}