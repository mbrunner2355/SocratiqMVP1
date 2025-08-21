import React, { useState, useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { 
  Network, 
  Eye, 
  Settings, 
  Download, 
  RotateCcw,
  ZoomIn,
  ZoomOut,
  Move,
  Maximize2,
  Minimize2,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Info,
  Filter,
  Search,
  Layers,
  GitBranch,
  Activity,
  Target,
  AlertCircle,
  CheckCircle,
  Clock,
  Database,
  Cpu,
  Brain,
  Share2
} from 'lucide-react';

interface GraphNode {
  id: string;
  label: string;
  type: string;
  category: string;
  importance: number;
  temporal_layer?: number;
  properties: Record<string, any>;
  x?: number;
  y?: number;
  color?: string;
  size?: number;
}

interface GraphEdge {
  id: string;
  source: string;
  target: string;
  type: string;
  weight: number;
  temporal_relationship?: string;
  confidence: number;
  properties: Record<string, any>;
}

interface KnowledgeGraph {
  id: string;
  name: string;
  type: 'temporal' | 'causal' | 'semantic' | 'hierarchical';
  nodes: GraphNode[];
  edges: GraphEdge[];
  temporal_layers: number;
  metadata: {
    created_at: string;
    last_updated: string;
    total_nodes: number;
    total_edges: number;
    domains: string[];
    neural_network_info: {
      architecture: string;
      performance: number;
    };
  };
}

export default function GraphVisualizationManager() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedGraph, setSelectedGraph] = useState<string>('');
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [selectedEdge, setSelectedEdge] = useState<GraphEdge | null>(null);
  const [visualizationMode, setVisualizationMode] = useState<'force' | 'hierarchical' | 'circular' | 'temporal'>('force');
  const [temporalLayer, setTemporalLayer] = useState<number>(0);
  const [showTemporalAnimation, setShowTemporalAnimation] = useState(false);
  const [nodeFilter, setNodeFilter] = useState('all');
  const [edgeFilter, setEdgeFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const { data: knowledgeGraphs = [], isLoading } = useQuery<KnowledgeGraph[]>({
    queryKey: ['/api/graph-visualization/graphs'],
  });

  const { data: currentGraph } = useQuery<KnowledgeGraph>({
    queryKey: ['/api/graph-visualization/graphs', selectedGraph],
    enabled: !!selectedGraph,
  });

  const { data: graphMetrics } = useQuery<any>({
    queryKey: ['/api/graph-visualization/metrics', selectedGraph],
    enabled: !!selectedGraph,
  });

  // Mock graph rendering function (in production, you'd use D3.js, vis.js, or similar)
  const renderGraph = () => {
    const canvas = canvasRef.current;
    if (!canvas || !currentGraph) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Set up canvas dimensions
    const width = canvas.width;
    const height = canvas.height;

    // Filter nodes and edges based on current filters
    const filteredNodes = currentGraph.nodes.filter(node => {
      const matchesFilter = nodeFilter === 'all' || node.type === nodeFilter;
      const matchesSearch = !searchTerm || 
                           node.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           node.type.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesLayer = temporalLayer === 0 || node.temporal_layer === temporalLayer;
      return matchesFilter && matchesSearch && matchesLayer;
    });

    const filteredEdges = currentGraph.edges.filter(edge => {
      const matchesFilter = edgeFilter === 'all' || edge.type === edgeFilter;
      const sourceExists = filteredNodes.some(node => node.id === edge.source);
      const targetExists = filteredNodes.some(node => node.id === edge.target);
      return matchesFilter && sourceExists && targetExists;
    });

    // Simple force-directed layout simulation (simplified)
    const nodePositions = new Map<string, {x: number, y: number}>();
    
    // Initialize positions
    filteredNodes.forEach((node, index) => {
      const angle = (index / filteredNodes.length) * 2 * Math.PI;
      const radius = Math.min(width, height) / 4;
      nodePositions.set(node.id, {
        x: width / 2 + radius * Math.cos(angle),
        y: height / 2 + radius * Math.sin(angle)
      });
    });

    // Draw edges
    ctx.strokeStyle = '#666';
    ctx.lineWidth = 1;
    filteredEdges.forEach(edge => {
      const sourcePos = nodePositions.get(edge.source);
      const targetPos = nodePositions.get(edge.target);
      
      if (sourcePos && targetPos) {
        ctx.beginPath();
        ctx.moveTo(sourcePos.x, sourcePos.y);
        ctx.lineTo(targetPos.x, targetPos.y);
        ctx.globalAlpha = edge.confidence;
        ctx.stroke();
        ctx.globalAlpha = 1;
      }
    });

    // Draw nodes
    filteredNodes.forEach(node => {
      const pos = nodePositions.get(node.id);
      if (!pos) return;

      const size = 5 + (node.importance * 10);
      
      // Node color based on type
      const colors = {
        entity: '#3b82f6',
        concept: '#10b981',
        relation: '#f59e0b',
        temporal: '#8b5cf6',
        causal: '#ef4444',
        default: '#6b7280'
      };
      
      ctx.fillStyle = colors[node.type as keyof typeof colors] || colors.default;
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, size, 0, 2 * Math.PI);
      ctx.fill();

      // Node border
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Node label
      if (size > 8) {
        ctx.fillStyle = '#000';
        ctx.font = '12px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(node.label, pos.x, pos.y - size - 5);
      }
    });
  };

  // Re-render when data changes
  useEffect(() => {
    renderGraph();
  }, [currentGraph, nodeFilter, edgeFilter, searchTerm, temporalLayer, visualizationMode]);

  const getNodeTypeColor = (type: string) => {
    const colors = {
      entity: 'bg-blue-100 text-blue-800',
      concept: 'bg-green-100 text-green-800',
      relation: 'bg-yellow-100 text-yellow-800',
      temporal: 'bg-purple-100 text-purple-800',
      causal: 'bg-red-100 text-red-800',
    };
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-2 mb-6">
          <Network className="h-6 w-6 text-blue-600" />
          <h1 className="text-3xl font-bold">Graph Visualization</h1>
        </div>
        <div className="h-96 bg-gray-200 animate-pulse rounded-lg" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Network className="h-6 w-6 text-blue-600" />
          <h1 className="text-3xl font-bold">Knowledge Graph Visualization</h1>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" size="sm" onClick={() => setIsFullscreen(!isFullscreen)}>
            {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* Graph Selection and Controls */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Graph Controls</CardTitle>
              <CardDescription>Select and configure knowledge graph visualization</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label>Knowledge Graph</Label>
              <Select value={selectedGraph} onValueChange={setSelectedGraph}>
                <SelectTrigger>
                  <SelectValue placeholder="Select graph" />
                </SelectTrigger>
                <SelectContent>
                  {knowledgeGraphs.map((graph) => (
                    <SelectItem key={graph.id} value={graph.id}>
                      {graph.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Visualization Mode</Label>
              <Select value={visualizationMode} onValueChange={(value) => setVisualizationMode(value as 'force' | 'hierarchical' | 'circular' | 'temporal')}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="force">Force-Directed</SelectItem>
                  <SelectItem value="hierarchical">Hierarchical</SelectItem>
                  <SelectItem value="circular">Circular</SelectItem>
                  <SelectItem value="temporal">Temporal Layers</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Node Filter</Label>
              <Select value={nodeFilter} onValueChange={setNodeFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Nodes</SelectItem>
                  <SelectItem value="entity">Entities</SelectItem>
                  <SelectItem value="concept">Concepts</SelectItem>
                  <SelectItem value="relation">Relations</SelectItem>
                  <SelectItem value="temporal">Temporal</SelectItem>
                  <SelectItem value="causal">Causal</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Search Nodes</Label>
              <Input
                placeholder="Search nodes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {currentGraph && currentGraph.temporal_layers > 1 && (
            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-between">
                <Label>Temporal Layer: {temporalLayer === 0 ? 'All' : temporalLayer}</Label>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={showTemporalAnimation}
                    onCheckedChange={setShowTemporalAnimation}
                  />
                  <Label className="text-sm">Animate</Label>
                </div>
              </div>
              <Slider
                value={[temporalLayer]}
                onValueChange={(value) => setTemporalLayer(value[0])}
                max={currentGraph.temporal_layers}
                min={0}
                step={1}
                className="w-full"
              />
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Graph Visualization */}
        <div className="lg:col-span-3">
          <Card className="h-[600px]">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>
                  {currentGraph ? currentGraph.name : 'Select a Knowledge Graph'}
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <ZoomOut className="h-4 w-4" />
                  </Button>
                  <span className="text-sm font-mono">{Math.round(zoomLevel * 100)}%</span>
                  <Button variant="outline" size="sm">
                    <ZoomIn className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="h-full">
              <div className="relative w-full h-full bg-gray-50 rounded-lg border overflow-hidden">
                <canvas
                  ref={canvasRef}
                  width={800}
                  height={500}
                  className="w-full h-full cursor-crosshair"
                />
                {!selectedGraph && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center text-gray-500">
                      <Network className="h-16 w-16 mx-auto mb-4 opacity-50" />
                      <p className="text-lg font-medium">Select a Knowledge Graph</p>
                      <p className="text-sm">Choose from the dropdown above to visualize relationships</p>
                    </div>
                  </div>
                )}
                {selectedGraph && !currentGraph?.nodes?.length && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center text-gray-500">
                      <Database className="h-16 w-16 mx-auto mb-4 opacity-50" />
                      <p className="text-lg font-medium">No Data Available</p>
                      <p className="text-sm">This graph has no nodes or edges to display</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Graph Information Panel */}
        <div className="space-y-4">
          {/* Graph Statistics */}
          {currentGraph && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Graph Statistics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Nodes</span>
                  <Badge variant="outline">{currentGraph.metadata.total_nodes.toLocaleString()}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Edges</span>
                  <Badge variant="outline">{currentGraph.metadata.total_edges.toLocaleString()}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Temporal Layers</span>
                  <Badge variant="outline">{currentGraph.temporal_layers}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Type</span>
                  <Badge className={getNodeTypeColor(currentGraph.type)}>
                    {currentGraph.type}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">GNN Performance</span>
                  <Badge variant="secondary">
                    {currentGraph.metadata.neural_network_info.performance}%
                  </Badge>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Domains */}
          {currentGraph && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Domains
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {currentGraph.metadata.domains.map((domain) => (
                    <Badge key={domain} variant="outline" className="text-xs">
                      {domain}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Selected Node Details */}
          {selectedNode && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Info className="h-5 w-5" />
                  Node Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <span className="text-sm text-gray-600">Label</span>
                  <p className="font-medium">{selectedNode.label}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Type</span>
                  <Badge className={getNodeTypeColor(selectedNode.type)}>
                    {selectedNode.type}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Importance</span>
                  <span className="font-medium">{selectedNode.importance}</span>
                </div>
                {selectedNode.temporal_layer && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Temporal Layer</span>
                    <span className="font-medium">{selectedNode.temporal_layer}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Graph Neural Network Info */}
          {currentGraph && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Brain className="h-5 w-5" />
                  Neural Network
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <span className="text-sm text-gray-600">Architecture</span>
                  <p className="text-sm font-medium">
                    {currentGraph.metadata.neural_network_info.architecture}
                  </p>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Performance</span>
                  <Badge variant="secondary">
                    {currentGraph.metadata.neural_network_info.performance}%
                  </Badge>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}