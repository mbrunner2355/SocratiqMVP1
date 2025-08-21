import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Users, FileText, Shield } from "lucide-react";

export default function Analytics() {
  const stats = [
    { label: "Total Documents", value: "42", icon: FileText, color: "bg-blue-500" },
    { label: "Entities Extracted", value: "580", icon: Users, color: "bg-green-500" },
    { label: "Processing Queue", value: "3", icon: TrendingUp, color: "bg-orange-500" },
    { label: "Security Events", value: "12", icon: Shield, color: "bg-purple-500" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.label}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
              <Icon className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <Badge className={`${stat.color} text-white mt-2`} variant="secondary">
                Active
              </Badge>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}