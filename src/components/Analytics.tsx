import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface AnalyticsData {
  entityStats: { [key: string]: number };
  processingStats: {
    totalDocuments: number;
    processingQueue: number;
    avgProcessingTime: number;
    avgAccuracy: number;
  };
}

interface AnalyticsProps {
  analytics?: AnalyticsData;
}

export default function Analytics({ analytics }: AnalyticsProps) {
  if (!analytics) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="space-y-3">
              <div className="h-3 bg-gray-200 rounded"></div>
              <div className="h-3 bg-gray-200 rounded"></div>
              <div className="h-3 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="space-y-3">
              <div className="h-12 bg-gray-200 rounded"></div>
              <div className="h-12 bg-gray-200 rounded"></div>
              <div className="h-12 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const { entityStats, processingStats } = analytics;

  // Calculate percentages for entity distribution
  const totalEntities = Object.values(entityStats).reduce((sum, count) => sum + count, 0);
  const entityData = Object.entries(entityStats).map(([type, count]) => ({
    type,
    count,
    percentage: totalEntities > 0 ? (count / totalEntities) * 100 : 0,
  })).sort((a, b) => b.count - a.count);

  const getEntityColor = (type: string) => {
    switch (type) {
      case 'PERSON': return 'bg-green-500';
      case 'ORGANIZATION': return 'bg-blue-500';
      case 'LOCATION': return 'bg-purple-500';
      case 'DATE': return 'bg-yellow-500';
      case 'MEDICAL_TERM': return 'bg-red-500';
      case 'DRUG': return 'bg-orange-500';
      default: return 'bg-gray-500';
    }
  };

  const formatEntityType = (type: string) => {
    return type.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    ).join(' ');
  };

  const getTrendIcon = (value: number, baseline: number = 0) => {
    if (value > baseline) return <TrendingUp className="w-3 h-3 text-green-600" />;
    if (value < baseline) return <TrendingDown className="w-3 h-3 text-red-600" />;
    return <Minus className="w-3 h-3 text-gray-600" />;
  };

  const getTrendText = (value: number, baseline: number = 0) => {
    if (value > baseline) return "text-green-600";
    if (value < baseline) return "text-red-600";
    return "text-gray-600";
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Entity Types Chart */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-secondary mb-4">Entity Types Distribution</h3>
        {entityData.length > 0 ? (
          <div className="space-y-3">
            {entityData.map(({ type, count, percentage }) => (
              <div key={type}>
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 ${getEntityColor(type)} rounded-full`}></div>
                    <span className="text-sm text-gray-600">{formatEntityType(type)}</span>
                  </div>
                  <span className="text-sm font-medium">{count.toLocaleString()}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                  <div 
                    className={`${getEntityColor(type)} h-2 rounded-full transition-all duration-300`}
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">No entities extracted yet</p>
            <p className="text-sm text-gray-400">Process some documents to see entity distribution</p>
          </div>
        )}
      </div>

      {/* Processing Performance */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-secondary mb-4">Processing Performance</h3>
        <div className="space-y-4">
          <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
            <div>
              <p className="text-sm font-medium text-secondary">Average Processing Time</p>
              <p className="text-xs text-gray-600">Per document</p>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-accent">
                {processingStats.avgProcessingTime > 0 
                  ? `${Math.round(processingStats.avgProcessingTime / 1000)}s` 
                  : 'N/A'
                }
              </p>
              <div className="flex items-center text-xs text-gray-600">
                {getTrendIcon(processingStats.avgProcessingTime, 50000)}
                <span className={getTrendText(processingStats.avgProcessingTime, 50000)}>
                  Baseline
                </span>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
            <div>
              <p className="text-sm font-medium text-secondary">Accuracy Rate</p>
              <p className="text-xs text-gray-600">Entity extraction</p>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-success">
                {processingStats.avgAccuracy > 0 
                  ? `${Math.round(processingStats.avgAccuracy * 100)}%` 
                  : 'N/A'
                }
              </p>
              <div className="flex items-center text-xs">
                {getTrendIcon(processingStats.avgAccuracy, 0.85)}
                <span className={getTrendText(processingStats.avgAccuracy, 0.85)}>
                  Target: 85%
                </span>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
            <div>
              <p className="text-sm font-medium text-secondary">Documents Queue</p>
              <p className="text-xs text-gray-600">Waiting for processing</p>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-warning">{processingStats.processingQueue}</p>
              <p className="text-xs text-gray-600">
                {processingStats.processingQueue === 0 ? 'All clear' : 'Processing...'}
              </p>
            </div>
          </div>

          <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
            <div>
              <p className="text-sm font-medium text-secondary">Total Documents</p>
              <p className="text-xs text-gray-600">All time</p>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-secondary">{processingStats.totalDocuments}</p>
              <p className="text-xs text-gray-600">Processed</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
