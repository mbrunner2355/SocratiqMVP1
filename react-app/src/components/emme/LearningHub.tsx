import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  BookOpen, 
  Users, 
  Award, 
  Target, 
  MessageSquare, 
  Calendar,
  TrendingUp,
  PlayCircle,
  CheckCircle,
  Clock,
  Star,
  Download,
  Share,
  Video,
  FileText,
  Headphones
} from "lucide-react";

interface TrainingModule {
  id: string;
  title: string;
  category: "Clinical" | "Marketing" | "Access" | "Policy";
  duration: number; // minutes
  completionRate: number;
  rating: number;
  participants: number;
  format: "Video" | "Interactive" | "Document" | "Webinar";
  status: "active" | "coming-soon" | "archived";
}

interface SupportResource {
  id: string;
  title: string;
  type: "Guide" | "Template" | "Checklist" | "Tool";
  category: "Implementation" | "Optimization" | "Troubleshooting";
  downloads: number;
  rating: number;
  lastUpdated: string;
}

interface LearningHubProps {
  projectData?: any;
}

export function LearningHub({ projectData }: LearningHubProps) {
  const [activeTab, setActiveTab] = useState("training");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);

  // Initialize analysis if project data is available
  useEffect(() => {
    if (projectData && !analysisComplete) {
      setIsAnalyzing(true);
      // Simulate analysis process
      setTimeout(() => {
        setIsAnalyzing(false);
        setAnalysisComplete(true);
      }, 2000);
    }
  }, [projectData, analysisComplete]);

  const trainingModules: TrainingModule[] = [
    {
      id: "1",
      title: "Health Equity Fundamentals",
      category: "Clinical",
      duration: 45,
      completionRate: 89,
      rating: 4.8,
      participants: 1247,
      format: "Interactive",
      status: "active"
    },
    {
      id: "2",
      title: "Cultural Competency in Pharma Marketing",
      category: "Marketing",
      duration: 60,
      completionRate: 76,
      rating: 4.6,
      participants: 892,
      format: "Video",
      status: "active"
    },
    {
      id: "3",
      title: "Patient Access Program Design",
      category: "Access",
      duration: 90,
      completionRate: 83,
      rating: 4.9,
      participants: 654,
      format: "Webinar",
      status: "active"
    },
    {
      id: "4",
      title: "Policy Impact Assessment",
      category: "Policy",
      duration: 30,
      completionRate: 0,
      rating: 0,
      participants: 0,
      format: "Document",
      status: "coming-soon"
    }
  ];

  const supportResources: SupportResource[] = [
    {
      id: "1",
      title: "Equity Readiness Assessment Template",
      type: "Template",
      category: "Implementation",
      downloads: 2341,
      rating: 4.7,
      lastUpdated: "2024-08-05"
    },
    {
      id: "2",
      title: "HCP Engagement Optimization Guide",
      type: "Guide",
      category: "Optimization",
      downloads: 1876,
      rating: 4.5,
      lastUpdated: "2024-08-01"
    },
    {
      id: "3",
      title: "Campaign Performance Checklist",
      type: "Checklist",
      category: "Implementation",
      downloads: 3122,
      rating: 4.8,
      lastUpdated: "2024-07-28"
    },
    {
      id: "4",
      title: "ROI Calculator Tool",
      type: "Tool",
      category: "Optimization",
      downloads: 1543,
      rating: 4.6,
      lastUpdated: "2024-07-25"
    }
  ];

  const getFormatIcon = (format: TrainingModule["format"]) => {
    switch (format) {
      case "Video": return <Video className="w-4 h-4" />;
      case "Interactive": return <Target className="w-4 h-4" />;
      case "Document": return <FileText className="w-4 h-4" />;
      case "Webinar": return <Headphones className="w-4 h-4" />;
      default: return <BookOpen className="w-4 h-4" />;
    }
  };

  const getTypeIcon = (type: SupportResource["type"]) => {
    switch (type) {
      case "Guide": return <BookOpen className="w-4 h-4" />;
      case "Template": return <FileText className="w-4 h-4" />;
      case "Checklist": return <CheckCircle className="w-4 h-4" />;
      case "Tool": return <Target className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const handleNavigateToEquity = () => {
    window.dispatchEvent(new CustomEvent('navigateToModule', { 
      detail: { moduleId: 'equity-infrastructure', projectData } 
    }));
  };

  return (
    <div className="space-y-6 p-6">
      {/* Project Context Alert */}
      {projectData && (
        <Alert className="border-l-4 border-l-purple-500 bg-purple-50">
          <BookOpen className="h-4 w-4 text-purple-600" />
          <AlertDescription className="text-purple-800">
            <div className="flex items-center justify-between">
              <div>
                <strong>Project Context:</strong> {projectData.name} - Developing training content for {projectData.therapeuticArea} {projectData.projectType}
                {isAnalyzing && <span className="ml-2 text-sm">(Generating training modules...)</span>}
                {analysisComplete && <span className="ml-2 text-sm text-purple-600">✓ Training content ready</span>}
              </div>
              {analysisComplete && (
                <Button size="sm" onClick={handleNavigateToEquity} style={{ backgroundColor: '#9B7FB8' }}>
                  <Award className="w-3 h-3 mr-1" />
                  Complete with Equity
                </Button>
              )}
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Learning + Activation Hub</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Training, resources, and support for pharmaceutical marketing optimization
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            <Calendar className="w-4 h-4 mr-2" />
            Schedule Training
          </Button>
          <Button size="sm">
            <MessageSquare className="w-4 h-4 mr-2" />
            Get Support
          </Button>
        </div>
      </div>

      {/* Progress Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Completed Modules</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">12/16</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <Progress value={75} className="mt-3" />
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Avg Rating</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
                4.7
                <Star className="w-5 h-5 text-yellow-500 ml-1 fill-current" />
              </p>
            </div>
            <Award className="w-8 h-8 text-yellow-600" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Learning Hours</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">47.5</p>
            </div>
            <Clock className="w-8 h-8 text-blue-600" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Team Progress</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">83%</p>
            </div>
            <Users className="w-8 h-8 text-purple-600" />
          </div>
          <Progress value={83} className="mt-3" />
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="training" className="flex items-center gap-2">
            <PlayCircle className="w-4 h-4" />
            Training Modules
          </TabsTrigger>
          <TabsTrigger value="resources" className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Support Resources
          </TabsTrigger>
          <TabsTrigger value="community" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            Community
          </TabsTrigger>
        </TabsList>

        <TabsContent value="training" className="space-y-6">
          <div className="flex items-center space-x-4">
            <Button 
              variant={selectedCategory === "all" ? "default" : "outline"}
              onClick={() => setSelectedCategory("all")}
              size="sm"
            >
              All Categories
            </Button>
            {["Clinical", "Marketing", "Access", "Policy"].map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                onClick={() => setSelectedCategory(category)}
                size="sm"
              >
                {category}
              </Button>
            ))}
          </div>

          <div className="grid gap-6">
            {trainingModules
              .filter(module => selectedCategory === "all" || module.category === selectedCategory)
              .map((module) => (
                <Card key={module.id} className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold">{module.title}</h3>
                        <Badge variant="outline">{module.category}</Badge>
                        <Badge 
                          variant={module.status === "active" ? "default" : module.status === "coming-soon" ? "secondary" : "outline"}
                        >
                          {module.status === "coming-soon" ? "Coming Soon" : module.status}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center space-x-6 text-sm text-gray-600 dark:text-gray-300 mb-4">
                        <div className="flex items-center space-x-1">
                          {getFormatIcon(module.format)}
                          <span>{module.format}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="w-4 h-4" />
                          <span>{module.duration} min</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Users className="w-4 h-4" />
                          <span>{module.participants.toLocaleString()} participants</span>
                        </div>
                        {module.rating > 0 && (
                          <div className="flex items-center space-x-1">
                            <Star className="w-4 h-4 text-yellow-500 fill-current" />
                            <span>{module.rating}</span>
                          </div>
                        )}
                      </div>

                      {module.status === "active" && (
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600 dark:text-gray-300">
                              Completion Rate
                            </span>
                            <span className="text-sm font-medium">{module.completionRate}%</span>
                          </div>
                          <Progress value={module.completionRate} />
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col space-y-2 ml-6">
                      {module.status === "active" && (
                        <>
                          <Button>
                            <PlayCircle className="w-4 h-4 mr-2" />
                            Start Learning
                          </Button>
                          <Button variant="outline" size="sm">
                            <Share className="w-4 h-4 mr-2" />
                            Share
                          </Button>
                        </>
                      )}
                      {module.status === "coming-soon" && (
                        <Button variant="outline" disabled>
                          <Clock className="w-4 h-4 mr-2" />
                          Coming Soon
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
          </div>
        </TabsContent>

        <TabsContent value="resources" className="space-y-6">
          <div className="grid gap-4">
            {supportResources.map((resource) => (
              <Card key={resource.id} className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                      {getTypeIcon(resource.type)}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold mb-1">{resource.title}</h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-300 mb-2">
                        <Badge variant="outline">{resource.type}</Badge>
                        <Badge variant="secondary">{resource.category}</Badge>
                        <span>Updated: {resource.lastUpdated}</span>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1">
                          <Download className="w-4 h-4" />
                          <span className="text-sm">{resource.downloads.toLocaleString()} downloads</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4 text-yellow-500 fill-current" />
                          <span className="text-sm">{resource.rating}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                    <Button variant="outline" size="sm">
                      <Share className="w-4 h-4 mr-2" />
                      Share
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="community" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="w-5 h-5 mr-2 text-blue-600" />
                  Expert Office Hours
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">Health Equity Strategy Session</h4>
                      <Badge>This Week</Badge>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                      Join Dr. Sarah Martinez for a deep dive into equity-centered marketing approaches
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Thursday, 2:00 PM EST</span>
                      <Button size="sm" variant="outline">Join Session</Button>
                    </div>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">Payer Engagement Best Practices</h4>
                      <Badge variant="secondary">Next Week</Badge>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                      Expert panel on successful payer value demonstration strategies
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Tuesday, 1:00 PM EST</span>
                      <Button size="sm" variant="outline">Register</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="p-6">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MessageSquare className="w-5 h-5 mr-2 text-green-600" />
                  Community Forum
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium">JM</span>
                      </div>
                      <div>
                        <p className="font-medium text-sm">Jennifer Martinez</p>
                        <p className="text-xs text-gray-500">2 hours ago</p>
                      </div>
                    </div>
                    <p className="text-sm">
                      "Just completed the Cultural Competency module - excellent insights on language accessibility!"
                    </p>
                    <div className="flex items-center space-x-4 mt-2">
                      <button className="text-xs text-blue-600 hover:underline">Reply</button>
                      <button className="text-xs text-gray-500 hover:underline">Like (12)</button>
                    </div>
                  </div>

                  <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium">AK</span>
                      </div>
                      <div>
                        <p className="font-medium text-sm">Alex Kumar</p>
                        <p className="text-xs text-gray-500">5 hours ago</p>
                      </div>
                    </div>
                    <p className="text-sm">
                      "Looking for best practices on measuring equity impact in digital campaigns. Any recommendations?"
                    </p>
                    <div className="flex items-center space-x-4 mt-2">
                      <button className="text-xs text-blue-600 hover:underline">Reply</button>
                      <button className="text-xs text-gray-500 hover:underline">Like (7)</button>
                    </div>
                  </div>
                </div>
                
                <Button className="w-full mt-4" variant="outline">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Join Discussion
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}