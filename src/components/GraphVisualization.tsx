import { useQuery } from "@tanstack/react-query";
import { Network, Share2, Zap, Eye, Target, User, Building, MapPin, Stethoscope, Maximize2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useState } from "react";

interface GraphNode {
  id: string;
  label: string;
  type: string;
  confidence: number;
  properties?: any;
}

interface GraphMetrics {
  totalNodes: number;
  totalRelationships: number;
  avgDegree: number;
  density: number;
  clusters: number;
  topEntities: Array<{
    node: GraphNode;
    degree: number;
    centrality: number;
  }>;
}

export default function GraphVisualization() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const { data: metrics } = useQuery<GraphMetrics>({
    queryKey: ["/api/mesh/graph/metrics"],
    refetchInterval: 10000,
  });

  const { data: nodes } = useQuery<GraphNode[]>({
    queryKey: ["/api/mesh/graph/nodes"],
    refetchInterval: 15000,
  });

  const handleBuildGraph = async () => {
    try {
      const response = await fetch('/api/mesh/graph/build', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({})
      });
      const result = await response.json();
      console.log('Graph built:', result);
    } catch (error) {
      console.error('Failed to build graph:', error);
    }
  };

  // Network visualization component that can be used both inline and in modal
  const NetworkVisualization = ({ isFullScreen = false }: { isFullScreen?: boolean }) => {
    const nodeCount = isFullScreen ? Math.min(100, nodes?.length || 0) : Math.min(20, nodes?.length || 0);
    const displayNodes = nodes?.slice(0, nodeCount) || [];
    const height = isFullScreen ? 'h-[80vh]' : 'h-96';
    const gridCols = isFullScreen ? 10 : 5;
    const nodeSpacing = isFullScreen ? 100 : 120;
    const rowSpacing = isFullScreen ? 70 : 80;
    
    const getNodeColor = (entityType: string) => {
      switch (entityType) {
        case 'PERSON': return '#2563EB'; // Blue
        case 'ORGANIZATION': return '#0EA5E9'; // Cyan  
        case 'LOCATION': return '#10B981'; // Green
        case 'MEDICAL_TERM': return '#F59E0B'; // Orange
        default: return '#6B7280'; // Gray
      }
    };

    return (
      <div className={`bg-gradient-to-br from-gray-50 to-blue-50 rounded-lg border-2 border-dashed relative ${height}`} style={{ borderColor: 'var(--teal-light)' }}>
        {metrics?.totalNodes && metrics.totalNodes > 0 ? (
          <div className="relative w-full h-full p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className={`${isFullScreen ? 'text-2xl' : 'text-lg'} font-bold text-charcoal`} style={{ color: 'var(--charcoal)' }}>
                Knowledge Graph Network {isFullScreen ? '- Full View' : ''}
              </h3>
              <div className="text-sm text-slate" style={{ color: 'var(--slate)' }}>
                {metrics.totalNodes} nodes • {metrics.totalRelationships} relationships
              </div>
            </div>
            
            {/* SVG Network Visualization */}
            <div className={`relative ${isFullScreen ? 'h-[70vh]' : 'h-80'} overflow-hidden`}>
              <svg width="100%" height="100%" className="absolute inset-0">
                {/* Connection lines */}
                {displayNodes.map((node, i) => 
                  displayNodes.slice(i + 1, Math.min(nodeCount, displayNodes.length)).map((targetNode, j) => {
                    const x1 = 50 + (i % gridCols) * nodeSpacing;
                    const y1 = 50 + Math.floor(i / gridCols) * rowSpacing;
                    const x2 = 50 + ((i + j + 1) % gridCols) * nodeSpacing;
                    const y2 = 50 + Math.floor((i + j + 1) / gridCols) * rowSpacing;
                    
                    // Enhanced connection logic for full screen
                    const shouldConnect = node.properties?.entityType !== targetNode.properties?.entityType && 
                      (isFullScreen ? Math.random() > 0.85 : Math.random() > 0.7);
                    
                    return shouldConnect ? (
                      <line
                        key={`${node.id}-${targetNode.id}`}
                        x1={x1}
                        y1={y1}
                        x2={x2}
                        y2={y2}
                        stroke="var(--teal-secondary)"
                        strokeWidth={isFullScreen ? "2" : "1"}
                        opacity={isFullScreen ? "0.4" : "0.3"}
                      />
                    ) : null;
                  })
                )}
                
                {/* Node circles */}
                {displayNodes.map((node, index) => {
                  const x = 50 + (index % gridCols) * nodeSpacing;
                  const y = 50 + Math.floor(index / gridCols) * rowSpacing;
                  const nodeRadius = isFullScreen ? Math.max(20, node.confidence * 35) : Math.max(15, node.confidence * 25);
                  
                  return (
                    <g key={node.id}>
                      {/* Node circle */}
                      <circle
                        cx={x}
                        cy={y}
                        r={nodeRadius}
                        fill={getNodeColor(node.properties?.entityType || '')}
                        stroke="white"
                        strokeWidth={isFullScreen ? "3" : "2"}
                        className="hover:opacity-80 cursor-pointer"
                      />
                      
                      {/* Node label */}
                      <text
                        x={x}
                        y={y + nodeRadius + (isFullScreen ? 20 : 15)}
                        textAnchor="middle"
                        fontSize={isFullScreen ? "12" : "10"}
                        fill="var(--charcoal)"
                        className="font-medium pointer-events-none"
                      >
                        {isFullScreen 
                          ? (node.label.length > 20 ? `${node.label.substring(0, 20)}...` : node.label)
                          : (node.label.length > 12 ? `${node.label.substring(0, 12)}...` : node.label)
                        }
                      </text>
                      
                      {/* Confidence percentage */}
                      <text
                        x={x}
                        y={y + 5}
                        textAnchor="middle"
                        fontSize={isFullScreen ? "10" : "8"}
                        fill="white"
                        className="font-bold pointer-events-none"
                      >
                        {Math.round(node.confidence * 100)}%
                      </text>
                    </g>
                  );
                })}
              </svg>
              
              {/* Legend */}
              <div className="absolute bottom-2 left-2 bg-white rounded p-2 shadow-sm border">
                <div className="text-xs font-medium text-charcoal mb-1" style={{ color: 'var(--charcoal)' }}>Entity Types</div>
                <div className="flex flex-col space-y-1">
                  <div className="flex items-center space-x-1">
                    <div className="w-3 h-3 rounded-full bg-blue-600"></div>
                    <span className="text-xs text-slate" style={{ color: 'var(--slate)' }}>People</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="w-3 h-3 rounded-full bg-cyan-500"></div>
                    <span className="text-xs text-slate" style={{ color: 'var(--slate)' }}>Organizations</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span className="text-xs text-slate" style={{ color: 'var(--slate)' }}>Locations</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                    <span className="text-xs text-slate" style={{ color: 'var(--slate)' }}>Medical Terms</span>
                  </div>
                </div>
              </div>
              
              {/* Overflow indicator */}
              {(metrics.totalNodes > nodeCount) && (
                <div className="absolute bottom-2 right-2 bg-white rounded p-2 shadow-sm border">
                  <div className="text-xs text-slate" style={{ color: 'var(--slate)' }}>
                    +{metrics.totalNodes - nodeCount} more entities
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="h-full flex items-center justify-center">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--teal-light)' }}>
                <Network className="w-8 h-8" style={{ color: 'var(--slate)' }} />
              </div>
              <div>
                <p className="text-lg font-medium text-slate" style={{ color: 'var(--slate)' }}>
                  No Knowledge Graph Yet
                </p>
                <p className="text-sm text-slate" style={{ color: 'var(--slate)' }}>
                  Upload and process documents, then build the graph
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6" data-section="graph">
      {/* Header */}
      <div className="card-transform">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, hsl(220, 87%, 36%) 0%, hsl(217, 91%, 60%) 100%)' }}>
              <Network className="text-white w-5 h-5" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-charcoal" style={{ color: 'var(--charcoal)' }}>SocratIQ Mesh™</h2>
              <p className="text-sm font-medium text-slate" style={{ color: 'var(--slate)' }}>Knowledge Graph Platform - Semantic Reasoning & Cross-Domain Intelligence</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <Dialog>
              <DialogTrigger asChild>
                <Button 
                  variant="outline" 
                  disabled={!metrics?.totalNodes}
                  className="btn-secondary"
                >
                  <Maximize2 className="w-4 h-4 mr-2" />
                  Pop Out Graph
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-[95vw] max-h-[95vh] w-full h-full p-0">
                <DialogHeader className="px-6 py-4 border-b">
                  <DialogTitle className="text-2xl font-bold text-charcoal flex items-center space-x-2" style={{ color: 'var(--charcoal)' }}>
                    <Network className="w-6 h-6" style={{ color: 'var(--teal-primary)' }} />
                    <span>SocratIQ Mesh™ - Full Screen Knowledge Graph</span>
                  </DialogTitle>
                </DialogHeader>
                <div className="p-6 h-full">
                  <NetworkVisualization isFullScreen={true} />
                </div>
              </DialogContent>
            </Dialog>
            
            <Button onClick={handleBuildGraph} className="btn-primary">
              <Zap className="w-4 h-4 mr-2" />
              Build Graph
            </Button>
          </div>
        </div>

        {/* Graph Status */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-3xl font-bold" style={{ color: 'var(--teal-primary)' }}>
              {metrics?.totalNodes || 0}
            </div>
            <p className="text-sm font-medium" style={{ color: 'var(--slate)' }}>Knowledge Nodes</p>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold" style={{ color: 'var(--teal-secondary)' }}>
              {metrics?.totalRelationships || 0}
            </div>
            <p className="text-sm font-medium" style={{ color: 'var(--slate)' }}>Relationships</p>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold" style={{ color: 'var(--teal-primary)' }}>
              {metrics?.clusters || 0}
            </div>
            <p className="text-sm font-medium" style={{ color: 'var(--slate)' }}>Semantic Clusters</p>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold" style={{ color: 'var(--teal-secondary)' }}>
              {metrics?.density ? (metrics.density * 100).toFixed(1) : '0.0'}%
            </div>
            <p className="text-sm font-medium" style={{ color: 'var(--slate)' }}>Graph Density</p>
          </div>
        </div>
      </div>

      {/* Graph Visualization Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Graph View */}
        <div className="lg:col-span-2">
          <Card className="card-socratiq">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-charcoal" style={{ color: 'var(--charcoal)' }}>
                <Eye className="w-5 h-5" style={{ color: 'var(--teal-primary)' }} />
                <span>Interactive Knowledge Graph</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <NetworkVisualization isFullScreen={false} />
            </CardContent>
          </Card>
        </div>

        {/* Graph Analytics */}
        <div className="space-y-6">
          <Card className="card-socratiq">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-charcoal" style={{ color: 'var(--charcoal)' }}>
                <Target className="w-5 h-5" style={{ color: 'var(--teal-primary)' }} />
                <span>Key Entities</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {metrics?.topEntities && metrics.topEntities.length > 0 ? (
                <div className="space-y-3">
                  {metrics.topEntities.slice(0, 5).map((entity, index) => (
                    <div key={entity.node.id} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: 'var(--teal-primary)' }}></div>
                        <span className="text-sm font-medium text-charcoal truncate" style={{ color: 'var(--charcoal)' }}>
                          {entity.node.label}
                        </span>
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {entity.node.type}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate" style={{ color: 'var(--slate)' }}>
                  No entities in graph yet
                </p>
              )}
            </CardContent>
          </Card>

          <Card className="card-socratiq">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-charcoal" style={{ color: 'var(--charcoal)' }}>
                <Share2 className="w-5 h-5" style={{ color: 'var(--teal-primary)' }} />
                <span>Graph Operations</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                variant="outline" 
                className="w-full justify-start" 
                disabled={!metrics?.totalNodes}
                style={{ borderColor: 'var(--teal-light)' }}
              >
                <Network className="w-4 h-4 mr-2" />
                Explore Connections
              </Button>
              
              <Separator />
              
              <div className="text-xs font-medium" style={{ color: 'var(--slate)' }}>
                <p>Avg Degree: {metrics?.avgDegree?.toFixed(2) || '0.00'}</p>
                <p>Graph Density: {metrics?.density ? (metrics.density * 100).toFixed(2) : '0.00'}%</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}