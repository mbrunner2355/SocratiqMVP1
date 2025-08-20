import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Network, 
  Search, 
  Filter, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw,
  Settings,
  Download,
  Share,
  Eye,
  Users,
  FileText,
  Globe
} from "lucide-react";

export default function KnowledgeGraph() {
  const [selectedNode, setSelectedNode] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const graphMetrics = [
    { label: "Total Entities", value: "15,847", trend: "+1,247 this month" },
    { label: "Relationships", value: "43,291", trend: "+3,456 new connections" },
    { label: "Patents Connected", value: "8,923", trend: "+892 linked" },
    { label: "Research Papers", value: "12,458", trend: "+567 indexed" }
  ];

  const entityTypes = [
    { type: "Patents", count: 8923, color: "bg-blue-500" },
    { type: "Research Papers", count: 12458, color: "bg-green-500" },
    { type: "Researchers", count: 3847, color: "bg-purple-500" },
    { type: "Institutions", count: 1245, color: "bg-orange-500" },
    { type: "Therapeutic Areas", count: 567, color: "bg-red-500" },
    { type: "Compounds", count: 2891, color: "bg-indigo-500" }
  ];

  const recentConnections = [
    {
      id: "1",
      source: "Patent US11234567",
      target: "Dr. Sarah Chen (Stanford)",
      relationship: "cited_by",
      confidence: 0.92,
      discoveredAt: "2 hours ago"
    },
    {
      id: "2", 
      source: "CAR-T Immunotherapy",
      target: "NIH Clinical Trial NCT04567890",
      relationship: "investigates",
      confidence: 0.88,
      discoveredAt: "4 hours ago"
    },
    {
      id: "3",
      source: "Biomarker BM-789",
      target: "Oncology Research Lab (Johns Hopkins)",
      relationship: "studied_at",
      confidence: 0.95,
      discoveredAt: "6 hours ago"
    }
  ];

  const mockGraphData = {
    nodes: [
      { id: "patent_1", label: "Patent US11234567", type: "patent", size: 20 },
      { id: "researcher_1", label: "Dr. Sarah Chen", type: "researcher", size: 15 },
      { id: "institution_1", label: "Stanford University", type: "institution", size: 25 },
      { id: "compound_1", label: "Compound XY-123", type: "compound", size: 12 },
      { id: "therapy_1", label: "CAR-T Immunotherapy", type: "therapy", size: 18 }
    ],
    edges: [
      { source: "patent_1", target: "researcher_1", label: "invented_by" },
      { source: "researcher_1", target: "institution_1", label: "affiliated_with" },
      { source: "patent_1", target: "compound_1", label: "describes" },
      { source: "compound_1", target: "therapy_1", label: "used_in" }
    ]
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-gray-200 pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-indigo-500 flex items-center justify-center">
              <Network className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Knowledge Graph</h1>
              <p className="text-gray-600">Interactive exploration of research knowledge networks</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button variant="outline">
              <Share className="w-4 h-4 mr-2" />
              Share
            </Button>
          </div>
        </div>
      </div>

      {/* Graph Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {graphMetrics.map((metric) => (
          <Card key={metric.label}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{metric.label}</CardTitle>
              <Network className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metric.value}</div>
              <p className="text-xs text-muted-foreground">{metric.trend}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Graph Visualization */}
        <div className="lg:col-span-2">
          <Card className="h-[600px]">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Interactive Knowledge Graph</CardTitle>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <ZoomIn className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <ZoomOut className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <RotateCcw className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Settings className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="h-full">
              {/* Mock Graph Visualization */}
              <div className="w-full h-full bg-gray-50 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
                <div className="text-center">
                  <Network className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-600 mb-2">Interactive Knowledge Graph</h3>
                  <p className="text-sm text-gray-500 max-w-md">
                    Dynamic visualization of research entities and their relationships. 
                    Click nodes to explore connections, drag to reposition, and use search to find specific entities.
                  </p>
                  <Button className="mt-4">
                    <Eye className="w-4 h-4 mr-2" />
                    Load Visualization
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Side Panel */}
        <div className="space-y-6">
          {/* Search and Filters */}
          <Card>
            <CardHeader>
              <CardTitle>Search & Filter</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input 
                  placeholder="Search entities..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Button size="sm">
                  <Search className="w-4 h-4" />
                </Button>
              </div>
              
              <div>
                <h4 className="font-medium text-sm mb-2">Entity Types</h4>
                <div className="space-y-2">
                  {entityTypes.map((entity) => (
                    <div key={entity.type} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${entity.color}`}></div>
                        <span className="text-sm">{entity.type}</span>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {entity.count.toLocaleString()}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Connections */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Discoveries</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentConnections.map((connection) => (
                  <div key={connection.id} className="p-3 border rounded-lg">
                    <div className="text-sm font-medium mb-1">
                      {connection.source}
                    </div>
                    <div className="text-xs text-gray-500 mb-1">
                      {connection.relationship.replace('_', ' ')} →
                    </div>
                    <div className="text-sm text-blue-600 mb-2">
                      {connection.target}
                    </div>
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="text-xs">
                        {(connection.confidence * 100).toFixed(0)}% confidence
                      </Badge>
                      <span className="text-xs text-gray-500">
                        {connection.discoveredAt}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Selected Node Details */}
          <Card>
            <CardHeader>
              <CardTitle>Node Details</CardTitle>
            </CardHeader>
            <CardContent>
              {selectedNode ? (
                <div className="space-y-3">
                  <div>
                    <h4 className="font-medium">{selectedNode.label}</h4>
                    <Badge variant="outline" className="text-xs mt-1">
                      {selectedNode.type}
                    </Badge>
                  </div>
                  <div className="text-sm text-gray-600">
                    Detailed information about the selected entity would appear here.
                  </div>
                </div>
              ) : (
                <div className="text-center py-4 text-gray-500">
                  <Network className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                  <p className="text-sm">Select a node to view details</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Graph Analysis Tabs */}
      <Card>
        <CardContent className="p-6">
          <Tabs defaultValue="analysis" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="analysis">Graph Analysis</TabsTrigger>
              <TabsTrigger value="pathfinding">Path Finding</TabsTrigger>
              <TabsTrigger value="clusters">Clusters</TabsTrigger>
              <TabsTrigger value="trends">Trends</TabsTrigger>
            </TabsList>

            <TabsContent value="analysis" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">7.2</div>
                  <div className="text-sm text-gray-600">Average Degree</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-green-600">0.34</div>
                  <div className="text-sm text-gray-600">Clustering Coefficient</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">4.1</div>
                  <div className="text-sm text-gray-600">Average Path Length</div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="pathfinding">
              <div className="text-center py-8 text-gray-500">
                Path finding algorithms and shortest path analysis coming soon...
              </div>
            </TabsContent>

            <TabsContent value="clusters">
              <div className="text-center py-8 text-gray-500">
                Community detection and clustering analysis coming soon...
              </div>
            </TabsContent>

            <TabsContent value="trends">
              <div className="text-center py-8 text-gray-500">
                Temporal trend analysis and evolution tracking coming soon...
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}