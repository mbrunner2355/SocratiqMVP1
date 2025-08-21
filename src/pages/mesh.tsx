import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import GraphVisualization from "@/components/GraphVisualization";
import Analytics from "@/components/Analytics";
import { useQuery } from "@tanstack/react-query";
import { Network, BarChart3 } from "lucide-react";

interface AnalyticsData {
  entityStats: { [key: string]: number };
  processingStats: {
    totalDocuments: number;
    processingQueue: number;
    avgProcessingTime: number;
    avgAccuracy: number;
  };
}

export default function Mesh() {
  const { data: analytics } = useQuery<AnalyticsData>({
    queryKey: ["/api/analytics"],
    refetchInterval: 5000,
  });

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div className="border-b border-gray-200 pb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-lg bg-green-500 flex items-center justify-center">
            <Network className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Mesh™</h1>
            <p className="text-gray-600">Knowledge Graph System</p>
          </div>
        </div>
      </div>

      {/* Analytics Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BarChart3 className="w-5 h-5" />
            <span>Graph Analytics</span>
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Statistical overview of your knowledge graph
          </p>
        </CardHeader>
        <CardContent>
          <Analytics />
        </CardContent>
      </Card>

      {/* Knowledge Graph Visualization */}
      <GraphVisualization />
    </div>
  );
}