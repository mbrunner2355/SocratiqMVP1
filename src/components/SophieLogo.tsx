import { Brain } from "lucide-react";

export function SophieLogo({ size = "sm" }: { size?: "sm" | "md" | "lg" }) {
  const sizeClasses = {
    sm: "w-6 h-6",
    md: "w-8 h-8", 
    lg: "w-10 h-10"
  };
  
  const iconSizes = {
    sm: "w-3 h-3",
    md: "w-4 h-4",
    lg: "w-5 h-5"
  };

  return (
    <div className={`${sizeClasses[size]} rounded-lg flex items-center justify-center bg-gradient-to-br from-blue-600 to-indigo-600`}>
      <Brain className={`${iconSizes[size]} text-white`} />
    </div>
  );
}